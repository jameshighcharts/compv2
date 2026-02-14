"use client"

import * as React from "react"
import {
  IconFilter,
  IconClipboardData,
  IconTrendingUp,
  IconTrendingDown,
  IconFile,
  IconCircle,
} from "@tabler/icons-react"
import { Eye, TrendingUp } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DashboardHighchart,
  createBaseChartOptions,
  mergeSeriesColors,
} from "@/components/ui/highcharts"
import { DatePicker } from "@/components/ui/date-picker"

function generateBudgetData() {
  const data = []
  const startTimestamp = Date.UTC(2024, 3, 1)
  for (let i = 0; i < 30; i++) {
    const date = new Date(startTimestamp + i * 3 * 24 * 60 * 60 * 1000)
    data.push({
      date: date.toISOString().split("T")[0],
      desktop: 120 + ((i * 73) % 380),
      mobile: 110 + ((i * 61 + 29) % 360),
    })
  }
  return data
}
const budgetData = generateBudgetData()

const totalDesktop = budgetData.reduce((sum, item) => sum + item.desktop, 0)
const totalMobile = budgetData.reduce((sum, item) => sum + item.mobile, 0)

const metricCards = [
  { title: "Session", icon: IconClipboardData, iconColor: "text-blue-500", value: "6,132", badge: "%90", positive: true },
  { title: "Page Views", icon: Eye, iconColor: "text-teal-500", value: "11,236", badge: "%40", positive: false },
  { title: "Average", icon: IconFile, iconColor: "text-orange-500", value: "46", badge: "%22", positive: true },
  { title: "Bounce Rate", icon: IconCircle, iconColor: "text-pink-500", value: "6,132", badge: "%30", positive: false },
]

const radarData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
]

const overviewData = [
  { month: "Jan", desktop: 186, mobile: 80 },
  { month: "Feb", desktop: 305, mobile: 200 },
  { month: "Mar", desktop: 237, mobile: 120 },
  { month: "Apr", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "Jun", desktop: 214, mobile: 140 },
]

const formatInteger = (value: number): string =>
  new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(value)

export default function Dashboard3() {
  const [activeChart, setActiveChart] = React.useState<"desktop" | "mobile">("desktop")

  const budgetChartOptions = React.useMemo(
    () =>
      createBaseChartOptions({
        chart: {
          type: "column",
          height: 250,
        },
        legend: {
          enabled: false,
        },
        xAxis: {
          categories: budgetData.map((item) => {
            const date = new Date(item.date)
            return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
          }),
          tickLength: 0,
        },
        yAxis: {
          title: {
            text: undefined,
          },
          gridLineColor: "var(--border)",
        },
        tooltip: {
          formatter() {
            const dateLabel = String(this.x ?? "")
            return `<span>${dateLabel}</span><br/><b>${this.series.name}: ${formatInteger(Number(this.y))}</b>`
          },
        },
        plotOptions: {
          series: {
            animation: false,
          },
          column: {
            borderWidth: 0,
          },
        },
        series: [
          {
            type: "column",
            name: activeChart === "desktop" ? "Desktop" : "Mobile",
            color: activeChart === "desktop" ? "var(--chart-1)" : "var(--chart-2)",
            data: budgetData.map((item) => item[activeChart]),
          },
        ],
      }),
    [activeChart],
  )

  const radialChartOptions = React.useMemo(
    () =>
      createBaseChartOptions({
        chart: {
          type: "pie",
          height: 250,
        },
        title: {
          text: "1,260",
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
          enabled: false,
        },
        plotOptions: {
          series: {
            animation: false,
          },
          pie: {
            startAngle: -90,
            endAngle: 160,
            center: ["50%", "55%"],
            innerSize: "72%",
            borderWidth: 0,
            dataLabels: {
              enabled: false,
            },
          },
        },
        series: [
          {
            type: "pie",
            data: [
              { name: "Visitors", y: 1260, color: "var(--chart-2)" },
              { name: "Remaining", y: 340, color: "var(--muted)" },
            ],
          },
        ],
      }),
    [],
  )

  const radarChartOptions = React.useMemo(
    () =>
      createBaseChartOptions({
        chart: {
          polar: true,
          type: "area",
          height: 250,
        },
        legend: {
          enabled: false,
        },
        pane: {
          size: "80%",
        },
        xAxis: {
          categories: radarData.map((item) => item.month),
          tickmarkPlacement: "on",
          lineWidth: 0,
        },
        yAxis: {
          gridLineInterpolation: "polygon",
          lineWidth: 0,
          min: 0,
          title: {
            text: undefined,
          },
        },
        tooltip: {
          shared: true,
        },
        plotOptions: {
          series: {
            animation: false,
            pointPlacement: "on",
          },
          area: {
            marker: {
              enabled: false,
            },
            lineWidth: 1,
          },
        },
        series: mergeSeriesColors(
          [
            {
              type: "area",
              name: "Desktop",
              data: radarData.map((item) => item.desktop),
              fillOpacity: 0.5,
            },
            {
              type: "area",
              name: "Mobile",
              data: radarData.map((item) => item.mobile),
              fillOpacity: 0.5,
            },
          ],
          ["var(--chart-1)", "var(--chart-2)"],
        ),
      }),
    [],
  )

  const overviewChartOptions = React.useMemo(
    () =>
      createBaseChartOptions({
        chart: {
          type: "column",
          height: 250,
        },
        xAxis: {
          categories: overviewData.map((item) => item.month),
          tickLength: 0,
        },
        yAxis: {
          title: {
            text: undefined,
          },
          gridLineColor: "var(--border)",
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
            stacking: "normal",
            borderWidth: 0,
          },
        },
        series: mergeSeriesColors(
          [
            {
              type: "column",
              name: "Desktop",
              data: overviewData.map((item) => item.desktop),
              stack: "overview",
            },
            {
              type: "column",
              name: "Mobile",
              data: overviewData.map((item) => item.mobile),
              stack: "overview",
            },
          ],
          ["var(--chart-1)", "var(--chart-2)"],
        ),
      }),
    [],
  )

  return (
    <div>
      <div className="flex flex-col items-start justify-between gap-2 md:flex-row">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Overview Dashboard</h1>
          <p className="text-muted-foreground">Here, take a look at your sales.</p>
        </div>
        <div className="flex items-center gap-2">
          <DatePicker />
          <Button size="sm">
            <IconFilter className="mr-2 size-4" />
            Filter By
          </Button>
        </div>
      </div>

      <div className="mt-4 grid auto-rows-auto grid-cols-12 gap-5">
        <div className="col-span-12 xl:col-span-8">
          <Card>
            <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
              <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
                <CardTitle>Budgets - Consolidated</CardTitle>
                <CardDescription>Showing total budgets for the last 3 months</CardDescription>
              </div>
              <div className="flex">
                {(["desktop", "mobile"] as const).map((key) => (
                  <button
                    key={key}
                    data-active={activeChart === key}
                    className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
                    onClick={() => setActiveChart(key)}
                  >
                    <span className="text-xs text-muted-foreground">
                      {key === "desktop" ? "Desktop" : "Mobile"}
                    </span>
                    <span className="text-lg font-bold leading-none sm:text-3xl">
                      {key === "desktop" ? formatInteger(totalDesktop) : formatInteger(totalMobile)}
                    </span>
                  </button>
                ))}
              </div>
            </CardHeader>
            <CardContent className="px-2 sm:p-6">
              <DashboardHighchart options={budgetChartOptions} className="aspect-auto h-[250px] w-full" />
            </CardContent>
          </Card>
        </div>

        <div className="col-span-12 lg:col-span-6 xl:col-span-4">
          <Card className="flex flex-col">
            <CardHeader className="items-center pb-0">
              <CardTitle>Total Visitors Chart - Shape</CardTitle>
              <CardDescription>January - June 2024</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-1 items-center pb-0">
              <DashboardHighchart options={radialChartOptions} className="mx-auto aspect-square w-full max-w-[250px]" />
            </CardContent>
            <CardFooter className="flex-col gap-2 text-sm">
              <div className="flex items-center gap-2 font-medium leading-none">
                Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
              </div>
              <div className="leading-none text-muted-foreground">
                Showing total visitors for the last 6 months
              </div>
            </CardFooter>
          </Card>
        </div>

        <div className="col-span-12 grid grid-cols-4 gap-5 lg:col-span-6 xl:col-span-5">
          {metricCards.map((card) => (
            <div key={card.title} className="col-span-2">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2 pt-4">
                  <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                  <span className="inline-flex items-center rounded-full border bg-secondary p-1 text-xs font-semibold text-secondary-foreground">
                    <card.icon className={`size-4 ${card.iconColor}`} />
                  </span>
                </CardHeader>
                <CardContent className="pb-4 pt-0">
                  <h2 className="text-2xl font-bold">{card.value}</h2>
                  <div className="mt-1 flex items-center gap-1">
                    <span className={`text-xs font-medium ${card.positive ? "text-emerald-500" : "text-red-500"}`}>
                      {card.badge}
                    </span>
                    {card.positive ? (
                      <IconTrendingUp className="size-4 text-emerald-500" />
                    ) : (
                      <IconTrendingDown className="size-4 text-red-500" />
                    )}
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">vs Previous 30 Days</p>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        <div className="col-span-12 lg:col-span-6 xl:col-span-4">
          <Card>
            <CardHeader>
              <CardTitle>Sales By Month</CardTitle>
              <CardDescription>Showing total sales for the last 6 months</CardDescription>
            </CardHeader>
            <CardContent className="pb-0">
              <DashboardHighchart options={radarChartOptions} className="mx-auto aspect-square max-h-[250px]" />
            </CardContent>
          </Card>
        </div>

        <div className="col-span-12 lg:col-span-6 xl:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>Overview</CardTitle>
              <CardDescription>January - June 2024</CardDescription>
            </CardHeader>
            <CardContent>
              <DashboardHighchart options={overviewChartOptions} className="h-[250px] w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
