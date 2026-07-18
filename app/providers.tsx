"use client";

import { MotionConfig } from "framer-motion";

/** Global motion governance: honor OS "reduce motion" for all Framer animations. */
export function Providers({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
