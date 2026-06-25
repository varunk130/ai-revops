import { Compass, Target, Route, Handshake, Send, Filter, Gauge, LineChart, Layers, type LucideIcon } from "lucide-react";
import type { AgentId, Accent } from "@/agents/types";

export const AGENT_ICON: Record<AgentId, LucideIcon> = {
  atlas: Compass,
  segmenter: Target,
  "motion-designer": Route,
  "partner-scout": Handshake,
  "outreach-writer": Send,
  "funnel-engineer": Filter,
  "lead-scorer": Gauge,
  forecaster: LineChart,
  "attribution-analyst": Layers,
};

export interface AccentClasses {
  text: string;
  bg: string;
  border: string;
  dot: string;
  hex: string;
}

export const ACCENT: Record<Accent, AccentClasses> = {
  atlas: { text: "text-atlas", bg: "bg-atlas/10", border: "border-atlas/40", dot: "bg-atlas", hex: "#4EA8FF" },
  gtm: { text: "text-gtm", bg: "bg-gtm/10", border: "border-gtm/40", dot: "bg-gtm", hex: "#34D399" },
  partner: { text: "text-partner", bg: "bg-partner/10", border: "border-partner/40", dot: "bg-partner", hex: "#FBBF24" },
  revops: { text: "text-revops", bg: "bg-revops/10", border: "border-revops/40", dot: "bg-revops", hex: "#A78BFA" },
};

export const CHIP_TONE: Record<string, string> = {
  default: "border-white/10 bg-white/[0.03] text-slate-300",
  good: "border-win/30 bg-win/10 text-win",
  bad: "border-loss/30 bg-loss/10 text-loss",
  accent: "border-atlas/30 bg-atlas/10 text-atlas",
};
