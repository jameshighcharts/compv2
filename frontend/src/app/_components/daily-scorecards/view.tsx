"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DashboardHighchart, chartColor, createBaseChartOptions } from "@/components/ui/highcharts";
import { HighchartsGridPro } from "@/components/ui/highcharts-grid-pro";

import {
  COUNTRIES,
  Country,
  DAILY_ACTUAL,
  DAILY_REVENUE_DAYS,
  DETAILED_METRICS,
  FULL_SUMMARY_ROWS,
  mtdKpis,
  ytdKpis,
  ordersCustomersKpis,
  PACE_BEAT_LAST_YEAR,
  PACE_BUDGET,
  PACE_BUBBLES,
  PIPELINE_SUMMARY,
  SEGMENT_DATA,
  TARGET_BENCHMARKS,
  YTD_TARGET_BENCHMARKS,
  TargetBenchmark,
  TREND_BY_DAY_LABELS,
  TREND_BY_DAY_VALUES,
  TREND_BY_QUARTER_LABELS,
  TREND_BY_QUARTER_VALUES,
  TREND_BY_WEEK_LABELS,
  TREND_BY_WEEK_VALUES,
  CHANNEL_SPLIT_MTD,
  CHANNEL_SPLIT_YTD,
  CHANNEL_WATERFALL_MTD,
  CHANNEL_WATERFALL_YTD,
  MTD_BAR_LABELS,
  MTD_BAR_2025,
  MTD_BAR_2024,
  YOY_MONTHS,
  YOY_ORDERS_LAST_YEAR,
  YOY_ORDERS_THIS_YEAR,
  YOY_REVENUE_LAST_YEAR,
  YOY_REVENUE_THIS_YEAR,
} from "./data";

// ─── Formatters ───────────────────────────────────────────────────────────────

function fmtCurrency(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `$${Math.round(n / 1_000)}K`;
  return `$${n.toLocaleString()}`;
}

function fmtPct(n: number, showPlus = true): string {
  return `${showPlus && n > 0 ? "+" : ""}${n.toFixed(1)}%`;
}

function fmtAbsPct(n: number): string {
  const abs = Math.abs(n);
  return Number.isInteger(abs) ? abs.toFixed(0) : abs.toFixed(1);
}

// ─── Shared UI helpers ────────────────────────────────────────────────────────

function TogglePills<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { label: string; value: T }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex items-center gap-0.5 rounded-md border border-border bg-muted p-0.5">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`rounded px-2.5 py-1 text-xs font-medium transition-colors ${
            value === opt.value
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

/** Coloured rule + title used to open each logical section */
function SectionHeader({ label, accent = "#8087E8" }: { label: string; accent?: string }) {
  return (
    <div className="flex items-center gap-3 pt-2">
      <div className="h-px flex-1 bg-border" />
      <span
        className="rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-wide whitespace-nowrap"
        style={{
          color: accent,
          borderColor: `${accent}55`,
          backgroundColor: `${accent}18`,
        }}
      >
        ● {label}
      </span>
      <div className="h-px flex-1 bg-border" />
    </div>
  );
}

/** Period badge pill shown in panel headers */
function PeriodBadge({ label, variant }: { label: string; variant: "mtd" | "ytd" }) {
  return (
    <span
      className={cn(
        "rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider",
        variant === "mtd"
          ? "border-[#8087E8]/30 bg-[#8087E8]/10 text-[#8087E8]"
          : "border-[#A3EDBA]/40 bg-[#A3EDBA]/10 text-emerald-600 dark:text-[#A3EDBA]",
      )}
    >
      {label}
    </span>
  );
}

// ─── Target Scorecards ────────────────────────────────────────────────────────

const SCORECARD_ACCENTS = ["#F7A85E", "#6DDFA0", "#9198F0"] as const;

function scorecardStatus(pctReached: number, daysElapsed: number, totalDays: number) {
  const pace = (daysElapsed / totalDays) * 100;
  const ratio = pctReached / pace;
  const diff = Math.round(Math.abs((1 - ratio) * 100));
  if (ratio >= 1.05) return { type: "ahead" as const, diff };
  if (ratio >= 0.92) return { type: "ontrack" as const, diff };
  return { type: "behind" as const, diff };
}

function ScorecardStatusBadge({ status }: { status: ReturnType<typeof scorecardStatus> }) {
  if (status.type === "ahead")
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
        ▲ +{status.diff}% ahead
      </span>
    );
  if (status.type === "ontrack")
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
        ✓ On track
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-1 text-xs font-semibold text-amber-600 dark:text-amber-400">
      ⚠ -{status.diff}% behind pace
    </span>
  );
}

function ScorecardHalf({
  periodLabel,
  benchmark,
  accent,
  daysElapsed,
  totalDays,
}: {
  periodLabel: string;
  benchmark: TargetBenchmark;
  accent: string;
  daysElapsed: number;
  totalDays: number;
}) {
  const status = scorecardStatus(benchmark.pctReached, daysElapsed, totalDays);
  const fillPct = Math.min(100, benchmark.pctReached);

  return (
    <div className="flex flex-1 flex-col gap-3 px-5 py-5">
      <p
        className="text-[11px] font-bold uppercase tracking-widest"
        style={{ color: `${accent}aa` }}
      >
        {periodLabel}
      </p>
      <div>
        <p className="text-[40px] font-bold leading-none tracking-tight">
          {benchmark.pctReached.toFixed(1)}
          <span className="text-xl font-semibold">%</span>
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          of {fmtCurrency(benchmark.amount)} target
        </p>
      </div>

      {/* Progress bar */}
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${fillPct}%`, backgroundColor: accent }}
        />
      </div>

      <p className="text-sm font-semibold" style={{ color: accent }}>
        -{fmtCurrency(benchmark.revenueLeft)} remaining
      </p>

      <ScorecardStatusBadge status={status} />
    </div>
  );
}

function TargetScorecard({
  title,
  accent,
  mtdBenchmark,
  ytdBenchmark,
}: {
  title: string;
  accent: string;
  mtdBenchmark: TargetBenchmark;
  ytdBenchmark: TargetBenchmark;
}) {
  return (
    <Card
      className="gap-0 overflow-hidden py-0"
      style={{ borderTopWidth: 3, borderTopColor: accent }}
    >
      {/* Card label */}
      <div className="flex items-center gap-2 px-5 pt-4 pb-1">
        <span
          className="rounded-full px-3 py-1 text-xs font-bold uppercase tracking-widest"
          style={{
            backgroundColor: `${accent}18`,
            color: accent,
            border: `1px solid ${accent}40`,
          }}
        >
          {title}
        </span>
      </div>

      {/* Two halves */}
      <div className="flex divide-x divide-border">
        <ScorecardHalf
          periodLabel="Month to Date"
          benchmark={mtdBenchmark}
          accent={accent}
          daysElapsed={20}
          totalDays={28}
        />
        <ScorecardHalf
          periodLabel="Year to Date"
          benchmark={ytdBenchmark}
          accent={accent}
          daysElapsed={51}
          totalDays={365}
        />
      </div>
    </Card>
  );
}

/** Compact stat inside a period panel */
function MiniStat({
  label,
  value,
  sub,
  positive,
}: {
  label: string;
  value: string;
  sub?: string;
  positive?: boolean;
}) {
  return (
    <div className="flex flex-col gap-0.5 rounded-lg bg-muted/60 px-4 py-3">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="text-2xl font-bold tracking-tight">{value}</p>
      {sub !== undefined && (
        <p className={cn("text-[11px] font-medium", positive === true ? "text-emerald-500" : positive === false ? "text-red-500" : "text-muted-foreground")}>
          {sub}
        </p>
      )}
    </div>
  );
}

/** Card that shows the same metric for both MTD and YTD side by side */
function DualStatCard({
  title,
  mtdValue,
  ytdValue,
  sub,
}: {
  title: string;
  mtdValue: string;
  ytdValue: string;
  sub?: string;
}) {
  return (
    <Card className="gap-0 py-0">
      <CardContent className="p-5">
        <p className="text-xs font-semibold text-muted-foreground">{title}</p>
        {sub && <p className="mt-0.5 text-[10px] text-muted-foreground">{sub}</p>}
        <div className="mt-3 flex items-end gap-5">
          <div>
            <p className="mb-1 text-[9px] font-bold uppercase tracking-wider text-[#8087E8]/70">MTD</p>
            <p className="text-xl font-bold">{mtdValue}</p>
          </div>
          <div className="mb-1 h-7 w-px bg-border" />
          <div>
            <p className="mb-1 text-[9px] font-bold uppercase tracking-wider text-emerald-600/70 dark:text-[#A3EDBA]/70">YTD</p>
            <p className="text-xl font-bold">{ytdValue}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Period panels (the big side-by-side MTD / YTD blocks) ───────────────────

function PeriodPanel({
  variant,
  kpis,
  date,
}: {
  variant: "mtd" | "ytd";
  kpis: typeof mtdKpis;
  date: string;
}) {
  const isMtd = variant === "mtd";
  const accentColor = isMtd ? "#8087E8" : "#A3EDBA";
  const label = isMtd ? "Month to Date" : "Year to Date";

  return (
    <div
      className="rounded-xl border bg-card shadow-sm"
      style={{ borderTopWidth: 3, borderTopColor: accentColor }}
    >
      <div className="flex items-center justify-between px-5 pt-4 pb-3">
        <div className="flex items-center gap-2.5">
          <PeriodBadge label={isMtd ? "MTD" : "YTD"} variant={variant} />
          <span className="text-sm font-semibold">{label}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">{date}</span>
          <span className={cn("text-xs font-bold", kpis.yoyPct >= 0 ? "text-emerald-500" : "text-red-500")}>
            {fmtPct(kpis.yoyPct)} YoY
          </span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 px-3 pb-4">
        <MiniStat label="Revenue" value={fmtCurrency(kpis.revenueMtd)} sub={isMtd ? "Feb 1–20, 2025" : "Jan 1–Feb 20"} />
        <MiniStat label="Orders" value={isMtd ? ordersCustomersKpis.ordersMtd.toString() : ordersCustomersKpis.ordersYtd.toString()} sub={isMtd ? ordersCustomersKpis.ordersYoy : ordersCustomersKpis.ordersYoy} positive />
        <MiniStat label="Avg Order Value" value={fmtCurrency(kpis.avgOrderValue)} sub="Per transaction" />
        <MiniStat label="Monthly Forecast" value={fmtCurrency(kpis.forecastMonthly)} sub="Projected month-end" />
      </div>
    </div>
  );
}

// ─── Main view ────────────────────────────────────────────────────────────────

export function DailyScorecardsView() {
  const [country, setCountry] = React.useState<Country>("All Countries");
  const [period, setPeriod] = React.useState<"mtd" | "ytd">("mtd");
  const [yoyMetric, setYoyMetric] = React.useState<"revenue" | "orders">("revenue");
  const [trendGranularity, setTrendGranularity] = React.useState<"day" | "week" | "quarter">("day");

  // ── Customer Channel Waterfall ──────────────────────────────────────────

  const buildWaterfallOptions = React.useCallback(
    (data: readonly { name: string; y: number }[]) =>
      createBaseChartOptions({
        chart: { type: "waterfall", animation: false, height: 300 },
        xAxis: {
          type: "category",
          labels: { style: { fontSize: "11px" } },
        },
        yAxis: {
          title: { text: "" },
          labels: {
            formatter: function () {
              return fmtCurrency(Number(this.value));
            },
          },
        },
        tooltip: {
          formatter: function () {
            return `<b>${String(this.x)}</b><br/>${fmtCurrency(Number(this.y))}`;
          },
        },
        legend: { enabled: false },
        plotOptions: {
          waterfall: {
            borderRadius: 4,
            borderWidth: 0,
            lineColor: "rgba(145,152,240,0.25)",
            dashStyle: "Dot",
            dataLabels: {
              enabled: true,
              formatter: function () {
                return fmtCurrency(Number(this.y));
              },
              style: {
                fontSize: "10px",
                fontWeight: "600",
                textOutline: "none",
              },
              verticalAlign: "top",
              y: -18,
            },
          },
        },
        series: [
          {
            type: "waterfall",
            name: "Revenue",
            upColor: chartColor(0),
            data: [
              ...data.map((p, i) => ({
                name: p.name,
                y: p.y,
                color: chartColor(i),
              })),
              {
                name: "Total",
                isSum: true,
                color: "#8087E8",
                dataLabels: { y: -18 },
              },
            ],
          },
        ],
      }),
    [],
  );

  const channelWaterfallMtdOptions = React.useMemo(
    () => buildWaterfallOptions(CHANNEL_WATERFALL_MTD),
    [buildWaterfallOptions],
  );

  const channelWaterfallYtdOptions = React.useMemo(
    () => buildWaterfallOptions(CHANNEL_WATERFALL_YTD),
    [buildWaterfallOptions],
  );

  // ── Sales YoY bar charts ─────────────────────────────────────────────────

  const buildBarOptions = React.useCallback(
    (
      labels: readonly string[],
      current: readonly (number | null)[],
      prior: readonly (number | null)[],
      currentLabel: string,
      priorLabel: string,
    ) =>
      createBaseChartOptions({
        chart: { type: "column", animation: false, height: 256 },
        xAxis: { categories: [...labels], labels: { style: { fontSize: "11px" } } },
        yAxis: {
          title: { text: "" },
          labels: {
            formatter: function () {
              return fmtCurrency(Number(this.value));
            },
          },
        },
        tooltip: {
          shared: true,
          formatter: function () {
            const pts = (this.points ?? []).filter((p) => p.y !== null && p.y !== undefined);
            const lines = pts.map(
              (p) =>
                `<span style="color:${String(p.color)}">●</span> ${p.series.name}: <b>${fmtCurrency(Number(p.y))}</b>`,
            );
            return `<b>${String(this.x)}</b><br/>${lines.join("<br/>")}`;
          },
        },
        legend: {
          enabled: true,
          align: "right",
          verticalAlign: "top",
          itemStyle: { fontSize: "11px", fontWeight: "600" },
        },
        plotOptions: {
          column: {
            grouping: true,
            pointPadding: 0.06,
            groupPadding: 0.12,
            borderWidth: 0,
            borderRadius: 3,
          },
        },
        series: [
          {
            type: "column",
            name: currentLabel,
            data: [...current],
            color: chartColor(1),
          },
          {
            type: "column",
            name: priorLabel,
            data: [...prior],
            color: "#64748b",
            opacity: 0.55,
          },
        ],
      }),
    [],
  );

  const mtdBarOptions = React.useMemo(
    () => buildBarOptions(MTD_BAR_LABELS, MTD_BAR_2025, MTD_BAR_2024, "2025", "2024"),
    [buildBarOptions],
  );

  const ytdBarOptions = React.useMemo(
    () =>
      buildBarOptions(
        YOY_MONTHS,
        YOY_REVENUE_THIS_YEAR,
        YOY_REVENUE_LAST_YEAR,
        "2025",
        "2024",
      ),
    [buildBarOptions],
  );

  // ── Revenue vs Targets ──────────────────────────────────────────────────

  const revenueVsTargetsOptions = React.useMemo(
    () =>
      createBaseChartOptions({
        chart: { type: "areaspline", animation: false, height: 300 },
        xAxis: { categories: DAILY_REVENUE_DAYS, tickInterval: 4 },
        yAxis: {
          labels: {
            formatter: function () {
              return fmtCurrency(Number(this.value));
            },
          },
        },
        tooltip: {
          shared: true,
          formatter: function () {
            const pts = this.points ?? [];
            const lines = pts.map(
              (p) => `<span style="color:${p.color}">●</span> ${p.series.name}: <b>${fmtCurrency(Number(p.y))}</b>`,
            );
            return `<b>${String(this.x)}</b><br/>${lines.join("<br/>")}`;
          },
        },
        legend: { enabled: true },
        plotOptions: {
          areaspline: { fillOpacity: 0.1, marker: { enabled: false } },
          line: { marker: { enabled: false }, dashStyle: "Dash" },
        },
        series: [
          { type: "areaspline", name: "Actual Revenue", data: DAILY_ACTUAL, color: chartColor(0) },
          { type: "line", name: "Beat Last Year ($620K)", data: PACE_BEAT_LAST_YEAR, color: chartColor(2) },
          { type: "line", name: "Budget ($720K)", data: PACE_BUDGET, color: chartColor(1) },
          { type: "line", name: "Bubbles! ($900K)", data: PACE_BUBBLES, color: chartColor(4) },
        ],
      }),
    [],
  );

  // ── Orders by Source donut ──────────────────────────────────────────────

  const ordersBySourceOptions = React.useMemo(
    () =>
      createBaseChartOptions({
        chart: { type: "pie", animation: false, height: 240 },
        tooltip: {
          pointFormatter: function () {
            return `<b>${String(this.name)}</b>: ${String(this.y)} orders (${this.percentage?.toFixed(1)}%)`;
          },
        },
        plotOptions: {
          pie: { innerSize: "65%", dataLabels: { enabled: false }, showInLegend: true },
        },
        series: [
          {
            type: "pie",
            name: "Orders",
            data: [
              { name: "Magento", y: ordersCustomersKpis.magentoOrdersMtd, color: chartColor(0) },
              { name: "WooCommerce", y: ordersCustomersKpis.wooOrdersMtd, color: chartColor(2) },
            ],
          },
        ],
      }),
    [],
  );

  // ── YoY Comparison ─────────────────────────────────────────────────────

  const yoyOptions = React.useMemo(() => {
    const thisYear = yoyMetric === "revenue" ? YOY_REVENUE_THIS_YEAR : YOY_ORDERS_THIS_YEAR;
    const lastYear = yoyMetric === "revenue" ? YOY_REVENUE_LAST_YEAR : YOY_ORDERS_LAST_YEAR;
    const fmt = yoyMetric === "revenue" ? fmtCurrency : (n: number) => String(n);

    return createBaseChartOptions({
      chart: { type: "column", animation: false, height: 280 },
      xAxis: { categories: YOY_MONTHS },
      yAxis: {
        labels: {
          formatter: function () {
            return fmt(Number(this.value));
          },
        },
      },
      tooltip: {
        shared: true,
        formatter: function () {
          const pts = (this.points ?? []).filter((p) => p.y !== null && p.y !== undefined);
          const lines = pts.map(
            (p) => `<span style="color:${p.color}">●</span> ${p.series.name}: <b>${fmt(Number(p.y))}</b>`,
          );
          return `<b>${String(this.x)}</b><br/>${lines.join("<br/>")}`;
        },
      },
      legend: { enabled: true },
      plotOptions: { column: { grouping: true, pointPadding: 0.1, borderWidth: 0, borderRadius: 3 } },
      series: [
        { type: "column", name: "This Year", data: thisYear, color: chartColor(0) },
        { type: "column", name: "Last Year", data: lastYear, color: chartColor(3) },
      ],
    });
  }, [yoyMetric]);

  // ── Channel donuts (MTD and YTD separately — no toggle needed) ────────

  const channelMtdOptions = React.useMemo(
    () =>
      createBaseChartOptions({
        chart: { type: "pie", animation: false, height: 210 },
        tooltip: {
          pointFormatter: function () {
            return `<b>${String(this.name)}</b>: ${fmtCurrency(Number(this.y))} (${this.percentage?.toFixed(1)}%)`;
          },
        },
        plotOptions: {
          pie: { innerSize: "70%", dataLabels: { enabled: false }, showInLegend: true },
        },
        series: [
          {
            type: "pie",
            name: "Revenue Mix MTD",
            data: [
              { name: "Direct Sales", y: CHANNEL_SPLIT_MTD.direct, color: chartColor(0) },
              { name: "Channel Partner", y: CHANNEL_SPLIT_MTD.channel, color: chartColor(3) },
            ],
          },
        ],
      }),
    [],
  );

  const channelYtdOptions = React.useMemo(
    () =>
      createBaseChartOptions({
        chart: { type: "pie", animation: false, height: 210 },
        tooltip: {
          pointFormatter: function () {
            return `<b>${String(this.name)}</b>: ${fmtCurrency(Number(this.y))} (${this.percentage?.toFixed(1)}%)`;
          },
        },
        plotOptions: {
          pie: { innerSize: "70%", dataLabels: { enabled: false }, showInLegend: true },
        },
        series: [
          {
            type: "pie",
            name: "Revenue Mix YTD",
            data: [
              { name: "Direct Sales", y: CHANNEL_SPLIT_YTD.direct, color: chartColor(0) },
              { name: "Channel Partner", y: CHANNEL_SPLIT_YTD.channel, color: chartColor(3) },
            ],
          },
        ],
      }),
    [],
  );

  // ── Value Segment stacked column ────────────────────────────────────────

  const segmentOptions = React.useMemo(
    () =>
      createBaseChartOptions({
        chart: { type: "column", animation: false, height: 280 },
        xAxis: { categories: SEGMENT_DATA.map((r) => r.month) },
        yAxis: {
          labels: {
            formatter: function () {
              return fmtCurrency(Number(this.value));
            },
          },
        },
        tooltip: {
          shared: true,
          formatter: function () {
            const pts = this.points ?? [];
            const lines = pts.map(
              (p) => `<span style="color:${p.color}">●</span> ${p.series.name}: <b>${fmtCurrency(Number(p.y))}</b>`,
            );
            return `<b>${String(this.x)}</b><br/>${lines.join("<br/>")}`;
          },
        },
        legend: { enabled: true },
        plotOptions: { column: { stacking: "normal", borderWidth: 0, borderRadius: 2 } },
        series: [
          { type: "column", name: "Enterprise", data: SEGMENT_DATA.map((r) => r.enterprise), color: chartColor(0) },
          { type: "column", name: "High",       data: SEGMENT_DATA.map((r) => r.high),       color: chartColor(2) },
          { type: "column", name: "Medium",     data: SEGMENT_DATA.map((r) => r.medium),     color: chartColor(1) },
          { type: "column", name: "Low",        data: SEGMENT_DATA.map((r) => r.low),        color: chartColor(3) },
        ],
      }),
    [],
  );

  // ── Revenue Trend (toggleable granularity) ──────────────────────────────

  const trendOptions = React.useMemo(() => {
    const labels =
      trendGranularity === "day" ? TREND_BY_DAY_LABELS
      : trendGranularity === "week" ? TREND_BY_WEEK_LABELS
      : TREND_BY_QUARTER_LABELS;
    const values =
      trendGranularity === "day" ? TREND_BY_DAY_VALUES
      : trendGranularity === "week" ? TREND_BY_WEEK_VALUES
      : TREND_BY_QUARTER_VALUES;

    return createBaseChartOptions({
      chart: { type: "line", animation: false, height: 240 },
      xAxis: { categories: labels },
      yAxis: {
        labels: {
          formatter: function () {
            return fmtCurrency(Number(this.value));
          },
        },
      },
      tooltip: {
        formatter: function () {
          return `<b>${String(this.x)}</b><br/>${fmtCurrency(Number(this.y))}`;
        },
      },
      legend: { enabled: false },
      plotOptions: {
        line: { marker: { enabled: true, radius: 4 }, color: chartColor(0) },
      },
      series: [{ type: "line", name: "Revenue", data: values, color: chartColor(0) }],
    });
  }, [trendGranularity]);

  // ── Target Benchmarks grid ──────────────────────────────────────────────

  const targetGridOptions = React.useMemo(
    () => ({
      accessibility: { enabled: false },
      pagination: { enabled: false },
      rendering: {
        theme: "hcg-theme-default",
        rows: { strictHeights: true, minVisibleRows: 3 },
        columns: { resizing: { enabled: false } },
      },
      credits: { enabled: false },
      columnDefaults: {
        sorting: { enabled: false },
        cells: { className: "sc-grid-cell" },
      },
      columns: [
        {
          id: "name",
          header: { format: "Target" },
          width: "22%",
          cells: {
            className: "sc-grid-cell",
            formatter: function (this: { value?: unknown }) {
              return `<span style="font-weight:600">${String(this.value ?? "")}</span>`;
            },
          },
        },
        {
          id: "amount",
          header: { format: "Target Amount" },
          width: "20%",
          cells: {
            className: "sc-grid-cell",
            formatter: function (this: { value?: unknown }) {
              return fmtCurrency(Number(this.value ?? 0));
            },
          },
        },
        {
          id: "revenueLeft",
          header: { format: "Revenue Left" },
          width: "20%",
          cells: {
            className: "sc-grid-cell",
            formatter: function (this: { value?: unknown }) {
              return `<span style="color:#F19E53;font-weight:500">${fmtCurrency(Number(this.value ?? 0))}</span>`;
            },
          },
        },
        {
          id: "pctReached",
          header: { format: "% Reached" },
          width: "19%",
          cells: {
            className: "sc-grid-cell",
            formatter: function (this: { value?: unknown }) {
              const pct = Number(this.value ?? 0);
              const color = pct >= 80 ? "#22c55e" : pct >= 60 ? "#F19E53" : "#ef4444";
              return `<span style="color:${color};font-weight:600">${pct.toFixed(1)}%</span>`;
            },
          },
        },
        {
          id: "pctOnTrack",
          header: { format: "% On Track" },
          width: "19%",
          cells: {
            className: "sc-grid-cell",
            formatter: function (this: { value?: unknown }) {
              const pct = Number(this.value ?? 0);
              const color = pct >= 80 ? "#22c55e" : pct >= 60 ? "#F19E53" : "#ef4444";
              return `<span style="color:${color};font-weight:600">${pct.toFixed(1)}%</span>`;
            },
          },
        },
      ],
      dataTable: {
        columns: {
          name:        TARGET_BENCHMARKS.map((r) => r.name),
          amount:      TARGET_BENCHMARKS.map((r) => r.amount),
          revenueLeft: TARGET_BENCHMARKS.map((r) => r.revenueLeft),
          pctReached:  TARGET_BENCHMARKS.map((r) => r.pctReached),
          pctOnTrack:  TARGET_BENCHMARKS.map((r) => r.pctOnTrack),
        },
      },
    }),
    [],
  );

  // ── Detailed Revenue Metrics grid ───────────────────────────────────────

  const metricsGridOptions = React.useMemo(
    () => ({
      accessibility: { enabled: false },
      pagination: { enabled: false },
      rendering: {
        theme: "hcg-theme-default",
        rows: { strictHeights: true, minVisibleRows: 10 },
        columns: { resizing: { enabled: false } },
      },
      credits: { enabled: false },
      columnDefaults: {
        sorting: { enabled: false },
        cells: { className: "sc-grid-cell" },
      },
      columns: [
        {
          id: "metric",
          header: { format: "Metric" },
          width: "32%",
          cells: {
            className: "sc-grid-cell",
            formatter: function (this: { value?: unknown }) {
              return `<span style="font-weight:600">${String(this.value ?? "")}</span>`;
            },
          },
        },
        {
          id: "mtd",
          header: { format: "MTD" },
          width: "17%",
          cells: { className: "sc-grid-cell" },
        },
        {
          id: "ytd",
          header: { format: "YTD" },
          width: "17%",
          cells: { className: "sc-grid-cell" },
        },
        {
          id: "yoyChange",
          header: { format: "YoY Change" },
          width: "17%",
          cells: {
            className: "sc-grid-cell",
            formatter: function (this: { value?: unknown }) {
              const s = String(this.value ?? "");
              const color = s.startsWith("+") ? "#22c55e" : s.startsWith("-") ? "#ef4444" : "inherit";
              return `<span style="color:${color};font-weight:500">${s}</span>`;
            },
          },
        },
        {
          id: "pctOfTotal",
          header: { format: "% of Total" },
          width: "17%",
          cells: { className: "sc-grid-cell" },
        },
      ],
      dataTable: {
        columns: {
          metric:     DETAILED_METRICS.map((r) => r.metric),
          mtd:        DETAILED_METRICS.map((r) => r.mtd),
          ytd:        DETAILED_METRICS.map((r) => r.ytd),
          yoyChange:  DETAILED_METRICS.map((r) => r.yoyChange),
          pctOfTotal: DETAILED_METRICS.map((r) => r.pctOfTotal),
        },
      },
    }),
    [],
  );

  // ── Full Summary Table grid ──────────────────────────────────────────────

  const summaryTableGridOptions = React.useMemo(
    () => ({
      accessibility: { enabled: false },
      pagination: { enabled: false },
      rendering: {
        theme: "hcg-theme-default",
        rows: { strictHeights: true, minVisibleRows: 5 },
        columns: { resizing: { enabled: false } },
      },
      credits: { enabled: false },
      columnDefaults: {
        sorting: { enabled: false },
        cells: { className: "sc-summary-cell" },
      },
      columns: [
        {
          id: "segment",
          header: { format: "Segment" },
          width: "15%",
          cells: {
            className: "sc-summary-cell",
            formatter: function (this: { value?: unknown }) {
              const [segmentKey, label] = String(this.value ?? "").split("::");

              if (segmentKey === "total") {
                return `<span class="sc-summary-segment-total">${label}</span>`;
              }

              return `<span class="sc-summary-segment sc-summary-segment-${segmentKey}">
                <span class="sc-summary-segment-dot"></span>
                ${label}
              </span>`;
            },
          },
        },
        {
          id: "range",
          header: { format: "Range" },
          width: "11%",
          cells: {
            className: "sc-summary-cell",
            formatter: function (this: { value?: unknown }) {
              const value = String(this.value ?? "");
              return value.length > 0 ? `<span class="sc-summary-range">${value}</span>` : "";
            },
          },
        },
        {
          id: "revenue",
          header: { format: "Revenue" },
          width: "12%",
          cells: {
            className: "sc-summary-cell",
            formatter: function (this: { value?: unknown }) {
              return `<span class="sc-summary-money">${String(this.value ?? "")}</span>`;
            },
          },
        },
        {
          id: "revPct",
          header: { format: "Rev %" },
          width: "12%",
          cells: {
            className: "sc-summary-cell",
            formatter: function (this: { value?: unknown }) {
              const [segmentKey, rawPct, label] = String(this.value ?? "").split("::");

              if (segmentKey === "total") {
                return `<span class="sc-summary-total-percent">${label}</span>`;
              }

              const pct = Math.max(0, Math.min(100, Number(rawPct)));
              return `<div class="sc-summary-bar-cell">
                <span class="sc-summary-bar-track">
                  <span class="sc-summary-bar-fill sc-summary-bar-fill-${segmentKey}" style="width:${pct}%"></span>
                </span>
                <span class="sc-summary-bar-label">${label}</span>
              </div>`;
            },
          },
        },
        {
          id: "revYoy",
          header: { format: "Rev YoY" },
          width: "11%",
          cells: {
            className: "sc-summary-cell",
            formatter: function (this: { value?: unknown }) {
              const [, rawPct] = String(this.value ?? "").split("::");
              const pct = Number(rawPct);
              const trendClass = pct >= 0 ? "sc-summary-yoy-positive" : "sc-summary-yoy-negative";
              const arrow = pct >= 0 ? "▲" : "▼";
              return `<span class="sc-summary-yoy-badge ${trendClass}">${arrow}${fmtAbsPct(pct)}%</span>`;
            },
          },
        },
        {
          id: "orders",
          header: { format: "Orders" },
          width: "8%",
          cells: {
            className: "sc-summary-cell",
            formatter: function (this: { value?: unknown }) {
              return `<span class="sc-summary-orders">${String(this.value ?? "")}</span>`;
            },
          },
        },
        {
          id: "ordPct",
          header: { format: "Ord %" },
          width: "12%",
          cells: {
            className: "sc-summary-cell",
            formatter: function (this: { value?: unknown }) {
              const [segmentKey, rawPct, label] = String(this.value ?? "").split("::");

              if (segmentKey === "total") {
                return `<span class="sc-summary-total-percent">${label}</span>`;
              }

              const pct = Math.max(0, Math.min(100, Number(rawPct)));
              return `<div class="sc-summary-bar-cell">
                <span class="sc-summary-bar-track">
                  <span class="sc-summary-bar-fill sc-summary-bar-fill-${segmentKey}" style="width:${pct}%"></span>
                </span>
                <span class="sc-summary-bar-label">${label}</span>
              </div>`;
            },
          },
        },
        {
          id: "ordYoy",
          header: { format: "Ord YoY" },
          width: "11%",
          cells: {
            className: "sc-summary-cell",
            formatter: function (this: { value?: unknown }) {
              const [, rawPct] = String(this.value ?? "").split("::");
              const pct = Number(rawPct);
              const trendClass = pct >= 0 ? "sc-summary-yoy-positive" : "sc-summary-yoy-negative";
              const arrow = pct >= 0 ? "▲" : "▼";
              return `<span class="sc-summary-yoy-badge ${trendClass}">${arrow}${fmtAbsPct(pct)}%</span>`;
            },
          },
        },
        {
          id: "avgValue",
          header: { format: "Avg Value" },
          width: "8%",
          cells: {
            className: "sc-summary-cell",
            formatter: function (this: { value?: unknown }) {
              return `<span class="sc-summary-money">${String(this.value ?? "")}</span>`;
            },
          },
        },
      ],
      dataTable: {
        columns: {
          segment: FULL_SUMMARY_ROWS.map((row) => `${row.segmentKey}::${row.segment}`),
          range: FULL_SUMMARY_ROWS.map((row) => row.range),
          revenue: FULL_SUMMARY_ROWS.map((row) => row.revenue),
          revPct: FULL_SUMMARY_ROWS.map((row) => `${row.segmentKey}::${row.revenuePct}::${row.revenuePctLabel}`),
          revYoy: FULL_SUMMARY_ROWS.map((row) => `${row.segmentKey}::${row.revenueYoyPct}`),
          orders: FULL_SUMMARY_ROWS.map((row) => String(row.orders)),
          ordPct: FULL_SUMMARY_ROWS.map((row) => `${row.segmentKey}::${row.ordersPct}::${row.ordersPctLabel}`),
          ordYoy: FULL_SUMMARY_ROWS.map((row) => `${row.segmentKey}::${row.ordersYoyPct}`),
          avgValue: FULL_SUMMARY_ROWS.map((row) => row.avgValue),
        },
      },
    }),
    [],
  );

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="space-y-8 p-4 md:p-6">

      {/* ── 1. Header ─────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Daily Scorecards</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Revenue performance, orders, customers, and pipeline health
          </p>
        </div>
        <div className="flex items-center gap-3">
          <TogglePills
            options={[
              { label: "This Month", value: "mtd" },
              { label: "Year to Date", value: "ytd" },
            ]}
            value={period}
            onChange={setPeriod}
          />
          <Select value={country} onValueChange={(v) => setCountry(v as Country)}>
            <SelectTrigger className="w-[160px] text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {COUNTRIES.map((c) => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* ── 2. Target Scorecards (always show MTD + YTD side by side) ─────── */}
      <div className="grid gap-4 lg:grid-cols-3">
        {TARGET_BENCHMARKS.map((mtdB, i) => (
          <TargetScorecard
            key={mtdB.name}
            title={mtdB.name}
            accent={SCORECARD_ACCENTS[i]}
            mtdBenchmark={mtdB}
            ytdBenchmark={YTD_TARGET_BENCHMARKS[i]}
          />
        ))}
      </div>
      {/* Legend */}
      <div className="-mt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-1">
        {TARGET_BENCHMARKS.map((b, i) => (
          <span key={b.name} className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: SCORECARD_ACCENTS[i] }}
            />
            {b.name} — {fmtCurrency(b.amount)} MTD · {fmtCurrency(YTD_TARGET_BENCHMARKS[i].amount)} YTD
          </span>
        ))}
      </div>

      {/* ── 3. Customer Channel Revenue Waterfall ─────────────────────────── */}
      <SectionHeader label="Customer Channel Revenue" accent="#9198F0" />
      <div className="grid gap-4 sm:grid-cols-2">
        {/* MTD waterfall */}
        <Card>
          <CardHeader className="pb-0 pt-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Channel Breakdown
              </CardTitle>
              <PeriodBadge label="MTD" variant="mtd" />
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Feb 1–20, 2025 · Total{" "}
              <strong className="text-foreground">{fmtCurrency(mtdKpis.revenueMtd)}</strong>
            </p>
          </CardHeader>
          <CardContent className="p-0 pr-4 pb-4">
            <div className="h-[300px]">
              <DashboardHighchart options={channelWaterfallMtdOptions} />
            </div>
          </CardContent>
        </Card>

        {/* YTD waterfall */}
        <Card>
          <CardHeader className="pb-0 pt-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Channel Breakdown
              </CardTitle>
              <PeriodBadge label="YTD" variant="ytd" />
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Jan 1–Feb 20, 2025 · Total{" "}
              <strong className="text-foreground">{fmtCurrency(ytdKpis.revenueMtd)}</strong>
            </p>
          </CardHeader>
          <CardContent className="p-0 pr-4 pb-4">
            <div className="h-[300px]">
              <DashboardHighchart options={channelWaterfallYtdOptions} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── Sales 2025 vs 2024 bar charts ──────────────────────────────────── */}
      <div className="grid gap-4 sm:grid-cols-2">
        {/* MTD: weekly within current month */}
        <Card>
          <CardHeader className="pb-0 pt-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Sales vs Prior Year
              </CardTitle>
              <PeriodBadge label="MTD" variant="mtd" />
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Feb weekly · <span className="font-medium" style={{ color: chartColor(1) }}>2025</span>
              {" vs "}
              <span className="font-medium text-slate-500">2024</span>
            </p>
          </CardHeader>
          <CardContent className="p-0 pr-4 pb-4">
            <div className="h-[256px]">
              <DashboardHighchart options={mtdBarOptions} />
            </div>
          </CardContent>
        </Card>

        {/* YTD: full-year monthly */}
        <Card>
          <CardHeader className="pb-0 pt-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Sales vs Prior Year
              </CardTitle>
              <PeriodBadge label="YTD" variant="ytd" />
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Monthly · <span className="font-medium" style={{ color: chartColor(1) }}>2025</span>
              {" vs "}
              <span className="font-medium text-slate-500">2024</span>
            </p>
          </CardHeader>
          <CardContent className="p-0 pr-4 pb-4">
            <div className="h-[256px]">
              <DashboardHighchart options={ytdBarOptions} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── 4. Active period panel ─────────────────────────────────────────── */}
      <SectionHeader
        label={period === "mtd" ? "Month to Date" : "Year to Date"}
        accent={period === "mtd" ? "#8087E8" : "#6DDFA0"}
      />
      <div className="grid gap-4 lg:grid-cols-2">
        {period === "mtd" ? (
          <>
            <PeriodPanel variant="mtd" kpis={mtdKpis} date="Feb 1–20, 2025" />
            {/* YTD at a glance — smaller, muted */}
            <PeriodPanel variant="ytd" kpis={ytdKpis} date="Jan 1–Feb 20, 2025" />
          </>
        ) : (
          <>
            <PeriodPanel variant="ytd" kpis={ytdKpis} date="Jan 1–Feb 20, 2025" />
            <PeriodPanel variant="mtd" kpis={mtdKpis} date="Feb 1–20, 2025" />
          </>
        )}
      </div>

      {/* ── 4. Revenue vs Targets ─────────────────────────────────────────── */}
      <SectionHeader label="Revenue vs Targets" />
      <Card>
        <CardContent className="p-0 pr-4 pt-4">
          <div className="h-[300px]">
            <DashboardHighchart options={revenueVsTargetsOptions} />
          </div>
        </CardContent>
      </Card>

      {/* ── 4. Target Benchmarks ─────────────────────────────────────────── */}
      <Card>
        <CardHeader className="pb-2 pt-4">
          <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Target Benchmarks</CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4 pt-0">
          <div className="h-[140px]">
            <HighchartsGridPro options={targetGridOptions} />
          </div>
        </CardContent>
      </Card>

      {/* ── 5. Revenue rates (dual MTD | YTD) ────────────────────────────── */}
      <SectionHeader label="Revenue Rates" />
      <div className="grid gap-4 sm:grid-cols-3">
        <DualStatCard
          title="Revenue per Day"
          mtdValue={fmtCurrency(mtdKpis.revenuePerDay)}
          ytdValue={fmtCurrency(ytdKpis.revenuePerDay)}
          sub="Daily average"
        />
        <DualStatCard
          title="Revenue per Week"
          mtdValue={fmtCurrency(mtdKpis.revenuePerWeek)}
          ytdValue={fmtCurrency(ytdKpis.revenuePerWeek)}
          sub="Weekly average"
        />
        <DualStatCard
          title="Revenue per Quarter"
          mtdValue={fmtCurrency(mtdKpis.revenuePerQuarter)}
          ytdValue={fmtCurrency(ytdKpis.revenuePerQuarter)}
          sub="Quarterly run-rate"
        />
      </div>

      {/* ── 6. Orders & Customers ─────────────────────────────────────────── */}
      <SectionHeader label="Orders &amp; Customers" />
      <div className="grid gap-4 xl:grid-cols-2">
        {/* Left: dual-stat cards */}
        <div className="grid grid-cols-2 gap-4">
          <DualStatCard
            title="Orders"
            mtdValue={ordersCustomersKpis.ordersMtd.toString()}
            ytdValue={ordersCustomersKpis.ordersYtd.toString()}
            sub={`${ordersCustomersKpis.ordersYoy} vs last year`}
          />
          <DualStatCard
            title="Customers"
            mtdValue={ordersCustomersKpis.customersMtd.toString()}
            ytdValue={ordersCustomersKpis.customersYtd.toString()}
            sub={`${ordersCustomersKpis.customersYoy} vs last year`}
          />
          {/* Magento / WooCommerce breakdown */}
          <Card className="col-span-2 gap-0 py-0">
            <CardContent className="p-5">
              <p className="text-xs font-semibold text-muted-foreground">Orders by Platform · MTD</p>
              <div className="mt-3 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Magento</p>
                  <p className="text-2xl font-bold">{ordersCustomersKpis.magentoOrdersMtd}</p>
                  <p className="text-xs text-muted-foreground">
                    {((ordersCustomersKpis.magentoOrdersMtd / ordersCustomersKpis.ordersMtd) * 100).toFixed(1)}% of total
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">WooCommerce</p>
                  <p className="text-2xl font-bold">{ordersCustomersKpis.wooOrdersMtd}</p>
                  <p className="text-xs text-muted-foreground">
                    {((ordersCustomersKpis.wooOrdersMtd / ordersCustomersKpis.ordersMtd) * 100).toFixed(1)}% of total
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        {/* Right: orders by source donut */}
        <Card>
          <CardHeader className="pb-0 pt-4">
            <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Orders by Source</CardTitle>
          </CardHeader>
          <CardContent className="p-0 pr-4 pb-4">
            <div className="h-[240px]">
              <DashboardHighchart options={ordersBySourceOptions} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── 7. Year-over-Year Comparison ─────────────────────────────────── */}
      <SectionHeader label="Year-over-Year Comparison" />
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-0 pt-4">
          <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">YoY Comparison</CardTitle>
          <TogglePills
            options={[
              { label: "Revenue", value: "revenue" },
              { label: "Orders", value: "orders" },
            ]}
            value={yoyMetric}
            onChange={setYoyMetric}
          />
        </CardHeader>
        <CardContent className="p-0 pr-4 pb-4">
          <div className="h-[280px]">
            <DashboardHighchart options={yoyOptions} />
          </div>
        </CardContent>
      </Card>

      {/* ── 8. Revenue Channel Mix (MTD + YTD side by side) ──────────────── */}
      <SectionHeader label="Sales Channel Mix" />
      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader className="pb-0 pt-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Revenue Mix</CardTitle>
              <PeriodBadge label="MTD" variant="mtd" />
            </div>
            <div className="mt-1 flex gap-4 text-sm">
              <span>Direct: <strong>{fmtCurrency(CHANNEL_SPLIT_MTD.direct)}</strong></span>
              <span>Channel: <strong>{fmtCurrency(CHANNEL_SPLIT_MTD.channel)}</strong></span>
            </div>
          </CardHeader>
          <CardContent className="p-0 pr-4 pb-4">
            <div className="h-[210px]">
              <DashboardHighchart options={channelMtdOptions} />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-0 pt-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Revenue Mix</CardTitle>
              <PeriodBadge label="YTD" variant="ytd" />
            </div>
            <div className="mt-1 flex gap-4 text-sm">
              <span>Direct: <strong>{fmtCurrency(CHANNEL_SPLIT_YTD.direct)}</strong></span>
              <span>Channel: <strong>{fmtCurrency(CHANNEL_SPLIT_YTD.channel)}</strong></span>
            </div>
          </CardHeader>
          <CardContent className="p-0 pr-4 pb-4">
            <div className="h-[210px]">
              <DashboardHighchart options={channelYtdOptions} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── 9. Value Segment ─────────────────────────────────────────────── */}
      <SectionHeader label="Value Segment Analysis" />
      <Card>
        <CardContent className="p-0 pr-4 pt-4 pb-4">
          <div className="h-[280px]">
            <DashboardHighchart options={segmentOptions} />
          </div>
        </CardContent>
      </Card>

      {/* ── 10. Revenue Trend ────────────────────────────────────────────── */}
      <SectionHeader label="Revenue Trend" />
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-0 pt-4">
          <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Daily / Weekly / Quarterly</CardTitle>
          <TogglePills
            options={[
              { label: "By Day", value: "day" },
              { label: "By Week", value: "week" },
              { label: "By Quarter", value: "quarter" },
            ]}
            value={trendGranularity}
            onChange={setTrendGranularity}
          />
        </CardHeader>
        <CardContent className="p-0 pr-4 pb-4">
          <div className="h-[240px]">
            <DashboardHighchart options={trendOptions} />
          </div>
        </CardContent>
      </Card>

      {/* ── 11. Pipeline Summary ─────────────────────────────────────────── */}
      <SectionHeader label="Pipeline Summary" />
      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="gap-0 py-0">
          <CardContent className="p-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Open Opportunities</p>
            <p className="mt-2 text-5xl font-bold tabular-nums">{PIPELINE_SUMMARY.opportunitiesCount}</p>
            <div className="mt-3 flex gap-5 text-xs text-muted-foreground">
              <span>Pipeline: <strong className="text-foreground">{fmtCurrency(PIPELINE_SUMMARY.totalPipelineValue)}</strong></span>
              <span>Weighted: <strong className="text-foreground">{fmtCurrency(PIPELINE_SUMMARY.weightedPipeline)}</strong></span>
            </div>
          </CardContent>
        </Card>
        <Card className="gap-0 py-0">
          <CardContent className="p-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Avg Days to Close</p>
            <p className="mt-2 text-5xl font-bold tabular-nums">{PIPELINE_SUMMARY.avgDaysToClose}</p>
            <p className="mt-3 text-xs text-muted-foreground">Average sales cycle across all open deals</p>
          </CardContent>
        </Card>
      </div>

      {/* ── 12. Detailed Metrics Table ────────────────────────────────────── */}
      <SectionHeader label="Detailed Revenue Metrics" />
      <Card>
        <CardContent className="px-4 pb-4 pt-4">
          <div className="h-[400px]">
            <HighchartsGridPro options={metricsGridOptions} />
          </div>
        </CardContent>
      </Card>

      {/* ── 13. Full Summary Table ───────────────────────────────────────── */}
      <SectionHeader label="Full Summary Table" accent="#6DDFA0" />
      <Card className="sc-summary-card gap-0 py-0">
        <CardHeader className="pb-2 pt-5">
          <CardTitle className="text-base font-semibold">Segment Breakdown</CardTitle>
          <p className="text-sm text-muted-foreground">
            Colour-coded YoY badges and visual order/revenue bars by value segment
          </p>
        </CardHeader>
        <CardContent className="px-4 pb-6 pt-0">
          <div className="h-[300px]">
            <HighchartsGridPro className="sc-summary-grid" options={summaryTableGridOptions} />
          </div>
        </CardContent>
      </Card>

    </div>
  );
}
