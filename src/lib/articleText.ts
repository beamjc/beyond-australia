import type { Article } from '@/types/article'

const filled = (s: string | null | undefined) => (s ?? '').trim() !== ''

/**
 * Title, excerpt and content in the visitor's language, falling back to the
 * other language when a field is empty (e.g. Facebook posts are Thai only).
 * `thaiOnly` is true when English was asked for but Thai is shown.
 */
export function localizedArticle(a: Pick<Article, 'title_en' | 'title_th' | 'excerpt_en' | 'excerpt_th' | 'content_en' | 'content_th'>, language: 'en' | 'th') {
  const pick = (en: string | null, th: string | null) =>
    language === 'th' ? (filled(th) ? th : en) : filled(en) ? en : th
  const thaiOnly = language === 'en' && !filled(a.title_en) && filled(a.title_th)
  return {
    title: pick(a.title_en, a.title_th) ?? '',
    excerpt: pick(a.excerpt_en, a.excerpt_th),
    content: pick(a.content_en, a.content_th),
    thaiOnly,
    lang: thaiOnly ? 'th' : language,
  }
}
