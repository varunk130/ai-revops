import type { Metadata } from "next";
import Link from "next/link";
import { Play } from "lucide-react";
import { Section, Eyebrow, Stat } from "@/components/ui";
import { precompute } from "@/lib/precompute";
import { PlanSummary } from "@/components/demo/PlanSummary";
import { SegmentsView } from "@/components/demo/SegmentsView";
import { MotionView } from "@/components/demo/MotionView";
import { PartnerShortlist } from "@/components/demo/PartnerShortlist";
import { OutreachView } from "@/components/demo/OutreachView";
import { ResultsRevOps } from "@/components/demo/ResultsRevOps";
import { AttributionView } from "@/components/demo/AttributionView";
import { num, usdM } from "@/lib/format";

export const metadata: Metadata = {
  title: "Results",
  description: "The Vertical Launch Plan Atlas produced: prioritized segments, motion, partner shortlist + outreach, funnel model, scored leads, revenue forecast, and the RevOps stack.",
};

export default async function ResultsPage() {
  const { snapshot, plan } = await precompute();
  const tierA = snapshot.partners.filter((p) => p.tier === "A").length;
  const f = plan.forecast;

  return (
    <>
      <Section className="!pb-8">
        <Eyebrow className="mb-3">Output / Results · the Vertical Launch Plan</Eyebrow>
        <h1 className="max-w-3xl font-display text-4xl font-semibold leading-[1.1] tracking-tight text-white sm:text-5xl">
          GTM, partners, and the revenue model — <span className="text-atlas">one plan.</span>
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-slate-400">
          Everything below was produced by the same runtime the live demo uses — {snapshot.meta.company} entering{" "}
          {snapshot.meta.vertical}, computed deterministically with no API keys.
        </p>

        <div className="mt-9 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Stat value={snapshot.segments[0].label.split(" ")[0]} label="Lead segment" tone="gtm" />
          <Stat value={String(tierA)} label="Tier-A partners" tone="atlas" />
          <Stat value={num(f.pqlCount)} label="PQLs identified" tone="revops" />
          <Stat value={usdM(f.expectedBookings)} label="Forecast bookings" />
        </div>
      </Section>

      <Section className="!pt-0">
        <PlanSummary summary={plan.planSummary} />
      </Section>

      <Section className="!pt-0">
        <Eyebrow className="mb-5">GTM pod · segments &amp; motion</Eyebrow>
        <div className="grid gap-4 lg:grid-cols-2">
          <SegmentsView segments={snapshot.segments} />
          <MotionView motion={plan.motion} />
        </div>
      </Section>

      <Section className="!pt-0">
        <Eyebrow className="mb-5">Partnerships pod · shortlist &amp; outreach</Eyebrow>
        <div className="grid gap-4 lg:grid-cols-2">
          <PartnerShortlist partners={snapshot.partners} />
          <OutreachView outreach={plan.outreach} onePager={plan.onePager} />
        </div>
      </Section>

      <Section className="!pt-0">
        <Eyebrow className="mb-5">RevOps pod · funnel, scoring, forecast &amp; stack</Eyebrow>
        <div className="space-y-4">
          <ResultsRevOps snapshot={snapshot} />
          <AttributionView attribution={plan.attribution} />
        </div>

        <div className="mt-8">
          <Link href="/demo" className="btn-primary !px-6 !py-3.5">
            <Play className="h-4 w-4" /> Watch it happen live
          </Link>
        </div>
      </Section>
    </>
  );
}
