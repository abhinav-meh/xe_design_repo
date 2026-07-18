import type { Agreement } from "./types";
import { receiverAmount } from "./utils";

/** demo held balances (multi-currency Xe account) */
export const AVAILABLE = { USD: 12480, INR: 286400 };

const held = (a: Agreement) => a.state === "funded" || a.state === "submitted";

/** USD you've committed into active payment escrows */
export function committedUSD(ags: Agreement[]): number {
  return ags.filter((a) => a.side === "paying" && held(a)).reduce((s, a) => s + a.amount, 0);
}

/** INR incoming, held in escrow on active receipts */
export function incomingINR(ags: Agreement[]): number {
  return ags
    .filter((a) => a.side === "receiving" && held(a))
    .reduce((s, a) => s + receiverAmount(a.amount, a.lockedRate), 0);
}
