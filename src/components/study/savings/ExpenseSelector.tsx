'use client'

import { forwardRef } from "react";
import { EXPENSE_PRESETS, fill, savingsCopy as c } from "@/data/savingsCopy";
import { Section, choiceClass, fmtA, inputClass, useT } from "./shared";

interface Props { monthly: number; setMonthly: (n: number) => void }

const ExpenseSelector = forwardRef<HTMLInputElement, Props>(({ monthly, setMonthly }, ref) => {
  const { t } = useT();
  return (
    <Section
      title={t(c.expensesLabel)}
      helper={t(c.expensesContext)}
      aside={<span className="shrink-0 text-right text-lg font-bold text-foreground tabular-nums">{fmtA(monthly)}<span className="block text-xs font-normal text-muted-foreground">{t(c.slashMonth)}</span></span>}
    >
      <div className="grid grid-cols-3 gap-2">
        {EXPENSE_PRESETS.map((p) => (
          <button key={p.value} type="button" aria-pressed={monthly === p.value} onClick={() => setMonthly(p.value)} className={choiceClass(monthly === p.value)}>
            <span className="block">{t(p.label)}</span>
            <span className="block text-xs opacity-80 tabular-nums">{fmtA(p.value)}</span>
          </button>
        ))}
      </div>
      <input
        ref={ref}
        type="text"
        inputMode="numeric"
        aria-label={t(c.expensesCustom)}
        value={monthly ? monthly.toLocaleString("en-US") : ""}
        onChange={(e) => setMonthly(parseInt(e.target.value.replace(/[^\d]/g, ""), 10) || 0)}
        className={`${inputClass} mt-3 text-sm`}
      />
      <p className="mt-2 text-sm text-muted-foreground">{fill(t(c.expensesYearly), { x: fmtA(monthly * 12) })}</p>
    </Section>
  );
});
ExpenseSelector.displayName = "ExpenseSelector";

export default ExpenseSelector;
