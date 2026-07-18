/*
  MOTION TOKENS — the signature of "Trusted Craft".
  Inspired by Family / ConnectKit: spring-first, responsive, weighted,
  soft settle, minimal overshoot. Everything physical feels connected.
  Import these instead of hand-tuning transitions per component.
*/

import type { Transition, Variants } from "framer-motion";

export const spring = {
  /** default UI motion — quick, confident, tiny give */
  snappy: { type: "spring", stiffness: 520, damping: 34, mass: 0.9 },
  /** workhorse for panels / step content — smooth, no wobble */
  smooth: { type: "spring", stiffness: 360, damping: 40 },
  /** container height / layout morph — the Family feel, zero overshoot */
  morph: { type: "spring", stiffness: 340, damping: 42, mass: 1 },
  /** large surfaces / sheets — gentle, weighty */
  gentle: { type: "spring", stiffness: 200, damping: 30 },
  /** playful accent — a little life, use sparingly */
  bouncy: { type: "spring", stiffness: 200, damping: 20 },
} satisfies Record<string, Transition>;

export const duration = {
  fast: 0.16,
  base: 0.24,
  slow: 0.4,
} as const;

export const ease = {
  out: [0.22, 1, 0.36, 1],
  inOut: [0.65, 0, 0.35, 1],
} as const;

/** standard press / hover feedback for interactive elements */
export const tap = { scale: 0.97 };
export const hover = { scale: 1.015 };

/*
  Staggered reveal — the "assembling itself" feel used in The Resolve
  (criteria springing into place one after another).
*/
export const staggerContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.055, delayChildren: 0.04 } },
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: spring.smooth },
};
