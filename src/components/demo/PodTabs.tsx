"use client";

import { Target, Handshake, LineChart, Check } from "lucide-react";
import type { RealPod } from "./useAtlas";

const TABS: { pod: RealPod; label: string; Icon: typeof Target; cls: string; active: string }[] = [
  { pod: "gtm", label: "GTM", Icon: Target, cls: "text-gtm", active: "border-gtm/50 bg-gtm/10 text-gtm" },
  { pod: "partnerships", label: "Partnerships", Icon: Handshake, cls: "text-partner", active: "border-partner/50 bg-partner/10 text-partner" },
  { pod: "revops", label: "RevOps", Icon: LineChart, cls: "text-revops", active: "border-revops/50 bg-revops/10 text-revops" },
];

export function PodTabs({
  active,
  setActive,
  started,
  completed,
}: {
  active: RealPod;
  setActive: (p: RealPod) => void;
  started: Set<RealPod>;
  completed: Set<RealPod>;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {TABS.map((t) => {
        const isActive = active === t.pod;
        const isStarted = started.has(t.pod);
        const isDone = completed.has(t.pod);
        return (
          <button
            key={t.pod}
            onClick={() => setActive(t.pod)}
            className={`focusable inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-colors ${isActive ? t.active : "border-white/10 bg-white/[0.02] text-slate-400 hover:text-white"}`}
          >
            <t.Icon className={`h-4 w-4 ${isActive ? "" : t.cls}`} />
            {t.label}
            {isDone ? (
              <Check className="h-3.5 w-3.5 text-win" />
            ) : isStarted ? (
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-current" />
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
