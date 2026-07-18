"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { CircleNotch, Sparkle, X } from "@phosphor-icons/react";
import { generateDoD } from "@/lib/draft";
import type { CurrencyCode, DoDCriterion } from "@/lib/types";
import { staggerContainer, staggerItem } from "@/lib/motion";
import { ProvenanceText } from "@/components/ui/provenance-text";
import { fmt, receiverAmount } from "@/lib/utils";

export function Resolve({
  brief,
  criteria,
  onCriteria,
  amount,
  onAmount,
  receiverName,
  receiverCurrency,
  rate,
}: {
  brief: string;
  criteria: DoDCriterion[];
  onCriteria: (c: DoDCriterion[]) => void;
  amount: number;
  onAmount: (n: number) => void;
  receiverName: string;
  receiverCurrency: CurrencyCode;
  rate: number;
}) {
  const [reading, setReading] = useState(criteria.length === 0);
  const [active, setActive] = useState<string | null>(null);
  const started = useRef(false);

  useEffect(() => {
    if (started.current || criteria.length) return;
    started.current = true;
    generateDoD(brief).then((c) => {
      onCriteria(c);
      setReading(false);
    });
  }, [brief, criteria.length, onCriteria]);

  const preview = amount > 0 ? receiverAmount(amount, rate) : 0;

  return (
    <div className="space-y-5">
      {/* the brief, with provenance highlight on hover */}
      <div className="rounded-xl bg-muted/60 p-4 text-sm leading-relaxed">
        <p className="mb-1.5 text-xs font-medium uppercase tracking-widest text-muted-foreground/70">
          Your brief
        </p>
        <ProvenanceText text={brief} highlight={active} className="text-muted-foreground" />
      </div>

      {reading ? (
        <div className="flex items-center gap-2 px-1 py-6 text-sm text-muted-foreground">
          <CircleNotch className="h-4 w-4 animate-spin" /> Reading your brief…
        </div>
      ) : (
        <div>
          <p className="mb-2 flex items-center gap-1.5 text-xs font-medium uppercase tracking-widest text-muted-foreground">
            <Sparkle className="h-3.5 w-3.5 text-primary" /> Acceptance terms
          </p>
          <motion.ul
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            className="space-y-2"
          >
            {criteria.map((c) => (
              <motion.li
                key={c.id}
                variants={staggerItem}
                layout
                tabIndex={0}
                role="button"
                onMouseEnter={() => setActive(c.source ?? null)}
                onMouseLeave={() => setActive(null)}
                onFocus={() => setActive(c.source ?? null)}
                onBlur={() => setActive(null)}
                onClick={() => setActive((cur) => (cur === c.source ? null : (c.source ?? null)))}
                className="group flex cursor-pointer items-center gap-3 rounded-lg bg-card px-3.5 py-3 text-sm shadow-soft outline-none ring-1 ring-border focus-visible:ring-2 focus-visible:ring-ring"
              >
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                <span className="flex-1">{c.label}</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onCriteria(criteria.filter((x) => x.id !== c.id));
                  }}
                  className="text-muted-foreground opacity-0 transition-opacity hover:text-foreground group-hover:opacity-100"
                  aria-label={`Remove "${c.label}"`}
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </motion.li>
            ))}
          </motion.ul>
          <p className="mt-2 text-xs text-muted-foreground">
            Tap or hover a line to see where it came from — the AI structured your words, it didn&apos;t invent.
          </p>

          {/* amount */}
          <div className="mt-6">
            <label className="text-sm font-medium">Amount (USD)</label>
            <div className="mt-1.5 flex flex-wrap items-center gap-3">
              <div className="flex h-11 items-center rounded-lg bg-card px-3 shadow-soft ring-1 ring-border focus-within:ring-2 focus-within:ring-ring">
                <span className="text-muted-foreground">$</span>
                <input
                  type="number"
                  min={0}
                  value={amount || ""}
                  onChange={(e) => onAmount(Number(e.target.value))}
                  placeholder="0"
                  className="tabular w-28 bg-transparent px-1 text-lg font-semibold outline-none"
                />
              </div>
              {preview > 0 && (
                <p className="text-sm text-muted-foreground">
                  <span className="tabular font-medium text-foreground">
                    {fmt(preview, receiverCurrency)}
                  </span>{" "}
                  guaranteed <span className="text-xs">· at today&apos;s rate, locks on funding</span>
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
