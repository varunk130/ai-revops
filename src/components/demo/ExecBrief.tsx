"use client";

import { FileText } from "lucide-react";
import type { ExecBrief } from "@/lib/types";

export function ExecBrief({ brief }: { brief: ExecBrief }) {
  return (
    <div className="panel overflow-hidden">
      <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-3.5">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-atlas" />
          <h3 className="font-display text-sm font-semibold text-white">Executive brief</h3>
        </div>
        <span className="font-mono text-[11px] text-slate-500">1-page</span>
      </div>

      <div className="space-y-5 p-5 sm:p-6">
        <div>
          <div className="text-[11px] uppercase tracking-wider text-slate-500">To: {brief.to}</div>
          <h4 className="mt-1 font-display text-lg font-semibold text-white sm:text-xl">{brief.subject}</h4>
        </div>

        <section>
          <div className="mb-1 text-[10px] uppercase tracking-wider text-slate-500">Situation</div>
          <p className="text-[13.5px] leading-relaxed text-slate-300">{brief.thesis}</p>
        </section>

        <section className="rounded-xl border border-atlas/25 bg-atlas/[0.06] p-4">
          <div className="text-[10px] uppercase tracking-wider text-atlas">Recommendation</div>
          <p className="mt-1 text-[13.5px] leading-relaxed text-slate-200">{brief.recommendation}</p>
        </section>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {brief.metrics.map((metric) => (
            <div key={metric.label} className="panel-quiet px-3 py-2">
              <div className="font-display text-xl font-semibold text-white">{metric.value}</div>
              <div className="text-[11px] text-slate-400">{metric.label}</div>
              {metric.sub && <div className="mt-0.5 text-[10px] text-slate-500">{metric.sub}</div>}
            </div>
          ))}
        </div>

        <section>
          <div className="mb-3 text-[10px] uppercase tracking-wider text-slate-500">Strategic bets</div>
          <ol className="space-y-3">
            {brief.bets.map((bet, index) => (
              <li key={bet.title} className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-atlas/30 bg-atlas/10 font-mono text-[11px] text-atlas">{index + 1}</span>
                <div>
                  <div className="text-[13px] font-semibold text-white">{bet.title}</div>
                  <p className="mt-0.5 text-[12px] leading-relaxed text-slate-400">{bet.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <div className="grid gap-4 sm:grid-cols-2">
          <section className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
            <div className="mb-3 text-[10px] uppercase tracking-wider text-slate-500">Risks &amp; mitigations</div>
            <div className="space-y-3">
              {brief.risks.map((item) => (
                <div key={item.risk} className="text-[12px] leading-relaxed">
                  <span className="font-medium text-white">{item.risk}</span>
                  <span className="text-slate-400"> → {item.mitigation}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
            <div className="mb-3 text-[10px] uppercase tracking-wider text-slate-500">The ask</div>
            <div className="space-y-2.5">
              {brief.asks.map((ask) => (
                <div key={ask.label} className="flex items-center justify-between gap-3 border-b border-white/[0.05] pb-2 last:border-b-0 last:pb-0">
                  <span className="text-[12px] text-slate-400">{ask.label}</span>
                  <span className="text-right font-mono text-[12px] font-semibold text-atlas">{ask.value}</span>
                </div>
              ))}
            </div>
          </section>
        </div>

        <section>
          <div className="mb-3 text-[10px] uppercase tracking-wider text-slate-500">30 / 60 / 90</div>
          <div className="space-y-2.5">
            {brief.timeline.map((item) => (
              <div key={item.phase} className="rounded-lg border border-white/[0.06] bg-graphite-950/30 px-3 py-2.5">
                <div className="font-mono text-[11px] text-atlas">{item.phase}</div>
                <div className="mt-1 text-[12px] leading-relaxed text-slate-300">{item.detail}</div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
