import { Handshake } from "lucide-react";
import type { ScoredPartner } from "@/lib/types";
import { compact } from "@/lib/format";

const TIER_CLS: Record<string, string> = {
  A: "border-partner/40 bg-partner/10 text-partner",
  B: "border-white/15 bg-white/[0.04] text-slate-300",
  C: "border-white/10 bg-white/[0.02] text-slate-500",
};

export function PartnerShortlist({ partners }: { partners: ScoredPartner[] }) {
  const tierA = partners.filter((p) => p.tier === "A");
  const max = Math.max(...partners.map((p) => p.fitScore), 1);

  return (
    <div className="panel overflow-hidden">
      <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-3.5">
        <div className="flex items-center gap-2">
          <Handshake className="h-4 w-4 text-partner" />
          <h3 className="font-display text-sm font-semibold text-white">Partner shortlist · tier A</h3>
        </div>
        <span className="font-mono text-[11px] text-slate-500">{tierA.length} of {partners.length} evaluated</span>
      </div>
      <ul className="divide-y divide-white/[0.05]">
        {tierA.map((p) => (
          <li key={p.id} className="px-5 py-3">
            <div className="flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-md bg-partner/15 text-[11px] font-semibold text-partner">{p.rank}</span>
              <span className="text-[13.5px] font-medium text-white">{p.name}</span>
              <span className={`rounded border px-1.5 py-0.5 text-[10px] font-semibold ${TIER_CLS[p.tier]}`}>Tier {p.tier}</span>
              <span className="ml-auto font-mono text-sm font-semibold text-partner">{p.fitScore}</span>
            </div>
            <div className="mt-1.5 flex items-center gap-2 pl-7">
              <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/[0.06]">
                <span className="block h-full rounded-full bg-partner" style={{ width: `${(p.fitScore / max) * 100}%` }} />
              </span>
              <span className="shrink-0 font-mono text-[10px] text-slate-500">{compact(p.reach)} reach</span>
            </div>
            <p className="mt-1 pl-7 text-[12px] text-slate-400">{p.rationale}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
