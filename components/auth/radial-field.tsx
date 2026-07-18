"use client";

import { motion, useReducedMotion } from "framer-motion";

/*
  Concentric rings of vertical dashes — the "portal" motif from the login ref.
  Deterministic positions; a slow outward sonar pulse (per-ring opacity wave)
  keeps it alive without moving the bars off-vertical. Static under reduced-motion.
*/
const RINGS = [
  { r: 70, n: 10 },
  { r: 132, n: 16 },
  { r: 196, n: 22 },
  { r: 266, n: 28 },
  { r: 342, n: 34 },
  { r: 424, n: 40 },
  { r: 512, n: 46 },
];
const SIZE = 1120;
const C = SIZE / 2;

export function RadialField() {
  const reduce = useReducedMotion();

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{ width: SIZE, height: SIZE }}
      >
        {RINGS.map((ring, ri) => {
          const base = 0.1 + ri * 0.02;
          const h = 14 + ri * 1.8;
          return (
            <motion.div
              key={ri}
              className="absolute inset-0"
              initial={false}
              animate={reduce ? { opacity: base + 0.18 } : { opacity: [base, base + 0.5, base] }}
              transition={
                reduce
                  ? undefined
                  : { duration: 2.8, repeat: Infinity, ease: "easeInOut", delay: ri * 0.17 }
              }
            >
              {Array.from({ length: ring.n }).map((_, j) => {
                const a = (j / ring.n) * Math.PI * 2 + ri * 0.22;
                const x = C + ring.r * Math.cos(a);
                const y = C + ring.r * Math.sin(a);
                return (
                  <span
                    key={j}
                    className={ri === 0 ? "absolute bg-primary" : "absolute bg-foreground"}
                    style={{ left: x - 1, top: y - h / 2, width: 2, height: h }}
                  />
                );
              })}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
