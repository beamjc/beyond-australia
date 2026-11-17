// Collects what a visitor entered across the site's tools during this visit,
// so any LINE button can hand all of it to the LIFF lead form at once.
//
// Kept in sessionStorage only (this tab, cleared when it closes). Nothing leaves
// the browser unless the visitor taps a LINE button while LIFF is configured.

import type { LeadDraft } from "./leadDraft";

export type VisaInterest = "student" | "whm" | "skilled" | "employer" | "unsure";

export interface ToolAnswers {
  /** Tool name as shown on the site (Thai), used as the heading in the summary. */
  title: string;
  /** "label: value" lines built from the tool's existing on-screen wording. */
  lines: string[];
  /** The fields staff care about most. Leave out what the tool doesn't ask. */
  age?: number | null;
  visaInterest?: VisaInterest | null;
  /** One of the LIFF form's programme values (see PROGRAM_OPTIONS in liffForm.ts). */
  course?: string | null;
  /** Raw answers for reference; not shown to the visitor. */
  data?: Record<string, unknown>;
}

export interface StoredToolAnswers extends ToolAnswers {
  tool: string;
  at: number;
}

const KEY = "ba.toolAnswers";
const MAX_LINES_PER_TOOL = 12;

function readStore(): Record<string, StoredToolAnswers> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.sessionStorage.getItem(KEY);
    const v = raw ? JSON.parse(raw) : {};
    return v && typeof v === "object" && !Array.isArray(v) ? v : {};
  } catch {
    return {};
  }
}

function writeStore(v: Record<string, StoredToolAnswers>) {
  try {
    window.sessionStorage.setItem(KEY, JSON.stringify(v));
  } catch {
    /* storage blocked or full: the LINE button still works without answers */
  }
}

export function recordToolAnswers(tool: string, answers: ToolAnswers, now = Date.now()): void {
  if (typeof window === "undefined") return;
  const store = readStore();
  store[tool] = { ...answers, lines: answers.lines.slice(0, MAX_LINES_PER_TOOL), tool, at: now };
  writeStore(store);
}

export function clearToolAnswers(tool: string): void {
  if (typeof window === "undefined") return;
  const store = readStore();
  if (!(tool in store)) return;
  delete store[tool];
  writeStore(store);
}

export function readToolAnswers(): StoredToolAnswers[] {
  return Object.values(readStore());
}

/** Most recent non-empty value wins: the visitor's latest answer is the freshest. */
function latest<K extends "age" | "visaInterest" | "course">(list: StoredToolAnswers[], k: K) {
  for (const t of [...list].sort((a, b) => b.at - a.at)) {
    const v = t[k];
    if (v !== undefined && v !== null && v !== "") return v as NonNullable<StoredToolAnswers[K]>;
  }
  return null;
}

/**
 * One draft from every tool used. Pure (takes the list) so it can be tested.
 * `summary` lists each tool's answers in the order they were used.
 */
export function combineToolAnswers(list: StoredToolAnswers[]): LeadDraft | null {
  if (!list.length) return null;
  const ordered = [...list].sort((a, b) => a.at - b.at);
  const summary = ordered
    .map((t) => [`■ ${t.title}`, ...t.lines].join("\n"))
    .join("\n\n")
    .slice(0, 3000);
  const age = latest(list, "age");
  const visaInterest = latest(list, "visaInterest");
  const course = latest(list, "course");
  return {
    tool: ordered.length === 1 ? ordered[0].tool : "website-tools",
    answers: {
      summary,
      ...(age !== null ? { age } : {}),
      ...(visaInterest !== null ? { visa_interest: visaInterest } : {}),
      ...(course !== null ? { program_interest: course } : {}),
      tools_used: ordered.map((t) => t.tool),
      tools: Object.fromEntries(ordered.map((t) => [t.tool, t.data ?? {}])),
    },
  };
}

export const buildLeadDraft = () => combineToolAnswers(readToolAnswers());
