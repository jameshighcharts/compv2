import type { ComponentType } from "react";
import {
  IconClipboardCheck,
  IconReceiptFilled,
  IconReportMoney,
  IconUserFilled,
} from "@tabler/icons-react";

import { chartColor } from "@/components/ui/highcharts";

export type StatCard = {
  title: string;
  icon: ComponentType<{ className?: string }>;
  value: string;
  badge: string;
  positive: boolean;
  change: string;
  iconColor: string;
  previousPeriod?: string;
  previousValue?: string;
  targetLabel?: string;
  targetProgress?: number;
};

export const statCards: StatCard[] = [
  {
    title: "Revenue this month",
    icon: IconReportMoney,
    value: "$4,523,189",
    badge: "10.2%",
    positive: true,
    change: "+1,454.89 today",
    iconColor: "bg-indigo-600/25 text-indigo-600",
    previousPeriod: "Prev month",
    previousValue: "$3,902,184",
    targetLabel: "Monthly target $5.42M",
    targetProgress: 83.5,
  },
  {
    title: "Expeted Renewals",
    icon: IconClipboardCheck,
    value: "12,545",
    badge: "20.2%",
    positive: true,
    change: "+1,589 today",
    iconColor: "bg-indigo-600/25 text-indigo-600",
  },
  {
    title: "New Logos",
    icon: IconUserFilled,
    value: "8,344",
    badge: "14.2%",
    positive: false,
    change: "-89 today",
    iconColor: "bg-indigo-600/25 text-indigo-600",
  },
  {
    title: "In the pipe",
    icon: IconReceiptFilled,
    value: "3,148",
    badge: "12.6%",
    positive: true,
    change: "+48 today",
    iconColor: "bg-emerald-600/25 text-emerald-600",
  },
];

export const revenueData = [
  { month: "Jan", desktop: 186, mobile: 80 },
  { month: "Feb", desktop: 305, mobile: 200 },
  { month: "Mar", desktop: 237, mobile: 120 },
  { month: "Apr", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "Jun", desktop: 214, mobile: 140 },
];

export const recentActivity = [
  {
    name: "Jessica Mills",
    email: "jessica@example.com",
    initials: "Je",
    status: "Invited",
    id: "#329341",
    date: "5 min ago",
    amount: "$320.00",
  },
  {
    name: "Andrew Quinn",
    email: "andrew@example.com",
    initials: "An",
    status: "Suspended",
    id: "#412893",
    date: "12 min ago",
    amount: "$185.50",
  },
  {
    name: "Marcus Chen",
    email: "marcus@example.com",
    initials: "Ma",
    status: "New",
    id: "#520134",
    date: "24 min ago",
    amount: "$462.00",
  },
  {
    name: "Lauren Park",
    email: "lauren@example.com",
    initials: "La",
    status: "Delete",
    id: "#238476",
    date: "35 min ago",
    amount: "$729.99",
  },
  {
    name: "David Ross",
    email: "david@example.com",
    initials: "Da",
    status: "New",
    id: "#615920",
    date: "48 min ago",
    amount: "$153.25",
  },
];

export const visitorData = [
  { name: "Chrome", y: 275, color: chartColor(0) },
  { name: "Safari", y: 200, color: chartColor(1) },
  { name: "Firefox", y: 287, color: chartColor(2) },
  { name: "Edge", y: 173, color: chartColor(3) },
  { name: "Other", y: 190, color: chartColor(4) },
];

export const formatInteger = (value: number): string =>
  new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(value);

export const totalVisitors = visitorData.reduce((sum, item) => sum + item.y, 0);
