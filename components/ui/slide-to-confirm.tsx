"use client";

import { useEffect, useRef, useState } from "react";
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "framer-motion";
import { ArrowRight, Check } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { spring } from "@/lib/motion";

const THUMB = 56;

/*
  Slide-to-confirm — the deliberate gesture for committing money/state.
  Drag the lime thumb to the end (or focus it and press Enter) to confirm.
  Releases before the threshold spring back. On confirm: snap → check →
  a beat on "confirming…" → onConfirm() (which advances state and unmounts).
  Keyboard-operable and reduced-motion aware.
*/
export function SlideToConfirm({
  label,
  confirmingLabel = "Confirming…",
  onConfirm,
  className,
}: {
  label: string;
  confirmingLabel?: string;
  onConfirm: () => void;
  className?: string;
}) {
  const track = useRef<HTMLDivElement>(null);
  const [max, setMax] = useState(0);
  const [done, setDone] = useState(false);
  const x = useMotionValue(0);
  const reduce = useReducedMotion();

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const measure = () => setMax(Math.max(0, el.offsetWidth - THUMB));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const fillWidth = useTransform(x, (v) => v + THUMB);
  const labelOpacity = useTransform(x, [0, Math.max(1, max * 0.6)], [1, 0]);

  const finish = () => {
    if (done) return;
    setDone(true);
    animate(x, max, reduce ? { duration: 0 } : spring.snappy);
    setTimeout(onConfirm, reduce ? 0 : 480);
  };

  const onDragEnd = () => {
    if (done) return;
    if (x.get() >= max * 0.82) finish();
    else animate(x, 0, reduce ? { duration: 0 } : spring.snappy);
  };

  return (
    <div
      ref={track}
      className={cn(
        "relative h-14 w-full select-none overflow-hidden border border-primary bg-card",
        className,
      )}
    >
      {/* lime fill trailing the thumb */}
      <motion.div style={{ width: fillWidth }} className="absolute inset-y-0 left-0 bg-primary/25" />

      {/* label */}
      <motion.span
        style={{ opacity: done ? 1 : labelOpacity }}
        className={cn(
          "pointer-events-none absolute inset-0 flex items-center justify-center text-sm font-medium uppercase tracking-widest",
          done ? "text-primary" : "text-foreground",
        )}
      >
        {done ? confirmingLabel : label}
      </motion.span>

      {/* draggable thumb */}
      <motion.button
        drag={done ? false : "x"}
        dragConstraints={{ left: 0, right: max }}
        dragElastic={0}
        dragMomentum={false}
        style={{ x }}
        onDragEnd={onDragEnd}
        whileTap={{ scale: 0.96 }}
        onKeyDown={(e) => {
          if (!done && (e.key === "Enter" || e.key === " ")) {
            e.preventDefault();
            finish();
          }
        }}
        aria-label={label}
        className="absolute left-0 top-0 flex h-14 w-14 cursor-grab items-center justify-center bg-primary text-primary-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring active:cursor-grabbing"
      >
        {done ? (
          <Check className="h-5 w-5" weight="bold" />
        ) : (
          <ArrowRight className="h-5 w-5" weight="bold" />
        )}
      </motion.button>
    </div>
  );
}
