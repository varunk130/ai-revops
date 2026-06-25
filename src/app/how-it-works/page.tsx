import type { Metadata } from "next";
import Link from "next/link";
import { KeyRound, Calculator, PenLine, Plug, ArrowRight } from "lucide-react";
import { Section, Eyebrow } from "@/components/ui";
import { ArchitectureDiagram } from "@/components/ArchitectureDiagram";
import { TechArchitecture } from "@/components/TechArchitecture";
import { AGENTS, AGENT_ORDER, POD_META, type Pod } from "@/agents/types";
import { AGENT_ICON, ACCENT } from "@/components/agentVisuals";
import { SKILLS } from "@/skills";

export const metadata: Metadata = {
  title: "How it works",
  description: "The architecture: an Orchestrator, nine typed sub-agents in three pods, named skills, and real scoring/forecast math — all local, no API keys.",
};

const PODS: Exclude<Pod, "orchestrator">[] = ["gtm", "partnerships", "revops"];

export default function HowItWorksPage() {
  return (
    <>
      <Section className="!pb-8">
        <Eyebrow className="mb-3">How it works</Eyebrow>
        <h1 className="max-w-3xl font-display text-4xl font-semibold leading-[1.1] tracking-tight text-white sm:text-5xl">
          Nine agents, three pods, one source of truth.
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-slate-400">
          A goal flows through Atlas to three pods of typed sub-agents that call named skills over a seeded dataset. The live
          demo ships two switchable scenarios — a fintech entering consumer brands, and an enterprise AI platform entering
          financial services via partner co-sell — and every tool call and number is observable in the Agent Trace.
        </p>
      </Section>

      <Section className="!pt-0">
        <Eyebrow className="mb-5">The flow · goal to launch plan</Eyebrow>
        <ArchitectureDiagram />
      </Section>

      <Section className="!pt-0">
        <Eyebrow className="mb-3">The technical stack · end-to-end</Eyebrow>
        <p className="mb-5 max-w-2xl text-sm leading-relaxed text-slate-400">
          The same picture, by layer of technology — from the Next.js experience down to the local data. Tools and
          data sit behind an <span className="text-white">MCP-compatible</span> interface, so the skills running
          in-process today can move to remote MCP servers with no agent changes. Retrieval, web search, and a real
          model are <span className="text-white">pluggable seams</span> — present in the design, off by default, and
          never required to run.
        </p>
        <TechArchitecture />
      </Section>

      <Section className="!pt-0">
        <Eyebrow className="mb-5">The agents · by pod</Eyebrow>
        <div className="space-y-4">
          {(["orchestrator", ...PODS] as Pod[]).map((pod) => {
            const agents = AGENT_ORDER.filter((id) => AGENTS[id].pod === pod);
            const label = pod === "orchestrator" ? "Orchestrator" : POD_META[pod as Exclude<Pod, "orchestrator">].label;
            return (
              <div key={pod}>
                <div className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500">{label}</div>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {agents.map((id) => {
                    const a = AGENTS[id];
                    const Icon = AGENT_ICON[id];
                    const accent = ACCENT[a.accent];
                    return (
                      <div key={id} className="panel p-4">
                        <div className="flex items-center gap-2.5">
                          <span className={`flex h-8 w-8 items-center justify-center rounded-lg border ${accent.border} ${accent.bg}`}>
                            <Icon className={`h-4 w-4 ${accent.text}`} />
                          </span>
                          <div className="text-[13px] font-semibold text-white">{a.name}</div>
                        </div>
                        <p className="mt-2 text-[12px] leading-relaxed text-slate-400">{a.tagline}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </Section>

      <Section className="!pt-0">
        <Eyebrow className="mb-5">The skills · reusable, invoked by name</Eyebrow>
        <div className="grid gap-3 sm:grid-cols-2">
          {SKILLS.map((s) => (
            <div key={s.name} className="panel flex items-start gap-3 p-5">
              <span className="mt-0.5 rounded-md border border-atlas/25 bg-atlas/[0.06] px-2 py-1 font-mono text-[11px] text-atlas">{s.name}</span>
              <p className="text-[13px] leading-relaxed text-slate-400">{s.description}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section className="!pt-0">
        <Eyebrow className="mb-5">Two kinds of output — both key-free</Eyebrow>
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="panel p-6">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-revops/30 bg-revops/10 text-revops">
              <Calculator className="h-5 w-5" />
            </div>
            <h3 className="mt-4 font-display text-lg font-semibold text-white">Analytical = real computation</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-400">
              Segment and partner scoring, the funnel model, the PQL lead score, and the banded revenue forecast are all genuine
              math over the CRM. The score is predictive — win rate rises with it — and the threshold is a live precision dial.
            </p>
          </div>
          <div className="panel p-6">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-gtm/30 bg-gtm/10 text-gtm">
              <PenLine className="h-5 w-5" />
            </div>
            <h3 className="mt-4 font-display text-lg font-semibold text-white">Generative = curated library</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-400">
              The motion, the partner outreach + one-pager, and the attribution/stack recommendation are assembled from a
              scenario-specific content library — real, usable copy grounded in the data the agents just analyzed.
            </p>
          </div>
        </div>

        <div className="panel mt-4 flex flex-col gap-4 p-6 sm:flex-row sm:items-center">
          <div className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-atlas/30 bg-atlas/10 text-atlas">
            <Plug className="h-5 w-5" />
          </div>
          <p className="flex-1 text-sm leading-relaxed text-slate-400">
            <span className="font-semibold text-white">One optional LLM seam.</span> Generative agents call{" "}
            <code className="rounded bg-white/[0.06] px-1.5 py-0.5 font-mono text-[12px] text-atlas">agentLLM.generate()</code>,
            which defaults to the curated library. A model adapter could later route it to a real model — the app never requires one.
          </p>
          <span className="inline-flex shrink-0 items-center gap-1.5 self-start rounded-md border border-atlas/30 bg-atlas/10 px-2.5 py-1.5 text-xs text-atlas sm:self-auto">
            <KeyRound className="h-3.5 w-3.5" /> Zero API keys
          </span>
        </div>

        <div className="mt-8">
          <Link href="/demo" className="btn-primary !px-6 !py-3.5">
            Run it yourself <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </Section>
    </>
  );
}
