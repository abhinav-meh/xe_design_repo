"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, Check, ArrowDownLeft, ArrowUpRight, ArrowsLeftRight } from "@phosphor-icons/react";
import { useDemo } from "@/lib/store";
import type { AccountUse, Profile } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { MorphingPanel } from "@/components/ui/morphing-panel";
import { ease, spring, staggerContainer, staggerItem, tap } from "@/lib/motion";

type Step = "intro" | "you" | "home" | "use" | "contacts" | "review";

/** Steps shown in the progress indicator (intro is a framing screen, excluded). */
const STEPS: { key: Step; label: string }[] = [
  { key: "you", label: "You" },
  { key: "home", label: "Home" },
  { key: "use", label: "Usage" },
  { key: "contacts", label: "Contacts" },
  { key: "review", label: "Review" },
];

const COUNTRIES: { country: string; currency: string }[] = [
  { country: "United States", currency: "USD" },
  { country: "United Kingdom", currency: "GBP" },
  { country: "Canada", currency: "CAD" },
  { country: "Australia", currency: "AUD" },
  { country: "Singapore", currency: "SGD" },
  { country: "United Arab Emirates", currency: "AED" },
  { country: "India", currency: "INR" },
];

const USES: { key: AccountUse; label: string; desc: string; Icon: typeof ArrowUpRight }[] = [
  { key: "paying", label: "Mostly pay out", desc: "You pay suppliers, freelancers and vendors abroad.", Icon: ArrowUpRight },
  { key: "receiving", label: "Mostly get paid", desc: "Clients and customers abroad pay you.", Icon: ArrowDownLeft },
  { key: "both", label: "Both", desc: "Money moves in and out across borders.", Icon: ArrowsLeftRight },
];

const CONTACTS = ["Freelancers", "Suppliers / manufacturers", "Agencies", "Clients / customers"];
const REGIONS = ["India", "Philippines", "Latin America", "Eastern Europe", "Southeast Asia"];

/* Chip selector — matches the wizard's service/goods button pattern. */
function Chip({ selected, onClick, children }: { selected: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <motion.button
      type="button"
      whileTap={tap}
      transition={spring.snappy}
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring",
        selected
          ? "border-primary bg-primary/10 text-foreground"
          : "border-border text-muted-foreground hover:text-foreground",
      )}
    >
      {selected && <Check className="h-3.5 w-3.5 text-primary" weight="bold" />}
      {children}
    </motion.button>
  );
}

export function OnboardingFlow() {
  const router = useRouter();
  const completeOnboarding = useDemo((s) => s.completeOnboarding);
  const alreadyOnboarded = useDemo((s) => s.onboarded);
  const existing = useDemo((s) => s.profile);

  const [step, setStep] = useState<Step>("intro");
  const [name, setName] = useState(existing?.name ?? "");
  const [business, setBusiness] = useState(existing?.business ?? "");
  const [country, setCountry] = useState(existing?.country ?? "");
  const [use, setUse] = useState<AccountUse | null>(existing?.use ?? null);
  const [worksWith, setWorksWith] = useState<string[]>(existing?.worksWith ?? []);

  const currency = COUNTRIES.find((c) => c.country === country)?.currency ?? "";
  const firstName = name.trim().split(" ")[0] || business.trim() || "there";

  const idx = STEPS.findIndex((s) => s.key === step);
  const toggle = (v: string) =>
    setWorksWith((w) => (w.includes(v) ? w.filter((x) => x !== v) : [...w, v]));

  function finish() {
    if (!use) return;
    const profile: Profile = {
      name: name.trim(),
      business: business.trim(),
      country,
      currency,
      use,
      worksWith,
    };
    completeOnboarding(profile);
    router.push("/app");
  }

  const body = useMemo(() => {
    switch (step) {
      case "intro":
        return (
          <motion.div variants={staggerContainer} initial="hidden" animate="show" className="space-y-5">
            <motion.div variants={staggerItem} className="flex items-center gap-2 text-sm font-semibold tracking-tight">
              <Logo className="h-6 w-auto text-primary" />
              Crow
            </motion.div>
            <motion.h1 variants={staggerItem} className="max-w-xl text-3xl font-semibold leading-[1.15] tracking-tight sm:text-4xl">
              Escrow for cross-border business — <span className="text-primary">both directions.</span>
            </motion.h1>
            <motion.p variants={staggerItem} className="max-w-lg text-muted-foreground">
              You pay people abroad, and you get paid by them. Every deal is held in escrow, and the
              exchange rate locks the moment it&apos;s funded — so no one goes first on faith, and no
              one loses to FX. Let&apos;s set up your account.
            </motion.p>
            <motion.div variants={staggerItem}>
              <Button onClick={() => setStep("you")} size="lg">
                Get started <ArrowRight className="h-4 w-4" weight="bold" />
              </Button>
            </motion.div>
          </motion.div>
        );

      case "you":
        return (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Your name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Arden Okafor"
                className="mt-2 h-11 w-full border border-border bg-card px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Business name</label>
              <p className="mt-0.5 text-xs text-muted-foreground">This is how your account is shown.</p>
              <input
                value={business}
                onChange={(e) => setBusiness(e.target.value)}
                placeholder="e.g. Arden Studio"
                className="mt-2 h-11 w-full border border-border bg-card px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>
        );

      case "home":
        return (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Where are you based?</label>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Your counterparties get a guaranteed local amount; you get cost certainty.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {COUNTRIES.map((c) => (
                <Chip key={c.country} selected={country === c.country} onClick={() => setCountry(c.country)}>
                  {c.country}
                </Chip>
              ))}
            </div>
            {currency && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={spring.smooth}
                className="flex items-center gap-3 border border-border bg-muted/40 px-3 py-2.5 text-sm"
              >
                <span className="text-muted-foreground">Home currency</span>
                <span className="font-medium">{currency}</span>
              </motion.div>
            )}
          </div>
        );

      case "use":
        return (
          <div className="space-y-3">
            <label className="text-sm font-medium">How will you mostly use Crow?</label>
            <div className="grid gap-2">
              {USES.map(({ key, label, desc, Icon }) => (
                <motion.button
                  key={key}
                  type="button"
                  whileTap={tap}
                  transition={spring.snappy}
                  onClick={() => setUse(key)}
                  className={cn(
                    "flex items-start gap-3 border p-4 text-left outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    use === key
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-muted-foreground/40",
                  )}
                >
                  <Icon className={cn("mt-0.5 h-5 w-5 shrink-0", use === key ? "text-primary" : "text-muted-foreground")} weight="bold" />
                  <div>
                    <p className="text-sm font-medium">{label}</p>
                    <p className="mt-0.5 text-sm text-muted-foreground">{desc}</p>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        );

      case "contacts":
        return (
          <div className="space-y-5">
            <div>
              <label className="text-sm font-medium">Who do you transact with?</label>
              <p className="mt-0.5 text-xs text-muted-foreground">Optional — pick any that apply.</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {CONTACTS.map((c) => (
                  <Chip key={c} selected={worksWith.includes(c)} onClick={() => toggle(c)}>
                    {c}
                  </Chip>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">Regions</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {REGIONS.map((r) => (
                  <Chip key={r} selected={worksWith.includes(r)} onClick={() => toggle(r)}>
                    {r}
                  </Chip>
                ))}
              </div>
            </div>
          </div>
        );

      case "review": {
        const useLabel = USES.find((u) => u.key === use)?.label ?? "—";
        const recap = [
          business || "Your business",
          [country, currency].filter(Boolean).join(" · ") || "—",
          useLabel,
          ...worksWith,
        ];
        return (
          <div className="space-y-4">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">You&apos;re all set, {firstName}.</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                We&apos;ve loaded a sample account — real deals across both sides — so you can explore
                right away.
              </p>
            </div>
            <motion.div variants={staggerContainer} initial="hidden" animate="show" className="flex flex-wrap gap-2">
              {recap.map((r, i) => (
                <motion.span
                  key={`${r}-${i}`}
                  variants={staggerItem}
                  className="inline-flex items-center rounded-full border border-border bg-card px-3 py-1.5 text-sm"
                >
                  {r}
                </motion.span>
              ))}
            </motion.div>
          </div>
        );
      }
    }
  }, [step, name, business, country, currency, use, worksWith, firstName]);

  const canContinue =
    (step === "you" && business.trim().length > 0) ||
    (step === "home" && country.length > 0) ||
    (step === "use" && use !== null) ||
    step === "contacts";

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-lg flex-col justify-center px-6 py-16">
      {/* progress indicator (hidden on the intro framing screen) */}
      {step !== "intro" && (
        <div className="mb-6 flex items-center gap-2">
          {STEPS.map((s, i) => (
            <div key={s.key} className="flex items-center gap-2">
              <span
                className={cn(
                  "text-xs font-medium transition-colors",
                  i <= idx ? "text-foreground" : "text-muted-foreground/50",
                )}
              >
                {s.label}
              </span>
              {i < STEPS.length - 1 && (
                <span className={cn("h-px w-4 transition-colors", i < idx ? "bg-foreground" : "bg-border")} />
              )}
            </div>
          ))}
        </div>
      )}

      <MorphingPanel>
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.22, ease: ease.out }}
        >
          {body}
        </motion.div>
      </MorphingPanel>

      {step !== "intro" && (
        <div className="mt-8 flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => setStep(step === "review" ? "contacts" : STEPS[idx - 1]?.key ?? "you")}
          >
            Back
          </Button>
          {step === "review" ? (
            <Button onClick={finish}>
              Enter dashboard <ArrowRight className="h-4 w-4" weight="bold" />
            </Button>
          ) : (
            <Button onClick={() => setStep(STEPS[idx + 1].key)} disabled={!canContinue}>
              Continue <ArrowRight className="h-4 w-4" weight="bold" />
            </Button>
          )}
        </div>
      )}

      {step === "intro" && alreadyOnboarded && (
        <button
          onClick={() => router.push("/app")}
          className="mt-6 text-left text-sm text-muted-foreground underline-offset-4 outline-none hover:text-foreground hover:underline focus-visible:ring-2 focus-visible:ring-ring"
        >
          Skip — continue to dashboard
        </button>
      )}
    </div>
  );
}
