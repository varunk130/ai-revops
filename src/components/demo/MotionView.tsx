import { Route, Tag } from "lucide-react";
import type { Motion } from "@/lib/types";

export function MotionView({ motion }: { motion: Motion }) {
  return (
    <div className="panel overflow-hidden">
      <div className="flex items-center gap-2 border-b border-white/[0.06] px-5 py-3.5">
        <Route className="h-4 w-4 text-gtm" />
        <h3 className="font-display text-sm font-semibold text-white">Channels, motion &amp; pricing</h3>
      </div>

      <div className="space-y-4 p-5">
        <div className="rounded-xl border border-gtm/25 bg-gtm/[0.06] p-4">
          <div className="text-[10px] uppercase tracking-wider text-gtm">Sales motion</div>
          <div className="mt-0.5 font-display text-lg font-semibold text-white">{motion.salesMotion}</div>
          <p className="mt-1 text-[13px] leading-relaxed text-slate-300">{motion.salesMotionDetail}</p>
        </div>

        <div>
          <div className="mb-2 text-[10px] uppercase tracking-wider text-slate-500">Channels</div>
          <div className="space-y-2">
            {motion.channels.map((c) => (
              <div key={c.name} className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3">
                <div className="text-[13px] font-medium text-white">{c.name}</div>
                <div className="mt-0.5 text-[12px] text-slate-400">{c.rationale}</div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="mb-2 text-[10px] uppercase tracking-wider text-slate-500">Pricing &amp; packaging</div>
          <div className="grid gap-2.5 sm:grid-cols-3">
            {motion.pricing.map((p) => (
              <div key={p.name} className="rounded-lg border border-white/[0.07] bg-graphite-700/40 p-3">
                <div className="flex items-center gap-1.5 text-[13px] font-semibold text-white">
                  <Tag className="h-3 w-3 text-gtm" /> {p.name}
                </div>
                <div className="mt-1 font-mono text-sm text-gtm">{p.price}</div>
                <div className="mt-1 text-[11.5px] leading-relaxed text-slate-400">{p.forWho}</div>
              </div>
            ))}
          </div>
          <p className="mt-3 text-[12.5px] leading-relaxed text-slate-400">{motion.pricingThesis}</p>
        </div>
      </div>
    </div>
  );
}
