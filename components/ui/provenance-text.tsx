"use client";

import { motion } from "framer-motion";
import { spring } from "@/lib/motion";

/*
  Renders text with one phrase highlighted — the provenance trace from an
  acceptance-term back to the source brief. Case-insensitive, first match.
  When the highlight becomes active, the mark gives a gentle scale-pop + glow
  so the connection reads as *alive*, not a static underline.
*/
export function ProvenanceText({
  text,
  highlight,
  className,
}: {
  text: string;
  highlight?: string | null;
  className?: string;
}) {
  if (!highlight) return <span className={className}>{text}</span>;

  const i = text.toLowerCase().indexOf(highlight.toLowerCase());
  if (i === -1) return <span className={className}>{text}</span>;

  const before = text.slice(0, i);
  const match = text.slice(i, i + highlight.length);
  const after = text.slice(i + highlight.length);

  return (
    <span className={className}>
      {before}
      <motion.mark
        key={match}
        initial={{ scale: 1 }}
        animate={{ scale: [1, 1.06, 1] }}
        transition={spring.snappy}
        className="inline-block rounded bg-primary/25 px-0.5 text-foreground shadow-[0_0_14px_hsl(var(--primary)/0.35)]"
      >
        {match}
      </motion.mark>
      {after}
    </span>
  );
}
