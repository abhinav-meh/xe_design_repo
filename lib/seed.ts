import type { Agreement } from "./types";

/** today's live USD -> INR — the reference for the FX rate-lock delta */
export const MARKET_RATE = 82.0;

/** the account you're viewing as (changeable later at signup/onboarding) */
export const YOU = { name: "Arden Studio", country: "United States" };

const crit = (label: string, source: string): { id: string; label: string; source: string } => ({
  id: label.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 22),
  label,
  source,
});

export const seedAgreements: Agreement[] = [
  // ── PAYMENTS (you pay; counterparty is the INR receiver) ──
  {
    id: "pay-illus",
    title: "Brand illustration set",
    side: "paying",
    kind: "service",
    counterparty: { name: "Priya Nair", country: "India" },
    brief:
      "set of 6 spot illustrations for our marketing site, consistent style, editable source files. ~2 weeks.",
    criteria: [
      crit("6 spot illustrations", "6 spot illustrations"),
      crit("Consistent visual style", "consistent style"),
      crit("Editable source files handed over", "editable source files"),
      crit("Delivered within 14 days", "~2 weeks"),
    ],
    amount: 800,
    lockedRate: 82.8,
    state: "submitted",
    createdAt: "2026-07-06T09:30:00.000Z",
  },
  {
    id: "pay-fabric",
    title: "Cotton fabric — 500m, sample-matched",
    side: "paying",
    kind: "goods",
    counterparty: { name: "Meridian Textiles", country: "India" },
    brief:
      "500 metres of cotton fabric matching the approved sample, GSM within tolerance, shipped within 3 weeks.",
    criteria: [
      crit("500 metres delivered", "500 metres of cotton fabric"),
      crit("Matches the approved sample", "matching the approved sample"),
      crit("GSM within tolerance", "GSM within tolerance"),
      crit("Shipped within 21 days", "shipped within 3 weeks"),
    ],
    amount: 1500,
    lockedRate: 83.4,
    state: "accepted",
    createdAt: "2026-07-11T12:00:00.000Z",
  },
  {
    id: "pay-social",
    title: "Social launch graphics",
    side: "paying",
    kind: "service",
    counterparty: { name: "Priya Nair", country: "India" },
    brief: "10 instagram graphics for our launch, on-brand with our palette, within a week.",
    criteria: [
      crit("10 Instagram graphics", "10 instagram graphics"),
      crit("On-brand with palette", "on-brand with our palette"),
      crit("Delivered within 7 days", "within a week"),
    ],
    amount: 600,
    lockedRate: 83.2,
    state: "proposed",
    createdAt: "2026-07-13T11:00:00.000Z",
  },

  // ── RECEIPTS (you receive the guaranteed INR; counterparty pays USD) ──
  {
    id: "rec-site",
    title: "Marketing site redesign",
    side: "receiving",
    kind: "service",
    counterparty: { name: "Northwind Co", country: "United States" },
    brief:
      "redesign the marketing site — hero, features, pricing, testimonials. clean and modern. two weeks, two revision rounds.",
    criteria: [
      crit("Hero, features, pricing, testimonials", "hero, features, pricing, testimonials"),
      crit("Clean/modern visual direction", "clean and modern"),
      crit("Delivered within 14 days", "two weeks"),
      crit("2 revision rounds included", "two revision rounds"),
    ],
    amount: 1200,
    lockedRate: 84.0,
    state: "proposed",
    createdAt: "2026-07-12T15:00:00.000Z",
  },
  {
    id: "rec-order",
    title: "Wholesale order — 200 units",
    side: "receiving",
    kind: "goods",
    counterparty: { name: "Harbor Goods", country: "United States" },
    brief: "200 units of the signature planner, packaged retail-ready, shipped within 10 days.",
    criteria: [
      crit("200 units", "200 units of the signature planner"),
      crit("Retail-ready packaging", "packaged retail-ready"),
      crit("Shipped within 10 days", "shipped within 10 days"),
    ],
    amount: 950,
    lockedRate: 81.6,
    state: "funded",
    createdAt: "2026-07-09T10:00:00.000Z",
  },
  {
    id: "rec-emails",
    title: "Onboarding email sequence",
    side: "receiving",
    kind: "service",
    counterparty: { name: "Lumen Labs", country: "United States" },
    brief: "5-email onboarding sequence, copy only, friendly tone.",
    criteria: [
      crit("5 onboarding emails", "5-email onboarding sequence"),
      crit("Copy only, friendly tone", "copy only, friendly tone"),
    ],
    amount: 450,
    lockedRate: 81.6,
    state: "released",
    createdAt: "2026-06-30T14:00:00.000Z",
  },
];
