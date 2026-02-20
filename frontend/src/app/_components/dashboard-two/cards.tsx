"use client";

import { IconArrowNarrowRight, IconDots } from "@tabler/icons-react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";

import type { StatCard } from "./data";

export function DashboardTwoStatCard({ card }: { card: StatCard }) {
  return (
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
        {card.targetProgress !== undefined && (
          <>
            <div className="mt-3 flex items-end justify-between text-xs">
              <span className="text-muted-foreground">{card.previousPeriod}</span>
              <span className="font-semibold">{card.previousValue}</span>
            </div>
            <div className="mt-1.5 flex items-center gap-2">
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-indigo-500"
                  style={{ width: `${card.targetProgress}%` }}
                />
              </div>
              <span className="text-xs font-semibold">{card.targetProgress}%</span>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">{card.targetLabel}</p>
          </>
        )}
        <div className="my-3 h-[0.04px] w-full bg-muted-foreground opacity-50" />
        <a href="#" className="flex items-center gap-1 text-xs font-medium">
          View Report <IconArrowNarrowRight className="size-[18px]" />
        </a>
      </CardContent>
    </Card>
  );
}
