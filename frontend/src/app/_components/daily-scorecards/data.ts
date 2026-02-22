// ─── Types ────────────────────────────────────────────────────────────────────

export type Country = "All Countries" | "United States" | "United Kingdom" | "Germany" | "France" | "Australia";

export type PeriodKpis = {
  revenueMtd: number;
  revenueYtd: number;
  avgOrderValue: number;
  forecastMonthly: number;
  revenuePerDay: number;
  revenuePerWeek: number;
  revenuePerQuarter: number;
  yoyPct: number;
};

export type TargetBenchmark = {
  name: string;
  amount: number;
  revenueLeft: number;
  pctReached: number;
  pctOnTrack: number;
};

export type SegmentRow = {
  month: string;
  low: number;
  medium: number;
  high: number;
  enterprise: number;
};

export type MetricRow = {
  metric: string;
  mtd: string;
  ytd: string;
  yoyChange: string;
  pctOfTotal: string;
};

export type FullSummaryRow = {
  segment: string;
  segmentKey: "low" | "medium" | "high" | "enterprise" | "total";
  range: string;
  revenue: string;
  revenuePct: number;
  revenuePctLabel: string;
  revenueYoyPct: number;
  orders: number;
  ordersPct: number;
  ordersPctLabel: string;
  ordersYoyPct: number;
  avgValue: string;
};

// ─── Countries ────────────────────────────────────────────────────────────────

export const COUNTRIES: Country[] = [
  "All Countries",
  "United States",
  "United Kingdom",
  "Germany",
  "France",
  "Australia",
];

// ─── KPIs ─────────────────────────────────────────────────────────────────────

export const mtdKpis: PeriodKpis = {
  revenueMtd: 482_300,
  revenueYtd: 1_204_750,
  avgOrderValue: 3_840,
  forecastMonthly: 720_000,
  revenuePerDay: 24_115,
  revenuePerWeek: 120_575,
  revenuePerQuarter: 1_446_900,
  yoyPct: 18.4,
};

export const ytdKpis: PeriodKpis = {
  revenueMtd: 1_204_750,
  revenueYtd: 1_204_750,
  avgOrderValue: 4_120,
  forecastMonthly: 8_640_000,
  revenuePerDay: 19_754,
  revenuePerWeek: 138_278,
  revenuePerQuarter: 1_204_750,
  yoyPct: 22.1,
};

// ─── Target Benchmarks ────────────────────────────────────────────────────────

export const TARGET_BENCHMARKS: TargetBenchmark[] = [
  {
    name: "Beat Last Year",
    amount: 620_000,
    revenueLeft: 137_700,
    pctReached: 77.8,
    pctOnTrack: 83.2,
  },
  {
    name: "Budget",
    amount: 720_000,
    revenueLeft: 237_700,
    pctReached: 67.0,
    pctOnTrack: 71.4,
  },
  {
    name: "Bubbles!",
    amount: 900_000,
    revenueLeft: 417_700,
    pctReached: 53.6,
    pctOnTrack: 57.1,
  },
];

// YTD versions of the above benchmarks (annual goals, actual = $1.204M YTD through Feb 20)
export const YTD_TARGET_BENCHMARKS: TargetBenchmark[] = [
  {
    name: "Beat Last Year",
    amount: 6_200_000,
    revenueLeft: 4_995_250,
    pctReached: 19.4,
    pctOnTrack: 138.9,
  },
  {
    name: "Budget",
    amount: 7_200_000,
    revenueLeft: 5_995_250,
    pctReached: 16.7,
    pctOnTrack: 119.5,
  },
  {
    name: "Bubbles!",
    amount: 9_000_000,
    revenueLeft: 7_795_250,
    pctReached: 13.4,
    pctOnTrack: 95.9,
  },
];

// ─── Revenue vs Targets Chart Data ────────────────────────────────────────────

export const DAILY_REVENUE_DAYS = Array.from({ length: 20 }, (_, i) => `Feb ${i + 1}`);

// Cumulative actual revenue (Feb 1–20)
export const DAILY_ACTUAL = [
  24_000, 49_200, 75_800, 102_100, 129_600,
  158_400, 185_200, 213_800, 242_500, 271_900,
  302_100, 331_400, 362_000, 390_800, 418_300,
  437_900, 453_200, 462_800, 472_400, 482_300,
];

function linearPace(target: number): number[] {
  const daysInMonth = 28; // Feb
  return DAILY_REVENUE_DAYS.map((_, i) => Math.round((target / daysInMonth) * (i + 1)));
}

export const PACE_BEAT_LAST_YEAR = linearPace(620_000);
export const PACE_BUDGET = linearPace(720_000);
export const PACE_BUBBLES = linearPace(900_000);

// ─── Orders & Customers KPIs ──────────────────────────────────────────────────

export const ordersCustomersKpis = {
  ordersMtd: 125,
  ordersYtd: 292,
  ordersYoy: "+14.7%",
  magentoOrdersMtd: 78,
  wooOrdersMtd: 47,
  customersMtd: 98,
  customersYtd: 231,
  customersYoy: "+11.2%",
};

// ─── YoY Comparison (12 months) ───────────────────────────────────────────────

export const YOY_MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// Future months (Mar–Dec for this year) are null to avoid misleading zero columns
export const YOY_REVENUE_THIS_YEAR: (number | null)[] = [
  722_400, 482_300, null, null, null, null, null, null, null, null, null, null,
];
export const YOY_REVENUE_LAST_YEAR: (number | null)[] = [
  609_800, 406_500, 531_200, 489_700, 612_300, 598_400, 641_200, 703_500, 677_800, 724_100, 812_300, 954_600,
];

export const YOY_ORDERS_THIS_YEAR: (number | null)[] = [
  167, 125, null, null, null, null, null, null, null, null, null, null,
];
export const YOY_ORDERS_LAST_YEAR: (number | null)[] = [
  145, 109, 138, 127, 152, 148, 161, 174, 163, 178, 196, 228,
];

// ─── Channel Split ────────────────────────────────────────────────────────────

export const CHANNEL_SPLIT_MTD = { direct: 298_000, channel: 184_300 };
export const CHANNEL_SPLIT_YTD = { direct: 742_000, channel: 462_750 };

// ─── Customer Channel Revenue Waterfall ───────────────────────────────────────
// Each array sums to the period total (MTD = $482,300 · YTD = $1,204,750)

export const CHANNEL_WATERFALL_MTD = [
  { name: "Direct Sales",     y: 185_400 },
  { name: "Channel Partners", y: 112_900 },
  { name: "Online",           y: 87_200  },
  { name: "ADV-S",            y: 61_100  },
  { name: "ADV+",             y: 35_700  },
] as const;

export const CHANNEL_WATERFALL_YTD = [
  { name: "Direct Sales",     y: 462_000 },
  { name: "Channel Partners", y: 280_750 },
  { name: "Online",           y: 218_500 },
  { name: "ADV-S",            y: 152_300 },
  { name: "ADV+",             y: 91_200  },
] as const;

// ─── Sales YoY Bar Charts (2025 current · 2024 prior) ────────────────────────

// MTD: weekly buckets within Feb (derived from TREND_BY_DAY_VALUES)
export const MTD_BAR_LABELS = ["Feb 1–7", "Feb 8–14", "Feb 15–20"];
export const MTD_BAR_2025   = [185_200, 205_600, 91_500];
export const MTD_BAR_2024   = [102_400, 113_800, 88_600];

// YTD: full-year monthly — reuse YOY_REVENUE_THIS_YEAR / YOY_REVENUE_LAST_YEAR
// (null entries in THIS_YEAR for Mar-Dec = no bar rendered for future months)

// ─── Value Segment (stacked column, 12 months) ────────────────────────────────

export const SEGMENT_DATA: SegmentRow[] = [
  { month: "Jan", low: 42_000, medium: 128_000, high: 312_000, enterprise: 240_400 },
  { month: "Feb", low: 28_300, medium: 96_400, high: 218_600, enterprise: 139_000 },
  { month: "Mar", low: 38_100, medium: 115_200, high: 267_900, enterprise: 110_000 },
  { month: "Apr", low: 33_600, medium: 108_700, high: 241_400, enterprise: 106_000 },
  { month: "May", low: 47_200, medium: 142_100, high: 298_700, enterprise: 124_300 },
  { month: "Jun", low: 44_900, medium: 137_400, high: 284_100, enterprise: 132_000 },
  { month: "Jul", low: 51_300, medium: 148_600, high: 308_400, enterprise: 132_900 },
  { month: "Aug", low: 58_200, medium: 163_800, high: 342_100, enterprise: 139_400 },
  { month: "Sep", low: 52_700, medium: 156_300, high: 326_800, enterprise: 142_000 },
  { month: "Oct", low: 61_400, medium: 172_200, high: 358_600, enterprise: 131_900 },
  { month: "Nov", low: 72_100, medium: 198_600, high: 402_900, enterprise: 138_700 },
  { month: "Dec", low: 89_300, medium: 241_400, high: 487_200, enterprise: 136_700 },
];

// ─── Revenue Trend ────────────────────────────────────────────────────────────

export const TREND_BY_DAY_LABELS = Array.from({ length: 20 }, (_, i) => `Feb ${i + 1}`);
export const TREND_BY_DAY_VALUES = [
  24_000, 25_200, 26_600, 26_300, 27_500,
  28_800, 26_800, 28_600, 28_700, 29_400,
  30_200, 29_300, 30_600, 28_800, 27_500,
  19_600, 15_300, 9_600, 9_600, 9_900,
];

export const TREND_BY_WEEK_LABELS = ["W44", "W45", "W46", "W47", "W48", "W49", "W50", "W51"];
export const TREND_BY_WEEK_VALUES = [112_400, 128_600, 134_200, 119_800, 143_600, 152_100, 138_900, 116_300];

export const TREND_BY_QUARTER_LABELS = ["Q1 2024", "Q2 2024", "Q3 2024", "Q4 2024", "Q1 2025"];
export const TREND_BY_QUARTER_VALUES = [1_832_400, 1_700_400, 2_022_500, 2_490_000, 1_204_750];

// ─── Pipeline Summary ─────────────────────────────────────────────────────────

export const PIPELINE_SUMMARY = {
  opportunitiesCount: 284,
  avgDaysToClose: 38,
  totalPipelineValue: 4_820_000,
  weightedPipeline: 2_390_000,
};

// ─── Detailed Revenue Metrics (Grid) ─────────────────────────────────────────

export const DETAILED_METRICS: MetricRow[] = [
  { metric: "New Business Revenue",    mtd: "$198,400",  ytd: "$512,300",   yoyChange: "+21.3%", pctOfTotal: "41.1%" },
  { metric: "Renewal Revenue",         mtd: "$142,600",  ytd: "$368,900",   yoyChange: "+14.8%", pctOfTotal: "29.6%" },
  { metric: "Expansion Revenue",       mtd: "$89,300",   ytd: "$218,600",   yoyChange: "+31.2%", pctOfTotal: "18.5%" },
  { metric: "Professional Services",   mtd: "$32,100",   ytd: "$72,400",    yoyChange: "+8.4%",  pctOfTotal: "6.7%" },
  { metric: "Partner-Sourced Revenue", mtd: "$19,900",   ytd: "$32_550",    yoyChange: "-4.2%",  pctOfTotal: "4.1%" },
  { metric: "Direct Sales",            mtd: "$298,000",  ytd: "$742,000",   yoyChange: "+19.6%", pctOfTotal: "61.7%" },
  { metric: "Channel Partner Sales",   mtd: "$184,300",  ytd: "$462,750",   yoyChange: "+16.2%", pctOfTotal: "38.3%" },
  { metric: "Enterprise Segment",      mtd: "$139,000",  ytd: "$381,200",   yoyChange: "+25.7%", pctOfTotal: "28.8%" },
  { metric: "Mid-Market Segment",      mtd: "$218,600",  ytd: "$546,800",   yoyChange: "+17.4%", pctOfTotal: "45.3%" },
  { metric: "SMB Segment",             mtd: "$124,700",  ytd: "$276,750",   yoyChange: "+9.1%",  pctOfTotal: "25.9%" },
];

// ─── Full Summary Table (Grid) ───────────────────────────────────────────────

export const FULL_SUMMARY_ROWS: FullSummaryRow[] = [
  {
    segment: "Low",
    segmentKey: "low",
    range: "< $2K",
    revenue: "$374.4K",
    revenuePct: 22.1,
    revenuePctLabel: "22.1%",
    revenueYoyPct: -2,
    orders: 616,
    ordersPct: 84.3,
    ordersPctLabel: "84.3%",
    ordersYoyPct: 0.2,
    avgValue: "$608",
  },
  {
    segment: "Medium",
    segmentKey: "medium",
    range: "$2K-$15K",
    revenue: "$427.6K",
    revenuePct: 25.3,
    revenuePctLabel: "25.3%",
    revenueYoyPct: -18.6,
    orders: 95,
    ordersPct: 13,
    ordersPctLabel: "13%",
    ordersYoyPct: 12.9,
    avgValue: "$4.5K",
  },
  {
    segment: "High",
    segmentKey: "high",
    range: "$15K-$50K",
    revenue: "$421.7K",
    revenuePct: 24.9,
    revenuePctLabel: "24.9%",
    revenueYoyPct: 28,
    orders: 16,
    ordersPct: 2.2,
    ordersPctLabel: "2.2%",
    ordersYoyPct: 23.1,
    avgValue: "$26.4K",
  },
  {
    segment: "Enterprise",
    segmentKey: "enterprise",
    range: "> $50K",
    revenue: "$461.1K",
    revenuePct: 27.2,
    revenuePctLabel: "27.2%",
    revenueYoyPct: -26.3,
    orders: 9,
    ordersPct: 0.7,
    ordersPctLabel: "0.7%",
    ordersYoyPct: 0.5,
    avgValue: "$51.2K",
  },
  {
    segment: "Grand Total",
    segmentKey: "total",
    range: "",
    revenue: "$1684.8K",
    revenuePct: 100,
    revenuePctLabel: "100%",
    revenueYoyPct: -18.4,
    orders: 736,
    ordersPct: 100,
    ordersPctLabel: "100%",
    ordersYoyPct: -1.9,
    avgValue: "$2.3K",
  },
];
