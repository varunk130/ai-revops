import { Eyebrow } from "@/components/ui";
import { AtlasApp } from "@/components/demo/AtlasApp";
import { buildSnapshot } from "@/lib/snapshot";

export default function DemoPage() {
  const snapshots = {
    consumer: buildSnapshot("consumer"),
    enterprise: buildSnapshot("enterprise"),
  };

  return (
    <div className="container-px py-10 sm:py-12">
      <header className="mb-6">
        <Eyebrow className="mb-2">Live demo · the centerpiece</Eyebrow>
        <h1 className="font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">Enter a new market.</h1>
        <p className="mt-2 max-w-2xl text-[15px] text-slate-400">
          Pick a scenario, then type a goal or hit <span className="text-atlas">Run guided demo</span>. Nine agents across three pods
          build the GTM, the partner motion, and the revenue model — then tune the threshold to re-score and re-forecast, live.
        </p>
      </header>

      <AtlasApp snapshots={snapshots} />
    </div>
  );
}
