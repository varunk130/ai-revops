import type { AgentContext } from "./types";

// Partner Scout — scores the candidate partner list on a real fit model and picks the top tier.
export async function runPartnerScout(ctx: AgentContext): Promise<void> {
  ctx.emit({ pod: "partnerships", agent: "partner-scout", status: "thinking", headline: `Scoring ${ctx.snapshot.partners.length} candidate partners on the fit model…` });
  await ctx.wait(750);

  const partners = ctx.snapshot.partners;
  const tierA = partners.filter((p) => p.tier === "A");
  const top = partners[0];
  const topCats = Array.from(new Set(tierA.map((p) => p.category))).slice(0, 3);

  ctx.emit({
    pod: "partnerships",
    agent: "partner-scout",
    status: "done",
    headline: `${tierA.length} tier-A partners — lead with ${top.name} (fit ${top.fitScore}).`,
    detail: ctx.content.agentCopy.partnerScoutDetail(tierA, topCats),
    toolCalls: [{ tool: "rankPartners()", skill: "scoring", input: `${partners.length} candidates`, output: `${tierA.length} tier-A` }],
    chips: [
      { label: "Candidates", value: String(partners.length) },
      { label: "Tier A", value: String(tierA.length), tone: "accent" },
      { label: "Top partner", value: top.name },
      { label: "Top fit", value: String(top.fitScore), tone: "good" },
    ],
    handoffTo: "outreach-writer",
  });
}
