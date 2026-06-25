import { scoreLead, winProbability } from "@/lib/scoring";

export const descriptor = {
  name: "lead-score",
  description: "Reusable PQL scoring: turns observable lead features into a 0-100 score and a win probability. Used by the Lead Scorer and the interactive lead table.",
};

export { scoreLead, winProbability };
