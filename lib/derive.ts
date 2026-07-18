import type { Agreement, AgreementState, View } from "./types";
import { isLocked, sideForView } from "./types";
import { receiverAmount } from "./utils";

/** status-dot color per state, for the Pill indicator */
export function stateVariant(
  s: AgreementState,
): "success" | "error" | "warning" | "info" | "neutral" {
  switch (s) {
    case "funded":
    case "submitted":
    case "released":
      return "success";
    case "changes_requested":
      return "error";
    case "accepted":
      return "info";
    default:
      return "neutral";
  }
}

const inView = (ags: Agreement[], view: View) => ags.filter((a) => a.side === sideForView(view));

const inEscrowStates: AgreementState[] = ["funded", "submitted"];

/** role-aware headline numbers for the Home overview, scoped to the active view */
export function summary(ags: Agreement[], view: View) {
  const scoped = inView(ags, view);
  const inEscrow = scoped.filter((a) => inEscrowStates.includes(a.state));
  const done = scoped.filter((a) => a.state === "released");
  // payments → your money is USD; receipts → your guaranteed INR
  const val = (list: Agreement[]) =>
    view === "payments"
      ? { c: "USD" as const, n: list.reduce((s, a) => s + a.amount, 0) }
      : { c: "INR" as const, n: list.reduce((s, a) => s + receiverAmount(a.amount, a.lockedRate), 0) };
  return {
    primary: { label: view === "payments" ? "In escrow" : "Incoming · guaranteed", ...val(inEscrow) },
    secondary: { label: view === "payments" ? "Released" : "Received", ...val(done) },
  };
}

/** deals in this view where it's YOUR turn to act */
export function needsAttention(ags: Agreement[], view: View): Agreement[] {
  return inView(ags, view).filter((a) =>
    view === "payments"
      ? a.state === "accepted" || a.state === "submitted" || a.state === "changes_requested"
      : a.state === "proposed" || a.state === "funded",
  );
}

export function actionLabel(a: Agreement, view: View): string {
  if (view === "payments") {
    if (a.state === "accepted") return "Fund to lock the rate";
    if (a.state === "submitted") return "Review & release";
    if (a.state === "changes_requested") return "Revise & resend";
  } else {
    if (a.state === "proposed") return "Accept or request changes";
    if (a.state === "funded") return a.kind === "goods" ? "Mark shipped" : "Submit work";
  }
  return "";
}

export interface ActivityEvent {
  id: string;
  at: string;
  title: string;
  text: string;
}

function eventText(a: Agreement): string {
  const cp = a.counterparty.name.split(" ")[0];
  if (a.side === "paying") {
    switch (a.state) {
      case "proposed":
        return `Sent to ${cp} to accept`;
      case "changes_requested":
        return `${cp} requested changes`;
      case "accepted":
        return `${cp} accepted — ready to fund`;
      case "funded":
        return `You funded escrow`;
      case "submitted":
        return `${cp} delivered`;
      case "released":
        return `Released & landed with ${cp}`;
    }
  }
  switch (a.state) {
    case "proposed":
      return `${cp} sent you a deal`;
    case "changes_requested":
      return `You requested changes`;
    case "accepted":
      return `You accepted`;
    case "funded":
      return `${cp} funded — you're covered`;
    case "submitted":
      return `You delivered`;
    case "released":
      return `Payment landed`;
  }
}

/** one event per deal in the view, newest first */
export function activity(ags: Agreement[], view: View): ActivityEvent[] {
  return inView(ags, view)
    .map((a) => ({ id: a.id, at: a.createdAt, title: a.title, text: eventText(a) }))
    .sort((x, y) => (x.at < y.at ? 1 : -1));
}
