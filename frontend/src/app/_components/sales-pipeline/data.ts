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
  // ── Scoping (22) ─────────────────────────────────────────────────────────────
  { company: "Acme Corp",      contact: "James Harlow",   dealSize:  45000, stage: "Scoping",   probability: 20, expectedClose: "2026-05-30", lastActivity: "2 days ago"  },
  { company: "Cloudwave",      contact: "Sarah Lin",      dealSize: 120000, stage: "Scoping",   probability: 25, expectedClose: "2026-06-15", lastActivity: "5 days ago"  },
  { company: "Meridian Tech",  contact: "Tom Bradley",    dealSize: 280000, stage: "Scoping",   probability: 30, expectedClose: "2026-07-01", lastActivity: "1 day ago"   },
  { company: "Vaultify",       contact: "Elena Rossi",    dealSize:  55000, stage: "Scoping",   probability: 20, expectedClose: "2026-05-15", lastActivity: "3 days ago"  },
  { company: "Datastream",     contact: "Kevin Park",     dealSize: 195000, stage: "Scoping",   probability: 25, expectedClose: "2026-06-30", lastActivity: "1 week ago"  },
  { company: "Orbital Data",   contact: "Dan Walsh",      dealSize:  72000, stage: "Scoping",   probability: 15, expectedClose: "2026-08-15", lastActivity: "3 days ago"  },
  { company: "Terracycle",     contact: "Mei Zhang",      dealSize: 185000, stage: "Scoping",   probability: 20, expectedClose: "2026-07-30", lastActivity: "1 week ago"  },
  { company: "Pixelwave",      contact: "Sam Torres",     dealSize:  34000, stage: "Scoping",   probability: 15, expectedClose: "2026-09-01", lastActivity: "5 days ago"  },
  { company: "Luminary AI",    contact: "Rachel Ford",    dealSize: 420000, stage: "Scoping",   probability: 25, expectedClose: "2026-08-01", lastActivity: "2 days ago"  },
  { company: "Cascadio",       contact: "Ben Murray",     dealSize:  62000, stage: "Scoping",   probability: 20, expectedClose: "2026-07-15", lastActivity: "4 days ago"  },
  { company: "Driftwood",      contact: "Lena Kim",       dealSize: 148000, stage: "Scoping",   probability: 15, expectedClose: "2026-09-15", lastActivity: "1 week ago"  },
  { company: "Syntrex",        contact: "Omar Hassan",    dealSize: 290000, stage: "Scoping",   probability: 25, expectedClose: "2026-08-30", lastActivity: "1 day ago"   },
  { company: "Kaleidoscope",   contact: "Fiona Black",    dealSize:  48000, stage: "Scoping",   probability: 15, expectedClose: "2026-07-01", lastActivity: "6 days ago"  },
  { company: "Nexora",         contact: "Will Chen",      dealSize: 310000, stage: "Scoping",   probability: 20, expectedClose: "2026-09-30", lastActivity: "2 days ago"  },
  { company: "Fluxpoint",      contact: "Anna Reed",      dealSize:  95000, stage: "Scoping",   probability: 20, expectedClose: "2026-08-15", lastActivity: "3 days ago"  },
  { company: "Cobaltiq",       contact: "James Park",     dealSize: 175000, stage: "Scoping",   probability: 25, expectedClose: "2026-07-20", lastActivity: "5 days ago"  },
  { company: "Streamline AI",  contact: "Kate Walsh",     dealSize: 230000, stage: "Scoping",   probability: 20, expectedClose: "2026-09-01", lastActivity: "4 days ago"  },
  { company: "Vortex Labs",    contact: "Raj Patel",      dealSize:  88000, stage: "Scoping",   probability: 15, expectedClose: "2026-08-30", lastActivity: "1 week ago"  },
  { company: "Chromatic",      contact: "Lisa Chen",      dealSize: 445000, stage: "Scoping",   probability: 25, expectedClose: "2026-07-15", lastActivity: "2 days ago"  },
  { company: "Pathfinder",     contact: "Tom Shaw",       dealSize:  52000, stage: "Scoping",   probability: 15, expectedClose: "2026-09-20", lastActivity: "3 days ago"  },
  { company: "QuantumLeap",    contact: "Sarah Jones",    dealSize: 320000, stage: "Scoping",   probability: 20, expectedClose: "2026-08-01", lastActivity: "Today"       },
  { company: "Helix Corp",     contact: "Mike Davis",     dealSize: 110000, stage: "Scoping",   probability: 20, expectedClose: "2026-07-30", lastActivity: "5 days ago"  },

  // ── Proposal (22) ────────────────────────────────────────────────────────────
  { company: "NexusHQ",        contact: "Alex Morgan",    dealSize:  85000, stage: "Proposal",  probability: 45, expectedClose: "2026-04-30", lastActivity: "1 day ago"   },
  { company: "Synapse",        contact: "Priya Kapoor",   dealSize: 340000, stage: "Proposal",  probability: 55, expectedClose: "2026-04-15", lastActivity: "3 days ago"  },
  { company: "Pulsate",        contact: "Chris Waller",   dealSize:  67000, stage: "Proposal",  probability: 40, expectedClose: "2026-05-01", lastActivity: "2 days ago"  },
  { company: "CoreMetrics",    contact: "Dana Flores",    dealSize: 210000, stage: "Proposal",  probability: 60, expectedClose: "2026-03-31", lastActivity: "Today"       },
  { company: "Zenflow",        contact: "Mike Chen",      dealSize:  38000, stage: "Proposal",  probability: 40, expectedClose: "2026-05-30", lastActivity: "1 week ago"  },
  { company: "Neonlink",       contact: "Zara Ahmed",     dealSize:  95000, stage: "Proposal",  probability: 45, expectedClose: "2026-06-15", lastActivity: "1 day ago"   },
  { company: "Prismatic",      contact: "Carlos Rivera",  dealSize: 260000, stage: "Proposal",  probability: 50, expectedClose: "2026-05-30", lastActivity: "2 days ago"  },
  { company: "Ironclad",       contact: "Diana Wu",       dealSize:  78000, stage: "Proposal",  probability: 40, expectedClose: "2026-06-30", lastActivity: "3 days ago"  },
  { company: "Solaris HQ",     contact: "Peter Grant",    dealSize: 380000, stage: "Proposal",  probability: 55, expectedClose: "2026-05-15", lastActivity: "Today"       },
  { company: "Maplewood",      contact: "Nina Sharma",    dealSize:  43000, stage: "Proposal",  probability: 40, expectedClose: "2026-06-01", lastActivity: "4 days ago"  },
  { company: "Thunderbolt",    contact: "Austin Lee",     dealSize: 220000, stage: "Proposal",  probability: 50, expectedClose: "2026-06-15", lastActivity: "2 days ago"  },
  { company: "Crestview",      contact: "Holly Martin",   dealSize:  65000, stage: "Proposal",  probability: 45, expectedClose: "2026-05-01", lastActivity: "1 day ago"   },
  { company: "Archetype",      contact: "Evan White",     dealSize: 150000, stage: "Proposal",  probability: 50, expectedClose: "2026-06-30", lastActivity: "3 days ago"  },
  { company: "Cobaltus",       contact: "Maya Singh",     dealSize: 490000, stage: "Proposal",  probability: 55, expectedClose: "2026-05-20", lastActivity: "Today"       },
  { company: "Ripple Effect",  contact: "Chris Brown",    dealSize:  82000, stage: "Proposal",  probability: 40, expectedClose: "2026-06-01", lastActivity: "5 days ago"  },
  { company: "Stargate IO",    contact: "Amy Clark",      dealSize: 305000, stage: "Proposal",  probability: 60, expectedClose: "2026-05-15", lastActivity: "1 day ago"   },
  { company: "Tangent Labs",   contact: "Josh Moore",     dealSize:  55000, stage: "Proposal",  probability: 40, expectedClose: "2026-06-30", lastActivity: "1 week ago"  },
  { company: "Velo Systems",   contact: "Grace Kim",      dealSize: 175000, stage: "Proposal",  probability: 50, expectedClose: "2026-05-30", lastActivity: "2 days ago"  },
  { company: "Clearpath",      contact: "Daniel Fox",     dealSize: 430000, stage: "Proposal",  probability: 55, expectedClose: "2026-06-15", lastActivity: "Today"       },
  { company: "Mosaic Data",    contact: "Priya Mehta",    dealSize:  68000, stage: "Proposal",  probability: 45, expectedClose: "2026-05-01", lastActivity: "3 days ago"  },
  { company: "Amplitude",      contact: "Ryan Scott",     dealSize: 245000, stage: "Proposal",  probability: 50, expectedClose: "2026-06-30", lastActivity: "4 days ago"  },
  { company: "Nexbridge",      contact: "Tina Lopez",     dealSize:  38000, stage: "Proposal",  probability: 40, expectedClose: "2026-05-15", lastActivity: "1 week ago"  },

  // ── Committed (20) ───────────────────────────────────────────────────────────
  { company: "Bluepoint",      contact: "Rachel Kim",     dealSize: 155000, stage: "Committed", probability: 80, expectedClose: "2026-03-15", lastActivity: "Today"       },
  { company: "Quantifi",       contact: "David Santos",   dealSize:  95000, stage: "Committed", probability: 75, expectedClose: "2026-03-30", lastActivity: "2 days ago"  },
  { company: "Stackly",        contact: "Jessica Turner", dealSize: 490000, stage: "Committed", probability: 85, expectedClose: "2026-03-20", lastActivity: "Today"       },
  { company: "Gridlock",       contact: "Nathan Hill",    dealSize:  28000, stage: "Committed", probability: 70, expectedClose: "2026-04-01", lastActivity: "3 days ago"  },
  { company: "Brightside",     contact: "Leo Wang",       dealSize: 195000, stage: "Committed", probability: 80, expectedClose: "2026-04-15", lastActivity: "Today"       },
  { company: "Cyclone Tech",   contact: "Emma Davis",     dealSize:  85000, stage: "Committed", probability: 75, expectedClose: "2026-03-30", lastActivity: "1 day ago"   },
  { company: "Fortress IO",    contact: "Aaron Hill",     dealSize: 380000, stage: "Committed", probability: 85, expectedClose: "2026-04-01", lastActivity: "Today"       },
  { company: "Glowforge",      contact: "Isabelle Ross",  dealSize:  52000, stage: "Committed", probability: 70, expectedClose: "2026-04-15", lastActivity: "2 days ago"  },
  { company: "Halo Systems",   contact: "Marcus Chen",    dealSize: 275000, stage: "Committed", probability: 80, expectedClose: "2026-03-20", lastActivity: "Today"       },
  { company: "Ironwood",       contact: "Chloe Park",     dealSize: 115000, stage: "Committed", probability: 75, expectedClose: "2026-04-30", lastActivity: "3 days ago"  },
  { company: "Javelin HQ",     contact: "Derek Stone",    dealSize: 460000, stage: "Committed", probability: 90, expectedClose: "2026-03-25", lastActivity: "Today"       },
  { company: "Kinetic IO",     contact: "Sophia Lee",     dealSize:  72000, stage: "Committed", probability: 70, expectedClose: "2026-04-10", lastActivity: "2 days ago"  },
  { company: "Lattice AI",     contact: "Brandon Kim",    dealSize: 340000, stage: "Committed", probability: 85, expectedClose: "2026-03-30", lastActivity: "1 day ago"   },
  { company: "Mindgate",       contact: "Olivia Cruz",    dealSize:  95000, stage: "Committed", probability: 75, expectedClose: "2026-04-20", lastActivity: "3 days ago"  },
  { company: "Northstar",      contact: "Tyler Reed",     dealSize: 185000, stage: "Committed", probability: 80, expectedClose: "2026-03-15", lastActivity: "Today"       },
  { company: "Opticlear",      contact: "Zoe Hamilton",   dealSize:  68000, stage: "Committed", probability: 70, expectedClose: "2026-04-25", lastActivity: "4 days ago"  },
  { company: "Pangea Data",    contact: "Nathan Fox",     dealSize: 295000, stage: "Committed", probability: 85, expectedClose: "2026-03-20", lastActivity: "1 day ago"   },
  { company: "Quicksilver",    contact: "Riley Morgan",   dealSize:  42000, stage: "Committed", probability: 70, expectedClose: "2026-04-30", lastActivity: "5 days ago"  },
  { company: "Redpoint",       contact: "Claire Scott",   dealSize: 215000, stage: "Committed", probability: 80, expectedClose: "2026-03-25", lastActivity: "2 days ago"  },
  { company: "Silvertech",     contact: "Ian Walsh",      dealSize: 125000, stage: "Committed", probability: 75, expectedClose: "2026-04-15", lastActivity: "3 days ago"  },

  // ── Won (4) ──────────────────────────────────────────────────────────────────
  { company: "Hexaware",       contact: "Amanda Clark",   dealSize: 310000, stage: "Won",       probability: 100, expectedClose: "2026-02-15", lastActivity: "2026-02-15" },
  { company: "Pivotal",        contact: "Robert Evans",   dealSize:  75000, stage: "Won",       probability: 100, expectedClose: "2026-01-31", lastActivity: "2026-01-31" },
  { company: "LoopHQ",         contact: "Sophia Patel",   dealSize: 180000, stage: "Won",       probability: 100, expectedClose: "2026-02-10", lastActivity: "2026-02-10" },
  { company: "Specter",        contact: "Lucas Wright",   dealSize:  42000, stage: "Won",       probability: 100, expectedClose: "2026-02-05", lastActivity: "2026-02-05" },
];

export const wonDeals      = allDeals.filter((d) => d.stage === "Won");
export const pipelineDeals = allDeals.filter((d) => d.stage !== "Won");

// ─── Bubble chart positions (computed from deal data) ─────────────────────────
// x = stageIndex ± small jitter  |  y = evenly spaced within funnel bounds
// z = dealSize (raw $, Highcharts normalises to bubble area)

const STAGE_PARAMS: Record<Deal["stage"], { index: number; yBound: number }> = {
  Scoping:   { index: 0, yBound: 3.8 },
  Proposal:  { index: 1, yBound: 2.8 },
  Committed: { index: 2, yBound: 1.8 },
  Won:       { index: 3, yBound: 1.0 },
};

// Repeating x-jitter pattern to stagger same-stage bubbles horizontally
const X_JITTER = [-0.07, 0.05, -0.03, 0.08, 0.00, -0.06, 0.04, -0.02, 0.07, 0.01];

function computeStagePoints(stageDeals: Deal[], stage: Deal["stage"]): BubblePoint[] {
  const { index, yBound } = STAGE_PARAMS[stage];
  const n = stageDeals.length;
  return stageDeals.map((d, i) => ({
    x: parseFloat((index + X_JITTER[i % X_JITTER.length]).toFixed(3)),
    y: parseFloat((n === 1 ? 0 : -yBound + (2 * yBound * i) / (n - 1)).toFixed(3)),
    z: d.dealSize,
    name: d.company,
    stage: d.stage,
    probability: d.probability,
  }));
}

export const allBubblePoints: BubblePoint[] = [
  ...computeStagePoints(allDeals.filter((d) => d.stage === "Scoping"),   "Scoping"),
  ...computeStagePoints(allDeals.filter((d) => d.stage === "Proposal"),  "Proposal"),
  ...computeStagePoints(allDeals.filter((d) => d.stage === "Committed"), "Committed"),
  ...computeStagePoints(allDeals.filter((d) => d.stage === "Won"),       "Won"),
];

export const MAX_DEAL_SIZE = Math.max(...allDeals.map((d) => d.dealSize));

export const FUNNEL_STAGE_COLORS: Record<string, string> = {
  Scoping:   chartColor(0),  // #8087E8
  Proposal:  chartColor(2),  // #F19E53
  Committed: chartColor(1),  // #A3EDBA
  Won:       "#10b981",
};

// ─── KPI totals ───────────────────────────────────────────────────────────────

const pipelineTotal = pipelineDeals.reduce((s, d) => s + d.dealSize, 0);
const wonTotal      = wonDeals.reduce((s, d) => s + d.dealSize, 0);
const avgDealSize   = Math.round(pipelineTotal / pipelineDeals.length);

function fmtVal(n: number): string {
  return n >= 1_000_000
    ? `$${(n / 1_000_000).toFixed(1)}M`
    : `$${Math.round(n / 1000)}K`;
}

export const salesPipelineKpis = [
  {
    title: "Total Pipeline Value",
    value: fmtVal(pipelineTotal),
    subtitle: `${pipelineDeals.length} active deals`,
    trend: `${fmtVal(pipelineTotal)} in pipe`,
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
    value: fmtVal(avgDealSize),
    subtitle: "Pipeline average",
    trend: `${fmtVal(Math.round(wonTotal / wonDeals.length))} avg on closed`,
    positive: true,
  },
  {
    title: "Win Rate",
    value: `${Math.round((wonDeals.length / allDeals.length) * 100)}%`,
    subtitle: `${wonDeals.length} closed of ${allDeals.length}`,
    trend: `${fmtVal(wonTotal)} closed this quarter`,
    positive: true,
  },
];
