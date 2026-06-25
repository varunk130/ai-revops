/**
 * Atlas — synthetic data seed (ENTERPRISE scenario). Scenario: the enterprise AI-platform
 * vendor "Contoso" enters Financial Services with an industry Copilot + data platform, via a
 * partner co-sell motion. Deterministic (fixed seed) so `npm run seed:enterprise` reproduces
 * data/atlas.enterprise.json. Mirrors the consumer seed's hidden-quality mechanics so the
 * account propensity score stays genuinely predictive of winning — but with enterprise
 * sub-segments, system-integrator / ISV partners, far fewer & far larger accounts.
 */
import { faker } from "@faker-js/faker";
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import type { AtlasData, Lead, Partner, SizeBand, Stage, SubSegment } from "../src/lib/dataset-types";

const SEED = 73412;
const ACCOUNT_COUNT = 480;
faker.seed(SEED);

function mulberry32(seed: number) {
  let s = seed >>> 0;
  return function () {
    s |= 0;
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(SEED);
const clamp = (x: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, x));
const round = (x: number) => Math.round(x);
const pick = <T>(arr: T[]) => arr[Math.floor(rand() * arr.length)];

// FinServ enterprise sub-segments. marketSize = count of target enterprise accounts (TAM proxy).
const segments: SubSegment[] = [
  { key: "banking_global", label: "Global & money-center banks", blurb: "Tier-1 universal banks running multi-region, regulated cores.", marketSize: 90, fit: 0.86, accessibility: 0.52, avgAcv: 920000 },
  { key: "banking_regional", label: "Regional & commercial banks", blurb: "Super-regional and commercial banks modernizing the stack.", marketSize: 540, fit: 0.8, accessibility: 0.71, avgAcv: 360000 },
  { key: "insurance", label: "Insurance — P&C and life", blurb: "Carriers automating underwriting, claims, and service.", marketSize: 410, fit: 0.83, accessibility: 0.64, avgAcv: 480000 },
  { key: "capital_markets", label: "Capital markets & i-banking", blurb: "Banks, exchanges, and trading firms under heavy compliance.", marketSize: 160, fit: 0.74, accessibility: 0.46, avgAcv: 760000 },
  { key: "wealth", label: "Wealth & asset management", blurb: "Asset managers and wealth platforms scaling advisor productivity.", marketSize: 300, fit: 0.78, accessibility: 0.6, avgAcv: 420000 },
  { key: "payments", label: "Payments & fintech infrastructure", blurb: "Processors, networks, and embedded-finance platforms.", marketSize: 230, fit: 0.7, accessibility: 0.58, avgAcv: 520000 },
];

const REGIONS = ["NA-East", "NA-West", "UK & Ireland", "EU-West", "APAC"];

// Account tiers (SizeBand keys retained for type-compatibility; relabeled for the enterprise scenario).
const sizeBands: { band: SizeBand; weight: number; empMin: number; empMax: number; fitBoost: number; acvMult: number }[] = [
  { band: "smb", weight: 0.34, empMin: 1000, empMax: 5000, fitBoost: 0.74, acvMult: 0.62 }, // National
  { band: "mid", weight: 0.42, empMin: 5000, empMax: 25000, fitBoost: 1.0, acvMult: 1.0 }, // Super-regional
  { band: "ent", weight: 0.24, empMin: 25000, empMax: 240000, fitBoost: 0.86, acvMult: 2.35 }, // Global
];

function weightedSegment(): SubSegment {
  const total = segments.reduce((s, x) => s + x.marketSize, 0);
  let r = rand() * total;
  for (const s of segments) {
    r -= s.marketSize;
    if (r <= 0) return s;
  }
  return segments[0];
}
function weightedBand() {
  let r = rand();
  for (const b of sizeBands) {
    r -= b.weight;
    if (r <= 0) return b;
  }
  return sizeBands[0];
}

const leads: Lead[] = [];
for (let i = 0; i < ACCOUNT_COUNT; i++) {
  const seg = weightedSegment();
  const band = weightedBand();
  // hidden quality drives the funnel; observable features track it with noise
  const q = clamp(0.16 + 0.4 * rand() + 0.32 * seg.fit + 0.12 * (band.fitBoost - 0.7), 0, 1);

  const engagement = clamp(q * 0.82 + 0.12 + (rand() - 0.5) * 0.2, 0, 1);
  const intent = clamp(q * 0.78 + 0.16 + (rand() - 0.5) * 0.26, 0, 1);
  const firmographicFit = clamp(0.52 * seg.fit + 0.4 * q + 0.08 * band.fitBoost + (rand() - 0.5) * 0.16, 0, 1);

  // enterprise-flavored signals: existing cloud footprint, exec sponsors, integrations, active seats
  const signals = {
    monthlyTxns: round(60 + q * 1500 * (0.7 + 0.6 * rand())), // platform/cloud consumption units
    connectedAccounts: round(1 + q * 8 * (0.6 + 0.8 * rand())), // existing Contoso products in use
    integrations: round(q * 6 * (0.5 + rand())), // systems integrated
    activeUsers: round(1 + q * 40 * (0.5 + rand())), // pilot/active seats (000s)
    tenureDays: round(20 + q * 240 * (0.5 + rand())),
    engagement: Number(engagement.toFixed(3)),
  };

  // enterprise funnel progresses harder than self-serve consumer (longer, fewer stages clear)
  let stage: Stage = "lead";
  if (rand() < 0.42 + 0.4 * q) stage = "mql";
  if (stage === "mql" && rand() < 0.3 + 0.42 * q) stage = "pql";
  if (stage === "pql" && rand() < 0.3 + 0.4 * q) stage = "sql";
  if (stage === "sql" && rand() < 0.24 + 0.44 * q) stage = "won";

  const outcome = stage === "won" ? "won" : rand() < 0.38 ? "lost" : "open";
  const acv = round(seg.avgAcv * band.acvMult * (0.82 + 0.36 * rand()));
  const employees = round(band.empMin + rand() * (band.empMax - band.empMin));

  leads.push({
    id: `A${(i + 1).toString().padStart(4, "0")}`,
    company: faker.company.name(),
    subSegment: seg.key,
    employees,
    sizeBand: band.band,
    region: pick(REGIONS),
    signals,
    firmographicFit: Number(firmographicFit.toFixed(3)),
    intent: Number(intent.toFixed(3)),
    stage,
    outcome,
    acv,
    ageDays: round(20 + rand() * 320),
  });
}

// ---- partners (enterprise co-sell ecosystem) ----
const CATEGORIES = [
  "Global SI / advisory",
  "Industry ISV",
  "Hyperscaler marketplace",
  "Core banking platform",
  "Data & risk",
  "Security & compliance",
  "Regulatory / managed services",
  "BPO / managed operations",
];
const PARTNER_COUNT = 38;
const partners: Partner[] = [];
for (let i = 0; i < PARTNER_COUNT; i++) {
  const category = CATEGORIES[i % CATEGORIES.length];
  const seg = weightedSegment();
  // SIs, hyperscaler marketplace, and industry ISVs drive the co-sell motion → higher overlap + complementarity
  const catBoost = ["Global SI / advisory", "Hyperscaler marketplace", "Industry ISV"].includes(category) ? 0.2 : 0;
  partners.push({
    id: `P${(i + 1).toString().padStart(2, "0")}`,
    name: faker.company.name(),
    category,
    reach: round(20 + rand() * 580), // enterprise accounts the partner can co-sell into
    attrs: {
      audienceOverlap: Number(clamp(0.42 + catBoost + rand() * 0.42, 0, 1).toFixed(3)),
      complementarity: Number(clamp(0.44 + catBoost + rand() * 0.42, 0, 1).toFixed(3)),
      integrationEase: Number(clamp(0.32 + rand() * 0.6, 0, 1).toFixed(3)),
      momentum: Number(clamp(0.3 + rand() * 0.65, 0, 1).toFixed(3)),
      brand: Number(clamp(0.34 + rand() * 0.62, 0, 1).toFixed(3)),
    },
    segmentFocus: seg.key,
  });
}

const data: AtlasData = {
  meta: {
    company: "Contoso",
    product: "Contoso AI Cloud — industry Copilots + data platform",
    vertical: "Financial Services (enterprise)",
    generatedAt: new Date("2026-06-18T09:00:00Z").toISOString(),
    seed: SEED,
    leadCount: ACCOUNT_COUNT,
    defaultThreshold: 62,
    weights: { firmographic: 0.34, usage: 0.22, engagement: 0.18, intent: 0.26 },
    partnerCount: PARTNER_COUNT,
  },
  segments,
  leads,
  partners,
};

const outPath = join(process.cwd(), "data", "atlas.enterprise.json");
writeFileSync(outPath, JSON.stringify(data));

const counts = leads.reduce((acc, l) => ({ ...acc, [l.stage]: (acc[l.stage] ?? 0) + 1 }), {} as Record<string, number>);
const reach = (st: Stage) => leads.filter((l) => ["lead", "mql", "pql", "sql", "won"].indexOf(l.stage) >= ["lead", "mql", "pql", "sql", "won"].indexOf(st)).length;
console.log(`✓ Generated ${outPath}`);
console.log(`  ${ACCOUNT_COUNT} accounts · ${partners.length} partners · ${segments.length} segments · vertical "${data.meta.vertical}"`);
console.log(`  furthest-stage counts:`, counts);
console.log(`  funnel reached: target ${reach("lead")} · engaged ${reach("mql")} · qualified ${reach("pql")} · proposal ${reach("sql")} · won ${reach("won")}`);
console.log(`  won rate ${((reach("won") / ACCOUNT_COUNT) * 100).toFixed(1)}% · open ${leads.filter((l) => l.outcome === "open").length} · lost ${leads.filter((l) => l.outcome === "lost").length}`);
