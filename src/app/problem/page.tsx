import type { Metadata } from "next";
import Link from "next/link";
import { Split, Unplug, Hourglass, ArrowRight, Play } from "lucide-react";
import { Section, Eyebrow, Stat } from "@/components/ui";
import { buildSnapshot } from "@/lib/snapshot";
import { forecast } from "@/lib/forecast";
import { num, usdM } from "@/lib/format";

export const metadata: Metadata = {
  title: "Problem → Solution",
  description: "GTM, partnerships, and RevOps plan in silos. Atlas runs them as one system to enter a new vertical end-to-end.",
};

const PAINS = [
  {
    icon: Split,
    title: "Three teams, three docs",
    body: "GTM picks segments, partnerships chases logos, RevOps builds the model — separately. Every hand-off loses context and a week of calendar time.",
  },
  {
    icon: Unplug,
    title: "No shared source of truth",
    body: "The lead score sales works isn't the one the forecast assumes isn't the list partnerships targets. Three definitions of \u201cgood\u201d, zero alignment.",
  },
  {
    icon: Hourglass,
    title: "A vertical takes a quarter",
    body: "By the time the plan is stitched together across teams and tools, the market window has already moved. Speed is the whole game in a new segment.",
  },
];

export default function ProblemPage() {
  const snap = buildSnapshot();
  const f = forecast(snap.leadsScored, snap.meta.defaultThreshold);
  const tierA = snap.partners.filter((p) => p.tier === "A").length;

  return (
    <>
      <Section className="!pb-8">
        <Eyebrow className="mb-3">Problem → Solution</Eyebrow>
        <h1 className="max-w-3xl font-display text-4xl font-semibold leading-[1.1] tracking-tight text-white sm:text-5xl">
          GTM, partnerships, and RevOps are <span className="text-atlas">one system</span> — not three teams.
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-slate-400">
          Entering a new market segment fails in the seams between teams: a GTM plan that partnerships never sees, a partner
          motion RevOps can&apos;t measure, a forecast built on a different definition of a qualified lead.
        </p>
      </Section>

      <Section className="!pt-0">
        <div className="grid gap-4 md:grid-cols-3">
          {PAINS.map((p) => (
            <div key={p.title} className="panel p-6">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-loss/25 bg-loss/10 text-loss">
                <p.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold text-white">{p.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">{p.body}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section className="!pt-0">
        <div className="panel p-6 sm:p-8">
          <Eyebrow className="mb-4">One run, one source of truth · Northwind → {snap.meta.vertical}</Eyebrow>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Stat value={snap.segments[0].label.split(" ")[0]} label="Lead segment" tone="gtm" />
            <Stat value={String(tierA)} label="Tier-A partners" tone="atlas" />
            <Stat value={num(f.pqlCount)} label="PQLs identified" tone="revops" />
            <Stat value={usdM(f.expectedBookings)} label="Forecast bookings" />
          </div>
          <p className="mt-5 max-w-3xl text-[15px] leading-relaxed text-slate-400">
            The same scored leads drive the segments GTM prioritizes, the merchants partnerships targets, and the revenue
            RevOps forecasts — because one orchestrator produced all of it from one dataset.
          </p>
        </div>
      </Section>

      <Section className="!pt-0">
        <div className="grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <Eyebrow className="mb-3">The solution</Eyebrow>
            <h2 className="font-display text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              One orchestrator, three pods, one plan.
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-slate-400">
              Atlas runs GTM, Partnerships, and RevOps as pods under a single orchestrator. The Segmenter and Motion Designer
              set the where and how; the Partner Scout and Outreach Writer find and open the leverage; the Funnel Engineer, Lead
              Scorer, Forecaster, and Attribution Analyst measure it. Nine agents, one coherent Vertical Launch Plan — computed
              locally, no API keys.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link href="/demo" className="btn-primary !px-6 !py-3.5">
                <Play className="h-4 w-4" /> Watch it run
              </Link>
              <Link href="/how-it-works" className="btn-ghost !px-6 !py-3.5">
                See the architecture <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
          <div className="panel p-6">
            <div className="space-y-3">
              {[
                ["GTM", "Prioritize segments; set channels, motion, and pricing."],
                ["Partnerships", "Score 44 candidates; draft outreach + a joint one-pager."],
                ["RevOps", "Model the funnel, score leads, forecast revenue, recommend the stack."],
                ["Atlas", "Assemble it all into one launch plan from one source of truth."],
              ].map(([k, v]) => (
                <div key={k} className="flex gap-3">
                  <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-atlas" />
                  <p className="text-[13.5px] leading-relaxed text-slate-300">
                    <span className="font-semibold text-white">{k}.</span> {v}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
