# Crow

Cross-border escrow with an FX rate-lock — pay out **and** get paid across borders, for services or goods. Escrow closes the trust gap; the rate-lock, applied the moment funds are secured, closes the currency gap.

Built as a 7-day design-engineer challenge: one focused, polished payment instrument rather than a broad app of generic screens.

## Stack

- **Next.js 15** (App Router) + **React 18.3** + **TypeScript**
- **Tailwind CSS** — token-driven design system
- **Framer Motion** — a single spring-based motion vocabulary
- **Zustand** (persisted to `localStorage`) — demo state, no backend
- **Overused Grotesk** (self-hosted) + **Geist Mono** for money figures · **Phosphor** icons · Radix primitives

## Run locally

```bash
npm install
npm run dev
# http://localhost:3000
```

## Production build

```bash
npm run build
npm start
```

## Routes

- `/` — landing
- `/onboarding` — account setup (collects a profile that personalizes the app)
- `/login` — split login screen
- `/app` — the dashboard (Payments ⇄ Receipts, agreements, balances, activity)
- `/system` — design-system playground

## Notes

- The demo runs entirely client-side; state persists to `localStorage` and can be reset from the top nav.
- Acceptance-term drafting is deterministic (`lib/draft.ts`) with a seam ready for a live Claude API call.
- Motion honors `prefers-reduced-motion` throughout.
