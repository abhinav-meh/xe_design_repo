"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { spring, tap } from "@/lib/motion";

/*
  shadcn-style Button (cva variants) — but a motion.button, so it keeps the
  spring press-feedback that's core to our "alive" craft. Variant vocab is ours.
*/
export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-lg font-medium outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-foreground shadow-soft hover:brightness-[1.06]",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "bg-transparent text-foreground hover:bg-muted",
        outline: "border border-border bg-transparent hover:bg-muted",
        onMoney: "bg-money-accent text-money shadow-money hover:brightness-[1.05]",
      },
      size: {
        sm: "h-9 px-3.5 text-sm",
        md: "h-11 px-5 text-sm",
        lg: "h-12 px-6 text-base",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

interface ButtonProps
  extends HTMLMotionProps<"button">,
    VariantProps<typeof buttonVariants> {}

export function Button({ variant, size, className, children, ...props }: ButtonProps) {
  return (
    <motion.button
      whileTap={tap}
      transition={spring.snappy}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    >
      {children}
    </motion.button>
  );
}
