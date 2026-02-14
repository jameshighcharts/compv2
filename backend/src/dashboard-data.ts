import {
  chartPayloadSchema,
  kpiPayloadSchema,
  type ChartPayload,
  type KpiPayload,
} from "./contracts.js";
import { readJsonFromS3 } from "./s3.js";

export const DASHBOARD_S3_KEYS = {
  overviewKpis: "dashboard/overview/kpis.json",
  monthlySales: "dashboard/sales/monthly.json",
  yearlySales: "dashboard/sales/yearly.json",
  revenueStreams: "dashboard/revenue-streams.json",
} as const;

export const getOverviewKpis = async (): Promise<KpiPayload> =>
  readJsonFromS3(DASHBOARD_S3_KEYS.overviewKpis, kpiPayloadSchema);

export const getMonthlySales = async (): Promise<ChartPayload> =>
  readJsonFromS3(DASHBOARD_S3_KEYS.monthlySales, chartPayloadSchema);

export const getYearlySales = async (): Promise<ChartPayload> =>
  readJsonFromS3(DASHBOARD_S3_KEYS.yearlySales, chartPayloadSchema);

export const getRevenueStreams = async (): Promise<ChartPayload> =>
  readJsonFromS3(DASHBOARD_S3_KEYS.revenueStreams, chartPayloadSchema);
