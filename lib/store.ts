"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Agreement, Profile, View } from "./types";
import { seedAgreements } from "./seed";

interface DemoState {
  view: View;
  agreements: Agreement[];
  hydrated: boolean;
  profile: Profile | null;
  onboarded: boolean;
  setView: (v: View) => void;
  completeOnboarding: (p: Profile) => void;
  createAgreement: (a: Agreement) => void;
  updateAgreement: (id: string, patch: Partial<Agreement>) => void;
  accept: (id: string) => void;
  requestChanges: (id: string, note: string) => void;
  fund: (id: string) => void;
  submit: (id: string) => void;
  release: (id: string) => void;
  reset: () => void;
}

const mapOne = (arr: Agreement[], id: string, fn: (a: Agreement) => Agreement) =>
  arr.map((a) => (a.id === id ? fn(a) : a));

export const useDemo = create<DemoState>()(
  persist(
    (set) => ({
      view: "payments",
      agreements: seedAgreements,
      hydrated: false,
      profile: null,
      onboarded: false,
      setView: (view) => set({ view }),
      completeOnboarding: (profile) =>
        set({
          profile,
          onboarded: true,
          view: profile.use === "receiving" ? "receipts" : "payments",
        }),
      createAgreement: (a) => set((s) => ({ agreements: [a, ...s.agreements] })),
      updateAgreement: (id, patch) =>
        set((s) => ({ agreements: mapOne(s.agreements, id, (a) => ({ ...a, ...patch })) })),
      accept: (id) =>
        set((s) => ({ agreements: mapOne(s.agreements, id, (a) => ({ ...a, state: "accepted" })) })),
      requestChanges: (id, note) =>
        set((s) => ({
          agreements: mapOne(s.agreements, id, (a) => ({
            ...a,
            state: "changes_requested",
            changeNote: note,
          })),
        })),
      fund: (id) =>
        set((s) => ({ agreements: mapOne(s.agreements, id, (a) => ({ ...a, state: "funded" })) })),
      submit: (id) =>
        set((s) => ({ agreements: mapOne(s.agreements, id, (a) => ({ ...a, state: "submitted" })) })),
      release: (id) =>
        set((s) => ({ agreements: mapOne(s.agreements, id, (a) => ({ ...a, state: "released" })) })),
      reset: () =>
        set({ view: "payments", agreements: seedAgreements, profile: null, onboarded: false }),
    }),
    {
      name: "xe-demo",
      onRehydrateStorage: () => (state) => {
        if (state) state.hydrated = true;
      },
    },
  ),
);
