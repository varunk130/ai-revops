"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { runAtlas } from "@/agents/orchestrator";
import { forecast } from "@/lib/forecast";
import { num, usdM } from "@/lib/format";
import type { AgentId, Pod, PlanResult, ScenarioContent, TraceEvent } from "@/agents/types";
import type { AtlasSnapshot, ScenarioId } from "@/lib/types";
import { SCENARIO_CONTENT } from "@content/index";

export interface ChatMessage {
  role: "user" | "assistant";
  text: string;
}

export type RealPod = "gtm" | "partnerships" | "revops";

export function useAtlas(snapshots: Record<ScenarioId, AtlasSnapshot>) {
  const reduced = useReducedMotion();
  const [scenarioId, setScenarioId] = useState<ScenarioId>("consumer");
  const snapshot = snapshots[scenarioId];
  const content = SCENARIO_CONTENT[scenarioId];

  const [threshold, setThreshold] = useState(snapshots.consumer.meta.defaultThreshold);
  const [events, setEvents] = useState<TraceEvent[]>([]);
  const [plan, setPlan] = useState<Partial<PlanResult>>({});
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [caption, setCaption] = useState<string | null>(null);
  const [activeAgent, setActiveAgent] = useState<AgentId | null>(null);
  const [activePod, setActivePod] = useState<RealPod>("gtm");
  const [phase, setPhase] = useState<"idle" | "running" | "done">("idle");

  const guidedRef = useRef(false);
  const idRef = useRef(0);
  const reducedRef = useRef(false);
  const lastPodRef = useRef<Pod | null>(null);
  const snapshotRef = useRef<AtlasSnapshot>(snapshot);
  const contentRef = useRef<ScenarioContent>(content);
  snapshotRef.current = snapshot;
  contentRef.current = content;
  reducedRef.current = !!reduced;

  const forecastResult = useMemo(() => forecast(snapshot.leadsScored, threshold), [snapshot, threshold]);

  const completedPods = useMemo(() => {
    const last: Record<RealPod, AgentId> = { gtm: "motion-designer", partnerships: "outreach-writer", revops: "attribution-analyst" };
    const set = new Set<RealPod>();
    (Object.keys(last) as RealPod[]).forEach((pod) => {
      if (events.some((e) => e.agent === last[pod] && e.status === "done")) set.add(pod);
    });
    return set;
  }, [events]);

  const startedPods = useMemo(() => {
    const set = new Set<RealPod>();
    events.forEach((e) => {
      if (e.pod === "gtm" || e.pod === "partnerships" || e.pod === "revops") set.add(e.pod);
    });
    return set;
  }, [events]);

  const sleep = (ms: number) => new Promise<void>((res) => setTimeout(res, reducedRef.current ? 0 : ms));
  const wait = useCallback((ms: number) => sleep(ms), []);

  const handleEmit = useCallback((e: Omit<TraceEvent, "id" | "ts">) => {
    const ev: TraceEvent = { ...e, id: `ev-${idRef.current++}`, ts: Date.now() };
    setEvents((prev) => [...prev, ev]);
    if (e.status !== "done") setActiveAgent(e.agent);
    const sc = contentRef.current;
    // follow the live pod in the tabs + caption per pod
    if (e.pod !== "orchestrator" && e.pod !== lastPodRef.current) {
      lastPodRef.current = e.pod;
      setActivePod(e.pod as RealPod);
      if (guidedRef.current && sc.narration.podIntros[e.pod]) setCaption(sc.narration.podIntros[e.pod]);
    } else if (guidedRef.current && e.status === "thinking" && sc.narration.agent[e.agent]) {
      setCaption(sc.narration.agent[e.agent]);
    }
  }, []);

  const run = useCallback(
    async (goal: string, guided: boolean) => {
      guidedRef.current = guided;
      lastPodRef.current = null;
      const sc = contentRef.current;
      const snap = snapshotRef.current;
      const L = sc.labels;
      setPhase("running");
      setMessages((m) => [...m, { role: "user", text: goal }]);
      if (guided) {
        setCaption(sc.narration.agent.atlas);
        await sleep(1100);
      }
      try {
        const full = await runAtlas({ goal, snapshot: snap, content: sc, emit: handleEmit, wait, onArtifact: (p) => setPlan((prev) => ({ ...prev, ...p })) });
        setPlan(full);
        const f = full.forecast;
        const tierA = snap.partners.filter((p) => p.tier === "A").length;
        setMessages((m) => [
          ...m,
          {
            role: "assistant",
            text: `Launch plan ready for ${full.vertical}. Lead segment ${snap.segments[0].label}; ${tierA} tier-A partners; ${num(f.pqlCount)} ${L.qualifiedPlural} → ${usdM(f.expectedBookings)} forecast bookings. Drag the ${L.thresholdNoun} to re-score and re-forecast.`,
          },
        ]);
        if (guided) setCaption(sc.narration.closing);
        setPhase("done");
        return full;
      } catch {
        setMessages((m) => [...m, { role: "assistant", text: "Something interrupted the run — try again." }]);
        setPhase("idle");
        return null;
      } finally {
        setActiveAgent(null);
      }
    },
    [handleEmit, wait],
  );

  const running = phase === "running";

  const runGoal = useCallback(
    async (goal: string) => {
      if (running) return;
      await run(goal, false);
    },
    [run, running],
  );

  const reset = useCallback(() => {
    if (running) return;
    setEvents([]);
    setPlan({});
    setMessages([]);
    setCaption(null);
    setActiveAgent(null);
    setActivePod("gtm");
    setPhase("idle");
    lastPodRef.current = null;
  }, [running]);

  const runGuided = useCallback(async () => {
    if (running) return;
    setEvents([]);
    setPlan({});
    setMessages([]);
    setThreshold(snapshotRef.current.meta.defaultThreshold);
    lastPodRef.current = null;
    await sleep(60);
    await run(contentRef.current.narration.guidedPrompt, true);
  }, [run, running]);

  const setScenario = useCallback(
    (id: ScenarioId) => {
      if (running || id === scenarioId) return;
      setScenarioId(id);
      setThreshold(snapshots[id].meta.defaultThreshold);
      setEvents([]);
      setPlan({});
      setMessages([]);
      setCaption(null);
      setActiveAgent(null);
      setActivePod("gtm");
      setPhase("idle");
      lastPodRef.current = null;
    },
    [running, scenarioId, snapshots],
  );

  return {
    snapshot,
    scenarioId,
    setScenario,
    content,
    threshold,
    setThreshold,
    forecastResult,
    events,
    plan,
    messages,
    caption,
    activeAgent,
    activePod,
    setActivePod,
    completedPods,
    startedPods,
    phase,
    running,
    hasRun: phase === "done" || events.length > 0,
    runGoal,
    runGuided,
    reset,
  };
}
