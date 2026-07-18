"use client";

import { CaretDown, CaretUp, Minus } from "@phosphor-icons/react";
import { CORRIDORS, FX_SERIES, fxCurrent, fxChange, fxChangePct, totalProtected } from "@/lib/fx";
import { useDemo } from "@/lib/store";
import { cn, fmt } from "@/lib/utils";
import { useLiveRate } from "@/lib/use-live-rate";
import { Sparkline } from "@/components/ui/sparkline";
import { CountUp } from "@/components/ui/count-up";
import { Divider } from "@/components/ui/divider";

function Delta({ d }: { d: number }) {
  const Icon = d > 0 ? CaretUp : d < 0 ? CaretDown : Minus;
  const tone = d > 0 ? "text-primary" : d < 0 ? "text-red-500" : "text-muted-foreground";
  return (
    <span className={`inline-flex items-center gap-0.5 font-mono text-xs ${tone}`}>
      <Icon className="h-3 w-3" weight="bold" />
      {Math.abs(d).toFixed(1)}%
    </span>
  );
}

/* Persistent desktop right rail — a quietly living forex board. */
export function ForexRail() {
  const ags = useDemo((s) => s.agreements);
  const protectedTotal = totalProtected(ags);
  const { rate, flash } = useLiveRate(fxCurrent);

  return (
    <div className="sticky top-14 flex h-[calc(100vh-3.5rem)] flex-col overflow-y-auto p-5">
      <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Markets</p>

      {/* featured: your corridor */}
      <div className="mt-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">USD → INR</span>
          <Delta d={fxChangePct} />
        </div>
        <div className="mt-1 flex items-end justify-between gap-3">
          <span
            className={cn(
              "font-mono text-2xl font-semibold tabular tracking-tight transition-colors duration-500",
              flash > 0 && "text-primary",
              flash < 0 && "text-red-500",
            )}
          >
            ₹{rate.toFixed(2)}
          </span>
          <Sparkline series={FX_SERIES} up={fxChange >= 0} className="h-8 w-28" />
        </div>
        <div className="mt-3 flex items-center justify-between border border-border bg-card px-3 py-2 text-sm">
          <span className="text-muted-foreground">FX protected</span>
          <CountUp value={protectedTotal} format={(n) => fmt(n, "INR")} className="font-mono text-primary" />
        </div>
      </div>

      <Divider className="my-4" />

      <p className="text-xs uppercase tracking-widest text-muted-foreground/70">Other corridors</p>
      <div className="mt-2">
        {CORRIDORS.slice(1).map((c, i) => (
          <div key={c.pair}>
            {i > 0 && <Divider />}
            <div className="flex items-center justify-between py-2.5 text-sm">
              <span className="text-muted-foreground">{c.pair}</span>
              <div className="flex items-center gap-3">
                <span className="font-mono">{c.rate}</span>
                <Delta d={c.d} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <p className="mt-auto pt-4 text-[11px] text-muted-foreground/60">
        Indicative rates · locked at funding
      </p>
    </div>
  );
}
