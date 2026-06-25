/**
 * Atlas — synthetic data seed. Scenario: the fintech "Northwind" enters a new vertical
 * (default: consumer brands / DTC). Deterministic (fixed seed) so `npm run seed` reproduces
 * data/atlas.json.
 *
 * Generates 6 vertical sub-segments, a 2,000-lead CRM funnel (firmographics + product-usage
 * signals, stages lead→MQL→PQL→SQL→won, outcomes), and 44 candidate partners. Observable lead
 * features correlate with a hidden quality that drives outcomes, so a score built from those
 * features is genuinely predictive of winning.
 */
import { faker } from "@faker-js/faker";
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import type { AtlasData, Lead, Partner, SizeBand, Stage, SubSegment } from "../src/lib/dataset-types";

const SEED = 90210;
const LEAD_COUNT = 2000;
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

const segments: SubSegment[] = [
  { key: "apparel", label: "Apparel & accessories", blurb: "Fashion, footwear, accessories DTC brands.", marketSize: 14200, fit: 0.82, accessibility: 0.7, avgAcv: 18000 },
  { key: "beauty", label: "Beauty & personal care", blurb: "Cosmetics, skincare, grooming DTC.", marketSize: 9800, fit: 0.88, accessibility: 0.74, avgAcv: 21000 },
  { key: "food_bev", label: "Food & beverage / CPG", blurb: "Packaged food, drinks, supplements.", marketSize: 16500, fit: 0.7, accessibility: 0.58, avgAcv: 16000 },
  { key: "home", label: "Home & lifestyle", blurb: "Furniture, decor, home goods DTC.", marketSize: 8700, fit: 0.66, accessibility: 0.62, avgAcv: 19000 },
  { key: "wellness", label: "Health & wellness", blurb: "Fitness, nutrition, wellness brands.", marketSize: 7400, fit: 0.79, accessibility: 0.68, avgAcv: 22000 },
  { key: "outdoor", label: "Outdoor & sporting goods", blurb: "Gear, apparel, equipment for the outdoors.", marketSize: 6100, fit: 0.61, accessibility: 0.55, avgAcv: 17000 },
];

const REGIONS = ["US-West", "US-East", "US-Central", "US-South", "Canada"];
const sizeBands: { band: SizeBand; weight: number; empMin: number; empMax: number; fitBoost: number; acvMult: number }[] = [
  { band: "smb", weight: 0.5, empMin: 5, empMax: 50, fitBoost: 0.72, acvMult: 0.6 },
  { band: "mid", weight: 0.38, empMin: 50, empMax: 250, fitBoost: 1.0, acvMult: 1.0 },
  { band: "ent", weight: 0.12, empMin: 250, empMax: 1500, fitBoost: 0.66, acvMult: 2.1 },
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
for (let i = 0; i < LEAD_COUNT; i++) {
  const seg = weightedSegment();
  const band = weightedBand();
  // hidden quality drives the funnel; observable features track it with noise
  const q = clamp(0.18 + 0.42 * rand() + 0.3 * seg.fit + 0.12 * (band.fitBoost - 0.7), 0, 1);

  const engagement = clamp(q * 0.85 + 0.1 + (rand() - 0.5) * 0.2, 0, 1);
  const intent = clamp(q * 0.8 + 0.15 + (rand() - 0.5) * 0.26, 0, 1);
  const firmographicFit = clamp(0.5 * seg.fit + 0.4 * q + 0.1 * band.fitBoost + (rand() - 0.5) * 0.18, 0, 1);

  const signals = {
    monthlyTxns: round(40 + q * 1500 * (0.7 + 0.6 * rand())),
    connectedAccounts: round(1 + q * 8 * (0.6 + 0.8 * rand())),
    integrations: round(q * 6 * (0.5 + rand())),
    activeUsers: round(1 + q * 42 * (0.5 + rand())),
    tenureDays: round(10 + q * 200 * (0.5 + rand())),
    engagement: Number(engagement.toFixed(3)),
  };

  // funnel progression on hidden quality
  let stage: Stage = "lead";
  if (rand() < 0.34 + 0.45 * q) stage = "mql";
  if (stage === "mql" && rand() < 0.28 + 0.42 * q) stage = "pql";
  if (stage === "pql" && rand() < 0.32 + 0.42 * q) stage = "sql";
  if (stage === "sql" && rand() < 0.26 + 0.45 * q) stage = "won";

  const outcome = stage === "won" ? "won" : rand() < 0.4 ? "lost" : "open";
  const acv = round(seg.avgAcv * band.acvMult * (0.8 + 0.4 * rand()));
  const employees = round(band.empMin + rand() * (band.empMax - band.empMin));

  leads.push({
    id: `L${(i + 1).toString().padStart(4, "0")}`,
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
    ageDays: round(5 + rand() * 175),
  });
}

// ---- partners ----
const CATEGORIES = [
  "Ecommerce platform",
  "3PL / fulfillment",
  "Payments / checkout",
  "Accounting / ERP",
  "Marketing / CRM",
  "Analytics / BI",
  "Logistics / shipping",
  "Marketplace / retail",
];
const PARTNER_COUNT = 44;
const partners: Partner[] = [];
for (let i = 0; i < PARTNER_COUNT; i++) {
  const category = CATEGORIES[i % CATEGORIES.length];
  const seg = weightedSegment();
  // platform/payments/ecommerce skew higher overlap & complementarity for a fintech
  const catBoost = ["Ecommerce platform", "Payments / checkout", "Accounting / ERP"].includes(category) ? 0.18 : 0;
  partners.push({
    id: `P${(i + 1).toString().padStart(2, "0")}`,
    name: faker.company.name(),
    category,
    reach: round(8000 + rand() * 1_400_000),
    attrs: {
      audienceOverlap: Number(clamp(0.4 + catBoost + rand() * 0.45, 0, 1).toFixed(3)),
      complementarity: Number(clamp(0.42 + catBoost + rand() * 0.45, 0, 1).toFixed(3)),
      integrationEase: Number(clamp(0.35 + rand() * 0.6, 0, 1).toFixed(3)),
      momentum: Number(clamp(0.3 + rand() * 0.65, 0, 1).toFixed(3)),
      brand: Number(clamp(0.3 + rand() * 0.65, 0, 1).toFixed(3)),
    },
    segmentFocus: seg.key,
  });
}

const data: AtlasData = {
  meta: {
    company: "Northwind",
    product: "Northwind business banking",
    vertical: "Consumer brands / DTC",
    generatedAt: new Date("2026-06-17T09:00:00Z").toISOString(),
    seed: SEED,
    leadCount: LEAD_COUNT,
    defaultThreshold: 70,
    weights: { firmographic: 0.3, usage: 0.3, engagement: 0.2, intent: 0.2 },
    partnerCount: PARTNER_COUNT,
  },
  segments,
  leads,
  partners,
};

const outPath = join(process.cwd(), "data", "atlas.json");
writeFileSync(outPath, JSON.stringify(data));

const counts = leads.reduce((acc, l) => ({ ...acc, [l.stage]: (acc[l.stage] ?? 0) + 1 }), {} as Record<string, number>);
const reach = (st: Stage) => leads.filter((l) => ["lead", "mql", "pql", "sql", "won"].indexOf(l.stage) >= ["lead", "mql", "pql", "sql", "won"].indexOf(st)).length;
console.log(`✓ Generated ${outPath}`);
console.log(`  ${LEAD_COUNT} leads · ${partners.length} partners · ${segments.length} segments · vertical "${data.meta.vertical}"`);
console.log(`  furthest-stage counts:`, counts);
console.log(`  funnel reached: lead ${reach("lead")} · mql ${reach("mql")} · pql ${reach("pql")} · sql ${reach("sql")} · won ${reach("won")}`);
console.log(`  won rate ${((reach("won") / LEAD_COUNT) * 100).toFixed(1)}% · open ${leads.filter((l) => l.outcome === "open").length} · lost ${leads.filter((l) => l.outcome === "lost").length}`);
