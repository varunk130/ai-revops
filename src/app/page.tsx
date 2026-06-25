import Link from "next/link";
import { ArrowRight, KeyRound, Target, Handshake, LineChart, Play } from "lucide-react";
import { Section, Eyebrow, Stat, TagPill } from "@/components/ui";
import { AgentPipeline } from "@/components/AgentPipeline";
import { SITE } from "@/lib/site";
import { buildSnapshot } from "@/lib/snapshot";
import { forecast } from "@/lib/forecast";
import { num, usdM } from "@/lib/format";

export default function HomePage() {
  const snap = buildSnapshot();
  const f = forecast(snap.leadsScored, snap.meta.defaultThreshold);

  return (
    <>
      <div className="relative overflow-hidden">
        <div className="contour-bg absolute inset-0 -z-10" aria-hidden />
        <Section className="!py-20 sm:!py-28">
          <div className="flex flex-wrap items-center gap-2">
            <TagPill accent="atlas">
              <span className="h-1.5 w-1.5 rounded-full bg-atlas" /> GTM + Partnerships + RevOps
            </TagPill>
            <TagPill accent="revops">
              <KeyRound className="h-3 w-3" /> Local-first · no API keys
            </TagPill>
          </div>

          <h1 className="mt-6 max-w-4xl font-display text-4xl font-semibold leading-[1.07] tracking-tight text-white sm:text-6xl">
            One prompt takes a company into a <span className="text-atlas">new market — end to end.</span>
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-400">
            GTM, partnerships, and revenue ops are one system, not three teams throwing docs over a wall. Atlas runs all three
            as pods under a single orchestrator — segments, motion, partners, outreach, funnel, scoring, and a real forecast.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link href="/demo" className="btn-primary text-[15px] !px-6 !py-3.5">
              <Play className="h-4 w-4" /> Run the live demo
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/how-it-works" className="btn-ghost text-[15px] !px-6 !py-3.5">
              See how it works
            </Link>
            <span className="text-sm text-slate-500 sm:ml-2">No sign-up. Nothing to configure.</span>
          </div>

          <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Stat value="9" label="Agents across 3 pods" tone="atlas" />
            <Stat value={num(snap.meta.leadCount)} label="CRM leads scored" tone="revops" />
            <Stat value={num(snap.meta.partnerCount)} label="Partners evaluated" tone="gtm" />
            <Stat value={usdM(f.expectedBookings)} label="Forecast bookings" />
          </div>
        </Section>
      </div>

      <Section className="!pt-4">
        <Eyebrow className="mb-4">Three pods, one orchestrator</Eyebrow>
        <AgentPipeline />
      </Section>

      <Section className="!pt-4">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { icon: Target, title: "GTM", body: "The Segmenter prioritizes the vertical's sub-segments by market × fit × accessibility; the Motion Designer sets channels, motion, and pricing.", accent: "gtm" as const },
            { icon: Handshake, title: "Partnerships", body: "The Partner Scout scores 44 candidates on a real fit model and picks the top tier; the Outreach Writer drafts the sequence and a joint-GTM one-pager.", accent: "partner" as const },
            { icon: LineChart, title: "RevOps", body: "Funnel Engineer, Lead Scorer, Forecaster, and Attribution Analyst turn 2,000 CRM records into a scored pipeline and a banded revenue forecast.", accent: "revops" as const },
          ].map((c) => (
            <div key={c.title} className="panel p-6">
              <div className={`inline-flex h-10 w-10 items-center justify-center rounded-lg border ${c.accent === "gtm" ? "border-gtm/30 bg-gtm/10 text-gtm" : c.accent === "partner" ? "border-partner/30 bg-partner/10 text-partner" : "border-revops/30 bg-revops/10 text-revops"}`}>
                <c.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold text-white">{c.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">{c.body}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section className="!pt-4">
        <div className="panel relative overflow-hidden p-8 sm:p-12">
          <div className="contour-bg absolute inset-0 -z-10 opacity-70" aria-hidden />
          <h2 className="max-w-2xl font-display text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            Watch 9 agents turn “enter a new vertical” into one coherent launch plan — in under two minutes.
          </h2>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Link href="/demo" className="btn-primary !px-6 !py-3.5">
              <Play className="h-4 w-4" /> Run the guided demo
            </Link>
            <Link href="/problem" className="btn-ghost !px-6 !py-3.5">
              Why it matters
            </Link>
          </div>
        </div>
      </Section>
    </>
  );
}
