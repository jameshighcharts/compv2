# Total Sales Gauge — Exact Recipe

> How to reproduce the half-donut speedometer gauge that appears at the top of the **Monthly Sales Report** page. Every value, color, and layout decision pulled directly from the source.

---

## What it looks like

- **Half-donut** (–90° to +89.9°, pivot centered at bottom-center)
- **4 colored arc bands** from grey → amber → green → purple, representing performance tiers
- **Two needles**: a solid primary needle (current period) and a faint ghost needle (previous period)
- **Large bold data label** showing the current value at the needle tip
- **Title + subtitle** above the arc, **caption** below it with % of target
- **Custom colored tick labels** at each band boundary, nudged vertically to avoid overlap
- Card shell: deep blue-purple gradient, same as all other charts on the page

---

## 1. Container / card shell CSS

Source: `frontend/src/components/charts/TotalSalesGauge/TotalSalesGauge.module.css`

```css
.chart {
    --highcharts-chart-background: transparent;

    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;

    width: 100%;
    min-height: 312px;
    padding: 32px 0px 28px;

    border-radius: 28px;
    background: linear-gradient(155deg, #262a46 10%, #353a62 55%, #404679 100%);
    border: 1px solid rgba(94, 102, 146, 0.55);
    box-shadow:
        0 24px 48px rgba(17, 20, 38, 0.55),
        inset 0 0 0 1px rgba(255, 255, 255, 0.02);
}

/* Make every Highcharts background transparent */
.chart :global(.highcharts-container),
.chart :global(.highcharts-background),
.chart :global(.highcharts-plot-background),
.chart :global(.highcharts-root) {
    fill: transparent !important;
    background: transparent !important;
}

.chart :global(.highcharts-plot-border),
.chart :global(.highcharts-plot-outline),
.chart :global(.highcharts-grid-line) {
    stroke: transparent !important;
    fill: transparent !important;
}
```

---

## 2. Band / tick color overrides (CSS)

Each arc segment has a named className applied via `plotBands`. Override them like this:

```css
.chart :global(.highcharts-plot-band) {
    fill-opacity: 1 !important;
}

/* Grey — "null / below base" band */
.chart :global(.highcharts-plot-band.null-band) {
    fill: rgb(224, 224, 227) !important;
}

/* Amber — "warning / on budget" band */
.chart :global(.highcharts-plot-band.warn-band) {
    fill: rgb(255, 169, 46) !important;
}

/* Green — "optimal" band */
.chart :global(.highcharts-plot-band.opt-band) {
    fill: rgb(162, 239, 187) !important;
}

/* Purple — "high / above target" band */
.chart :global(.highcharts-plot-band.high-band) {
    fill: rgb(131, 131, 229) !important;
}
```

### Needle colors (per series)

```css
/* Series 0 — current period: solid steel-blue */
.chart :global(.highcharts-series-0 .highcharts-pivot),
.chart :global(.highcharts-series-0 .highcharts-dial) {
    fill: rgb(165, 173, 203) !important;
    stroke: rgb(165, 173, 203) !important;
}

/* Series 1 — previous period: ghost/transparent */
.chart :global(.highcharts-series-1 .highcharts-pivot),
.chart :global(.highcharts-series-1 .highcharts-dial) {
    fill: rgba(202, 211, 245, 0.2) !important;
    stroke: rgba(202, 211, 245, 0.2) !important;
}
```

### Typography overrides

```css
.chart :global(.highcharts-title) {
    fill: #f5f7ff !important;
    font-weight: 600 !important;
    font-size: 24px !important;
}

.chart :global(.highcharts-subtitle) {
    fill: rgba(228, 231, 250, 0.8) !important;
    font-size: 17px !important;
}

.chart :global(.highcharts-axis-labels text) {
    fill: #f5f7ff !important;
    font-weight: 700 !important;
    font-size: 16px !important;
    text-shadow: 0 2px 6px rgba(16, 19, 33, 0.65);
}

.chart :global(.highcharts-caption) {
    fill: rgba(228, 231, 250, 0.75) !important;
}

/* The big central value label */
.chart :global(.highcharts-data-label-box) {
    fill: transparent !important;
    stroke: transparent !important;
}

.chart :global(.highcharts-data-label text) {
    fill: #ffffff !important;
    font-size: 25px !important;
    font-weight: 700 !important;
    text-shadow: none !important;
    stroke: none !important;
}
```

---

## 3. Target thresholds

Source: `frontend/src/utils/chartConfig.js` — `TOTAL_SALES_GAUGE_TARGETS`

All values are in **millions (USD)**. The gauge axis runs from `0` to `max`.

```js
const TARGETS = {
    base:   0.816,   // $816K — lower boundary, grey band end
    budget: 0.927,   // $927K — amber band end
    high:   1.038,   // $1.038M — green band end
    max:    1.194,   // $1.194M — purple band end / axis maximum
};
```

### How the 4 plotBands are built from these

```js
const tickStops = [
    { value: TARGETS.base,   color: 'rgb(224, 224, 227)', className: 'null-band', offset: -6 },
    { value: TARGETS.budget, color: 'rgb(255, 169, 46)',  className: 'warn-band', offset: -2 },
    { value: TARGETS.high,   color: 'rgb(162, 239, 187)', className: 'opt-band',  offset: -2 },
    { value: TARGETS.max,    color: 'rgb(131, 131, 229)', className: 'high-band', offset:  4 },
];

const plotBands = tickStops.map((stop, index) => ({
    from:      index === 0 ? 0 : tickStops[index - 1].value,
    to:        stop.value,
    color:     stop.color,         // overridden by CSS className anyway
    className: stop.className,
    thickness: 25,                 // arc thickness in px
}));
```

---

## 4. Full Highcharts config

```js
Highcharts.chart(container, {
    chart: {
        type: 'gauge',
        backgroundColor: 'transparent',
        marginBottom: 0,
        marginTop: 0,
        height: 350,
        spacing: [0, 0, 0, 0],
        events: {
            // After every render, colorize & nudge the tick labels
            render() {
                tickStops.forEach((stop) => {
                    adjustGaugeTickLabel(this, stop.value, stop.offset);
                    setTickLabelColor(this, stop.value, stop.color, this.renderCounter);
                });
            },
        },
    },

    title: {
        text: 'Total Revenue Sep 2025',
        style: { color: '#f8fafc', fontSize: '30px', fontWeight: 'bold' },
        y: 22,
    },

    subtitle: {
        // e.g. "vs Sep 2024: $775K (+12.2%)"
        text: `vs Sep 2024: $775K (+12.2%)`,
        style: { color: '#9ca3af', fontSize: '19.2px', fontWeight: '300' },
        y: 45,
    },

    pane: {
        startAngle: -90,
        endAngle:    89.9,
        background:  null,
        center: ['50%', '85%'],  // pivot sits 85% down the chart height
        size:   '120%',
    },

    yAxis: {
        visible: true,
        min: 0,
        max: TARGETS.max,           // 1.194
        gridLineWidth: 0,
        minorTickInterval: null,
        tickPositions: tickStops.map(s => s.value),   // only tick at band boundaries
        labels: {
            distance: 25,
            allowOverlap: true,
            style: { fontSize: '60px', fontWeight: '600' },
            formatter() {
                return formatGaugeTick(this.value);
                // formatGaugeTick: ≥1 → "$XM", <1 → "$XK"
            },
        },
        plotBands,
    },

    plotOptions: {
        series: {
            dial: {
                baseWidth:  12,
                baseLength: 0,
                rearLength: 0,
            },
            pivot: {
                radius: 6,
            },
            dataLabels: {
                formatter() { return formatMonthlyGaugeValue(this.y); },
                // formatMonthlyGaugeValue: value is in millions
                // e.g. 0.8696 → "$869.6K"
                backgroundColor: 'transparent',
                borderColor:     'transparent',
                borderWidth: 0,
                borderRadius: 0,
                padding: 0,
                style: {
                    fontSize:   '40px',
                    fontWeight: 'bold',
                    color:      '#ffffff',
                },
                textOutline: 'none',
                y: 10,
            },
        },
    },

    series: [
        {
            // PRIMARY needle — current period
            name: 'Sep 2025 total',
            data: [currentValueInMillions],   // e.g. 0.8696
            dial: {
                baseWidth:  12,
                baseLength: 0,
                rearLength: 0,
                backgroundColor: 'rgb(165, 173, 203)',
                borderColor:     'rgb(165, 173, 203)',
            },
            pivot: {
                radius: 6,
                backgroundColor: 'rgb(165, 173, 203)',
                borderColor:     'rgb(165, 173, 203)',
            },
        },
        {
            // GHOST needle — previous period (no data label)
            name: 'Sep 2024 total',
            data: [previousValueInMillions],  // e.g. 0.7750
            dial: {
                baseWidth:  8,
                baseLength: 0,
                rearLength: 0,
                backgroundColor: 'rgba(202, 211, 245, 0.2)',
                borderColor:     'rgba(202, 211, 245, 0.2)',
            },
            pivot: {
                radius: 4,
                backgroundColor: 'rgba(202, 211, 245, 0.2)',
                borderColor:     'rgba(202, 211, 245, 0.2)',
            },
            dataLabels: { enabled: false },
        },
    ],

    caption: {
        // e.g. "72% of target reached"
        text: `${Math.round((currentValue / TARGETS.max) * 100)}% of target reached`,
        align: 'center',
        verticalAlign: 'bottom',
        y: 19,
        style: { color: '#9ca3af', fontSize: '18px', textAlign: 'center' },
    },

    credits: { enabled: false },
});
```

---

## 5. Tick label helpers

The tick labels at each band boundary are repositioned and colorized post-render. These two helpers live at the top of the component:

### `adjustGaugeTickLabel` — nudge a label's Y position

```js
const adjustGaugeTickLabel = (chart, value, offsetY) => {
    const label = chart.yAxis?.[0]?.ticks[value]?.label;
    if (!label) return;

    const currentY = label.attr('y');
    if (typeof currentY !== 'number') return;

    // Persist the original base Y so repeated renders don't accumulate drift
    const previousOffset = label.customOffset || 0;
    let baseY = label.customBaseY;
    if (typeof baseY !== 'number' || Math.abs(currentY - (baseY + previousOffset)) > 0.5) {
        baseY = currentY;
    }

    const renderId = chart.renderCounter || 0;
    if (label.customRender === renderId && Math.abs(previousOffset - offsetY) < 0.5) return;

    label.attr({ y: baseY + offsetY });
    label.customBaseY   = baseY;
    label.customOffset  = offsetY;
    label.customRender  = renderId;
};
```

### `setTickLabelColor` — apply the band color to its label

```js
const setTickLabelColor = (chart, value, color, renderId) => {
    const label = chart.yAxis?.[0]?.ticks[value]?.label;
    if (!label) return;
    if (label.customColor === color && label.customRender === renderId) return;

    label.attr({ fill: color });
    label.customColor  = color;
    label.customRender = renderId;
};
```

### Per-band offset values (the `offset` field in `tickStops`)

| Band | Boundary value | Y offset | Why |
|------|---------------|----------|-----|
| null (grey)  | 0.816 | `−6` | Sits near the left edge, pull up to avoid arc overlap |
| warn (amber) | 0.927 | `−2` | Slight pull-up |
| opt (green)  | 1.038 | `−2` | Slight pull-up |
| high (purple)| 1.194 | `+4` | Near the right edge, push down |

---

## 6. Formatter functions

Source: `frontend/src/utils/formatters.js`

```js
// Used for tick labels on the axis (values are in millions)
const formatGaugeTick = (value) => {
    if (value >= 1) {
        const isWhole = Math.abs(value - Math.round(value)) < 0.001;
        return `$${isWhole ? Math.round(value) : value.toFixed(2)}M`;
    }
    return `$${Math.round(value * 1_000)}K`;
};
// Examples: 0.816 → "$816K", 1.038 → "$1.04M", 1.0 → "$1M"

// Used for the big centre data label and tooltip (values are in millions)
const formatMonthlyGaugeValue = (value) => {
    const dollars = value * 1_000_000;
    if (dollars >= 1_000_000) {
        const millions = dollars / 1_000_000;
        return `$${millions.toFixed(1).replace(/\.0$/, '')}M`;
    }
    return `$${(dollars / 1_000).toFixed(1).replace(/\.0$/, '')}K`;
};
// Examples: 0.8696 → "$869.6K", 1.038 → "$1M"

// Used for the subtitle YoY badge
const formatSignedPercent = (value) => {
    const prefix = value > 0 ? '+' : value < 0 ? '-' : '';
    const abs = Math.abs(value);
    return `${prefix}${abs >= 10 ? abs.toFixed(0) : abs.toFixed(1)}%`;
};
// Examples: 12.2 → "+12.2%", -5 → "-5.0%"
```

---

## 7. Data loading

The gauge reads from a separate CSV (`/Untitled Report_Untitled Page_Table.csv`), not `dataset.csv`. The CSV has at minimum three columns: `date`, _(unused column)_, `amount`.

Rows are filtered by whether the date string contains the current or previous period label:

```js
// constants.js
const CURRENT_PERIOD_LABEL  = 'Sep 2025';
const PREVIOUS_PERIOD_LABEL = 'Sep 2024';

// Parsing loop (simplified)
for (const row of csvRows) {
    const date   = row[0].trim();
    const amount = parseCurrency(row[2]);   // strips "$", ",", handles negatives

    if (date.includes('Sep 2025')) currentRevenue  += amount;
    if (date.includes('Sep 2024')) previousRevenue += amount;
}

// Convert to millions before passing to Highcharts
const currentValue  = currentRevenue  / 1_000_000;
const previousValue = previousRevenue / 1_000_000;
```

To adapt for a different period, change the two label constants.

---

## 8. Quick-reference — all hard-coded values

| Setting | Value |
|---------|-------|
| Chart height | `350px` |
| Pane center | `['50%', '85%']` |
| Pane size | `'120%'` |
| Arc start / end | `−90° / 89.9°` |
| Arc thickness | `25px` |
| Primary needle base width | `12` |
| Ghost needle base width | `8` |
| Primary pivot radius | `6` |
| Ghost pivot radius | `4` |
| Primary needle color | `rgb(165, 173, 203)` |
| Ghost needle color | `rgba(202, 211, 245, 0.2)` |
| Data label font size | `40px` (CSS overrides to `25px`) |
| Title font size | `30px` (CSS overrides to `24px`) |
| Subtitle font size | `19.2px` |
| Caption font size | `18px` |
| Tick label distance from arc | `25` |
| Card border-radius | `28px` |
| Card gradient | `linear-gradient(155deg, #262a46 10%, #353a62 55%, #404679 100%)` |
| Card border | `1px solid rgba(94, 102, 146, 0.55)` |

---

## 9. Source files

| File | Role |
|------|------|
| `frontend/src/components/charts/TotalSalesGauge/TotalSalesGauge.jsx` | All chart logic, data loading, Highcharts config |
| `frontend/src/components/charts/TotalSalesGauge/TotalSalesGauge.module.css` | Card shell + Highcharts CSS overrides |
| `frontend/src/utils/chartConfig.js` — `TOTAL_SALES_GAUGE_TARGETS` | The 4 band thresholds |
| `frontend/src/utils/constants.js` — `CURRENT_PERIOD_LABEL` / `PREVIOUS_PERIOD_LABEL` | Period strings used to filter CSV rows |
| `frontend/src/utils/formatters.js` — `formatGaugeTick`, `formatMonthlyGaugeValue`, `formatSignedPercent` | All number → string conversions |
