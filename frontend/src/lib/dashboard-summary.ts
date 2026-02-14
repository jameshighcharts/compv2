import { z } from "zod";

import type { ChartPayload, KpiPayload } from "@/lib/contracts";

type DashboardSummarySource = {
  overview: KpiPayload;
  monthlySales: ChartPayload;
  yearlySales: ChartPayload;
};

const sparkPointSchema = z.object({
  month: z.number(),
});

const revenuePointSchema = z.object({
  month: z.string().min(1),
  revenue: z.number(),
});

const areaPointSchema = z.object({
  month: z.string().min(1),
  desktop: z.number(),
  mobile: z.number(),
});

const subscriptionsPointSchema = z.object({
  month: z.number(),
  desktop: z.number(),
  mobile: z.number(),
});

export const dashboardSummarySchema = z.object({
  updatedAt: z.string().datetime({ offset: true }),
  kpis: z.object({
    totalRevenue: z.number(),
    monthlyGrowthPct: z.number(),
    yearlyGrowthPct: z.number(),
    wonDeals: z.number(),
    avgDealSize: z.number(),
    currency: z.string().min(1),
  }),
  stats: z.object({
    newSubscriptions: z.number().int().nonnegative(),
    newSubscriptionsChangePct: z.number(),
    newOrders: z.number().int().nonnegative(),
    newOrdersChangePct: z.number(),
    avgOrderRevenue: z.number().nonnegative(),
    avgOrderRevenueChangePct: z.number(),
  }),
  sparkData: z.object({
    subscriptions: z.array(sparkPointSchema).min(1),
    orders: z.array(sparkPointSchema).min(1),
    avgOrderRevenue: z.array(sparkPointSchema).min(1),
  }),
  revenueLineData: z.array(revenuePointSchema).min(1),
  areaChartData: z.array(areaPointSchema).min(1),
  subscriptionsBarData: z.array(subscriptionsPointSchema).min(1),
});

export type DashboardSummary = z.infer<typeof dashboardSummarySchema>;

const sanitizeNumber = (value: unknown): number =>
  typeof value === "number" && Number.isFinite(value) ? value : 0;

const parseMonthLabel = (value: string): string => {
  const [year, month] = value.split("-");

  if (/^\d{4}$/.test(year ?? "") && /^\d{2}$/.test(month ?? "")) {
    const date = new Date(Date.UTC(Number(year), Number(month) - 1, 1));
    return date.toLocaleString("en-US", { month: "short" });
  }

  return value;
};

const getSeriesValues = (payload: ChartPayload, index: number): number[] => {
  const targetLength = payload.categories.length;
  const series = payload.series[index]?.data ?? [];

  return Array.from({ length: targetLength }, (_, seriesIndex) =>
    sanitizeNumber(series[seriesIndex]),
  );
};

const toSparkData = (values: number[], points: number = 8): Array<{ month: number }> =>
  values.slice(-points).map((value) => ({ month: Math.round(value) }));

export const buildDashboardSummary = ({
  overview,
  monthlySales,
  yearlySales,
}: DashboardSummarySource): DashboardSummary => {
  const monthlyPrimary = getSeriesValues(monthlySales, 0);
  const monthlySecondary = getSeriesValues(monthlySales, 1);
  const yearlyPrimary = getSeriesValues(yearlySales, 0);

  const monthlyTotal = monthlyPrimary.map(
    (value, index) => value + (monthlySecondary[index] ?? 0),
  );

  const latestTotalRevenue = monthlyTotal.at(-1) ?? 0;
  const estimatedOrders =
    overview.avgDealSize > 0 ? Math.round(latestTotalRevenue / overview.avgDealSize) : overview.wonDeals;

  const sparkSubscriptions = toSparkData(monthlyPrimary);
  const sparkOrders = toSparkData(monthlySecondary);
  const sparkAvgOrderRevenue = toSparkData(
    yearlyPrimary.length > 0 ? yearlyPrimary : monthlyTotal,
  );

  const lastEightCategories = monthlySales.categories.slice(-8);
  const lastEightTotals = monthlyTotal.slice(-8);

  const lastSixCategories = monthlySales.categories.slice(-6);
  const lastSixPrimary = monthlyPrimary.slice(-6);
  const lastSixSecondary = monthlySecondary.slice(-6);

  const lastTwelvePrimary = monthlyPrimary.slice(-12);
  const lastTwelveSecondary = monthlySecondary.slice(-12);

  const summary: DashboardSummary = {
    updatedAt: overview.asOf,
    kpis: {
      totalRevenue: overview.totalRevenue,
      monthlyGrowthPct: overview.monthlyGrowthPct,
      yearlyGrowthPct: overview.yearlyGrowthPct,
      wonDeals: overview.wonDeals,
      avgDealSize: overview.avgDealSize,
      currency: overview.currency,
    },
    stats: {
      newSubscriptions: Math.max(Math.round(overview.wonDeals), 0),
      newSubscriptionsChangePct: overview.monthlyGrowthPct,
      newOrders: Math.max(estimatedOrders, 0),
      newOrdersChangePct: overview.yearlyGrowthPct,
      avgOrderRevenue: Math.max(overview.avgDealSize, 0),
      avgOrderRevenueChangePct: overview.monthlyGrowthPct,
    },
    sparkData: {
      subscriptions: sparkSubscriptions,
      orders: sparkOrders,
      avgOrderRevenue: sparkAvgOrderRevenue,
    },
    revenueLineData: lastEightCategories.map((category, index) => ({
      month: parseMonthLabel(category),
      revenue: Math.round(lastEightTotals[index] ?? 0),
    })),
    areaChartData: lastSixCategories.map((category, index) => ({
      month: parseMonthLabel(category),
      desktop: Math.round(lastSixPrimary[index] ?? 0),
      mobile: Math.round(lastSixSecondary[index] ?? 0),
    })),
    subscriptionsBarData: lastTwelvePrimary.map((value, index) => ({
      month: index,
      desktop: Math.round(value),
      mobile: Math.round(lastTwelveSecondary[index] ?? 0),
    })),
  };

  return dashboardSummarySchema.parse(summary);
};

export const FALLBACK_DASHBOARD_SUMMARY: DashboardSummary = {
  updatedAt: "2026-02-14T12:00:00.000Z",
  kpis: {
    totalRevenue: 15_231.89,
    monthlyGrowthPct: 20.1,
    yearlyGrowthPct: 10.8,
    wonDeals: 4_682,
    avgDealSize: 1_080,
    currency: "USD",
  },
  stats: {
    newSubscriptions: 4_682,
    newSubscriptionsChangePct: 15.54,
    newOrders: 1_226,
    newOrdersChangePct: -40.2,
    avgOrderRevenue: 1_080,
    avgOrderRevenueChangePct: 10.8,
  },
  sparkData: {
    subscriptions: [
      { month: 40 },
      { month: 55 },
      { month: 45 },
      { month: 60 },
      { month: 50 },
      { month: 70 },
      { month: 65 },
      { month: 80 },
    ],
    orders: [
      { month: 30 },
      { month: 50 },
      { month: 40 },
      { month: 55 },
      { month: 35 },
      { month: 60 },
      { month: 45 },
      { month: 50 },
    ],
    avgOrderRevenue: [
      { month: 20 },
      { month: 35 },
      { month: 30 },
      { month: 50 },
      { month: 45 },
      { month: 55 },
      { month: 60 },
      { month: 70 },
    ],
  },
  revenueLineData: [
    { month: "Jan", revenue: 3_200 },
    { month: "Feb", revenue: 4_100 },
    { month: "Mar", revenue: 3_800 },
    { month: "Apr", revenue: 5_200 },
    { month: "May", revenue: 4_800 },
    { month: "Jun", revenue: 6_100 },
    { month: "Jul", revenue: 5_500 },
    { month: "Aug", revenue: 7_200 },
  ],
  areaChartData: [
    { month: "Jan", desktop: 186, mobile: 80 },
    { month: "Feb", desktop: 305, mobile: 200 },
    { month: "Mar", desktop: 237, mobile: 120 },
    { month: "Apr", desktop: 73, mobile: 190 },
    { month: "May", desktop: 209, mobile: 130 },
    { month: "Jun", desktop: 214, mobile: 140 },
  ],
  subscriptionsBarData: [
    { month: 0, desktop: 45, mobile: 30 },
    { month: 1, desktop: 65, mobile: 55 },
    { month: 2, desktop: 35, mobile: 40 },
    { month: 3, desktop: 80, mobile: 60 },
    { month: 4, desktop: 50, mobile: 70 },
    { month: 5, desktop: 90, mobile: 45 },
    { month: 6, desktop: 40, mobile: 85 },
    { month: 7, desktop: 70, mobile: 50 },
    { month: 8, desktop: 55, mobile: 65 },
    { month: 9, desktop: 75, mobile: 35 },
    { month: 10, desktop: 60, mobile: 80 },
    { month: 11, desktop: 85, mobile: 55 },
  ],
};
