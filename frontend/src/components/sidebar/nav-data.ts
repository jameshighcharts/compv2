import type { ComponentType } from "react";
import {
  IconBug,
  IconChartFunnel,
  IconChecklist,
  IconCode,
  IconLayoutDashboard,
  IconLockAccess,
  IconSettings,
  IconUsers,
} from "@tabler/icons-react";

type SidebarSubItem = {
  title: string;
  href: string;
};

export type SidebarNavItem = {
  title: string;
  icon: ComponentType<{ className?: string }>;
  href?: string;
  subItems?: SidebarSubItem[];
  defaultOpen?: boolean;
  collapsible?: boolean;
};

export const navGeneral: SidebarNavItem[] = [
  {
    title: "Dashboard",
    icon: IconLayoutDashboard,
    defaultOpen: true,
    subItems: [
      { title: "Dashboard 1", href: "/" },
      { title: "Dashboard 2", href: "/dashboard-2" },
      { title: "Dashboard 3", href: "/dashboard-3" },
    ],
  },
  {
    title: "Sales Pipeline",
    href: "/sales-pipeline",
    icon: IconChartFunnel,
  },
  {
    title: "Adhocs & Tasks",
    href: "/tasks",
    icon: IconChecklist,
  },
  {
    title: "Users",
    href: "/users",
    icon: IconUsers,
  },
];

export const navPages: SidebarNavItem[] = [
  { title: "Auth", icon: IconLockAccess, collapsible: true },
  { title: "Errors", icon: IconBug, collapsible: true },
];

export const navOther: SidebarNavItem[] = [
  { title: "Settings", icon: IconSettings, collapsible: true },
  { title: "Developers", icon: IconCode, collapsible: true },
];
