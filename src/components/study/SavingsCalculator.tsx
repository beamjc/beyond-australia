'use client'

import { useEffect, useMemo, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { fill, savingsCopy as c } from "@/data/savingsCopy";
import { finderCopy } from "@/data/studyFinder";
import { readinessCopy } from "@/data/visaReadiness";
import {
  DEFAULT_SAVINGS_FX_THB_PER_AUD, computeSavingsPlan, requiredGrossIncome, type SavingsVisaType,
} from "@/lib/savings";
import SavingsGoalInput, { goalInCurrency, type Currency, type GoalState } from "./savings/SavingsGoalInput";
import DurationSelector from "./savings/DurationSelector";
import VisaTypeSelector from "./savings/VisaTypeSelector";
import IncomeSelector from "./savings/IncomeSelector";
import ExpenseSelector from "./savings/ExpenseSelector";
import SavingsResult, { type Adjust } from "./savings/SavingsResult";
import { fmtA, fmtB, useT, yearsText } from "./savings/shared";
import {
  AnswerList, StepNav, StepProgress, isBelowLg, stepVisibility, useStepFlowScroll,
} from "../shared/StepFlow";
import SavingsResultBar from "./savings/SavingsResultBar";

/**
 * One savings planner. Visa type is just another input: it selects the tax
 * strategy (and the work-rights note / student hours check); every other input
 * and the result layout are shared.
 */
const SavingsCalculator = () => {
  const { t, language } = useT();
  const reduceMotion = useReducedMotion();
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

  // Phones/tablets: the result card sits below five input cards, so show a
  // compact result bar while the inputs are on screen and the card is not.
  const inputsRef = useRef<HTMLDivElement>(null);
  const resultRef = useRef<HTMLElement>(null);
  const [inputsInView, setInputsInView] = useState(false);
  const [resultInView, setResultInView] = useState(true);
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const nav = { rootMargin: "-64px 0px 0px 0px" }; // fixed navbar
    const inputs = new IntersectionObserver(([e]) => setInputsInView(e.isIntersecting), nav);
    const result = new IntersectionObserver(([e]) => setResultInView(e.isIntersecting), { ...nav, threshold: 0.25 });
    if (inputsRef.current) inputs.observe(inputsRef.current);
    if (resultRef.current) result.observe(resultRef.current);
    return () => { inputs.disconnect(); result.disconnect(); };
  }, []);

  const goalAUD = goalInCurrency(goal, "AUD", rate);
  const plan = useMemo(
    () => computeSavingsPlan({ visaType, annualIncome: income, monthlyExpenses: monthly, goalAUD, years }),
    [visaType, income, monthly, goalAUD, years],
  );
  const requiredIncome = useMemo(
    () => requiredGrossIncome({ visaType, monthlyExpenses: monthly, goalAUD, years }),
    [visaType, monthly, goalAUD, years],
  );

  // Phones/tablets: one input card per step, then the result (desktop:
  // inputs beside the result, unchanged).
  const STEPS = ["goal", "duration", "visa", "income", "expenses"] as const;
  type Step = (typeof STEPS)[number];
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const stepClass = (s: Step) => stepVisibility(!done && STEPS[step] === s);
  const goToStep = (i: number) => { setDone(false); setStep(i); };
  useStepFlowScroll(inputsRef, resultRef, step, done, reduceMotion);

  // "Adjust" buttons in the result: on phones/tablets reopen that step, then
  // focus its control once it is visible.
  const [pendingAdjust, setPendingAdjust] = useState<Adjust | null>(null);
  useEffect(() => {
    if (!pendingAdjust) return;
    setPendingAdjust(null);
    focusAdjust(pendingAdjust);
    // focusAdjust only reads refs and the current years; run once per request.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingAdjust]);

  const onAdjust = (a: Adjust) => {
    if (isBelowLg()) {
      goToStep(STEPS.indexOf(a === "income" ? "income" : a === "expenses" ? "expenses" : "duration"));
      setPendingAdjust(a);
      return;
    }
    focusAdjust(a);
  };

  const focusAdjust = (a: Adjust) => {
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
        <div ref={inputsRef} className="scroll-mt-20 lg:col-start-1">
          {/* Outside the space-y list: as its first child it would add a top
              margin to the first card on desktop, where it is hidden. */}
          <div className="mb-4 lg:hidden">
          {done ? (
            <AnswerList
              answers={[
                { key: "goal", label: t(c.goalTitle), value: currency === "THB" ? fmtB(goalInCurrency(goal, "THB", rate)) : fmtA(goalInCurrency(goal, "AUD", rate)) },
                { key: "duration", label: t(c.durationLabel), value: yearsText(years, language) },
                { key: "visa", label: t(c.visaLabel), value: t(visaType === "whm" ? c.visaWhm : c.visaStudent) },
                { key: "income", label: t(c.incomeLabel), value: `${fmtA(income)} ${t(c.slashYear)}` },
                { key: "expenses", label: t(c.expensesLabel), value: `${fmtA(monthly)} ${t(c.slashMonth)}` },
              ].map((a) => ({ ...a, onEdit: () => goToStep(STEPS.indexOf(a.key as Step)) }))}
              editAllLabel={t(readinessCopy.editAnswers)}
              onEditAll={() => goToStep(0)}
            />
          ) : (
            <StepProgress label={fill(t(finderCopy.step), { n: step + 1, total: STEPS.length })} step={step} total={STEPS.length} />
          )}
          </div>
          <div className="space-y-4">
          <div className={stepClass("goal")}><SavingsGoalInput goal={goal} setGoal={setGoal} currency={currency} setCurrency={setCurrency} rate={rate} setRate={setRate} /></div>
          <div className={stepClass("duration")}><DurationSelector ref={durationRef} years={years} setYears={setYears} requiredAnnualSaving={plan.requiredAnnualSaving} /></div>
          <div className={stepClass("visa")}><VisaTypeSelector visaType={visaType} setVisaType={setVisaType} /></div>
          <div className={stepClass("income")}><IncomeSelector
            ref={incomeRef}
            income={income}
            setIncome={setIncome}
            studentHours={plan.exceedsStudentHours ? plan.fortnightlyHoursAtMinWage : null}
          /></div>
          <div className={stepClass("expenses")}><ExpenseSelector ref={expenseRef} monthly={monthly} setMonthly={setMonthly} /></div>
          {!done && (
            <StepNav
              canBack={step > 0}
              last={step === STEPS.length - 1}
              backLabel={t(finderCopy.back)}
              nextLabel={t(finderCopy.next)}
              doneLabel={t(c.seeResults)}
              onBack={() => setStep(step - 1)}
              onNext={() => (step === STEPS.length - 1 ? setDone(true) : setStep(step + 1))}
            />
          )}
          </div>
        </div>

        {/* 6–7: result + adjustments (sticky beside the inputs on tall desktop screens only) */}
        <aside ref={resultRef} className={`scroll-mt-20 ${done ? "" : "max-lg:hidden"} lg:col-start-2 lg:row-start-1 lg:[@media(min-height:1000px)]:sticky lg:top-24`}>
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
      </div>

      <SavingsResultBar
        visible={inputsInView && !resultInView}
        yearlySavings={plan.yearlySavings}
        reached={plan.isAchievable}
        gap={Math.abs(plan.buffer)}
        onClick={() => {
          if (!done && isBelowLg()) { setDone(true); return; }
          const smooth = !window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
          resultRef.current?.scrollIntoView({ behavior: smooth ? "smooth" : "auto", block: "start" });
        }}
      />
    </div>
  );
};

export default SavingsCalculator;
