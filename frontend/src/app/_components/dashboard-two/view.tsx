"use client";

import * as React from "react";
import { IconFileDescription, IconFilter } from "@tabler/icons-react";
import { TrendingUp } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DashboardHighchart, chartColor, createBaseChartOptions, mergeSeriesColors } from "@/components/ui/highcharts";
import { HighchartsGridPro } from "@/components/ui/highcharts-grid-pro";

import { DashboardTwoStatCard } from "./cards";
import { formatInteger, recentActivity, revenueData, statCards, totalVisitors, visitorData } from "./data";

export function DashboardTwoView() {
  const revenueChartOptions = React.useMemo(
    () =>
      createBaseChartOptions({
        chart: {
          type: "column",
          height: 250,
        },
        xAxis: {
          categories: revenueData.map((item) => item.month),
          tickLength: 0,
        },
        yAxis: {
          title: {
            text: undefined,
          },
          gridLineDashStyle: "Dash",
        },
        tooltip: {
          shared: true,
        },
        legend: {
          enabled: true,
        },
        plotOptions: {
          series: {
            animation: false,
          },
          column: {
            borderWidth: 0,
            borderRadius: 4,
          },
        },
        series: mergeSeriesColors(
          [
            {
              type: "column",
              name: "Desktop",
              data: revenueData.map((item) => item.desktop),
            },
            {
              type: "column",
              name: "Mobile",
              data: revenueData.map((item) => item.mobile),
            },
          ],
          [chartColor(0), chartColor(1)],
        ),
      }),
    [],
  );

  const visitorChartOptions = React.useMemo(
    () =>
      createBaseChartOptions({
        chart: {
          type: "pie",
          height: 250,
        },
        title: {
          text: formatInteger(totalVisitors),
          align: "center",
          verticalAlign: "middle",
          y: 10,
          style: {
            color: "var(--foreground)",
            fontSize: "30px",
            fontWeight: "700",
          },
        },
        subtitle: {
          text: "Visitors",
          align: "center",
          verticalAlign: "middle",
          y: 34,
          style: {
            color: "var(--muted-foreground)",
          },
        },
        legend: {
          enabled: false,
        },
        tooltip: {
          pointFormat: "<b>{point.y}</b>",
        },
        plotOptions: {
          series: {
            animation: false,
          },
          pie: {
            innerSize: "60%",
            borderColor: "var(--background)",
            borderWidth: 5,
            dataLabels: {
              enabled: false,
            },
          },
        },
        series: [
          {
            type: "pie",
            name: "Visitors",
            data: visitorData,
          },
        ],
      }),
    [],
  );

  const recentActivityGridOptions = React.useMemo(
    () => ({
      accessibility: {
        enabled: false,
      },
      pagination: {
        enabled: false,
      },
      rendering: {
        theme: "hcg-theme-default",
        rows: {
          strictHeights: true,
          minVisibleRows: 5,
        },
        columns: {
          resizing: {
            enabled: false,
          },
        },
      },
      credits: {
        enabled: false,
      },
      columnDefaults: {
        sorting: {
          enabled: false,
        },
        cells: {
          className: "ra-grid-cell",
        },
      },
      columns: [
        {
          id: "user",
          header: {
            format: "User",
          },
          width: "44%",
          cells: {
            className: "ra-grid-cell ra-user-cell",
            formatter: function () {
              return String((this as { value?: unknown }).value ?? "");
            },
          },
        },
        {
          id: "status",
          header: {
            format: "Status",
          },
          width: "16%",
          cells: {
            className: "ra-grid-cell",
            formatter: function () {
              const status = String((this as { value?: unknown }).value ?? "");
              const toneClass =
                status === "Invited"
                  ? "ra-status-invited"
                  : status === "Suspended"
                    ? "ra-status-suspended"
                    : status === "Delete"
                      ? "ra-status-delete"
                      : "ra-status-new";

              return `<span class="ra-status-badge ${toneClass}">${status}</span>`;
            },
          },
        },
        {
          id: "id",
          header: {
            format: "ID",
          },
          width: "14%",
          cells: {
            className: "ra-grid-cell ra-meta-cell",
          },
        },
        {
          id: "date",
          header: {
            format: "Date",
          },
          width: "13%",
          cells: {
            className: "ra-grid-cell ra-meta-cell",
          },
        },
        {
          id: "amount",
          header: {
            format: "Amount",
          },
          width: "13%",
          cells: {
            className: "ra-grid-cell ra-amount-cell",
          },
        },
      ],
      dataTable: {
        columns: {
          user: recentActivity.map(
            (row) =>
              `<div class="ra-user">
                <span class="ra-user-avatar">${row.initials}</span>
                <span class="ra-user-copy">
                  <span class="ra-user-name">${row.name}</span>
                  <span class="ra-user-email">${row.email}</span>
                </span>
              </div>`,
          ),
          status: recentActivity.map((row) => row.status),
          id: recentActivity.map((row) => row.id),
          date: recentActivity.map((row) => row.date),
          amount: recentActivity.map((row) => row.amount),
        },
      },
    }),
    [],
  );

  return (
    <div>
      <div className="flex flex-col items-start justify-between gap-2 md:flex-row">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Here&apos;re the details of your analysis.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <IconFilter className="mr-2 size-4" />
            Filter By
          </Button>
          <Button size="sm">
            <IconFileDescription className="mr-2 size-4" />
            Export
          </Button>
        </div>
      </div>

      <div className="mt-2 grid grid-cols-6 items-stretch gap-5 lg:grid-cols-12">
        <div className="col-span-6 grid auto-rows-fr grid-cols-6 gap-4">
          {statCards.map((card) => (
            <div key={card.title} className="col-span-3">
              <DashboardTwoStatCard card={card} />
            </div>
          ))}
        </div>

        <div className="col-span-6">
          <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Revenue</CardTitle>
                <div className="mt-1 flex items-center gap-2">
                  <span className="text-3xl font-bold">$14,324</span>
                  <span className="rounded-xl bg-emerald-500 px-[5px] py-[2px] text-[10px] font-medium text-white">+10%</span>
                </div>
              </div>
              <Select defaultValue="year">
                <SelectTrigger className="w-[90px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="year">Year</SelectItem>
                  <SelectItem value="month">Month</SelectItem>
                  <SelectItem value="week">Week</SelectItem>
                </SelectContent>
              </Select>
            </CardHeader>
            <CardContent className="pb-6">
              <DashboardHighchart options={revenueChartOptions} className="h-[260px] w-full" />
            </CardContent>
          </Card>
        </div>

        <div className="col-span-6 lg:col-span-8">
          <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Activity</CardTitle>
              <Select defaultValue="period">
                <SelectTrigger className="w-[100px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="period">Period</SelectItem>
                  <SelectItem value="day">Day</SelectItem>
                  <SelectItem value="week">Week</SelectItem>
                  <SelectItem value="month">Month</SelectItem>
                </SelectContent>
              </Select>
            </CardHeader>
            <CardContent className="pt-0">
              <HighchartsGridPro
                options={recentActivityGridOptions}
                className="ra-activity-grid h-[300px]"
              />
            </CardContent>
            <CardFooter className="justify-center pt-0">
              <p className="text-center text-sm text-muted-foreground">A list of your recent activity.</p>
            </CardFooter>
          </Card>
        </div>

        <div className="col-span-6 lg:col-span-4">
          <Card className="flex h-full flex-col">
            <CardHeader className="items-center pb-0">
              <CardTitle>Total Visitor - Chart</CardTitle>
              <CardDescription>January - June 2024</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-1 items-center pb-0">
              <DashboardHighchart options={visitorChartOptions} className="mx-auto h-[250px] w-full max-w-[280px]" />
            </CardContent>
            <CardFooter className="mt-auto flex-col gap-2 text-sm">
              <div className="flex items-center gap-2 font-medium leading-none">
                Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
              </div>
              <div className="leading-none text-muted-foreground">
                Showing total visitors for the last 6 months
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
