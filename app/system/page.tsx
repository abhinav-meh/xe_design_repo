"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { motion, type Transition } from "framer-motion";
import { Lock } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Pill, PillIndicator } from "@/components/kibo-ui/pill";
import { MoneyDisplay } from "@/components/ui/money";
import { CriterionRow } from "@/components/ui/criterion-row";
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
  { name: "smooth", cfg: spring.smooth, note: "panels" },
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

export default function SystemPage() {
  const [play, setPlay] = useState(false);

  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <header className="space-y-3">
        <Pill>
          <PillIndicator variant="success" />
          v0 · neutral first pass
        </Pill>
        <h1 className="text-display-sm font-semibold tracking-tight">
          Trusted Craft
        </h1>
        <p className="max-w-xl text-lg text-muted-foreground">
          Warm light base · premium-dark money surfaces · spring motion. Every
          value below is a token in <code className="text-sm">globals.css</code>{" "}
          / <code className="text-sm">lib/motion.ts</code>. This page is the
          canvas — tell me what to change and it changes here.
        </p>
      </header>

      {/* COLOR */}
      <Section title="Color" hint="Semantic tokens, not raw hex.">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Swatch name="background" className="bg-background" ring />
          <Swatch name="foreground" className="bg-foreground" />
          <Swatch name="primary" className="bg-primary" />
          <Swatch name="accent" className="bg-accent" />
          <Swatch name="muted" className="bg-muted" ring />
          <Swatch name="secondary" className="bg-secondary" ring />
          <Swatch name="card" className="bg-card" ring />
          <Swatch name="border" className="bg-border" />
        </div>
        <p className="mb-3 mt-8 text-xs font-medium uppercase tracking-widest text-muted-foreground">
          Money surface (premium-dark)
        </p>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Swatch name="money" className="bg-money" />
          <Swatch name="money.foreground" className="bg-money-foreground" ring />
          <Swatch name="money.accent" className="bg-money-accent" />
          <Swatch name="money.border" className="bg-money-border" />
        </div>
      </Section>

      {/* TYPOGRAPHY */}
      <Section title="Typography" hint="Inter · display scale for authoritative numbers.">
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
          <p className="tabular text-2xl font-semibold">
            1,234,567.89 · tabular numerals never jitter
          </p>
        </div>
      </Section>

      {/* RADII + ELEVATION */}
      <Section title="Shape & elevation" hint="Soft radii (14px base) · warm shadows.">
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
        <div className="mt-8 flex flex-wrap gap-6">
          {[
            { s: "shadow-soft", l: "soft" },
            { s: "shadow-lifted", l: "lifted" },
          ].map((x) => (
            <div key={x.l} className="space-y-1.5 text-center">
              <div className={`h-20 w-32 rounded-lg bg-card ${x.s}`} />
              <p className="text-xs text-muted-foreground">{x.l}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* MOTION */}
      <Section
        title="Motion"
        hint="The signature. Tap play to feel all four springs at once."
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
        hint="The Family / ConnectKit signature — the panel springs to its new height as content changes; items assemble in. This is the feel of “The Resolve.”"
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
        <div className="space-y-10">
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="primary">Fund &amp; send</Button>
            <Button variant="secondary">Request changes</Button>
            <Button variant="ghost">Cancel</Button>
            <Button variant="primary" disabled>
              Disabled
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            <Pill>
              <PillIndicator variant="neutral" />
              Draft
            </Pill>
            <Pill>
              <PillIndicator variant="success" pulse />
              Funds secured
            </Pill>
            <Pill>
              <PillIndicator variant="error" />
              Changes requested
            </Pill>
            <Pill>
              <Lock className="h-3 w-3" weight="bold" /> Rate locked
            </Pill>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <MoneyDisplay surface="light" label="You pay" value={1200} currency="USD" />
            <MoneyDisplay
              surface="premium"
              label="Priya receives"
              value={99840}
              currency="INR"
              locked
            />
          </div>

          <div className="max-w-md rounded-xl bg-card p-3 shadow-soft ring-1 ring-border">
            <p className="px-3 pb-1 pt-2 text-sm font-medium">
              Definition of Done
            </p>
            <CriterionRow label="Hero, features, pricing, testimonials" defaultChecked />
            <CriterionRow label="Visual direction: clean/modern (ref: Linear)" />
            <CriterionRow label="Delivered within 14 days" />
            <CriterionRow label="2 revision rounds included" />
          </div>
        </div>
      </Section>

      <footer className="border-t border-border py-10 text-sm text-muted-foreground">
        Trusted Craft · you drive · say the word and it moves.
      </footer>
    </main>
  );
}
