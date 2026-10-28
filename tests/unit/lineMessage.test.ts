import { describe, expect, it } from 'vitest'
import { formatLineMessage, lineOAMessageUrl, supportsLineUrlScheme } from '@/lib/lineMessage'

describe('lineOAMessageUrl', () => {
  it('matches the LINE docs example encoding', () => {
    expect(lineOAMessageUrl('Hi there!', '@linedevelopers')).toBe(
      'https://line.me/R/oaMessage/%40linedevelopers/?Hi%20there!',
    )
  })

  it('round-trips Thai text, currency symbols and newlines', () => {
    const text = formatLineMessage([
      { label: 'งบที่เตรียมไว้', value: '฿800,000' },
      { label: 'ยื่นวีซ่าจากที่ไหน', value: 'Off Shore (นอกประเทศออสเตรเลีย)' },
    ])
    const url = new URL(lineOAMessageUrl(text))
    expect(url.pathname).toBe('/R/oaMessage/%40beyondstudy/')
    expect(decodeURIComponent(url.search.slice(1))).toBe(
      'งบที่เตรียมไว้: ฿800,000\nยื่นวีซ่าจากที่ไหน: Off Shore (นอกประเทศออสเตรเลีย)',
    )
    // Nothing that could split the query or add parameters is left unencoded.
    expect(url.search.slice(1)).not.toMatch(/[&#=+\s]/)
  })
})

describe('supportsLineUrlScheme', () => {
  it('is true for iOS, iPadOS and Android', () => {
    expect(supportsLineUrlScheme('Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X)')).toBe(true)
    expect(supportsLineUrlScheme('Mozilla/5.0 (Linux; Android 15; Pixel 9)')).toBe(true)
    expect(supportsLineUrlScheme('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)', 5)).toBe(true)
  })

  it('is false for desktop browsers (LINE for PC does not support the scheme)', () => {
    expect(supportsLineUrlScheme('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)', 0)).toBe(false)
    expect(supportsLineUrlScheme('Mozilla/5.0 (Windows NT 10.0; Win64; x64)')).toBe(false)
  })
})
