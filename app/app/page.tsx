"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { CaretRight } from "@phosphor-icons/react";
import { useDemo } from "@/lib/store";
import { summary, needsAttention, actionLabel, activity } from "@/lib/derive";
import { totalProtected } from "@/lib/fx";
import { AVAILABLE } from "@/lib/account";
import { sideForView } from "@/lib/types";
import { cn, fmt, fmtDate } from "@/lib/utils";
import { staggerContainer, staggerItem } from "@/lib/motion";
import { Divider } from "@/components/ui/divider";
import { FxWidget } from "@/components/app/fx-widget";
import { Positions } from "@/components/app/positions";
import { UpcomingReleases } from "@/components/app/upcoming-releases";

export default function HomePage() {
  const view = useDemo((s) => s.view);
  const ags = useDemo((s) => s.agreements);
  const profile = useDemo((s) => s.profile);
  const sum = summary(ags, view);
  const attention = needsAttention(ags, view);
  const events = activity(ags, view).slice(0, 5);

  const greetName = profile?.name?.split(" ")[0] || profile?.business || "there";

  const scoped = ags.filter((a) => a.side === sideForView(view));
  const activeCount = scoped.filter((a) => a.state !== "released").length;

  const tiles =
    view === "payments"
      ? [
          { label: sum.primary.label, value: fmt(sum.primary.n, sum.primary.c) },
          { label: sum.secondary.label, value: fmt(sum.secondary.n, sum.secondary.c) },
          { label: "Active deals", value: String(activeCount) },
          { label: "Available", value: fmt(AVAILABLE.USD, "USD") },
        ]
      : [
          { label: sum.primary.label, value: fmt(sum.primary.n, sum.primary.c) },
          { label: sum.secondary.label, value: fmt(sum.secondary.n, sum.secondary.c) },
          { label: "FX protected", value: fmt(totalProtected(ags), "INR"), accent: true },
          { label: "Available", value: fmt(AVAILABLE.INR, "INR") },
        ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Welcome back, {greetName}.</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {view === "payments"
            ? "Money you've committed, protected until you approve."
            : "Money coming in — locked in your favour, paid the moment you deliver."}
        </p>
      </div>

      {/* 1 · money at a glance */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {tiles.map((t) => (
          <div key={t.label} className="border border-border bg-card p-4">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">{t.label}</p>
            <p className={cn("mt-1 font-mono text-xl font-semibold", t.accent && "text-primary")}>
              {t.value}
            </p>
          </div>
        ))}
      </div>

      {/* 2 · what needs you — the purpose, promoted */}
      <section>
        <h2 className="mb-2 text-sm font-semibold uppercase tracking-widest text-muted-foreground">
          Needs your attention
        </h2>
        {attention.length === 0 ? (
          <p className="border border-dashed border-border px-4 py-6 text-center text-sm text-muted-foreground">
            You&apos;re all caught up — nothing needs you right now.
          </p>
        ) : (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            className="grid gap-3 sm:grid-cols-2"
          >
            {attention.map((a) => (
              <motion.div key={a.id} variants={staggerItem}>
                <Link
                  href={`/app/agreements/${a.id}`}
                  className="flex items-center justify-between gap-3 border border-border bg-card p-4 outline-none transition-transform ease-out-expo hover:scale-[1.01] focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium">{a.title}</p>
                    <p className="mt-0.5 truncate text-sm text-muted-foreground">
                      {view === "payments" ? "To" : "From"} {a.counterparty.name}
                    </p>
                    <p className="mt-1 text-sm font-medium text-primary">{actionLabel(a, view)}</p>
                  </div>
                  <CaretRight className="h-5 w-5 shrink-0 text-muted-foreground" />
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </section>

      {/* mobile-only FX (desktop shows the persistent forex rail) */}
      <div className="lg:hidden">
        <FxWidget />
      </div>

      {/* 3 · active deals */}
      <Positions ags={ags} view={view} />

      {/* 4 · upcoming + activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        <UpcomingReleases ags={ags} view={view} />
        <section>
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-widest text-muted-foreground">
            Recent activity
          </h2>
          {events.length === 0 ? (
            <p className="border border-dashed border-border px-4 py-3 text-sm text-muted-foreground">
              Nothing yet.
            </p>
          ) : (
            <div className="border border-border bg-card px-4">
              {events.map((e, i) => (
                <div key={e.id}>
                  {i > 0 && <Divider />}
                  <div className="flex items-center justify-between gap-3 py-2.5 text-sm">
                    <span className="min-w-0 truncate">{e.text}</span>
                    <span className="shrink-0 text-xs text-muted-foreground">{fmtDate(e.at)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
