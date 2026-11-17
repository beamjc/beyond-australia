import { describe, expect, it } from 'vitest'
import { buildIntakes, isValidEmail, isValidPhone, PROGRAM_OPTIONS, withValue } from '@/lib/liffForm'
import { functionsUrl, liffUrl, sourceFromLanding } from '@/lib/leadDraft'

describe('buildIntakes', () => {
  it('starts at the quarter after the current month and wraps the year', () => {
    const v = buildIntakes(new Date(2026, 10, 17)).map((o) => o.value)
    expect(v).toEqual(['Jan–Mar 2027', 'Apr–Jun 2027', 'Jul–Sep 2027', 'Oct–Dec 2027', 'Not sure'])
  })

  it('skips the quarter already under way', () => {
    expect(buildIntakes(new Date(2027, 0, 5))[0].value).toBe('Apr–Jun 2027')
  })

  it('uses the Buddhist year in Thai labels', () => {
    expect(buildIntakes(new Date(2026, 10, 17))[0].th).toBe('ม.ค.–มี.ค. 2570')
  })
})

describe('withValue', () => {
  it('keeps a saved value that is no longer listed', () => {
    expect(withValue(PROGRAM_OPTIONS, 'PhD')[0]).toEqual({ value: 'PhD', th: 'PhD', en: 'PhD' })
    expect(withValue(PROGRAM_OPTIONS, 'Master')).toBe(PROGRAM_OPTIONS)
    expect(withValue(PROGRAM_OPTIONS, null)).toBe(PROGRAM_OPTIONS)
  })
})

describe('phone and email validation', () => {
  it('accepts Thai and Australian formats', () => {
    for (const p of ['081 234 5678', '081-234-5678', '+66 81 234 5678', '0412 345 678', '+61 (4) 1234 5678']) {
      expect(isValidPhone(p), p).toBe(true)
    }
  })
  it('rejects too short, letters and empty', () => {
    for (const p of ['', '1234', 'call me', '+66 81 234 5678 99999']) expect(isValidPhone(p), p).toBe(false)
  })
  it('checks email shape only', () => {
    expect(isValidEmail(' nong@example.com ')).toBe(true)
    expect(isValidEmail('nong@example')).toBe(false)
  })
})

describe('leadDraft URLs and attribution', () => {
  it('puts only the encoded draft ID in the LIFF URL', () => {
    expect(liffUrl('d_abc-123_XYZ', '1234567890-AbCdEfGh')).toBe('https://liff.line.me/1234567890-AbCdEfGh?d=d_abc-123_XYZ')
    expect(liffUrl(null, '1234567890-AbCdEfGh')).toBe('https://liff.line.me/1234567890-AbCdEfGh')
  })

  it('builds the functions URL without a double slash', () => {
    expect(functionsUrl('https://x.supabase.co/')).toBe('https://x.supabase.co/functions/v1')
  })

  it('keeps UTM tags and an external referrer host, not the full referrer URL', () => {
    const s = sourceFromLanding(
      'https://beyond.example/?utm_source=facebook&utm_campaign=feb-intake&other=1',
      'https://l.facebook.com/l.php?u=secret',
    )
    expect(s).toEqual({ landing_page: '/', utm_source: 'facebook', utm_campaign: 'feb-intake', referrer: 'l.facebook.com' })
  })

  it('ignores same-site referrers', () => {
    expect(sourceFromLanding('https://beyond.example/study', 'https://beyond.example/').referrer).toBeUndefined()
  })
})

describe('isValidAge', () => {
  it('accepts whole years 15–70 only', async () => {
    const { isValidAge } = await import('@/lib/liffForm')
    for (const ok of ['15', '24', '70', ' 30 ']) expect(isValidAge(ok), ok).toBe(true)
    for (const bad of ['', '14', '71', '24.5', 'abc', '-20', '100']) expect(isValidAge(bad), bad).toBe(false)
  })
})
