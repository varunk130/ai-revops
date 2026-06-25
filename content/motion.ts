import type { Motion } from "@/lib/types";

export const MOTION: Motion = {
  channels: [
    { name: "Partner-led (ecommerce + payments)", rationale: "DTC brands already live inside their ecommerce and payments stack; co-selling there beats cold outbound." },
    { name: "Founder & operator communities", rationale: "DTC founders and finance leads cluster in invite-only Slack/Discord groups and events — high-trust, low-CAC." },
    { name: "Content / SEO on DTC finance", rationale: "Intent like \u201cmanage cash flow for a DTC brand\u201d is high-volume and underserved by incumbents." },
    { name: "Targeted paid social (LinkedIn + Meta)", rationale: "Finance leads at scaling brands are reachable by role + firmographics; pair with the lead-score model to suppress low-fit spend." },
  ],
  salesMotion: "Product-led sales (PLS)",
  salesMotionDetail:
    "Self-serve signup for everyone; a usage-qualified (PQL) hand-off to sales for mid-market and up; partner referrals skip the line. SMB stays fully self-serve to protect CAC.",
  pricing: [
    { name: "Launch", price: "$0 + interchange", forWho: "Early DTC brands — land via self-serve, monetize on interchange." },
    { name: "Scale", price: "$99 / mo", forWho: "Growing brands needing AP automation, multi-user, and integrations." },
    { name: "Operate", price: "Custom", forWho: "Mid-market brands — treasury, spend controls, dedicated support." },
  ],
  pricingThesis:
    "Free-to-land on interchange, then monetize the operating system (AP, cards, controls) as the brand scales — pricing that tracks how DTC finance complexity grows with GMV.",
};

// Candidates for the agentLLM seam (the Motion Designer selects the positioning line).
export const POSITIONING_LINES = [
  "The finance stack DTC brands graduate into — not the bank they outgrow.",
  "Banking that speaks GMV: runway, AP, and cards built for how DTC brands actually run.",
  "Meet brands inside their ecommerce stack, land on interchange, grow into the operating system.",
];
