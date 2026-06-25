import { num, usdM } from "@/lib/format";
import type { AtlasSnapshot } from "@/lib/types";
import type { AgentContext, PlanResult, ScenarioContent, TraceEvent } from "./types";
import { runSegmenter } from "./segmenter";
import { runMotionDesigner } from "./motionDesigner";
import { runPartnerScout } from "./partnerScout";
import { runOutreachWriter } from "./outreachWriter";
import { runFunnelEngineer } from "./funnelEngineer";
import { runLeadScorer } from "./leadScorer";
import { runForecaster } from "./forecaster";
import { runAttributionAnalyst } from "./attributionAnalyst";

export interface RunAtlasOptions {
  goal: string;
  snapshot: AtlasSnapshot;
  content: ScenarioContent;
  emit: (e: Omit<TraceEvent, "id" | "ts">) => void;
  wait: (ms: number) => Promise<void>;
  onArtifact?: (partial: Partial<PlanResult>) => void;
}

// Orchestrator "Atlas" — sequences the three pods and assembles the unified launch plan.
export async function runAtlas(opts: RunAtlasOptions): Promise<PlanResult> {
  const ctx: AgentContext = { seed: 1, snapshot: opts.snapshot, content: opts.content, emit: opts.emit, wait: opts.wait };
  const m = opts.snapshot.meta;
  const labels = opts.content.labels;

  ctx.emit({
    pod: "orchestrator",
    agent: "atlas",
    status: "thinking",
    headline: `New brief: take ${m.company} into ${m.vertical}. Sequencing GTM, Partnerships, and RevOps…`,
    detail: opts.content.agentCopy.orchestratorIntro,
  });
  await ctx.wait(650);

  ctx.emit({
    pod: "orchestrator",
    agent: "atlas",
    status: "handoff",
    headline: "Dispatching the GTM pod first — segments and motion.",
    chips: [
      { label: "Vertical", value: m.vertical, tone: "accent" },
      { label: labels.countLabel, value: num(m.leadCount) },
      { label: "Candidate partners", value: num(m.partnerCount) },
    ],
    handoffTo: "segmenter",
  });
  await ctx.wait(300);

  // GTM pod
  await runSegmenter(ctx);
  await ctx.wait(260);
  const { motion } = await runMotionDesigner(ctx);
  opts.onArtifact?.({ motion });
  await ctx.wait(300);

  // Partnerships pod
  await runPartnerScout(ctx);
  await ctx.wait(260);
  const { outreach, onePager } = await runOutreachWriter(ctx);
  opts.onArtifact?.({ outreach, onePager });
  await ctx.wait(300);

  // RevOps pod
  await runFunnelEngineer(ctx);
  await ctx.wait(260);
  await runLeadScorer(ctx);
  await ctx.wait(260);
  const { forecast: fc } = await runForecaster(ctx);
  opts.onArtifact?.({ forecast: fc });
  await ctx.wait(260);
  const { attribution } = await runAttributionAnalyst(ctx);
  opts.onArtifact?.({ attribution });
  await ctx.wait(320);

  const planSummary = opts.content.buildPlanSummary(opts.snapshot, fc);
  const execBrief = opts.content.buildExecBrief(opts.snapshot, fc);
  const tierA = opts.snapshot.partners.filter((p) => p.tier === "A").length;

  ctx.emit({
    pod: "orchestrator",
    agent: "atlas",
    status: "done",
    headline: "Vertical Launch Plan assembled — GTM, partners, and the revenue model in one view.",
    detail: `Every pod's output reads from one source of truth. Tune the ${labels.thresholdNoun} to re-score and re-forecast live.`,
    chips: [
      { label: "Lead segment", value: opts.snapshot.segments[0].label, tone: "accent" },
      { label: "Tier-A partners", value: String(tierA) },
      { label: labels.qualifiedPlural, value: num(fc.pqlCount) },
      { label: "Expected", value: usdM(fc.expectedBookings), tone: "good" },
    ],
  });

  return {
    goal: opts.goal,
    vertical: m.vertical,
    motion,
    outreach,
    onePager,
    attribution,
    forecast: fc,
    planSummary,
    execBrief,
  };
}
