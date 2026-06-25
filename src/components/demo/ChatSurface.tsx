"use client";

import { useState } from "react";
import { Play, Send, Trash2 } from "lucide-react";

export function ChatSurface({
  onRun,
  onGuided,
  onReset,
  running,
  hasRun,
  suggestions,
  placeholder = "Which vertical should we enter, and what should we build?",
}: {
  onRun: (goal: string) => void;
  onGuided: () => void;
  onReset: () => void;
  running: boolean;
  hasRun: boolean;
  suggestions: string[];
  placeholder?: string;
}) {
  const [value, setValue] = useState("");
  const submit = () => {
    const v = value.trim();
    if (!v || running) return;
    onRun(v);
    setValue("");
  };

  return (
    <div className="panel p-4 sm:p-5">
      <div className="flex flex-col gap-2.5 sm:flex-row">
        <div className="flex flex-1 items-center gap-2 rounded-xl border border-white/10 bg-graphite-950/50 px-3.5 py-1 focus-within:border-atlas/40">
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") submit();
            }}
            disabled={running}
            placeholder={placeholder}
            aria-label="Goal for Atlas"
            className="flex-1 bg-transparent py-2.5 text-[14px] text-white placeholder:text-slate-500 focus:outline-none disabled:opacity-60"
          />
          <button onClick={submit} disabled={running || !value.trim()} aria-label="Send" className="btn-ghost !rounded-lg !px-2.5 !py-2 disabled:opacity-40">
            <Send className="h-4 w-4" />
          </button>
        </div>
        <button onClick={onGuided} disabled={running} className="btn-primary whitespace-nowrap">
          <Play className="h-4 w-4" /> Run guided demo
        </button>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className="font-mono text-[10px] uppercase tracking-wider text-slate-400">Try</span>
        {suggestions.map((s) => (
          <button
            key={s}
            onClick={() => !running && onRun(s)}
            disabled={running}
            className="focusable rounded-full border border-white/15 bg-white/[0.04] px-3 py-1 text-[12px] font-medium text-slate-200 transition-colors hover:border-atlas/40 hover:bg-atlas/[0.08] hover:text-atlas disabled:opacity-40"
          >
            {s.length > 54 ? `${s.slice(0, 54)}…` : s}
          </button>
        ))}
        <button
          onClick={onReset}
          disabled={running || !hasRun}
          aria-label="Reset"
          className="focusable ml-auto rounded-lg border border-white/10 p-2 text-slate-500 transition-colors hover:border-loss/30 hover:text-loss disabled:opacity-40"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
