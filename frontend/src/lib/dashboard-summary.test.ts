import { describe, expect, it } from "vitest";

import type { ChartPayload, KpiPayload } from "@/lib/contracts";
import {
  FALLBACK_DASHBOARD_SUMMARY,
  buildDashboardSummary,
  dashboardSummarySchema,
} from "@/lib/dashboard-summary";

const overview: KpiPayload = {
  totalRevenue: 1_200_000,
  monthlyGrowthPct: 6.5,
  yearlyGrowthPct: 14.2,
  wonDeals: 220,
  avgDealSize: 4_000,
  asOf: "2026-02-14T12:00:00Z",
  currency: "USD",
};

const monthlySales: ChartPayload = {
  categories: ["2025-07", "2025-08", "2025-09", "2025-10", "2025-11", "2025-12", "2026-01", "2026-02"],
  series: [
    { name: "Direct", data: [10_000, 12_000, 11_000, 14_000, 15_000, 18_000, 20_000, 22_000] },
    { name: "Partner", data: [6_000, 6_500, 7_000, 7_500, 8_000, 8_500, 9_500, 10_000] },
  ],
  meta: {
    asOf: "2026-02-14T12:00:00Z",
    currency: "USD",
    source: "dashboard/sales/monthly.json",
  },
};

const yearlySales: ChartPayload = {
  categories: ["2023", "2024", "2025", "2026"],
  series: [{ name: "Revenue", data: [150_000, 200_000, 260_000, 310_000] }],
  meta: {
    asOf: "2026-02-14T12:00:00Z",
    currency: "USD",
    source: "dashboard/sales/yearly.json",
  },
};

describe("buildDashboardSummary", () => {
  it("builds and validates summary payload", () => {
    const result = buildDashboardSummary({
      overview,
      monthlySales,
      yearlySales,
    });

    expect(result.updatedAt).toBe("2026-02-14T12:00:00Z");
    expect(result.kpis.totalRevenue).toBe(1_200_000);
    expect(result.sparkData.subscriptions).toHaveLength(8);
    expect(result.revenueLineData.at(-1)?.revenue).toBe(32_000);
    expect(result.areaChartData).toHaveLength(6);
    expect(result.subscriptionsBarData).toHaveLength(8);
  });

  it("keeps fallback summary schema-valid", () => {
    const parsed = dashboardSummarySchema.safeParse(FALLBACK_DASHBOARD_SUMMARY);

    expect(parsed.success).toBe(true);
  });
});
