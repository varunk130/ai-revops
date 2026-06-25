import type { AgentId } from "@/agents/types";

export const GUIDED_PROMPT = "We're entering the consumer-brands vertical. Build the GTM, the partner motion, and the revenue model.";

export const POD_INTROS: Record<string, string> = {
  gtm: "GTM pod — define the segments to win and the motion to win them.",
  partnerships: "Partnerships pod — find the partners worth a joint motion and write the outreach.",
  revops: "RevOps pod — build the funnel model, score the leads, and forecast the revenue.",
};

export const NARRATION: Record<AgentId, string> = {
  atlas: "Atlas frames the launch and sequences the three pods — GTM, Partnerships, and RevOps — into one plan.",
  segmenter: "The Segmenter prioritizes the vertical's sub-segments by market, fit, and accessibility — real scoring.",
  "motion-designer": "The Motion Designer picks the channels, the sales motion, and a pricing hypothesis.",
  "partner-scout": "The Partner Scout scores 44 candidate partners on a real fit model and picks the top tier.",
  "outreach-writer": "The Outreach Writer drafts the partner outreach sequence and a joint-GTM one-pager.",
  "funnel-engineer": "The Funnel Engineer derives conversion rates and velocity from 2,000 real CRM records.",
  "lead-scorer": "The Lead Scorer applies the PQL model and ranks every lead — the score predicts winning.",
  forecaster: "The Forecaster projects pipeline and revenue from the scored open deals, with confidence bands.",
  "attribution-analyst": "The Attribution Analyst proposes a multi-touch model and a build-vs-buy RevOps stack.",
};

export const CLOSING = "Launch plan assembled — GTM, partners, and the revenue model in one coherent view. Tune the PQL threshold to re-score and re-forecast live.";

export const SUGGESTIONS = [
  GUIDED_PROMPT,
  "Prioritize the top segments and show me the revenue forecast.",
  "Who should we partner with to enter consumer brands, and what's the pipeline worth?",
];
