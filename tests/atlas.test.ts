import { test } from "node:test";
import assert from "node:assert/strict";
import { precompute } from "@/lib/precompute";

for (const id of ["consumer", "enterprise"] as const) {
  test(`${id}: the Atlas run produces a launch plan`, async () => {
    const { snapshot, plan } = await precompute(id);
    assert.ok(snapshot.leadsScored.length > 0);
    assert.ok(plan);
  });

  test(`${id}: the Atlas run is deterministic`, async () => {
    const a = await precompute(id);
    const b = await precompute(id);
    assert.equal(JSON.stringify(a), JSON.stringify(b));
  });
}
