"use client";

import * as React from "react";
import { IconDownload } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { HCARRHoneycomb } from "./honeycomb";
import { DetailPanel } from "./detail-panel";
import { HEX_TO_PANEL } from "./data";

// ── KPI highlight cards shown below the honeycomb ─────────────────────────────
const HIGHLIGHTS = [
  { label: "Total ARR",      value: "$4.2M",  sub: "+16% YoY",     accent: "#6DDFA0" },
  { label: "Rule of 40",     value: "34",     sub: "Target ≥ 40",  accent: "#F7A85E" },
  { label: "NRR",            value: "108%",   sub: "Net Rev. Retention", accent: "#9198F0" },
  { label: "CAC Payback",    value: "16 mo",  sub: "Target < 18 mo", accent: "#7DBFCE" },
  { label: "SaaS Magic No.", value: "0.82",   sub: "Target > 0.75", accent: "#EBD95F" },
  { label: "EBITDA",         value: "12%",    sub: "vs 10% target", accent: "#6DDFA0" },
];

// ── Legend items ──────────────────────────────────────────────────────────────
const LEGEND = [
  { color: "#1a2e2a", label: "Growth & Profitability" },
  { color: "#4a7c59", label: "CAC & Sales Efficiency" },
  { color: "#f5f0d0", label: "Coverage Model & Sales Process", dark: true },
];

export function HCARRView() {
  const [selectedHex, setSelectedHex] = React.useState<number | null>(null);

  const handleHexClick = React.useCallback((id: number) => {
    // Toggle: click the same hex again to close the panel
    setSelectedHex((prev) => (prev === id ? null : id));
  }, []);

  const hasPanel = selectedHex != null && !!HEX_TO_PANEL[selectedHex];

  return (
    <div>
      {/* ── Page header ─────────────────────────────────────────────────────── */}
      <div className="flex flex-col items-start justify-between gap-2 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">HC ARR KPI Dashboard</h1>
          <p className="text-muted-foreground">HC ARR Framework · FY 2024</p>
        </div>
        <div className="flex items-center gap-2">
          <Select defaultValue="fy24">
            <SelectTrigger className="w-[130px]" aria-label="Period">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="q4">Q4 2024</SelectItem>
              <SelectItem value="fy24">FY 2024</SelectItem>
              <SelectItem value="fy23">FY 2023</SelectItem>
              <SelectItem value="ttm">TTM</SelectItem>
            </SelectContent>
          </Select>
          <Button size="sm" variant="outline">
            <IconDownload className="mr-2 size-4" aria-hidden="true" />
            Export
          </Button>
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-5">

        {/* ── Honeycomb card ──────────────────────────────────────────────────── */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between gap-4">
              <div>
                <CardTitle>HC ARR KPI Dashboard — Honeycomb</CardTitle>
                <CardDescription>
                  27 KPIs across three clusters · click a highlighted cell to drill into detail
                </CardDescription>
              </div>
              {/* Colour legend */}
              <div className="flex shrink-0 flex-wrap items-center gap-x-4 gap-y-1.5">
                {LEGEND.map((l) => (
                  <div key={l.label} className="flex items-center gap-1.5">
                    <span
                      className="inline-block h-3 w-4 shrink-0 rounded-sm border border-border/60"
                      style={{ background: l.color }}
                    />
                    <span className="text-[11px] text-muted-foreground">{l.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent className="overflow-x-auto pb-4">
            <div className="min-w-[760px]">
              <HCARRHoneycomb
                selectedId={selectedHex}
                onHexClick={handleHexClick}
              />
            </div>
          </CardContent>
        </Card>

        {/* ── Detail panel — appears below the honeycomb when a hex is clicked ── */}
        {hasPanel && (
          <DetailPanel
            hexId={selectedHex}
            onClose={() => setSelectedHex(null)}
          />
        )}

        {/* ── KPI highlight row ────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {HIGHLIGHTS.map((h) => (
            <Card key={h.label} className="relative overflow-hidden">
              {/* accent bar */}
              <span
                className="absolute inset-x-0 top-0 h-0.5"
                style={{ background: h.accent }}
              />
              <CardContent className="pt-4 pb-3">
                <p className="text-[11px] font-medium text-muted-foreground">{h.label}</p>
                <p
                  className="mt-1 text-2xl font-bold tracking-tight"
                  style={{ color: h.accent }}
                >
                  {h.value}
                </p>
                <p className="mt-0.5 text-[11px] text-muted-foreground">{h.sub}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* ── Metric glossary strip ─────────────────────────────────────────────── */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">KPI Reference</CardTitle>
            <CardDescription>
              All 27 HC ARR Framework metrics with categories and types
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-x-8 gap-y-1 text-[11px] sm:grid-cols-2 lg:grid-cols-3">
              {GLOSSARY.map((g) => (
                <div
                  key={g.name}
                  className="flex items-baseline justify-between gap-2 border-b border-border/40 py-1.5"
                >
                  <span className="font-medium text-foreground/80">{g.name}</span>
                  <span
                    className="shrink-0 rounded-full px-2 py-0.5 font-semibold"
                    style={{
                      background: CATEGORY_COLOR[g.cat] + "22",
                      color: CATEGORY_COLOR[g.cat],
                      border: `1px solid ${CATEGORY_COLOR[g.cat]}44`,
                    }}
                  >
                    {g.type}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}

// ── Glossary data ─────────────────────────────────────────────────────────────
const CATEGORY_COLOR: Record<string, string> = {
  "Growth":   "#6DDFA0",
  "CAC":      "#9198F0",
  "Coverage": "#EBD95F",
};

const GLOSSARY = [
  // Growth & Profitability
  { name: "Total ARR",                cat: "Growth",   type: "$" },
  { name: "Total ARR Growth",         cat: "Growth",   type: "%" },
  { name: "Organic ARR Growth Rate",  cat: "Growth",   type: "%" },
  { name: "New Sales ARR Growth",     cat: "Growth",   type: "%" },
  { name: "% Recurring Revenue",      cat: "Growth",   type: "%" },
  { name: "Churn (ARR & Customer)",   cat: "Growth",   type: "%" },
  { name: "Renewal Rate",             cat: "Growth",   type: "%" },
  { name: "Rule of 40",               cat: "Growth",   type: "Score" },
  { name: "SaaS Gross Margin",        cat: "Growth",   type: "%" },
  { name: "Growth Endurance",         cat: "Growth",   type: "Ratio" },
  { name: "EBITDA",                   cat: "Growth",   type: "%/$" },
  { name: "EBITDA-Capex",             cat: "Growth",   type: "$" },
  { name: "Operating Cash Flow/FCF",  cat: "Growth",   type: "$" },
  // CAC & Sales Efficiency
  { name: "Net Revenue Retention",    cat: "CAC",      type: "%" },
  { name: "CAC Payback",              cat: "CAC",      type: "Months" },
  { name: "LTV / CAC",                cat: "CAC",      type: "Ratio" },
  { name: "SaaS Magic Number",        cat: "CAC",      type: "Ratio" },
  { name: "Yield per Rep",            cat: "CAC",      type: "$" },
  { name: "S&M % of ARR",             cat: "CAC",      type: "%" },
  { name: "R&D % of ARR",             cat: "CAC",      type: "%" },
  // Coverage Model
  { name: "Customer Concentration",   cat: "Coverage", type: "%" },
  { name: "Industry Concentration",   cat: "Coverage", type: "%" },
  { name: "ARR per Customer",         cat: "Coverage", type: "$" },
  { name: "Average Sales Price",      cat: "Coverage", type: "$" },
  { name: "ARR / FTEs",               cat: "Coverage", type: "$" },
  { name: "Employee Costs / FTEs",    cat: "Coverage", type: "$" },
  { name: "Employee Cost Total",      cat: "Coverage", type: "$" },
];
