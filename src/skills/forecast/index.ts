import { buildFunnelModel, forecast } from "@/lib/forecast";

export const descriptor = {
  name: "forecast",
  description: "Reusable funnel → revenue projector: expected bookings with confidence bands from the scored open pipeline at a PQL threshold.",
};

export { forecast, buildFunnelModel };
