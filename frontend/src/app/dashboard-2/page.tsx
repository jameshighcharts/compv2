"use client"

import * as React from "react"
import {
  IconFilter,
  IconFileDescription,
  IconReportMoney,
  IconClipboardCheck,
  IconUserFilled,
  IconReceiptFilled,
  IconDots,
  IconArrowNarrowRight,
} from "@tabler/icons-react"
import { ArrowUpRight, ArrowDownRight, TrendingUp } from "lucide-react"

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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DashboardHighchart,
  createBaseChartOptions,
  mergeSeriesColors,
} from "@/components/ui/highcharts"

const statCards = [
  {
    title: "Total Sales",
    icon: IconReportMoney,
    value: "$4,523,189",
    badge: "10.2%",
    positive: true,
    change: "+1,454.89 today",
    iconColor: "bg-indigo-600/25 text-indigo-600",
  },
  {
    title: "Total Orders",
    icon: IconClipboardCheck,
    value: "12,545",
    badge: "20.2%",
    positive: true,
    change: "+1,589 today",
    iconColor: "bg-indigo-600/25 text-indigo-600",
  },
  {
    title: "Total Visitors",
    icon: IconUserFilled,
    value: "8,344",
    badge: "14.2%",
    positive: false,
    change: "-89 today",
    iconColor: "bg-indigo-600/25 text-indigo-600",
  },
  {
    title: "Refunded",
    icon: IconReceiptFilled,
    value: "3,148",
    badge: "12.6%",
    positive: true,
    change: "+48 today",
    iconColor: "bg-emerald-600/25 text-emerald-600",
  },
]

const revenueData = [
  { month: "Jan", desktop: 186, mobile: 80 },
  { month: "Feb", desktop: 305, mobile: 200 },
  { month: "Mar", desktop: 237, mobile: 120 },
  { month: "Apr", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "Jun", desktop: 214, mobile: 140 },
]

const recentActivity = [
  { name: "Jessica Mills", email: "jessica@example.com", initials: "Je", status: "Invited", id: "#329341", date: "5 min ago", amount: "$320.00" },
  { name: "Andrew Quinn", email: "andrew@example.com", initials: "An", status: "Suspended", id: "#412893", date: "12 min ago", amount: "$185.50" },
  { name: "Marcus Chen", email: "marcus@example.com", initials: "Ma", status: "New", id: "#520134", date: "24 min ago", amount: "$462.00" },
  { name: "Lauren Park", email: "lauren@example.com", initials: "La", status: "Delete", id: "#238476", date: "35 min ago", amount: "$729.99" },
  { name: "David Ross", email: "david@example.com", initials: "Da", status: "New", id: "#615920", date: "48 min ago", amount: "$153.25" },
]

const visitorData = [
  { name: "Chrome", y: 275, color: "var(--chart-1)" },
  { name: "Safari", y: 200, color: "var(--chart-2)" },
  { name: "Firefox", y: 287, color: "var(--chart-3)" },
  { name: "Edge", y: 173, color: "var(--chart-4)" },
  { name: "Other", y: 190, color: "var(--chart-5)" },
]

const formatInteger = (value: number): string =>
  new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(value)

const totalVisitors = visitorData.reduce((sum, item) => sum + item.y, 0)

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Invited: "border text-foreground rounded-full px-2 py-[4px] text-[11px] leading-none font-semibold",
    Suspended: "bg-orange-500/10 border-orange-500/30 text-orange-600 dark:text-orange-400 rounded-full px-2 py-[4px] text-[11px] leading-none font-semibold",
    New: "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 rounded-full px-2 py-[4px] text-[11px] leading-none font-semibold",
    Delete: "bg-destructive/10 border-destructive/30 text-destructive rounded-full px-2 py-[4px] text-[11px] leading-none font-semibold",
  }
  return <span className={`inline-flex items-center ${styles[status]}`}>{status}</span>
}

export default function Dashboard2() {
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
          ["var(--chart-1)", "var(--chart-2)"],
        ),
      }),
    [],
  )

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
  )

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

      <div className="mt-4 grid grid-cols-6 gap-5 lg:grid-cols-12">
        <div className="col-span-6 grid grid-cols-6 gap-4">
          {statCards.map((card) => (
            <div key={card.title} className="col-span-3">
              <Card className="h-full w-full">
                <CardHeader className="flex flex-row items-center justify-between p-4">
                  <div className="flex items-center gap-2">
                    <div className={`flex h-6 w-6 items-center justify-center rounded-full ${card.iconColor}`}>
                      <card.icon className="size-3.5" />
                    </div>
                    <span className="text-sm font-medium">{card.title}</span>
                  </div>
                  <IconDots className="size-4 text-muted-foreground" />
                </CardHeader>
                <CardContent className="px-4 pb-4 pt-0">
                  <div className="text-2xl font-bold">{card.value}</div>
                  <div className="mt-1 flex items-center gap-1.5">
                    <span className={`inline-flex items-center gap-0.5 text-xs font-medium ${card.positive ? "text-emerald-400" : "text-red-500"}`}>
                      {card.positive ? <ArrowUpRight className="size-3" /> : <ArrowDownRight className="size-3" />}
                      {card.badge}
                    </span>
                    <span className="text-xs text-muted-foreground">{card.change}</span>
                  </div>
                  <div className="my-3 h-[0.04px] w-full bg-muted-foreground opacity-50" />
                  <a href="#" className="flex items-center gap-1 text-xs font-medium">
                    View Report <IconArrowNarrowRight className="size-[18px]" />
                  </a>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        <div className="col-span-6">
          <Card>
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
            <CardContent>
              <DashboardHighchart options={revenueChartOptions} className="h-[250px] w-full" />
            </CardContent>
          </Card>
        </div>

        <div className="col-span-6 lg:col-span-8">
          <Card>
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
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentActivity.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="size-8">
                            <AvatarFallback className="text-xs">{row.initials}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium leading-none">{row.name}</p>
                            <p className="text-xs text-muted-foreground">{row.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell><StatusBadge status={row.status} /></TableCell>
                      <TableCell className="text-sm">{row.id}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{row.date}</TableCell>
                      <TableCell className="text-right text-sm">{row.amount}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="justify-center">
              <p className="text-center text-sm text-muted-foreground">A list of your recent activity.</p>
            </CardFooter>
          </Card>
        </div>

        <div className="col-span-6 lg:col-span-4">
          <Card className="flex flex-col">
            <CardHeader className="items-center pb-0">
              <CardTitle>Total Visitor - Chart</CardTitle>
              <CardDescription>January - June 2024</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
              <DashboardHighchart options={visitorChartOptions} className="mx-auto aspect-square max-h-[250px]" />
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
      </div>
    </div>
  )
}
