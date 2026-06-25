import type {
  AttributionRec,
  AtlasSnapshot,
  ExecBrief,
  ForecastResult,
  FunnelModel,
  LeadLite,
  Motion,
  OnePager,
  OutreachEmail,
  ScenarioId,
  ScenarioLabels,
  ScoredPartner,
  ScoredSegment,
} from "@/lib/types";

export type AgentId =
  | "atlas"
  | "segmenter"
  | "motion-designer"
  | "partner-scout"
  | "outreach-writer"
  | "funnel-engineer"
  | "lead-scorer"
  | "forecaster"
  | "attribution-analyst";

export type Pod = "orchestrator" | "gtm" | "partnerships" | "revops";
export type Accent = "atlas" | "gtm" | "partner" | "revops";

export interface AgentMeta {
  id: AgentId;
  name: string;
  role: string;
  tagline: string;
  pod: Pod;
  accent: Accent;
  kind: "orchestrator" | "analysis" | "generative";
}

export const AGENTS: Record<AgentId, AgentMeta> = {
  atlas: { id: "atlas", name: "Atlas", role: "Orchestrator", tagline: "Sequences the three pods and assembles the unified launch plan.", pod: "orchestrator", accent: "atlas", kind: "orchestrator" },
  segmenter: { id: "segmenter", name: "Segmenter", role: "GTM · analysis", tagline: "Defines and prioritizes ICP sub-segments for the vertical.", pod: "gtm", accent: "gtm", kind: "analysis" },
  "motion-designer": { id: "motion-designer", name: "Motion Designer", role: "GTM · generative", tagline: "Picks channels, sales motion, and a pricing hypothesis.", pod: "gtm", accent: "gtm", kind: "generative" },
  "partner-scout": { id: "partner-scout", name: "Partner Scout", role: "Partnerships · analysis", tagline: "Scores the candidate partners and picks the top tier.", pod: "partnerships", accent: "partner", kind: "analysis" },
  "outreach-writer": { id: "outreach-writer", name: "Outreach Writer", role: "Partnerships · generative", tagline: "Drafts the partner outreach sequence and joint-GTM one-pager.", pod: "partnerships", accent: "partner", kind: "generative" },
  "funnel-engineer": { id: "funnel-engineer", name: "Funnel Engineer", role: "RevOps · analysis", tagline: "Builds the funnel model: conversions and velocity from the CRM.", pod: "revops", accent: "revops", kind: "analysis" },
  "lead-scorer": { id: "lead-scorer", name: "Lead Scorer", role: "RevOps · analysis", tagline: "Applies the PQL scoring model and ranks the leads.", pod: "revops", accent: "revops", kind: "analysis" },
  forecaster: { id: "forecaster", name: "Forecaster", role: "RevOps · analysis", tagline: "Projects pipeline and revenue with confidence bands.", pod: "revops", accent: "revops", kind: "analysis" },
  "attribution-analyst": { id: "attribution-analyst", name: "Attribution Analyst", role: "RevOps · generative", tagline: "Proposes an attribution model and a RevOps tool stack.", pod: "revops", accent: "revops", kind: "generative" },
};

export const AGENT_ORDER: AgentId[] = [
  "atlas",
  "segmenter",
  "motion-designer",
  "partner-scout",
  "outreach-writer",
  "funnel-engineer",
  "lead-scorer",
  "forecaster",
  "attribution-analyst",
];

export const POD_META: Record<Exclude<Pod, "orchestrator">, { label: string; accent: Accent }> = {
  gtm: { label: "GTM pod", accent: "gtm" },
  partnerships: { label: "Partnerships pod", accent: "partner" },
  revops: { label: "RevOps pod", accent: "revops" },
};

export type TraceStatus = "thinking" | "tool" | "done" | "handoff";

export interface ToolCall {
  tool: string;
  skill: string;
  input: string;
  output: string;
}

export type ChipTone = "default" | "good" | "bad" | "accent";

export interface Chip {
  label: string;
  value: string;
  tone?: ChipTone;
}

export interface TraceEvent {
  id: string;
  pod: Pod;
  agent: AgentId;
  status: TraceStatus;
  headline: string;
  detail?: string;
  toolCalls?: ToolCall[];
  chips?: Chip[];
  handoffTo?: AgentId;
  ts: number;
}

export interface PlanResult {
  goal: string;
  vertical: string;
  motion: Motion;
  outreach: OutreachEmail[];
  onePager: OnePager;
  attribution: AttributionRec;
  forecast: ForecastResult; // at the default threshold
  planSummary: string[];
  execBrief: ExecBrief;
}

// Everything scenario-specific the agents + UI consume. Two bundles exist (consumer,
// enterprise); selecting one reskins the entire motion without touching the runtime.
export interface ScenarioContent {
  id: ScenarioId;
  motion: Motion;
  positioningLines: string[];
  outreach: OutreachEmail[];
  onePager: OnePager;
  onePagerHeros: string[];
  attribution: AttributionRec;
  attributionSummaries: string[];
  narration: {
    guidedPrompt: string;
    suggestions: string[];
    podIntros: Record<string, string>;
    agent: Record<AgentId, string>;
    closing: string;
  };
  labels: ScenarioLabels;
  // scenario-specific phrasing the agents emit (kept out of the generic runtime)
  agentCopy: {
    segmenterDetail: (segs: ScoredSegment[]) => string;
    partnerScoutDetail: (tierA: ScoredPartner[], topCats: string[]) => string;
    leadScorerDetail: (top: LeadLite, threshold: number) => string;
    funnelEngineerDetail: (funnel: FunnelModel, cycleDays: number) => string;
    forecasterDetail: (forecast: ForecastResult) => string;
    orchestratorIntro: string; // the one-line framing under the first orchestrator step
  };
  buildPlanSummary: (snapshot: AtlasSnapshot, forecast: ForecastResult) => string[];
  buildExecBrief: (snapshot: AtlasSnapshot, forecast: ForecastResult) => ExecBrief;
}

export interface AgentContext {
  seed: number;
  snapshot: AtlasSnapshot;
  content: ScenarioContent;
  emit: (e: Omit<TraceEvent, "id" | "ts">) => void;
  wait: (ms: number) => Promise<void>;
}
