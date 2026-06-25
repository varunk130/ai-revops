import Link from "next/link";
import type { ReactNode } from "react";

export function Logo({ className = "", showText = true }: { className?: string; showText?: boolean }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <svg width="24" height="24" viewBox="0 0 28 28" fill="none" aria-hidden="true" className="shrink-0">
        <circle cx="14" cy="14" r="9.5" stroke="#4EA8FF" strokeWidth="2" />
        <circle cx="14" cy="14" r="2.4" fill="#4EA8FF" />
        <path d="M14 4.5v3M14 20.5v3M4.5 14h3M20.5 14h3" stroke="#A78BFA" strokeWidth="2" strokeLinecap="round" />
      </svg>
      {showText && <span className="font-display text-[17px] font-semibold tracking-tight text-white">Atlas</span>}
    </span>
  );
}

export function Eyebrow({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <p className={`eyebrow ${className}`}>{children}</p>;
}

export function Section({ children, className = "", id }: { children: ReactNode; className?: string; id?: string }) {
  return (
    <section id={id} className={`container-px py-16 sm:py-20 ${className}`}>
      {children}
    </section>
  );
}

export function Panel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`panel ${className}`}>{children}</div>;
}

export function Stat({ value, label, tone = "default" }: { value: ReactNode; label: ReactNode; tone?: "default" | "atlas" | "gtm" | "revops" }) {
  const toneClass = tone === "atlas" ? "text-atlas" : tone === "gtm" ? "text-gtm" : tone === "revops" ? "text-revops" : "text-white";
  return (
    <div className="panel-quiet px-4 py-3.5">
      <div className={`font-display text-2xl font-semibold tracking-tight ${toneClass}`}>{value}</div>
      <div className="mt-1 text-xs text-slate-400">{label}</div>
    </div>
  );
}

export function TagPill({ children, accent = "atlas" }: { children: ReactNode; accent?: "atlas" | "gtm" | "partner" | "revops" }) {
  const map = {
    atlas: "border-atlas/30 bg-atlas/10 text-atlas",
    gtm: "border-gtm/30 bg-gtm/10 text-gtm",
    partner: "border-partner/30 bg-partner/10 text-partner",
    revops: "border-revops/30 bg-revops/10 text-revops",
  };
  return <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium ${map[accent]}`}>{children}</span>;
}
