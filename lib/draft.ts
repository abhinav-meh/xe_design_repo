import type { DoDCriterion } from "./types";

/*
  Turns a fuzzy brief into checkable acceptance criteria, keeping the exact
  source phrase for provenance highlighting. This is a deterministic heuristic
  so the demo runs offline. SEAM: on Vercel, swap generateDoD() for a real
  Claude API call (POST /api/draft → anthropic.messages.create → criteria[]).
*/

export function parseBriefToCriteria(brief: string): DoDCriterion[] {
  const clean = brief.replace(/\s+/g, " ").trim();
  if (!clean) return [];

  // split on sentence/clause boundaries — NOT on "and" (keeps phrases intact)
  const parts = clean
    .split(/[,;.]|\s[—-]\s/g)
    .map((p) => p.trim())
    .filter((p) => p.length > 4 && p.split(" ").length >= 2);

  const seen = new Set<string>();
  const criteria: DoDCriterion[] = [];
  for (const p of parts) {
    const key = p.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    criteria.push({
      id: `c-${criteria.length}-${key.replace(/[^a-z0-9]+/g, "-").slice(0, 18)}`,
      label: p.charAt(0).toUpperCase() + p.slice(1),
      source: p,
    });
    if (criteria.length >= 6) break;
  }
  return criteria;
}

/** async so the UI can show a genuine "reading your brief…" beat */
export async function generateDoD(brief: string): Promise<DoDCriterion[]> {
  await new Promise((r) => setTimeout(r, 850));
  return parseBriefToCriteria(brief);
}

/** rough title from the first meaningful chunk of the brief */
export function titleFromBrief(brief: string): string {
  const first = brief.replace(/\s+/g, " ").trim().split(/[,;.]/)[0] ?? "";
  const words = first.split(" ").slice(0, 6).join(" ");
  return words ? words.charAt(0).toUpperCase() + words.slice(1) : "New agreement";
}
