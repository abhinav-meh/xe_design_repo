export type View = "payments" | "receipts";
/** your side of a given deal */
export type Side = "paying" | "receiving";
export type DealKind = "service" | "goods";
export type CurrencyCode = "USD" | "INR";

/**
 * Happy-path lifecycle incl. the co-sign gate.
 * proposed → accepted → funded → submitted → released
 *   ↳ changes_requested (receiver bounced it back; pre-funding, nothing locked)
 */
export type AgreementState =
  | "proposed"
  | "changes_requested"
  | "accepted"
  | "funded"
  | "submitted"
  | "released";

export interface DoDCriterion {
  id: string;
  label: string;
  /** provenance: the phrase in the source brief/doc this was drawn from */
  source?: string;
}

/**
 * An escrow deal between you and a counterparty — services OR goods.
 * Deal is USD-priced; the RECEIVER gets a guaranteed INR amount (FX-locked),
 * the PAYER pays USD. `side` is YOUR role in this deal.
 */
export interface Agreement {
  id: string;
  title: string;
  side: Side;
  kind: DealKind;
  counterparty: { name: string; country: string };
  brief: string;
  criteria: DoDCriterion[];
  amount: number; // USD deal value
  lockedRate: number; // USD -> INR, locked at funding
  state: AgreementState;
  changeNote?: string;
  createdAt: string; // ISO
}

export const STATE_LABEL: Record<AgreementState, string> = {
  proposed: "Awaiting acceptance",
  changes_requested: "Changes requested",
  accepted: "Awaiting funding",
  funded: "Funds secured",
  submitted: "Awaiting review",
  released: "Released",
};

export const isLocked = (s: AgreementState) =>
  s === "funded" || s === "submitted" || s === "released";

export const sideForView = (v: View): Side => (v === "payments" ? "paying" : "receiving");

/** How the account owner primarily uses Xe — steers the default view. */
export type AccountUse = "paying" | "receiving" | "both";

/**
 * The account owner's profile, collected at onboarding. "Set the story":
 * personalizes greeting/owner name + default view; does NOT reshape the
 * seeded sample account (that stays USD↔INR).
 */
export interface Profile {
  name: string; // person's name — for the greeting
  business: string; // org name — the account owner (replaces "Arden Studio")
  country: string; // home country label
  currency: string; // display-only ("USD","GBP"…); not the fmt CurrencyCode
  use: AccountUse; // steers the default Payments/Receipts view
  worksWith: string[]; // counterparty types/regions — context only
}
