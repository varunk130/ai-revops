import { num } from "@/lib/format";
import type { AgentContext } from "./types";

// Lead Scorer — applies the PQL scoring model and ranks every lead (real, predictive).
export async function runLeadScorer(ctx: AgentContext): Promise<void> {
  const labels = ctx.content.labels;
  const leadCount = ctx.snapshot.meta.leadCount;
  ctx.emit({ pod: "revops", agent: "lead-scorer", status: "thinking", headline: `Applying the ${labels.scoreModelNoun} to all ${num(leadCount)} ${labels.leadNoun}…` });
  await ctx.wait(750);

  const thr = ctx.snapshot.meta.defaultThreshold;
  const pql = ctx.snapshot.leadsScored.filter((l) => l.score >= thr).length;
  const top = ctx.snapshot.leadsTop[0];

  ctx.emit({
    pod: "revops",
    agent: "lead-scorer",
    status: "done",
    headline: `Scored ${num(leadCount)} ${labels.leadNoun} — ${num(pql)} clear the ${labels.qualifiedShort} bar (score ≥ ${thr}).`,
    detail: ctx.content.agentCopy.leadScorerDetail(top, thr),
    toolCalls: [{ tool: "scoreLead()", skill: "lead-score", input: `${num(leadCount)} ${labels.leadNoun} × 4 features`, output: `${num(pql)} ${labels.qualifiedPlural} @ ${thr}` }],
    chips: [
      { label: "Scored", value: num(leadCount) },
      { label: labels.qualifiedPlural, value: num(pql), tone: "accent" },
      { label: "Top score", value: String(top.score), tone: "good" },
      { label: "Threshold", value: String(thr) },
    ],
    handoffTo: "forecaster",
  });
}
