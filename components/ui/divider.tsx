import { cn } from "@/lib/utils";

/*
  Lightweight divider (Reshaped-compatible API) — a soft hairline, not a hard
  border. Uses the border token at reduced opacity so separators recede instead
  of chopping the layout into blocks.
*/
export interface DividerProps {
  orientation?: "horizontal" | "vertical";
  className?: string;
}

export function Divider({ orientation = "horizontal", className }: DividerProps) {
  return (
    <div
      role="separator"
      aria-orientation={orientation}
      className={cn(
        orientation === "vertical" ? "w-px self-stretch" : "h-px w-full",
        "bg-border/50",
        className,
      )}
    />
  );
}
