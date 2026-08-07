// Centralized calculation engine for the Study & Budget Planner.
// All currency values are AUD unless noted.

export type Location = "offshore" | "onshore";
export type Sector = "he" | "elicos" | "vet";

export const VISA_FEE_AUD = 2_000; // March 2026 student visa application charge
export const VISA_FEE_WHM_AUD = 670; // Working Holiday Maker (subclass 417) fee
export const VISA_FEE_TOURIST_AUD = 200; // approx tourist visa (subclass 600) — display only
export const OSHC_PER_YEAR = 700;
export const DEFAULT_FX_THB_PER_AUD = 23.48;
export const DEFAULT_ELICOS_WEEKLY = 250;
export const ELICOS_WEEKLY_OPTIONS = [200, 250, 300] as const;
export const ELICOS_WEEKLY_MIN = 200;
export const ELICOS_WEEKLY_MAX = 630;
export const WHM_MAX_STUDY_WEEKS = 17;

// Skill booster price ranges (AUD, fast-track short courses)
export const SKILL_BOOSTERS = {
  childcare: { low: 2_500, high: 7_900 },
  agedCare:  { low: 3_300, high: 6_860 },
} as const;

// Suggested savings (display only, not auto-added to upfront)
export const SUGGESTED_SAVINGS = {
  airfareTHB: { low: 8_000,  high: 16_000 },
  pocketAUD:  { low: 3_000,  high: 5_000 },
} as const;

export type VisaType = "student" | "whm" | "tourist";

export function visaFeeFor(visaType: VisaType): number {
  if (visaType === "whm") return VISA_FEE_WHM_AUD;
  if (visaType === "tourist") return VISA_FEE_TOURIST_AUD;
  return VISA_FEE_AUD;
}

// Sector entry IELTS requirements (per spec)
export const SECTOR_ENTRY_IELTS: Record<"vet" | "he", number> = {
  vet: 6.0,
  he: 6.5,
};

export const MIN_PACKAGE_IELTS = 5.0;

// March 2026 base grant rates (Thai nationals, July 2025 – Mar 2026)
export const sectorRates = {
  he: { onshore: 93.1, offshore: 93.6, onTrend: 0.2, offTrend: -0.4 },
  elicos: { onshore: 83.2, offshore: 49.5, onTrend: 1.0, offTrend: 0.6 },
  vet: { onshore: 55.7, offshore: 25.0, onTrend: 1.3, offTrend: -2.5 },
} as const;

/**
 * Age-specific multiplier on base sector rate, calibrated against
 * March 2026 Thai national grant statistics by age bracket.
 */
export function ageMultiplier(sector: Sector, location: Location, age: number): number {
  if (sector === "he") {
    if (location === "onshore") {
      if (age <= 29) return 1.0;
      if (age <= 34) return 0.95;
      if (age <= 39) return 0.78;
      return 0.68;
    }
    if (age <= 24) return 1.0;
    if (age <= 29) return 0.92;
    if (age <= 34) return 0.78;
    if (age <= 39) return 0.6;
    return 0.5;
  }
  if (sector === "elicos") {
    if (location === "onshore") {
      if (age <= 34) return 1.05; // 80–100% bracket
      if (age <= 39) return 0.85;
      return 0.55;
    }
    // Offshore ELICOS — peak 20–24
    if (age >= 20 && age <= 24) return 1.27;
    if (age < 20) return 0.9;
    if (age <= 29) return 0.85;
    if (age <= 34) return 0.7;
    return 0.5;
  }
  // VET
  if (location === "onshore") {
    if (age <= 19) return 1.2;
    if (age <= 34) return 1.0;
    if (age <= 39) return 0.8;
    return 0.65;
  }
  // VET offshore — global risk: no bracket exceeds 40%
  if (age <= 29) return 1.0;
  if (age <= 34) return 0.85;
  return 0.65;
}

export interface RiskBadge {
  bg: string;
  text: string;
  ring: string;
  label: "Low Risk" | "Moderate" | "High Risk" | "Critical Risk";
}

export function riskBadge(rate: number): RiskBadge {
  if (rate >= 80) return { bg: "bg-emerald-500/10", text: "text-emerald-600", ring: "ring-emerald-500/30", label: "Low Risk" };
  if (rate >= 60) return { bg: "bg-amber-500/10", text: "text-amber-600", ring: "ring-amber-500/30", label: "Moderate" };
  if (rate >= 35) return { bg: "bg-orange-500/10", text: "text-orange-600", ring: "ring-orange-500/30", label: "High Risk" };
  return { bg: "bg-red-500/10", text: "text-red-600", ring: "ring-red-500/30", label: "Critical Risk" };
}

export interface EnglishPackage {
  weeks: number;
  weeklyCost: number;
  cost: number;
  needsLevel1: boolean; // IELTS < 5.0
  straightEntry: boolean; // student already meets sector requirement
}

/** Compute ELICOS packaging weeks for a target sector. */
export function calcEnglishPackage(
  studentIELTS: number,
  targetSector: "vet" | "he",
  weeklyCost: number = DEFAULT_ELICOS_WEEKLY,
): EnglishPackage {
  const required = SECTOR_ENTRY_IELTS[targetSector];
  if (studentIELTS >= required) {
    return { weeks: 0, weeklyCost, cost: 0, needsLevel1: false, straightEntry: true };
  }
  const needsLevel1 = studentIELTS > 0 && studentIELTS < MIN_PACKAGE_IELTS;
  const effectiveStart = Math.max(studentIELTS, MIN_PACKAGE_IELTS);
  const gap = required - effectiveStart;
  const weeks = Math.max(0, Math.ceil(gap / 0.5) * 10);
  return { weeks, weeklyCost, cost: weeks * weeklyCost, needsLevel1, straightEntry: false };
}

export interface PathwayTier {
  id: string;
  sector: "he" | "vet";
  tier: string;
  annualLow: number;
  annualHigh: number;
  depositPct: number; // 0.25 or 0.50
  durationYears: number;
  extraStayMonths: 1 | 2; // post-course stay
  badge?: string;
}

export const tiers: PathwayTier[] = [
  { id: "vet-budget",  sector: "vet", tier: "Budget Diploma",         annualLow: 6_000,  annualHigh: 7_000,  depositPct: 0.25, durationYears: 2, extraStayMonths: 1, badge: "No 485 pathway" },
  { id: "vet-std",     sector: "vet", tier: "Skilled (Standard)",     annualLow: 8_000,  annualHigh: 12_000, depositPct: 0.25, durationYears: 2, extraStayMonths: 1 },
  { id: "vet-prem",    sector: "vet", tier: "Skilled (Premium)",      annualLow: 12_001, annualHigh: 20_000, depositPct: 0.50, durationYears: 2, extraStayMonths: 2 },
  { id: "he-aff",      sector: "he",  tier: "Affordable University",  annualLow: 28_000, annualHigh: 32_000, depositPct: 0.50, durationYears: 3, extraStayMonths: 2 },
  { id: "he-good",     sector: "he",  tier: "Good Quality University",annualLow: 35_000, annualHigh: 45_000, depositPct: 0.50, durationYears: 3, extraStayMonths: 2 },
  { id: "he-elite",    sector: "he",  tier: "Go8 / Elite",            annualLow: 50_000, annualHigh: 60_000, depositPct: 0.50, durationYears: 3, extraStayMonths: 2 },
];

export interface PathwayCalc {
  annual: number;
  totalTuition: number;
  deposit: number;
  englishWeeks: number;
  englishCost: number;
  visaFee: number;
  oshc: number;
  visaMonths: number;
  upfront: number;
  remainingTuition: number;
  totalCourseValue: number;
  baseRate: number;
  trend: number;
  adjusted: number;
  coverage: number; // % of upfront covered by budget
}

/**
 * Visa duration formula (months):
 *   1 (pre-arrival) + English duration (weeks/4, exact)
 *   + 2 (gap between courses, only when English present)
 *   + main course + extraStay (post-course)
 */
export function visaDurationMonths(englishWeeks: number, courseYears: number, extraStayMonths: number): number {
  const englishMonths = englishWeeks > 0 ? englishWeeks / 4 : 0;
  const gap = englishWeeks > 0 ? 2 : 0;
  return 1 + englishMonths + gap + courseYears * 12 + extraStayMonths;
}

export function computePathway(
  tier: PathwayTier,
  englishPkg: EnglishPackage,
  location: Location,
  age: number,
  budgetAUD: number,
): PathwayCalc {
  const annual = (tier.annualLow + tier.annualHigh) / 2;
  const totalTuition = annual * tier.durationYears;
  const deposit = annual * tier.depositPct;
  const visaMonths = visaDurationMonths(englishPkg.weeks, tier.durationYears, tier.extraStayMonths);
  const oshc = +((OSHC_PER_YEAR * visaMonths) / 12).toFixed(2);
  const upfront = englishPkg.cost + deposit + VISA_FEE_AUD + oshc;
  const remainingTuition = totalTuition - deposit;
  // Total course value reflects tuition only (annual × duration).
  // English tuition is shown separately under Initial Payment.
  const totalCourseValue = totalTuition;

  const baseRate = sectorRates[tier.sector][location];
  const trend = location === "onshore" ? sectorRates[tier.sector].onTrend : sectorRates[tier.sector].offTrend;
  const adjusted = Math.min(98, Math.max(8, baseRate * ageMultiplier(tier.sector, location, age)));
  const coverage = upfront > 0 ? (budgetAUD / upfront) * 100 : 0;

  return {
    annual, totalTuition, deposit,
    englishWeeks: englishPkg.weeks, englishCost: englishPkg.cost,
    visaFee: VISA_FEE_AUD, oshc, visaMonths,
    upfront, remainingTuition, totalCourseValue,
    baseRate, trend, adjusted, coverage,
  };
}

export interface ElicosOnlyCalc {
  weeks: number;
  weeklyCost: number;
  tuition: number;
  paidTuition: number;
  remainingTuition: number;
  paidPct: number;
  visaFee: number;
  oshc: number;
  visaMonths: number;
  upfront: number;
  baseRate: number;
  trend: number;
  adjusted: number;
  coverage: number;
}

export function computeElicosOnly(
  weeks: number,
  weeklyCost: number,
  location: Location,
  age: number,
  budgetAUD: number,
  visaType: VisaType = "student",
  paidPct: number = 1,
): ElicosOnlyCalc {
  const tuition = weeks * weeklyCost;
  const paidTuition = tuition * paidPct;
  const remainingTuition = tuition - paidTuition;
  const visaMonths = 1 + Math.ceil(weeks / 4) + 1; // pre + course + buffer
  const oshc = visaType === "student" ? +((OSHC_PER_YEAR * visaMonths) / 12).toFixed(2) : 0;
  const visaFee = visaFeeFor(visaType);
  const upfront = paidTuition + visaFee + oshc;
  const baseRate = sectorRates.elicos[location];
  const trend = location === "onshore" ? sectorRates.elicos.onTrend : sectorRates.elicos.offTrend;
  const adjusted = Math.min(98, Math.max(8, baseRate * ageMultiplier("elicos", location, age)));
  const coverage = upfront > 0 ? (budgetAUD / upfront) * 100 : 0;
  return { weeks, weeklyCost, tuition, paidTuition, remainingTuition, paidPct, visaFee, oshc, visaMonths, upfront, baseRate, trend, adjusted, coverage };
}

export const fmtAUD = (n: number) => `$${Math.round(n).toLocaleString()}`;
export const fmtTHB = (n: number) => `฿${Math.round(n).toLocaleString()}`;

// ----- Short Experience & Skill booster -----
export interface ShortPathwayCalc {
  visaType: VisaType;
  englishWeeks: number;
  englishCost: number;
  weeklyCost: number;
  skillCostLow: number;
  skillCostHigh: number;
  visaFee: number;
  oshc: number;
  upfrontLow: number;
  upfrontHigh: number;
  coverageLow: number;
  coverageHigh: number;
}

export type SkillBoosterKey = "none" | "childcare" | "agedCare";

export function computeShortPathway(
  visaType: VisaType,
  englishWeeks: number,
  weeklyCost: number,
  skill: SkillBoosterKey,
  budgetAUD: number,
): ShortPathwayCalc {
  const cappedWeeks = Math.min(WHM_MAX_STUDY_WEEKS, Math.max(0, englishWeeks));
  const englishCost = cappedWeeks * weeklyCost;
  const skillCostLow  = skill === "none" ? 0 : SKILL_BOOSTERS[skill].low;
  const skillCostHigh = skill === "none" ? 0 : SKILL_BOOSTERS[skill].high;
  const visaFee = visaFeeFor(visaType);
  const oshc = 0; // WHM & tourist do not require OSHC in this planner
  const upfrontLow  = englishCost + skillCostLow  + visaFee + oshc;
  const upfrontHigh = englishCost + skillCostHigh + visaFee + oshc;
  const coverageLow  = upfrontHigh > 0 ? (budgetAUD / upfrontHigh) * 100 : 0;
  const coverageHigh = upfrontLow  > 0 ? (budgetAUD / upfrontLow)  * 100 : 0;
  return {
    visaType, englishWeeks: cappedWeeks, englishCost, weeklyCost,
    skillCostLow, skillCostHigh, visaFee, oshc,
    upfrontLow, upfrontHigh, coverageLow, coverageHigh,
  };
}