"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeSlash, Lock, Check } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { cn } from "@/lib/utils";
import { staggerContainer, staggerItem } from "@/lib/motion";
import { RadialField } from "./radial-field";

/* Split login — decorative radial panel (left) + form (right), matching the ref.
   Demo auth: any input logs in → /app (the Shell guard steers to onboarding if needed). */
export function LoginView() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [show, setShow] = useState(false);
  const [keep, setKeep] = useState(false);

  function login(e: React.FormEvent) {
    e.preventDefault();
    router.push("/app");
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* left decorative panel */}
      <div className="relative hidden w-1/2 border-r border-border lg:block">
        <RadialField />
      </div>

      {/* right form */}
      <div className="flex w-full items-center justify-center px-6 lg:w-1/2">
        <motion.form
          onSubmit={login}
          variants={staggerContainer}
          initial="hidden"
          animate="show"
          className="w-full max-w-sm"
        >
          <motion.div variants={staggerItem}>
            <Logo className="h-8 w-auto text-primary" />
          </motion.div>
          <motion.h1 variants={staggerItem} className="mt-5 text-xl font-semibold tracking-tight">
            Log in to Crow
          </motion.h1>

          <motion.div variants={staggerItem} className="mt-6">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1.5 h-11 w-full border border-border bg-card px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </motion.div>

          <motion.div variants={staggerItem} className="mt-4">
            <label htmlFor="pw" className="text-sm font-medium">
              Password
            </label>
            <div className="relative mt-1.5">
              <input
                id="pw"
                type={show ? "text" : "password"}
                value={pw}
                onChange={(e) => setPw(e.target.value)}
                className="h-11 w-full border border-border bg-card px-3 pr-11 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
              <button
                type="button"
                onClick={() => setShow((s) => !s)}
                aria-label={show ? "Hide password" : "Show password"}
                className="absolute right-0.5 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center text-muted-foreground outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
              >
                {show ? <EyeSlash className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </motion.div>

          <motion.label
            variants={staggerItem}
            className="mt-4 flex cursor-pointer items-center gap-2 text-sm text-muted-foreground"
          >
            <button
              type="button"
              role="checkbox"
              aria-checked={keep}
              onClick={() => setKeep((k) => !k)}
              className={cn(
                "flex h-4 w-4 items-center justify-center border outline-none focus-visible:ring-2 focus-visible:ring-ring",
                keep ? "border-primary bg-primary/15" : "border-border",
              )}
            >
              {keep && <Check className="h-3 w-3 text-primary" weight="bold" />}
            </button>
            Keep me logged in for up to 30 days
          </motion.label>

          <motion.div variants={staggerItem} className="mt-6 grid grid-cols-2 gap-3">
            <Button type="submit" size="lg">
              Log in
            </Button>
            <Button type="button" variant="outline" size="lg">
              Help
            </Button>
          </motion.div>

          <motion.div
            variants={staggerItem}
            className="my-5 flex items-center gap-3 text-xs text-muted-foreground"
          >
            <span className="h-px flex-1 bg-border" /> or <span className="h-px flex-1 bg-border" />
          </motion.div>

          <motion.div variants={staggerItem}>
            <Button type="button" variant="outline" size="lg">
              <Lock className="h-4 w-4" weight="bold" /> Log in with passkeys
            </Button>
          </motion.div>

          <motion.p variants={staggerItem} className="mt-6 text-sm text-muted-foreground">
            New to Crow?{" "}
            <Link
              href="/onboarding"
              className="font-medium text-foreground underline underline-offset-4 outline-none hover:text-primary focus-visible:ring-2 focus-visible:ring-ring"
            >
              Create an account
            </Link>
          </motion.p>
        </motion.form>
      </div>
    </div>
  );
}
