// MOCKED Supabase content. These fixtures stand in for the REST API so that
// rendering, ordering and empty/error states can be exercised locally.
// Passing tests that use them are NOT evidence of live integration, of the
// real published content, or of RLS behaviour.
import { test as base, expect, type Page, type Route } from '@playwright/test'

export const MOCK_SUPABASE = 'http://127.0.0.1:54321'

const iso = (d: Date) => d.toISOString()
const days = (n: number) => new Date(Date.now() + n * 86_400_000)

export const mockEvents = [
  { id: 'e-past', title_en: 'Past Seminar', title_th: 'สัมมนาที่ผ่านมา', description_en: null, description_th: null, location_en: 'Bangkok', location_th: 'กรุงเทพฯ', event_type: 'offline', event_date: iso(days(-30)), is_ongoing: false, is_published: true, published_at: null, created_at: iso(days(-40)), updated_at: iso(days(-40)) },
  { id: 'e-online', title_en: 'Online Q&A', title_th: 'ถามตอบออนไลน์', description_en: 'Live Q&A', description_th: 'ถามตอบสด', location_en: null, location_th: null, event_type: 'online', event_date: iso(days(7)), is_ongoing: false, is_published: true, published_at: null, created_at: iso(days(-5)), updated_at: iso(days(-5)) },
  { id: 'e-hybrid', title_en: 'Hybrid Fair', title_th: 'งานแฟร์ไฮบริด', description_en: null, description_th: null, location_en: 'Chiang Mai', location_th: 'เชียงใหม่', event_type: 'hybrid', event_date: iso(days(14)), is_ongoing: false, is_published: true, published_at: null, created_at: iso(days(-5)), updated_at: iso(days(-5)) },
  { id: 'e-ongoing', title_en: 'Weekly Clinic', title_th: 'คลินิกรายสัปดาห์', description_en: null, description_th: null, location_en: 'Bangkok', location_th: 'กรุงเทพฯ', event_type: 'offline', event_date: null, is_ongoing: true, is_published: true, published_at: null, created_at: iso(days(-5)), updated_at: iso(days(-5)) },
]

export const mockArticles = [
  { id: 'a1', slug: 'whm-guide', title_en: 'WHM Guide', title_th: 'คู่มือ WHM', content_en: '<p>English body</p>', content_th: '<p>เนื้อหาภาษาไทย</p>', excerpt_en: 'Guide', excerpt_th: 'คู่มือ', cover_image_url: null, tags: ['WHM'], is_published: true, published_at: iso(days(-2)), created_at: iso(days(-3)), updated_at: iso(days(-2)) },
  { id: 'a2', slug: 'no-tags', title_en: 'Null Tags Article', title_th: 'บทความไม่มีแท็ก', content_en: '<p>x</p>', content_th: '<p>x</p>', excerpt_en: null, excerpt_th: null, cover_image_url: 'http://127.0.0.1:9/missing.jpg', tags: null, is_published: true, published_at: iso(days(-1)), created_at: iso(days(-3)), updated_at: iso(days(-1)) },
]

type Mode = 'data' | 'empty' | 'error'

/** Route all Supabase REST calls to fixtures. Records request URLs. */
export async function mockSupabase(page: Page, mode: Mode = 'data') {
  const requests: string[] = []
  await page.route(`${MOCK_SUPABASE}/**`, async (route: Route) => {
    const url = new URL(route.request().url())
    requests.push(decodeURIComponent(url.toString()))
    if (mode === 'error') return route.fulfill({ status: 500, contentType: 'application/json', body: '{"message":"mock failure"}' })
    const table = url.pathname.split('/').pop()
    let rows: Record<string, unknown>[] = mode === 'empty' ? [] : table === 'events' ? [...mockEvents] : table === 'articles' ? [...mockArticles] : []
    // Honour the filters the app uses, so ordering/filter bugs are visible.
    const slug = url.searchParams.get('slug')
    if (slug) rows = rows.filter((r) => `eq.${r.slug}` === slug)
    const or = url.searchParams.get('or')
    if (or && table === 'events') {
      const gte = /event_date\.gte\.([^,)]+)/.exec(or)?.[1]
      rows = rows.filter((r) => r.is_ongoing || (gte && r.event_date && String(r.event_date) >= gte))
    }
    const single = (route.request().headers()['accept'] ?? '').includes('vnd.pgrst.object')
    if (single) {
      if (rows.length !== 1) return route.fulfill({ status: 406, contentType: 'application/json', body: '{"code":"PGRST116","message":"0 rows"}' })
      return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(rows[0]) })
    }
    return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(rows) })
  })
  return requests
}

export const test = base.extend<{ lang: 'en' | 'th'; errors: string[] }>({
  lang: ['en', { option: true }],
  errors: async ({ page }, use) => {
    const errors: string[] = []
    page.on('pageerror', (e) => errors.push(e.message))
    await use(errors)
  },
  page: async ({ page, lang }, use) => {
    await page.addInitScript((l) => {
      try { if (!sessionStorage.getItem('qa.init')) { localStorage.setItem('ba.lang', l); sessionStorage.setItem('qa.init', '1') } } catch {}
    }, lang)
    await use(page)
  },
})

export { expect }

export async function noHorizontalOverflow(page: Page) {
  const { sw, cw } = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth }))
  expect(sw, 'page should not scroll horizontally').toBeLessThanOrEqual(cw + 1)
}
