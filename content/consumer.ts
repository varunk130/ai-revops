// Consumer-brands scenario bundle (Northwind → DTC). Assembles the existing curated copy
// into the ScenarioContent contract. Agent copy reproduces the prior inline strings verbatim
// so the consumer run is byte-identical to before the scenario system existed.
import type { ScenarioContent } from "@/agents/types";
import type { AtlasSnapshot, ExecBrief, ForecastResult } from "@/lib/types";
import { num, pct, usd, usdM } from "@/lib/format";
import { MOTION, POSITIONING_LINES } from "./motion";
import { ONE_PAGER, ONEPAGER_HEROS, OUTREACH } from "./outreach";
import { ATTRIBUTION, ATTRIBUTION_SUMMARIES } from "./attribution";
import { CLOSING, GUIDED_PROMPT, NARRATION, POD_INTROS, SUGGESTIONS } from "./narration";

function buildPlanSummary(snapshot: AtlasSnapshot, f: ForecastResult): string[] {
  const s = snapshot.segments;
  const tierAPartners = snapshot.partners.filter((p) => p.tier === "A");
  const tierA = tierAPartners.length;
  const tierACats = Array.from(new Set(tierAPartners.map((p) => p.category))).slice(0, 3).join(", ").toLowerCase();
  return [
    `Win ${s[0].label} and ${s[1].label} first — the biggest reachable markets with the best product fit.`,
    `Go ${MOTION.salesMotion.toLowerCase()}: self-serve land, PQL hand-off to sales, partner referrals skip the line.`,
    `Open ${tierA} tier-A partnerships (${tierACats}) for a co-sell motion with a 60-day pilot.`,
    `Score the ${num(snapshot.meta.leadCount)} leads; ${num(f.pqlCount)} clear the PQL bar — open pipeline ${usdM(f.pipelineValue)}.`,
    `Forecast ${usdM(f.expectedBookings)} in bookings (${usdM(f.low)}–${usdM(f.high)}); buy attribution + CRM, build the usage-signal pipeline and score write-back.`,
  ];
}

function buildExecBrief(snapshot: AtlasSnapshot, f: ForecastResult): ExecBrief {
  const s = snapshot.segments;
  const tierA = snapshot.partners.filter((p) => p.tier === "A").length;
  return {
    to: "Northwind GTM leadership",
    subject: `Entering ${snapshot.meta.vertical}: a product-led, partner-amplified launch`,
    thesis: `${s[0].label} and ${s[1].label} are the most winnable wedge into consumer brands — the largest reachable markets with the strongest fit for ${snapshot.meta.product}. The motion is product-led, with partner referrals as the low-CAC accelerant.`,
    recommendation: `Launch into ${s[0].label} first with a self-serve land + PQL sales hand-off, stand up ${tierA} tier-A platform partnerships for co-sell, and instrument one source of truth so GTM, partnerships, and RevOps share the same scored pipeline.`,
    metrics: [
      { label: "Lead segment", value: s[0].label, sub: `priority score ${s[0].score}` },
      { label: "Tier-A partners", value: String(tierA), sub: "co-sell ready" },
      { label: "PQLs", value: num(f.pqlCount), sub: `≥ ${f.threshold} score` },
      { label: "Forecast bookings", value: usdM(f.expectedBookings), sub: `${usdM(f.low)}–${usdM(f.high)} band` },
    ],
    bets: [
      { title: "Land product-led, expand sales-led", body: "Self-serve signup for everyone; a usage-qualified (PQL) hand-off to sales for mid-market and up. SMB stays self-serve to protect CAC." },
      { title: "Make partners the demand engine", body: `Co-sell with ecommerce and payments platforms whose merchants are our ICP. A 60-day pilot against the highest-fit accounts proves the motion before scaling.` },
      { title: "One scored pipeline, shared by all", body: "Buy attribution + CRM; build the usage-signal pipeline and score write-back so the lead model the forecast uses is the same list sales works." },
    ],
    risks: [
      { risk: "Self-serve CAC creeps as paid scales", mitigation: "Gate paid spend on the lead score; suppress low-fit segments and let partners carry top-of-funnel." },
      { risk: "Partner motion stalls on integration", mitigation: "Lead with the platforms scoring highest on integration ease; ship the joint offer as a templated, low-lift pilot." },
    ],
    asks: [
      { label: "Pilot window", value: "60 days" },
      { label: "Tier-A partnerships", value: String(tierA) },
      { label: "Forecast bookings", value: usdM(f.expectedBookings) },
    ],
    timeline: [
      { phase: "Days 0–30", detail: `Stand up scoring + forecast on the ${num(snapshot.meta.leadCount)}-lead CRM; sign the first 2 tier-A partners.` },
      { phase: "Days 30–60", detail: `Run the co-sell pilot against the top PQLs in ${s[0].label}; tune the threshold to the precision sales can work.` },
      { phase: "Days 60–90", detail: "Scale the winning channels; expand to the #2 segment; review pipeline coverage vs. the bookings target." },
    ],
  };
}

export const CONSUMER_CONTENT: ScenarioContent = {
  id: "consumer",
  motion: MOTION,
  positioningLines: POSITIONING_LINES,
  outreach: OUTREACH,
  onePager: ONE_PAGER,
  onePagerHeros: ONEPAGER_HEROS,
  attribution: ATTRIBUTION,
  attributionSummaries: ATTRIBUTION_SUMMARIES,
  narration: {
    guidedPrompt: GUIDED_PROMPT,
    suggestions: SUGGESTIONS,
    podIntros: POD_INTROS,
    agent: NARRATION,
    closing: CLOSING,
  },
  labels: {
    leadNoun: "leads",
    leadNounSingular: "lead",
    qualifiedShort: "PQL",
    qualifiedPlural: "PQLs",
    scoreModelNoun: "PQL model",
    scoreModelTitle: "Lead scoring · PQL model",
    thresholdLabel: "PQL score threshold",
    thresholdNoun: "PQL threshold",
    segmentsTitle: "ICP sub-segments · prioritized",
    recordsNoun: "CRM records",
    countLabel: "CRM leads",
    stageLabels: { lead: "Lead", mql: "MQL", pql: "PQL", sql: "SQL", won: "Won" },
  },
  agentCopy: {
    segmenterDetail: (segs) =>
      `${segs[0].label} and ${segs[1].label} pair the biggest reachable markets with the best product fit. Outdoor and home rank lower on accessibility.`,
    partnerScoutDetail: (_tierA, topCats) =>
      `The top tier skews to ${topCats.join(", ").toLowerCase()} — where a fintech's audience overlap and product complementarity are highest.`,
    leadScorerDetail: (top) =>
      `Top lead ${top.company} scores ${top.score}. The model is predictive: win rate rises with score, so the threshold is a precision dial.`,
    funnelEngineerDetail: (funnel) => {
      const convs = funnel.stages
        .filter((s) => s.stage !== "lead")
        .map((s) => `${s.label} ${pct(s.convFromPrev)}`)
        .join(" · ");
      return `Stage conversions: ${convs}. Average won ACV ${usd(funnel.avgAcv)}.`;
    },
    forecasterDetail: (f) =>
      `Open pipeline ${usdM(f.pipelineValue)} → ${usdM(f.expectedBookings)} expected, with an ${usdM(f.low)}–${usdM(f.high)} band from win-probability variance.`,
    orchestratorIntro: "Three pods, one launch plan — GTM defines the where and how, Partnerships finds the leverage, RevOps measures it.",
  },
  buildPlanSummary,
  buildExecBrief,
};
