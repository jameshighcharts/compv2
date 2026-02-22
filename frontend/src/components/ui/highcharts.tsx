"use client";

import * as React from "react";
import { Chart as HighchartsReact } from "@highcharts/react";

import Highcharts, { ensureHighchartsModules } from "@/lib/highcharts-init";
import { cn } from "@/lib/utils";

export type DashboardHighchartProps = {
  className?: string;
  options: Highcharts.Options;
};

// Palette matching globals.css --chart-* tokens.
// These are the dark-mode-optimised values; they render acceptably in light mode too.
export const CHART_PALETTE = [
  "#9198F0", // violet  — chart-1
  "#6DDFA0", // mint    — chart-2
  "#F7A85E", // orange  — chart-3
  "#7DBFCE", // teal    — chart-4
  "#EBD95F", // yellow  — chart-5
] as const;

export const chartColor = (index: number): string => {
  const safeIndex = ((index % CHART_PALETTE.length) + CHART_PALETTE.length) % CHART_PALETTE.length;
  return CHART_PALETTE[safeIndex];
};

const BASE_OPTIONS: Highcharts.Options = {
  chart: {
    backgroundColor: "transparent",
    style: {
      fontFamily: "inherit",
    },
  },
  colors: [...CHART_PALETTE],
  title: {
    text: undefined,
  },
  subtitle: {
    text: undefined,
  },
  credits: {
    enabled: false,
  },
  accessibility: {
    enabled: false,
  },
  exporting: {
    enabled: false,
  },
  legend: {
    itemStyle: {
      color: "var(--muted-foreground)",
      fontWeight: "500",
      fontSize: "12px",
    },
    itemHoverStyle: {
      color: "var(--foreground)",
    },
    // Tighter item spacing — less cluttered legends
    itemDistance: 16,
  },
  tooltip: {
    backgroundColor: "var(--card)",
    borderColor: "var(--border)",
    // Crisp shadow-less tooltip that matches card aesthetic
    borderRadius: 8,
    shadow: false,
    style: {
      color: "var(--foreground)",
      fontSize: "13px",
    },
    padding: 10,
  },
  xAxis: {
    labels: {
      style: {
        color: "var(--muted-foreground)",
        fontSize: "12px",
      },
    },
    // Remove the x-axis baseline and tick marks — reduces visual noise
    lineColor: "transparent",
    tickColor: "transparent",
  },
  yAxis: {
    title: {
      text: undefined,
    },
    labels: {
      style: {
        color: "var(--muted-foreground)",
        fontSize: "12px",
      },
    },
    // Dot grid lines are softer and less distracting than solid
    gridLineColor: "var(--border)",
    gridLineDashStyle: "Dot",
  },
};

export const createBaseChartOptions = (
  options: Highcharts.Options,
): Highcharts.Options => Highcharts.merge(BASE_OPTIONS, options);

export const createSparklineOptions = ({
  color,
  data,
  height,
}: {
  color: string;
  data: number[];
  height: number;
}): Highcharts.Options =>
  createBaseChartOptions({
    chart: {
      type: "line",
      height,
      margin: [2, 0, 2, 0],
      spacing: [0, 0, 0, 0],
    },
    legend: {
      enabled: false,
    },
    xAxis: {
      visible: false,
    },
    yAxis: {
      visible: false,
    },
    tooltip: {
      enabled: false,
    },
    plotOptions: {
      series: {
        animation: false,
        marker: {
          enabled: false,
        },
        states: {
          hover: {
            lineWidthPlus: 0,
          },
        },
      },
    },
    series: [
      {
        type: "line",
        data,
        color,
        lineWidth: 2,
      },
    ],
  });

export const mergeSeriesColors = (
  series: Highcharts.SeriesOptionsType[],
  colors: string[],
): Highcharts.SeriesOptionsType[] =>
  series.map((entry, index) => {
    const seriesWithColor = entry as Highcharts.SeriesOptionsType & {
      color?: string;
    };

    return {
      ...seriesWithColor,
      color: seriesWithColor.color ?? colors[index % colors.length],
    };
  });

export function DashboardHighchart({
  className,
  options,
}: DashboardHighchartProps) {
  const [isReady, setIsReady] = React.useState<boolean>(false);

  React.useEffect(() => {
    let isActive = true;

    void ensureHighchartsModules().then(() => {
      if (isActive) {
        setIsReady(true);
      }
    });

    return () => {
      isActive = false;
    };
  }, []);

  if (!isReady) {
    return <div className={cn("h-full w-full", className)} />;
  }

  return (
    <div className={cn("h-full w-full", className)}>
      <HighchartsReact
        highcharts={Highcharts}
        options={options}
        containerProps={{ className: "h-full w-full" }}
      />
    </div>
  );
}
