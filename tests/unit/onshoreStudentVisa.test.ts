import { describe, it, expect } from 'vitest'
import {
  CURRENT_VISAS, STUDY_PLANS, OUTCOME_TONE, needsStudyPlan, onshoreOutcome,
} from '@/lib/onshoreStudentVisa'
import { formatDayMonthYear, formatMonthYear } from '@/lib/plannerDates'
import { STUDENT_VISA_ONSHORE_RULE, PLANNER_DATA_UPDATED } from '@/data/studyVisaRules'

// Expected outcomes come from the Home Affairs pages checked on 2026-10-04
// (docs/qa/factual-checks.md FC-28–FC-31), not from the implementation.
describe('onshore Student visa checker', () => {
  it('has no outcome until the needed answers are given', () => {
    expect(onshoreOutcome(null, null)).toBeNull()
    expect(onshoreOutcome('500', null)).toBeNull()
  })

  it('462, 485 and 600 holders must apply offshore (listed visas, no exemptions)', () => {
    for (const v of ['462', '485', '600'] as const) {
      expect(needsStudyPlan(v)).toBe(false)
      expect(OUTCOME_TONE[onshoreOutcome(v, null)!]).toBe('offshore')
    }
  })

  it('a stale study plan does not change the outcome for non-student visas', () => {
    expect(onshoreOutcome('462', 'phd')).toBe('whm462')
    expect(onshoreOutcome('other', 'higher')).toBe('otherVisa')
  })

  it('"other visa" is never auto-decided', () => {
    expect(OUTCOME_TONE[onshoreOutcome('other', null)!]).toBe('assess')
  })

  it('Student 500 holders: exemption paths say "may", same level says offshore, unsure needs review', () => {
    expect(needsStudyPlan('500')).toBe(true)
    const tone = (p: (typeof STUDY_PLANS)[number]) => OUTCOME_TONE[onshoreOutcome('500', p)!]
    expect(tone('continue')).toBe('maybe')
    expect(tone('higher')).toBe('maybe')
    expect(tone('phd')).toBe('maybe')
    expect(tone('same')).toBe('offshore')
    expect(tone('unsure')).toBe('assess')
  })

  it('every answer combination resolves to a distinct, defined outcome', () => {
    for (const v of CURRENT_VISAS) {
      const plans = needsStudyPlan(v) ? STUDY_PLANS : [null]
      for (const p of plans) expect(OUTCOME_TONE[onshoreOutcome(v, p)!]).toBeDefined()
    }
  })
})

describe('planner date labels', () => {
  it('formats the rule date like the owner copy in both languages', () => {
    const d = STUDENT_VISA_ONSHORE_RULE.effective
    expect(formatDayMonthYear('th', d, 'short')).toBe('2 ต.ค. 2569')
    expect(formatDayMonthYear('th', d)).toBe('2 ตุลาคม 2569')
    expect(formatDayMonthYear('en', d, 'short')).toBe('2 Oct 2026')
    expect(formatDayMonthYear('en', d)).toBe('2 October 2026')
  })

  it('formats the freshness month with the Buddhist Era year in Thai', () => {
    expect(formatMonthYear('th', PLANNER_DATA_UPDATED)).toBe('ตุลาคม 2569')
    expect(formatMonthYear('en', PLANNER_DATA_UPDATED)).toBe('October 2026')
    expect(formatMonthYear('th', { year: 2027, month: 1 })).toBe('มกราคม 2570')
  })
})
