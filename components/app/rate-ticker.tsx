"use client";

import { motion } from "framer-motion";
import { CaretDown, CaretUp, Minus } from "@phosphor-icons/react";
import { CORRIDORS } from "@/lib/fx";

/* Marquee ticker of cross-border corridors — the "market is live" strip. */

function Delta({ d }: { d: number }) {
  const Icon = d > 0 ? CaretUp : d < 0 ? CaretDown : Minus;
  const tone = d > 0 ? "text-primary" : d < 0 ? "text-red-500" : "text-muted-foreground";
  return (
    <span className={`inline-flex items-center gap-0.5 ${tone}`}>
      <Icon className="h-3 w-3" weight="bold" />
      {Math.abs(d).toFixed(1)}%
    </span>
  );
}

function Item({ c }: { c: (typeof CORRIDORS)[number] }) {
  return (
    <span className="mx-5 inline-flex items-center gap-2 text-xs">
      <span className="text-muted-foreground">{c.pair}</span>
      <span className="font-mono">{c.rate}</span>
      <Delta d={c.d} />
    </span>
  );
}

export function RateTicker() {
  return (
    <div className="overflow-hidden border-b border-border bg-card/40">
      <motion.div
        className="flex w-max whitespace-nowrap py-2"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 30, ease: "linear", repeat: Infinity }}
      >
        {[...CORRIDORS, ...CORRIDORS].map((c, i) => (
          <Item key={i} c={c} />
        ))}
      </motion.div>
    </div>
  );
}
