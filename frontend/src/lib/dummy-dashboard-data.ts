import { readFile } from "node:fs/promises";
import path from "node:path";

import { z } from "zod";

import {
  chartSeriesSchema,
  chartPayloadSchema,
  kpiPayloadSchema,
  type ChartPayload,
  type KpiPayload,
} from "@/lib/contracts";

const DUMMY_DATA_DIR = path.resolve(process.cwd(), "..", "dummy data");

const monthlySalesDummySchema = z.object({
  categories: z.array(z.string().min(1)).min(1),
  series: z.array(chartSeriesSchema).min(1),
  updatedAt: z.string().datetime({ offset: true }),
});

const yearlySalesDummySchema = z.object({
  categories: z.array(z.string().min(1)).min(1),
  series: z.array(chartSeriesSchema).min(1),
  updatedAt: z.string().datetime({ offset: true }),
});

const overviewKpisDummySchema = z.object({
  totalRevenue: z.number(),
  totalOrders: z.number().int().nonnegative(),
  yoyGrowth: z.number(),
  momGrowth: z.number(),
  avgOrderValue: z.number(),
  updatedAt: z.string().datetime({ offset: true }),
});

const readDummyJson = async <T>(
  fileName: string,
  schema: z.ZodType<T>,
): Promise<T> => {
  const fullPath = path.join(DUMMY_DATA_DIR, fileName);
  const content = await readFile(fullPath, "utf8");
  const parsed = JSON.parse(content) as unknown;
  return schema.parse(parsed);
};

const toChartPayload = (
  sourceFileName: string,
  payload: z.infer<typeof monthlySalesDummySchema> | z.infer<typeof yearlySalesDummySchema>,
): ChartPayload =>
  chartPayloadSchema.parse({
    categories: payload.categories,
    series: payload.series,
    meta: {
      asOf: payload.updatedAt,
      currency: "USD",
      source: sourceFileName,
    },
  });

const toKpiPayload = (
  payload: z.infer<typeof overviewKpisDummySchema>,
): KpiPayload =>
  kpiPayloadSchema.parse({
    totalRevenue: payload.totalRevenue,
    monthlyGrowthPct: payload.momGrowth,
    yearlyGrowthPct: payload.yoyGrowth,
    wonDeals: payload.totalOrders,
    avgDealSize: payload.avgOrderValue,
    asOf: payload.updatedAt,
    currency: "USD",
  });

export const loadDummyDashboardData = async (): Promise<{
  overview: KpiPayload;
  monthlySales: ChartPayload;
  yearlySales: ChartPayload;
}> => {
  const [overviewDummy, monthlyDummy, yearlyDummy] = await Promise.all([
    readDummyJson("overview_kpis.json", overviewKpisDummySchema),
    readDummyJson("monthly_sales.json", monthlySalesDummySchema),
    readDummyJson("yearly_sales.json", yearlySalesDummySchema),
  ]);

  return {
    overview: toKpiPayload(overviewDummy),
    monthlySales: toChartPayload("dummy data/monthly_sales.json", monthlyDummy),
    yearlySales: toChartPayload("dummy data/yearly_sales.json", yearlyDummy),
  };
};
