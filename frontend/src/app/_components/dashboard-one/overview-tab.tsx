"use client";

import * as React from "react";

import { DashboardHighchart, chartColor, createBaseChartOptions, mergeSeriesColors } from "@/components/ui/highcharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { ArrKpiCard } from "./cards";
import { arrOverviewKpis, arrRevenueBreakdownData, arrSubscriptionsData } from "./data";

export function DashboardOverviewTab() {
  const arrRevenueChartOptions = React.useMemo(
    () =>
      createBaseChartOptions({
        chart: {
          type: "line",
          height: 300,
          spacing: [12, 6, 0, 4],
        },
        legend: {
          enabled: true,
          align: "left",
          verticalAlign: "top",
          layout: "horizontal",
        },
        xAxis: {
          categories: arrRevenueBreakdownData.map((point) => point.month),
          tickLength: 0,
        },
        yAxis: {
          title: {
            text: undefined,
          },
          labels: {
            format: "${value}k",
          },
          gridLineDashStyle: "Dash",
        },
        tooltip: {
          shared: true,
          pointFormat:
            '<span style="color:{series.color}">\u25CF</span> {series.name}: <b>${point.y:,.0f}k</b><br/>',
        },
        plotOptions: {
          series: {
            animation: false,
            marker: {
              enabled: false,
            },
            lineWidth: 3,
          },
        },
        series: mergeSeriesColors(
          [
            {
              type: "line",
              name: "Annual ARR",
              data: arrRevenueBreakdownData.map((point) => point.annual),
            },
            {
              type: "line",
              name: "ADV ARR",
              data: arrRevenueBreakdownData.map((point) => point.adv),
            },
          ],
          [chartColor(0), chartColor(2)],
        ),
      }),
    [],
  );

  const arrSubscriptionsStackedOptions = React.useMemo(
    () =>
      createBaseChartOptions({
        chart: {
          type: "column",
          height: 300,
          spacing: [12, 6, 0, 4],
        },
        legend: {
          enabled: true,
          align: "left",
          verticalAlign: "top",
          layout: "horizontal",
        },
        xAxis: {
          categories: arrSubscriptionsData.map((point) => point.month),
          tickLength: 0,
        },
        yAxis: {
          title: {
            text: undefined,
          },
          labels: {
            format: "{value}",
          },
          gridLineDashStyle: "Dash",
        },
        tooltip: {
          shared: true,
        },
        plotOptions: {
          series: {
            animation: false,
          },
          column: {
            stacking: "normal",
            borderWidth: 0,
            borderRadius: 4,
            pointPadding: 0.15,
            groupPadding: 0.1,
          },
        },
        series: mergeSeriesColors(
          [
            {
              type: "column",
              name: "New",
              data: arrSubscriptionsData.map((point) => point.new),
            },
            {
              type: "column",
              name: "Renewed",
              data: arrSubscriptionsData.map((point) => point.renewed),
            },
          ],
          [chartColor(0), chartColor(1)],
        ),
      }),
    [],
  );

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {arrOverviewKpis.map((kpi) => (
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

      <div className="grid gap-4 lg:grid-cols-5">
        <Card className="gap-0 py-0 lg:col-span-3">
          <CardHeader className="p-6 pb-3">
            <CardTitle>Revenue</CardTitle>
            <CardDescription>ARR broken down in Annual and ADV over time.</CardDescription>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <DashboardHighchart options={arrRevenueChartOptions} className="h-[300px] w-full" />
          </CardContent>
        </Card>

        <Card className="gap-0 py-0 lg:col-span-2">
          <CardHeader className="p-6 pb-3">
            <CardTitle>Subscriptions</CardTitle>
            <CardDescription>Stacked New and Renewed subscriptions over time.</CardDescription>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <DashboardHighchart options={arrSubscriptionsStackedOptions} className="h-[300px] w-full" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
