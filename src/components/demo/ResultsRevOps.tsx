"use client";

import { useMemo, useState } from "react";
import { forecast } from "@/lib/forecast";
import type { AtlasSnapshot } from "@/lib/types";
import { FunnelModel } from "./FunnelModel";
import { ForecastChart } from "./ForecastChart";
import { LeadScoreTable } from "./LeadScoreTable";

export function ResultsRevOps({ snapshot }: { snapshot: AtlasSnapshot }) {
  const [threshold, setThreshold] = useState(snapshot.meta.defaultThreshold);
  const f = useMemo(() => forecast(snapshot.leadsScored, threshold), [snapshot, threshold]);

  return (
    <div className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-2">
        <FunnelModel funnel={snapshot.funnel} />
        <ForecastChart forecast={f} />
      </div>
      <LeadScoreTable snapshot={snapshot} threshold={threshold} setThreshold={setThreshold} forecast={f} />
    </div>
  );
}
