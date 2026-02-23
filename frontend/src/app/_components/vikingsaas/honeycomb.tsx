"use client";

import React from "react";
import { useTheme } from "next-themes";

import { HEX_TO_PANEL } from "./data";

// ── Geometry ──────────────────────────────────────────────────────────────────
const R           = 58;                          // hex radius (vertex to centre)
const COL_SPACING = R * 1.5;                     // 87 px  — horizontal centre-to-centre
const ROW_SPACING = R * Math.sqrt(3);            // ≈100.4 px — vertical centre-to-centre
const ODD_OFFSET  = ROW_SPACING / 2;             // ≈50.2 px  — odd-col y-shift (down)

const OFFSET_X = 85;
const OFFSET_Y = 165;   // room for category labels above
const SVG_W    = 980;
const SVG_H    = 710;

// ── Types ─────────────────────────────────────────────────────────────────────
type Group = 1 | 2 | 3;

interface HexDef {
  id: number;
  lines: string[]; // 1–2 label lines inside the hex
  value: string;   // prominent metric value
  group: Group;
  col: number;
  row: number;
}

// ── Group colour palette ───────────────────────────────────────────────────────
// Group 1 — dark forest green  |  Group 2 — medium green  |  Group 3 — warm cream
const GROUP_STYLES: Record<Group, { fill: string; text: string }> = {
  1: { fill: "#1a2e2a", text: "#ffffff" },
  2: { fill: "#4a7c59", text: "#ffffff" },
  3: { fill: "#f5f0d0", text: "#1a2e2a" },
};

// ── Hex positions ─────────────────────────────────────────────────────────────
// Clusters are directly adjacent — no gap columns.
//
//   Group 1  cols 0–3   pyramid 1 → 3 → 4 → 5  =  13 hexes  (Growth & Profitability)
//   Group 2  cols 4–6   profile  3 → 2 → 2      =   7 hexes  (CAC & Sales Efficiency)
//   Group 3  cols 7–9   profile  3 → 2 → 2      =   7 hexes  (Coverage Model & Sales Process)
//
// Centre coords:  x = OFFSET_X + col * COL_SPACING
//                 y = OFFSET_Y + row * ROW_SPACING          (even col)
//                   + ODD_OFFSET                            (odd col)
const HEXES: HexDef[] = [
  // ── Group 1 — Growth & Profitability ─────────────────────────────────────

  // col 0 (1 hex — pyramid apex, centred at row 2)
  { id: 1,  lines: ["Total ARR"],              value: "$4.2M",  group: 1, col: 0, row: 2 },

  // col 1 (3 hexes, rows 1–3)
  { id: 2,  lines: ["Total ARR", "Growth"],    value: "+16%",   group: 1, col: 1, row: 1 },
  { id: 3,  lines: ["Organic ARR", "Growth"],  value: "+13%",   group: 1, col: 1, row: 2 },
  { id: 4,  lines: ["New Sales", "ARR Grwth"], value: "+18%",   group: 1, col: 1, row: 3 },

  // col 2 (4 hexes, rows 0–3)
  { id: 5,  lines: ["% Recurring", "Revenue"], value: "87%",    group: 1, col: 2, row: 0 },
  { id: 6,  lines: ["Churn"],                  value: "8.5%",   group: 1, col: 2, row: 1 },
  { id: 7,  lines: ["Renewal Rate"],           value: "91%",    group: 1, col: 2, row: 2 },
  { id: 8,  lines: ["Rule of 40"],             value: "34",     group: 1, col: 2, row: 3 },

  // col 3 (5 hexes, rows 0–4)
  { id: 9,  lines: ["SaaS Gross", "Margin"],   value: "74%",    group: 1, col: 3, row: 0 },
  { id: 10, lines: ["Growth", "Endurance"],    value: "0.81",   group: 1, col: 3, row: 1 },
  { id: 11, lines: ["EBITDA"],                 value: "12%",    group: 1, col: 3, row: 2 },
  { id: 12, lines: ["EBITDA-Capex"],           value: "$380K",  group: 1, col: 3, row: 3 },
  { id: 13, lines: ["Operating", "Cash Flow"], value: "$510K",  group: 1, col: 3, row: 4 },

  // ── Group 2 — CAC & Sales Efficiency ──────────────────────────────────────

  // col 4 (3 hexes, rows 0–2)
  { id: 14, lines: ["Net Rev.", "Retention"],  value: "108%",   group: 2, col: 4, row: 0 },
  { id: 15, lines: ["CAC Payback"],            value: "16 mo",  group: 2, col: 4, row: 1 },
  { id: 16, lines: ["LTV / CAC"],              value: "4.2×",   group: 2, col: 4, row: 2 },

  // col 5 (2 hexes, rows 0–1)
  { id: 17, lines: ["Magic", "Number"],        value: "0.82",   group: 2, col: 5, row: 0 },
  { id: 18, lines: ["Yield", "per Rep"],       value: "$420K",  group: 2, col: 5, row: 1 },

  // col 6 (2 hexes, rows 0–1)
  { id: 19, lines: ["S&M % ARR"],              value: "28%",    group: 2, col: 6, row: 0 },
  { id: 20, lines: ["R&D % ARR"],              value: "32%",    group: 2, col: 6, row: 1 },

  // ── Group 3 — Coverage Model & Sales Process ──────────────────────────────

  // col 7 (3 hexes, rows 0–2)
  { id: 21, lines: ["Customer", "Conc."],      value: "12%",    group: 3, col: 7, row: 0 },
  { id: 22, lines: ["Industry", "Conc."],      value: "34%",    group: 3, col: 7, row: 1 },
  { id: 23, lines: ["ARR per", "Customer"],    value: "$42K",   group: 3, col: 7, row: 2 },

  // col 8 (2 hexes, rows 0–1)
  { id: 24, lines: ["Avg Sales", "Price"],     value: "$38K",   group: 3, col: 8, row: 0 },
  { id: 25, lines: ["ARR / FTEs"],             value: "$280K",  group: 3, col: 8, row: 1 },

  // col 9 (2 hexes, rows 0–1)
  { id: 26, lines: ["Emp. Cost", "/ FTE"],     value: "$95K",   group: 3, col: 9, row: 0 },
  { id: 27, lines: ["Employee", "Cost Total"], value: "$4.1M",  group: 3, col: 9, row: 1 },
];

// ── Category labels (plain SVG text above each cluster) ───────────────────────
interface CatLabel { lines: string[]; x: number; yTop: number; group: Group }
const CAT_LABELS: CatLabel[] = [
  {
    lines: ["Growth &", "Profitability"],
    // midpoint of cols 0-3  →  col 1.5
    x: OFFSET_X + 1.5 * COL_SPACING,
    yTop: OFFSET_Y - R - 22,
    group: 1,
  },
  {
    lines: ["CAC &", "Sales Efficiency"],
    // midpoint of cols 4-6  →  col 5
    x: OFFSET_X + 5.0 * COL_SPACING,
    yTop: OFFSET_Y - R - 22,
    group: 2,
  },
  {
    lines: ["Coverage Model &", "Sales Process"],
    // midpoint of cols 7-9  →  col 8
    x: OFFSET_X + 8.0 * COL_SPACING,
    yTop: OFFSET_Y - R - 22,
    group: 3,
  },
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

  // Subtle border between neighbouring hexes
  const hexStroke = isDark ? "rgba(255,255,255,0.13)" : "rgba(0,0,0,0.07)";

  // Category label text colour — muted but readable on both themes
  const catLabelColor = isDark ? "#94a3b8" : "#475569";

  return (
    <svg
      viewBox={`0 0 ${SVG_W} ${SVG_H}`}
      width="100%"
      style={{ display: "block" }}
      aria-label="HC ARR KPI Dashboard - Honeycomb"
    >
      {/* ── Category labels (above each cluster) ──────────────────────────── */}
      {CAT_LABELS.map((cl) => (
        <g key={cl.group}>
          {cl.lines.map((line, i) => (
            <text
              key={i}
              x={cl.x}
              y={cl.yTop + i * 14}
              textAnchor="middle"
              fill={catLabelColor}
              fontSize={11}
              fontWeight="700"
              fontFamily="inherit"
              letterSpacing="0.3"
            >
              {line}
            </text>
          ))}
        </g>
      ))}

      {/* ── Hex cells ─────────────────────────────────────────────────────── */}
      {HEXES.map((hex) => {
        const { x, y } = hexCenter(hex.col, hex.row);
        const style      = GROUP_STYLES[hex.group];
        const pts        = hexPoints(x, y, R - 1);
        const isClickable = !!HEX_TO_PANEL[hex.id];
        const isSelected  = hex.id === selectedId;

        return (
          <g
            key={hex.id}
            onClick={isClickable && onHexClick ? () => onHexClick(hex.id) : undefined}
            style={isClickable ? { cursor: "pointer" } : undefined}
            role={isClickable ? "button" : undefined}
            aria-pressed={isClickable ? isSelected : undefined}
            aria-label={
              isClickable ? `View detail for ${hex.lines.join(" ")}` : undefined
            }
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
              fill={style.fill}
              stroke={isSelected ? "#6DDFA0" : hexStroke}
              strokeWidth={isSelected ? 1.5 : 1}
            />

            {/* ── Metric name (small, muted) ── */}
            {hex.lines.length === 1 ? (
              <text
                x={x}
                y={y - 9}
                textAnchor="middle"
                fill={style.text}
                fontSize={9}
                fontFamily="inherit"
                opacity={0.75}
              >
                {hex.lines[0]}
              </text>
            ) : (
              <>
                <text
                  x={x}
                  y={y - 16}
                  textAnchor="middle"
                  fill={style.text}
                  fontSize={8.5}
                  fontFamily="inherit"
                  opacity={0.75}
                >
                  {hex.lines[0]}
                </text>
                <text
                  x={x}
                  y={y - 4}
                  textAnchor="middle"
                  fill={style.text}
                  fontSize={8.5}
                  fontFamily="inherit"
                  opacity={0.75}
                >
                  {hex.lines[1]}
                </text>
              </>
            )}

            {/* ── Metric value (prominent) ── */}
            <text
              x={x}
              y={y + 15}
              textAnchor="middle"
              fill={style.text}
              fontSize={13.5}
              fontWeight="700"
              fontFamily="inherit"
            >
              {hex.value}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
