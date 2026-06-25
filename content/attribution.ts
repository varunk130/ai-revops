import type { AttributionRec } from "@/lib/types";

export const ATTRIBUTION: AttributionRec = {
  model: "Position-based (W-shaped) multi-touch",
  modelRationale:
    "The CRM shows deals touching multiple channels across lead → MQL → PQL → SQL, so single-touch models mis-credit. W-shaped weights the three moments that matter most — first touch, lead-creation, and opportunity-creation (40/20/40) — which fits a partner-led, product-led motion better than first- or last-touch.",
  stack: [
    {
      layer: "Event & identity (CDP)",
      tool: "Open-source CDP + warehouse (build)",
      buildVsBuy: "build",
      why: "You already pipe product-usage signals for lead scoring; an OSS CDP into your warehouse keeps that data first-party and cheap to evolve. Buying a heavy CDP now is premium you don't need.",
    },
    {
      layer: "Attribution & analytics",
      tool: "Warehouse-native attribution (buy)",
      buildVsBuy: "buy",
      why: "Multi-touch attribution is fiddly and a solved problem; a warehouse-native tool gives W-shaped models out of the box and reads straight from your CDP tables. Don't rebuild this.",
    },
    {
      layer: "CRM & RevOps automation",
      tool: "CRM + reverse-ETL of scores (buy + build)",
      buildVsBuy: "buy",
      why: "Buy the CRM; build the thin reverse-ETL that writes the lead-score and PQL flags back so sales works the same ranked list the forecast uses. That glue is your edge, not your CRM.",
    },
  ],
  summary:
    "Buy the commodity layers (attribution, CRM), build the two pieces that are proprietary to you — the usage-signal pipeline and the score write-back — so GTM, partnerships, and RevOps all read one source of truth.",
};

// Candidates for the agentLLM seam (the Attribution Analyst selects the summary line).
export const ATTRIBUTION_SUMMARIES = [
  "Buy the commodity layers, build the two pieces proprietary to you — the usage signals and the score write-back.",
  "One source of truth: scored leads flow from the warehouse into the CRM, the forecast, and partner dashboards alike.",
  "Build where the data is your moat; buy where it's a solved problem.",
];
