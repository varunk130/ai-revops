import { test } from "node:test";
import assert from "node:assert/strict";
import { scoreLead, winProbability } from "@/lib/scoring";
import { getDataset } from "@/lib/dataset";

for (const id of ["consumer", "enterprise"] as const) {
  const data = getDataset(id);

  test(`${id}: every lead scores within 0-100`, () => {
    for (const l of data.leads) {
      const s = scoreLead(l, data.meta.weights);
      assert.ok(Number.isInteger(s) && s >= 0 && s <= 100, `${l.id}: ${s}`);
    }
  });

  test(`${id}: won leads outscore lost leads on average`, () => {
    const mean = (o: string) => {
      const xs = data.leads.filter((l) => l.outcome === o).map((l) => scoreLead(l, data.meta.weights));
      return xs.reduce((a, b) => a + b, 0) / xs.length;
    };
    assert.ok(mean("won") > mean("lost"));
  });
}

test("win probability rises with score and stays within bounds", () => {
  assert.ok(winProbability(80, "pql") > winProbability(40, "pql"));
  for (const s of [0, 50, 100]) {
    for (const st of ["lead", "mql", "pql", "sql"]) {
      const p = winProbability(s, st);
      assert.ok(p >= 0.02 && p <= 0.95);
    }
  }
});

test("later stages carry higher win probability at the same score", () => {
  assert.ok(winProbability(60, "sql") > winProbability(60, "mql"));
  assert.ok(winProbability(60, "mql") > winProbability(60, "lead"));
});
