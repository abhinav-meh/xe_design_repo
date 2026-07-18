"use client";

import type { ComponentProps, ElementType, HTMLAttributes } from "react";
import { CaretDown, CaretUp, Minus } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

/*
  Kibo-UI Pill, ported to our brutal-dark tokens (Geist, lime accent) + Phosphor.
  Rounded pills — a deliberate exception to the square-corner system; they pop
  against the hard square cards. Composable: indicator dot, delta, icon, status,
  avatar(s), remove button.
*/

export function Pill({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground",
        className,
      )}
      {...props}
    />
  );
}

export type PillIndicatorVariant = "success" | "error" | "warning" | "info" | "neutral";

const dotColor: Record<PillIndicatorVariant, string> = {
  success: "bg-primary",
  error: "bg-red-500",
  warning: "bg-amber-500",
  info: "bg-sky-500",
  neutral: "bg-muted-foreground",
};

export function PillIndicator({
  variant = "success",
  pulse = false,
}: {
  variant?: PillIndicatorVariant;
  pulse?: boolean;
}) {
  return (
    <span className="relative flex h-2 w-2 items-center justify-center">
      {pulse && (
        <span className={cn("absolute inline-flex h-full w-full animate-ping rounded-full opacity-75", dotColor[variant])} />
      )}
      <span className={cn("relative inline-flex h-2 w-2 rounded-full", dotColor[variant])} />
    </span>
  );
}

export function PillStatus({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex items-center gap-1.5 border-r border-border pr-2 font-semibold", className)}
      {...props}
    />
  );
}

export function PillIcon({ icon: Icon, className }: { icon: ElementType; className?: string }) {
  return <Icon className={cn("h-3 w-3 shrink-0 text-muted-foreground", className)} />;
}

export function PillDelta({ delta }: { delta: number }) {
  if (delta > 0) return <CaretUp className="h-3 w-3 text-primary" weight="bold" />;
  if (delta < 0) return <CaretDown className="h-3 w-3 text-red-500" weight="bold" />;
  return <Minus className="h-3 w-3 text-muted-foreground" weight="bold" />;
}

export function PillButton({ className, ...props }: ComponentProps<"button">) {
  return (
    <button
      type="button"
      className={cn(
        "-mr-1 ml-0.5 inline-flex h-4 w-4 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
        className,
      )}
      {...props}
    />
  );
}

export function PillAvatar({
  src,
  fallback,
  className,
}: {
  src?: string;
  fallback: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "-ml-1 inline-flex h-4 w-4 items-center justify-center overflow-hidden rounded-full bg-muted text-[8px] font-medium text-muted-foreground ring-1 ring-background",
        className,
      )}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      {src ? <img src={src} alt={fallback} className="h-full w-full object-cover" /> : fallback}
    </span>
  );
}

export function PillAvatarGroup({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex items-center -space-x-1 pl-1", className)} {...props} />;
}
