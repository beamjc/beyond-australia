import { describe, it, expect } from 'vitest'
import { calculateTax, computeSavingsPlan, requiredGrossIncome, DEFAULT_SAVINGS_FX_THB_PER_AUD } from '@/lib/savings'

// Tax tables: ATO, checked 2026-09-26 — WHM 2025–26 (latest published), resident 2026–27.
describe('calculateTax (chosen by visa type)', () => {
  it('WHM: 15% from $1 to $45,000, then 30%, 37%, 45%', () => {
    expect(calculateTax({ visaType: 'whm', annualIncome: 0 })).toBe(0)
    expect(calculateTax({ visaType: 'whm', annualIncome: 45_000 })).toBe(6_750)
    // 6,750 + 30% × 15,000
    expect(calculateTax({ visaType: 'whm', annualIncome: 60_000 })).toBe(11_250)
    // 54,100 + 45% × 10,000
    expect(calculateTax({ visaType: 'whm', annualIncome: 200_000 })).toBeCloseTo(58_600, 6)
  })
  it('Student (resident scale 2026–27): nil to $18,200, 15% to $45,000, then 30%, 37%, 45%', () => {
    expect(calculateTax({ visaType: 'student', annualIncome: 18_200 })).toBe(0)
    // 15% × 26,800
    expect(calculateTax({ visaType: 'student', annualIncome: 45_000 })).toBeCloseTo(4_020, 6)
    // 4,020 + 30% × 15,000
    expect(calculateTax({ visaType: 'student', annualIncome: 60_000 })).toBeCloseTo(8_520, 6)
    // brackets join up: 4,020 + 30% × 90,000 = 31,020; + 37% × 55,000 = 51,370; + 45% × 10,000
    expect(calculateTax({ visaType: 'student', annualIncome: 135_000 })).toBeCloseTo(31_020, 6)
    expect(calculateTax({ visaType: 'student', annualIncome: 190_000 })).toBeCloseTo(51_370, 6)
    expect(calculateTax({ visaType: 'student', annualIncome: 200_000 })).toBeCloseTo(55_870, 6)
  })
})

describe('computeSavingsPlan', () => {
  const goalAUD = 1_000_000 / 23.5
  const base = { annualIncome: 60_000, monthlyExpenses: 2_000, goalAUD, years: 1 }

  it('uses the owner planning rate 23.5 THB per AUD', () => {
    expect(DEFAULT_SAVINGS_FX_THB_PER_AUD).toBe(23.5)
  })

  it('WHM example: $60k income, $2k/month → $24,750/yr, short of a ฿1m goal', () => {
    const p = computeSavingsPlan({ visaType: 'whm', ...base })
    expect(p.netIncome).toBe(48_750)
    expect(p.yearlyExpenses).toBe(24_000)
    expect(p.yearlySavings).toBe(24_750)
    expect(p.requiredAnnualSaving).toBeCloseTo(42_553.19, 2)
    expect(p.buffer).toBeCloseTo(24_750 - 42_553.19, 2)
    expect(p.isAchievable).toBe(false)
  })

  it('switching visa type changes only tax-related outputs', () => {
    const whm = computeSavingsPlan({ visaType: 'whm', ...base })
    const st = computeSavingsPlan({ visaType: 'student', ...base })
    expect(st.tax).toBeCloseTo(8_520, 6)
    expect(st.yearlySavings - whm.yearlySavings).toBeCloseTo(11_250 - 8_520, 6)
    expect(st.yearlyExpenses).toBe(whm.yearlyExpenses)
    expect(st.requiredAnnualSaving).toBe(whm.requiredAnnualSaving)
  })

  it('goal is a total: 3 years needs a third per year, savings multiply by 3', () => {
    const p = computeSavingsPlan({ visaType: 'whm', ...base, years: 3 })
    expect(p.requiredAnnualSaving).toBeCloseTo(14_184.40, 2)
    expect(p.totalSavings).toBe(74_250)
    expect(p.isAchievable).toBe(true)
  })

  it('negative savings when expenses exceed take-home pay', () => {
    const p = computeSavingsPlan({ visaType: 'whm', ...base, annualIncome: 20_000 })
    expect(p.yearlySavings).toBe(17_000 - 24_000)
  })

  it('flags student income that needs more than 48 hours a fortnight at minimum wage', () => {
    // 48 h × 26 fortnights × $24.95 = $31,135.60
    expect(computeSavingsPlan({ visaType: 'student', ...base, annualIncome: 31_135 }).exceedsStudentHours).toBe(false)
    expect(computeSavingsPlan({ visaType: 'student', ...base, annualIncome: 31_200 }).exceedsStudentHours).toBe(true)
    expect(computeSavingsPlan({ visaType: 'whm', ...base, annualIncome: 100_000 }).exceedsStudentHours).toBe(false)
  })
})

describe('requiredGrossIncome', () => {
  it('WHM, 1 year: net needed 66,553.19 = 0.7g + 6,750 → g = 85,433.13 → $85,434', () => {
    const args = { visaType: 'whm' as const, monthlyExpenses: 2_000, goalAUD: 1_000_000 / 23.5, years: 1 }
    const g = requiredGrossIncome(args)
    expect(g).toBe(85_434)
    expect(computeSavingsPlan({ ...args, annualIncome: g }).isAchievable).toBe(true)
    expect(computeSavingsPlan({ ...args, annualIncome: g - 1 }).isAchievable).toBe(false)
  })
  it('student inside the 15% band: net = 0.85g + 2,730 → g for net 30,000 = 32,082.35', () => {
    // goal 6,000 over 1 year + 24,000 expenses = 30,000 net
    expect(requiredGrossIncome({ visaType: 'student', monthlyExpenses: 2_000, goalAUD: 6_000, years: 1 })).toBe(32_083)
  })
  it('zero goal and zero expenses need no income', () => {
    expect(requiredGrossIncome({ visaType: 'whm', monthlyExpenses: 0, goalAUD: 0, years: 1 })).toBe(0)
  })
})
