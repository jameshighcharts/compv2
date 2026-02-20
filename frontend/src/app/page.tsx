"use client";

import {
  IconBell,
  IconChartBar,
  IconChartLine,
  IconCurrencyDollar,
  IconDownload,
  IconFileAnalytics,
} from "@tabler/icons-react";

import { DatePicker } from "@/components/ui/date-picker";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { DashboardAnalyticsTab } from "@/app/_components/dashboard-one/analytics-tab";
import { DashboardOverviewTab } from "@/app/_components/dashboard-one/overview-tab";
import { DashboardReportsTab } from "@/app/_components/dashboard-one/reports-tab";
import { DashboardSalesRevenueTab } from "@/app/_components/dashboard-one/sales-revenue-tab";

export default function Dashboard1() {
  return (
    <div>
      <div className="mb-2 flex flex-col items-start justify-between space-y-2 md:flex-row md:items-center">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <div className="flex items-center space-x-2">
          <Button size="sm">
            <IconDownload className="mr-2 size-4" />
            Download
          </Button>
          <DatePicker placeholder="Pick a date" />
        </div>
      </div>

      <Tabs defaultValue="sales-revenue" className="space-y-4">
        <TabsList>
          <TabsTrigger value="sales-revenue">
            <IconCurrencyDollar className="mr-1.5 size-4" />
            Sales Revenue
          </TabsTrigger>
          <TabsTrigger value="overview">
            <IconChartLine className="mr-1.5 size-4" />
            ARR
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

        <TabsContent value="sales-revenue" className="space-y-4">
          <DashboardSalesRevenueTab />
        </TabsContent>

        <TabsContent value="overview" className="space-y-4">
          <DashboardOverviewTab />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <DashboardAnalyticsTab />
        </TabsContent>

        <TabsContent value="reports">
          <DashboardReportsTab />
        </TabsContent>

        <TabsContent value="notifications">
          <div className="flex h-[200px] items-center justify-center text-muted-foreground">
            Notifications content coming soon.
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
