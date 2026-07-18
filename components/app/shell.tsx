"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  House,
  FileText,
  Wallet,
  ClockCounterClockwise,
  Plus,
  type IconProps,
} from "@phosphor-icons/react";
import { useDemo } from "@/lib/store";
import type { View } from "@/lib/types";
import { cn } from "@/lib/utils";
import { spring, tap } from "@/lib/motion";
import { buttonVariants } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { RateTicker } from "@/components/app/rate-ticker";
import { ForexRail } from "@/components/app/forex-rail";

const NAV: { href: string; label: string; icon: React.ComponentType<IconProps> }[] = [
  { href: "/app", label: "Home", icon: House },
  { href: "/app/agreements", label: "Agreements", icon: FileText },
  { href: "/app/balances", label: "Balances", icon: Wallet },
  { href: "/app/activity", label: "Activity", icon: ClockCounterClockwise },
];

function isActive(path: string, href: string) {
  if (href === "/app") return path === "/app";
  return path === href || path.startsWith(href + "/");
}

function ViewSwitch() {
  const view = useDemo((s) => s.view);
  const setView = useDemo((s) => s.setView);
  const views: { key: View; label: string }[] = [
    { key: "payments", label: "Payments" },
    { key: "receipts", label: "Receipts" },
  ];
  return (
    <div className="relative flex rounded-lg bg-muted p-0.5">
      {views.map((v) => (
        <button
          key={v.key}
          onClick={() => setView(v.key)}
          className={cn(
            "relative z-10 rounded-lg px-3 py-1.5 text-xs font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring",
            view === v.key ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground",
          )}
        >
          {view === v.key && (
            <motion.span
              layoutId="view-pill"
              transition={spring.snappy}
              className="absolute inset-0 -z-10 rounded-lg bg-primary"
            />
          )}
          {v.label}
        </button>
      ))}
    </div>
  );
}

function NavItem({
  href,
  label,
  icon: Icon,
  mobile,
  active,
}: {
  href: string;
  label: string;
  icon: React.ComponentType<IconProps>;
  mobile?: boolean;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        mobile
          ? "relative flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[11px] font-medium"
          : "relative flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium",
        "outline-none focus-visible:ring-2 focus-visible:ring-ring",
        active
          ? mobile
            ? "text-primary"
            : "text-foreground"
          : "text-muted-foreground hover:text-foreground",
      )}
    >
      {active && (
        <motion.span
          layoutId={mobile ? "nav-active-mobile" : "nav-active-desktop"}
          transition={spring.snappy}
          className={
            mobile
              ? "absolute inset-x-4 top-0 h-0.5 bg-primary"
              : "absolute inset-0 -z-10 rounded-lg bg-secondary"
          }
        />
      )}
      <Icon className={mobile ? "h-5 w-5" : "h-4 w-4"} weight={active ? "fill" : "regular"} />
      {label}
    </Link>
  );
}

const Brand = () => (
  <span className="flex items-center gap-2 text-sm font-semibold tracking-tight">
    <Logo className="h-5 w-auto text-primary" />
    Crow
  </span>
);

export function Shell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const router = useRouter();
  const view = useDemo((s) => s.view);
  const reset = useDemo((s) => s.reset);
  const hydrated = useDemo((s) => s.hydrated);
  const onboarded = useDemo((s) => s.onboarded);
  const business = useDemo((s) => s.profile?.business);
  const newAction =
    view === "payments"
      ? { href: "/app/new", label: "New payment" }
      : { href: "/app/request", label: "Request payment" };

  // gate the app behind onboarding — only after rehydrate (no SSR flash)
  useEffect(() => {
    if (hydrated && !onboarded) router.replace("/onboarding");
  }, [hydrated, onboarded, router]);

  if (hydrated && !onboarded) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* mobile top bar */}
      <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-border bg-background/80 px-5 backdrop-blur md:hidden">
        <Brand />
        <ViewSwitch />
      </header>

      {/* desktop top nav (Legend-style) */}
      <header className="sticky top-0 z-20 hidden h-14 items-center gap-6 border-b border-border bg-background/80 px-6 backdrop-blur md:flex">
        <Brand />
        <nav className="flex items-center gap-1">
          {NAV.map((n) => (
            <NavItem key={n.href} {...n} active={isActive(path, n.href)} />
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-3">
          <ViewSwitch />
          <motion.div whileTap={tap} transition={spring.snappy}>
            <Link href={newAction.href} className={cn(buttonVariants({ size: "sm" }))}>
              <Plus className="h-4 w-4" weight="bold" /> {newAction.label}
            </Link>
          </motion.div>
          <button onClick={reset} className="text-xs text-muted-foreground hover:text-foreground">
            Reset
          </button>
          {business && (
            <span className="flex items-center gap-2 border-l border-border pl-3 text-sm font-medium">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/15 text-xs font-semibold text-primary">
                {business.charAt(0).toUpperCase()}
              </span>
              <span className="hidden lg:inline">{business}</span>
            </span>
          )}
        </div>
      </header>

      {/* mobile ticker */}
      <div className="md:hidden">
        <RateTicker />
      </div>

      {/* body: full-bleed content + persistent forex rail (desktop) */}
      <div className="flex">
        <main className="min-w-0 flex-1">
          <div className="px-5 py-8 pb-24 md:px-8 md:py-8 md:pb-8">{children}</div>
        </main>
        <aside className="hidden w-80 shrink-0 border-l border-border lg:block">
          <ForexRail />
        </aside>
      </div>

      {/* mobile bottom tabs */}
      <nav className="fixed bottom-0 left-0 right-0 z-20 flex border-t border-border bg-background/90 backdrop-blur md:hidden">
        {NAV.map((n) => (
          <NavItem key={n.href} {...n} mobile active={isActive(path, n.href)} />
        ))}
      </nav>

      {/* mobile FAB */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ ...spring.bouncy, delay: 0.2 }}
        whileTap={tap}
        className="fixed bottom-20 right-5 z-30 md:hidden"
      >
        <Link
          href={newAction.href}
          aria-label={newAction.label}
          className="flex h-14 w-14 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-lifted outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <Plus className="h-6 w-6" weight="bold" />
        </Link>
      </motion.div>
    </div>
  );
}
