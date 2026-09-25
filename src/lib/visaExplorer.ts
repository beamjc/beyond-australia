// Helpers for the Visa Options Explorer decision tree (src/data/visaExplorer.ts).

import { explorerNodes, type ExplorerNode, type QuestionNode } from "@/data/visaExplorer";
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
