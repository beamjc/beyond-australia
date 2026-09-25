import { describe, it, expect } from 'vitest'
import { explorerNodes, START_NODE, type Action } from '@/data/visaExplorer'
import { getNode, progressFor, questionsFrom, reasonsFor } from '@/lib/visaExplorer'
import { visaFacts } from '@/data/visaFacts'

const nodeTargets = (a: Action) => (a.kind === 'node' ? [a.node] : [])

describe('Visa Options Explorer tree', () => {
  it('every option / action points at a node that exists', () => {
    for (const n of explorerNodes) {
      const targets = n.kind === 'question' ? n.options.map((o) => o.next)
        : n.kind === 'result' ? n.actions.flatMap(nodeTargets)
        : n.cards.flatMap((c) => nodeTargets(c.action))
      for (const t of targets) expect(() => getNode(t), `${n.id} → ${t}`).not.toThrow()
    }
  })

  it('every node is reachable from the start', () => {
    const seen = new Set<string>()
    const walk = (id: string) => {
      if (seen.has(id)) return
      seen.add(id)
      const n = getNode(id)
      if (n.kind === 'question') n.options.forEach((o) => walk(o.next))
      if (n.kind === 'result') n.actions.flatMap(nodeTargets).forEach(walk)
      if (n.kind === 'compare') n.cards.flatMap((c) => nodeTargets(c.action)).forEach(walk)
    }
    walk(START_NODE)
    expect(Array.from(seen).sort()).toEqual(explorerNodes.map((n) => n.id).sort())
  })

  it('every result and the comparison cite an official source', () => {
    for (const n of explorerNodes) {
      if (n.kind === 'question') continue
      expect(n.sources.length, n.id).toBeGreaterThan(0)
      for (const s of n.sources) expect(s.href).toMatch(/^https:\/\/(immi\.homeaffairs\.gov\.au|portal\.mara\.gov\.au)\//)
    }
  })

  it('uses no guarantee / "best" / PR-promise wording', () => {
    const text = JSON.stringify(explorerNodes)
    for (const banned of [/competitive/i, /fastest/i, /\bPR\b/, /guarantee/i, /best (visa|pathway)/i, /strong path/i, /stepping stone/i, /eligible/i, /เหมาะที่สุด/, /มีสิทธิ์แน่นอน/, /คุณผ่าน(?!เกณฑ์คะแนนขั้นต่ำ)/, /76,515/]) {
      expect(text, String(banned)).not.toMatch(banned)
    }
  })

  it('numbers that change come from visaFacts', () => {
    const { min, max } = visaFacts.whm462Thailand.ageRange.value
    const whmAge = getNode('whm-age')
    expect(whmAge.kind === 'question' && whmAge.options[0].label.th).toBe(`${min}–${max} ปี`)
    const pts = getNode('skilled-points')
    expect(pts.kind === 'question' && pts.options[0].label.th).toBe(`${visaFacts.skilledPointsTest.passMark.value} คะแนนขึ้นไป`)
  })

  it('progress counts the longest remaining branch', () => {
    expect(questionsFrom('start')).toBe(4) // start → whm-age → whm-passport → whm-goal
    expect(progressFor([{ node: 'start' }])).toEqual({ n: 1, total: 4 })
    expect(progressFor([{ node: 'start', choice: 'employer' }, { node: 'employer-status' }])).toEqual({ n: 2, total: 3 })
  })

  it('reasons come only from the choices made', () => {
    const path = [{ node: 'start', choice: 'employer' }, { node: 'employer-status', choice: 'interested' }, { node: 'employer-match', choice: 'unsure' }, { node: 'employer-result' }]
    expect(reasonsFor(path).map((r) => r.th)).toEqual(['มีนายจ้างในออสเตรเลียที่สนใจสนับสนุนวีซ่า', 'มีนายจ้างที่สนใจสนับสนุน'])
  })
})
