'use client'

import { forwardRef } from "react";
import { AlertTriangle } from "lucide-react";
import { fill, savingsCopy as c } from "@/data/savingsCopy";
import { Section, fmtA, inputClass, useT } from "./shared";

interface Props { income: number; setIncome: (n: number) => void; studentHours: number | null }

const IncomeSelector = forwardRef<HTMLInputElement, Props>(({ income, setIncome, studentHours }, ref) => {
  const { t } = useT();
  return (
    <Section
      title={t(c.incomeLabel)}
      aside={<span className="shrink-0 text-right text-lg font-bold text-foreground tabular-nums">{fmtA(income)}<span className="block text-xs font-normal text-muted-foreground">{t(c.slashYear)}</span></span>}
    >
      <input
        type="range"
        min={1000}
        max={300000}
        step={1000}
        value={income}
        onChange={(e) => setIncome(parseInt(e.target.value, 10))}
        aria-label={t(c.incomeCustom)}
        className="mt-1 w-full accent-primary h-10 lg:h-6"
      />
      <input
        ref={ref}
        type="text"
        inputMode="numeric"
        aria-label={t(c.incomeCustom)}
        value={income ? income.toLocaleString("en-US") : ""}
        onChange={(e) => setIncome(parseInt(e.target.value.replace(/[^\d]/g, ""), 10) || 0)}
        className={`${inputClass} mt-2 text-sm`}
      />
      {studentHours !== null && (
        <p className="mt-3 flex items-start gap-2 rounded-xl bg-amber-500/10 p-3 text-xs text-amber-800 dark:text-amber-300">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
          {fill(t(c.studentHours), { h: Math.round(studentHours) })}
        </p>
      )}
    </Section>
  );
});
IncomeSelector.displayName = "IncomeSelector";

export default IncomeSelector;
