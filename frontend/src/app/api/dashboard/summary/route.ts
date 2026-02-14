import { type NextRequest, NextResponse } from "next/server";

import { loadDummyDashboardData } from "@/lib/dummy-dashboard-data";
import { buildDashboardSummary } from "@/lib/dashboard-summary";

export const revalidate = 14_400;

const SUCCESS_CACHE_CONTROL = "s-maxage=14400, stale-while-revalidate=300";

const getRequestId = (request: NextRequest): string =>
  request.headers.get("x-request-id") ??
  request.headers.get("x-vercel-id") ??
  crypto.randomUUID();

const toErrorResponse = (message: string, requestId: string): NextResponse =>
  NextResponse.json(
    {
      error: {
        code: "DATA_SOURCE_UNAVAILABLE",
        message,
        requestId,
        timestamp: new Date().toISOString(),
      },
    },
    {
      status: 503,
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );

export const GET = async (request: NextRequest): Promise<NextResponse> => {
  const requestId = getRequestId(request);
  const start = Date.now();

  try {
    const { overview, monthlySales, yearlySales } = await loadDummyDashboardData();

    const payload = buildDashboardSummary({
      overview,
      monthlySales,
      yearlySales,
    });

    console.info(
      JSON.stringify({
        event: "api_success",
        route: "/api/dashboard/summary",
        source: "dummy_data",
        requestId,
        latencyMs: Date.now() - start,
      }),
    );

    return NextResponse.json(payload, {
      status: 200,
      headers: {
        "Cache-Control": SUCCESS_CACHE_CONTROL,
      },
    });
  } catch (error) {
    console.error(
      JSON.stringify({
        event: "api_dummy_data_error",
        route: "/api/dashboard/summary",
        source: "dummy_data",
        requestId,
        latencyMs: Date.now() - start,
        message: error instanceof Error ? error.message : "Unknown error",
      }),
    );

    return toErrorResponse("Unable to load dashboard dummy data.", requestId);
  }
};
