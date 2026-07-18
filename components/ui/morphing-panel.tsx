"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import { spring } from "@/lib/motion";

/*
  MorphingPanel — the Family / ConnectKit signature.
  The container springs smoothly to its new height whenever its content
  changes (steps, revealed items, expanding sections). Content should be
  swapped by the caller (e.g. keyed motion.div) for a cross-fade; the panel
  handles the height. Honors prefers-reduced-motion.
*/

export function MorphingPanel({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const inner = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number | "auto">("auto");
  const reduce = useReducedMotion();

  useLayoutEffect(() => {
    const el = inner.current;
    if (!el) return;
    const measure = () => setHeight(el.offsetHeight);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <motion.div
      animate={{ height }}
      transition={reduce ? { duration: 0 } : spring.morph}
      style={{ overflow: "hidden" }}
      className={cn(className)}
    >
      {/* small padding so focus rings (painted outside the box) aren't clipped
          by the overflow:hidden this panel needs for the height morph */}
      <div ref={inner} className="p-1">
        {children}
      </div>
    </motion.div>
  );
}
