import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { CurrencyCode } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** format an amount in its currency (₹ uses Indian grouping, no decimals) */
export function fmt(n: number, c: CurrencyCode): string {
  return new Intl.NumberFormat(c === "USD" ? "en-US" : "en-IN", {
    style: "currency",
    currency: c,
    maximumFractionDigits: c === "INR" ? 0 : 2,
  }).format(n);
}

/** the receiver's guaranteed local amount at the locked rate */
export function receiverAmount(usd: number, rate: number): number {
  return Math.round(usd * rate);
}

/** how much the locked rate is worth vs today's market, as a signed % (1dp) */
export function fxDelta(lockedRate: number, marketRate: number): number {
  return Math.round(((lockedRate - marketRate) / marketRate) * 1000) / 10;
}

/** short human date, e.g. "Jul 12" */
export function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

