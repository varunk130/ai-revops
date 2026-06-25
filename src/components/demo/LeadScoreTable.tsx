"use client";

import { Gauge } from "lucide-react";
import type { AtlasSnapshot, ForecastResult, ScenarioLabels } from "@/lib/types";
import { num, pct, usd } from "@/lib/format";
import { AnimatedNumber } from "./AnimatedNumber";

const STAGE_CLS: Record<string, string> = {
  won: "text-win",
  sql: "text-atlas",
  pql: "text-revops",
  mql: "text-partner",
  lead: "text-slate-500",
};

const DEFAULT_STAGE_LABELS: Record<string, string> = { lead: "Lead", mql: "MQL", pql: "PQL", sql: "SQL", won: "Won" };

export function LeadScoreTable({
  snapshot,
  threshold,
  setThreshold,
  forecast,
  disabled,
  labels,
}: {
  snapshot: AtlasSnapshot;
  threshold: number;
  setThreshold: (v: number) => void;
  forecast: ForecastResult;
  disabled?: boolean;
  labels?: ScenarioLabels;
}) {
  const rows = snapshot.leadsTop.slice(0, 15);
  const maxBin = Math.max(...snapshot.scoreHistogram.map((b) => b.count), 1);
  const title = labels?.scoreModelTitle ?? "Lead scoring · PQL model";
  const thrLabel = labels?.thresholdLabel ?? "PQL score threshold";
  const qShort = labels?.qualifiedShort ?? "PQL";
  const qPlural = labels?.qualifiedPlural ?? "PQLs";
  const leadNoun = labels?.leadNoun ?? "leads";
  const stageLabels = (labels?.stageLabels ?? DEFAULT_STAGE_LABELS) as Record<string, string>;

  return (
    <div className="panel overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/[0.06] px-5 py-3.5">
        <div className="flex items-center gap-2">
          <Gauge className="h-4 w-4 text-revops" />
          <h3 className="font-display text-sm font-semibold text-white">{title}</h3>
          <span className="rounded-full border border-revops/30 bg-revops/10 px-2 py-0.5 text-[10px] font-medium text-revops">interactive</span>
        </div>
        <span className="font-mono text-[11px] text-slate-500">drag to re-score &amp; re-forecast</span>
      </div>

      <div className="p-5">
        {/* threshold slider */}
        <div className="flex items-center justify-between">
          <span className="text-[12px] text-slate-400">{thrLabel}</span>
          <span className="font-mono text-sm font-semibold text-revops">≥ {threshold}</span>
        </div>
        <input type="range" min={40} max={90} step={1} value={threshold} disabled={disabled} onChange={(e) => setThreshold(Number(e.target.value))} aria-label="PQL score threshold" className="mt-2 w-full disabled:opacity-50" />

        {/* histogram with threshold marker */}
        <div className="relative mt-3 flex h-12 items-end gap-1">
          {snapshot.scoreHistogram.map((b) => {
            const isPql = b.bin + 10 > threshold;
            return <div key={b.bin} className={`flex-1 rounded-sm ${isPql ? "bg-revops/70" : "bg-white/[0.08]"}`} style={{ height: `${(b.count / maxBin) * 100}%` }} title={`${b.bin}-${b.bin + 10}: ${b.count}`} />;
          })}
          <div className="absolute bottom-0 top-0 w-px bg-revops" style={{ left: `${((threshold - 0) / 100) * 100}%` }} />
        </div>
        <div className="mt-1 flex justify-between font-mono text-[9px] text-slate-600">
          <span>score 0</span>
          <span>100</span>
        </div>

        {/* stats */}
        <div className="mt-4 grid grid-cols-3 gap-2">
          <div className="panel-quiet px-3 py-2">
            <div className="text-[10px] uppercase tracking-wider text-slate-500">{qPlural}</div>
            <div className="font-display text-lg font-semibold text-revops">
              <AnimatedNumber value={forecast.pqlCount} />
            </div>
          </div>
          <div className="panel-quiet px-3 py-2">
            <div className="text-[10px] uppercase tracking-wider text-slate-500">Win rate @ cut</div>
            <div className="font-display text-lg font-semibold text-win">{pct(forecast.winRateAtThreshold)}</div>
          </div>
          <div className="panel-quiet px-3 py-2">
            <div className="text-[10px] uppercase tracking-wider text-slate-500">Open {qPlural}</div>
            <div className="font-display text-lg font-semibold text-white">
              <AnimatedNumber value={forecast.pipelineCount} />
            </div>
          </div>
        </div>

        {/* table */}
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[34rem] text-left text-sm">
            <thead>
              <tr className="text-[11px] uppercase tracking-wider text-slate-500">
                <th className="py-2 pr-2 font-medium">Company</th>
                <th className="px-2 py-2 font-medium">Segment</th>
                <th className="px-2 py-2 font-medium">Stage</th>
                <th className="px-2 py-2 text-right font-medium">ACV</th>
                <th className="px-2 py-2 text-right font-medium">Score</th>
                <th className="py-2 pl-2 text-right font-medium">PQL</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((l) => {
                const isPql = l.score >= threshold;
                return (
                  <tr key={l.id} className={`border-t border-white/[0.05] ${isPql ? "bg-revops/[0.05]" : ""}`}>
                    <td className="py-2 pr-2 text-[12.5px] text-white">{l.company}</td>
                    <td className="px-2 py-2 text-[11.5px] text-slate-400">{l.segLabel}</td>
                    <td className={`px-2 py-2 text-[11px] font-medium uppercase ${STAGE_CLS[l.stage]}`}>{stageLabels[l.stage]}</td>
                    <td className="px-2 py-2 text-right font-mono text-[12px] text-slate-300">{usd(l.acv)}</td>
                    <td className="px-2 py-2 text-right font-mono text-[12px] font-semibold text-revops">{l.score}</td>
                    <td className="py-2 pl-2 text-right">{isPql ? <span className="rounded bg-revops/15 px-1.5 py-0.5 text-[10px] font-semibold text-revops">{qShort}</span> : <span className="text-slate-600">—</span>}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-[11px] text-slate-500">Showing the top {rows.length} of {num(snapshot.meta.leadCount)} scored {leadNoun} · {num(forecast.pqlCount)} clear the bar.</p>
      </div>
    </div>
  );
}
