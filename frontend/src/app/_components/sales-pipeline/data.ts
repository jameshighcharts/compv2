import { chartColor } from "@/components/ui/highcharts";

export type Deal = {
  company: string;
  contact: string;
  dealSize: number;
  stage: "Scoping" | "Proposal" | "Committed" | "Won";
  probability: number;
  expectedClose: string;
  lastActivity: string;
};

export type BubblePoint = {
  x: number;
  y: number;
  z: number;
  name: string;
  stage: string;
  probability: number;
};

export const allDeals: Deal[] = [
  // Scoping (5) ─ stageIndex 0
  { company: "Acme Corp",     contact: "James Harlow",   dealSize:  45000, stage: "Scoping",   probability: 20, expectedClose: "2026-05-30", lastActivity: "2 days ago"  },
  { company: "Cloudwave",     contact: "Sarah Lin",      dealSize: 120000, stage: "Scoping",   probability: 25, expectedClose: "2026-06-15", lastActivity: "5 days ago"  },
  { company: "Meridian Tech", contact: "Tom Bradley",    dealSize: 280000, stage: "Scoping",   probability: 30, expectedClose: "2026-07-01", lastActivity: "1 day ago"   },
  { company: "Vaultify",      contact: "Elena Rossi",    dealSize:  55000, stage: "Scoping",   probability: 20, expectedClose: "2026-05-15", lastActivity: "3 days ago"  },
  { company: "Datastream",    contact: "Kevin Park",     dealSize: 195000, stage: "Scoping",   probability: 25, expectedClose: "2026-06-30", lastActivity: "1 week ago"  },
  // Proposal (5) ─ stageIndex 1
  { company: "NexusHQ",       contact: "Alex Morgan",    dealSize:  85000, stage: "Proposal",  probability: 45, expectedClose: "2026-04-30", lastActivity: "1 day ago"   },
  { company: "Synapse",       contact: "Priya Kapoor",   dealSize: 340000, stage: "Proposal",  probability: 55, expectedClose: "2026-04-15", lastActivity: "3 days ago"  },
  { company: "Pulsate",       contact: "Chris Waller",   dealSize:  67000, stage: "Proposal",  probability: 40, expectedClose: "2026-05-01", lastActivity: "2 days ago"  },
  { company: "CoreMetrics",   contact: "Dana Flores",    dealSize: 210000, stage: "Proposal",  probability: 60, expectedClose: "2026-03-31", lastActivity: "Today"       },
  { company: "Zenflow",       contact: "Mike Chen",      dealSize:  38000, stage: "Proposal",  probability: 40, expectedClose: "2026-05-30", lastActivity: "1 week ago"  },
  // Committed (4) ─ stageIndex 2
  { company: "Bluepoint",     contact: "Rachel Kim",     dealSize: 155000, stage: "Committed", probability: 80, expectedClose: "2026-03-15", lastActivity: "Today"       },
  { company: "Quantifi",      contact: "David Santos",   dealSize:  95000, stage: "Committed", probability: 75, expectedClose: "2026-03-30", lastActivity: "2 days ago"  },
  { company: "Stackly",       contact: "Jessica Turner", dealSize: 490000, stage: "Committed", probability: 85, expectedClose: "2026-03-20", lastActivity: "Today"       },
  { company: "Gridlock",      contact: "Nathan Hill",    dealSize:  28000, stage: "Committed", probability: 70, expectedClose: "2026-04-01", lastActivity: "3 days ago"  },
  // Won (4) ─ stageIndex 3
  { company: "Hexaware",      contact: "Amanda Clark",   dealSize: 310000, stage: "Won",       probability: 100, expectedClose: "2026-02-15", lastActivity: "2026-02-15" },
  { company: "Pivotal",       contact: "Robert Evans",   dealSize:  75000, stage: "Won",       probability: 100, expectedClose: "2026-01-31", lastActivity: "2026-01-31" },
  { company: "LoopHQ",        contact: "Sophia Patel",   dealSize: 180000, stage: "Won",       probability: 100, expectedClose: "2026-02-10", lastActivity: "2026-02-10" },
  { company: "Specter",       contact: "Lucas Wright",   dealSize:  42000, stage: "Won",       probability: 100, expectedClose: "2026-02-05", lastActivity: "2026-02-05" },
];

export const wonDeals = allDeals.filter((d) => d.stage === "Won");
export const pipelineDeals = allDeals.filter((d) => d.stage !== "Won");

// ─── Bubble chart funnel positions ───────────────────────────────────────────
// x = stageIndex ± 0.08 jitter
// y = evenly spaced within per-stage bounds (Scoping ±3.0, Proposal ±2.2, Committed ±1.5, Won ±1.0)
// z = dealSize (raw $)

const scopingBubbles: BubblePoint[] = [
  { x:  0.05, y: -3.00, z:  45000, name: "Acme Corp",     stage: "Scoping",   probability: 20 },
  { x: -0.03, y: -1.50, z: 120000, name: "Cloudwave",     stage: "Scoping",   probability: 25 },
  { x:  0.08, y:  0.00, z: 280000, name: "Meridian Tech", stage: "Scoping",   probability: 30 },
  { x: -0.06, y:  1.50, z:  55000, name: "Vaultify",      stage: "Scoping",   probability: 20 },
  { x:  0.02, y:  3.00, z: 195000, name: "Datastream",    stage: "Scoping",   probability: 25 },
];

const proposalBubbles: BubblePoint[] = [
  { x:  1.04, y: -2.20, z:  85000, name: "NexusHQ",       stage: "Proposal",  probability: 45 },
  { x:  0.96, y: -1.10, z: 340000, name: "Synapse",        stage: "Proposal",  probability: 55 },
  { x:  1.07, y:  0.00, z:  67000, name: "Pulsate",        stage: "Proposal",  probability: 40 },
  { x:  0.93, y:  1.10, z: 210000, name: "CoreMetrics",    stage: "Proposal",  probability: 60 },
  { x:  1.05, y:  2.20, z:  38000, name: "Zenflow",        stage: "Proposal",  probability: 40 },
];

const committedBubbles: BubblePoint[] = [
  { x:  2.05, y: -1.50, z: 155000, name: "Bluepoint",      stage: "Committed", probability: 80 },
  { x:  1.96, y: -0.50, z:  95000, name: "Quantifi",       stage: "Committed", probability: 75 },
  { x:  2.07, y:  0.50, z: 490000, name: "Stackly",        stage: "Committed", probability: 85 },
  { x:  1.94, y:  1.50, z:  28000, name: "Gridlock",       stage: "Committed", probability: 70 },
];

const wonBubbles: BubblePoint[] = [
  { x:  3.03, y: -1.00, z: 310000, name: "Hexaware",       stage: "Won",       probability: 100 },
  { x:  2.97, y: -0.33, z:  75000, name: "Pivotal",        stage: "Won",       probability: 100 },
  { x:  3.06, y:  0.33, z: 180000, name: "LoopHQ",         stage: "Won",       probability: 100 },
  { x:  2.95, y:  1.00, z:  42000, name: "Specter",        stage: "Won",       probability: 100 },
];

export const funnelSeries = [
  { name: "Scoping",   color: chartColor(0),  data: scopingBubbles   },
  { name: "Proposal",  color: chartColor(2),  data: proposalBubbles  },
  { name: "Committed", color: chartColor(1),  data: committedBubbles },
  { name: "Won",       color: "#10b981",      data: wonBubbles       },
] as const;

// ─── KPI totals ───────────────────────────────────────────────────────────────
const pipelineTotal = pipelineDeals.reduce((s, d) => s + d.dealSize, 0);
const wonTotal      = wonDeals.reduce((s, d) => s + d.dealSize, 0);

export const salesPipelineKpis = [
  {
    title: "Total Pipeline Value",
    value: "$2.2M",
    subtitle: `${pipelineDeals.length} active deals`,
    trend: `+${Math.round(pipelineTotal / 1000)}K in pipe`,
    positive: true,
  },
  {
    title: "Deals in Pipe",
    value: String(pipelineDeals.length),
    subtitle: "Scoping · Proposal · Committed",
    trend: `${allDeals.length} total tracked`,
    positive: true,
  },
  {
    title: "Avg Deal Size",
    value: "$157K",
    subtitle: "Pipeline average",
    trend: `$${Math.round(wonTotal / wonDeals.length / 1000)}K avg on closed`,
    positive: true,
  },
  {
    title: "Win Rate",
    value: "22%",
    subtitle: `${wonDeals.length} closed of ${allDeals.length}`,
    trend: "$607K closed this quarter",
    positive: true,
  },
];
