import { agentLLM } from "@/lib/llm";
import type { AttributionRec } from "@/lib/types";
import type { AgentContext } from "./types";

// Attribution Analyst — proposes a multi-touch attribution model and a build-vs-buy RevOps stack.
export async function runAttributionAnalyst(ctx: AgentContext): Promise<{ attribution: AttributionRec }> {
  const ATTRIBUTION = ctx.content.attribution;
  ctx.emit({ pod: "revops", agent: "attribution-analyst", status: "thinking", headline: "Proposing an attribution model and a RevOps tool stack…" });
  await ctx.wait(750);

  const sum = await agentLLM.generate({ task: "attribution-summary", context: {}, candidates: ctx.content.attributionSummaries, seed: ctx.seed });
  const attribution: AttributionRec = { ...ATTRIBUTION, summary: sum.text };
  const buildCount = ATTRIBUTION.stack.filter((s) => s.buildVsBuy === "build").length;
  const buyCount = ATTRIBUTION.stack.length - buildCount;
  const modelTag = ATTRIBUTION.model.match(/\(([^)]+)\)/)?.[1] ?? ATTRIBUTION.model.split(" ")[0];

  ctx.emit({
    pod: "revops",
    agent: "attribution-analyst",
    status: "done",
    headline: `Recommended ${ATTRIBUTION.model} + a ${ATTRIBUTION.stack.length}-layer stack (${buildCount} build, ${buyCount} buy).`,
    detail: sum.text,
    toolCalls: [
      { tool: "library.select()", skill: "content:attribution", input: "model + stack", output: `${ATTRIBUTION.stack.length} layers` },
      { tool: "agentLLM.generate()", skill: "llm-seam", input: "task = attribution-summary", output: `source = ${sum.source}` },
    ],
    chips: [
      { label: "Model", value: modelTag, tone: "accent" },
      { label: "Layers", value: String(ATTRIBUTION.stack.length) },
      { label: "Build", value: String(buildCount) },
      { label: "Buy", value: String(buyCount) },
    ],
    handoffTo: "atlas",
  });

  return { attribution };
}
