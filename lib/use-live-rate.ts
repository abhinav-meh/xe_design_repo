"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

/*
  Gently jitters a base market rate to convey a *live* market — the thing our
  rate-lock protects you from. Client-only (starts from the static SSR value,
  so no hydration mismatch) and fully paused under prefers-reduced-motion.

  Returns { rate, flash } where `flash` is +1 / -1 briefly after each tick
  (then auto-clears to 0) so the caller can flash a color up/down.
*/
export function useLiveRate(
  base: number,
  { amplitude = 0.02, interval = 2600, flashMs = 650 }: { amplitude?: number; interval?: number; flashMs?: number } = {},
) {
  const reduce = useReducedMotion();
  const [rate, setRate] = useState(base);
  const [flash, setFlash] = useState(0);
  const prev = useRef(base);

  useEffect(() => {
    if (reduce) {
      setRate(base);
      return;
    }
    let clearFlash: ReturnType<typeof setTimeout>;
    const id = setInterval(() => {
      const next = Math.round((base + (Math.random() * 2 - 1) * amplitude) * 100) / 100;
      const dir = Math.sign(next - prev.current);
      prev.current = next;
      setRate(next);
      setFlash(dir);
      clearTimeout(clearFlash);
      clearFlash = setTimeout(() => setFlash(0), flashMs);
    }, interval);
    return () => {
      clearInterval(id);
      clearTimeout(clearFlash);
    };
  }, [base, amplitude, interval, flashMs, reduce]);

  return { rate, flash };
}
