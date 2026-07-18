"use client";

import { FX_SERIES, fxCurrent, fxChange, fxChangePct, totalProtected } from "@/lib/fx";
import { useDemo } from "@/lib/store";
import { cn, fmt } from "@/lib/utils";
import { useLiveRate } from "@/lib/use-live-rate";
import { Sparkline } from "@/components/ui/sparkline";
import { CountUp } from "@/components/ui/count-up";
import { Pill, PillDelta } from "@/components/kibo-ui/pill";

/* Compact FX / rate-lock widget — context + the differentiator stat, not a hero chart. */
export function FxWidget() {
  const ags = useDemo((s) => s.agreements);
  const protectedTotal = totalProtected(ags);
  const { rate, flash } = useLiveRate(fxCurrent);

  return (
    <div className="border border-border bg-card p-4">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase tracking-widest text-muted-foreground">USD → INR</p>
        <Pill>
          <PillDelta delta={fxChangePct} />
          {fxChangePct}%
        </Pill>
      </div>
      <div className="mt-2 flex items-end justify-between gap-3">
        <p
          className={cn(
            "font-mono text-2xl font-semibold tabular tracking-tight transition-colors duration-500",
            flash > 0 && "text-primary",
            flash < 0 && "text-red-500",
          )}
        >
          ₹{rate.toFixed(2)}
        </p>
        <Sparkline series={FX_SERIES} up={fxChange >= 0} className="h-8 w-24" />
      </div>
      <div className="mt-3 flex items-center justify-between border-t border-border pt-3 text-sm">
        <span className="text-muted-foreground">FX protected</span>
        <CountUp value={protectedTotal} format={(n) => fmt(n, "INR")} className="font-mono text-primary" />
      </div>
    </div>
  );
}
