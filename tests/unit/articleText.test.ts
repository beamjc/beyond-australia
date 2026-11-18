import { describe, expect, it } from 'vitest'
import { localizedArticle } from '@/lib/articleText'

const a = (o: Partial<Parameters<typeof localizedArticle>[0]> = {}) => ({
  title_en: '', title_th: '', excerpt_en: null, excerpt_th: null, content_en: null, content_th: null, ...o,
})

describe('localizedArticle', () => {
  it('uses the visitor language when it is filled in', () => {
    const r = localizedArticle(a({ title_en: 'Hello', title_th: 'สวัสดี', content_en: '<p>en</p>', content_th: '<p>th</p>' }), 'en')
    expect(r).toMatchObject({ title: 'Hello', content: '<p>en</p>', thaiOnly: false, lang: 'en' })
    expect(localizedArticle(a({ title_en: 'Hello', title_th: 'สวัสดี' }), 'th').title).toBe('สวัสดี')
  })

  it('shows Thai with a "Thai only" flag in English mode when there is no English (Facebook posts)', () => {
    const r = localizedArticle(a({ title_th: 'เตรียมตัวไป WHM', excerpt_th: 'สรุป', content_th: '<p>ไทย</p>' }), 'en')
    expect(r).toMatchObject({ title: 'เตรียมตัวไป WHM', excerpt: 'สรุป', content: '<p>ไทย</p>', thaiOnly: true, lang: 'th' })
  })

  it('treats whitespace-only fields as empty', () => {
    expect(localizedArticle(a({ title_en: '  ', title_th: 'ไทย' }), 'en').thaiOnly).toBe(true)
  })

  it('falls back to English in Thai mode without a flag', () => {
    expect(localizedArticle(a({ title_en: 'Only English' }), 'th')).toMatchObject({ title: 'Only English', thaiOnly: false })
  })
})
