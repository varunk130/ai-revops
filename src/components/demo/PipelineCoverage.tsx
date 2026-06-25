"use client";

import { useMemo, useState } from "react";
import { Gauge } from "lucide-react";
import { usdM } from "@/lib/format";

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export function PipelineCoverage({ pipelineValue, expectedBookings, winRate }: { pipelineValue: number; expectedBookings: number; winRate: number }) {
  const minTarget = Math.max(1, Math.round(expectedBookings * 0.5));
  const maxTarget = Math.max(minTarget + 1, Math.round(expectedBookings * 2.5));
  const step = Math.max(1_000, Math.round(maxTarget / 40 / 1_000) * 1_000);
  const defaultTarget = clamp(Math.round(expectedBookings * 0.9), minTarget, maxTarget);
  const [target, setTarget] = useState(defaultTarget);

  const metrics = useMemo(() => {
    const requiredPipeline = target / Math.max(0.05, winRate);
    const coverageRatio = pipelineValue / requiredPipeline;
    const gap = Math.max(0, requiredPipeline - pipelineValue);
    const fillWidth = clamp((coverageRatio / 3) * 100, 0, 100);

    return { requiredPipeline, coverageRatio, gap, fillWidth };
  }, [pipelineValue, target, winRate]);

  const tone = metrics.coverageRatio < 1 ? { fill: "bg-loss", text: "text-loss" } : metrics.coverageRatio < 1.5 ? { fill: "bg-partner", text: "text-partner" } : { fill: "bg-win", text: "text-win" };
  const verdict = metrics.coverageRatio < 1 ? "Under-covered — build more pipeline or tighten the target." : metrics.coverageRatio < 1.5 ? "Adequate coverage for the target." : "Comfortable coverage — room to raise the target.";

  return (
    <div className="panel overflow-hidden">
      <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-3.5">
        <div className="flex items-center gap-2">
          <Gauge className="h-4 w-4 text-atlas" />
          <h3 className="font-display text-sm font-semibold text-white">Pipeline coverage</h3>
          <span className="rounded-full border border-revops/30 bg-revops/10 px-2 py-0.5 text-[10px] font-medium text-revops">interactive</span>
        </div>
        <span className="font-mono text-[11px] text-slate-500">target planner</span>
      </div>

      <div className="space-y-5 p-5">
        <div>
          <div className="flex items-center justify-between">
            <span className="text-[12px] text-slate-400">Bookings target</span>
            <span className="font-mono text-sm font-semibold text-atlas">{usdM(target)}</span>
          </div>
          <input type="range" min={minTarget} max={maxTarget} step={step} value={target} onChange={(e) => setTarget(Number(e.target.value))} aria-label="Bookings target" className="mt-2 w-full disabled:opacity-50" />
        </div>

        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
          <div className="flex items-end justify-between gap-3">
            <div>
              <div className="text-[10px] uppercase tracking-wider text-slate-500">Coverage ratio</div>
              <div className={`font-display text-2xl font-semibold ${tone.text}`}>{metrics.coverageRatio.toFixed(1)}x</div>
            </div>
            <div className="font-mono text-[10px] text-slate-500">1.0x covered</div>
          </div>
          <div className="relative mt-3 h-4 overflow-hidden rounded-full bg-white/[0.06]">
            <div className={`h-full rounded-full ${tone.fill}`} style={{ width: `${metrics.fillWidth}%` }} />
            <div className="absolute bottom-0 top-0 w-px bg-white/70" style={{ left: "33.333%" }} />
          </div>
          <div className="mt-1 flex justify-between font-mono text-[9px] text-slate-600">
            <span>0x</span>
            <span>3x</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div className="panel-quiet px-3 py-2">
            <div className="text-[10px] uppercase tracking-wider text-slate-500">Required pipeline</div>
            <div className="font-display text-lg font-semibold text-atlas">{usdM(metrics.requiredPipeline)}</div>
          </div>
          <div className="panel-quiet px-3 py-2">
            <div className="text-[10px] uppercase tracking-wider text-slate-500">Current pipeline</div>
            <div className="font-display text-lg font-semibold text-white">{usdM(pipelineValue)}</div>
          </div>
          <div className="panel-quiet px-3 py-2">
            <div className="text-[10px] uppercase tracking-wider text-slate-500">Gap</div>
            <div className={`font-display text-lg font-semibold ${metrics.gap > 0 ? "text-loss" : "text-win"}`}>{metrics.gap > 0 ? usdM(metrics.gap) : "—"}</div>
          </div>
        </div>

        <p className={`text-[11px] ${tone.text}`}>{verdict}</p>
      </div>
    </div>
  );
}
