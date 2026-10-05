'use client'

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { savingsCopy as c } from "@/data/savingsCopy";
import { fmtA, useT } from "./shared";

/**
 * Phones/tablets only: one-line copy of the key result, shown while the
 * inputs are on screen and the result card is not, so each change can be
 * seen without scrolling. Tapping it jumps to the full result. Uses the
 * result card's existing labels (no new copy).
 */
const SavingsResultBar = ({
  visible, yearlySavings, reached, gap, onClick,
}: {
  visible: boolean;
  yearlySavings: number;
  reached: boolean;
  gap: number;
  onClick: () => void;
}) => {
  const { t } = useT();
  const reduceMotion = useReducedMotion();
  return (
    <div className="pointer-events-none fixed bottom-4 left-4 right-[88px] z-40 sm:left-1/2 sm:right-auto sm:w-[24rem] sm:-translate-x-1/2 lg:hidden">
      <AnimatePresence>
        {visible && (
          <motion.button
            type="button"
            onClick={onClick}
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? { opacity: 0, transition: { duration: 0 } } : { opacity: 0, y: 12 }}
            transition={{ duration: 0.2 }}
            className="pointer-events-auto flex min-h-14 w-full items-center gap-3 rounded-2xl border border-border bg-background/95 px-4 py-2 text-left shadow-lg backdrop-blur focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <span className="min-w-0 flex-1">
              <span className="block text-[11px] leading-tight text-muted-foreground">{t(c.yearlySavings)}</span>
              <span className={`block truncate text-base font-bold leading-snug tabular-nums ${yearlySavings >= 0 ? "text-emerald-700" : "text-foreground"}`}>
                {fmtA(yearlySavings)}
              </span>
              <span className="block truncate text-[11px] leading-tight tabular-nums">
                <span className="text-muted-foreground">{t(reached ? c.surplus : c.shortfall)} </span>
                <span className={reached ? "text-emerald-700" : "text-red-700"}>{fmtA(gap)}</span>
              </span>
            </span>
            <ArrowDown className="h-4 w-4 shrink-0 text-primary" aria-hidden />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SavingsResultBar;
