import { agentLLM } from "@/lib/llm";
import type { Motion } from "@/lib/types";
import type { AgentContext } from "./types";

// Motion Designer — picks channels, sales motion, and a pricing hypothesis (from the curated library).
export async function runMotionDesigner(ctx: AgentContext): Promise<{ motion: Motion }> {
  const MOTION = ctx.content.motion;
  ctx.emit({ pod: "gtm", agent: "motion-designer", status: "thinking", headline: "Designing the channel mix, sales motion, and pricing hypothesis…" });
  await ctx.wait(750);

  const line = await agentLLM.generate({ task: "positioning-line", context: { vertical: ctx.snapshot.meta.vertical }, candidates: ctx.content.positioningLines, seed: ctx.seed });

  ctx.emit({
    pod: "gtm",
    agent: "motion-designer",
    status: "done",
    headline: `Motion set: ${MOTION.salesMotion.toLowerCase()} across ${MOTION.channels.length} channels, ${MOTION.pricing.length} pricing tiers.`,
    detail: `Positioning: \u201c${line.text}\u201d`,
    toolCalls: [
      { tool: "library.select()", skill: "content:motion", input: "channels + motion + pricing", output: `${MOTION.channels.length} channels` },
      { tool: "agentLLM.generate()", skill: "llm-seam", input: "task = positioning-line", output: `source = ${line.source}` },
    ],
    chips: [
      { label: "Motion", value: MOTION.salesMotion, tone: "accent" },
      { label: "Channels", value: String(MOTION.channels.length) },
      { label: "Pricing tiers", value: String(MOTION.pricing.length) },
    ],
    handoffTo: "partner-scout",
  });

  return { motion: MOTION };
}
