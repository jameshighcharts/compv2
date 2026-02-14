import {
  GetObjectCommand,
  NoSuchKey,
  S3Client,
  S3ServiceException,
} from "@aws-sdk/client-s3";
import { ZodError, type ZodType } from "zod";

export type DataSourceErrorCode =
  | "missing_object"
  | "s3_unavailable"
  | "malformed_json"
  | "invalid_payload"
  | "missing_body";

export class DataSourceError extends Error {
  public readonly status: 500 | 503;

  public readonly code: DataSourceErrorCode;

  public readonly key: string;

  constructor({
    message,
    status,
    code,
    key,
    cause,
  }: {
    message: string;
    status: 500 | 503;
    code: DataSourceErrorCode;
    key: string;
    cause?: unknown;
  }) {
    super(message, { cause });
    this.name = "DataSourceError";
    this.status = status;
    this.code = code;
    this.key = key;
  }
}

const getS3Config = (): { bucket: string; region: string } => {
  const bucket = process.env.S3_BUCKET;
  const region = process.env.AWS_REGION;

  if (!bucket) {
    throw new Error("Missing S3_BUCKET environment variable.");
  }

  if (!region) {
    throw new Error("Missing AWS_REGION environment variable.");
  }

  return { bucket, region };
};

let cachedClient: S3Client | null = null;
let cachedRegion: string | null = null;

const getS3Client = (region: string): S3Client => {
  if (!cachedClient || cachedRegion !== region) {
    cachedClient = new S3Client({ region });
    cachedRegion = region;
  }

  return cachedClient;
};

export const readJsonFromS3 = async <T>(key: string, schema: ZodType<T>): Promise<T> => {
  const { bucket, region } = getS3Config();
  const s3Client = getS3Client(region);

  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: key,
  });

  try {
    const response = await s3Client.send(command);

    if (!response.Body) {
      throw new DataSourceError({
        status: 503,
        code: "missing_body",
        key,
        message: "S3 object has no body.",
      });
    }

    const body = await response.Body.transformToString();

    let parsed: unknown;
    try {
      parsed = JSON.parse(body);
    } catch (error) {
      throw new DataSourceError({
        status: 500,
        code: "malformed_json",
        key,
        message: "S3 object is not valid JSON.",
        cause: error,
      });
    }

    try {
      return schema.parse(parsed);
    } catch (error) {
      if (error instanceof ZodError) {
        throw new DataSourceError({
          status: 500,
          code: "invalid_payload",
          key,
          message: "S3 JSON does not match the required schema.",
          cause: error,
        });
      }

      throw error;
    }
  } catch (error) {
    if (error instanceof DataSourceError) {
      throw error;
    }

    if (error instanceof NoSuchKey) {
      throw new DataSourceError({
        status: 503,
        code: "missing_object",
        key,
        message: "S3 object does not exist.",
        cause: error,
      });
    }

    if (error instanceof S3ServiceException) {
      const missingFromStatus = error.$metadata.httpStatusCode === 404;

      throw new DataSourceError({
        status: 503,
        code: missingFromStatus ? "missing_object" : "s3_unavailable",
        key,
        message: missingFromStatus ? "S3 object does not exist." : "S3 service unavailable.",
        cause: error,
      });
    }

    throw new DataSourceError({
      status: 503,
      code: "s3_unavailable",
      key,
      message: "Unable to read data from S3.",
      cause: error,
    });
  }
};
