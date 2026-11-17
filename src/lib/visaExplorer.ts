// Helpers for the Visa Options Explorer decision tree (src/data/visaExplorer.ts).

import { explorerCopy, explorerNodes, START_NODE, type ExplorerNode, type QuestionNode } from "@/data/visaExplorer";
import type { ToolAnswers, VisaInterest } from "@/lib/visitorAnswers";
import type { Bi } from "@/data/visaReadiness";

const byId = new Map(explorerNodes.map((n) => [n.id, n]));

export const getNode = (id: string): ExplorerNode => {
  const n = byId.get(id);
  if (!n) throw new Error(`Unknown explorer node: ${id}`);
  return n;
};

/** Longest number of questions still to answer from this node (inclusive). */
export function questionsFrom(id: string, seen: Set<string> = new Set()): number {
  const n = getNode(id);
  if (n.kind !== "question" || seen.has(id)) return 0;
  const next = new Set(seen).add(id);
  return 1 + Math.max(0, ...n.options.map((o) => questionsFrom(o.next, next)));
}

/** A step in the visitor's path: the node shown and the option picked there (if any). */
export interface PathStep { node: string; choice?: string }

/** Reasons for the current result, taken only from the choices the visitor made. */
export function reasonsFor(path: PathStep[]): Bi[] {
  const out: Bi[] = [];
  for (const step of path) {
    const n = getNode(step.node);
    if (n.kind !== "question" || !step.choice) continue;
    const reason = n.options.find((o) => o.id === step.choice)?.reason;
    if (reason && !out.some((r) => r.th === reason.th)) out.push(reason);
  }
  return out;
}

/** Question number and total for the progress label, for the current path. */
export function progressFor(path: PathStep[]) {
  const answered = path.slice(0, -1).filter((s) => getNode(s.node).kind === "question" && s.choice).length;
  const current = path[path.length - 1];
  const remaining = questionsFrom(current.node);
  return { n: answered + 1, total: answered + remaining };
}

export const isQuestion = (n: ExplorerNode): n is QuestionNode => n.kind === "question";

const START_TO_VISA: Record<string, VisaInterest> = {
  whm: "whm", study: "student", skilled: "skilled", employer: "employer", unsure: "unsure",
};

/**
 * The visitor's choices and the result they reached, for the LINE lead form.
 * Null while they are still answering questions. Uses the tree's Thai wording.
 */
export function explorerLeadAnswers(path: PathStep[]): ToolAnswers | null {
  const end = getNode(path[path.length - 1].node);
  if (end.kind === "question") return null;
  const lines: string[] = [];
  for (const step of path) {
    const n = getNode(step.node);
    if (n.kind !== "question" || !step.choice) continue;
    const opt = n.options.find((o) => o.id === step.choice);
    if (opt) lines.push(n.title.th.trim().endsWith("?") ? `${n.title.th} ${opt.label.th}` : `${n.title.th}: ${opt.label.th}`);
  }
  lines.push(`→ ${end.title.th}`);
  const start = path.find((s) => s.node === START_NODE)?.choice;
  return {
    title: explorerCopy.title.th,
    lines,
    visaInterest: (start && START_TO_VISA[start]) || null,
    course: end.id === "student-english" ? "English course" : null,
    data: { path: path.map((s) => (s.choice ? `${s.node}:${s.choice}` : s.node)), result: end.id },
  };
}
