"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { MorphingPanel } from "@/components/ui/morphing-panel";
import { Button } from "@/components/ui/button";
import { staggerContainer, staggerItem, ease } from "@/lib/motion";

/* Height-morph between steps of differing size — the ConnectKit feel. */
const steps = [
  {
    label: "Brief",
    title: "Describe the work",
    body: "“landing page for my saas — hero, features, pricing. clean like linear. two weeks, couple rounds.”",
  },
  {
    label: "Agreement",
    title: "Drafted from your words",
    body: "5 checkable criteria · 2 revision rounds · 14-day delivery. Each line traces back to the brief — the AI structured what you said, it didn't invent.",
  },
  {
    label: "Funded",
    title: "Secured & locked",
    body: "$1,200 held in escrow · ₹99,840 locked for Priya, guaranteed until release.",
  },
];

export function MorphDemo() {
  const [i, setI] = useState(0);
  const s = steps[i];
  return (
    <div>
      <div className="flex gap-2">
        {steps.map((st, idx) => (
          <Button
            key={st.label}
            size="sm"
            variant={idx === i ? "primary" : "secondary"}
            onClick={() => setI(idx)}
          >
            {st.label}
          </Button>
        ))}
      </div>
      <MorphingPanel className="mt-4 rounded-xl bg-card shadow-soft ring-1 ring-border">
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.22, ease: ease.out }}
          className="p-5"
        >
          <p className="text-sm font-medium text-foreground">{s.title}</p>
          <p className="mt-1 text-sm text-muted-foreground">{s.body}</p>
        </motion.div>
      </MorphingPanel>
    </div>
  );
}

/* Staggered reveal — the "assembling itself" feel of The Resolve. */
const criteria = [
  "Hero, features, pricing, testimonials",
  "Visual direction: clean/modern (ref: Linear)",
  "Delivered within 14 days",
  "2 revision rounds included",
  "Source files handed over",
];

export function StaggerDemo() {
  const [k, setK] = useState(0);
  return (
    <div>
      <Button variant="secondary" size="sm" onClick={() => setK((v) => v + 1)}>
        Replay reveal
      </Button>
      <motion.ul
        key={k}
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="mt-4 space-y-2"
      >
        {criteria.map((c) => (
          <motion.li
            key={c}
            variants={staggerItem}
            className="flex items-center gap-2.5 rounded-lg bg-card px-3.5 py-3 text-sm shadow-soft ring-1 ring-border"
          >
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
            {c}
          </motion.li>
        ))}
      </motion.ul>
    </div>
  );
}
