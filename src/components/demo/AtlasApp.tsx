"use client";

import { Loader2 } from "lucide-react";
import type { AtlasSnapshot, ScenarioId } from "@/lib/types";
import { SCENARIOS } from "@/lib/scenarios";
import { useAtlas } from "./useAtlas";
import { ChatSurface } from "./ChatSurface";
import { GuidedCaption } from "./GuidedCaption";
import { AgentTrace } from "./AgentTrace";
import { Conversation } from "./Conversation";
import { PlanSummary } from "./PlanSummary";
import { PodTabs } from "./PodTabs";
import { SegmentsView } from "./SegmentsView";
import { MotionView } from "./MotionView";
import { PartnerShortlist } from "./PartnerShortlist";
import { OutreachView } from "./OutreachView";
import { FunnelModel } from "./FunnelModel";
import { LeadScoreTable } from "./LeadScoreTable";
import { ForecastChart } from "./ForecastChart";
import { AttributionView } from "./AttributionView";
import { CoSellMix } from "./CoSellMix";
import { PipelineCoverage } from "./PipelineCoverage";
import { ExecBrief } from "./ExecBrief";

function Pending({ label }: { label: string }) {
  return (
    <div className="panel flex items-center gap-3 p-6 text-sm text-slate-400">
      <Loader2 className="h-4 w-4 animate-spin text-atlas" />
      {label}
    </div>
  );
}

function ScenarioToggle({ active, onSelect, disabled }: { active: ScenarioId; onSelect: (id: ScenarioId) => void; disabled: boolean }) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row">
      {SCENARIOS.map((s) => {
        const isActive = s.id === active;
        return (
          <button
            key={s.id}
            onClick={() => onSelect(s.id)}
            disabled={disabled}
            aria-pressed={isActive}
            className={`focusable flex-1 rounded-xl border px-4 py-2.5 text-left transition-colors ${isActive ? "border-atlas/50 bg-atlas/[0.08]" : "border-white/10 bg-white/[0.02] hover:border-white/20"} disabled:cursor-not-allowed disabled:opacity-50`}
          >
            <div className="flex items-center gap-2">
              <span className={`h-1.5 w-1.5 rounded-full ${isActive ? "bg-atlas" : "bg-slate-600"}`} />
              <span className={`text-[13px] font-semibold ${isActive ? "text-white" : "text-slate-300"}`}>{s.label}</span>
            </div>
            <div className="mt-0.5 pl-3.5 text-[11px] text-slate-500">{s.company} · {s.tagline}</div>
          </button>
        );
      })}
    </div>
  );
}

export function AtlasApp({ snapshots }: { snapshots: Record<ScenarioId, AtlasSnapshot> }) {
  const a = useAtlas(snapshots);
  const isEnt = a.scenarioId === "enterprise";
  const labels = isEnt ? a.content.labels : undefined;
  const f = a.forecastResult;

  return (
    <div className="space-y-4">
      <ScenarioToggle active={a.scenarioId} onSelect={a.setScenario} disabled={a.running} />
      <ChatSurface
        onRun={a.runGoal}
        onGuided={a.runGuided}
        onReset={a.reset}
        running={a.running}
        hasRun={a.hasRun}
        suggestions={a.content.narration.suggestions}
        placeholder={isEnt ? "Which financial-services segment should we enter, and how?" : "Which vertical should we enter, and what should we build?"}
      />
      <GuidedCaption caption={a.caption} />

      <div className="grid gap-4 lg:grid-cols-12">
        <div className="space-y-4 lg:col-span-5">
          <Conversation messages={a.messages} running={a.running} />
          {a.plan.planSummary && <PlanSummary summary={a.plan.planSummary} />}
        </div>
        <div className="lg:col-span-7">
          <div className="h-[62vh] lg:sticky lg:top-20 lg:h-[calc(100vh-6rem)]">
            <AgentTrace events={a.events} activeAgent={a.activeAgent} running={a.running} />
          </div>
        </div>
      </div>

      {a.phase === "done" && (
        <div className="animate-fade-up space-y-4 pt-2">
          {isEnt && a.plan.execBrief && <ExecBrief brief={a.plan.execBrief} />}

          <PodTabs active={a.activePod} setActive={a.setActivePod} started={a.startedPods} completed={a.completedPods} />

          {a.activePod === "gtm" && (
            <div className="grid gap-4 lg:grid-cols-2">
              <SegmentsView segments={a.snapshot.segments} labels={labels} />
              {a.plan.motion ? <MotionView motion={a.plan.motion} /> : <Pending label="Run the demo to design the motion." />}
            </div>
          )}

          {a.activePod === "partnerships" && (
            <div className="space-y-4">
              <div className="grid gap-4 lg:grid-cols-2">
                <PartnerShortlist partners={a.snapshot.partners} />
                {a.plan.outreach && a.plan.onePager ? <OutreachView outreach={a.plan.outreach} onePager={a.plan.onePager} /> : <Pending label="Run the demo to draft the outreach." />}
              </div>
              {isEnt && <CoSellMix baseBookings={f.expectedBookings} />}
            </div>
          )}

          {a.activePod === "revops" && (
            <div className="space-y-4">
              <div className="grid gap-4 lg:grid-cols-2">
                <FunnelModel funnel={a.snapshot.funnel} labels={labels} />
                <ForecastChart forecast={f} labels={labels} />
              </div>
              <LeadScoreTable snapshot={a.snapshot} threshold={a.threshold} setThreshold={a.setThreshold} forecast={f} disabled={a.running} labels={labels} />
              {isEnt && <PipelineCoverage pipelineValue={f.pipelineValue} expectedBookings={f.expectedBookings} winRate={f.pipelineValue > 0 ? Math.min(0.95, f.expectedBookings / f.pipelineValue) : f.winRateAtThreshold} />}
              {a.plan.attribution ? <AttributionView attribution={a.plan.attribution} /> : <Pending label="Run the demo to recommend the attribution model and stack." />}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
