"use client";

import { useEffect } from "react";
import { animate, motion, useMotionValue, useReducedMotion, useTransform } from "framer-motion";

/*
  Animated number — money resolves by counting up rather than just appearing.
  Snaps instantly under prefers-reduced-motion. Renders via a motion value so
  it updates without re-rendering React on every frame.
*/
export function CountUp({
  value,
  format,
  className,
  duration = 0.9,
}: {
  value: number;
  format: (n: number) => string;
  className?: string;
  duration?: number;
}) {
  const reduce = useReducedMotion();
  const mv = useMotionValue(reduce ? value : 0);
  const text = useTransform(mv, (n) => format(n));

  useEffect(() => {
    if (reduce) {
      mv.set(value);
      return;
    }
    const controls = animate(mv, value, { duration, ease: [0.22, 1, 0.36, 1] });
    return controls.stop;
  }, [value, reduce, duration, mv]);

  return <motion.span className={className}>{text}</motion.span>;
}
