import { ArrowDown, Compass, Database, FileText, Wrench } from "lucide-react";
import { AGENTS, AGENT_ORDER, POD_META, type Pod } from "@/agents/types";
import { AGENT_ICON, ACCENT } from "@/components/agentVisuals";
import { SKILLS } from "@/skills";

const PODS: Exclude<Pod, "orchestrator">[] = ["gtm", "partnerships", "revops"];

function Arrow() {
  return (
    <div className="flex justify-center py-2">
      <ArrowDown className="h-4 w-4 text-slate-600" />
    </div>
  );
}

export function ArchitectureDiagram() {
  return (
    <div className="panel relative overflow-hidden p-5 sm:p-7">
      <div className="contour-bg absolute inset-0 -z-10 opacity-60" aria-hidden />

      <div className="mx-auto flex w-fit items-center gap-2 rounded-xl border border-atlas/30 bg-atlas/[0.06] px-4 py-2.5">
        <Compass className="h-4 w-4 text-atlas" />
        <span className="text-sm text-white">“Enter the consumer-brands vertical.”</span>
      </div>
      <Arrow />
      <div className="mx-auto mb-1 w-fit rounded-xl border border-atlas/40 bg-atlas/10 px-4 py-2 text-center">
        <div className="text-sm font-semibold text-white">Atlas · orchestrator</div>
        <div className="text-[11px] text-slate-400">sequences the three pods</div>
      </div>
      <Arrow />

      <div className="grid gap-3 md:grid-cols-3">
        {PODS.map((pod) => {
          const meta = POD_META[pod];
          const accent = ACCENT[meta.accent];
          const agents = AGENT_ORDER.filter((id) => AGENTS[id].pod === pod);
          return (
            <div key={pod} className={`rounded-xl border ${accent.border} bg-white/[0.02] p-3`}>
              <div className={`mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider ${accent.text}`}>
                <span className={`h-1.5 w-1.5 rounded-full ${accent.dot}`} /> {meta.label}
              </div>
              <div className="space-y-1.5">
                {agents.map((id) => {
                  const Icon = AGENT_ICON[id];
                  return (
                    <div key={id} className="flex items-center gap-2 rounded-lg bg-white/[0.02] px-2.5 py-1.5">
                      <Icon className={`h-3.5 w-3.5 shrink-0 ${accent.text}`} />
                      <span className="text-[12px] text-white">{AGENTS[id].name}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <Arrow />
      <div className="grid gap-2 sm:grid-cols-2">
        <div className="flex items-center gap-2 rounded-lg border border-atlas/25 bg-atlas/[0.05] px-3 py-2.5">
          <Wrench className="h-4 w-4 text-atlas" />
          <span className="text-[12px] text-slate-300">
            Skills: {SKILLS.map((s) => s.name).join(" · ")}
          </span>
        </div>
        <div className="flex items-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.02] px-3 py-2.5">
          <Database className="h-4 w-4 text-slate-400" />
          <span className="text-[12px] text-slate-300">2,000-lead CRM · 44 partners · 6 segments (local)</span>
        </div>
      </div>

      <div className="mt-5 flex items-center gap-2 rounded-lg border border-atlas/20 bg-atlas/[0.05] px-3 py-2.5">
        <FileText className="h-4 w-4 shrink-0 text-atlas" />
        <span className="text-[12px] text-slate-300">
          All three pods read one source of truth, so the segments, partners, and forecast assemble into a single launch plan.
        </span>
      </div>
    </div>
  );
}
