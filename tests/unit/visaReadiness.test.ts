import { describe, it, expect } from 'vitest'
import { readinessFactors } from '@/data/visaReadiness'
import {
  computeRiskScore, factorRisk, rankFactors, readinessScore, riskLevel, verdictBand,
} from '@/lib/visaReadiness'

const all = (v: number) => Object.fromEntries(readinessFactors.map((f) => [f.id, v]))
const safe = () => Object.fromEntries(readinessFactors.map((f) => [f.id, f.inverted ? 100 : 0]))
const risky = () => Object.fromEntries(readinessFactors.map((f) => [f.id, f.inverted ? 0 : 100]))

describe('visa readiness scoring (unchanged from the original assessment)', () => {
  it('keeps the original weights and inverted factors', () => {
    expect(readinessFactors.map((f) => [f.id, f.weight, !!f.inverted])).toEqual([
      ['age', 1, false],
      ['studyGap', 1.2, false],
      ['downgrade', 1.3, false],
      ['fieldChange', 1, false],
      ['immigrationHistory', 1.5, false],
      ['timeInAustralia', 1, false],
      ['evidence', 0.8, true],
      ['postStudyPlans', 1.1, true],
    ])
  })

  it('scores 0 at the safe ends, 100 at the risky ends, 50 at the defaults', () => {
    expect(computeRiskScore(readinessFactors, safe())).toBe(0)
    expect(computeRiskScore(readinessFactors, risky())).toBe(100)
    expect(computeRiskScore(readinessFactors, all(50))).toBe(50)
  })

  it('weights each factor as before', () => {
    // Only immigration history at 100 (weight 1.5), everything else safe:
    // 1.5 / 8.9 × 100 = 16.85 → 17
    const v = { ...safe(), immigrationHistory: 100 }
    expect(computeRiskScore(readinessFactors, v)).toBe(17)
    // Only evidence at its weak end (weight 0.8): 0.8 / 8.9 × 100 = 8.99 → 9
    expect(computeRiskScore(readinessFactors, { ...safe(), evidence: 0 })).toBe(9)
  })

  it('keeps the per-factor thresholds (≤33 low, ≤66 medium)', () => {
    expect([0, 33, 34, 66, 67, 100].map(riskLevel)).toEqual(['low', 'low', 'medium', 'medium', 'high', 'high'])
    expect(factorRisk({ inverted: true }, 20)).toBe(80)
  })

  it('keeps the verdict bands and shows readiness as 100 − risk', () => {
    expect([0, 20, 21, 40, 41, 55, 56, 75, 76].map(verdictBand)).toEqual([
      'strong', 'strong', 'some', 'some', 'several', 'several', 'many', 'many', 'serious',
    ])
    expect(readinessScore(39)).toBe(61)
  })

  it('ranks high before medium, then by weighted risk', () => {
    const v = { ...safe(), age: 80, immigrationHistory: 80, studyGap: 50, evidence: 40 }
    // high: immigration (80×1.5=120) before age (80×1); medium: studyGap (50×1.2=60) before evidence (60×0.8=48)
    expect(rankFactors(readinessFactors, v).slice(0, 4).map((r) => [r.factor.id, r.level])).toEqual([
      ['immigrationHistory', 'high'],
      ['age', 'high'],
      ['studyGap', 'medium'],
      ['evidence', 'medium'],
    ])
  })
})
