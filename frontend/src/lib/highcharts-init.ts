import Highcharts from "highcharts/esm/highcharts.src.js";

const HIGHCHARTS_MORE_FLAG = "__highcharts_more_initialized__";

const globalWithFlag = globalThis as typeof globalThis & {
  [HIGHCHARTS_MORE_FLAG]?: boolean;
};

export const ensureHighchartsModules = async (): Promise<void> => {
  if (typeof window === "undefined" || globalWithFlag[HIGHCHARTS_MORE_FLAG]) {
    return;
  }

  await import("highcharts/esm/highcharts-more.src.js");
  globalWithFlag[HIGHCHARTS_MORE_FLAG] = true;
};

export default Highcharts;
