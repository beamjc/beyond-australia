// Savings planner calculations (Study → Savings tab). All money is AUD per year
// unless noted. One shared plan; visa type selects the tax table
// (src/data/taxRates.ts, checked against the ATO on 2026-09-26).

import { DEFAULT_FX_THB_PER_AUD } from "@/lib/CalculationEngine";
import { taxFromTable, taxTables } from "@/data/taxRates";

export type SavingsVisaType = "whm" | "student";

export const MIN_WAGE_HOURLY_AUD = 24.95;
export const STUDENT_FORTNIGHT_HOURS_CAP = 48;
/** Same planning rate as the Budget Planner (owner decision 2026-09-26: 23.5). */
export const DEFAULT_SAVINGS_FX_THB_PER_AUD = DEFAULT_FX_THB_PER_AUD;

/** Working Holiday Maker rates: 15% from the first dollar up to $45,000. */
export const calcWhmTax = (income: number) => taxFromTable(income, taxTables.workingHolidayMaker);

/** Resident rates: nil to $18,200 (no Medicare levy or offsets). */
export const calcResidentTax = (income: number) => taxFromTable(income, taxTables.resident);

export const taxTableFor = (visaType: SavingsVisaType) =>
  visaType === "whm" ? taxTables.workingHolidayMaker : taxTables.resident;

export function calculateTax({ visaType, annualIncome }: { visaType: SavingsVisaType; annualIncome: number }) {
  return taxFromTable(annualIncome, taxTableFor(visaType));
}

export interface SavingsInputs {
  visaType: SavingsVisaType;
  annualIncome: number;
  monthlyExpenses: number;
  goalAUD: number;
  years: number;
}

export function computeSavingsPlan({ visaType, annualIncome, monthlyExpenses, goalAUD, years }: SavingsInputs) {
  const tax = calculateTax({ visaType, annualIncome });
  const netIncome = annualIncome - tax;
  const yearlyExpenses = monthlyExpenses * 12;
  const yearlySavings = netIncome - yearlyExpenses;
  const requiredAnnualSaving = goalAUD / years;
  const totalSavings = yearlySavings * years;
  const buffer = totalSavings - goalAUD; // ≥ 0 surplus, < 0 shortfall
  // Hours needed to earn this income at the minimum wage (used for the student work-hours check).
  const fortnightlyHoursAtMinWage = (annualIncome / MIN_WAGE_HOURLY_AUD / 52) * 2;
  return {
    tax,
    netIncome,
    yearlyExpenses,
    yearlySavings,
    requiredAnnualSaving,
    totalSavings,
    buffer,
    isAchievable: buffer >= 0,
    fortnightlyHoursAtMinWage,
    exceedsStudentHours: visaType === "student" && fortnightlyHoursAtMinWage > STUDENT_FORTNIGHT_HOURS_CAP,
  };
}

/**
 * Gross yearly income at which take-home pay minus yearly expenses reaches the
 * required yearly saving, under the same tax strategy. Net pay rises with gross
 * pay for both strategies, so a bisection finds it to the cent (rounded up to the dollar).
 */
export function requiredGrossIncome({ visaType, monthlyExpenses, goalAUD, years }: Omit<SavingsInputs, "annualIncome">) {
  const targetNet = goalAUD / years + monthlyExpenses * 12;
  if (targetNet <= 0) return 0;
  const net = (g: number) => g - calculateTax({ visaType, annualIncome: g });
  let lo = 0;
  let hi = Math.max(1, targetNet);
  while (net(hi) < targetNet) hi *= 2;
  while (hi - lo > 0.01) {
    const mid = (lo + hi) / 2;
    if (net(mid) >= targetNet) hi = mid; else lo = mid;
  }
  return Math.ceil(hi);
}
