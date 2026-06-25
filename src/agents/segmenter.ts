import type { AgentContext } from "./types";

// Segmenter — prioritizes the vertical's sub-segments by market × fit × accessibility (real scoring).
export async function runSegmenter(ctx: AgentContext): Promise<void> {
  ctx.emit({ pod: "gtm", agent: "segmenter", status: "thinking", headline: "Scoring the vertical's sub-segments by market, fit, and accessibility…" });
  await ctx.wait(700);

  const segs = ctx.snapshot.segments;
  const top = segs[0];

  ctx.emit({
    pod: "gtm",
    agent: "segmenter",
    status: "done",
    headline: `Prioritized ${segs.length} sub-segments — lead with ${top.label} (score ${top.score}).`,
    detail: ctx.content.agentCopy.segmenterDetail(segs),
    toolCalls: [{ tool: "scoreSegments()", skill: "scoring", input: `${segs.length} segments`, output: `top = ${top.key} (${top.score})` }],
    chips: [
      { label: "Top segment", value: top.label, tone: "accent" },
      { label: "Score", value: String(top.score) },
      { label: "Market", value: top.marketSize.toLocaleString() },
      { label: "Segments", value: String(segs.length) },
    ],
    handoffTo: "motion-designer",
  });
}
