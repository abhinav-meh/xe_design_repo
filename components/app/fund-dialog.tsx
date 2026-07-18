"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Check, Lock } from "@phosphor-icons/react";
import { useDemo } from "@/lib/store";
import type { Agreement } from "@/lib/types";
import { cn, fmt, receiverAmount } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { spring } from "@/lib/motion";

/*
  "The Lock" — the magic moment. The receiver's guaranteed amount ticks with the
  live market (FX uncertainty); on confirm it snaps and freezes — the differentiator
  made visceral: your money, certain across the border.
*/
export function FundDialog({ a }: { a: Agreement }) {
  const fund = useDemo((s) => s.fund);
  const [open, setOpen] = useState(false);
  const [locked, setLocked] = useState(false);
  const reduce = useReducedMotion();
  const timer = useRef<ReturnType<typeof setTimeout>>();

  const target = receiverAmount(a.amount, a.lockedRate);
  const cpFirst = a.counterparty.name.split(" ")[0];

  useEffect(() => {
    if (!open) setLocked(false);
  }, [open]);

  // don't leave a pending fund() scheduled if the dialog unmounts mid-lock
  useEffect(() => () => clearTimeout(timer.current), []);

  function confirm() {
    setLocked(true);
    timer.current = setTimeout(
      () => {
        fund(a.id);
        setOpen(false);
      },
      reduce ? 650 : 2600,
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className={cn(buttonVariants({ size: "lg" }), "w-full")}>
        <Lock className="h-4 w-4" weight="bold" /> Fund {fmt(a.amount, "USD")} · lock the rate
      </DialogTrigger>

      <DialogContent className="max-w-sm text-center">
        <DialogTitle className="text-center">{locked ? "Rate locked" : "Confirm deposit"}</DialogTitle>
        {!locked && (
          <p className="mt-1 text-center text-sm text-muted-foreground">
            The rate locks the instant you fund — no FX surprise.
          </p>
        )}

        {/* the moment */}
        <div className="relative my-7 flex flex-col items-center">
          {locked && (
            <motion.div
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={spring.smooth}
              className="pointer-events-none absolute -inset-8 -z-10 rounded-full bg-primary/20 blur-3xl"
            />
          )}
          <p className="text-xs uppercase tracking-widest text-muted-foreground">
            {cpFirst} receives
          </p>
          <TickingAmount target={target} locked={locked} />
          <motion.div
            initial={false}
            animate={{ opacity: locked ? 1 : 0, y: locked ? 0 : 8 }}
            transition={spring.smooth}
            className="mt-3 h-6"
          >
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/40 bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
              <Lock className="h-3 w-3" weight="fill" /> Guaranteed until release
            </span>
          </motion.div>
        </div>

        <div className="border border-border text-sm">
          <Row k="You pay" v={fmt(a.amount, "USD")} />
          <Row k="Locked rate" v={`₹${a.lockedRate.toFixed(2)} / $1`} locked={locked} />
        </div>

        {!locked ? (
          <Button onClick={confirm} size="lg" className="mt-4 w-full">
            <Lock className="h-4 w-4" weight="bold" /> Confirm &amp; lock rate
          </Button>
        ) : (
          <div className="mt-4 flex items-center justify-center gap-2 py-3 text-sm font-medium text-primary">
            <Check className="h-4 w-4" weight="bold" /> Funds secured
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function TickingAmount({ target, locked }: { target: number; locked: boolean }) {
  return (
    <motion.p
      key={locked ? "locked" : "idle"}
      animate={locked ? { scale: [1.12, 1] } : {}}
      transition={spring.snappy}
      className={cn(
        "font-mono tabular text-4xl font-semibold tracking-tight",
        locked ? "text-primary" : "text-foreground",
      )}
    >
      {fmt(target, "INR")}
    </motion.p>
  );
}

function Row({ k, v, locked }: { k: string; v: string; locked?: boolean }) {
  return (
    <div className="flex items-center justify-between border-b border-border/60 px-4 py-2.5 last:border-0">
      <span className="text-muted-foreground">{k}</span>
      <span className={cn("font-mono", locked && "text-primary")}>{v}</span>
    </div>
  );
}
