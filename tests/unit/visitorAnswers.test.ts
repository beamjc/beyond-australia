import { describe, expect, it } from 'vitest'
import { combineToolAnswers, type StoredToolAnswers } from '@/lib/visitorAnswers'
import { isOfficialAccountLink } from '@/lib/lineLeadInterceptor'
import { explorerLeadAnswers } from '@/lib/visaExplorer'
import { emptyStudyAnswers, recommendStudyPathway, studyFinderLeadAnswers } from '@/lib/studyFinder'
import { lineOAMessageUrl } from '@/lib/lineMessage'

const tool = (t: Partial<StoredToolAnswers> & { tool: string; at: number }): StoredToolAnswers => ({
  title: t.tool, lines: [], ...t,
})

describe('combineToolAnswers', () => {
  it('returns null when no tool was used', () => {
    expect(combineToolAnswers([])).toBeNull()
  })

  it('keeps the tool name when only one tool was used', () => {
    const d = combineToolAnswers([tool({ tool: 'budget-planner', at: 1, title: 'งบ', lines: ['อายุผู้สมัคร: 24 ปี'], age: 24 })])!
    expect(d.tool).toBe('budget-planner')
    expect(d.answers.summary).toBe('■ งบ\nอายุผู้สมัคร: 24 ปี')
    expect(d.answers.age).toBe(24)
  })

  it('merges every tool in the order used; the latest non-empty key field wins', () => {
    const d = combineToolAnswers([
      tool({ tool: 'visa-explorer', at: 30, title: 'B', lines: ['b'], visaInterest: 'whm', course: null }),
      tool({ tool: 'budget-planner', at: 10, title: 'A', lines: ['a'], age: 24, visaInterest: 'student', course: 'Master' }),
      tool({ tool: 'study-finder', at: 20, title: 'C', lines: ['c'], age: 27, visaInterest: 'student', course: 'Bachelor' }),
    ])!
    expect(d.tool).toBe('website-tools')
    expect(d.answers.summary).toBe('■ A\na\n\n■ C\nc\n\n■ B\nb')
    expect(d.answers.age).toBe(27) // study-finder is newer than the planner
    expect(d.answers.visa_interest).toBe('whm') // explorer is the newest
    expect(d.answers.program_interest).toBe('Bachelor') // explorer had no course
    expect(d.answers.tools_used).toEqual(['budget-planner', 'study-finder', 'visa-explorer'])
  })

  it('leaves key fields out when no tool asked them', () => {
    const d = combineToolAnswers([tool({ tool: 'postcode-checker', at: 1, visaInterest: 'whm' })])!
    expect(d.answers).not.toHaveProperty('age')
    expect(d.answers).not.toHaveProperty('program_interest')
  })
})

describe('isOfficialAccountLink', () => {
  it('matches the @beyondstudy add-friend and chat links used on the site', () => {
    expect(isOfficialAccountLink('https://line.me/ti/p/@beyondstudy')).toBe(true)
    expect(isOfficialAccountLink('https://line.me/R/ti/p/@beyondstudy')).toBe(true)
    expect(isOfficialAccountLink(lineOAMessageUrl('สวัสดี'))).toBe(true)
  })
  it('ignores share links, other accounts and lookalike hosts', () => {
    expect(isOfficialAccountLink('https://social-plugins.line.me/lineit/share?url=x')).toBe(false)
    expect(isOfficialAccountLink('https://line.me/R/share?text=hi')).toBe(false)
    expect(isOfficialAccountLink('https://line.me/ti/p/@beyondstudyfake')).toBe(false)
    expect(isOfficialAccountLink('https://evil.example/https://line.me/ti/p/@beyondstudy')).toBe(false)
  })
})

describe('explorerLeadAnswers', () => {
  it('is null until a result is reached', () => {
    expect(explorerLeadAnswers([{ node: 'start' }])).toBeNull()
  })
  it('records the first choice as the visa interest and the chosen answers', () => {
    const a = explorerLeadAnswers([
      { node: 'start', choice: 'study' },
      { node: 'student-plan', choice: 'english' },
      { node: 'student-english' },
    ])!
    expect(a.visaInterest).toBe('student')
    expect(a.course).toBe('English course')
    expect(a.lines[0]).toContain('อยากไปเรียนต่อ')
    expect(a.lines.at(-1)?.startsWith('→ ')).toBe(true)
  })
  it('maps the Work and Holiday branch', () => {
    const a = explorerLeadAnswers([
      { node: 'start', choice: 'whm' }, { node: 'whm-age', choice: 'in' },
      { node: 'whm-passport', choice: 'thai' }, { node: 'whm-goal', choice: 'work' }, { node: 'whm-result' },
    ])!
    expect(a.visaInterest).toBe('whm')
    expect(a.course).toBeNull()
  })
})

describe('studyFinderLeadAnswers', () => {
  it('sends the typed age and a course for the recommended pathway', () => {
    const answers = { ...emptyStudyAnswers, age: '26', english: 'none' as const, goals: ['english' as const], interest: 'elicos' as const, qualification: 'bachelor' as const, experienceYears: '2' }
    const a = studyFinderLeadAnswers(answers, recommendStudyPathway(answers))
    expect(a.age).toBe(26)
    expect(a.visaInterest).toBe('student')
    expect(a.course).toBe('English course')
    expect(a.lines[0]).toBe('ตอนนี้คุณอายุเท่าไหร่? 26')
  })
})
