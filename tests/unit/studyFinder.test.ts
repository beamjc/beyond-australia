import { describe, it, expect } from 'vitest'
import { emptyStudyAnswers, recommendStudyPathway, scoreStudyAnswers, isValidAge, isValidExperience, minAnnualTuition, type StudyAnswers } from '@/lib/studyFinder'

const answers = (a: Partial<StudyAnswers>): StudyAnswers => ({ ...emptyStudyAnswers, age: '25', ...a })
const th = (r: { th: string }[]) => r.map((x) => x.th)

describe('Study Pathway Finder — owner test profiles', () => {
  it('A: no score + improve English + ELICOS + high school → ELICOS first', () => {
    const r = recommendStudyPathway(answers({ english: 'none', goals: ['english'], interest: 'elicos', qualification: 'highSchool' }))
    // ELICOS 3 + 4 + 4 = 11; VET 2; HE 1
    expect(r.scores).toEqual({ elicos: 11, vet: 2, he: 1 })
    expect(r.primary).toBe('elicos')
    expect(r.tieWith).toBeNull()
    expect(r.alternative).toBe('vet')
    expect(r.sequence).toEqual(['elicos', 'vet'])
    expect(th(r.reasons.elicos)).toEqual(['ยังไม่มีผลคะแนนภาษาอังกฤษ', 'สนใจเรียนภาษาอังกฤษ (ELICOS)', 'ต้องการพัฒนาภาษาอังกฤษ'])
  })

  it('B: IELTS 6.5 + qualification + Higher Ed + bachelor → Higher Education, clearly', () => {
    const r = recommendStudyPathway(answers({ english: '60to65', goals: ['qualification'], interest: 'he', qualification: 'bachelor' }))
    // HE 2 + 4 + 2 + 3 = 11; VET 2 + 2 = 4
    expect(r.scores.he).toBe(11)
    expect(r.scores.vet).toBe(4)
    expect(r.primary).toBe('he')
    expect(r.tieWith).toBeNull()
  })

  it('C: IELTS 6.0 + career change + VET + bachelor → VET stays first, with the level note', () => {
    const r = recommendStudyPathway(answers({ english: '60to65', goals: ['career'], interest: 'vet', qualification: 'bachelor' }))
    // VET 2 + 4 + 2 = 8; HE 2 + 1 + 3 = 6
    expect(r.scores).toMatchObject({ vet: 8, he: 6 })
    expect(r.primary).toBe('vet')
    expect(r.alternative).toBe('he')
    expect(r.showDowngradeNote).toBe(true)
  })

  it('D: IELTS 7+ + not sure + master → not ELICOS', () => {
    const r = recommendStudyPathway(answers({ english: '70plus', interest: 'unsure', goals: ['unsure'], qualification: 'master' }))
    expect(r.scores).toEqual({ elicos: 0, vet: 1, he: 6 })
    expect(r.primary).toBe('he')
    expect(r.primary).not.toBe('elicos')
    expect(r.nextSteps).toContain('chooseField')
  })

  it('E: Higher Education first with a low budget → keeps HE, flags the budget, never switches to ELICOS', () => {
    const r = recommendStudyPathway(answers({ english: '70plus', goals: ['qualification'], interest: 'he', qualification: 'bachelor', budget: '10to20k' }))
    expect(r.primary).toBe('he')
    expect(r.budgetConstrained).toEqual(['he'])
    expect(r.nextSteps).toContain('compareBudget')
    // Same answers with a larger budget give the same pathway: budget is a constraint, not a score.
    expect(recommendStudyPathway({ ...answers({ english: '70plus', goals: ['qualification'], interest: 'he', qualification: 'bachelor' }), budget: 'over35k' }).scores)
      .toEqual(r.scores)
  })
})

describe('Study Pathway Finder — rules', () => {
  it('HE budget floor comes from the planner data (lowest university tier)', () => {
    expect(minAnnualTuition.he).toBe(28_000)
  })

  it('ties within 1 point are shown as two similar options', () => {
    // English 6.0–6.5 (VET 2, HE 2) + qualification goal (VET 2, HE 2) → 4 / 4
    const r = recommendStudyPathway(answers({ english: '60to65', goals: ['qualification'], interest: 'unsure', qualification: 'certDiploma' }))
    // + cert/diploma: VET 2, HE 1 → VET 6, HE 5
    expect(r.scores).toMatchObject({ vet: 6, he: 5 })
    expect(r.primary).toBe('vet')
    expect(r.tieWith).toBe('he')
    expect(r.alternative).toBeNull()
  })

  it('age and city never change the scores', () => {
    const base: Partial<StudyAnswers> = { english: '50to55', goals: ['career'], interest: 'vet', qualification: 'highSchool' }
    const s1 = scoreStudyAnswers(answers({ ...base, age: '19', city: 'Sydney' })).scores
    const s2 = scoreStudyAnswers(answers({ ...base, age: '45', city: 'Hobart' })).scores
    expect(s1).toEqual(s2)
  })

  it('long-term planning adds no weight, only the migration note and a visa step', () => {
    const without = recommendStudyPathway(answers({ english: '60to65', interest: 'he', qualification: 'bachelor' }))
    const withGoal = recommendStudyPathway(answers({ english: '60to65', interest: 'he', qualification: 'bachelor', goals: ['studyWork'] }))
    expect(withGoal.scores).toEqual(without.scores)
    expect(withGoal.showMigrationNote).toBe(true)
    expect(withGoal.nextSteps).toContain('visaInfo')
  })

  it('reasons only list answers that added weight to that pathway', () => {
    const r = recommendStudyPathway(answers({ english: 'le45', interest: 'he', qualification: 'bachelor' }))
    // le45 gives HE −2, so it is not a reason for HE
    expect(th(r.reasons.he)).toEqual(['สนใจเรียนระดับมหาวิทยาลัย', 'มีวุฒิปริญญาตรี'])
  })

  it('always 3–4 next steps', () => {
    for (const a of [answers({}), answers({ english: 'none', interest: 'unsure', goals: ['unsure', 'studyWork'], budget: 'unsure', timing: 'within6' })]) {
      const n = recommendStudyPathway(a).nextSteps.length
      expect(n).toBeGreaterThanOrEqual(3)
      expect(n).toBeLessThanOrEqual(4)
    }
  })

  it('validates age 15–70 and optional experience 0–50', () => {
    expect(['-5', '0', '14', '71', '20.5', ''].map(isValidAge)).toEqual([false, false, false, false, false, false])
    expect(['15', '70', '24'].map(isValidAge)).toEqual([true, true, true])
    expect(['', '0', '50'].map(isValidExperience)).toEqual([true, true, true])
    expect(['-1', '51', '2.5', 'abc'].map(isValidExperience)).toEqual([false, false, false, false])
  })
})
