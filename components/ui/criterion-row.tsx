"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { spring } from "@/lib/motion";

/*
  CriterionRow — one line of the Definition of Done, and the release
  gesture. Ticking it should feel deliberate and weighty, not like a
  plain checkbox. The check draws in on a spring.
*/

export function CriterionRow({
  label,
  defaultChecked = false,
}: {
  label: string;
  defaultChecked?: boolean;
}) {
  const [checked, setChecked] = useState(defaultChecked);
  return (
    <button
      onClick={() => setChecked((c) => !c)}
      className={cn(
        "flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left transition-colors",
        "outline-none focus-visible:ring-2 focus-visible:ring-ring",
        checked ? "bg-primary/5" : "hover:bg-muted",
      )}
    >
      <motion.span
        animate={{
          backgroundColor: checked ? "hsl(var(--primary))" : "hsl(var(--card))",
          borderColor: checked ? "hsl(var(--primary))" : "hsl(var(--border))",
        }}
        transition={spring.snappy}
        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2"
      >
        <motion.span
          initial={false}
          animate={{ scale: checked ? 1 : 0, opacity: checked ? 1 : 0 }}
          transition={spring.bouncy}
        >
          <Check className="h-4 w-4 text-primary-foreground" weight="bold" />
        </motion.span>
      </motion.span>
      <span
        className={cn(
          "text-sm",
          checked ? "text-foreground" : "text-muted-foreground",
        )}
      >
        {label}
      </span>
    </button>
  );
}
