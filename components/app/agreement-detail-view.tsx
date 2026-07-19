"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, CheckCircle } from "@phosphor-icons/react";
import { useDemo } from "@/lib/store";
import { STATE_LABEL, isLocked, type Agreement } from "@/lib/types";
import { stateVariant } from "@/lib/derive";
import { MARKET_RATE } from "@/lib/seed";
import { cn, fmt, fxDelta, receiverAmount } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { Pill, PillIndicator } from "@/components/kibo-ui/pill";
import { Divider } from "@/components/ui/divider";
import { MoneyDisplay } from "@/components/ui/money";
import { SlideToConfirm } from "@/components/ui/slide-to-confirm";
import { FundDialog } from "@/components/app/fund-dialog";
import { spring, staggerContainer, staggerItem } from "@/lib/motion";

/** Shared detail UI — used by the mobile push-route and the web master-detail pane. */
export function AgreementDetailView({ id, showBack = false }: { id: string; showBack?: boolean }) {
  const a = useDemo((s) => s.agreements.find((x) => x.id === id));
  const accept = useDemo((s) => s.accept);
  const requestChanges = useDemo((s) => s.requestChanges);
  const fund = useDemo((s) => s.fund);
  const submit = useDemo((s) => s.submit);
  const release = useDemo((s) => s.release);

  const [actingAs, setActingAs] = useState<"you" | "counterparty">("you");
  const [showNote, setShowNote] = useState(false);
  const [note, setNote] = useState("");

  if (!a) {
    return (
      <div>
        {showBack && <BackLink />}
        <p className="mt-8 text-sm text-muted-foreground">Select an agreement.</p>
      </div>
    );
  }

  const youArePayer = a.side === "paying";
  const youReceive = a.side === "receiving";
  const actingRole: "payer" | "receiver" =
    actingAs === "you" ? (youArePayer ? "payer" : "receiver") : youArePayer ? "receiver" : "payer";
  const cp = a.counterparty.name;
  const cpFirst = cp.split(" ")[0];
  const inr = receiverAmount(a.amount, a.lockedRate);
  const locked = isLocked(a.state);
  const deliverable = a.kind === "goods" ? "shipment" : "work";
  const nextTurn = nextActor(a.state, youArePayer);

  return (
    <div>
      {showBack && <BackLink />}

      <div className={showBack ? "mt-5" : ""}>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-2xl font-semibold tracking-tight">{a.title}</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {youArePayer ? "To" : "From"} {cp} · {a.counterparty.country} ·{" "}
              {a.kind === "goods" ? "Goods" : "Service"}
            </p>
          </div>
          <Pill className="shrink-0">
            <PillIndicator variant={stateVariant(a.state)} pulse={a.state === "funded"} />
            {STATE_LABEL[a.state]}
          </Pill>
        </div>
      </div>

      {/* Money — premium card is the receiver's guaranteed INR (you or the counterparty) */}
      <div className="mt-5">
        <MoneyDisplay
          surface="premium"
          label={youReceive ? "You receive" : `${cpFirst} receives`}
          value={inr}
          currency="INR"
          locked={locked}
          delta={locked ? fxDelta(a.lockedRate, MARKET_RATE) : undefined}
        />
        <p className="mt-2 text-xs text-muted-foreground">
          {youReceive ? `${cp} pays ${fmt(a.amount, "USD")}` : `You pay ${fmt(a.amount, "USD")}`}
          {locked ? " · rate locked, no FX surprise." : " · rate locks the moment it's funded."}
        </p>
      </div>

      {/* Acceptance terms (was Definition of Done) */}
      <section className="mt-6">
        <p className="mb-2 text-xs font-medium uppercase tracking-widest text-muted-foreground">
          Acceptance terms
        </p>
        <motion.ul
          variants={staggerContainer}
          initial="hidden"
          animate="show"
          className="border border-border bg-card"
        >
          {a.criteria.map((c, i) => (
            <motion.li key={c.id} variants={staggerItem}>
              {i > 0 && <Divider />}
              <div className="flex items-center gap-3 px-4 py-3">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center bg-primary/10">
                  <Check className="h-3.5 w-3.5 text-primary" weight="bold" />
                </span>
                <span className="text-sm">{c.label}</span>
              </div>
            </motion.li>
          ))}
        </motion.ul>
      </section>

      {/* Action */}
      <div className="mt-6">
        {a.state !== "released" && (
          <DemoStepper
            actingAs={actingAs}
            setActingAs={setActingAs}
            cpFirst={cpFirst}
            nextTurn={nextTurn}
          />
        )}

        {/* PAYER actions */}
        {actingRole === "payer" && a.state === "proposed" && (
          <Note>Sent to {cpFirst} — awaiting acceptance.</Note>
        )}
        {actingRole === "payer" && a.state === "changes_requested" && (
          <div className="space-y-3">
            {a.changeNote && (
              <div className="border border-accent/40 bg-accent/10 p-4 text-sm">
                <p className="text-xs font-medium uppercase tracking-widest text-accent">
                  {cpFirst} requested changes
                </p>
                <p className="mt-1 text-foreground">“{a.changeNote}”</p>
              </div>
            )}
            <Link
              href={`/app/agreements/${a.id}/edit`}
              className={cn(buttonVariants({ size: "lg" }), "w-full")}
            >
              Revise &amp; resend
            </Link>
          </div>
        )}
        {actingRole === "payer" && a.state === "accepted" && <FundDialog a={a} />}
        {actingRole === "payer" && a.state === "funded" && (
          <Note>Funds secured. Awaiting {cpFirst}&apos;s {deliverable}.</Note>
        )}
        {actingRole === "payer" && a.state === "submitted" && (
          <SlideToConfirm
            label="Slide to approve & release"
            confirmingLabel="Releasing…"
            onConfirm={() => release(a.id)}
          />
        )}

        {/* RECEIVER actions */}
        {actingRole === "receiver" && a.state === "proposed" && (
          <div className="space-y-3">
            {!showNote ? (
              <>
                <Button onClick={() => accept(a.id)} size="lg" className="w-full">
                  <Check className="h-4 w-4" weight="bold" /> Accept
                </Button>
                <Button variant="ghost" size="lg" className="w-full" onClick={() => setShowNote(true)}>
                  Request changes
                </Button>
              </>
            ) : (
              <div className="space-y-2">
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={3}
                  placeholder="What needs to change before you'll accept?"
                  className="w-full border border-border bg-card p-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                />
                <div className="flex gap-3">
                  <Button
                    onClick={() => {
                      requestChanges(a.id, note.trim() || "Please revise the terms.");
                      setShowNote(false);
                      setNote("");
                    }}
                    size="lg"
                    className="flex-1"
                  >
                    Send request
                  </Button>
                  <Button variant="ghost" size="lg" onClick={() => setShowNote(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
        {actingRole === "receiver" && a.state === "changes_requested" && (
          <Note>You requested changes — awaiting {cpFirst} to revise.</Note>
        )}
        {actingRole === "receiver" && a.state === "accepted" && (
          <Note>Accepted. Awaiting {cpFirst} to fund — the rate locks then.</Note>
        )}
        {actingRole === "receiver" && a.state === "funded" && (
          <SlideToConfirm
            label={a.kind === "goods" ? "Slide to mark shipped" : "Slide to submit work"}
            confirmingLabel="Submitting…"
            onConfirm={() => submit(a.id)}
          />
        )}
        {actingRole === "receiver" && a.state === "submitted" && (
          <Note>Submitted — awaiting {cpFirst}&apos;s approval.</Note>
        )}

        {/* RELEASED — landed payoff */}
        {a.state === "released" && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={spring.smooth}
            className="relative flex items-center gap-3 overflow-hidden border border-primary/40 bg-primary/5 p-4"
          >
            <motion.span
              initial={{ scale: 0, rotate: -12 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ ...spring.bouncy, delay: 0.05 }}
            >
              <CheckCircle className="h-7 w-7 text-primary" weight="fill" />
            </motion.span>
            <div>
              <p className="text-sm font-medium">
                {youReceive ? "Landed in your account" : "Released & landed"}
              </p>
              <p className="text-sm text-muted-foreground">
                {youReceive
                  ? `${fmt(inr, "INR")} — exactly as promised.`
                  : `${cp} received ${fmt(inr, "INR")}.`}
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

/** Which side must act next, expressed in the toggle's own terms ("you" | the counterparty). */
function nextActor(
  state: Agreement["state"],
  youArePayer: boolean,
): "you" | "counterparty" | null {
  const payerActs = state === "changes_requested" || state === "accepted" || state === "submitted";
  const receiverActs = state === "proposed" || state === "funded";
  const role = payerActs ? "payer" : receiverActs ? "receiver" : null;
  if (!role) return null;
  const youRole = youArePayer ? "payer" : "receiver";
  return role === youRole ? "you" : "counterparty";
}

/*
  The two-sided demo control. In real life each party acts from their own
  device; here a single explorer flips between the two to walk the deal
  forward. The "whose move" nudge points to the side that can act next, so
  landing on the waiting side is a one-tap fix rather than a dead end.
*/
function DemoStepper({
  actingAs,
  setActingAs,
  cpFirst,
  nextTurn,
}: {
  actingAs: "you" | "counterparty";
  setActingAs: (v: "you" | "counterparty") => void;
  cpFirst: string;
  nextTurn: "you" | "counterparty" | null;
}) {
  const opts: { key: "you" | "counterparty"; label: string }[] = [
    { key: "you", label: "You" },
    { key: "counterparty", label: cpFirst },
  ];
  const waiting = nextTurn !== null && actingAs !== nextTurn;
  const nudge =
    nextTurn === "you"
      ? "Your move — switch back to you"
      : `It’s ${cpFirst}’s move — act as ${cpFirst}`;

  return (
    <div className="mb-4 border border-border bg-muted/30 p-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Demo · step through both sides
          </p>
          <p className="mt-0.5 text-[11px] leading-snug text-muted-foreground/80">
            Each side normally acts from their own device — switch here to advance the deal.
          </p>
        </div>
        <div role="group" aria-label="Acting as" className="flex shrink-0 border border-border">
          {opts.map((o) => (
            <button
              key={o.key}
              onClick={() => setActingAs(o.key)}
              aria-pressed={actingAs === o.key}
              className={cn(
                "px-2.5 py-1 text-xs outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring",
                actingAs === o.key
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {o.label}
            </button>
          ))}
        </div>
      </div>

      {waiting && (
        <button
          onClick={() => setActingAs(nextTurn)}
          className="mt-3 flex w-full items-center justify-between gap-2 border border-primary/40 bg-primary/10 px-3 py-2 text-left text-xs font-medium text-primary outline-none transition-colors hover:bg-primary/15 focus-visible:ring-2 focus-visible:ring-ring"
        >
          <span>{nudge}</span>
          <ArrowRight className="h-3.5 w-3.5 shrink-0" weight="bold" />
        </button>
      )}
    </div>
  );
}

function Note({ children }: { children: React.ReactNode }) {
  return <p className="border border-border bg-muted px-4 py-3 text-sm text-muted-foreground">{children}</p>;
}

function BackLink() {
  return (
    <Link
      href="/app/agreements"
      className="inline-flex items-center gap-1.5 text-sm text-muted-foreground outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
    >
      <ArrowLeft className="h-4 w-4" /> Transactions
    </Link>
  );
}
