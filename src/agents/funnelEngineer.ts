import { num, pct, usd } from "@/lib/format";
import type { AgentContext } from "./types";

// Funnel Engineer — derives conversion rates and velocity from the CRM (real math).
export async function runFunnelEngineer(ctx: AgentContext): Promise<void> {
  const labels = ctx.content.labels;
  ctx.emit({ pod: "revops", agent: "funnel-engineer", status: "thinking", headline: `Deriving conversions and velocity from ${num(ctx.snapshot.meta.leadCount)} ${labels.recordsNoun}…` });
  await ctx.wait(750);

  const f = ctx.snapshot.funnel;
  const cycle = f.stages.reduce((s, st) => s + st.velocityDays, 0);

  ctx.emit({
    pod: "revops",
    agent: "funnel-engineer",
    status: "done",
    headline: `Funnel model built — ${pct(f.wonRate, 1)} ${labels.stageLabels.lead.toLowerCase()}→${labels.stageLabels.won.toLowerCase()}, ~${cycle}-day cycle.`,
    detail: ctx.content.agentCopy.funnelEngineerDetail(f, cycle),
    toolCalls: [{ tool: "buildFunnelModel()", skill: "forecast", input: `${num(ctx.snapshot.meta.leadCount)} ${labels.leadNoun}`, output: `${pct(f.wonRate, 1)} won` }],
    chips: [
      { label: `${labels.stageLabels.lead}→${labels.stageLabels.won}`, value: pct(f.wonRate, 1), tone: "accent" },
      { label: "Open", value: num(f.openCount) },
      { label: "Avg ACV", value: usd(f.avgAcv) },
      { label: "Cycle", value: `~${cycle}d` },
    ],
    handoffTo: "lead-scorer",
  });
}
