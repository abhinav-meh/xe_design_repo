"use client";

import { motion } from "framer-motion";
import { Lock } from "@phosphor-icons/react";
import { cn, fmt } from "@/lib/utils";
import type { CurrencyCode } from "@/lib/types";
import { Pill, PillDelta } from "@/components/kibo-ui/pill";
import { CountUp } from "./count-up";
import { spring } from "@/lib/motion";

/*
  How money reads in the product. Brutal-dark: `surface="premium"` is a hard
  black card with a lime border + CRED-style hard offset shadow, and the amount
  is a big lime mono number that counts up. Numbers are tabular. Square corners.
*/
export function MoneyDisplay({
  value,
  currency,
  label,
  locked = false,
  surface = "light",
  delta,
  deltaLabel = "vs today's rate",
  className,
}: {
  value: number;
  currency: CurrencyCode;
  label?: string;
  locked?: boolean;
  surface?: "light" | "premium";
  delta?: number;
  deltaLabel?: string;
  className?: string;
}) {
  const premium = surface === "premium";
  return (
    <div
      className={cn(
        "relative min-w-0 p-6",
        premium
          ? "border border-money-accent bg-money text-money-foreground shadow-[6px_6px_0_0_hsl(var(--money-accent))]"
          : "border border-border bg-card text-card-foreground",
        className,
      )}
    >
      {label && (
        <p
          className={cn(
            "text-xs font-medium uppercase tracking-widest",
            premium ? "text-money-muted-foreground" : "text-muted-foreground",
          )}
        >
          {label}
        </p>
      )}

      <div className="mt-2">
        <CountUp
          value={value}
          format={(n) => fmt(Math.round(n), currency)}
          className={cn(
            "font-mono tabular text-3xl font-semibold tracking-tight sm:text-display-sm",
            premium && "text-money-accent",
          )}
        />
      </div>

      {delta !== undefined && (
        <div className="mt-3">
          <Pill>
            <PillDelta delta={delta} />
            {delta > 0 ? `Up ${delta}%` : delta < 0 ? `Down ${Math.abs(delta)}%` : "No change"}
            <span className="text-muted-foreground">· {deltaLabel}</span>
          </Pill>
        </div>
      )}

      {locked && (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={spring.smooth}
          className="mt-3"
        >
          <Pill className={premium ? "border-money-accent/40 bg-money-accent/10 text-money-accent" : ""}>
            <Lock className="h-3 w-3" weight="bold" />
            Rate locked until release
          </Pill>
        </motion.div>
      )}
    </div>
  );
}
