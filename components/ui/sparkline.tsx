"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

/* Tiny inline trend line. Uses currentColor; caller/`up` sets hue.
   Draws itself in on mount (pathLength) and leaves a gently breathing
   endpoint dot so the line reads as *live*. Static under reduced-motion. */
export function Sparkline({
  series,
  up = true,
  className,
  animate = true,
}: {
  series: number[];
  up?: boolean;
  className?: string;
  animate?: boolean;
}) {
  const reduce = useReducedMotion();
  const alive = animate && !reduce;
  const n = series.length;
  const W = 64;
  const H = 24;
  const P = 2;
  const min = Math.min(...series);
  const max = Math.max(...series);
  const span = max - min || 1;
  const pts = series.map(
    (v, i) => [P + (i / (n - 1)) * (W - 2 * P), P + (1 - (v - min) / span) * (H - 2 * P)] as const,
  );
  const d = "M " + pts.map((p) => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" L ");
  const last = pts[pts.length - 1];

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
      className={cn("h-6 w-16", up ? "text-primary" : "text-red-500", className)}
    >
      <motion.path
        d={d}
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
        initial={alive ? { pathLength: 0 } : false}
        animate={alive ? { pathLength: 1 } : undefined}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      />
      {alive && (
        <motion.circle
          cx={last[0]}
          cy={last[1]}
          r={1.8}
          fill="currentColor"
          initial={{ opacity: 0 }}
          animate={{ opacity: [1, 0.35, 1] }}
          transition={{
            opacity: { duration: 1.8, repeat: Infinity, ease: "easeInOut", delay: 0.9 },
          }}
        />
      )}
    </svg>
  );
}
