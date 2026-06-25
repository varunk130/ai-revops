import type { OnePager, OutreachEmail } from "@/lib/types";

// 3-touch partner outreach sequence (to a top-tier candidate, e.g. an ecommerce/payments platform).
export const OUTREACH: OutreachEmail[] = [
  {
    step: 1,
    trigger: "Day 0 · intro to partnerships lead",
    subject: "Northwind × {{partner}}: a better money stack for your DTC merchants",
    body: `Hi {{first_name}},

Your merchants are exactly who we're built for — consumer brands scaling on {{partner}} who've outgrown a generic small-business bank.

Northwind gives them runway visibility, cards with controls, and AP automation that plugs into {{partner}}. For you, that's stickier merchants and a new attach point.

Worth a 20-minute call to see if the audiences line up? I've already mapped where our ICPs overlap.

— {{sender}}, Partnerships @ Northwind`,
  },
  {
    step: 2,
    trigger: "Day 4 · no reply",
    subject: "What a joint offer could look like",
    body: `Hi {{first_name}},

Quick follow-up with something concrete. Based on our overlap, a joint offer could be:

• A co-branded \u201cmoney stack for {{partner}} brands\u201d with a fast-track onboarding
• Revenue share on referred accounts that fund and activate
• A shared dashboard so your team sees referred-merchant health

We'd run a 60-day pilot with a target list of ~20 of your highest-fit merchants. Open to comparing notes?

— {{sender}}`,
  },
  {
    step: 3,
    trigger: "Day 9 · final touch",
    subject: "15 minutes to map the first 20 accounts?",
    body: `Hi {{first_name}},

Last note from me — I don't want to crowd your inbox. If partnerships isn't a now thing, no worries.

If it is, I'll bring a shortlist of 20 mutual-fit merchants and a one-page pilot plan to our first call. You bring the intros; we'll do the heavy lifting.

Grab a time here: {{calendar_link}}

— {{sender}}`,
  },
];

export const ONE_PAGER: OnePager = {
  title: "Northwind × {{partner}} — Joint GTM one-pager",
  sections: [
    {
      heading: "The opportunity",
      body: "Consumer brands scaling on {{partner}} need a finance stack that understands GMV — runway, cards, AP — not a generic SMB bank. That gap is a shared revenue opportunity.",
    },
    {
      heading: "Why {{partner}} + Northwind",
      body: "{{partner}} owns the merchant relationship and checkout; Northwind owns the money stack. Together we raise merchant retention and open a new monetization surface, with deep, native integration.",
    },
    {
      heading: "The joint offer",
      body: "A co-branded onboarding for {{partner}} brands, revenue share on funded + activated referrals, and a shared health dashboard. A 60-day pilot against ~20 highest-fit merchants, scored by Northwind's lead model.",
    },
    {
      heading: "How we go to market",
      body: "In-app placement + a lifecycle nudge to qualified merchants, a co-hosted operator session, and a joint comparison page targeting DTC-finance intent. Partner-sourced leads skip the queue to a human.",
    },
    {
      heading: "What we need from you",
      body: "A partnerships owner, intros to the pilot shortlist, and a placement slot. Northwind brings the integration, the creative, and the onboarding lift.",
    },
  ],
};

// Candidates for the agentLLM seam (the Outreach Writer selects the one-pager hero line).
export const ONEPAGER_HEROS = [
  "Turn your DTC merchants' money stack into a retention and revenue engine.",
  "The native finance layer your scaling brands keep asking for.",
  "One integration, two stickier products, a new revenue share.",
];
