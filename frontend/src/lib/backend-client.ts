import { ZodError, type ZodType } from "zod";

const REVALIDATE_SECONDS = 14_400;

type BackendProxyErrorCode =
  | "backend_unavailable"
  | "backend_malformed_response"
  | "backend_invalid_payload"
  | "backend_request_failed";

export class BackendProxyError extends Error {
  public readonly status: 500 | 503;

  public readonly code: BackendProxyErrorCode;

  public readonly endpoint: string;

  constructor({
    message,
    status,
    code,
    endpoint,
    cause,
  }: {
    message: string;
    status: 500 | 503;
    code: BackendProxyErrorCode;
    endpoint: string;
    cause?: unknown;
  }) {
    super(message, { cause });
    this.name = "BackendProxyError";
    this.status = status;
    this.code = code;
    this.endpoint = endpoint;
  }
}

const getBackendConfig = (): { baseUrl: string; internalApiKey: string } => {
  const baseUrl = process.env.BACKEND_BASE_URL?.trim();
  const internalApiKey = process.env.INTERNAL_API_KEY?.trim();

  if (!baseUrl) {
    throw new BackendProxyError({
      status: 503,
      code: "backend_unavailable",
      endpoint: "unknown",
      message: "BACKEND_BASE_URL is not configured.",
    });
  }

  if (!internalApiKey) {
    throw new BackendProxyError({
      status: 503,
      code: "backend_unavailable",
      endpoint: "unknown",
      message: "INTERNAL_API_KEY is not configured.",
    });
  }

  return {
    baseUrl: baseUrl.replace(/\/$/, ""),
    internalApiKey,
  };
};

export const fetchBackendJson = async <T>(
  endpoint: string,
  schema: ZodType<T>,
): Promise<T> => {
  const { baseUrl, internalApiKey } = getBackendConfig();
  const url = `${baseUrl}${endpoint}`;

  let response: Response;
  try {
    response = await fetch(url, {
      method: "GET",
      headers: {
        "x-internal-api-key": internalApiKey,
        Accept: "application/json",
      },
      next: { revalidate: REVALIDATE_SECONDS },
    });
  } catch (error) {
    throw new BackendProxyError({
      status: 503,
      code: "backend_unavailable",
      endpoint,
      message: "Unable to reach backend service.",
      cause: error,
    });
  }

  let parsed: unknown;
  try {
    parsed = await response.json();
  } catch (error) {
    throw new BackendProxyError({
      status: 500,
      code: "backend_malformed_response",
      endpoint,
      message: "Backend returned non-JSON payload.",
      cause: error,
    });
  }

  if (!response.ok) {
    const message =
      typeof parsed === "object" &&
      parsed !== null &&
      "error" in parsed &&
      typeof (parsed as { error?: { message?: unknown } }).error?.message === "string"
        ? ((parsed as { error: { message: string } }).error.message as string)
        : "Backend request failed.";

    throw new BackendProxyError({
      status: response.status === 500 ? 500 : 503,
      code: "backend_request_failed",
      endpoint,
      message,
    });
  }

  try {
    return schema.parse(parsed);
  } catch (error) {
    if (error instanceof ZodError) {
      throw new BackendProxyError({
        status: 500,
        code: "backend_invalid_payload",
        endpoint,
        message: "Backend payload does not match expected schema.",
        cause: error,
      });
    }

    throw error;
  }
};
