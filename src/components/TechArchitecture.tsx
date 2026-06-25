import {
  AppWindow,
  ArrowDown,
  Boxes,
  Compass,
  Database,
  FileText,
  Globe,
  Library,
  MessageSquare,
  Radio,
  Search,
  Server,
  Sparkles,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import type { ReactNode } from "react";
import { AGENTS, AGENT_ORDER, POD_META, type Pod } from "@/agents/types";
import { AGENT_ICON, ACCENT } from "@/components/agentVisuals";
import { SKILLS } from "@/skills";

const PODS: Exclude<Pod, "orchestrator">[] = ["gtm", "partnerships", "revops"];

type Status = "live" | "mcp" | "pluggable";

const STATUS_PILL: Record<Status, { label: string; cls: string }> = {
  live: { label: "live", cls: "border-atlas/40 bg-atlas/10 text-atlas" },
  mcp: { label: "MCP", cls: "border-revops/40 bg-revops/10 text-revops" },
  pluggable: { label: "pluggable", cls: "border-white/15 bg-white/[0.03] text-slate-300" },
};

function Plane({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-white/[0.07] bg-white/[0.015] p-3.5 sm:p-4">
      <div className="mb-3 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
        <span className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-slate-400">{label}</span>
        {hint && <span className="text-[11px] text-slate-500">{hint}</span>}
      </div>
      {children}
    </div>
  );
}

function Node({
  icon: Icon,
  title,
  sub,
  status = "live",
  accent = "atlas",
  className = "",
}: {
  icon: LucideIcon;
  title: string;
  sub?: string;
  status?: Status;
  accent?: keyof typeof ACCENT;
  className?: string;
}) {
  const a = ACCENT[accent];
  const pill = STATUS_PILL[status];
  const dashed = status === "pluggable";
  return (
    <div
      className={`relative flex h-full flex-col rounded-xl border ${dashed ? "border-dashed border-white/15" : a.border} bg-white/[0.025] p-3 ${className}`}
    >
      <div className="flex items-start gap-2.5">
        <span className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border ${dashed ? "border-white/10 bg-white/[0.03]" : `${a.border} ${a.bg}`}`}>
          <Icon className={`h-3.5 w-3.5 ${dashed ? "text-slate-300" : a.text}`} aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[13px] font-semibold text-white">{title}</span>
            <span className={`shrink-0 rounded border px-1.5 py-0.5 font-mono text-[9.5px] uppercase tracking-wider ${pill.cls}`}>{pill.label}</span>
          </div>
          {sub && <p className="mt-1 text-[11.5px] leading-relaxed text-slate-300">{sub}</p>}
        </div>
      </div>
    </div>
  );
}

function Flow({ label }: { label?: string }) {
  return (
    <div className="flex flex-col items-center py-1.5" aria-hidden>
      <span className="h-3 w-px bg-gradient-to-b from-white/[0.04] to-white/20" />
      <ArrowDown className="h-3.5 w-3.5 text-slate-400" />
      {label && <span className="mt-0.5 font-mono text-[10px] uppercase tracking-wider text-slate-500">{label}</span>}
    </div>
  );
}

export function TechArchitecture() {
  return (
    <div className="panel relative overflow-hidden p-4 sm:p-6">
      <div className="contour-bg absolute inset-0 -z-10 opacity-50" aria-hidden />

      {/* legend */}
      <div className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11px] text-slate-300">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-sm border border-atlas/50 bg-atlas/20" /> live in this demo
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-sm border border-revops/50 bg-revops/20" /> MCP interface
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-sm border border-dashed border-white/30" /> pluggable · key-free, off by default
        </span>
      </div>

      {/* 1 — Experience */}
      <Plane label="Experience" hint="Next.js 14 · App Router · the surface the user drives">
        <div className="grid gap-2.5 sm:grid-cols-3">
          <Node icon={MessageSquare} accent="atlas" title="Brief / Chat" sub="Free-form goal or one-click guided run — the prompt that starts the motion." />
          <Node icon={Radio} accent="atlas" title="Agent Trace" sub="Live stream of every agent, hand-off, and tool call — plain-language + technical layers." />
          <Node icon={AppWindow} accent="revops" status="mcp" title="MCP Apps" sub="Interactive result surfaces — PQL threshold dial, lead table, forecast — embedded as app views." />
        </div>
      </Plane>

      <Flow label="goal" />

      {/* 2 — Orchestration */}
      <Plane label="Orchestration" hint="plans, sequences the pods, assembles one plan">
        <Node
          icon={Compass}
          accent="atlas"
          title="Atlas · orchestrator"
          sub="Receives the brief, makes a short plan, and dispatches to typed sub-agents over an observable message bus — then merges every pod's output into one Vertical Launch Plan."
        />
      </Plane>

      <Flow label="dispatch" />

      {/* 3 — Sub-agents */}
      <Plane label="Sub-agents" hint="3 pods · 8 typed agents · analysis + generative">
        <div className="grid gap-2.5 md:grid-cols-3">
          {PODS.map((pod) => {
            const meta = POD_META[pod];
            const accent = ACCENT[meta.accent];
            const agents = AGENT_ORDER.filter((id) => AGENTS[id].pod === pod);
            return (
              <div key={pod} className={`rounded-xl border ${accent.border} bg-white/[0.02] p-2.5`}>
                <div className={`mb-2 flex items-center gap-1.5 font-mono text-[10px] font-semibold uppercase tracking-wider ${accent.text}`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${accent.dot}`} /> {meta.label}
                </div>
                <div className="space-y-1.5">
                  {agents.map((id) => {
                    const Icon = AGENT_ICON[id];
                    return (
                      <div key={id} className="flex items-center gap-2 rounded-lg bg-white/[0.025] px-2.5 py-1.5">
                        <Icon className={`h-3.5 w-3.5 shrink-0 ${accent.text}`} aria-hidden />
                        <span className="text-[12px] text-white">{AGENTS[id].name}</span>
                        <span className="ml-auto font-mono text-[9.5px] uppercase tracking-wider text-slate-400">{AGENTS[id].kind === "generative" ? "gen" : "anlz"}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </Plane>

      <Flow label="tool calls" />

      {/* 4 — Capabilities / tools (MCP plane) */}
      <Plane label="Capabilities & tools" hint="MCP-compatible tool interface — the same contract whether in-process or remote">
        <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
          <Node
            icon={Wrench}
            accent="atlas"
            title="Skills"
            sub={`Reusable, invoked by name: ${SKILLS.map((s) => s.name).join(" · ")}. Real scoring + forecast math.`}
          />
          <Node
            icon={Server}
            accent="revops"
            status="mcp"
            title="MCP tool servers"
            sub="Skills + data exposed as MCP tools & resources. In-process here; swap to remote servers with no agent changes."
          />
          <Node
            icon={Sparkles}
            accent="atlas"
            status="pluggable"
            title="Dynamic LLM"
            sub="agentLLM.generate() seam — curated library now; a model adapter can route to a real model (e.g. Claude Opus 4.8) later."
          />
          <Node
            icon={Library}
            accent="gtm"
            status="pluggable"
            title="RAG / retrieval"
            sub="Grounding over the CRM + curated content library for citations and context — interface ready, off by default."
          />
          <Node
            icon={Search}
            accent="partner"
            status="pluggable"
            title="Web search"
            sub="External market, partner, and competitive signals via an MCP search tool — disabled in the offline demo."
          />
          <Node
            icon={Boxes}
            accent="revops"
            status="mcp"
            title="Tool registry"
            sub="Typed tool descriptors the orchestrator binds by name — discoverable, observable, and individually buildable."
          />
        </div>
      </Plane>

      <Flow label="reads / writes" />

      {/* 5 — Data / knowledge */}
      <Plane label="Knowledge & data" hint="local, server-side · one source of truth · synthetic">
        <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
          <Node icon={Database} accent="revops" title="CRM" sub="2,000 leads — firmographics, usage, stage & outcome." />
          <Node icon={Boxes} accent="partner" title="Partners" sub="44 candidates with reach + fit attributes." />
          <Node icon={Compass} accent="gtm" title="Segments" sub="6 vertical sub-segments, scored by market × fit." />
          <Node icon={FileText} accent="atlas" title="Content library" sub="Curated, scenario-tied copy for generative output." />
        </div>
      </Plane>

      <Flow label="assemble" />

      {/* output */}
      <div className="flex items-center gap-3 rounded-xl border border-atlas/30 bg-atlas/[0.06] p-3.5">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-atlas/40 bg-atlas/10">
          <Globe className="h-4 w-4 text-atlas" aria-hidden />
        </span>
        <div>
          <div className="text-[13px] font-semibold text-white">Vertical Launch Plan</div>
          <p className="mt-0.5 text-[12px] leading-relaxed text-slate-300">
            Segments · motion · scored partners + outreach · funnel · banded forecast · attribution — one coherent view, re-computed live as you tune the PQL threshold.
          </p>
        </div>
      </div>
    </div>
  );
}
