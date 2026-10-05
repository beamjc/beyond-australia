// Checks lookup behaviour against the list encoded in src/data/postcodeData.ts.
// It does not verify that list against the current Home Affairs page.
import { describe, expect, it } from 'vitest'
import { checkPostcode } from '@/data/postcodeData'

describe('checkPostcode', () => {
  it('finds a listed Northern Australia postcode (Townsville 4810)', () => {
    const r = checkPostcode(4810)
    expect(r.eligible).toBe(true)
    expect(r.areas.map((a) => a.name)).toContain('Northern Australia')
  })
  it('matches NT postcodes whose leading zero was dropped by numeric parsing (0870 → 870)', () => {
    const r = checkPostcode(870)
    expect(r.eligible).toBe(true)
    expect(r.areas.flatMap((a) => a.states)).toContain('NT')
  })
  it('returns not-listed for a Sydney CBD postcode (2000)', () => {
    expect(checkPostcode(2000).eligible).toBe(false)
  })
  it('handles range boundaries inclusively (QLD 4798–4812)', () => {
    expect(checkPostcode(4798).eligible).toBe(true)
    expect(checkPostcode(4812).eligible).toBe(true)
  })
  it('returns not-listed for 0 and out-of-range numbers', () => {
    expect(checkPostcode(0).eligible).toBe(false)
    expect(checkPostcode(9999).eligible).toBe(false)
  })
  // Regressions from the 2026-10-05 check against Home Affairs (FC-17).
  it('QLD 4516 is not a bushfire declared postcode (official list: 4515, 4517 to 4519)', () => {
    const names = checkPostcode(4516).areas.map((a) => a.name)
    expect(names).not.toContain('Bushfire declared areas')
    expect(names).toContain('Regional Australia')
    expect(checkPostcode(4515).areas.map((a) => a.name)).toContain('Bushfire declared areas')
  })
  it('Norfolk Island 2899 is in Regional Australia as well as Remote and Very Remote', () => {
    const names = checkPostcode(2899).areas.map((a) => a.name)
    expect(names).toContain('Regional Australia')
    expect(names).toContain('Remote and Very Remote Australia')
  })
  it('groups matches by kind of work, each type once with the areas that make it count', () => {
    const work = checkPostcode(4810).work
    expect(work.map((w) => w.type)).toEqual([
      'tourism', 'cultivation', 'treeFarming', 'fishing', 'construction', 'bushfireRecovery', 'disasterRecovery',
    ])
    expect(work.find((w) => w.type === 'tourism')!.areas).toEqual(['remote', 'northern'])
    expect(work.find((w) => w.type === 'construction')!.areas).toEqual(['northern', 'regional'])
  })
  it('Regional-only postcode lists only farm work and construction (Mildura 3500)', () => {
    expect(checkPostcode(3500).work.map((w) => w.type)).toEqual(['cultivation', 'construction', 'disasterRecovery'])
  })
  it('not-listed postcode has no work types', () => {
    expect(checkPostcode(2000).work).toEqual([])
  })
})
