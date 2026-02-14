"use client"

import * as React from "react"
import {
  IconFileDescription,
  IconChartLine,
  IconChartBar,
  IconFileAnalytics,
  IconBell,
  IconInfoCircle,
  IconArrowUpRight,
  IconArrowDownRight,
} from "@tabler/icons-react"
import {
  ArrowUpDown,
  ChevronDown,
  MoreHorizontal,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DashboardHighchart,
  createBaseChartOptions,
  createSparklineOptions,
  mergeSeriesColors,
} from "@/components/ui/highcharts"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  FALLBACK_DASHBOARD_SUMMARY,
  type DashboardSummary,
  dashboardSummarySchema,
} from "@/lib/dashboard-summary"
import { DatePicker } from "@/components/ui/date-picker"

const payments = [
  { id: "1", status: "Success", email: "ken99@yahoo.com", amount: "$316.00" },
  { id: "2", status: "Success", email: "abe45@gmail.com", amount: "$242.00" },
  { id: "3", status: "Processing", email: "monserrat44@gmail.com", amount: "$837.00" },
  { id: "4", status: "Failed", email: "carmella@hotmail.com", amount: "$721.00" },
]

const teamMembers = [
  { name: "Dale Komen", email: "dale@example.com", role: "Member" },
  { name: "Sofia Davis", email: "m@example.com", role: "Owner" },
  { name: "Jackson Lee", email: "p@example.com", role: "Member" },
  { name: "Isabella Nguyen", email: "i@example.com", role: "Member" },
  { name: "Hugan Romex", email: "kai@example.com", role: "Member" },
]

const formatInteger = (value: number): string =>
  new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(value)

const formatCurrency = (value: number, currency: string): string =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(value)

const formatSignedPercent = (value: number): string => `${value >= 0 ? "+" : ""}${value.toFixed(1)}%`

const formatCardChange = (value: number): string => `${Math.abs(value).toFixed(1)}%`

const loadDashboardSummary = async (signal: AbortSignal): Promise<DashboardSummary> => {
  const response = await fetch("/api/dashboard/summary", {
    method: "GET",
    cache: "no-store",
    signal,
  })

  if (!response.ok) {
    throw new Error("Unable to load dashboard summary")
  }

  const payload = await response.json()
  return dashboardSummarySchema.parse(payload)
}

function StatCard({
  title,
  value,
  change,
  positive,
  data,
  dataKey,
  color,
}: {
  title: string
  value: string
  change: string
  positive: boolean
  data: Record<string, number>[]
  dataKey: string
  color: string
}) {
  const chartOptions = React.useMemo(
    () =>
      createSparklineOptions({
        color,
        data: data.map((point) => point[dataKey] ?? 0),
        height: 39,
      }),
    [color, data, dataKey],
  )

  return (
    <Card className="h-full w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 pb-2">
        <CardTitle className="truncate text-sm font-medium">{title}</CardTitle>
        <IconInfoCircle className="size-4 text-muted-foreground" />
      </CardHeader>
      <CardContent className="px-4 pb-4">
        <div className="flex items-end justify-between">
          <div>
            <div className="text-2xl font-bold">{value}</div>
            <div className="mt-1 flex items-center gap-1">
              <span className={`text-xs font-medium ${positive ? "text-emerald-500" : "text-red-500"}`}>
                {change}
              </span>
              {positive ? (
                <IconArrowUpRight className="size-3 text-emerald-500" />
              ) : (
                <IconArrowDownRight className="size-3 text-red-500" />
              )}
            </div>
            <div className="mt-0.5 flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Since Last week</span>
              <span className="text-xs font-bold">Details</span>
            </div>
          </div>
          <DashboardHighchart options={chartOptions} className="h-[39px] w-[70px]" />
        </div>
      </CardContent>
    </Card>
  )
}

export default function Dashboard1() {
  const [dashboardSummary, setDashboardSummary] = React.useState<DashboardSummary>(FALLBACK_DASHBOARD_SUMMARY)
  const [emailFilter, setEmailFilter] = React.useState("")
  const [sortAsc, setSortAsc] = React.useState(true)

  React.useEffect(() => {
    const controller = new AbortController()

    const load = async () => {
      try {
        const liveData = await loadDashboardSummary(controller.signal)
        setDashboardSummary(liveData)
      } catch (error) {
        if (controller.signal.aborted) {
          return
        }

        console.warn(
          JSON.stringify({
            event: "dashboard_summary_fallback",
            message: error instanceof Error ? error.message : "Unknown error",
          }),
        )
      }
    }

    void load()

    return () => {
      controller.abort()
    }
  }, [])

  const filteredPayments = payments
    .filter((p) => p.email.toLowerCase().includes(emailFilter.toLowerCase()))
    .sort((a, b) => (sortAsc ? a.email.localeCompare(b.email) : b.email.localeCompare(a.email)))

  const revenueLineOptions = React.useMemo(
    () =>
      createBaseChartOptions({
        chart: {
          type: "line",
          height: 80,
          margin: [6, 2, 6, 2],
          spacing: [0, 0, 0, 0],
        },
        legend: {
          enabled: false,
        },
        xAxis: {
          categories: dashboardSummary.revenueLineData.map((point) => point.month),
          visible: false,
        },
        yAxis: {
          visible: false,
        },
        tooltip: {
          shared: true,
          pointFormat: "<b>{point.y:,.0f}</b>",
        },
        plotOptions: {
          series: {
            animation: false,
          },
        },
        series: [
          {
            type: "line",
            name: "Revenue",
            color: "var(--chart-1)",
            data: dashboardSummary.revenueLineData.map((point) => point.revenue),
            lineWidth: 2,
            marker: {
              enabled: true,
              radius: 3,
              fillColor: "var(--background)",
              lineColor: "var(--chart-1)",
              lineWidth: 2,
            },
          },
        ],
      }),
    [dashboardSummary.revenueLineData],
  )

  const areaChartOptions = React.useMemo(
    () =>
      createBaseChartOptions({
        chart: {
          type: "area",
          height: 250,
        },
        legend: {
          enabled: false,
        },
        xAxis: {
          categories: dashboardSummary.areaChartData.map((point) => point.month),
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
        plotOptions: {
          area: {
            stacking: "normal",
            lineWidth: 1,
            marker: {
              enabled: false,
            },
          },
          series: {
            animation: false,
          },
        },
        series: mergeSeriesColors(
          [
            {
              type: "area",
              name: "Mobile",
              data: dashboardSummary.areaChartData.map((point) => point.mobile),
              fillOpacity: 0.4,
            },
            {
              type: "area",
              name: "Desktop",
              data: dashboardSummary.areaChartData.map((point) => point.desktop),
              fillOpacity: 0.4,
            },
          ],
          ["var(--chart-2)", "var(--chart-1)"],
        ),
      }),
    [dashboardSummary.areaChartData],
  )

  const subscriptionsChartOptions = React.useMemo(
    () =>
      createBaseChartOptions({
        chart: {
          type: "column",
          height: 119,
          margin: [8, 0, 8, 0],
          spacing: [0, 0, 0, 0],
        },
        legend: {
          enabled: false,
        },
        xAxis: {
          categories: dashboardSummary.subscriptionsBarData.map((_, index) => String(index + 1)),
          visible: false,
        },
        yAxis: {
          visible: false,
        },
        tooltip: {
          shared: true,
        },
        plotOptions: {
          series: {
            animation: false,
          },
          column: {
            borderWidth: 0,
            groupPadding: 0.12,
            pointPadding: 0.02,
          },
        },
        series: mergeSeriesColors(
          [
            {
              type: "column",
              name: "Desktop",
              data: dashboardSummary.subscriptionsBarData.map((point) => point.desktop),
            },
            {
              type: "column",
              name: "Mobile",
              data: dashboardSummary.subscriptionsBarData.map((point) => point.mobile),
            },
          ],
          ["var(--chart-1)", "var(--chart-2)"],
        ),
      }),
    [dashboardSummary.subscriptionsBarData],
  )

  return (
    <div>
      <div className="mb-2 flex flex-col items-start justify-between space-y-2 md:flex-row md:items-center">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <IconFileDescription className="mr-2 size-4" />
            Download
          </Button>
          <DatePicker />
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">
            <IconChartLine className="mr-1.5 size-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="analytics">
            <IconChartBar className="mr-1.5 size-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="reports">
            <IconFileAnalytics className="mr-1.5 size-4" />
            Reports
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <IconBell className="mr-1.5 size-4" />
            Notifications
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-0">
          <div className="grid auto-rows-auto grid-cols-3 gap-5 md:grid-cols-6 lg:grid-cols-9">
            <div className="col-span-3 lg:col-span-2 xl:col-span-2">
              <StatCard
                title="New Subscriptions"
                value={formatInteger(dashboardSummary.stats.newSubscriptions)}
                change={formatCardChange(dashboardSummary.stats.newSubscriptionsChangePct)}
                positive={dashboardSummary.stats.newSubscriptionsChangePct >= 0}
                data={dashboardSummary.sparkData.subscriptions}
                dataKey="month"
                color="var(--chart-1)"
              />
            </div>
            <div className="col-span-3 lg:col-span-2 xl:col-span-2">
              <StatCard
                title="New Orders"
                value={formatInteger(dashboardSummary.stats.newOrders)}
                change={formatCardChange(dashboardSummary.stats.newOrdersChangePct)}
                positive={dashboardSummary.stats.newOrdersChangePct >= 0}
                data={dashboardSummary.sparkData.orders}
                dataKey="month"
                color="var(--chart-2)"
              />
            </div>
            <div className="col-span-3 lg:col-span-2 xl:col-span-2">
              <StatCard
                title="Avg Order Revenue"
                value={formatCurrency(
                  dashboardSummary.stats.avgOrderRevenue,
                  dashboardSummary.kpis.currency,
                )}
                change={formatCardChange(dashboardSummary.stats.avgOrderRevenueChangePct)}
                positive={dashboardSummary.stats.avgOrderRevenueChangePct >= 0}
                data={dashboardSummary.sparkData.avgOrderRevenue}
                dataKey="month"
                color="var(--chart-3)"
              />
            </div>

            <div className="col-span-3">
              <Card className="h-full w-full">
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                </CardHeader>
                <CardContent className="px-4 pb-4">
                  <div className="text-3xl font-bold">
                    {formatCurrency(dashboardSummary.kpis.totalRevenue, dashboardSummary.kpis.currency)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {formatSignedPercent(dashboardSummary.kpis.monthlyGrowthPct)} from last month
                  </p>
                  <DashboardHighchart options={revenueLineOptions} className="mt-2 h-[80px] w-full" />
                </CardContent>
              </Card>
            </div>

            <div className="col-span-3 md:col-span-6">
              <Card>
                <CardHeader>
                  <CardTitle className="font-semibold">Sale Activity - Monthly</CardTitle>
                  <CardDescription>Showing total sales for the last 6 months</CardDescription>
                </CardHeader>
                <CardContent>
                  <DashboardHighchart options={areaChartOptions} className="h-[250px] w-full" />
                </CardContent>
              </Card>
            </div>

            <div className="col-span-3 md:col-span-6 lg:col-span-3">
              <Card className="h-full">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Subscriptions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">+{formatInteger(dashboardSummary.stats.newSubscriptions)}</div>
                  <p className="text-xs text-muted-foreground">
                    {formatSignedPercent(dashboardSummary.kpis.yearlyGrowthPct)} from last month
                  </p>
                  <DashboardHighchart options={subscriptionsChartOptions} className="mt-4 h-[119px] w-full" />
                </CardContent>
              </Card>
            </div>

            <div className="col-span-3 md:col-span-6 lg:col-span-5 xl:col-span-6">
              <Card>
                <CardHeader>
                  <CardTitle>Payments</CardTitle>
                  <CardDescription>Manage your payments.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-4 flex items-center gap-2">
                    <Input
                      placeholder="Filter emails..."
                      value={emailFilter}
                      onChange={(event) => setEmailFilter(event.target.value)}
                      className="max-w-sm"
                    />
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="ml-auto" size="sm">
                          Columns <ChevronDown className="ml-2 size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Status</DropdownMenuItem>
                        <DropdownMenuItem>Email</DropdownMenuItem>
                        <DropdownMenuItem>Amount</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[40px]"><Checkbox /></TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>
                            <Button variant="ghost" size="sm" className="-ml-3" onClick={() => setSortAsc(!sortAsc)}>
                              Email <ArrowUpDown className="ml-2 size-4" />
                            </Button>
                          </TableHead>
                          <TableHead className="text-right">Amount</TableHead>
                          <TableHead className="w-[40px]" />
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredPayments.map((payment) => (
                          <TableRow key={payment.id}>
                            <TableCell><Checkbox /></TableCell>
                            <TableCell className="text-sm lowercase">{payment.status}</TableCell>
                            <TableCell className="text-sm">{payment.email}</TableCell>
                            <TableCell className="text-right text-sm">{payment.amount}</TableCell>
                            <TableCell>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="size-8">
                                    <MoreHorizontal className="size-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem>View</DropdownMenuItem>
                                  <DropdownMenuItem>Edit</DropdownMenuItem>
                                  <DropdownMenuItem>Delete</DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="col-span-3 md:col-span-6 lg:col-span-4 xl:col-span-3">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>Team Members</CardTitle>
                  <CardDescription>Invite your team members to collaborate.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {teamMembers.map((member) => (
                      <div key={member.email} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar className="size-8">
                            <AvatarFallback>{member.name.split(" ").map((value) => value[0]).join("")}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium leading-none">{member.name}</p>
                            <p className="text-xs text-muted-foreground">{member.email}</p>
                          </div>
                        </div>
                        <Select defaultValue={member.role.toLowerCase()}>
                          <SelectTrigger className="w-[110px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="owner">Owner</SelectItem>
                            <SelectItem value="member">Member</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="flex h-[200px] items-center justify-center text-muted-foreground">
            Analytics content coming soon.
          </div>
        </TabsContent>
        <TabsContent value="reports">
          <div className="flex h-[200px] items-center justify-center text-muted-foreground">
            Reports content coming soon.
          </div>
        </TabsContent>
        <TabsContent value="notifications">
          <div className="flex h-[200px] items-center justify-center text-muted-foreground">
            Notifications content coming soon.
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
