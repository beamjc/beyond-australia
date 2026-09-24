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
})
