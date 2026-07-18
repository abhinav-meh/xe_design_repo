"use client";

import { useDemo } from "@/lib/store";
import { AVAILABLE, committedUSD, incomingINR } from "@/lib/account";
import { fmt } from "@/lib/utils";
import { CountUp } from "@/components/ui/count-up";
import type { CurrencyCode } from "@/lib/types";

export default function BalancesPage() {
  const ags = useDemo((s) => s.agreements);

  const cards: {
    code: CurrencyCode;
    availLabel: string;
    available: number;
    escrowLabel: string;
    escrow: number;
  }[] = [
    {
      code: "USD",
      availLabel: "USD · available",
      available: AVAILABLE.USD,
      escrowLabel: "Committed in escrow",
      escrow: committedUSD(ags),
    },
    {
      code: "INR",
      availLabel: "INR · available",
      available: AVAILABLE.INR,
      escrowLabel: "Incoming in escrow",
      escrow: incomingINR(ags),
    },
  ];

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Balances</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Your multi-currency account — money you hold, and money moving through escrow.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {cards.map((c) => (
          <div key={c.code} className="border border-border bg-card p-5">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">{c.availLabel}</p>
            <CountUp
              value={c.available}
              format={(n) => fmt(n, c.code)}
              className="mt-1 block font-mono text-3xl font-semibold tracking-tight"
            />
            <div className="mt-4 flex items-center justify-between border-t border-border pt-3 text-sm">
              <span className="text-muted-foreground">{c.escrowLabel}</span>
              <CountUp value={c.escrow} format={(n) => fmt(n, c.code)} className="font-mono" />
            </div>
          </div>
        ))}
      </div>

      <p className="text-xs text-muted-foreground/70">
        Held on Xe. Funds in escrow are locked at the agreed rate until release.
      </p>
    </div>
  );
}
