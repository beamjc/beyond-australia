import { describe, it, expect } from 'vitest'
import { calculateTax, computeSavingsPlan, requiredGrossIncome } from '@/lib/savings'

describe('calculateTax (unchanged brackets, chosen by visa type)', () => {
  it('WHM: 15% from $1, 30% above $45,000', () => {
    expect(calculateTax({ visaType: 'whm', annualIncome: 0 })).toBe(0)
    expect(calculateTax({ visaType: 'whm', annualIncome: 45_000 })).toBe(6_750)
    // 6,750 + 30% × 15,000
    expect(calculateTax({ visaType: 'whm', annualIncome: 60_000 })).toBe(11_250)
  })
  it('Student (resident scale): nil to $18,200, 16% to $45,000, 30% above', () => {
    expect(calculateTax({ visaType: 'student', annualIncome: 18_200 })).toBe(0)
    expect(calculateTax({ visaType: 'student', annualIncome: 45_000 })).toBeCloseTo(4_288, 6)
    // 4,288 + 30% × 15,000
    expect(calculateTax({ visaType: 'student', annualIncome: 60_000 })).toBeCloseTo(8_788, 6)
  })
})

describe('computeSavingsPlan', () => {
  const base = { annualIncome: 60_000, monthlyExpenses: 2_000, goalAUD: 1_000_000 / 23, years: 1 }

  it('WHM example: $60k income, $2k/month → $24,750/yr, short of a ฿1m goal', () => {
    const p = computeSavingsPlan({ visaType: 'whm', ...base })
    expect(p.netIncome).toBe(48_750)
    expect(p.yearlyExpenses).toBe(24_000)
    expect(p.yearlySavings).toBe(24_750)
    expect(p.requiredAnnualSaving).toBeCloseTo(43_478.26, 2)
    expect(p.buffer).toBeCloseTo(24_750 - 43_478.26, 2)
    expect(p.isAchievable).toBe(false)
  })

  it('switching visa type changes only tax-related outputs', () => {
    const whm = computeSavingsPlan({ visaType: 'whm', ...base })
    const st = computeSavingsPlan({ visaType: 'student', ...base })
    expect(st.tax).toBeCloseTo(8_788, 6)
    expect(st.yearlySavings - whm.yearlySavings).toBeCloseTo(11_250 - 8_788, 6)
    expect(st.yearlyExpenses).toBe(whm.yearlyExpenses)
    expect(st.requiredAnnualSaving).toBe(whm.requiredAnnualSaving)
  })

  it('goal is a total: 3 years needs a third per year, savings multiply by 3', () => {
    const p = computeSavingsPlan({ visaType: 'whm', ...base, years: 3 })
    expect(p.requiredAnnualSaving).toBeCloseTo(14_492.75, 2)
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
  it('WHM, 1 year: net needed 67,478.26 = 0.7g + 6,750 → g = 86,754.66 → $86,755', () => {
    const g = requiredGrossIncome({ visaType: 'whm', monthlyExpenses: 2_000, goalAUD: 1_000_000 / 23, years: 1 })
    expect(g).toBe(86_755)
    const p = computeSavingsPlan({ visaType: 'whm', annualIncome: g, monthlyExpenses: 2_000, goalAUD: 1_000_000 / 23, years: 1 })
    expect(p.isAchievable).toBe(true)
    const below = computeSavingsPlan({ visaType: 'whm', annualIncome: g - 1, monthlyExpenses: 2_000, goalAUD: 1_000_000 / 23, years: 1 })
    expect(below.isAchievable).toBe(false)
  })
  it('student inside the 16% band: net = 0.84g + 2,912 → g for net 30,000 = 32,247.62', () => {
    // goal 6,000 over 1 year + 24,000 expenses = 30,000 net
    expect(requiredGrossIncome({ visaType: 'student', monthlyExpenses: 2_000, goalAUD: 6_000, years: 1 })).toBe(32_248)
  })
  it('zero goal and zero expenses need no income', () => {
    expect(requiredGrossIncome({ visaType: 'whm', monthlyExpenses: 0, goalAUD: 0, years: 1 })).toBe(0)
  })
})
