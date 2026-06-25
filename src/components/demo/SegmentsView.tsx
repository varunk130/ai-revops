import { Target } from "lucide-react";
import type { ScenarioLabels, ScoredSegment } from "@/lib/types";
import { num, pct } from "@/lib/format";

export function SegmentsView({ segments, labels }: { segments: ScoredSegment[]; labels?: ScenarioLabels }) {
  const max = Math.max(...segments.map((s) => s.score), 1);
  const title = labels?.segmentsTitle ?? "ICP sub-segments · prioritized";
  const leadNoun = labels?.leadNoun ?? "leads";
  return (
    <div className="panel overflow-hidden">
      <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-3.5">
        <div className="flex items-center gap-2">
          <Target className="h-4 w-4 text-gtm" />
          <h3 className="font-display text-sm font-semibold text-white">{title}</h3>
        </div>
        <span className="font-mono text-[11px] text-slate-500">market × fit × accessibility</span>
      </div>
      <ul className="divide-y divide-white/[0.05]">
        {segments.map((s) => {
          const top = s.rank <= 2;
          return (
            <li key={s.key} className="px-5 py-3.5">
              <div className="flex items-center gap-2">
                <span className={`flex h-5 w-5 items-center justify-center rounded-md text-[11px] font-semibold ${top ? "bg-gtm/15 text-gtm" : "bg-white/[0.04] text-slate-400"}`}>{s.rank}</span>
                <span className="text-[14px] font-medium text-white">{s.label}</span>
                <span className="ml-auto font-mono text-sm font-semibold text-gtm">{s.score}</span>
              </div>
              <p className="mt-1 pl-7 text-[12px] text-slate-400">{s.blurb}</p>
              <div className="mt-2 flex items-center gap-2 pl-7">
                <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/[0.06]">
                  <span className={`block h-full rounded-full ${top ? "bg-gtm" : "bg-slate-600"}`} style={{ width: `${(s.score / max) * 100}%` }} />
                </span>
              </div>
              <div className="mt-2 flex flex-wrap gap-1.5 pl-7 font-mono text-[10px] text-slate-400">
                <span className="rounded border border-white/10 bg-white/[0.03] px-1.5 py-0.5">market {num(s.marketSize)}</span>
                <span className="rounded border border-white/10 bg-white/[0.03] px-1.5 py-0.5">fit {pct(s.fit)}</span>
                <span className="rounded border border-white/10 bg-white/[0.03] px-1.5 py-0.5">access {pct(s.accessibility)}</span>
                <span className="rounded border border-white/10 bg-white/[0.03] px-1.5 py-0.5">{s.leadCount} {leadNoun} · {s.wonCount} won</span>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
