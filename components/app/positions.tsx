"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { STATE_LABEL, sideForView, type Agreement, type View } from "@/lib/types";
import { stateVariant } from "@/lib/derive";
import { fmt, receiverAmount } from "@/lib/utils";
import { Pill, PillIndicator } from "@/components/kibo-ui/pill";
import { Divider } from "@/components/ui/divider";
import { staggerContainer, staggerItem } from "@/lib/motion";

/* Active deals in the current view — 3 columns that scale on any width.
   Rows stagger in on mount and flash when their state changes under you. */
export function Positions({ ags, view }: { ags: Agreement[]; view: View }) {
  const rows = useMemo(
    () => ags.filter((a) => a.side === sideForView(view) && a.state !== "released"),
    [ags, view],
  );
  const paying = view === "payments";

  // flash any row whose state just changed (e.g. funded → submitted across roles)
  const prev = useRef<Record<string, string>>({});
  const [flashing, setFlashing] = useState<Record<string, boolean>>({});
  useEffect(() => {
    const changed: string[] = [];
    for (const a of rows) {
      if (prev.current[a.id] && prev.current[a.id] !== a.state) changed.push(a.id);
      prev.current[a.id] = a.state;
    }
    if (!changed.length) return;
    setFlashing((f) => ({ ...f, ...Object.fromEntries(changed.map((id) => [id, true])) }));
    const t = setTimeout(() => {
      setFlashing((f) => {
        const next = { ...f };
        changed.forEach((id) => delete next[id]);
        return next;
      });
    }, 1300);
    return () => clearTimeout(t);
  }, [rows]);

  return (
    <div className="border border-border bg-card">
      <div className="flex items-center justify-between px-4 py-3">
        <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
          Active deals
        </p>
        <span className="font-mono text-xs text-muted-foreground">{rows.length}</span>
      </div>
      <Divider />

      {rows.length === 0 ? (
        <p className="px-4 py-10 text-center text-sm text-muted-foreground">No active deals.</p>
      ) : (
        <>
          <div className="grid grid-cols-[1fr_auto_auto] gap-3 px-4 py-2 text-[11px] uppercase tracking-widest text-muted-foreground/70">
            <span>Deal</span>
            <span className="text-right">{paying ? "You pay" : "You receive"}</span>
            <span className="text-right">Status</span>
          </div>
          <motion.div variants={staggerContainer} initial="hidden" animate="show">
            {rows.map((a, i) => {
              const inr = receiverAmount(a.amount, a.lockedRate);
              return (
                <motion.div key={a.id} variants={staggerItem}>
                  {i > 0 && <Divider />}
                  <Link
                    href={`/app/agreements/${a.id}`}
                    className="relative grid grid-cols-[1fr_auto_auto] items-center gap-3 px-4 py-3 outline-none transition-colors hover:bg-muted/40 focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {flashing[a.id] && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ duration: 1.3, times: [0, 0.12, 1], ease: "easeOut" }}
                        className="pointer-events-none absolute inset-0 bg-primary/15"
                      />
                    )}
                    <div className="relative z-10 min-w-0">
                      <p className="truncate text-sm font-medium">{a.title}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {paying ? "To" : "From"} {a.counterparty.name}
                      </p>
                    </div>
                    <span className="relative z-10 text-right font-mono text-sm">
                      {paying ? fmt(a.amount, "USD") : fmt(inr, "INR")}
                    </span>
                    <span className="relative z-10 flex justify-end">
                      <Pill>
                        <PillIndicator variant={stateVariant(a.state)} pulse={a.state === "funded"} />
                        {STATE_LABEL[a.state]}
                      </Pill>
                    </span>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        </>
      )}
    </div>
  );
}
