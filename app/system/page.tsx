"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { motion, type Transition } from "framer-motion";
import { Lock, TrendUp, Truck } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import {
  Pill,
  PillIndicator,
  PillDelta,
  PillStatus,
  PillIcon,
} from "@/components/kibo-ui/pill";
import { MoneyDisplay } from "@/components/ui/money";
import { CriterionRow } from "@/components/ui/criterion-row";
import { SlideToConfirm } from "@/components/ui/slide-to-confirm";
import { Divider } from "@/components/ui/divider";
import { Sparkline } from "@/components/ui/sparkline";
import { CountUp } from "@/components/ui/count-up";
import { ProvenanceText } from "@/components/ui/provenance-text";
import { Logo } from "@/components/ui/logo";
import { MorphDemo, StaggerDemo } from "@/components/system/motion-demos";
import { spring } from "@/lib/motion";

function Section({
  title,
  hint,
  children,
}: {
  title: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-border py-12">
      <div className="mb-6">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
          {title}
        </h2>
        {hint && <p className="mt-1 text-sm text-muted-foreground/80">{hint}</p>}
      </div>
      {children}
    </section>
  );
}

function Swatch({
  name,
  className,
  ring,
}: {
  name: string;
  className: string;
  ring?: boolean;
}) {
  return (
    <div className="space-y-1.5">
      <div
        className={`h-16 w-full rounded-lg ${className} ${
          ring ? "ring-1 ring-border" : ""
        }`}
      />
      <p className="text-xs text-muted-foreground">{name}</p>
    </div>
  );
}

const springDemos = [
  { name: "snappy", cfg: spring.snappy, note: "default UI" },
  { name: "smooth", cfg: spring.smooth, note: "panels / steps" },
  { name: "morph", cfg: spring.morph, note: "height / layout" },
  { name: "gentle", cfg: spring.gentle, note: "sheets" },
  { name: "bouncy", cfg: spring.bouncy, note: "accent" },
];

/*
  A single spring track. Measures its own width so the knob travels the
  real pixel distance (transform-% is relative to the knob itself, not the
  track — animating in px is the only reliable way to spring this).
*/
const KNOB = 36; // h-9 / w-9
function SpringTrack({ cfg, play }: { cfg: Transition; play: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const [travel, setTravel] = useState(0);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => setTravel(Math.max(0, el.offsetWidth - KNOB));
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return (
    <div ref={ref} className="relative h-9 flex-1 rounded-full bg-muted">
      <motion.div
        animate={{ x: play ? travel : 0 }}
        transition={cfg}
        className="absolute left-0 top-0 h-9 w-9 rounded-full bg-primary shadow-soft"
      />
    </div>
  );
}

/* The brief the acceptance-terms are traced back to (provenance demo). */
const BRIEF =
  "Redesign the marketing site: hero, features, pricing and testimonials. Clean, modern look — reference Linear. Ship within 14 days with 2 rounds of revisions included.";

export default function SystemPage() {
  const [play, setPlay] = useState(false);
  const [slideRound, setSlideRound] = useState(0); // remount SlideToConfirm to replay
  const [countKey, setCountKey] = useState(0); // remount CountUp to replay
  const [highlight, setHighlight] = useState<string | null>("within 14 days");

  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <header className="space-y-4">
        <div className="flex items-center gap-2">
          <Logo className="h-6 w-6 text-primary" />
          <span className="text-lg font-semibold tracking-tight">Crow</span>
        </div>
        <Pill>
          <PillIndicator variant="success" />
          Live design system
        </Pill>
        <h1 className="text-display-sm font-semibold tracking-tight">
          Cross-border escrow, alive.
        </h1>
        <p className="max-w-xl text-lg text-muted-foreground">
          Near-black base · chartreuse money accent · Overused Grotesk with Geist
          Mono numerals · Family/CRED spring motion. Every value below is a token
          in <code className="text-sm">globals.css</code> /{" "}
          <code className="text-sm">tailwind.config.ts</code> /{" "}
          <code className="text-sm">lib/motion.ts</code> — change one and the whole
          app re-skins.
        </p>
      </header>

      {/* COLOR */}
      <Section title="Color" hint="Semantic tokens, not raw hex. Dark base, single chartreuse accent.">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Swatch name="background" className="bg-background" ring />
          <Swatch name="foreground" className="bg-foreground" />
          <Swatch name="primary (chartreuse)" className="bg-primary" />
          <Swatch name="accent" className="bg-accent" />
          <Swatch name="muted" className="bg-muted" ring />
          <Swatch name="secondary" className="bg-secondary" ring />
          <Swatch name="card" className="bg-card" ring />
          <Swatch name="border" className="bg-border" />
        </div>
        <p className="mb-3 mt-8 text-xs font-medium uppercase tracking-widest text-muted-foreground">
          Money surface (reserved for money moments)
        </p>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Swatch name="money" className="bg-money" ring />
          <Swatch name="money.foreground" className="bg-money-foreground" ring />
          <Swatch name="money.accent" className="bg-money-accent" />
          <Swatch name="money.border" className="bg-money-border" />
        </div>
      </Section>

      {/* TYPOGRAPHY */}
      <Section
        title="Typography"
        hint="Overused Grotesk (self-hosted, variable) for everything · Geist Mono for money numbers."
      >
        <div className="space-y-4">
          <p className="text-display-lg font-semibold tracking-tight">Aa 128</p>
          <p className="text-display-sm font-semibold tracking-tight">
            Display — the numbers that carry weight
          </p>
          <p className="text-xl font-medium">Heading — clear and confident</p>
          <p className="text-base text-foreground">
            Body — the workflow copy. Calm, legible, unhurried.
          </p>
          <p className="text-sm text-muted-foreground">
            Caption / muted — supporting detail.
          </p>
          <Divider className="my-2" />
          <p className="font-mono tabular text-2xl font-semibold text-primary">
            ₹ 1,234,567.89
          </p>
          <p className="text-xs text-muted-foreground">
            Geist Mono + tabular numerals — money never jitters as it counts.
          </p>
        </div>
      </Section>

      {/* RADII + ELEVATION */}
      <Section
        title="Shape & elevation"
        hint="Soft radii (0.5rem base) + squircle corner-smoothing · dark shadows + a CRED-style hard offset."
      >
        <div className="flex flex-wrap items-end gap-6">
          {[
            { r: "rounded-sm", l: "sm" },
            { r: "rounded-md", l: "md" },
            { r: "rounded-lg", l: "lg" },
            { r: "rounded-xl", l: "xl" },
            { r: "rounded-2xl", l: "2xl" },
          ].map((x) => (
            <div key={x.l} className="space-y-1.5 text-center">
              <div className={`h-16 w-16 bg-secondary ${x.r} ring-1 ring-border`} />
              <p className="text-xs text-muted-foreground">{x.l}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap gap-8">
          {[
            { s: "shadow-soft", l: "soft" },
            { s: "shadow-lifted", l: "lifted" },
            { s: "shadow-money", l: "money" },
          ].map((x) => (
            <div key={x.l} className="space-y-1.5 text-center">
              <div className={`h-20 w-32 rounded-lg bg-card ${x.s}`} />
              <p className="text-xs text-muted-foreground">{x.l}</p>
            </div>
          ))}
          <div className="space-y-1.5 text-center">
            <div className="h-20 w-32 rounded-lg border border-primary bg-card shadow-[6px_6px_0_0_hsl(var(--primary))]" />
            <p className="text-xs text-muted-foreground">hard (offset)</p>
          </div>
        </div>
      </Section>

      {/* MOTION */}
      <Section
        title="Motion"
        hint="The signature. Tap play to feel all five springs at once."
      >
        <Button variant="secondary" size="sm" onClick={() => setPlay((p) => !p)}>
          {play ? "Reset" : "Play"} springs
        </Button>
        <div className="mt-6 space-y-4">
          {springDemos.map((d) => (
            <div key={d.name} className="flex items-center gap-4">
              <div className="w-28 shrink-0">
                <p className="text-sm font-medium">{d.name}</p>
                <p className="text-xs text-muted-foreground">{d.note}</p>
              </div>
              <SpringTrack cfg={d.cfg} play={play} />
            </div>
          ))}
        </div>
      </Section>

      {/* CONTAINER MORPH + REVEAL */}
      <Section
        title="Container morph & staggered reveal"
        hint="The Family / ConnectKit signature — the panel springs to its new height as content changes; items assemble in. The feel of the acceptance-terms drafting step."
      >
        <div className="grid gap-10 sm:grid-cols-2">
          <div>
            <p className="mb-3 text-sm font-medium">Height morph between steps</p>
            <MorphDemo />
          </div>
          <div>
            <p className="mb-3 text-sm font-medium">Staggered reveal</p>
            <StaggerDemo />
          </div>
        </div>
      </Section>

      {/* COMPONENTS */}
      <Section title="Components" hint="Primitives, each with real motion + states.">
        <div className="space-y-12">
          {/* Buttons */}
          <div>
            <p className="mb-3 text-xs font-medium uppercase tracking-widest text-muted-foreground">
              Buttons
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="primary">Fund &amp; send</Button>
              <Button variant="secondary">Request changes</Button>
              <Button variant="ghost">Cancel</Button>
              <Button variant="primary" disabled>
                Disabled
              </Button>
            </div>
          </div>

          {/* Pills */}
          <div>
            <p className="mb-3 text-xs font-medium uppercase tracking-widest text-muted-foreground">
              Pills (Kibo family) — status, indicators, deltas
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <Pill>
                <PillIndicator variant="neutral" />
                Proposed
              </Pill>
              <Pill>
                <PillIndicator variant="success" pulse />
                Funded
              </Pill>
              <Pill>
                <PillIndicator variant="error" />
                Changes requested
              </Pill>
              <Pill>
                <Lock className="h-3 w-3" weight="bold" /> Rate locked
              </Pill>
              <Pill>
                <PillIcon icon={Truck} />
                Goods
              </Pill>
              <Pill>
                <PillDelta delta={1.5} />
                Up 1.5%
                <PillStatus>vs today</PillStatus>
              </Pill>
              <Pill>
                <PillDelta delta={-0.5} />
                Down 0.5%
              </Pill>
            </div>
          </div>

          {/* Money */}
          <div>
            <p className="mb-3 text-xs font-medium uppercase tracking-widest text-muted-foreground">
              Money display — light vs. premium, with FX delta
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <MoneyDisplay surface="light" label="You pay" value={1200} currency="USD" />
              <MoneyDisplay
                surface="premium"
                label="Priya receives"
                value={99840}
                currency="INR"
                delta={1.5}
                locked
              />
            </div>
          </div>

          {/* CountUp */}
          <div>
            <p className="mb-3 text-xs font-medium uppercase tracking-widest text-muted-foreground">
              CountUp — money resolves by counting, not appearing
            </p>
            <div className="flex items-center gap-4">
              <CountUp
                key={countKey}
                value={99840}
                format={(n) => `₹ ${Math.round(n).toLocaleString("en-IN")}`}
                className="font-mono tabular text-display-sm font-semibold text-primary"
              />
              <Button variant="secondary" size="sm" onClick={() => setCountKey((k) => k + 1)}>
                Replay
              </Button>
            </div>
          </div>

          {/* Sparkline */}
          <div>
            <p className="mb-3 text-xs font-medium uppercase tracking-widest text-muted-foreground">
              Sparkline — tiny live trend line (draws in, breathing endpoint)
            </p>
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2">
                <TrendUp className="h-4 w-4 text-primary" weight="bold" />
                <Sparkline series={[3, 4, 3.5, 5, 4.8, 6, 6.4]} up />
              </div>
              <div className="flex items-center gap-2">
                <TrendUp className="h-4 w-4 rotate-180 text-red-500" weight="bold" />
                <Sparkline series={[6, 5.5, 5.7, 4, 4.2, 3, 2.6]} up={false} />
              </div>
            </div>
          </div>

          {/* Slide to confirm */}
          <div>
            <p className="mb-3 text-xs font-medium uppercase tracking-widest text-muted-foreground">
              Slide-to-confirm — the deliberate gesture for the two final acts
            </p>
            <div className="max-w-md space-y-2">
              <SlideToConfirm
                key={slideRound}
                label="Slide to approve & release"
                confirmingLabel="Releasing…"
                onConfirm={() => setSlideRound((n) => n + 1)}
              />
              {slideRound > 0 && (
                <p className="text-xs text-primary">Released ✓ — drag again to replay.</p>
              )}
            </div>
          </div>

          {/* Provenance */}
          <div>
            <p className="mb-3 text-xs font-medium uppercase tracking-widest text-muted-foreground">
              Provenance — each acceptance term traces back to the brief
            </p>
            <div className="max-w-md space-y-3 rounded-lg border border-border bg-card p-4">
              <ProvenanceText
                text={BRIEF}
                highlight={highlight}
                className="text-sm leading-relaxed text-muted-foreground"
              />
              <div className="flex flex-wrap gap-2">
                {["within 14 days", "2 rounds of revisions", "reference Linear"].map((h) => (
                  <Button
                    key={h}
                    variant={highlight === h ? "primary" : "secondary"}
                    size="sm"
                    onClick={() => setHighlight(h)}
                  >
                    {h}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Acceptance terms */}
          <div>
            <p className="mb-3 text-xs font-medium uppercase tracking-widest text-muted-foreground">
              Acceptance terms — the escrow release checklist
            </p>
            <div className="max-w-md rounded-xl border border-border bg-card p-3 shadow-soft">
              <p className="px-3 pb-1 pt-2 text-sm font-medium">Acceptance terms</p>
              <CriterionRow label="Hero, features, pricing, testimonials" defaultChecked />
              <Divider />
              <CriterionRow label="Visual direction: clean/modern (ref: Linear)" />
              <Divider />
              <CriterionRow label="Delivered within 14 days" />
              <Divider />
              <CriterionRow label="2 revision rounds included" />
            </div>
          </div>
        </div>
      </Section>

      <footer className="flex items-center gap-2 border-t border-border py-10 text-sm text-muted-foreground">
        <Logo className="h-4 w-4 text-primary" />
        Crow · one token changes everything · say the word and it moves.
      </footer>
    </main>
  );
}
