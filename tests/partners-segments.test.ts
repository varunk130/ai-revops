import { test } from "node:test";
import assert from "node:assert/strict";
import { PARTNER_WEIGHTS, rankPartners, rankSegments } from "@/lib/scoring";
import { getDataset } from "@/lib/dataset";

test("partner weights sum to 1", () => {
  const sum = Object.values(PARTNER_WEIGHTS).reduce((a, b) => a + b, 0);
  assert.ok(Math.abs(sum - 1) < 1e-9);
});

for (const id of ["consumer", "enterprise"] as const) {
  const data = getDataset(id);

  test(`${id}: partners are ranked by fit with A/B/C tiers in order`, () => {
    const ranked = rankPartners(data.partners);
    const order = { A: 0, B: 1, C: 2 };
    ranked.forEach((p, i) => {
      assert.equal(p.rank, i + 1);
      if (i > 0) {
        assert.ok(ranked[i - 1].fitScore >= p.fitScore);
        assert.ok(order[ranked[i - 1].tier] <= order[p.tier]);
      }
    });
    assert.equal(ranked.filter((p) => p.tier === "A").length, Math.min(8, ranked.length));
  });

  test(`${id}: segments are ranked by score and count their own leads`, () => {
    const ranked = rankSegments(data.segments, data.leads);
    ranked.forEach((s, i) => {
      assert.equal(s.rank, i + 1);
      if (i > 0) assert.ok(ranked[i - 1].score >= s.score);
      assert.ok(s.wonCount <= s.leadCount);
      assert.ok(s.score >= 0 && s.score <= 100);
    });
  });
}
