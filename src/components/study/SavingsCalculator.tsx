'use client'

import { useMemo, useRef, useState } from "react";
import { savingsCopy as c } from "@/data/savingsCopy";
import {
  DEFAULT_SAVINGS_FX_THB_PER_AUD, computeSavingsPlan, requiredGrossIncome, type SavingsVisaType,
} from "@/lib/savings";
import SavingsShareButtons from "./SavingsShareButtons";
import SavingsGoalInput, { goalInCurrency, type Currency, type GoalState } from "./savings/SavingsGoalInput";
import DurationSelector from "./savings/DurationSelector";
import VisaTypeSelector from "./savings/VisaTypeSelector";
import IncomeSelector from "./savings/IncomeSelector";
import ExpenseSelector from "./savings/ExpenseSelector";
import SavingsResult, { type Adjust } from "./savings/SavingsResult";
import SavingsConsultationCTA from "./savings/SavingsConsultationCTA";
import { fmtA, useT } from "./savings/shared";

/**
 * One savings planner. Visa type is just another input: it selects the tax
 * strategy (and the work-rights note / student hours check); every other input
 * and the result layout are shared.
 */
const SavingsCalculator = () => {
  const { t } = useT();
  const [visaType, setVisaType] = useState<SavingsVisaType>("whm");
  const [currency, setCurrency] = useState<Currency>("THB");
  const [goal, setGoal] = useState<GoalState>({ amount: 1_000_000, typedIn: "THB" });
  const [years, setYears] = useState(1);
  const [income, setIncome] = useState(60_000);
  const [monthly, setMonthly] = useState(2_000);
  const [rate, setRate] = useState(DEFAULT_SAVINGS_FX_THB_PER_AUD);

  const incomeRef = useRef<HTMLInputElement>(null);
  const expenseRef = useRef<HTMLInputElement>(null);
  const durationRef = useRef<HTMLDivElement>(null);

  const goalAUD = goalInCurrency(goal, "AUD", rate);
  const plan = useMemo(
    () => computeSavingsPlan({ visaType, annualIncome: income, monthlyExpenses: monthly, goalAUD, years }),
    [visaType, income, monthly, goalAUD, years],
  );
  const requiredIncome = useMemo(
    () => requiredGrossIncome({ visaType, monthlyExpenses: monthly, goalAUD, years }),
    [visaType, monthly, goalAUD, years],
  );

  const onAdjust = (a: Adjust) => {
    const smooth = !window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const el = a === "income" ? incomeRef.current : a === "expenses" ? expenseRef.current : durationRef.current;
    el?.scrollIntoView({ behavior: smooth ? "smooth" : "auto", block: "center" });
    if (a === "duration") {
      (durationRef.current?.querySelectorAll("button")[Math.min(years, 2)] as HTMLButtonElement | undefined)?.focus({ preventScroll: true });
    } else {
      (el as HTMLInputElement | null)?.focus({ preventScroll: true });
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <header className="text-center mb-8">
        <h3 className="text-2xl md:text-3xl font-bold text-foreground">{t(c.title)}</h3>
        <p className="mt-2 text-muted-foreground">{t(c.subtitle)}</p>
      </header>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,400px)] lg:gap-6 items-start">
        {/* 1–5: inputs */}
        <div className="space-y-4 lg:col-start-1">
          <SavingsGoalInput goal={goal} setGoal={setGoal} currency={currency} setCurrency={setCurrency} rate={rate} setRate={setRate} />
          <DurationSelector ref={durationRef} years={years} setYears={setYears} requiredAnnualSaving={plan.requiredAnnualSaving} />
          <VisaTypeSelector visaType={visaType} setVisaType={setVisaType} />
          <IncomeSelector
            ref={incomeRef}
            income={income}
            setIncome={setIncome}
            studentHours={plan.exceedsStudentHours ? plan.fortnightlyHoursAtMinWage : null}
          />
          <ExpenseSelector ref={expenseRef} monthly={monthly} setMonthly={setMonthly} />
        </div>

        {/* 6–7: result + adjustments (sticky beside the inputs on tall desktop screens only) */}
        <aside className="lg:col-start-2 lg:row-start-1 lg:row-span-2 lg:[@media(min-height:1000px)]:sticky lg:top-24">
          <SavingsResult
            plan={plan}
            visaType={visaType}
            income={income}
            monthly={monthly}
            goalAUD={goalAUD}
            years={years}
            requiredIncome={requiredIncome}
            rate={rate}
            onAdjust={onAdjust}
          />
        </aside>

        {/* 8–9: consultation + share */}
        <div className="lg:col-start-1 lg:row-start-2">
          <SavingsConsultationCTA />
          <SavingsShareButtons
            netIncome={fmtA(plan.netIncome)}
            annualSavings={fmtA(plan.yearlySavings)}
            bufferLabel={t(plan.isAchievable ? c.surplus : c.shortfall)}
            bufferAmount={fmtA(Math.abs(plan.buffer))}
          />
        </div>
      </div>
    </div>
  );
};

export default SavingsCalculator;
