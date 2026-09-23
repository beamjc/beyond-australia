// Expected values are derived by hand from the documented assumptions in
// CalculationEngine.ts (fees, OSHC/yr, deposit %, visa-duration formula),
// not by calling the same helper functions. Passing these tests shows the
// arithmetic matches the stated assumptions — it does NOT show the
// assumptions (fees, grant rates, exchange rate) are current or correct.
import { describe, expect, it } from 'vitest'
import {
  calcEnglishPackage,
  computeElicosOnly,
  computePathway,
  computeShortPathway,
  tiers,
  visaDurationMonths,
  fmtAUD,
  fmtTHB,
} from '@/lib/CalculationEngine'

const tier = (id: string) => tiers.find((t) => t.id === id)!

describe('calcEnglishPackage', () => {
  it('needs no English when IELTS meets the sector entry score', () => {
    expect(calcEnglishPackage(6.0, 'vet').weeks).toBe(0)
    expect(calcEnglishPackage(6.5, 'he').straightEntry).toBe(true)
  })

  it('adds 10 weeks per 0.5 band gap, starting from at least 5.0', () => {
    // HE needs 6.5. From 5.0: gap 1.5 → 3 steps → 30 weeks
    expect(calcEnglishPackage(5.0, 'he', 250)).toMatchObject({ weeks: 30, cost: 7_500 })
    // From 6.0 → 1 step → 10 weeks
    expect(calcEnglishPackage(6.0, 'he', 300)).toMatchObject({ weeks: 10, cost: 3_000 })
    // VET needs 6.0; from 5.5 → 10 weeks
    expect(calcEnglishPackage(5.5, 'vet').weeks).toBe(10)
  })

  it('treats "never tested" (0) and 4.5 as starting from 5.0; only 4.5 flags Level 1', () => {
    const none = calcEnglishPackage(0, 'he')
    const low = calcEnglishPackage(4.5, 'he')
    expect(none.weeks).toBe(30)
    expect(low.weeks).toBe(30)
    expect(none.needsLevel1).toBe(false)
    expect(low.needsLevel1).toBe(true)
  })
})

describe('visaDurationMonths', () => {
  it('= 1 pre-arrival + course + extra stay when no English', () => {
    expect(visaDurationMonths(0, 3, 2)).toBe(1 + 36 + 2)
  })
  it('adds English weeks/4 and a 2-month gap when English is packaged', () => {
    expect(visaDurationMonths(30, 3, 2)).toBe(1 + 7.5 + 2 + 36 + 2)
  })
})

describe('computePathway', () => {
  it('Affordable University, bachelor, IELTS 5.0, $250/wk', () => {
    const pkg = calcEnglishPackage(5.0, 'he', 250) // 30 wks, $7,500
    const c = computePathway(tier('he-aff'), pkg, 'offshore', 24, 20_000)
    // annual = (28,000 + 32,000)/2 = 30,000; deposit 50% = 15,000
    // visa months = 1 + 7.5 + 2 + 36 + 2 = 48.5; OSHC = 700 × 48.5/12 = 2,829.17
    // upfront = 7,500 + 15,000 + 2,000 + 2,829.17 = 27,329.17
    expect(c.annual).toBe(30_000)
    expect(c.deposit).toBe(15_000)
    expect(c.visaMonths).toBe(48.5)
    expect(c.oshc).toBeCloseTo(2_829.17, 2)
    expect(c.upfront).toBeCloseTo(27_329.17, 2)
    expect(c.totalCourseValue).toBe(90_000)
    expect(c.remainingTuition).toBe(75_000)
    expect(c.coverage).toBeCloseTo((20_000 / 27_329.17) * 100, 4)
  })

  it('VET budget diploma with straight entry has no English cost', () => {
    const pkg = calcEnglishPackage(6.0, 'vet')
    const c = computePathway(tier('vet-budget'), pkg, 'onshore', 30, 0)
    // annual 6,500; deposit 25% = 1,625; months = 1 + 24 + 1 = 26; OSHC = 700×26/12
    expect(c.englishCost).toBe(0)
    expect(c.deposit).toBe(1_625)
    expect(c.visaMonths).toBe(26)
    expect(c.upfront).toBeCloseTo(1_625 + 2_000 + (700 * 26) / 12, 2)
    expect(c.coverage).toBe(0)
  })

  it('clamps the heuristic "grant rate" between 8 and 98', () => {
    for (const t of tiers) {
      for (const loc of ['offshore', 'onshore'] as const) {
        for (const age of [15, 24, 35, 50]) {
          const c = computePathway(t, calcEnglishPackage(6.5, 'he'), loc, age, 0)
          expect(c.adjusted).toBeGreaterThanOrEqual(8)
          expect(c.adjusted).toBeLessThanOrEqual(98)
        }
      }
    }
  })
})

describe('computeElicosOnly', () => {
  it('24 weeks paid in full at $250', () => {
    const c = computeElicosOnly(24, 250, 'offshore', 22, 10_000, 'student', 1)
    // tuition 6,000; months = 1 + ceil(24/4)=6 + 1 = 8; OSHC 700×8/12 = 466.67
    expect(c.tuition).toBe(6_000)
    expect(c.visaMonths).toBe(8)
    expect(c.upfront).toBeCloseTo(6_000 + 2_000 + 466.67, 2)
    expect(c.remainingTuition).toBe(0)
  })
  it('40 weeks with 50% upfront', () => {
    const c = computeElicosOnly(40, 250, 'offshore', 22, 10_000, 'student', 0.5)
    // tuition 10,000; paid 5,000; months 1+10+1 = 12; OSHC 700
    expect(c.paidTuition).toBe(5_000)
    expect(c.remainingTuition).toBe(5_000)
    expect(c.upfront).toBeCloseTo(5_000 + 2_000 + 700, 2)
  })
})

describe('computeShortPathway', () => {
  it('caps study weeks at 17 for WHM and adds skill-course range', () => {
    const c = computeShortPathway('whm', 30, 250, 'childcare', 5_000)
    expect(c.englishWeeks).toBe(17)
    expect(c.upfrontLow).toBe(17 * 250 + 2_500 + 670)
    expect(c.upfrontHigh).toBe(17 * 250 + 7_900 + 670)
    expect(c.oshc).toBe(0)
  })
  it('never goes below 0 weeks', () => {
    expect(computeShortPathway('tourist', -5, 250, 'none', 0).englishWeeks).toBe(0)
  })
})

describe('formatters', () => {
  it('round to whole units with grouping', () => {
    expect(fmtAUD(1234.5)).toBe('$1,235')
    expect(fmtTHB(800000)).toBe('฿800,000')
  })
})
