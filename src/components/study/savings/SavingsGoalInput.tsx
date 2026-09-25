'use client'

import { useState } from "react";
import { fill, savingsCopy as c } from "@/data/savingsCopy";
import { DEFAULT_SAVINGS_FX_THB_PER_AUD } from "@/lib/savings";
import { Section, fmtA, fmtB, inputClass, useT } from "./shared";

export type Currency = "THB" | "AUD";
/** The goal as typed, in the currency it was typed in (avoids rounding drift on toggles). */
export interface GoalState { amount: number; typedIn: Currency }

export const goalInCurrency = (g: GoalState, cur: Currency, rate: number) =>
  g.typedIn === cur ? g.amount : cur === "AUD" ? g.amount / rate : g.amount * rate;

interface Props {
  goal: GoalState;
  setGoal: (g: GoalState) => void;
  currency: Currency;
  setCurrency: (c: Currency) => void;
  rate: number;
  setRate: (r: number) => void;
}

const SavingsGoalInput = ({ goal, setGoal, currency, setCurrency, rate, setRate }: Props) => {
  const { t } = useT();
  const [editRate, setEditRate] = useState(false);
  const shown = Math.round(goalInCurrency(goal, currency, rate));
  const other = currency === "THB" ? fmtA(goalInCurrency(goal, "AUD", rate)) : fmtB(goalInCurrency(goal, "THB", rate));

  return (
    <Section title={t(c.goalTitle)}>
      <div className="flex items-end justify-between gap-3 mb-2">
        <label htmlFor="sav-goal" className="text-sm font-medium text-foreground">{t(c.goalLabel)}</label>
        <div className="flex shrink-0 rounded-lg border border-border p-0.5" role="group" aria-label="THB / AUD">
          {(["THB", "AUD"] as Currency[]).map((cur) => (
            <button
              key={cur}
              type="button"
              aria-pressed={currency === cur}
              onClick={() => setCurrency(cur)}
              className={`min-h-[40px] min-w-[52px] rounded-md px-3 text-sm font-semibold transition-colors ${
                currency === cur ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {cur}
            </button>
          ))}
        </div>
      </div>
      <div className="relative">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-lg font-semibold text-muted-foreground">
          {currency === "THB" ? "฿" : "A$"}
        </span>
        <input
          id="sav-goal"
          type="text"
          inputMode="numeric"
          value={shown ? shown.toLocaleString("en-US") : ""}
          onChange={(e) => setGoal({ amount: parseInt(e.target.value.replace(/[^\d]/g, ""), 10) || 0, typedIn: currency })}
          placeholder={currency === "THB" ? "1,000,000" : "43,500"}
          className={`${inputClass} pl-10 text-lg font-semibold`}
        />
      </div>
      <div className="mt-2 flex flex-wrap items-center justify-between gap-x-3 gap-y-1 text-sm text-muted-foreground">
        <span>{fill(t(c.about), { x: other })}</span>
        <button
          type="button"
          onClick={() => setEditRate((v) => !v)}
          aria-expanded={editRate}
          aria-controls="sav-fx"
          className="min-h-[36px] text-xs underline underline-offset-2 hover:text-foreground"
        >
          {fill(t(c.fxLine), { rate })} · {t(c.fxEdit)}
        </button>
      </div>
      {editRate && (
        <div id="sav-fx" className="mt-3 rounded-xl bg-muted/40 p-3">
          <label htmlFor="sav-fx-input" className="block text-xs font-medium text-muted-foreground mb-1">{t(c.fxInputLabel)}</label>
          <input
            id="sav-fx-input"
            type="number"
            step="0.1"
            min="1"
            value={rate}
            onChange={(e) => setRate(parseFloat(e.target.value) || DEFAULT_SAVINGS_FX_THB_PER_AUD)}
            className={inputClass}
          />
          <p className="mt-1 text-xs text-muted-foreground">{t(c.fxHint)}</p>
        </div>
      )}
    </Section>
  );
};

export default SavingsGoalInput;
