"use client";

import * as React from "react";
import HighchartsReact from "highcharts-react-official";

import Highcharts, { ensureHighchartsModules } from "@/lib/highcharts-init";
import { cn } from "@/lib/utils";

export type DashboardHighchartProps = {
  className?: string;
  options: Highcharts.Options;
};

const BASE_OPTIONS: Highcharts.Options = {
  chart: {
    backgroundColor: "transparent",
    style: {
      fontFamily: "inherit",
    },
  },
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
    },
    itemHoverStyle: {
      color: "var(--foreground)",
    },
  },
  tooltip: {
    backgroundColor: "var(--card)",
    borderColor: "var(--border)",
    style: {
      color: "var(--foreground)",
    },
  },
  xAxis: {
    labels: {
      style: {
        color: "var(--muted-foreground)",
      },
    },
    lineColor: "var(--border)",
    tickColor: "var(--border)",
  },
  yAxis: {
    title: {
      text: undefined,
    },
    labels: {
      style: {
        color: "var(--muted-foreground)",
      },
    },
    gridLineColor: "var(--border)",
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
