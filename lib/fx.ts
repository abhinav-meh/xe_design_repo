import type { Agreement } from "./types";
import { isLocked } from "./types";
import { MARKET_RATE } from "./seed";
import { receiverAmount } from "./utils";

/*
  Deterministic ~30-day USD→INR series (ends at today's MARKET_RATE). Fixed
  function of index so SSR and client render identically — no Math.random.
*/
export const FX_SERIES: number[] = (() => {
  const n = 30;
  const arr: number[] = [];
  for (let i = 0; i < n; i++) {
    const t = i / (n - 1);
    arr.push(80.7 + t * 1.15 + Math.sin(i * 0.6) * 0.28 + Math.cos(i * 0.25) * 0.16);
  }
  arr[n - 1] = MARKET_RATE; // land on today's rate
  return arr;
})();

export const fxCurrent = FX_SERIES[FX_SERIES.length - 1];
const fxPrev = FX_SERIES[FX_SERIES.length - 2];
export const fxChange = Math.round((fxCurrent - fxPrev) * 100) / 100;
export const fxChangePct = Math.round((fxChange / fxPrev) * 1000) / 10;

/** cross-border corridors for the ticker + forex rail (USD→INR is your corridor) */
export const CORRIDORS = [
  { pair: "USD → INR", rate: "₹82.00", d: 0.2 },
  { pair: "USD → PHP", rate: "₱56.10", d: -0.1 },
  { pair: "GBP → INR", rate: "₹104.30", d: 0.4 },
  { pair: "EUR → INR", rate: "₹89.20", d: 0.1 },
  { pair: "USD → MXN", rate: "17.05", d: 0.0 },
  { pair: "AUD → INR", rate: "₹54.60", d: -0.2 },
];

/** total ₹ YOU locked in above today's market on incoming deals — your FX-lock value */
export function totalProtected(ags: Agreement[]): number {
  return ags
    .filter((a) => a.side === "receiving" && isLocked(a.state))
    .reduce(
      (sum, a) =>
        sum + (receiverAmount(a.amount, a.lockedRate) - receiverAmount(a.amount, MARKET_RATE)),
      0,
    );
}
