'use client'

import { CheckCircle2, Info, TrendingUp } from "lucide-react";
import { fill, savingsCopy as c } from "@/data/savingsCopy";
import type { computeSavingsPlan, SavingsVisaType } from "@/lib/savings";
import { fmtA, useT, yearsText } from "./shared";

type Plan = ReturnType<typeof computeSavingsPlan>;
export type Adjust = "income" | "expenses" | "duration";

interface Props {
  plan: Plan;
  visaType: SavingsVisaType;
  income: number;
  monthly: number;
  goalAUD: number;
  years: number;
  requiredIncome: number;
  rate: number;
  onAdjust: (a: Adjust) => void;
}

const Row = ({ label, value, strong, children }: { label: string; value: string; strong?: boolean; children?: React.ReactNode }) => (
  <div className="py-1.5">
    <div className="flex items-baseline justify-between gap-3">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className={`tabular-nums ${strong ? "font-semibold text-foreground" : "text-foreground"}`}>{value}</span>
    </div>
    {children}
  </div>
);

/** One result layout for every visa type; visa type only changes the tax figures and note. */
const SavingsResult = ({ plan, visaType, income, monthly, goalAUD, years, requiredIncome, rate, onAdjust }: Props) => {
  const { t, language } = useT();
  const yrs = yearsText(years, language);
  const reached = plan.isAchievable;
  const gap = Math.abs(plan.buffer);

  const summary = [
    fill(t(plan.yearlySavings >= 0 ? c.summaryIncome : c.summaryNegative), {
      income: fmtA(income), monthly: fmtA(monthly), annual: fmtA(Math.abs(plan.yearlySavings)),
    }),
    years === 1
      ? fill(t(reached ? c.summaryOneYearReached : c.summaryOneYearShort), { goal: fmtA(goalAUD), gap: fmtA(gap) })
      : fill(t(c.summaryMultiYear), { n: years, yrs, total: fmtA(plan.totalSavings), goal: fmtA(goalAUD) }),
  ].join(" ");

  const actions: Adjust[] = reached ? ["income", "expenses"] : years < 3 ? ["income", "expenses", "duration"] : ["income", "expenses"];
  const actionLabel = { income: c.adjustIncome, expenses: c.adjustExpenses, duration: c.adjustDuration };

  return (
    <section aria-labelledby="sav-result" className="rounded-2xl border border-border bg-card p-5 sm:p-6">
      <h4 id="sav-result" className="flex items-center gap-2 font-semibold text-foreground">
        <TrendingUp className="h-5 w-5 text-primary" aria-hidden />
        {t(c.resultTitle)}
      </h4>

      <div className="mt-3 divide-y divide-border/60">
        <Row label={t(c.gross)} value={fmtA(income)} />
        <Row label={t(c.tax)} value={`− ${fmtA(plan.tax)}`}>
          <span className="mt-1 inline-block rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
            {t(visaType === "whm" ? c.chipWhm : c.chipStudent)}
          </span>
        </Row>
        <Row label={t(c.net)} value={fmtA(plan.netIncome)} strong />
        <Row label={t(c.yearlyExpenses)} value={`− ${fmtA(plan.yearlyExpenses)}`} />
      </div>

      <div className="mt-3 border-t-2 border-border pt-3 space-y-1">
        <div className="flex items-baseline justify-between gap-3">
          <span className="text-sm font-medium text-foreground">{t(c.yearlySavings)}</span>
          <span className={`text-2xl font-bold tabular-nums ${plan.yearlySavings >= 0 ? "text-emerald-700 dark:text-emerald-400" : "text-foreground"}`}>
            {fmtA(plan.yearlySavings)}
          </span>
        </div>
        {years > 1 && <Row label={fill(t(c.totalSavings), { n: years, yrs })} value={fmtA(plan.totalSavings)} strong />}
        {years === 1 ? (
          <Row label={t(c.yourGoal)} value={`${fmtA(plan.requiredAnnualSaving)} ${t(c.slashYear)}`} />
        ) : (
          <Row label={t(c.yourGoal)} value={fmtA(goalAUD)}>
            <p className="text-right text-xs text-muted-foreground tabular-nums">≈ {fmtA(plan.requiredAnnualSaving)} {t(c.slashYear)}</p>
          </Row>
        )}
        <div className="flex items-baseline justify-between gap-3 py-1.5">
          <span className="text-sm text-muted-foreground">{t(reached ? c.surplus : c.shortfall)}</span>
          <span className={`font-semibold tabular-nums ${reached ? "text-emerald-700 dark:text-emerald-400" : "text-red-700 dark:text-red-400"}`}>
            {fmtA(gap)}
          </span>
        </div>
      </div>

      {/* Status: colour only here */}
      <div
        role="status"
        className={`mt-4 rounded-xl p-4 ${reached ? "bg-emerald-500/10" : "bg-red-500/[0.07] dark:bg-red-500/10"}`}
      >
        <p className={`flex items-center gap-2 text-sm font-semibold ${reached ? "text-emerald-800 dark:text-emerald-300" : "text-red-800 dark:text-red-300"}`}>
          {reached ? <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden /> : <Info className="h-4 w-4 shrink-0" aria-hidden />}
          {t(reached ? c.reachedTitle : c.notReachedTitle)}
        </p>
        <p className="mt-1.5 text-sm text-foreground/80 leading-relaxed">{summary}</p>
      </div>

      {!reached && requiredIncome > 0 && (
        <div className="mt-3 rounded-xl border border-border p-4">
          <p className="text-sm font-semibold text-foreground">{t(c.requiredTitle)}</p>
          <p className="mt-1 text-sm text-muted-foreground">{fill(t(c.requiredLine), { n: years, yrs })}</p>
          <p className="mt-1 text-lg font-bold text-foreground tabular-nums">
            {fmtA(requiredIncome)} <span className="text-sm font-normal text-muted-foreground">{t(c.slashYear)}</span>
          </p>
        </div>
      )}

      <div className="mt-4">
        <p className="text-sm font-medium text-foreground">{t(reached ? c.adjustFaster : c.adjustShort)}</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {actions.map((a) => (
            <button
              key={a}
              type="button"
              onClick={() => onAdjust(a)}
              className="min-h-[44px] rounded-xl border border-border bg-background px-4 text-sm font-medium text-foreground hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {t(actionLabel[a])}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 space-y-1 border-t border-border pt-3 text-xs text-muted-foreground leading-relaxed">
        <p>{t(visaType === "whm" ? c.taxNoteWhm : c.taxNoteStudent)}</p>
        <p>{t(c.taxShared)}</p>
        <p>{t(c.footTax)}</p>
        <p>{fill(t(c.footFx), { rate })}</p>
      </div>
    </section>
  );
};

export default SavingsResult;
