"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "@phosphor-icons/react";
import { useDemo } from "@/lib/store";
import { spring, staggerContainer, staggerItem, tap } from "@/lib/motion";
import { fxCurrent, fxChangePct } from "@/lib/fx";
import { useLiveRate } from "@/lib/use-live-rate";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/ui/logo";
import { Ambient } from "@/components/ui/ambient";

const FEATURES = [
  { k: "Collect · Convert · Hold · Send", v: "The full escrow instrument, on Xe's rails." },
  { k: "Services + Goods", v: "AI drafts the acceptance terms from your brief or docs." },
  { k: "Rate locked, both ways", v: "Guaranteed local amount from the second it's funded." },
];

function LiveRate() {
  const { rate, flash } = useLiveRate(fxCurrent);
  return (
    <span className="inline-flex items-center gap-2 border border-border px-3 py-1.5 text-xs">
      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
      <span className="text-muted-foreground">USD → INR</span>
      <span
        className={cn(
          "font-mono tabular transition-colors duration-500",
          flash > 0 && "text-primary",
          flash < 0 && "text-red-500",
        )}
      >
        ₹{rate.toFixed(2)}
      </span>
      <span className="font-mono text-muted-foreground">
        {fxChangePct > 0 ? "+" : ""}
        {fxChangePct}%
      </span>
    </span>
  );
}

export default function Home() {
  const hydrated = useDemo((s) => s.hydrated);
  const onboarded = useDemo((s) => s.onboarded);
  const business = useDemo((s) => s.profile?.business);
  // until rehydrated, always show the fresh-visit CTA (avoids hydration mismatch)
  const returning = hydrated && onboarded;
  const cta = returning
    ? { href: "/app", label: `Continue as ${business ?? "your account"}` }
    : { href: "/onboarding", label: "Get started" };

  return (
    <>
      <Ambient />
      <motion.main
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center gap-10 px-6 py-16"
      >
      <div className="space-y-5">
        <motion.div variants={staggerItem} className="flex flex-wrap items-center gap-3">
          <span className="flex items-center gap-2 text-sm font-semibold tracking-tight">
            <Logo className="h-5 w-auto text-primary" />
            Crow
          </span>
          <LiveRate />
        </motion.div>
        <motion.h1
          variants={staggerItem}
          className="max-w-2xl text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl"
        >
          Escrow for cross-border business — <span className="text-primary">both directions.</span>
        </motion.h1>
        <motion.p variants={staggerItem} className="max-w-xl text-lg text-muted-foreground">
          Pay suppliers and freelancers, get paid by clients. Services or goods. The exchange rate
          locks the moment funds are secured — so neither side loses to FX between the deal and the
          delivery.
        </motion.p>
      </div>

      <motion.div variants={staggerItem} className="grid gap-px border border-border bg-border sm:grid-cols-3">
        {FEATURES.map((f) => (
          <div key={f.k} className="bg-card p-5">
            <p className="text-sm font-medium">{f.k}</p>
            <p className="mt-1 text-sm text-muted-foreground">{f.v}</p>
          </div>
        ))}
      </motion.div>

      <motion.div variants={staggerItem} className="flex flex-wrap items-center gap-3">
        <motion.div whileTap={tap} transition={spring.snappy}>
          <Link
            href={cta.href}
            className="inline-flex h-12 items-center gap-2 bg-primary px-6 text-sm font-medium text-primary-foreground outline-none transition-[filter] hover:brightness-[1.06] focus-visible:ring-2 focus-visible:ring-ring"
          >
            {cta.label} <ArrowRight className="h-4 w-4" weight="bold" />
          </Link>
        </motion.div>
        <motion.div whileTap={tap} transition={spring.snappy}>
          <Link
            href="/system"
            className="inline-flex h-12 items-center bg-secondary px-6 text-sm font-medium text-secondary-foreground outline-none transition-colors hover:bg-secondary/80 focus-visible:ring-2 focus-visible:ring-ring"
          >
            Design system
          </Link>
        </motion.div>
        <Link
          href="/login"
          className="inline-flex h-12 items-center px-3 text-sm font-medium text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
        >
          Log in
        </Link>
      </motion.div>

      <motion.p variants={staggerItem} className="text-xs text-muted-foreground/70">
        Demo — you&apos;re viewing a sample multi-currency account that both pays and gets paid.
      </motion.p>
      </motion.main>
    </>
  );
}
