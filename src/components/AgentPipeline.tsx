import { Compass, ArrowRight } from "lucide-react";
import { AGENTS, AGENT_ORDER, POD_META, type Pod } from "@/agents/types";
import { AGENT_ICON, ACCENT } from "@/components/agentVisuals";

const PODS: Exclude<Pod, "orchestrator">[] = ["gtm", "partnerships", "revops"];

export function AgentPipeline() {
  return (
    <div className="panel p-5 sm:p-6">
      <div className="mb-4 flex items-center justify-center">
        <div className="inline-flex items-center gap-2.5 rounded-xl border border-atlas/40 bg-atlas/10 px-4 py-2.5">
          <Compass className="h-4 w-4 text-atlas" />
          <div className="leading-tight">
            <div className="text-[13px] font-semibold text-white">Atlas</div>
            <div className="text-[10px] uppercase tracking-wider text-slate-500">orchestrator</div>
          </div>
        </div>
      </div>

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

      <div className="mt-4 flex items-center gap-2 border-t border-white/[0.06] pt-4 text-[12px] text-slate-500">
        <ArrowRight className="h-3.5 w-3.5 text-atlas" aria-hidden />
        <span>
          Atlas sequences all three pods over one dataset — so GTM, Partnerships, and RevOps land in a single coherent plan.
        </span>
      </div>
    </div>
  );
}
