"use client";

import * as React from "react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardHighchart, createBaseChartOptions } from "@/components/ui/highcharts";
import { HighchartsGridPro } from "@/components/ui/highcharts-grid-pro";

import { allBubblePoints, BubblePoint, FUNNEL_STAGE_COLORS, MAX_DEAL_SIZE, pipelineDeals, salesPipelineKpis, wonDeals } from "./data";
import { ArrKpiCard } from "../dashboard-one/cards";

// ─── Grid options ─────────────────────────────────────────────────────────────

function buildWonGridOptions() {
  return {
    accessibility: { enabled: false },
    pagination: { enabled: false },
    rendering: {
      theme: "hcg-theme-default",
      rows: {
        strictHeights: true,
        minVisibleRows: 4,
      },
      columns: {
        resizing: { enabled: false },
      },
    },
    credits: { enabled: false },
    columnDefaults: {
      sorting: { enabled: false },
      cells: { className: "sp-grid-cell" },
    },
    columns: [
      {
        id: "company",
        header: { format: "Company" },
        width: "34%",
        cells: {
          className: "sp-grid-cell",
          formatter: function () {
            const v = String((this as { value?: unknown }).value ?? "");
            return `<span style="font-weight:600">${v}</span>`;
          },
        },
      },
      {
        id: "contact",
        header: { format: "Contact" },
        width: "28%",
        cells: { className: "sp-grid-cell sp-meta-cell" },
      },
      {
        id: "dealSize",
        header: { format: "Deal Size" },
        width: "20%",
        cells: {
          className: "sp-grid-cell sp-amount-cell",
          formatter: function () {
            const n = Number((this as { value?: unknown }).value ?? 0);
            return `<span class="sp-stage-won-text">$${Math.round(n / 1000)}K</span>`;
          },
        },
      },
      {
        id: "closeDate",
        header: { format: "Closed" },
        width: "18%",
        cells: { className: "sp-grid-cell sp-meta-cell" },
      },
    ],
    dataTable: {
      columns: {
        company:   wonDeals.map((d) => d.company),
        contact:   wonDeals.map((d) => d.contact),
        dealSize:  wonDeals.map((d) => d.dealSize),
        closeDate: wonDeals.map((d) => d.expectedClose),
      },
    },
  };
}

function buildPipelineGridOptions() {
  return {
    accessibility: { enabled: false },
    pagination: { enabled: true },
    rendering: {
      theme: "hcg-theme-default",
      rows: {
        strictHeights: true,
        minVisibleRows: 8,
      },
      columns: {
        resizing: { enabled: false },
      },
    },
    credits: { enabled: false },
    columnDefaults: {
      sorting: { enabled: false },
      cells: { className: "sp-grid-cell" },
    },
    columns: [
      {
        id: "company",
        header: { format: "Company" },
        width: "22%",
        cells: {
          className: "sp-grid-cell",
          formatter: function () {
            const v = String((this as { value?: unknown }).value ?? "");
            return `<span style="font-weight:600">${v}</span>`;
          },
        },
      },
      {
        id: "stage",
        header: { format: "Stage" },
        width: "18%",
        cells: {
          className: "sp-grid-cell",
          formatter: function () {
            const s = String((this as { value?: unknown }).value ?? "");
            const cls =
              s === "Scoping"   ? "sp-stage-scoping"   :
              s === "Proposal"  ? "sp-stage-proposal"  :
              s === "Committed" ? "sp-stage-committed" : "";
            return `<span class="sp-stage-badge ${cls}">${s}</span>`;
          },
        },
      },
      {
        id: "dealSize",
        header: { format: "Deal Size" },
        width: "16%",
        cells: {
          className: "sp-grid-cell sp-amount-cell",
          formatter: function () {
            const n = Number((this as { value?: unknown }).value ?? 0);
            const large = n > 200000 ? " sp-deal-large" : "";
            return `<span class="${large.trim()}">$${Math.round(n / 1000)}K</span>`;
          },
        },
      },
      {
        id: "probability",
        header: { format: "Prob." },
        width: "12%",
        cells: {
          className: "sp-grid-cell",
          formatter: function () {
            const p = Number((this as { value?: unknown }).value ?? 0);
            const cls = p >= 70 ? "sp-prob-high" : p >= 40 ? "sp-prob-medium" : "sp-prob-low";
            return `<span class="${cls}">${p}%</span>`;
          },
        },
      },
      {
        id: "contact",
        header: { format: "Contact" },
        width: "18%",
        cells: { className: "sp-grid-cell sp-meta-cell" },
      },
      {
        id: "expectedClose",
        header: { format: "Exp. Close" },
        width: "14%",
        cells: { className: "sp-grid-cell sp-meta-cell" },
      },
    ],
    dataTable: {
      columns: {
        company:       pipelineDeals.map((d) => d.company),
        stage:         pipelineDeals.map((d) => d.stage),
        dealSize:      pipelineDeals.map((d) => d.dealSize),
        probability:   pipelineDeals.map((d) => d.probability),
        contact:       pipelineDeals.map((d) => d.contact),
        expectedClose: pipelineDeals.map((d) => d.expectedClose),
      },
    },
  };
}

// ─── Funnel bubble chart ──────────────────────────────────────────────────────

const STAGE_NAMES = ["Scoping", "Proposal", "Committed", "Won"];

// Linear interpolation of the funnel y-boundary at a given x.
// Left edge (x=-0.5): y_bound=4.5 · Right edge (x=3.5): y_bound=1.5
function funnelBoundAtX(dataX: number): number {
  const t = (dataX - -0.5) / (3.5 - -0.5);
  return 4.5 - 3.0 * t;
}

function buildFunnelChartOptions(
  series: Array<{ name: string; color: string; data: BubblePoint[] }>,
): Highcharts.Options {
  return createBaseChartOptions({
    chart: {
      type: "bubble",
      height: 460,
      spacing: [24, 16, 16, 16],
      events: {
        render: function () {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const chart = this as any;

          // Remove previously drawn overlay elements
          if (Array.isArray(chart._funnelOverlay)) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (chart._funnelOverlay as any[]).forEach((el) => { try { el.destroy(); } catch (_) { /* ignore */ } });
          }
          chart._funnelOverlay = [];

          const xa = chart.xAxis[0];
          const ya = chart.yAxis[0];
          if (!xa || !ya) return;

          const px = (d: number) => xa.toPixels(d, false) as number;
          const py = (d: number) => ya.toPixels(d, false) as number;

          // ── Trapezoid fill ───────────────────────────────────────────────
          const lx  = px(-0.5);
          const rx  = px(3.5);
          const lyT = py(4.5);
          const lyB = py(-4.5);
          const ryT = py(1.5);
          const ryB = py(-1.5);

          chart._funnelOverlay.push(
            chart.renderer
              .path(["M", lx, lyT, "L", rx, ryT, "L", rx, ryB, "L", lx, lyB, "Z"])
              .attr({
                fill: "rgba(128,135,232,0.05)",
                stroke: "rgba(128,135,232,0.22)",
                "stroke-width": 1,
                zIndex: 0,
              })
              .add(),
          );

          // ── Dashed vertical dividers at x = 0.5, 1.5, 2.5 ──────────────
          [0.5, 1.5, 2.5].forEach((dx) => {
            const divX   = px(dx);
            const yBound = funnelBoundAtX(dx);
            chart._funnelOverlay.push(
              chart.renderer
                .path(["M", divX, py(yBound), "L", divX, py(-yBound)])
                .attr({
                  stroke: "rgba(100,116,139,0.35)",
                  "stroke-width": 1,
                  dashstyle: "Dash",
                  zIndex: 1,
                })
                .add(),
            );
          });

          // ── Stage labels above each section ─────────────────────────────
          STAGE_NAMES.forEach((name, i) => {
            const cx     = px(i);
            const yBound = funnelBoundAtX(i);
            const labelY = py(yBound + 0.45);
            chart._funnelOverlay.push(
              chart.renderer
                .text(name, cx, labelY)
                .attr({ align: "center", zIndex: 5 })
                .css({
                  color: "var(--muted-foreground)",
                  fontSize: "11px",
                  fontWeight: "600",
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                })
                .add(),
            );
          });
        },
      },
    },
    xAxis: {
      min: -0.5,
      max: 3.5,
      tickLength: 0,
      lineWidth: 0,
      gridLineWidth: 0,
      labels: {
        formatter: function () {
          const v = Math.round(this.value as number);
          return STAGE_NAMES[v] ?? "";
        },
        style: { color: "transparent" },
      },
    },
    yAxis: {
      min: -5,
      max: 5,
      visible: false,
      gridLineWidth: 0,
    },
    legend: {
      enabled: true,
      align: "right",
      verticalAlign: "top",
      layout: "vertical",
    },
    plotOptions: {
      bubble: {
        minSize: "4%",
        maxSize: "11%",
        zMin: 25000,
        zMax: 500000,
        opacity: 0.82,
        marker: {
          lineWidth: 1,
          lineColor: "rgba(255,255,255,0.3)",
        },
      },
      series: {
        animation: false,
      },
    },
    tooltip: {
      useHTML: true,
      formatter: function () {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const p = this as any;
        const sizeK = `$${Math.round((p.z as number) / 1000)}K`;
        return `
          <div style="padding:4px 2px;min-width:140px">
            <div style="font-weight:700;margin-bottom:4px">${p.name as string}</div>
            <div style="font-size:13px">${sizeK}</div>
            <div style="font-size:11px;color:var(--muted-foreground);margin-top:2px">
              ${p.stage as string} · ${p.probability as number}%
            </div>
          </div>`;
      },
    },
    series: series.map((s) => ({
      type: "bubble" as const,
      name: s.name,
      color: s.color,
      data: s.data.map((pt) => ({
        x: pt.x,
        y: pt.y,
        z: pt.z,
        name: pt.name,
        stage: pt.stage,
        probability: pt.probability,
      })),
    })),
  });
}

// ─── View ─────────────────────────────────────────────────────────────────────

export function SalesPipelineView() {
  const [minDealSize, setMinDealSize] = React.useState(0);

  const wonGridOptions      = React.useMemo(() => buildWonGridOptions(),      []);
  const pipelineGridOptions = React.useMemo(() => buildPipelineGridOptions(), []);

  const filteredFunnelSeries = React.useMemo(() => {
    const pts = minDealSize > 0 ? allBubblePoints.filter((p) => p.z >= minDealSize) : allBubblePoints;
    return (["Scoping", "Proposal", "Committed", "Won"] as const).map((stage) => ({
      name: stage,
      color: FUNNEL_STAGE_COLORS[stage],
      data: pts.filter((p) => p.stage === stage),
    }));
  }, [minDealSize]);

  const visibleCount = minDealSize > 0 ? allBubblePoints.filter((p) => p.z >= minDealSize).length : allBubblePoints.length;

  const funnelChartOptions = React.useMemo(
    () => buildFunnelChartOptions(filteredFunnelSeries),
    [filteredFunnelSeries],
  );

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Sales Pipeline</h1>
        <p className="text-muted-foreground">Track deals from scoping to close.</p>
      </div>

      {/* KPI cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {salesPipelineKpis.map((kpi) => (
          <ArrKpiCard
            key={kpi.title}
            title={kpi.title}
            value={kpi.value}
            subtitle={kpi.subtitle}
            trend={kpi.trend}
            positive={kpi.positive}
          />
        ))}
      </div>

      {/* Funnel-bubble chart */}
      <Card className="gap-0 py-0">
        <CardHeader className="p-5 pb-2">
          <CardTitle className="text-base">Pipeline Funnel</CardTitle>
          <CardDescription>Deal size and volume across pipeline stages</CardDescription>
        </CardHeader>

        {/* Deal-size slider */}
        <div className="flex items-center gap-3 px-5 pb-3 border-b border-border/40">
          <span className="text-xs text-muted-foreground whitespace-nowrap">Min deal size</span>
          <input
            type="range"
            min={0}
            max={MAX_DEAL_SIZE}
            step={10000}
            value={minDealSize}
            onChange={(e) => setMinDealSize(Number(e.target.value))}
            className="flex-1 h-1.5 accent-primary cursor-pointer"
          />
          <span className="text-xs font-semibold tabular-nums w-16 text-right">
            {minDealSize === 0 ? "All sizes" : `≥ $${Math.round(minDealSize / 1000)}K`}
          </span>
          <span className="text-xs text-muted-foreground tabular-nums w-14 text-right">
            {visibleCount} deal{visibleCount !== 1 ? "s" : ""}
          </span>
        </div>

        <CardContent className="p-4 pt-0">
          <DashboardHighchart
            options={funnelChartOptions}
            className="h-[460px] w-full"
          />
        </CardContent>
      </Card>

      {/* Grids */}
      <div className="grid gap-4 grid-cols-5">
        {/* Won deals — col-span-2 */}
        <Card className="col-span-5 xl:col-span-2 gap-0 py-0">
          <CardHeader className="p-5 pb-2">
            <CardTitle className="text-base">Latest Sales</CardTitle>
            <CardDescription>Recently closed deals</CardDescription>
          </CardHeader>
          <CardContent className="p-0 pb-2">
            <HighchartsGridPro
              options={wonGridOptions}
              className="sp-pipeline-grid h-[220px]"
            />
          </CardContent>
        </Card>

        {/* Pipeline deals — col-span-3 */}
        <Card className="col-span-5 xl:col-span-3 gap-0 py-0">
          <CardHeader className="p-5 pb-2">
            <CardTitle className="text-base">In the Pipe</CardTitle>
            <CardDescription>Active opportunities by stage</CardDescription>
          </CardHeader>
          <CardContent className="p-0 pb-2">
            <HighchartsGridPro
              options={pipelineGridOptions}
              className="sp-pipeline-grid h-[350px]"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
