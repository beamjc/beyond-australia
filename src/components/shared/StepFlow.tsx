'use client'

import { useEffect, useRef, useState, type RefObject } from "react";
import { ArrowLeft, ArrowRight, Pencil } from "lucide-react";

/**
 * Step-by-step input flow for phones/tablets (below the lg breakpoint):
 * one input group per screen, then the results. Desktop keeps the original
 * layout, so every element here is `lg:hidden`. Used by the Budget Planner
 * and the Savings calculator. Text comes in as props (callers own copy).
 */

export const isBelowLg = () =>
  typeof window !== "undefined" && !!window.matchMedia?.("(max-width: 1023.98px)").matches;

/** Live `isBelowLg()`; false during server render and on desktop. */
export const useBelowLg = () => {
  const [below, setBelow] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia?.("(max-width: 1023.98px)");
    if (!mq) return;
    const update = () => setBelow(mq.matches);
    update();
    mq.addEventListener?.("change", update);
    return () => mq.removeEventListener?.("change", update);
  }, []);
  return below;
};

/** Short selected state before auto-advancing (matches the Planning hub tools). */
export const STEP_AUTO_ADVANCE_MS = 200;

/** Classes that hide a step's input group on phones/tablets unless it is current. */
export const stepVisibility = (isCurrent: boolean) => (isCurrent ? "" : "max-lg:hidden");

/**
 * Phones/tablets: keep the inputs' top in view when the step changes, and
 * bring the results up when the visitor finishes.
 */
export const useStepFlowScroll = (
  inputsRef: RefObject<HTMLElement>,
  resultRef: RefObject<HTMLElement>,
  step: number,
  done: boolean,
  reduceMotion: boolean | null,
) => {
  const first = useRef(true);
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    if (!isBelowLg()) return;
    const target = done ? resultRef.current : inputsRef.current;
    if (target && (done || target.getBoundingClientRect().top < 72)) {
      target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
    }
  }, [step, done, reduceMotion, inputsRef, resultRef]);
};

/** "Step n of total" + progress bar. */
export const StepProgress = ({ label, step, total }: { label: string; step: number; total: number }) => (
  <div className="lg:hidden">
    <p className="text-xs font-medium text-muted-foreground">{label}</p>
    <div
      className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-muted"
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={total}
      aria-valuenow={step + 1}
      aria-label={label}
    >
      <div
        className="h-full rounded-full bg-primary transition-[width] duration-300 motion-reduce:transition-none"
        style={{ width: `${((step + 1) / total) * 100}%` }}
      />
    </div>
  </div>
);

/** Back / next; the last step's button shows the results. */
export const StepNav = ({
  canBack, last, backLabel, nextLabel, doneLabel, onBack, onNext,
}: {
  canBack: boolean;
  last: boolean;
  backLabel: string;
  nextLabel: string;
  doneLabel: string;
  onBack: () => void;
  onNext: () => void;
}) => (
  <div className="flex items-center justify-between gap-3 lg:hidden">
    <button
      type="button"
      onClick={onBack}
      disabled={!canBack}
      className="inline-flex min-h-11 items-center gap-1.5 rounded-xl px-3 text-sm font-medium text-muted-foreground hover:text-foreground disabled:invisible focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <ArrowLeft className="h-4 w-4" aria-hidden /> {backLabel}
    </button>
    <button
      type="button"
      onClick={onNext}
      className="inline-flex min-h-11 items-center gap-1.5 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
    >
      {last ? doneLabel : nextLabel} <ArrowRight className="h-4 w-4" aria-hidden />
    </button>
  </div>
);

export interface StepAnswer { key: string; label: string; value: string; onEdit: () => void }

/** After finishing: the answers in one compact list; each row reopens its step. */
export const AnswerList = ({
  answers, editAllLabel, onEditAll,
}: {
  answers: StepAnswer[];
  editAllLabel: string;
  onEditAll: () => void;
}) => (
  <div className="lg:hidden">
    <ul className="divide-y divide-border rounded-xl border border-border bg-background">
      {answers.map((a) => (
        <li key={a.key}>
          <button
            type="button"
            onClick={a.onEdit}
            className="flex min-h-11 w-full items-center gap-3 rounded-xl px-3 py-2 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <span className="min-w-0 flex-1">
              <span className="block text-[11px] leading-tight text-muted-foreground">{a.label}</span>
              <span className="block truncate text-sm font-semibold text-foreground tabular-nums">{a.value}</span>
            </span>
            <Pencil className="h-3.5 w-3.5 shrink-0 text-muted-foreground" aria-hidden />
          </button>
        </li>
      ))}
    </ul>
    <button
      type="button"
      onClick={onEditAll}
      className="mt-3 inline-flex min-h-10 items-center gap-1.5 rounded-lg px-1 text-sm font-medium text-primary hover:text-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <Pencil className="h-4 w-4" aria-hidden /> {editAllLabel}
    </button>
  </div>
);
