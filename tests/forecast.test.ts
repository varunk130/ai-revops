import { test } from "node:test";
import assert from "node:assert/strict";
import { forecast } from "@/lib/forecast";
import { buildSnapshot } from "@/lib/snapshot";

for (const id of ["consumer", "enterprise"] as const) {
  const snap = buildSnapshot(id);
  const f = forecast(snap.leadsScored, snap.meta.defaultThreshold);

  test(`${id}: forecast band brackets the expected bookings`, () => {
    assert.ok(f.low <= f.expectedBookings && f.expectedBookings <= f.high);
    assert.ok(f.expectedBookings <= f.pipelineValue);
  });

  test(`${id}: cumulative series ends at the full expected value`, () => {
    const last = f.series[f.series.length - 1];
    assert.equal(last.expected, f.expectedBookings);
    for (let i = 1; i < f.series.length; i++) assert.ok(f.series[i].expected >= f.series[i - 1].expected);
  });

  test(`${id}: a higher score threshold narrows the pipeline`, () => {
    const strict = forecast(snap.leadsScored, Math.min(100, snap.meta.defaultThreshold + 20));
    assert.ok(strict.pipelineCount <= f.pipelineCount);
    assert.ok(strict.pqlCount <= f.pqlCount);
  });
}

test("an empty pipeline forecasts zero", () => {
  const f = forecast([], 50);
  assert.equal(f.expectedBookings, 0);
  assert.equal(f.winRateAtThreshold, 0);
});
