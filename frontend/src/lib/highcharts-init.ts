import Highcharts from "highcharts";

const HIGHCHARTS_MORE_FLAG = "__highcharts_more_initialized__";

const globalWithFlag = globalThis as typeof globalThis & {
  [HIGHCHARTS_MORE_FLAG]?: boolean;
};

export const ensureHighchartsModules = async (): Promise<void> => {
  if (typeof window === "undefined" || globalWithFlag[HIGHCHARTS_MORE_FLAG]) {
    return;
  }

  const highchartsMore = await import("highcharts/highcharts-more");
  const highchartsMoreRecord = highchartsMore as Record<string, unknown>;
  const defaultExport =
    highchartsMoreRecord.default && typeof highchartsMoreRecord.default === "object"
      ? (highchartsMoreRecord.default as Record<string, unknown>).default
      : highchartsMoreRecord.default;

  const candidateInitializers: unknown[] = [
    highchartsMoreRecord,
    highchartsMoreRecord.default,
    defaultExport,
    highchartsMoreRecord.HighchartsMore,
  ];

  const initHighchartsMore = candidateInitializers.find(
    (candidate): candidate is (library: typeof Highcharts) => void =>
      typeof candidate === "function",
  );

  if (!initHighchartsMore) {
    console.error("Unable to initialize highcharts-more module.");
    globalWithFlag[HIGHCHARTS_MORE_FLAG] = true;
    return;
  }

  initHighchartsMore(Highcharts);
  globalWithFlag[HIGHCHARTS_MORE_FLAG] = true;
};

export default Highcharts;
