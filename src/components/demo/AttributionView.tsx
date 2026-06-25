import { Layers, Hammer, ShoppingCart } from "lucide-react";
import type { AttributionRec } from "@/lib/types";

export function AttributionView({ attribution }: { attribution: AttributionRec }) {
  return (
    <div className="panel overflow-hidden">
      <div className="flex items-center gap-2 border-b border-white/[0.06] px-5 py-3.5">
        <Layers className="h-4 w-4 text-revops" />
        <h3 className="font-display text-sm font-semibold text-white">Attribution &amp; RevOps stack</h3>
      </div>

      <div className="space-y-4 p-5">
        <div className="rounded-xl border border-revops/25 bg-revops/[0.06] p-4">
          <div className="text-[10px] uppercase tracking-wider text-revops">Attribution model</div>
          <div className="mt-0.5 font-display text-[15px] font-semibold text-white">{attribution.model}</div>
          <p className="mt-1 text-[12.5px] leading-relaxed text-slate-300">{attribution.modelRationale}</p>
        </div>

        <div>
          <div className="mb-2 text-[10px] uppercase tracking-wider text-slate-500">Recommended stack · build vs buy</div>
          <div className="space-y-2">
            {attribution.stack.map((s) => {
              const isBuild = s.buildVsBuy === "build";
              return (
                <div key={s.layer} className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[13px] font-medium text-white">{s.layer}</span>
                    <span className={`inline-flex items-center gap-1 rounded border px-1.5 py-0.5 text-[10px] font-semibold uppercase ${isBuild ? "border-revops/40 bg-revops/10 text-revops" : "border-atlas/40 bg-atlas/10 text-atlas"}`}>
                      {isBuild ? <Hammer className="h-2.5 w-2.5" /> : <ShoppingCart className="h-2.5 w-2.5" />}
                      {s.buildVsBuy}
                    </span>
                  </div>
                  <div className="mt-0.5 font-mono text-[11.5px] text-slate-400">{s.tool}</div>
                  <p className="mt-1 text-[12px] leading-relaxed text-slate-400">{s.why}</p>
                </div>
              );
            })}
          </div>
        </div>

        <p className="border-t border-white/[0.06] pt-3 text-[13px] leading-relaxed text-slate-300">{attribution.summary}</p>
      </div>
    </div>
  );
}
