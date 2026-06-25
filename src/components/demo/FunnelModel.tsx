import { Filter } from "lucide-react";
import type { FunnelModel as FunnelModelType, ScenarioLabels } from "@/lib/types";
import { num, pct, usd } from "@/lib/format";

export function FunnelModel({ funnel, labels }: { funnel: FunnelModelType; labels?: ScenarioLabels }) {
  const max = funnel.stages[0].reached || 1;
  const wonRateLabel = `${labels?.stageLabels.lead ?? "Lead"}→${labels?.stageLabels.won ?? "Won"}`;

  return (
    <div className="panel overflow-hidden">
      <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-3.5">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-revops" />
          <h3 className="font-display text-sm font-semibold text-white">Funnel model</h3>
        </div>
        <span className="font-mono text-[11px] text-slate-500">conversions &amp; velocity from CRM</span>
      </div>

      <div className="space-y-2.5 p-5">
        {funnel.stages.map((s, i) => (
          <div key={s.stage}>
            <div className="flex items-center justify-between text-[12px]">
              <span className="font-medium text-white">{s.label}</span>
              <span className="font-mono text-slate-400">
                {num(s.reached)}
                {i > 0 && <span className="ml-2 text-revops">{pct(s.convFromPrev)} ↘</span>}
                {s.velocityDays > 0 && <span className="ml-2 text-slate-600">{s.velocityDays}d</span>}
              </span>
            </div>
            <div className="mt-1 h-3 overflow-hidden rounded-md bg-white/[0.05]">
              <div className="h-full rounded-md bg-gradient-to-r from-revops/80 to-revops/40" style={{ width: `${(s.reached / max) * 100}%` }} />
            </div>
          </div>
        ))}

        <div className="mt-4 grid grid-cols-2 gap-2 border-t border-white/[0.06] pt-4 sm:grid-cols-4">
          {[
            { label: wonRateLabel, value: pct(funnel.wonRate, 1), tone: "text-revops" },
            { label: "Avg won ACV", value: usd(funnel.avgAcv), tone: "text-white" },
            { label: "Open", value: num(funnel.openCount), tone: "text-white" },
            { label: "Lost", value: num(funnel.lostCount), tone: "text-slate-400" },
          ].map((m) => (
            <div key={m.label} className="rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2">
              <div className="text-[10px] uppercase tracking-wider text-slate-500">{m.label}</div>
              <div className={`mt-0.5 font-mono text-sm font-semibold ${m.tone}`}>{m.value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
