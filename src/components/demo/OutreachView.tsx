"use client";

import { useState } from "react";
import { ChevronDown, Send, FileText } from "lucide-react";
import { MarkdownLite } from "./MarkdownLite";
import type { OnePager, OutreachEmail } from "@/lib/types";

export function OutreachView({ outreach, onePager }: { outreach: OutreachEmail[]; onePager: OnePager }) {
  const [open, setOpen] = useState<number | null>(1);

  return (
    <div className="panel overflow-hidden">
      <div className="flex items-center gap-2 border-b border-white/[0.06] px-5 py-3.5">
        <Send className="h-4 w-4 text-partner" />
        <h3 className="font-display text-sm font-semibold text-white">Partner outreach &amp; one-pager</h3>
      </div>

      <div className="p-5">
        <div className="mb-1 text-[10px] uppercase tracking-wider text-slate-500">Outreach sequence</div>
        <ol className="mb-5">
          {outreach.map((em, i) => {
            const isOpen = open === em.step;
            return (
              <li key={em.step} className="relative flex gap-3.5 pb-2.5 last:pb-0">
                <div className="flex flex-col items-center">
                  <span className="z-10 flex h-7 w-7 items-center justify-center rounded-full border border-partner/40 bg-partner/10 font-mono text-[11px] font-semibold text-partner">{em.step}</span>
                  {i < outreach.length - 1 && <span className="mt-1 w-px flex-1 bg-white/[0.08]" />}
                </div>
                <div className="min-w-0 flex-1">
                  <button onClick={() => setOpen(isOpen ? null : em.step)} className="focusable w-full rounded-lg text-left" aria-expanded={isOpen}>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] uppercase tracking-wider text-slate-500">{em.trigger}</span>
                      <ChevronDown className={`h-4 w-4 shrink-0 text-slate-500 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                    </div>
                    <div className="mt-0.5 text-[13.5px] font-semibold text-white">{em.subject}</div>
                  </button>
                  {isOpen && (
                    <div className="mt-2 rounded-lg border border-white/[0.06] bg-graphite-950/40 p-3.5">
                      <MarkdownLite text={em.body} />
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ol>

        <div className="rounded-xl border border-white/[0.07] bg-graphite-700/40 p-4">
          <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-slate-500">
            <FileText className="h-3 w-3 text-partner" /> Joint-GTM one-pager
          </div>
          <div className="mt-1 font-display text-[15px] font-semibold text-white">{onePager.title}</div>
          <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
            {onePager.sections.map((s) => (
              <div key={s.heading} className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3">
                <div className="text-[12px] font-semibold text-partner">{s.heading}</div>
                <p className="mt-1 text-[12px] leading-relaxed text-slate-400">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
