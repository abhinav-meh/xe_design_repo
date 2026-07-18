"use client";

import { motion } from "framer-motion";
import { useDemo } from "@/lib/store";
import { activity } from "@/lib/derive";
import { fmtDate } from "@/lib/utils";
import { staggerContainer, staggerItem } from "@/lib/motion";

export default function ActivityPage() {
  const view = useDemo((s) => s.view);
  const ags = useDemo((s) => s.agreements);
  const events = activity(ags, view);

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-semibold tracking-tight">Activity</h1>
      <p className="mt-1 text-sm text-muted-foreground">Every money event, newest first.</p>

      {events.length === 0 ? (
        <p className="mt-6 border border-dashed border-border px-4 py-12 text-center text-sm text-muted-foreground">
          No activity yet — money events show up here as agreements move.
        </p>
      ) : (
        <motion.ul
          variants={staggerContainer}
          initial="hidden"
          animate="show"
          className="mt-6 space-y-1"
        >
          {events.map((e) => (
            <motion.li key={e.id} variants={staggerItem} className="flex items-start gap-3 px-1 py-3">
              <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
              <div className="flex-1">
                <p className="text-sm">{e.text}</p>
                <p className="text-xs text-muted-foreground">
                  {e.title} · {fmtDate(e.at)}
                </p>
              </div>
            </motion.li>
          ))}
        </motion.ul>
      )}
    </div>
  );
}
