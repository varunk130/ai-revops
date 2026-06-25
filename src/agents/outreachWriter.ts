import { agentLLM } from "@/lib/llm";
import type { OnePager, OutreachEmail } from "@/lib/types";
import type { AgentContext } from "./types";

// Outreach Writer — assembles the partner outreach sequence and joint-GTM one-pager (curated).
export async function runOutreachWriter(ctx: AgentContext): Promise<{ outreach: OutreachEmail[]; onePager: OnePager }> {
  const OUTREACH = ctx.content.outreach;
  const ONE_PAGER = ctx.content.onePager;
  ctx.emit({ pod: "partnerships", agent: "outreach-writer", status: "thinking", headline: "Drafting the partner outreach sequence and joint-GTM one-pager…" });
  await ctx.wait(750);

  const hero = await agentLLM.generate({ task: "onepager-hero", context: {}, candidates: ctx.content.onePagerHeros, seed: ctx.seed });

  ctx.emit({
    pod: "partnerships",
    agent: "outreach-writer",
    status: "done",
    headline: `Built a ${OUTREACH.length}-touch outreach sequence and a ${ONE_PAGER.sections.length}-section one-pager.`,
    detail: `One-pager hero: \u201c${hero.text}\u201d Outreach is personalized with merged fields per partner.`,
    toolCalls: [
      { tool: "library.select()", skill: "content:outreach", input: "sequence + one-pager", output: `${OUTREACH.length} emails` },
      { tool: "agentLLM.generate()", skill: "llm-seam", input: "task = onepager-hero", output: `source = ${hero.source}` },
    ],
    chips: [
      { label: "Outreach", value: `${OUTREACH.length} touches`, tone: "accent" },
      { label: "One-pager", value: `${ONE_PAGER.sections.length} sections` },
      { label: "Source", value: hero.source, tone: "good" },
    ],
    handoffTo: "funnel-engineer",
  });

  return { outreach: OUTREACH, onePager: ONE_PAGER };
}
