"use client";

import { Area, AreaChart, CartesianGrid, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { LineChart as LineIcon } from "lucide-react";
import type { ForecastResult, ScenarioLabels } from "@/lib/types";
import { usdM } from "@/lib/format";

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload || payload.length === 0) return null;
  const p = payload.reduce((acc: any, x: any) => ({ ...acc, [x.dataKey]: x.value }), {});
  return (
    <div className="rounded-lg border border-white/10 bg-graphite-900/95 px-3 py-2 shadow-panel backdrop-blur">
      <div className="mb-1 font-mono text-[10px] uppercase tracking-wider text-slate-500">Month {label}</div>
      <div className="text-[12px] text-white">
        Expected <span className="font-mono font-semibold text-atlas">{usdM(p.expected)}</span>
      </div>
      <div className="text-[11px] text-slate-400">
        band {usdM(p.low)} – {usdM(p.high)}
      </div>
    </div>
  );
}

export function ForecastChart({ forecast, labels }: { forecast: ForecastResult; labels?: ScenarioLabels }) {
  const qualifiedPlural = labels?.qualifiedPlural ?? "PQLs";
  const thresholdNoun = labels?.thresholdNoun ?? "PQL threshold";
  return (
    <div className="panel p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <LineIcon className="h-4 w-4 text-atlas" />
          <h3 className="font-display text-sm font-semibold text-white">Revenue forecast</h3>
        </div>
        <div className="text-right">
          <div className="font-display text-2xl font-semibold text-atlas">{usdM(forecast.expectedBookings)}</div>
          <div className="font-mono text-[11px] text-slate-500">
            band {usdM(forecast.low)}–{usdM(forecast.high)} · {forecast.pipelineCount} open {qualifiedPlural}
          </div>
        </div>
      </div>

      <div className="mt-3 h-56 w-full overflow-hidden rounded-lg" style={{ background: "#0E121A" }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={forecast.series} margin={{ top: 12, right: 12, bottom: 0, left: -8 }}>
            <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis dataKey="month" tick={{ fill: "#64748b", fontSize: 10 }} tickLine={false} axisLine={{ stroke: "rgba(255,255,255,0.08)" }} tickFormatter={(m) => `M${m}`} />
            <YAxis tick={{ fill: "#64748b", fontSize: 10 }} tickLine={false} axisLine={false} width={46} tickFormatter={(v) => usdM(v)} />
            <Tooltip content={<CustomTooltip />} />
            {/* band: high area (atlas) then low area masked with bg */}
            <Area type="monotone" dataKey="high" stroke="none" fill="#4EA8FF" fillOpacity={0.16} isAnimationActive={false} />
            <Area type="monotone" dataKey="low" stroke="none" fill="#0E121A" fillOpacity={1} isAnimationActive={false} />
            <Line type="monotone" dataKey="expected" stroke="#4EA8FF" strokeWidth={2.5} dot={false} isAnimationActive={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <p className="mt-2 text-[12px] text-slate-500">
        Expected bookings = Σ win-probability × ACV over open {qualifiedPlural}; the band is ±1 SD from win-probability variance. Move the {thresholdNoun}
        {" "}to see the forecast respond.
      </p>
    </div>
  );
}
