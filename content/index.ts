import type { ScenarioContent } from "@/agents/types";
import type { ScenarioId } from "@/lib/types";
import { CONSUMER_CONTENT } from "./consumer";
import { ENTERPRISE_CONTENT } from "./enterprise";

// Registry of scenario content bundles. Plain data + functions (no big dataset, no React),
// so it is safe to import from both the server (snapshot) and the client (demo UI).
export const SCENARIO_CONTENT: Record<ScenarioId, ScenarioContent> = {
  consumer: CONSUMER_CONTENT,
  enterprise: ENTERPRISE_CONTENT,
};
