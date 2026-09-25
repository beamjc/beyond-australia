// Savings planner calculations (Study → Savings tab). All money is AUD per year
// unless noted. Tax brackets are the ones the calculator already used; only the
// structure changed: one shared plan, with visa type selecting the tax strategy.

export type SavingsVisaType = "whm" | "student";

export const MIN_WAGE_HOURLY_AUD = 24.95;
export const STUDENT_FORTNIGHT_HOURS_CAP = 48;
export const DEFAULT_SAVINGS_FX_THB_PER_AUD = 23;

/** 2025–26 Working Holiday Maker rates (15% from the first dollar). */
export const calcWhmTax = (income: number) => {
  if (income <= 0) return 0;
  if (income <= 45000) return income * 0.15;
  if (income <= 135000) return 6750 + (income - 45000) * 0.30;
  if (income <= 190000) return 33750 + (income - 135000) * 0.37;
  return 54100 + (income - 190000) * 0.45;
};

/** 2025–26 resident rates (tax-free threshold $18,200; no Medicare levy or offsets). */
export const calcResidentTax = (income: number) => {
  if (income <= 18200) return 0;
  if (income <= 45000) return (income - 18200) * 0.16;
  if (income <= 135000) return 4288 + (income - 45000) * 0.30;
  if (income <= 190000) return 31288 + (income - 135000) * 0.37;
  return 51638 + (income - 190000) * 0.45;
};

const taxStrategies: Record<SavingsVisaType, (income: number) => number> = {
  whm: calcWhmTax,
  student: calcResidentTax,
};

export function calculateTax({ visaType, annualIncome }: { visaType: SavingsVisaType; annualIncome: number }) {
  return taxStrategies[visaType](annualIncome);
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
