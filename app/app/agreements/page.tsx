"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useDemo } from "@/lib/store";
import { STATE_LABEL, sideForView, type Agreement, type View } from "@/lib/types";
import { needsAttention, stateVariant } from "@/lib/derive";
import { cn, fmt, receiverAmount } from "@/lib/utils";
import { Pill, PillIndicator } from "@/components/kibo-ui/pill";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AgreementDetailView } from "@/components/app/agreement-detail-view";
import { ease, spring, staggerContainer, staggerItem } from "@/lib/motion";

type Filter = "all" | "action" | "active" | "completed";

function RowInner({ a, view }: { a: Agreement; view: View }) {
  const paying = view === "payments";
  const inr = receiverAmount(a.amount, a.lockedRate);
  return (
    <div className="w-full">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate font-medium">{a.title}</p>
          <p className="mt-0.5 truncate text-sm text-muted-foreground">
            {paying ? "To" : "From"} {a.counterparty.name}
          </p>
        </div>
        <Pill className="shrink-0">
          <PillIndicator variant={stateVariant(a.state)} pulse={a.state === "funded"} />
          {STATE_LABEL[a.state]}
        </Pill>
      </div>
      <p className="mt-2 font-mono tabular text-sm font-semibold">
        {paying ? fmt(a.amount, "USD") : fmt(inr, "INR")}
      </p>
    </div>
  );
}

function List({
  items,
  view,
  variant,
  selected,
  onSelect,
}: {
  items: Agreement[];
  view: View;
  variant: "mobile" | "web";
  selected?: string | null;
  onSelect?: (id: string) => void;
}) {
  if (items.length === 0)
    return (
      <p className="border border-dashed border-border py-12 text-center text-sm text-muted-foreground">
        Nothing here yet.
      </p>
    );
  return (
    <motion.ul
      key={variant}
      variants={staggerContainer}
      initial="hidden"
      animate="show"
      className="space-y-2"
    >
      {items.map((a) => (
        <motion.li key={a.id} layout variants={staggerItem}>
          {variant === "mobile" ? (
            <Link
              href={`/app/agreements/${a.id}`}
              className="block border border-border bg-card p-4 outline-none transition-transform ease-out-expo hover:scale-[1.01] focus-visible:ring-2 focus-visible:ring-ring"
            >
              <RowInner a={a} view={view} />
            </Link>
          ) : (
            <button
              onClick={() => onSelect?.(a.id)}
              className={cn(
                "relative block w-full border border-border p-4 text-left outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring",
                selected === a.id ? "bg-card" : "bg-card/50 hover:bg-card",
              )}
            >
              {selected === a.id && (
                <motion.span
                  layoutId="ag-selected"
                  transition={spring.snappy}
                  className="pointer-events-none absolute inset-0 border border-primary/50"
                />
              )}
              <div className="relative z-10">
                <RowInner a={a} view={view} />
              </div>
            </button>
          )}
        </motion.li>
      ))}
    </motion.ul>
  );
}

export default function AgreementsPage() {
  const view = useDemo((s) => s.view);
  const ags = useDemo((s) => s.agreements);
  const [filter, setFilter] = useState<Filter>("all");
  const [selected, setSelected] = useState<string | null>(null);

  const base = ags.filter((a) => a.side === sideForView(view));
  const items =
    filter === "action"
      ? needsAttention(ags, view)
      : filter === "active"
        ? base.filter((a) => a.state !== "released")
        : filter === "completed"
          ? base.filter((a) => a.state === "released")
          : base;

  const effective = items.find((a) => a.id === selected)?.id ?? items[0]?.id ?? null;

  return (
    <div>
      <h1 className="mb-4 text-2xl font-semibold tracking-tight">
        {view === "payments" ? "Payments" : "Receipts"}
      </h1>

      <Tabs value={filter} onValueChange={(v) => setFilter(v as Filter)}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="action">Action needed</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="mt-5 md:hidden">
        <List key={filter} items={items} view={view} variant="mobile" />
      </div>

      <div className="mt-5 hidden gap-6 md:grid md:grid-cols-[minmax(0,340px)_1fr]">
        <List key={filter} items={items} view={view} variant="web" selected={effective} onSelect={setSelected} />
        <div className="min-w-0 border border-border p-6">
          <AnimatePresence mode="wait" initial={false}>
            {effective ? (
              <motion.div
                key={effective}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2, ease: ease.out }}
              >
                <AgreementDetailView id={effective} />
              </motion.div>
            ) : (
              <p className="text-sm text-muted-foreground">Select a deal.</p>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
