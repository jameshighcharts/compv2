"use client";

import * as React from "react";
import { IconArrowDownRight, IconArrowUpRight, IconInfoCircle } from "@tabler/icons-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardHighchart, chartColor, createBaseChartOptions, mergeSeriesColors } from "@/components/ui/highcharts";

import {
  channelPartnerBarData,
  directRevenueBarData,
  licenseOwnersBarData,
  salesRevenueKpiCards,
  srBarMonths,
  srGaugeItems,
  srGaugeTargets,
  totalRevenueBarData,
} from "./data";

const buildSalesRevenueBarOptions = (
  series: Array<{ name: string; data: number[] }>,
  colors: string[],
  expected: (number | null)[],
) =>
  createBaseChartOptions({
    chart: { type: "column", height: 290, spacing: [8, 4, 8, 4] },
    xAxis: { categories: srBarMonths, tickLength: 0, labels: { style: { fontSize: "12px" } } },
    yAxis: {
      title: { text: undefined },
      gridLineDashStyle: "Dash",
      labels: { style: { fontSize: "12px" } },
    },
    legend: { enabled: true, itemStyle: { fontSize: "12px", fontWeight: "500" }, margin: 6 },
    tooltip: { shared: true },
    plotOptions: {
      column: { borderWidth: 0, borderRadius: 2, pointPadding: 0.03, groupPadding: 0.06 },
      series: { animation: false },
    },
    series: [
      {
        type: "column" as const,
        name: "Expected",
        data: expected,
        color: "rgba(148, 163, 184, 0.22)",
        grouping: false,
        borderWidth: 0,
        borderRadius: 3,
        animation: false,
      },
      ...mergeSeriesColors(
        series.map((entry) => ({
          type: "column" as const,
          name: entry.name,
          data: entry.data,
          stacking: "normal" as const,
        })),
        colors,
      ),
    ],
  });

const buildGaugeOptions = (value: number, previous: number, label: string) => {
  return {
    chart: {
      type: "gauge",
      height: 250,
      backgroundColor: "transparent",
      style: { fontFamily: "inherit" },
      spacing: [0, 0, 0, 0],
      margin: [0, 0, 0, 0],
    },
    title: { text: undefined },
    subtitle: { text: undefined },
    credits: { enabled: false },
    accessibility: { enabled: false },
    exporting: { enabled: false },
    tooltip: { enabled: false },
    pane: {
      startAngle: -90,
      endAngle: 89.9,
      center: ["50%", "80%"],
      size: "140%",
      background: [{ backgroundColor: "transparent", borderWidth: 0 }],
    },
    yAxis: {
      min: 0,
      max: srGaugeTargets.max,
      minorTicks: false,
      lineWidth: 0,
      gridLineWidth: 0,
      tickPositions: [srGaugeTargets.base, srGaugeTargets.budget, srGaugeTargets.high, srGaugeTargets.max],
      tickLength: 23,
      tickWidth: 1.5,
      tickColor: "#ffffff",
      labels: {
        enabled: true,
        distance: 18,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        formatter: function (this: any) { return `$${this.value}M`; },
        style: { fontSize: "13px", fontWeight: "600", color: "var(--foreground)", textOutline: "none" },
      },
      plotBands: [
        { from: 0, to: srGaugeTargets.base, color: "#e2e8f0", thickness: 23 },
        { from: srGaugeTargets.base, to: srGaugeTargets.budget, color: "#F19E53", thickness: 23 },
        { from: srGaugeTargets.budget, to: srGaugeTargets.high, color: "#A3EDBA", thickness: 23 },
        { from: srGaugeTargets.high, to: srGaugeTargets.max, color: "#8087E8", thickness: 23 },
      ],
    },
    series: [
      {
        type: "gauge" as const,
        name: "Previous",
        data: [previous],
        dial: {
          radius: "80%",
          baseWidth: 4,
          baseLength: "0%",
          rearLength: "0%",
          backgroundColor: "rgba(100,116,139,0.3)",
          borderColor: "rgba(100,116,139,0.3)",
          borderWidth: 1,
        },
        pivot: { radius: 4, backgroundColor: "rgba(100,116,139,0.3)" },
        dataLabels: { enabled: false },
      },
      {
        type: "gauge" as const,
        name: "Current",
        data: [value],
        dial: {
          radius: "82%",
          baseWidth: 6,
          baseLength: "0%",
          rearLength: "0%",
          backgroundColor: "#475569",
          borderColor: "#475569",
          borderWidth: 0,
        },
        pivot: { radius: 5, backgroundColor: "#475569" },
        dataLabels: {
          enabled: true,
          y: 10,
          useHTML: true,
          borderWidth: 0,
          backgroundColor: "transparent",
          style: { textOutline: "none" },
          formatter: () =>
            `<div style="text-align:center"><span style="font-size:28px;font-weight:700">${label}</span></div>`,
        },
      },
    ],
  };
};

export function DashboardSalesRevenueTab() {
  const licenseOwnerOpts = React.useMemo(
    () =>
      buildSalesRevenueBarOptions(licenseOwnersBarData.series, [
        chartColor(0),
        chartColor(2),
        chartColor(1),
        chartColor(3),
      ], licenseOwnersBarData.expected),
    [],
  );

  const directRevenueOpts = React.useMemo(
    () =>
      buildSalesRevenueBarOptions(directRevenueBarData.series, [
        chartColor(0),
        chartColor(2),
        chartColor(1),
      ], directRevenueBarData.expected),
    [],
  );

  const totalRevenueOpts = React.useMemo(
    () =>
      buildSalesRevenueBarOptions(totalRevenueBarData.series, [
        chartColor(0),
        chartColor(2),
        chartColor(1),
        chartColor(3),
      ], totalRevenueBarData.expected),
    [],
  );

  const channelPartnerOpts = React.useMemo(
    () =>
      buildSalesRevenueBarOptions(channelPartnerBarData.series, [
        chartColor(0),
        chartColor(2),
        chartColor(1),
      ], channelPartnerBarData.expected),
    [],
  );

  const srGauge0Opts = React.useMemo(
    () => buildGaugeOptions(srGaugeItems[0].value, srGaugeItems[0].previous, srGaugeItems[0].label),
    [],
  );

  const srGauge1Opts = React.useMemo(
    () => buildGaugeOptions(srGaugeItems[1].value, srGaugeItems[1].previous, srGaugeItems[1].label),
    [],
  );

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {salesRevenueKpiCards.map((kpi) => (
          <Card key={kpi.title} className="w-full gap-0 py-0">
            <CardContent className="flex items-center justify-between gap-3 px-5 py-5">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <div className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: kpi.color }} />
                  <span className="truncate text-sm font-medium text-muted-foreground">{kpi.title}</span>
                </div>
                <div className="mt-2 text-2xl font-bold">{kpi.value}</div>
                <div className="mt-1 flex items-center gap-1">
                  <span className={`inline-flex items-center gap-0.5 text-sm font-medium ${kpi.positive ? "text-emerald-500" : "text-red-500"}`}>
                    {kpi.positive ? <IconArrowUpRight className="size-3.5" /> : <IconArrowDownRight className="size-3.5" />}
                    {kpi.badge}
                  </span>
                  <span className="text-sm text-muted-foreground">{kpi.change}</span>
                </div>
              </div>
              <IconInfoCircle className="size-4 shrink-0 text-muted-foreground" />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="flex flex-1 flex-col rounded-2xl border bg-card px-5 pb-3 pt-4 shadow-sm">
          <p className="text-sm font-semibold text-foreground">{srGaugeItems[0].title}</p>
          <DashboardHighchart options={srGauge0Opts} className="h-[250px] w-full" />
          <div className="mt-0.5 flex justify-center gap-4 text-[11px] text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-[2px] w-4 rounded-full bg-slate-500" />
              Current
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-[2px] w-4 rounded-full bg-slate-400 opacity-40" />
              Previous
            </span>
          </div>
          <p className="mt-1 text-center text-[13px] font-medium text-foreground">
            {Math.round((srGaugeItems[0].value / srGaugeItems[0].target) * 100)}% of target reached
          </p>
          <p className="mt-0.5 text-center text-[13px] text-muted-foreground">{srGaugeItems[0].subtitle}</p>
        </div>

        <Card className="gap-0 py-0">
          <CardHeader className="flex flex-row items-center justify-between p-4 pb-0">
            <CardTitle className="text-base font-semibold">License Owners</CardTitle>
            <span className={`text-sm font-bold ${licenseOwnersBarData.positive ? "text-emerald-500" : "text-red-500"}`}>
              {licenseOwnersBarData.badge}
            </span>
          </CardHeader>
          <CardContent className="p-2">
            <DashboardHighchart options={licenseOwnerOpts} className="h-[290px] w-full" />
          </CardContent>
        </Card>

        <Card className="gap-0 py-0">
          <CardHeader className="flex flex-row items-center justify-between p-4 pb-0">
            <CardTitle className="text-base font-semibold">Direct Revenue</CardTitle>
            <span className={`text-sm font-bold ${directRevenueBarData.positive ? "text-emerald-500" : "text-red-500"}`}>
              {directRevenueBarData.badge}
            </span>
          </CardHeader>
          <CardContent className="p-2">
            <DashboardHighchart options={directRevenueOpts} className="h-[290px] w-full" />
          </CardContent>
        </Card>

        <div className="flex flex-1 flex-col rounded-2xl border bg-card px-5 pb-3 pt-4 shadow-sm">
          <p className="text-sm font-semibold text-foreground">{srGaugeItems[1].title}</p>
          <DashboardHighchart options={srGauge1Opts} className="h-[250px] w-full" />
          <div className="mt-0.5 flex justify-center gap-4 text-[11px] text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-[2px] w-4 rounded-full bg-slate-500" />
              Current
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-[2px] w-4 rounded-full bg-slate-400 opacity-40" />
              Previous
            </span>
          </div>
          <p className="mt-1 text-center text-[13px] font-medium text-foreground">
            {Math.round((srGaugeItems[1].value / srGaugeItems[1].target) * 100)}% of target reached
          </p>
          <p className="mt-0.5 text-center text-[13px] text-muted-foreground">{srGaugeItems[1].subtitle}</p>
        </div>

        <Card className="gap-0 py-0">
          <CardHeader className="flex flex-row items-center justify-between p-4 pb-0">
            <CardTitle className="text-base font-semibold">Total Revenue</CardTitle>
            <span className={`text-sm font-bold ${totalRevenueBarData.positive ? "text-emerald-500" : "text-red-500"}`}>
              {totalRevenueBarData.badge}
            </span>
          </CardHeader>
          <CardContent className="p-2">
            <DashboardHighchart options={totalRevenueOpts} className="h-[290px] w-full" />
          </CardContent>
        </Card>

        <Card className="gap-0 py-0">
          <CardHeader className="flex flex-row items-center justify-between p-4 pb-0">
            <CardTitle className="text-base font-semibold">Channel Partner Revenue</CardTitle>
            <span className={`text-sm font-bold ${channelPartnerBarData.positive ? "text-emerald-500" : "text-red-500"}`}>
              {channelPartnerBarData.badge}
            </span>
          </CardHeader>
          <CardContent className="p-2">
            <DashboardHighchart options={channelPartnerOpts} className="h-[290px] w-full" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
