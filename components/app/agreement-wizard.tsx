"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "@phosphor-icons/react";
import { useDemo } from "@/lib/store";
import { MARKET_RATE } from "@/lib/seed";
import type { Agreement, DealKind, DoDCriterion } from "@/lib/types";
import { titleFromBrief } from "@/lib/draft";
import { cn, fmt, receiverAmount } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { MorphingPanel } from "@/components/ui/morphing-panel";
import { DocDropzone, type DocFile } from "@/components/app/doc-dropzone";
import { Resolve } from "@/components/app/resolve";
import { ease } from "@/lib/motion";

type Step = "party" | "scope" | "resolve" | "review";
type Mode = "pay" | "request";

const STEPS: { key: Step; label: string }[] = [
  { key: "party", label: "Party" },
  { key: "scope", label: "Scope" },
  { key: "resolve", label: "Agreement" },
  { key: "review", label: "Review" },
];

/**
 * Create/revise a Payment (you pay) or a Receipt (you request payment).
 * Both use the same escrow object; `side` differs. In edit mode the existing
 * side wins. Receiver always gets guaranteed INR; payer pays USD.
 */
export function AgreementWizard({ editId, mode = "pay" }: { editId?: string; mode?: Mode }) {
  const router = useRouter();
  const createAgreement = useDemo((s) => s.createAgreement);
  const updateAgreement = useDemo((s) => s.updateAgreement);
  const existing = useDemo((s) => (editId ? s.agreements.find((x) => x.id === editId) : undefined));
  const editing = Boolean(editId && existing);
  const effMode: Mode = existing ? (existing.side === "receiving" ? "request" : "pay") : mode;
  const requesting = effMode === "request";

  const [step, setStep] = useState<Step>(editing ? "resolve" : "party");
  const [name, setName] = useState(existing?.counterparty.name ?? "");
  const [country] = useState(
    existing?.counterparty.country ?? (requesting ? "United States" : "India"),
  );
  const [kind, setKind] = useState<DealKind>(existing?.kind ?? "service");
  const [brief, setBrief] = useState(existing?.brief ?? "");
  const [files, setFiles] = useState<DocFile[]>([]);
  const [criteria, setCriteria] = useState<DoDCriterion[]>(existing?.criteria ?? []);
  const [amount, setAmount] = useState(existing?.amount ?? 0);

  const idx = STEPS.findIndex((s) => s.key === step);
  const preview = amount > 0 ? receiverAmount(amount, MARKET_RATE) : 0;
  const canDraft = brief.trim().length > 8;
  const canReview = criteria.length > 0 && amount > 0;
  const go = (s: Step) => setStep(s);
  const first = (name || (requesting ? "client" : "recipient")).split(" ")[0];

  function submit() {
    const fields = {
      title: titleFromBrief(brief),
      counterparty: { name, country },
      kind,
      brief,
      criteria,
      amount,
      state: "proposed" as const,
      changeNote: undefined,
    };
    if (editing && existing) {
      updateAgreement(existing.id, fields);
      router.push("/app/agreements");
      return;
    }
    const ag: Agreement = {
      id: `${requesting ? "rec" : "pay"}-${Math.random().toString(36).slice(2, 10)}`,
      side: requesting ? "receiving" : "paying",
      lockedRate: MARKET_RATE,
      createdAt: new Date().toISOString(),
      ...fields,
    };
    createAgreement(ag);
    router.push("/app/agreements");
  }

  const stepBody = useMemo(() => {
    switch (step) {
      case "party":
        return (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">
                {requesting ? "Who's paying you?" : "Who are you paying?"}
              </label>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {requesting
                  ? "A client or customer you're invoicing."
                  : "A supplier, contractor, or freelancer you already work with."}
              </p>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={requesting ? "Payer name" : "Recipient name"}
                className="mt-2 h-11 w-full border border-border bg-card px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label className="text-sm font-medium">
                {requesting ? "What are you delivering?" : "What are you paying for?"}
              </label>
              <div className="mt-2 flex gap-2">
                {(["service", "goods"] as const).map((k) => (
                  <button
                    key={k}
                    onClick={() => setKind(k)}
                    className={cn(
                      "border px-3 py-1.5 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      kind === k
                        ? "border-primary bg-primary/10 text-foreground"
                        : "border-border text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {k === "service" ? "A service" : "Goods"}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-3 border border-border bg-muted/40 px-3 py-2.5 text-sm">
              <span className="text-muted-foreground">Settles in</span>
              <span className="font-medium">India · INR ₹</span>
            </div>
          </div>
        );
      case "scope":
        return (
          <div className="space-y-4">
            <DocDropzone files={files} onChange={setFiles} />
            <div className="relative flex items-center gap-3 text-xs text-muted-foreground">
              <span className="h-px flex-1 bg-border" /> and / or <span className="h-px flex-1 bg-border" />
            </div>
            <div>
              <label className="text-sm font-medium">Describe the deal in your own words</label>
              <textarea
                value={brief}
                onChange={(e) => {
                  setBrief(e.target.value);
                  if (criteria.length) setCriteria([]);
                }}
                rows={4}
                placeholder={
                  kind === "goods"
                    ? "e.g. 500 units matching the approved sample, retail-ready packaging, shipped within 3 weeks."
                    : "e.g. landing page — hero, features, pricing, testimonials. clean and modern. two weeks, two revisions."
                }
                className="mt-2 w-full border border-border bg-card p-3 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>
        );
      case "resolve":
        return (
          <Resolve
            brief={brief}
            criteria={criteria}
            onCriteria={setCriteria}
            amount={amount}
            onAmount={setAmount}
            receiverName={requesting ? "You" : name || "the recipient"}
            receiverCurrency="INR"
            rate={MARKET_RATE}
          />
        );
      case "review":
        return (
          <div className="space-y-4">
            <div className="border border-border bg-card p-4">
              <p className="text-xs uppercase tracking-widest text-muted-foreground">Agreement</p>
              <p className="mt-1 font-medium">{titleFromBrief(brief)}</p>
              <p className="mt-0.5 text-sm text-muted-foreground">
                {requesting ? "From" : "To"} {name} · {country} · {criteria.length} terms ·{" "}
                {kind === "goods" ? "Goods" : "Service"}
              </p>
            </div>
            <div className="flex items-center justify-between border border-border bg-card p-4">
              <div>
                <p className="text-xs text-muted-foreground">
                  {requesting ? `${first} pays` : "You pay"}
                </p>
                <p className="font-mono tabular text-xl font-semibold">{fmt(amount, "USD")}</p>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
              <div className="text-right">
                <p className="text-xs text-muted-foreground">
                  {requesting ? "You receive" : `${name || "Recipient"} receives`}
                </p>
                <p className="font-mono tabular text-xl font-semibold">{fmt(preview, "INR")}</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              {requesting
                ? `We send this to ${first} to accept and fund. Your rate locks the moment they fund.`
                : `We send this to ${first} to accept before any money moves. The rate locks the moment you fund.`}
            </p>
          </div>
        );
    }
  }, [step, name, country, kind, brief, files, criteria, amount, preview, requesting, first]);

  return (
    <div>
      <Link
        href="/app/agreements"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
      >
        <ArrowLeft className="h-4 w-4" /> {requesting ? "Receipts" : "Payments"}
      </Link>

      <h1 className="mt-4 text-2xl font-semibold tracking-tight">
        {editing ? (requesting ? "Revise request" : "Revise payment") : requesting ? "Request payment" : "New payment"}
      </h1>

      <div className="mt-4 flex items-center gap-2">
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
              <span className={cn("h-px w-5 transition-colors", i < idx ? "bg-foreground" : "bg-border")} />
            )}
          </div>
        ))}
      </div>

      <MorphingPanel className="mt-5">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.22, ease: ease.out }}
        >
          {stepBody}
        </motion.div>
      </MorphingPanel>

      <div className="mt-6 flex items-center justify-between">
        {idx > 0 ? (
          <Button variant="ghost" onClick={() => go(STEPS[idx - 1].key)}>
            Back
          </Button>
        ) : (
          <span />
        )}

        {step === "party" && (
          <Button onClick={() => go("scope")} disabled={!name.trim()}>
            Continue <ArrowRight className="h-4 w-4" />
          </Button>
        )}
        {step === "scope" && (
          <Button onClick={() => go("resolve")} disabled={!canDraft}>
            Draft the agreement <ArrowRight className="h-4 w-4" />
          </Button>
        )}
        {step === "resolve" && (
          <Button onClick={() => go("review")} disabled={!canReview}>
            Review <ArrowRight className="h-4 w-4" />
          </Button>
        )}
        {step === "review" && (
          <Button onClick={submit}>
            {requesting ? "Request from" : editing ? "Resend to" : "Send to"} {first}{" "}
            <ArrowRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
