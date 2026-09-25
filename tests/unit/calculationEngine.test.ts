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
  grantRateFor,
  ageGroupFor,
  GRANT_RATE_PERIOD,
  fmtAUD,
  fmtTHB,
} from '@/lib/CalculationEngine'
import { grantRates } from '@/data/grantRates'

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
  it('university (average) card, bachelor, IELTS 5.0, $250/wk', () => {
    const pkg = calcEnglishPackage(5.0, 'he', 250) // 30 wks, $7,500
    const c = computePathway(tier('he-avg'), pkg, 'offshore', 24, 20_000)
    // annual = mean of former tier midpoints (30,000 + 40,000 + 55,000)/3 → 41,667
    // deposit 50% = 20,833.50
    // visa months = 1 + 7.5 + 2 + 36 + 2 = 48.5; OSHC = 700 × 48.5/12 = 2,829.17
    // upfront = 7,500 + 20,833.50 + 2,000 + 2,829.17 = 33,162.67
    expect(c.annual).toBe(41_667)
    expect(c.deposit).toBe(20_833.5)
    expect(c.visaMonths).toBe(48.5)
    expect(c.oshc).toBeCloseTo(2_829.17, 2)
    expect(c.upfront).toBeCloseTo(33_162.67, 2)
    expect(c.totalCourseValue).toBe(125_001)
    expect(c.remainingTuition).toBe(104_167.5)
    expect(c.coverage).toBeCloseTo((20_000 / 33_162.67) * 100, 4)
  })

  it('offers a single university card', () => {
    expect(tiers.filter((t) => t.sector === 'he').map((t) => t.id)).toEqual(['he-avg'])
  })

  it('tiers without an explicit annual figure still use the low/high midpoint', () => {
    expect(computePathway(tier('vet-std'), calcEnglishPackage(6.0, 'vet'), 'offshore', 24, 0).annual).toBe(10_000)
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

describe('grantRateFor (official Home Affairs rates, Thai primary applicants)', () => {
  // Expected values read from docs/qa/grant-rate-check.md (Sep 2025 – Aug 2026).
  it('uses the age-group rate when the group has ≥ 30 decisions', () => {
    expect(grantRateFor('he', 'offshore', 22)).toEqual({ rate: 97.8, sectorAverage: 94.6, ageSpecific: true, decisions: 269 })
    expect(grantRateFor('vet', 'onshore', 42).rate).toBe(22.1)
    expect(grantRateFor('elicos', 'offshore', 27).rate).toBe(49.3)
  })

  it('small groups fall back to sector average × legacy age factor', () => {
    // HE offshore 35–39 has 17 decisions: 94.6 × 0.6 = 56.76
    const r = grantRateFor('he', 'offshore', 37)
    expect(r).toMatchObject({ ageSpecific: false, decisions: 822 })
    expect(r.rate).toBeCloseTo(56.76, 2)
    // VET offshore: every group is small; legacy factors 1.0 (≤29), 0.85 (30–34), 0.65 (35+)
    expect(grantRateFor('vet', 'offshore', 22).rate).toBeCloseTo(23.8, 2)
    expect(grantRateFor('vet', 'offshore', 32).rate).toBeCloseTo(20.23, 2)
    expect(grantRateFor('vet', 'offshore', 45).rate).toBeCloseTo(15.47, 2)
    // English offshore 35–39 (21 decisions): 51.7 × 0.5
    expect(grantRateFor('elicos', 'offshore', 36).rate).toBeCloseTo(25.85, 2)
  })

  it('never shows 100 % or 0 %', () => {
    // HE onshore 15–19: 34 decisions, all granted → shown as 98
    expect(grantRateFor('he', 'onshore', 17)).toMatchObject({ rate: 98, ageSpecific: true })
  })

  it('maps age-group boundaries correctly', () => {
    expect(ageGroupFor(15)).toBe('15-19')
    expect(ageGroupFor(24)).toBe('20-24')
    expect(ageGroupFor(25)).toBe('25-29')
    expect(ageGroupFor(39)).toBe('35-39')
    expect(ageGroupFor(40)).toBe('40+')
    expect(ageGroupFor(50)).toBe('40+')
  })

  it('is what the pathway and English-only cards display', () => {
    const c = computePathway(tier('vet-std'), calcEnglishPackage(6, 'vet'), 'onshore', 36, 0)
    expect(c.adjusted).toBe(35.6)
    expect(c.baseRate).toBe(63.4)
    expect(computeElicosOnly(24, 250, 'onshore', 26, 0).adjusted).toBe(88.4)
  })

  it('data file is internally consistent', () => {
    expect(GRANT_RATE_PERIOD).toEqual({ from: '2025-09', to: '2026-08' })
    for (const sector of Object.values(grantRates)) {
      for (const loc of Object.values(sector)) {
        const cells = Object.values(loc.byAge)
        expect(cells.reduce((s, c) => s + c.n, 0)).toBeLessThanOrEqual(loc.n)
        for (const c of cells) {
          expect(c.rate).toBeGreaterThanOrEqual(0)
          expect(c.rate).toBeLessThanOrEqual(100)
        }
      }
    }
  })
})
