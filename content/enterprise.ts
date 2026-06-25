// Enterprise scenario bundle: Contoso (enterprise AI-platform vendor) entering Financial
// Services with an industry Copilot + data platform, via a partner co-sell motion. Fully
// distinct copy, terminology, and economics from the consumer bundle — same runtime.
import type { ScenarioContent } from "@/agents/types";
import type { AtlasSnapshot, AttributionRec, ExecBrief, ForecastResult, Motion, OnePager, OutreachEmail } from "@/lib/types";
import { num, pct, usd, usdM } from "@/lib/format";

const MOTION: Motion = {
  channels: [
    { name: "Global SI co-sell", rationale: "System integrators own board-level access and the delivery capacity regulated banks demand — co-selling with them shortens trust and staffing cycles we can't compress alone." },
    { name: "Hyperscaler marketplace + co-sell", rationale: "FS buyers have committed cloud spend; transacting Contoso through the marketplace draws it down and aligns to budgets already approved." },
    { name: "Executive & analyst-led demand", rationale: "CIO/CDO roundtables, reference architectures, and analyst validation de-risk a regulated AI purchase far more than performance marketing." },
    { name: "Account-based field sales", rationale: "Named-account pursuit on the propensity-scored target list — pursuit teams on tier-1 accounts, with the score suppressing low-fit effort." },
  ],
  salesMotion: "Enterprise field sales + partner co-sell",
  salesMotionDetail:
    "Named-account pursuit led by field sales and amplified by SI co-sell. Land a fixed-fee proof-of-value in one line of business, expand to a platform agreement, then convert to a multi-year EA transacted through the hyperscaler marketplace. No self-serve — every motion is human- and partner-led.",
  pricing: [
    { name: "Proof of Value", price: "Fixed-fee, 8 wks", forWho: "One line of business — a de-risked pilot with a measured business case before any platform commit." },
    { name: "Platform", price: "Consumption + seats", forWho: "Per-LOB production — annual subscription that scales with usage and licensed users." },
    { name: "Enterprise Agreement", price: "Multi-year EA", forWho: "Multi-LOB standardization — co-sell incentives and marketplace drawdown on committed cloud spend." },
  ],
  pricingThesis:
    "Land on a fixed-fee POV that produces a CFO-grade business case, expand to a consumption + seat platform per line of business, then standardize into a multi-year EA transacted through the hyperscaler marketplace so the spend draws down committed cloud budget.",
};

const POSITIONING_LINES = [
  "Production-grade AI for regulated finance — grounded, governed, and audited by design.",
  "The industry Copilot and data platform banks can actually put in front of a regulator.",
  "Turn the bank's own data into governed Copilots — without moving it out of your controls.",
];

const OUTREACH: OutreachEmail[] = [
  {
    step: 1,
    trigger: "Day 0 · intro to FS co-sell lead",
    subject: "Contoso × {{partner}}: a governed-AI co-sell motion for your banking accounts",
    body: `Hi {{first_name}},

Your banking and insurance clients are under pressure to ship AI that survives a regulator's review — and that's exactly where Contoso AI Cloud is built to land.

Co-selling with {{partner}} pairs your delivery capacity and trusted access with a platform that keeps the bank's data inside its own controls. For you, that's a new, high-margin services pull on every engagement.

Worth a 30-minute call to map where our target accounts overlap? I've already scored the named-account list by propensity to buy.

— {{sender}}, FS Partnerships @ Contoso`,
  },
  {
    step: 2,
    trigger: "Day 5 · no reply",
    subject: "What a joint FS offer could look like",
    body: `Hi {{first_name}},

Following up with something concrete. Based on our account overlap, a joint co-sell offer could be:

• A fixed-fee, 8-week proof-of-value in one line of business (fraud, servicing, or underwriting)
• {{partner}}-led delivery with Contoso platform + co-sell incentives on the booking
• A marketplace transaction so the client draws down committed cloud spend

We'd start with a pursuit list of ~15 of your highest-propensity accounts. Open to comparing target lists?

— {{sender}}`,
  },
  {
    step: 3,
    trigger: "Day 11 · final touch",
    subject: "15 minutes to align on the first 15 accounts?",
    body: `Hi {{first_name}},

Last note from me — I won't crowd your inbox. If FS co-sell isn't a now priority, no problem.

If it is, I'll bring the scored account list, a reference architecture your risk team can review, and a one-page co-sell plan to our first call. You bring the relationships; we'll bring the platform and the incentives.

Grab a time here: {{calendar_link}}

— {{sender}}`,
  },
];

const ONE_PAGER: OnePager = {
  title: "Contoso × {{partner}} — Financial Services co-sell one-pager",
  sections: [
    {
      heading: "The opportunity",
      body: "Banks and insurers need production AI that's grounded in their own data and defensible to a regulator. {{partner}}'s clients are asking for it now — a shared, high-value co-sell opportunity across servicing, fraud, and underwriting.",
    },
    {
      heading: "Why {{partner}} + Contoso",
      body: "{{partner}} owns the trusted relationship and delivery capacity; Contoso owns the governed AI platform that keeps data inside the bank's controls. Together we shorten the regulated buying cycle and open a recurring services pull.",
    },
    {
      heading: "The joint offer",
      body: "A fixed-fee, 8-week proof-of-value in one line of business, {{partner}}-led delivery with co-sell incentives, and a marketplace transaction so the client uses committed cloud spend. A scored pursuit list of ~15 highest-propensity accounts to start.",
    },
    {
      heading: "How we go to market",
      body: "Co-branded CIO/CDO executive briefings, a reference architecture the bank's risk team can review, and joint account planning on the propensity-scored list. Partner-sourced opportunities route straight to a named pursuit team.",
    },
    {
      heading: "What we need from you",
      body: "An FS co-sell owner, named-account introductions for the pursuit list, and delivery leads for the POVs. Contoso brings the platform, the co-sell incentives, the reference architecture, and field pursuit support.",
    },
  ],
};

const ONEPAGER_HEROS = [
  "Co-sell governed AI into regulated finance — and turn every engagement into recurring services.",
  "Your access and delivery, our governed platform: production AI banks can defend to a regulator.",
  "One reference architecture, two trusted brands, a marketplace-funded path to scale.",
];

const ATTRIBUTION: AttributionRec = {
  model: "Opportunity-influence multi-touch (time-decay)",
  modelRationale:
    "Enterprise FS deals are multi-stakeholder and partner-influenced across Target → Engaged → Qualified → Proposal, so single-touch and lead-only models mis-credit the motion. Time-decay opportunity-influence weights the touches closest to the win and explicitly credits partner co-sell influence — the right lens for a long, committee-driven, co-sold cycle.",
  stack: [
    {
      layer: "CRM & opportunity management",
      tool: "Enterprise CRM (buy)",
      buildVsBuy: "buy",
      why: "The system of record for named-account pursuit, forecast, and stage governance is a solved problem. Buy it; your edge is the propensity model and partner data written into it, not the CRM itself.",
    },
    {
      layer: "Partner co-sell & marketplace ops",
      tool: "Co-sell / marketplace management (buy + integrate)",
      buildVsBuy: "buy",
      why: "Buy the co-sell and marketplace tooling (deal registration, incentives, drawdown), then integrate it so partner influence lands on the opportunity and feeds attribution. Building deal-registration plumbing from scratch is wasted effort.",
    },
    {
      layer: "Account signals & propensity",
      tool: "Account-signal pipeline + score write-back (build)",
      buildVsBuy: "build",
      why: "Cloud footprint, install base, exec engagement, and regulatory readiness are proprietary to you. Build the pipeline that turns them into the propensity score and writes it back to CRM so pursuit, partners, and the forecast all work the same ranked list.",
    },
  ],
  summary:
    "Buy the commodity layers (CRM, co-sell + marketplace ops), build the account-signal pipeline and propensity write-back — so field, partners, and RevOps pursue one governed, scored account list.",
};

const ATTRIBUTION_SUMMARIES = [
  "Buy CRM and co-sell ops; build the account-signal pipeline and propensity write-back that are proprietary to you.",
  "One scored account list, shared by field, partners, and the forecast — partner influence credited on the opportunity.",
  "Credit the co-sell: time-decay opportunity influence reflects how regulated FS deals are actually won.",
];

const STAGE_LABELS = { lead: "Target", mql: "Engaged", pql: "Qualified", sql: "Proposal", won: "Won" } as const;

function convsLine(funnel: AtlasSnapshot["funnel"]): string {
  return funnel.stages
    .filter((s) => s.stage !== "lead")
    .map((s) => `${s.label} ${pct(s.convFromPrev)}`)
    .join(" · ");
}

function buildPlanSummary(snapshot: AtlasSnapshot, f: ForecastResult): string[] {
  const s = snapshot.segments;
  const tierAPartners = snapshot.partners.filter((p) => p.tier === "A");
  const tierA = tierAPartners.length;
  const tierACats = Array.from(new Set(tierAPartners.map((p) => p.category))).slice(0, 3).join(", ").toLowerCase();
  return [
    `Lead with ${s[0].label} and ${s[1].label} — the largest reachable account base with the strongest fit for regulated, governed AI.`,
    `Run an enterprise field + co-sell motion: land a fixed-fee proof-of-value in one line of business, then expand to a platform agreement.`,
    `Activate ${tierA} tier-A partners (${tierACats}) for co-sell reach and delivery capacity, transacting through the hyperscaler marketplace.`,
    `Score the ${num(snapshot.meta.leadCount)} accounts; ${num(f.pqlCount)} clear the propensity bar — open pipeline ${usdM(f.pipelineValue)}.`,
    `Forecast ${usdM(f.expectedBookings)} in bookings (${usdM(f.low)}–${usdM(f.high)}); buy CRM + co-sell ops, build the account-signal pipeline and propensity write-back.`,
  ];
}

function buildExecBrief(snapshot: AtlasSnapshot, f: ForecastResult): ExecBrief {
  const s = snapshot.segments;
  const tierA = snapshot.partners.filter((p) => p.tier === "A").length;
  const topPartner = snapshot.partners[0];
  return {
    to: "Contoso executive leadership team",
    subject: `Entering ${snapshot.meta.vertical}: a partner co-sell motion for governed AI`,
    thesis: `Financial services is the highest-value, fastest-moving market for governed enterprise AI, but it is gated by regulation, procurement, and trust. ${s[0].label} and ${s[1].label} are the most winnable wedge — the largest reachable account base with the strongest fit for ${snapshot.meta.product}. We do not win this alone; we win it with the system integrators and hyperscaler the banks already trust.`,
    recommendation: `Stand up an enterprise field + co-sell motion led by ${tierA} tier-A partners (anchored on ${topPartner.name}). Land fixed-fee proofs-of-value in one line of business per account, expand to platform agreements, and transact through the hyperscaler marketplace to draw down committed cloud spend. Pursue one propensity-scored account list shared by field, partners, and RevOps.`,
    metrics: [
      { label: "Lead segment", value: s[0].label, sub: `priority score ${s[0].score}` },
      { label: "Tier-A co-sell partners", value: String(tierA), sub: "SI · ISV · marketplace" },
      { label: "Qualified accounts", value: num(f.pqlCount), sub: `propensity ≥ ${f.threshold}` },
      { label: "Forecast bookings", value: usdM(f.expectedBookings), sub: `${usdM(f.low)}–${usdM(f.high)} band` },
    ],
    bets: [
      { title: "Make partners the motion, not a channel", body: `Co-sell with Global SIs and the hyperscaler marketplace for board access, delivery capacity, and committed-spend drawdown. Start with ${tierA} tier-A partners on the highest-propensity accounts.` },
      { title: "Land via a de-risked proof of value", body: "A fixed-fee, 8-week POV in one line of business produces a CFO-grade business case before any platform commit — the only way to compress a regulated buying cycle." },
      { title: "One governed, scored account list", body: "Buy CRM and co-sell ops; build the account-signal pipeline and propensity write-back so field, partners, and the forecast all pursue the same ranked, defensible list." },
    ],
    risks: [
      { risk: "Long, committee-driven cycles stall pipeline", mitigation: "Anchor every account on a fixed-fee POV with a named executive sponsor; let SI partners carry trust and staffing." },
      { risk: "Regulatory / data-residency objections", mitigation: "Lead with a reference architecture that keeps data inside the bank's controls; bring risk and compliance into the POV from day one." },
      { risk: "Channel conflict between field and partners", mitigation: "Deal registration + co-sell incentives on the opportunity; partner-sourced deals route to a named pursuit team, credited via opportunity-influence attribution." },
    ],
    asks: [
      { label: "Motion", value: "Field + co-sell" },
      { label: "Tier-A partners", value: String(tierA) },
      { label: "Forecast bookings", value: usdM(f.expectedBookings) },
    ],
    timeline: [
      { phase: "Days 0–30", detail: `Score the ${num(snapshot.meta.leadCount)}-account base; sign co-sell terms with the first 3 tier-A partners; agree the reference architecture with risk.` },
      { phase: "Days 30–60", detail: `Launch fixed-fee POVs against the top qualified accounts in ${s[0].label}; tune the propensity threshold to the pursuit capacity sales and partners can staff.` },
      { phase: "Days 60–90", detail: "Convert the first POVs to platform agreements; transact through the marketplace; review pipeline coverage against the bookings target." },
    ],
  };
}

export const ENTERPRISE_CONTENT: ScenarioContent = {
  id: "enterprise",
  motion: MOTION,
  positioningLines: POSITIONING_LINES,
  outreach: OUTREACH,
  onePager: ONE_PAGER,
  onePagerHeros: ONEPAGER_HEROS,
  attribution: ATTRIBUTION,
  attributionSummaries: ATTRIBUTION_SUMMARIES,
  narration: {
    guidedPrompt: "We're taking Contoso AI Cloud into Financial Services. Build the GTM, the partner co-sell, and the revenue model.",
    suggestions: [
      "We're taking Contoso AI Cloud into Financial Services. Build the GTM, the partner co-sell, and the revenue model.",
      "Prioritize the FS segments to win and forecast the enterprise pipeline.",
      "Who should we co-sell with to land regulated banks, and what's the pipeline worth?",
    ],
    podIntros: {
      gtm: "GTM pod — pick the financial-services segments to win and the enterprise motion to win them.",
      partnerships: "Partnerships pod — find the SIs and ISVs worth a co-sell motion and write the outreach.",
      revops: "RevOps pod — model the enterprise funnel, score the accounts, and forecast the pipeline.",
    },
    agent: {
      atlas: "Atlas frames the launch and sequences the three pods — GTM, Partnerships, and RevOps — into one account plan.",
      segmenter: "The Segmenter prioritizes the FS sub-segments by reachable accounts, fit, and accessibility — real scoring.",
      "motion-designer": "The Motion Designer sets the enterprise channels, the field + co-sell motion, and the pricing path.",
      "partner-scout": "The Partner Scout scores the SI / ISV / marketplace ecosystem on a real fit model and picks the co-sell tier.",
      "outreach-writer": "The Outreach Writer drafts the partner co-sell outreach and a joint FS one-pager.",
      "funnel-engineer": "The Funnel Engineer derives enterprise conversion rates and cycle time from the account base.",
      "lead-scorer": "The Lead Scorer applies the propensity model and ranks every account — the score predicts winning.",
      forecaster: "The Forecaster projects pipeline and bookings from the scored open accounts, with confidence bands.",
      "attribution-analyst": "The Attribution Analyst proposes an opportunity-influence model and a build-vs-buy RevOps stack.",
    },
    closing: "Account plan assembled — segments, co-sell, and the enterprise revenue model in one coherent view. Tune the propensity threshold to re-score and re-forecast live.",
  },
  labels: {
    leadNoun: "accounts",
    leadNounSingular: "account",
    qualifiedShort: "Qual",
    qualifiedPlural: "qualified accounts",
    scoreModelNoun: "propensity model",
    scoreModelTitle: "Account scoring · propensity model",
    thresholdLabel: "Propensity threshold",
    thresholdNoun: "propensity threshold",
    segmentsTitle: "Industry segments · prioritized",
    recordsNoun: "accounts",
    countLabel: "Accounts",
    stageLabels: STAGE_LABELS,
  },
  agentCopy: {
    segmenterDetail: (segs) =>
      `${segs[0].label} and ${segs[1].label} pair the largest reachable account base with the strongest fit for regulated AI. Capital markets and global banks rank lower on accessibility given procurement and compliance gates.`,
    partnerScoutDetail: (_tierA, topCats) =>
      `The top tier skews to ${topCats.join(", ").toLowerCase()} — where co-sell reach into regulated accounts and delivery capacity are highest.`,
    leadScorerDetail: (top) =>
      `Top account ${top.company} scores ${top.score}. The propensity model is predictive — win rate climbs with score — so the threshold sets how tight the pursuit list is.`,
    funnelEngineerDetail: (funnel, cycle) =>
      `Stage conversions: ${convsLine(funnel)}. Average won ACV ${usd(funnel.avgAcv)} on a ~${cycle}-day enterprise cycle.`,
    forecasterDetail: (f) =>
      `Open pipeline ${usdM(f.pipelineValue)} → ${usdM(f.expectedBookings)} expected, with an ${usdM(f.low)}–${usdM(f.high)} band from win-probability variance across the pursuit list.`,
    orchestratorIntro: "Three pods, one account plan — GTM picks the segments and motion, Partnerships builds the co-sell, RevOps models the pipeline.",
  },
  buildPlanSummary,
  buildExecBrief,
};
