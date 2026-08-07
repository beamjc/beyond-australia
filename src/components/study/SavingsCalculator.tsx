'use client'

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  PiggyBank,
  Plane,
  GraduationCap,
  Settings,
  Info,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Wallet,
  Briefcase,
} from "lucide-react";
import SavingsShareButtons from "./SavingsShareButtons";
import BSCConsultationCTA from "../shared/BSCConsultationCTA";

type VisaTrack = "whm" | "student";
type Currency = "AUD" | "THB";

const INCOME_PRESETS = [
  { label: "Min Wage", value: 49301, hint: "$24.95/hr × 38hr" },
  { label: "Low", value: 40000 },
  { label: "Mid", value: 60000 },
  { label: "Median", value: 72000 },
  { label: "Average", value: 100000 },
  { label: "High", value: 183100 },
];

const EXPENSE_PRESETS = [
  { label: "Budget", value: 2000 },
  { label: "Moderate", value: 2500 },
  { label: "Comfortable", value: 3200 },
];

// 2025–26 WHM tax
const calcWhmTax = (income: number) => {
  if (income <= 0) return 0;
  if (income <= 45000) return income * 0.15;
  if (income <= 135000) return 6750 + (income - 45000) * 0.30;
  if (income <= 190000) return 33750 + (income - 135000) * 0.37;
  return 54100 + (income - 190000) * 0.45;
};

// 2025–26 Resident tax
const calcResidentTax = (income: number) => {
  if (income <= 18200) return 0;
  if (income <= 45000) return (income - 18200) * 0.16;
  if (income <= 135000) return 4288 + (income - 45000) * 0.30;
  if (income <= 190000) return 31288 + (income - 135000) * 0.37;
  return 51638 + (income - 190000) * 0.45;
};

const SavingsCalculator = () => {
  const [track, setTrack] = useState<VisaTrack>("whm");
  const [currency, setCurrency] = useState<Currency>("THB");
  const [goalInput, setGoalInput] = useState<string>("1000000");
  const [duration, setDuration] = useState<number>(1);
  const [income, setIncome] = useState<number>(60000);
  const [monthlyExpenses, setMonthlyExpenses] = useState<number>(2000);
  const [exchangeRate, setExchangeRate] = useState<number>(23);
  const [showSettings, setShowSettings] = useState(false);

  const today = new Date().toISOString().split("T")[0];

  const goalAUD = useMemo(() => {
    const n = parseFloat(goalInput.replace(/,/g, "")) || 0;
    return currency === "AUD" ? n : n / exchangeRate;
  }, [goalInput, currency, exchangeRate]);

  const result = useMemo(() => {
    const tax = track === "whm" ? calcWhmTax(income) : calcResidentTax(income);
    const netIncome = income - tax;
    const yearlyExpenses = monthlyExpenses * 12;
    const yearlySavingsCapacity = netIncome - yearlyExpenses;
    const requiredAnnualSaving = goalAUD / duration;
    const totalSavings = yearlySavingsCapacity * duration;
    const buffer = totalSavings - goalAUD;
    const buffered = yearlySavingsCapacity - requiredAnnualSaving;
    const effectiveRate = income > 0 ? (tax / income) * 100 : 0;

    // Hours needed to earn this income at min wage
    const hourlyRate = 24.95;
    const weeklyHoursNeeded = income / hourlyRate / 52;
    const fortnightlyHoursNeeded = weeklyHoursNeeded * 2;

    return {
      tax,
      netIncome,
      yearlyExpenses,
      yearlySavingsCapacity,
      requiredAnnualSaving,
      totalSavings,
      buffer,
      buffered,
      effectiveRate,
      weeklyHoursNeeded,
      fortnightlyHoursNeeded,
      isAchievable: buffer >= 0,
    };
  }, [track, income, monthlyExpenses, goalAUD, duration]);

  const fmtAUD = (n: number) =>
    new Intl.NumberFormat("en-AU", {
      style: "currency",
      currency: "AUD",
      maximumFractionDigits: 0,
    }).format(n);

  const fmtTHB = (n: number) =>
    new Intl.NumberFormat("th-TH", {
      style: "currency",
      currency: "THB",
      maximumFractionDigits: 0,
    }).format(n);

  const studentBreach =
    track === "student" && result.fortnightlyHoursNeeded > 48;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-foreground mb-2">
          Savings Calculator
        </h3>
        <p className="text-muted-foreground">
          Plan how much you need to earn in Australia to hit your savings goal.
        </p>
      </div>

      {/* Track tabs */}
      <div className="mb-6 -mx-4 px-4 overflow-x-auto [-webkit-overflow-scrolling:touch] flex md:justify-center">
        <div className="inline-flex rounded-xl border border-border bg-muted/50 p-1.5 gap-1 mx-auto">
          <button
            onClick={() => setTrack("whm")}
            className={`flex items-center gap-2 px-5 py-3 rounded-lg text-sm font-medium transition-all whitespace-nowrap shrink-0 ${
              track === "whm"
                ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 shadow-warm border border-emerald-500/30"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Plane className="w-4 h-4" />
            Working Holiday (417/462)
          </button>
          <button
            onClick={() => setTrack("student")}
            className={`flex items-center gap-2 px-5 py-3 rounded-lg text-sm font-medium transition-all whitespace-nowrap shrink-0 ${
              track === "student"
                ? "bg-blue-500/15 text-blue-700 dark:text-blue-300 shadow-warm border border-blue-500/30"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            Student (500)
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Inputs */}
        <div className="lg:col-span-3 space-y-6">
          {/* Goal */}
          <div className="rounded-2xl border-2 border-emerald-500/30 bg-emerald-500/5 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <PiggyBank className="w-5 h-5 text-emerald-600" />
                <h4 className="font-bold text-foreground">Your Savings Goal</h4>
              </div>
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="p-2 rounded-lg hover:bg-muted transition-colors"
                title="Exchange rate settings"
              >
                <Settings className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            {showSettings && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mb-4 p-3 rounded-xl bg-background border border-border"
              >
                <label className="block text-xs font-medium text-muted-foreground mb-1">
                  Exchange rate (1 AUD = ? THB)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={exchangeRate}
                  onChange={(e) =>
                    setExchangeRate(parseFloat(e.target.value) || 23)
                  }
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <p className="text-[11px] text-muted-foreground mt-1">
                  Last updated: {today} · Rates fluctuate — verify with your bank.
                </p>
              </motion.div>
            )}

            <div className="flex gap-2 mb-3">
              {(["THB", "AUD"] as Currency[]).map((c) => (
                <button
                  key={c}
                  onClick={() => setCurrency(c)}
                  className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
                    currency === c
                      ? "bg-emerald-600 text-white"
                      : "bg-background text-muted-foreground border border-border"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>

            <input
              type="text"
              inputMode="numeric"
              value={
                goalInput
                  ? Number(goalInput.replace(/,/g, "")).toLocaleString("en-US")
                  : ""
              }
              onChange={(e) => {
                const raw = e.target.value.replace(/[^\d.]/g, "");
                setGoalInput(raw);
              }}
              placeholder={currency === "THB" ? "1,000,000" : "43,500"}
              className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <p className="text-xs text-muted-foreground mt-2">
              ≈ {fmtAUD(goalAUD)} ({fmtTHB(goalAUD * exchangeRate)})
            </p>

            <div className="mt-5">
              <label className="block text-sm font-semibold text-foreground mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                Duration in Australia
              </label>
              <div className="flex gap-2">
                {[1, 2, 3].map((y) => (
                  <button
                    key={y}
                    onClick={() => setDuration(y)}
                    className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
                      duration === y
                        ? "bg-emerald-600 text-white"
                        : "bg-background text-muted-foreground border border-border hover:border-emerald-500/40"
                    }`}
                  >
                    {y} Year{y > 1 ? "s" : ""}
                  </button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Required annual saving: <strong className="text-emerald-700 dark:text-emerald-400">{fmtAUD(result.requiredAnnualSaving)}</strong>
              </p>
            </div>
          </div>

          {/* Income */}
          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="flex items-center gap-2 mb-4">
              <Briefcase className="w-5 h-5 text-foreground" />
              <h4 className="font-bold text-foreground">Annual Income (Gross)</h4>
              <span className="ml-auto text-lg font-bold text-primary">
                {fmtAUD(income)}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 mb-4">
              {INCOME_PRESETS.map((p) => (
                <button
                  key={p.label}
                  onClick={() => setIncome(p.value)}
                  className={`py-2 px-2 rounded-lg text-xs font-medium transition-all border ${
                    income === p.value
                      ? "border-primary bg-primary/10 text-foreground"
                      : "border-border text-muted-foreground hover:border-primary/40"
                  }`}
                  title={p.hint}
                >
                  <div>{p.label}</div>
                  <div className="text-[10px] opacity-70">${(p.value / 1000).toFixed(0)}k</div>
                </button>
              ))}
            </div>

            <input
              type="range"
              min={1000}
              max={300000}
              step={1000}
              value={income}
              onChange={(e) => setIncome(parseInt(e.target.value))}
              className="w-full accent-primary"
            />
            <input
              type="text"
              inputMode="numeric"
              value={income ? income.toLocaleString("en-US") : ""}
              onChange={(e) => {
                const raw = e.target.value.replace(/[^\d]/g, "");
                setIncome(parseInt(raw) || 0);
              }}
              className="w-full mt-2 px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Expenses */}
          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="flex items-center gap-2 mb-4">
              <Wallet className="w-5 h-5 text-foreground" />
              <h4 className="font-bold text-foreground">Living Expenses</h4>
              <span className="ml-auto text-lg font-bold text-foreground">
                {fmtAUD(monthlyExpenses)}/mo
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 mb-4">
              {EXPENSE_PRESETS.map((p) => (
                <button
                  key={p.label}
                  onClick={() => setMonthlyExpenses(p.value)}
                  className={`py-2 px-2 rounded-lg text-xs font-medium transition-all border ${
                    monthlyExpenses === p.value
                      ? "border-primary bg-primary/10 text-foreground"
                      : "border-border text-muted-foreground hover:border-primary/40"
                  }`}
                >
                  <div>{p.label}</div>
                  <div className="text-[10px] opacity-70">${p.value}</div>
                </button>
              ))}
            </div>

            <input
              type="text"
              inputMode="numeric"
              value={monthlyExpenses ? monthlyExpenses.toLocaleString("en-US") : ""}
              onChange={(e) => {
                const raw = e.target.value.replace(/[^\d]/g, "");
                setMonthlyExpenses(parseInt(raw) || 0);
              }}
              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Custom monthly amount"
            />
            <p className="text-xs text-muted-foreground mt-2">
              Yearly: {fmtAUD(result.yearlyExpenses)}
            </p>
          </div>

          {/* Visa info box */}
          {track === "student" ? (
            <div className="rounded-2xl border border-blue-500/30 bg-blue-500/5 p-5">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="space-y-2 text-sm">
                  <p className="font-semibold text-foreground">
                    Student Visa (500) Work Rights
                  </p>
                  <ul className="text-muted-foreground space-y-1 list-disc list-inside text-xs">
                    <li>
                      <strong>48 hours per fortnight</strong> max during study periods
                    </li>
                    <li>
                      <strong>Unlimited</strong> hours during official holidays
                    </li>
                    <li>
                      <strong>Unlimited</strong> for Master by Research / PhD students
                    </li>
                  </ul>
                  {studentBreach && (
                    <div className="mt-2 flex items-start gap-2 p-2 rounded-lg bg-destructive/10 border border-destructive/30">
                      <AlertTriangle className="w-4 h-4 text-destructive flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-destructive font-medium">
                        Warning: This income requires ~{result.fortnightlyHoursNeeded.toFixed(0)} hrs/fortnight at min wage — exceeds the 48hr limit. Possible visa breach.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-blue-500/30 bg-blue-500/5 p-5">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="space-y-1 text-sm">
                  <p className="font-semibold text-foreground">
                    WHM (417/462) Work Rights
                  </p>
                  <p className="text-xs text-muted-foreground">
                    No weekly hour cap. Generally 6 months max with one employer (extensions possible). Tax starts at 15c from $1.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Result Card */}
        <div className="lg:col-span-2">
          <div className="sticky top-24">
            <motion.div
              key={`${track}-${income}-${monthlyExpenses}-${duration}-${goalAUD}`}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`rounded-2xl border-2 p-6 ${
                result.isAchievable
                  ? "border-emerald-500/40 bg-gradient-to-br from-emerald-500/10 to-emerald-500/5"
                  : "border-destructive/40 bg-destructive/5"
              }`}
            >
              <div className="flex items-center gap-2 mb-5">
                <TrendingUp className="w-5 h-5 text-foreground" />
                <h4 className="font-bold text-foreground">Your Result</h4>
              </div>

              <ResultRow
                label="Gross Income"
                value={fmtAUD(income)}
                tooltip="Total pay before tax"
              />
              <ResultRow
                label="Total Tax"
                value={`− ${fmtAUD(result.tax)}`}
                sub={`${result.effectiveRate.toFixed(1)}% effective`}
                tooltip="Taxable income = total income subject to ATO tax brackets"
              />
              <ResultRow
                label="Net (Take-home)"
                value={fmtAUD(result.netIncome)}
                accent
              />
              <ResultRow
                label="Living Expenses (yr)"
                value={`− ${fmtAUD(result.yearlyExpenses)}`}
              />

              <div className="border-t border-border pt-4 mt-4 space-y-3">
                <div className="flex justify-between items-baseline">
                  <span className="text-sm text-muted-foreground">Annual Savings</span>
                  <span className={`text-xl font-bold ${result.yearlySavingsCapacity >= 0 ? "text-emerald-600" : "text-destructive"}`}>
                    {fmtAUD(result.yearlySavingsCapacity)}
                  </span>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="text-sm text-muted-foreground">
                    Total over {duration}yr
                  </span>
                  <span className="text-lg font-bold text-foreground">
                    {fmtAUD(result.totalSavings)}
                  </span>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="text-sm text-muted-foreground">
                    {result.isAchievable ? "Buffer" : "Shortfall"}
                  </span>
                  <span className={`text-lg font-bold ${result.isAchievable ? "text-emerald-600" : "text-destructive"}`}>
                    {result.isAchievable ? "+" : ""}
                    {fmtAUD(result.buffer)}
                  </span>
                </div>
              </div>

              <div className={`mt-5 p-3 rounded-xl flex items-start gap-2 ${
                result.isAchievable
                  ? "bg-emerald-500/15 border border-emerald-500/30"
                  : "bg-destructive/15 border border-destructive/30"
              }`}>
                {result.isAchievable ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                )}
                <div className="text-xs">
                  <p className={`font-semibold ${result.isAchievable ? "text-emerald-700 dark:text-emerald-400" : "text-destructive"}`}>
                    {result.isAchievable
                      ? `Goal achievable in ${duration} year${duration > 1 ? "s" : ""}`
                      : "Goal not reachable with current setup"}
                  </p>
                  <p className="text-muted-foreground mt-1">
                    {result.isAchievable
                      ? `You'd save ${fmtAUD(result.buffer)} more than ${fmtTHB(goalAUD * exchangeRate)}.`
                      : `Increase income, lower expenses, or extend duration.`}
                  </p>
                </div>
              </div>

              <p className="text-[10px] text-muted-foreground mt-4 text-center">
                Tax: 2025–26 ATO {track === "whm" ? "WHM" : "Resident"} rates · FX last updated {today}
              </p>

              <SavingsShareButtons
                netIncome={fmtAUD(result.netIncome)}
                annualSavings={fmtAUD(result.yearlySavingsCapacity)}
                bufferLabel={result.isAchievable ? "Buffer" : "Shortfall"}
                bufferAmount={fmtAUD(Math.abs(result.buffer))}
              />

              <div className="mt-4">
                <BSCConsultationCTA />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ResultRow = ({
  label,
  value,
  sub,
  accent,
  tooltip,
}: {
  label: string;
  value: string;
  sub?: string;
  accent?: boolean;
  tooltip?: string;
}) => (
  <div className="flex justify-between items-baseline py-2">
    <span className="text-sm text-muted-foreground flex items-center gap-1" title={tooltip}>
      {label}
      {tooltip && <Info className="w-3 h-3 opacity-50" />}
    </span>
    <div className="text-right">
      <div className={`font-semibold ${accent ? "text-primary text-lg" : "text-foreground"}`}>
        {value}
      </div>
      {sub && <div className="text-[10px] text-muted-foreground">{sub}</div>}
    </div>
  </div>
);

export default SavingsCalculator;
