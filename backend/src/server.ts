import cors from "cors";
import express, { type NextFunction, type Request, type Response } from "express";
import helmet from "helmet";

import {
  DASHBOARD_S3_KEYS,
  getMonthlySales,
  getOverviewKpis,
  getRevenueStreams,
  getYearlySales,
} from "./dashboard-data.js";
import { DataSourceError } from "./s3.js";

const PORT = Number(process.env.PORT ?? 4000);
const INTERNAL_API_KEY = process.env.INTERNAL_API_KEY ?? "";
const REVALIDATE_SECONDS = 14_400;
const STALE_GRACE_MS = 30 * 60 * 1000;

const isTimestampStale = (asOf: string): boolean => {
  const timestamp = Date.parse(asOf);

  if (Number.isNaN(timestamp)) {
    return true;
  }

  return Date.now() - timestamp > REVALIDATE_SECONDS * 1000 + STALE_GRACE_MS;
};

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.get("/health", (_request, response) => {
  response.json({ status: "ok", service: "sales-dashboard-backend" });
});

app.use("/api", (request: Request, response: Response, next: NextFunction) => {
  if (!INTERNAL_API_KEY) {
    response.status(500).json({
      error: {
        code: "BACKEND_MISCONFIGURED",
        message: "INTERNAL_API_KEY is not configured.",
      },
    });
    return;
  }

  const providedKey = request.header("x-internal-api-key") ?? "";

  if (!providedKey || providedKey !== INTERNAL_API_KEY) {
    response.status(401).json({
      error: {
        code: "UNAUTHORIZED_INTERNAL_CALL",
        message: "Missing or invalid internal API key.",
      },
    });
    return;
  }

  next();
});

type RouteHandlerOptions<T> = {
  route: string;
  source: string;
  load: () => Promise<T>;
  pickAsOf: (payload: T) => string;
};

const handleDataRoute =
  <T>({ route, source, load, pickAsOf }: RouteHandlerOptions<T>) =>
  async (request: Request, response: Response) => {
    const requestId =
      request.header("x-request-id") ?? request.header("x-vercel-id") ?? crypto.randomUUID();
    const start = Date.now();

    try {
      const payload = await load();
      const asOf = pickAsOf(payload);

      if (isTimestampStale(asOf)) {
        console.warn(
          JSON.stringify({
            event: "stale_data",
            route,
            source,
            requestId,
            asOf,
          }),
        );
      }

      console.info(
        JSON.stringify({
          event: "backend_api_success",
          route,
          source,
          requestId,
          latencyMs: Date.now() - start,
        }),
      );

      response.setHeader("Cache-Control", "no-store");
      response.status(200).json(payload);
    } catch (error) {
      if (error instanceof DataSourceError) {
        console.error(
          JSON.stringify({
            event: "backend_source_error",
            route,
            source,
            requestId,
            latencyMs: Date.now() - start,
            status: error.status,
            code: error.code,
            message: error.message,
          }),
        );

        response.status(error.status).json({
          error: {
            code: error.status === 500 ? "MALFORMED_SOURCE_DATA" : "DATA_SOURCE_UNAVAILABLE",
            message: error.message,
            requestId,
            timestamp: new Date().toISOString(),
          },
        });
        return;
      }

      console.error(
        JSON.stringify({
          event: "backend_unexpected_error",
          route,
          source,
          requestId,
          latencyMs: Date.now() - start,
          message: error instanceof Error ? error.message : "Unknown error",
        }),
      );

      response.status(503).json({
        error: {
          code: "DATA_SOURCE_UNAVAILABLE",
          message: "Unable to load data.",
          requestId,
          timestamp: new Date().toISOString(),
        },
      });
    }
  };

app.get(
  "/api/overview/kpis",
  handleDataRoute({
    route: "/api/overview/kpis",
    source: DASHBOARD_S3_KEYS.overviewKpis,
    load: getOverviewKpis,
    pickAsOf: (payload) => payload.asOf,
  }),
);

app.get(
  "/api/sales/monthly",
  handleDataRoute({
    route: "/api/sales/monthly",
    source: DASHBOARD_S3_KEYS.monthlySales,
    load: getMonthlySales,
    pickAsOf: (payload) => payload.meta.asOf,
  }),
);

app.get(
  "/api/sales/yearly",
  handleDataRoute({
    route: "/api/sales/yearly",
    source: DASHBOARD_S3_KEYS.yearlySales,
    load: getYearlySales,
    pickAsOf: (payload) => payload.meta.asOf,
  }),
);

app.get(
  "/api/revenue-streams",
  handleDataRoute({
    route: "/api/revenue-streams",
    source: DASHBOARD_S3_KEYS.revenueStreams,
    load: getRevenueStreams,
    pickAsOf: (payload) => payload.meta.asOf,
  }),
);

app.listen(PORT, () => {
  console.info(
    JSON.stringify({
      event: "backend_started",
      service: "sales-dashboard-backend",
      port: PORT,
    }),
  );
});
