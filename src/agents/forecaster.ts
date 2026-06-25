import { forecast } from "@/skills/forecast";
import { num, pct, usdM } from "@/lib/format";
import type { ForecastResult } from "@/lib/types";
import type { AgentContext } from "./types";

// Forecaster — projects pipeline and revenue with confidence bands (real math).
export async function runForecaster(ctx: AgentContext): Promise<{ forecast: ForecastResult }> {
  const labels = ctx.content.labels;
  ctx.emit({ pod: "revops", agent: "forecaster", status: "thinking", headline: "Projecting pipeline and revenue from the scored open deals…" });
  await ctx.wait(800);

  const thr = ctx.snapshot.meta.defaultThreshold;
  const f = forecast(ctx.snapshot.leadsScored, thr);

  ctx.emit({
    pod: "revops",
    agent: "forecaster",
    status: "done",
    headline: `Forecast: ${usdM(f.expectedBookings)} expected bookings from ${num(f.pipelineCount)} open ${labels.qualifiedPlural}.`,
    detail: ctx.content.agentCopy.forecasterDetail(f),
    toolCalls: [{ tool: "forecast()", skill: "forecast", input: `open ${labels.qualifiedPlural} @ ${thr}`, output: `${usdM(f.expectedBookings)} [${usdM(f.low)}–${usdM(f.high)}]` }],
    chips: [
      { label: "Pipeline", value: usdM(f.pipelineValue) },
      { label: "Expected", value: usdM(f.expectedBookings), tone: "accent" },
      { label: "Win rate @ cut", value: pct(f.winRateAtThreshold), tone: "good" },
      { label: `Open ${labels.qualifiedPlural}`, value: num(f.pipelineCount) },
    ],
    handoffTo: "attribution-analyst",
  });

  return { forecast: f };
}
