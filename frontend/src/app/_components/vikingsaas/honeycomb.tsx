"use client";

import React from "react";
import { useTheme } from "next-themes";

import { HEX_TO_PANEL } from "./data";

// ── Geometry ──────────────────────────────────────────────────────────────────
const R = 58;                              // hex radius (vertex to center)
const COL_SPACING = R * 1.5;              // 87 px  — horizontal col-to-col
const ROW_SPACING = R * Math.sqrt(3);     // ≈100.4 px — vertical row-to-row
const ODD_OFFSET = ROW_SPACING / 2;       // ≈50.2 px  — odd-column y shift

const OFFSET_X = 90;
const OFFSET_Y = 180;
const SVG_W = 1150;
const SVG_H = 625;

// ── Types ─────────────────────────────────────────────────────────────────────
type Group = 1 | 2 | 3;

interface HexDef {
  id: string | number;
  lines: string[];   // label text, split into 1-2 lines
  value: string;     // metric value; empty for label hexes
  group: Group;
  col: number;
  row: number;
  isLabel?: boolean;
}

// ── Colors ────────────────────────────────────────────────────────────────────
// Group 1 — Growth & Profitability  : dark forest green
// Group 2 — CAC & Sales Efficiency  : medium forest green
// Group 3 — Coverage & Sales Process: warm cream / light yellow
const GROUP_STYLES: Record<Group, { fill: string; labelFill: string; text: string }> = {
  1: { fill: "#1a2e2a", labelFill: "#10201d", text: "#ffffff" },
  2: { fill: "#4a7c59", labelFill: "#3b6347", text: "#ffffff" },
  3: { fill: "#f5f0d0", labelFill: "#e8e0aa", text: "#1a2e2a" },
};

// ── Hex data ──────────────────────────────────────────────────────────────────
// Layout: flat-top hexagonal grid (q=col, r=row).
//   x = OFFSET_X + col * COL_SPACING
//   y = OFFSET_Y + row * ROW_SPACING + (col % 2) * ODD_OFFSET
//
// Group 1 (dark green)  : cols 0–3   (13 metric hexes + label at col 2, row -1)
// Group 2 (mid green)   : cols 5–7   ( 7 metric hexes + label at col 6, row -1)
// Group 3 (cream)       : cols 9–11  ( 7 metric hexes + label at col 10, row -1)
const HEXES: HexDef[] = [
  // ── Category labels ────────────────────────────────────────────────────────
  { id: "l1", lines: ["Growth &", "Profitability"],        value: "", group: 1, col: 2,  row: -1, isLabel: true },
  { id: "l2", lines: ["CAC & Sales", "Efficiency"],        value: "", group: 2, col: 6,  row: -1, isLabel: true },
  { id: "l3", lines: ["Coverage Model", "& Sales Process"],value: "", group: 3, col: 10, row: -1, isLabel: true },

  // ── Group 1 — Growth & Profitability (cols 0–3) ────────────────────────────
  { id: 1,  lines: ["Total ARR"],            value: "$4.2M",  group: 1, col: 0, row: 0 },
  { id: 2,  lines: ["Total ARR", "Growth"],  value: "+16%",   group: 1, col: 0, row: 1 },
  { id: 3,  lines: ["Organic ARR", "Growth"],value: "+13%",   group: 1, col: 0, row: 2 },
  { id: 4,  lines: ["New Sales", "ARR Grwth"],value: "+18%",  group: 1, col: 0, row: 3 },
  { id: 5,  lines: ["% Recurring", "Revenue"],value: "87%",   group: 1, col: 1, row: 0 },
  { id: 6,  lines: ["Churn"],                value: "8.5%",   group: 1, col: 1, row: 1 },
  { id: 7,  lines: ["Renewal Rate"],         value: "91%",    group: 1, col: 1, row: 2 },
  { id: 8,  lines: ["Rule of 40"],           value: "34",     group: 1, col: 1, row: 3 },
  { id: 9,  lines: ["SaaS Gross", "Margin"], value: "74%",    group: 1, col: 2, row: 0 },
  { id: 10, lines: ["Growth", "Endurance"],  value: "0.81",   group: 1, col: 2, row: 1 },
  { id: 11, lines: ["EBITDA"],               value: "12%",    group: 1, col: 2, row: 2 },
  { id: 12, lines: ["EBITDA-Capex"],         value: "$380K",  group: 1, col: 3, row: 0 },
  { id: 13, lines: ["Operating", "Cash Flow"],value: "$510K", group: 1, col: 3, row: 1 },

  // ── Group 2 — CAC & Sales Efficiency (cols 5–7) ────────────────────────────
  { id: 14, lines: ["Net Rev.", "Retention"], value: "108%",  group: 2, col: 5, row: 0 },
  { id: 15, lines: ["CAC Payback"],           value: "16 mo", group: 2, col: 5, row: 1 },
  { id: 16, lines: ["LTV / CAC"],             value: "4.2×",  group: 2, col: 5, row: 2 },
  { id: 17, lines: ["Magic", "Number"],       value: "0.82",  group: 2, col: 6, row: 0 },
  { id: 18, lines: ["Yield", "per Rep"],      value: "$420K", group: 2, col: 6, row: 1 },
  { id: 19, lines: ["S&M % ARR"],             value: "28%",   group: 2, col: 7, row: 0 },
  { id: 20, lines: ["R&D % ARR"],             value: "32%",   group: 2, col: 7, row: 1 },

  // ── Group 3 — Coverage Model & Sales Process (cols 9–11) ──────────────────
  { id: 21, lines: ["Customer", "Conc."],   value: "12%",   group: 3, col: 9,  row: 0 },
  { id: 22, lines: ["Industry", "Conc."],   value: "34%",   group: 3, col: 9,  row: 1 },
  { id: 23, lines: ["ARR per", "Customer"], value: "$42K",  group: 3, col: 9,  row: 2 },
  { id: 24, lines: ["Avg Sales", "Price"],  value: "$38K",  group: 3, col: 10, row: 0 },
  { id: 25, lines: ["ARR / FTEs"],          value: "$280K", group: 3, col: 10, row: 1 },
  { id: 26, lines: ["Emp. Cost", "/ FTE"],  value: "$95K",  group: 3, col: 11, row: 0 },
  { id: 27, lines: ["Employee", "Cost Total"],value: "$4.1M",group: 3, col: 11, row: 1 },
];

// ── Helpers ───────────────────────────────────────────────────────────────────
function hexCenter(col: number, row: number) {
  return {
    x: OFFSET_X + col * COL_SPACING,
    y: OFFSET_Y + row * ROW_SPACING + (col % 2) * ODD_OFFSET,
  };
}

/** Flat-top hexagon points string for SVG <polygon>. */
function hexPoints(cx: number, cy: number, rad: number): string {
  return Array.from({ length: 6 }, (_, i) => {
    const a = (Math.PI / 3) * i;
    return `${(cx + rad * Math.cos(a)).toFixed(2)},${(cy + rad * Math.sin(a)).toFixed(2)}`;
  }).join(" ");
}

// ── Component ─────────────────────────────────────────────────────────────────
interface HCARRHoneycombProps {
  selectedId?: number | null;
  onHexClick?: (id: number) => void;
}

export function HCARRHoneycomb({ selectedId, onHexClick }: HCARRHoneycombProps = {}) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  // In dark mode add a faint white outline so dark-green hexes are visible
  // against the very dark app background.
  const hexStroke = isDark ? "rgba(255,255,255,0.13)" : "rgba(0,0,0,0.07)";
  const labelStroke = isDark ? "rgba(255,255,255,0.22)" : "rgba(0,0,0,0.14)";

  return (
    <svg
      viewBox={`0 0 ${SVG_W} ${SVG_H}`}
      width="100%"
      style={{ display: "block" }}
      aria-label="HC ARR KPI Dashboard - Honeycomb"
    >
      {HEXES.map((hex) => {
        const { x, y } = hexCenter(hex.col, hex.row);
        const style = GROUP_STYLES[hex.group];
        const fill = hex.isLabel ? style.labelFill : style.fill;
        const textCol = style.text;
        // Slight inset so strokes don't overlap adjacent hexes
        const pts = hexPoints(x, y, R - 1);

        // A hex is clickable if it's a metric hex AND has a panel defined
        const hexNumId = typeof hex.id === "number" ? hex.id : null;
        const isClickable = !hex.isLabel && hexNumId != null && !!HEX_TO_PANEL[hexNumId];
        const isSelected  = hexNumId != null && hexNumId === selectedId;

        return (
          <g
            key={hex.id}
            onClick={isClickable && onHexClick ? () => onHexClick(hexNumId!) : undefined}
            style={isClickable ? { cursor: "pointer" } : undefined}
            role={isClickable ? "button" : undefined}
            aria-pressed={isClickable ? isSelected : undefined}
            aria-label={isClickable ? `View detail for ${hex.lines.join(" ")}` : undefined}
          >
            {/* Selection ring — rendered behind the hex fill */}
            {isSelected && (
              <polygon
                points={hexPoints(x, y, R + 5)}
                fill="none"
                stroke="#6DDFA0"
                strokeWidth={2.5}
                opacity={0.9}
                pointerEvents="none"
              />
            )}
            <polygon
              points={pts}
              fill={fill}
              stroke={isSelected ? "#6DDFA0" : hex.isLabel ? labelStroke : hexStroke}
              strokeWidth={isSelected ? 1.5 : hex.isLabel ? 1.5 : 1}
              opacity={hex.isLabel ? 0.88 : 1}
            />

            {hex.isLabel ? (
              // ── Label hex text ─────────────────────────────────────────────
              <>
                <text
                  x={x} y={y - 7}
                  textAnchor="middle"
                  fill={textCol}
                  fontSize={9}
                  fontWeight="700"
                  letterSpacing="0.3"
                  fontFamily="inherit"
                  opacity={0.95}
                >
                  {hex.lines[0]}
                </text>
                {hex.lines[1] && (
                  <text
                    x={x} y={y + 7}
                    textAnchor="middle"
                    fill={textCol}
                    fontSize={9}
                    fontWeight="700"
                    letterSpacing="0.3"
                    fontFamily="inherit"
                    opacity={0.95}
                  >
                    {hex.lines[1]}
                  </text>
                )}
              </>
            ) : (
              // ── Metric hex text ────────────────────────────────────────────
              // Layout: name (1–2 lines, small, muted) + value (large, bold)
              <>
                {hex.lines.length === 1 ? (
                  <text
                    x={x} y={y - 9}
                    textAnchor="middle"
                    fill={textCol}
                    fontSize={9}
                    fontFamily="inherit"
                    opacity={0.75}
                  >
                    {hex.lines[0]}
                  </text>
                ) : (
                  <>
                    <text
                      x={x} y={y - 16}
                      textAnchor="middle"
                      fill={textCol}
                      fontSize={8.5}
                      fontFamily="inherit"
                      opacity={0.75}
                    >
                      {hex.lines[0]}
                    </text>
                    <text
                      x={x} y={y - 4}
                      textAnchor="middle"
                      fill={textCol}
                      fontSize={8.5}
                      fontFamily="inherit"
                      opacity={0.75}
                    >
                      {hex.lines[1]}
                    </text>
                  </>
                )}
                {/* Metric value — prominent */}
                <text
                  x={x} y={y + 15}
                  textAnchor="middle"
                  fill={textCol}
                  fontSize={13.5}
                  fontWeight="700"
                  fontFamily="inherit"
                >
                  {hex.value}
                </text>
              </>
            )}
          </g>
        );
      })}
    </svg>
  );
}
