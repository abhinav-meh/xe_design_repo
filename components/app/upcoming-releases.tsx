"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { sideForView, type Agreement, type View } from "@/lib/types";
import { fmt, receiverAmount } from "@/lib/utils";
import { spring } from "@/lib/motion";
import { Divider } from "@/components/ui/divider";

const hash = (s: string) => s.split("").reduce((a, c) => a + c.charCodeAt(0), 0);

/* Settlement timeline — deals with money in escrow in the current view. */
export function UpcomingReleases({ ags, view }: { ags: Agreement[]; view: View }) {
  const rows = ags
    .filter((a) => a.side === sideForView(view) && (a.state === "funded" || a.state === "submitted"))
    .map((a) => ({ a, eta: 2 + (hash(a.id) % 8) }))
    .sort((x, y) => x.eta - y.eta);
  const paying = view === "payments";

  return (
    <div className="border border-border bg-card">
      <div className="px-4 py-3 text-xs font-medium uppercase tracking-widest text-muted-foreground">
        {paying ? "Upcoming releases" : "Incoming releases"}
      </div>
      <Divider />
      {rows.length === 0 ? (
        <p className="px-4 py-8 text-center text-sm text-muted-foreground">Nothing in escrow.</p>
      ) : (
        rows.map(({ a, eta }, i) => {
          const amt = paying ? fmt(a.amount, "USD") : fmt(receiverAmount(a.amount, a.lockedRate), "INR");
          const progress = Math.min(0.92, 1 - eta / 12);
          return (
            <div key={a.id}>
              {i > 0 && <Divider />}
              <Link
                href={`/app/agreements/${a.id}`}
                className="block px-4 py-3 outline-none transition-colors hover:bg-muted/40 focus-visible:ring-2 focus-visible:ring-ring"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="min-w-0 truncate text-sm font-medium">{a.title}</p>
                  <span className="shrink-0 font-mono text-sm">{amt}</span>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <div className="h-1 flex-1 bg-muted">
                    <motion.div
                      className="h-1 origin-left bg-primary"
                      style={{ width: `${progress * 100}%` }}
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: 1 }}
                      viewport={{ once: true, amount: 0.6 }}
                      transition={{ ...spring.smooth, delay: 0.05 * i }}
                    />
                  </div>
                  <span className="shrink-0 font-mono text-xs text-muted-foreground">~{eta}d</span>
                </div>
              </Link>
            </div>
          );
        })
      )}
    </div>
  );
}
