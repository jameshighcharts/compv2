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

// ─── Per-company detail cards (shown in bubble click-popup) ──────────────────

export type CompanyInfo = {
  industry: string;
  employees: string;
  yearlyRevenue: string;
  description: string;
};

export const COMPANY_INFO: Record<string, CompanyInfo> = {
  // Scoping
  "Acme Corp":      { industry: "Manufacturing SaaS",    employees: "80–150",     yearlyRevenue: "$8M ARR",   description: "Acme Corp modernises shop-floor operations for mid-market manufacturers with real-time OEE dashboards and predictive maintenance alerts." },
  "Cloudwave":      { industry: "Cloud Infrastructure",  employees: "120–200",    yearlyRevenue: "$14M ARR",  description: "Cloudwave provides multi-cloud cost optimisation and workload orchestration, cutting average cloud spend by 28% for enterprise teams." },
  "Meridian Tech":  { industry: "Data & Analytics",      employees: "300–500",    yearlyRevenue: "$35M ARR",  description: "Meridian Tech's unified data fabric connects disparate warehouses and lakes, enabling sub-second BI queries across petabyte-scale datasets." },
  "Vaultify":       { industry: "Cybersecurity",         employees: "40–80",      yearlyRevenue: "$4M ARR",   description: "Vaultify automates secrets management and zero-trust access policies for DevSecOps teams, integrating natively with all major CI/CD pipelines." },
  "Datastream":     { industry: "Data & Analytics",      employees: "200–350",    yearlyRevenue: "$22M ARR",  description: "Datastream delivers real-time event streaming and enrichment pipelines, processing over 50 billion events per day for global media and retail clients." },
  "Orbital Data":   { industry: "Geospatial Intelligence", employees: "60–120",   yearlyRevenue: "$7M ARR",   description: "Orbital Data specialises in satellite-derived geospatial intelligence, turning raw imagery into actionable supply-chain market signals." },
  "Terracycle":     { industry: "Sustainability Tech",   employees: "150–250",    yearlyRevenue: "$18M ARR",  description: "Terracycle tracks Scope 1–3 emissions across complex value chains, generating audit-ready ESG reports in minutes rather than months." },
  "Pixelwave":      { industry: "Creative SaaS",         employees: "25–60",      yearlyRevenue: "$3M ARR",   description: "Pixelwave gives in-house creative teams AI-assisted layout generation and brand-compliance checking, reducing design iteration cycles by 60%." },
  "Luminary AI":    { industry: "AI / ML Platform",      employees: "400–700",    yearlyRevenue: "$48M ARR",  description: "Luminary AI provides enterprise-grade LLM fine-tuning and deployment infrastructure with full data-residency controls for regulated industries." },
  "Cascadio":       { industry: "RevOps",                employees: "50–90",      yearlyRevenue: "$6M ARR",   description: "Cascadio unifies CRM, billing, and support signals into a single revenue operations layer, surfacing churn risk and expansion opportunities automatically." },
  "Driftwood":      { industry: "HR Tech",               employees: "100–180",    yearlyRevenue: "$11M ARR",  description: "Driftwood streamlines contractor lifecycle management—from onboarding and compliance to payments—across 60+ countries." },
  "Syntrex":        { industry: "Supply Chain",          employees: "350–600",    yearlyRevenue: "$38M ARR",  description: "Syntrex connects procurement, logistics, and finance teams on a single control tower with AI-driven risk alerts and end-to-end visibility." },
  "Kaleidoscope":   { industry: "Marketing Tech",        employees: "30–70",      yearlyRevenue: "$3.5M ARR", description: "Kaleidoscope makes personalised video at scale effortless—brands dynamically assemble thousands of unique video variants from a single template." },
  "Nexora":         { industry: "FinTech",               employees: "500–800",    yearlyRevenue: "$55M ARR",  description: "Nexora powers embedded lending infrastructure for SaaS platforms, enabling instant credit decisioning and white-label loan origination in under a day." },
  "Fluxpoint":      { industry: "DevTools",              employees: "80–140",     yearlyRevenue: "$9M ARR",   description: "Fluxpoint is a feature-flag and experimentation platform that lets engineering teams ship and test changes safely at any scale without deployment risk." },
  "Cobaltiq":       { industry: "Cybersecurity",         employees: "130–220",    yearlyRevenue: "$16M ARR",  description: "Cobaltiq's autonomous threat-hunting engine continuously scans dark-web sources and internal telemetry to deliver prioritised, remediation-ready alerts." },
  "Streamline AI":  { industry: "Legal Tech",            employees: "200–400",    yearlyRevenue: "$26M ARR",  description: "Streamline AI accelerates contract review and negotiation using purpose-built legal LLMs, cutting outside-counsel spend by an average of 35%." },
  "Vortex Labs":    { industry: "IoT Platform",          employees: "70–130",     yearlyRevenue: "$8.5M ARR", description: "Vortex Labs connects millions of industrial IoT devices with an edge-computing layer that performs real-time anomaly detection without cloud dependency." },
  "Chromatic":      { industry: "Design Infrastructure", employees: "500–900",    yearlyRevenue: "$58M ARR",  description: "Chromatic is the enterprise design-system platform, hosting UI component libraries and automating visual regression testing across every pull request." },
  "Pathfinder":     { industry: "Field Service",         employees: "40–80",      yearlyRevenue: "$4.5M ARR", description: "Pathfinder optimises field-service dispatch and routing with ML scheduling that reduces travel time by 22% and improves first-time fix rates." },
  "QuantumLeap":    { industry: "EdTech",                employees: "450–750",    yearlyRevenue: "$42M ARR",  description: "QuantumLeap delivers adaptive learning pathways for enterprise upskilling, connecting skills-gap analytics directly to measurable business outcomes." },
  "Helix Corp":     { industry: "Healthcare IT",         employees: "110–200",    yearlyRevenue: "$12M ARR",  description: "Helix Corp's clinical data interoperability layer harmonises HL7 and FHIR feeds across hospital systems, enabling real-time care coordination dashboards." },
  // Proposal
  "NexusHQ":        { industry: "Sales Intelligence",    employees: "90–160",     yearlyRevenue: "$10M ARR",  description: "NexusHQ surfaces buying-intent signals and contact intelligence in real time, helping enterprise sales teams engage the right prospects at exactly the right moment." },
  "Synapse":        { industry: "AI / ML Platform",      employees: "600–1,000",  yearlyRevenue: "$72M ARR",  description: "Synapse is an end-to-end MLOps platform that automates model training, monitoring, and redeployment—reducing time-to-production for ML pipelines by 70%." },
  "Pulsate":        { industry: "Customer Engagement",   employees: "55–100",     yearlyRevenue: "$6.5M ARR", description: "Pulsate's mobile-first engagement platform drives hyper-personalised push campaigns and in-app messaging for retail banks and credit unions." },
  "CoreMetrics":    { industry: "Product Analytics",     employees: "250–400",    yearlyRevenue: "$28M ARR",  description: "CoreMetrics gives product teams session replay, funnel analytics, and cohort analysis in one platform, with no-code instrumentation that works in under an hour." },
  "Zenflow":        { industry: "Workflow Automation",   employees: "35–70",      yearlyRevenue: "$3.8M ARR", description: "Zenflow is a no-code workflow builder that connects 400+ enterprise apps, automating multi-step processes with approval chains and audit trails built in." },
  "Neonlink":       { industry: "B2B Commerce",          employees: "85–150",     yearlyRevenue: "$10.5M ARR", description: "Neonlink powers B2B e-commerce catalogues for distributors with real-time inventory sync, tiered pricing rules, and EDI integration for enterprise buyers." },
  "Prismatic":      { industry: "Integration Platform",  employees: "280–450",    yearlyRevenue: "$32M ARR",  description: "Prismatic is an embedded iPaaS that lets SaaS companies ship native integrations to their own customers without maintaining a sprawling connector codebase." },
  "Ironclad":       { industry: "Legal Tech",            employees: "75–130",     yearlyRevenue: "$8M ARR",   description: "Ironclad's digital contracting platform eliminates paper-based processes for mid-market procurement, accelerating contract cycle times from weeks to hours." },
  "Solaris HQ":     { industry: "Energy Tech",           employees: "700–1,200",  yearlyRevenue: "$85M ARR",  description: "Solaris HQ provides commercial solar asset management software, optimising fleet performance and automating utility interconnection filings for C&I portfolios." },
  "Maplewood":      { industry: "Real Estate Tech",      employees: "30–65",      yearlyRevenue: "$3.2M ARR", description: "Maplewood automates lease abstraction and CAM reconciliation for commercial real estate operators, turning hundreds of PDF leases into structured data overnight." },
  "Thunderbolt":    { industry: "Logistics Tech",        employees: "220–380",    yearlyRevenue: "$25M ARR",  description: "Thunderbolt's freight-intelligence platform provides real-time carrier rate benchmarking and automated tender management, cutting logistics costs by up to 18%." },
  "Crestview":      { industry: "Financial Services",    employees: "60–110",     yearlyRevenue: "$6.8M ARR", description: "Crestview delivers regulatory reporting automation for community banks, generating HMDA, CRA, and CECL submissions with a single-click reconciliation workflow." },
  "Archetype":      { industry: "Brand Strategy",        employees: "100–180",    yearlyRevenue: "$12.5M ARR", description: "Archetype's brand analytics platform measures message resonance and competitive share-of-voice across earned, owned, and paid channels in real time." },
  "Cobaltus":       { industry: "Cloud Infrastructure",  employees: "800–1,400",  yearlyRevenue: "$95M ARR",  description: "Cobaltus is a cloud cost governance platform providing chargebacks, anomaly detection, and rightsizing recommendations across AWS, Azure, and GCP." },
  "Ripple Effect":  { industry: "Social Impact Tech",    employees: "70–120",     yearlyRevenue: "$7.5M ARR", description: "Ripple Effect connects corporate volunteering programmes with nonprofits, tracking participation, skills deployed, and measurable community impact at scale." },
  "Stargate IO":    { industry: "API Management",        employees: "550–900",    yearlyRevenue: "$65M ARR",  description: "Stargate IO is an API gateway and developer portal that helps platform teams publish, monetise, and govern APIs across hybrid cloud environments." },
  "Tangent Labs":   { industry: "Research Tools",        employees: "28–55",      yearlyRevenue: "$2.8M ARR", description: "Tangent Labs accelerates primary research with AI-assisted survey design, automated transcript analysis, and instant insight synthesis for UX and strategy teams." },
  "Velo Systems":   { industry: "Transportation Tech",   employees: "160–280",    yearlyRevenue: "$19M ARR",  description: "Velo Systems manages last-mile delivery fleets with dynamic routing, driver-performance coaching, and proof-of-delivery automation for 3PL operators." },
  "Clearpath":      { industry: "Compliance Tech",       employees: "750–1,300",  yearlyRevenue: "$88M ARR",  description: "Clearpath automates GDPR, CCPA, and SOC 2 compliance programmes with continuous control monitoring and one-click evidence collection for auditors." },
  "Mosaic Data":    { industry: "Data Engineering",      employees: "55–100",     yearlyRevenue: "$5.8M ARR", description: "Mosaic Data simplifies data-lakehouse migrations with schema inference, automated pipeline generation, and lineage tracking for data engineering teams." },
  "Amplitude":      { industry: "Product Analytics",     employees: "300–500",    yearlyRevenue: "$36M ARR",  description: "Amplitude's digital optimisation platform connects product behaviour data to business outcomes, helping teams prioritise features that drive retention and revenue." },
  "Nexbridge":      { industry: "FinTech",               employees: "22–50",      yearlyRevenue: "$2.2M ARR", description: "Nexbridge provides instant cross-border treasury settlements for mid-market importers, bypassing correspondent banking delays with a fully automated FX layer." },
  // Committed
  "Bluepoint":      { industry: "Healthcare IT",         employees: "140–250",    yearlyRevenue: "$17M ARR",  description: "Bluepoint's revenue cycle management platform automates prior-authorisation and claims processing for multi-specialty medical groups, reducing denials by 34%." },
  "Quantifi":       { industry: "Risk Analytics",        employees: "90–160",     yearlyRevenue: "$11M ARR",  description: "Quantifi delivers real-time credit and market risk analytics for asset managers, with stress-testing scenarios that update continuously as market conditions shift." },
  "Stackly":        { industry: "DevOps Platform",       employees: "900–1,500",  yearlyRevenue: "$110M ARR", description: "Stackly is an internal developer platform that standardises golden paths for infrastructure provisioning, making self-serve Kubernetes deployments accessible to all engineers." },
  "Gridlock":       { industry: "Network Security",      employees: "25–55",      yearlyRevenue: "$2.5M ARR", description: "Gridlock provides microsegmentation and east-west traffic inspection for on-premise data centres, delivering zero-trust networking without a costly forklift upgrade." },
  "Brightside":     { industry: "Employee Benefits",     employees: "200–350",    yearlyRevenue: "$24M ARR",  description: "Brightside's financial wellness platform pairs employees with certified coaches and offers payroll-integrated savings tools, measurably reducing financial stress." },
  "Cyclone Tech":   { industry: "Climate Tech",          employees: "80–140",     yearlyRevenue: "$9M ARR",   description: "Cyclone Tech's renewable energy forecasting engine helps grid operators and energy traders optimise dispatch schedules using high-resolution weather modelling." },
  "Fortress IO":    { industry: "Cybersecurity",         employees: "600–950",    yearlyRevenue: "$78M ARR",  description: "Fortress IO is an extended detection and response (XDR) platform that correlates signals across endpoint, network, and identity layers to stop breaches in real time." },
  "Glowforge":      { industry: "E-commerce Tech",       employees: "45–80",      yearlyRevenue: "$4.8M ARR", description: "Glowforge automates product-page creation and SEO enrichment for large-catalogue retailers, generating structured listings from raw supplier data instantly." },
  "Halo Systems":   { industry: "Public Safety Tech",    employees: "380–650",    yearlyRevenue: "$45M ARR",  description: "Halo Systems deploys AI-powered gunshot detection and crowd analytics for smart-city programmes, integrating with existing CCTV and dispatch infrastructure." },
  "Ironwood":       { industry: "Construction Tech",     employees: "120–210",    yearlyRevenue: "$13.5M ARR", description: "Ironwood digitises jobsite management for general contractors, connecting RFI workflows, daily reports, and subcontractor billing on a single mobile-first platform." },
  "Javelin HQ":     { industry: "Sales Enablement",      employees: "1,000–1,800", yearlyRevenue: "$120M ARR", description: "Javelin HQ is the enterprise sales-content management and guided-selling platform, ensuring every rep delivers a consistent, compliant story at every stage." },
  "Kinetic IO":     { industry: "Manufacturing SaaS",    employees: "65–115",     yearlyRevenue: "$7.2M ARR", description: "Kinetic IO connects CNC machines and assembly lines to a cloud historian, turning raw sensor streams into OEE scores, waste reports, and maintenance tickets." },
  "Lattice AI":     { industry: "AI / ML Platform",      employees: "700–1,100",  yearlyRevenue: "$92M ARR",  description: "Lattice AI provides foundation-model customisation and RAG infrastructure for enterprises that need private, hallucination-resistant AI assistants." },
  "Mindgate":       { industry: "Mental Health Tech",    employees: "85–155",     yearlyRevenue: "$10M ARR",  description: "Mindgate's EAP platform gives employees on-demand access to therapists and coaches, with anonymised population health analytics for HR teams." },
  "Northstar":      { industry: "Revenue Intelligence",  employees: "220–380",    yearlyRevenue: "$26M ARR",  description: "Northstar captures and analyses every sales interaction—calls, emails, and meetings—turning conversation data into forecast accuracy and coaching recommendations." },
  "Opticlear":      { industry: "Optical Networking",    employees: "55–100",     yearlyRevenue: "$6.2M ARR", description: "Opticlear's network performance management suite monitors optical transport layers for telcos, predicting fibre degradation before it causes customer-impacting outages." },
  "Pangea Data":    { industry: "Data Governance",       employees: "420–700",    yearlyRevenue: "$52M ARR",  description: "Pangea Data automates data-quality monitoring, lineage documentation, and privacy-impact assessments across modern data stacks, keeping governance teams ahead of regulations." },
  "Quicksilver":    { industry: "Payments Tech",         employees: "30–65",      yearlyRevenue: "$3M ARR",   description: "Quicksilver provides embedded payment orchestration for vertical SaaS platforms, routing transactions across acquirers to maximise acceptance rates." },
  "Redpoint":       { industry: "Customer Data Platform", employees: "280–460",   yearlyRevenue: "$32M ARR",  description: "Redpoint's real-time CDP unifies online and offline customer data, enabling personalised cross-channel orchestration that responds to behaviour in under 50ms." },
  "Silvertech":     { industry: "AgriTech",              employees: "100–180",    yearlyRevenue: "$13M ARR",  description: "Silvertech's precision-agriculture platform combines satellite imagery, soil sensors, and weather forecasts to generate field-level irrigation and fertilisation recommendations." },
  // Won
  "Hexaware":       { industry: "IT Services",           employees: "2,000–5,000", yearlyRevenue: "$280M ARR", description: "Hexaware delivers cloud migration, digital engineering, and AI-automation services to Fortune 500 clients across banking, healthcare, and travel verticals." },
  "Pivotal":        { industry: "DevOps Platform",       employees: "180–300",    yearlyRevenue: "$20M ARR",  description: "Pivotal's cloud-native application platform accelerates software delivery for enterprises transitioning from legacy monoliths to microservices architectures." },
  "LoopHQ":         { industry: "Customer Success",      employees: "110–200",    yearlyRevenue: "$14M ARR",  description: "LoopHQ's customer-success platform uses product-usage telemetry and health scoring to help CS teams prioritise interventions and automate renewal playbooks." },
  "Specter":        { industry: "Threat Intelligence",   employees: "40–75",      yearlyRevenue: "$4.2M ARR", description: "Specter aggregates adversary-infrastructure data from dark-web forums and honeypots, giving threat-intel teams early warning of targeted attack campaigns." },
};

// ─── KPI totals ───────────────────────────────────────────────────────────────

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
