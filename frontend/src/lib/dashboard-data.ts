import {
  chartPayloadSchema,
  kpiPayloadSchema,
  type ChartPayload,
  type KpiPayload,
} from "@/lib/contracts";
import { fetchBackendJson } from "@/lib/backend-client";

export const DASHBOARD_BACKEND_ENDPOINTS = {
  overviewKpis: "/api/overview/kpis",
  monthlySales: "/api/sales/monthly",
  yearlySales: "/api/sales/yearly",
} as const;

export const getOverviewKpis = async (): Promise<KpiPayload> =>
  fetchBackendJson(DASHBOARD_BACKEND_ENDPOINTS.overviewKpis, kpiPayloadSchema);

export const getMonthlySales = async (): Promise<ChartPayload> =>
  fetchBackendJson(DASHBOARD_BACKEND_ENDPOINTS.monthlySales, chartPayloadSchema);

export const getYearlySales = async (): Promise<ChartPayload> =>
  fetchBackendJson(DASHBOARD_BACKEND_ENDPOINTS.yearlySales, chartPayloadSchema);
