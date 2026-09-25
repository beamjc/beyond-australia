'use client'

import { forwardRef } from "react";
import { AlertTriangle } from "lucide-react";
import { INCOME_PRESETS, fill, savingsCopy as c } from "@/data/savingsCopy";
import { Section, choiceClass, fmtA, inputClass, useT } from "./shared";

interface Props { income: number; setIncome: (n: number) => void; studentHours: number | null }

const IncomeSelector = forwardRef<HTMLInputElement, Props>(({ income, setIncome, studentHours }, ref) => {
  const { t } = useT();
  return (
    <Section
      title={t(c.incomeLabel)}
      helper={t(c.incomeHelper)}
      aside={<span className="shrink-0 text-right text-lg font-bold text-foreground tabular-nums">{fmtA(income)}<span className="block text-xs font-normal text-muted-foreground">{t(c.slashYear)}</span></span>}
    >
      <div className="grid grid-cols-3 gap-2">
        {INCOME_PRESETS.map((p) => (
          <button
            key={p.value}
            type="button"
            aria-pressed={income === p.value}
            onClick={() => setIncome(p.value)}
            title={p.hint ? t(p.hint) : undefined}
            className={choiceClass(income === p.value)}
          >
            <span className="block">{t(p.label)}</span>
            <span className="block text-xs opacity-80 tabular-nums">A${Math.round(p.value / 1000)}k</span>
          </button>
        ))}
      </div>
      <input
        type="range"
        min={1000}
        max={300000}
        step={1000}
        value={income}
        onChange={(e) => setIncome(parseInt(e.target.value, 10))}
        aria-label={t(c.incomeCustom)}
        className="mt-5 w-full accent-primary h-6"
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
