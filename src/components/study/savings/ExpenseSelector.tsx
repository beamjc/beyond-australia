'use client'

import { forwardRef } from "react";
import { EXPENSE_MAX, EXPENSE_MIN, fill, savingsCopy as c } from "@/data/savingsCopy";
import { Section, fmtA, inputClass, useT } from "./shared";

interface Props { monthly: number; setMonthly: (n: number) => void }

const ExpenseSelector = forwardRef<HTMLInputElement, Props>(({ monthly, setMonthly }, ref) => {
  const { t } = useT();
  return (
    <Section
      title={t(c.expensesLabel)}
      helper={t(c.expensesContext)}
      aside={<span className="shrink-0 text-right text-lg font-bold text-foreground tabular-nums">{fmtA(monthly)}<span className="block text-xs font-normal text-muted-foreground">{t(c.slashMonth)}</span></span>}
    >
      <input
        type="range"
        min={EXPENSE_MIN}
        max={EXPENSE_MAX}
        step={50}
        value={Math.min(Math.max(monthly, EXPENSE_MIN), EXPENSE_MAX)}
        onChange={(e) => setMonthly(parseInt(e.target.value, 10))}
        aria-label={t(c.expensesCustom)}
        className="mt-1 w-full accent-primary h-10 lg:h-6"
      />
      <input
        ref={ref}
        type="text"
        inputMode="numeric"
        aria-label={t(c.expensesCustom)}
        value={monthly ? monthly.toLocaleString("en-US") : ""}
        onChange={(e) => setMonthly(parseInt(e.target.value.replace(/[^\d]/g, ""), 10) || 0)}
        className={`${inputClass} mt-2 text-sm`}
      />
      <p className="mt-2 text-sm text-muted-foreground">{fill(t(c.expensesYearly), { x: fmtA(monthly * 12) })}</p>
    </Section>
  );
});
ExpenseSelector.displayName = "ExpenseSelector";

export default ExpenseSelector;
