"use client";

import { useMemo, useState } from "react";
import { Handshake } from "lucide-react";
import { pct, usd, usdM } from "@/lib/format";
import { AnimatedNumber } from "./AnimatedNumber";

const BASE_CAC_UNIT = 42_000;

const CHANNELS = {
  field: { label: "Field-led", cac: 1, reach: 1, bar: "bg-atlas", text: "text-atlas" },
  partnerCoSell: { label: "Partner co-sell", cac: 0.55, reach: 1.8, bar: "bg-partner", text: "text-partner" },
  marketplace: { label: "Marketplace", cac: 0.7, reach: 1.3, bar: "bg-revops", text: "text-revops" },
};

export function CoSellMix({ baseBookings }: { baseBookings: number }) {
  const [fieldPct, setFieldPct] = useState(55);
  const [partnerPct, setPartnerPct] = useState(30);

  const metrics = useMemo(() => {
    const field = fieldPct / 100;
    const partnerCoSell = partnerPct / 100;
    const marketplace = Math.max(0, 100 - fieldPct - partnerPct) / 100;
    const blendedCac = BASE_CAC_UNIT * (field * CHANNELS.field.cac + partnerCoSell * CHANNELS.partnerCoSell.cac + marketplace * CHANNELS.marketplace.cac);
    const reachIndex = field * CHANNELS.field.reach + partnerCoSell * CHANNELS.partnerCoSell.reach + marketplace * CHANNELS.marketplace.reach;
    const adjustedBookings = baseBookings * (1 + 0.35 * partnerCoSell + 0.12 * marketplace);

    return { field, partnerCoSell, marketplace, blendedCac, reachIndex, adjustedBookings };
  }, [baseBookings, fieldPct, partnerPct]);

  const setField = (value: number) => {
    const next = Math.min(100, Math.max(0, value));
    setFieldPct(next);
    setPartnerPct((current) => Math.min(current, 100 - next));
  };

  const setPartner = (value: number) => {
    setPartnerPct(Math.min(Math.max(0, value), 100 - fieldPct));
  };

  const channels = [
    { ...CHANNELS.field, value: metrics.field, pct: fieldPct },
    { ...CHANNELS.partnerCoSell, value: metrics.partnerCoSell, pct: partnerPct },
    { ...CHANNELS.marketplace, value: metrics.marketplace, pct: Math.max(0, 100 - fieldPct - partnerPct) },
  ];

  return (
    <div className="panel overflow-hidden">
      <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-3.5">
        <div className="flex items-center gap-2">
          <Handshake className="h-4 w-4 text-partner" />
          <h3 className="font-display text-sm font-semibold text-white">Co-sell mix</h3>
          <span className="rounded-full border border-revops/30 bg-revops/10 px-2 py-0.5 text-[10px] font-medium text-revops">interactive</span>
        </div>
        <span className="font-mono text-[11px] text-slate-500">enterprise motion</span>
      </div>

      <div className="space-y-5 p-5">
        <div>
          <div className="flex items-center justify-between">
            <span className="text-[12px] text-slate-400">Field-led coverage</span>
            <span className="font-mono text-sm font-semibold text-atlas">{pct(metrics.field)}</span>
          </div>
          <input type="range" min={0} max={100} step={1} value={fieldPct} onChange={(e) => setField(Number(e.target.value))} aria-label="Field-led pipeline coverage" className="mt-2 w-full disabled:opacity-50" />
        </div>

        <div>
          <div className="flex items-center justify-between">
            <span className="text-[12px] text-slate-400">Partner co-sell coverage</span>
            <span className="font-mono text-sm font-semibold text-partner">{pct(metrics.partnerCoSell)}</span>
          </div>
          <input type="range" min={0} max={100 - fieldPct} step={1} value={partnerPct} onChange={(e) => setPartner(Number(e.target.value))} aria-label="Partner co-sell pipeline coverage" className="mt-2 w-full disabled:opacity-50" />
        </div>

        <div className="space-y-2.5">
          {channels.map((channel) => (
            <div key={channel.label}>
              <div className="flex items-center justify-between text-[12px]">
                <span className="text-slate-400">{channel.label}</span>
                <span className={`font-mono font-semibold ${channel.text}`}>{pct(channel.value)}</span>
              </div>
              <div className="mt-1 h-2 overflow-hidden rounded-full bg-white/[0.05]">
                <div className={`h-full rounded-full ${channel.bar}`} style={{ width: `${channel.pct}%` }} />
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div className="panel-quiet px-3 py-2">
            <div className="text-[10px] uppercase tracking-wider text-slate-500">Blended CAC / deal</div>
            <div className="font-display text-lg font-semibold text-partner">{usd(metrics.blendedCac)}</div>
          </div>
          <div className="panel-quiet px-3 py-2">
            <div className="text-[10px] uppercase tracking-wider text-slate-500">Reach index</div>
            <div className="font-display text-lg font-semibold text-white">{metrics.reachIndex.toFixed(1)}x</div>
          </div>
          <div className="panel-quiet px-3 py-2">
            <div className="text-[10px] uppercase tracking-wider text-slate-500">Adjusted bookings</div>
            <div className="font-display text-lg font-semibold text-win">
              <AnimatedNumber value={metrics.adjustedBookings} format={usdM} />
            </div>
          </div>
        </div>

        <p className="text-[11px] text-slate-500">Bookings lift applies partner and marketplace win-rate advantages to the field-led baseline while CAC and reach blend by channel mix.</p>
      </div>
    </div>
  );
}
