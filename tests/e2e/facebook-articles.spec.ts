// Facebook-imported articles on the public pages, with MOCKED Supabase rows.
// Shows how an imported post renders; says nothing about the live sync.
import { test, expect, mockSupabase, mockArticles, MOCK_SUPABASE } from './fixtures'
import type { Page } from '@playwright/test'

const fbArticle = {
  id: 'fb1', slug: 'fb-5678', source: 'facebook', fb_post_id: '1234_5678', fb_tagged: true, fb_removed_at: null,
  fb_permalink: 'https://www.facebook.com/beyondstudy/posts/5678',
  title_en: '', title_th: 'เตรียมตัวไป WHM ปี 2027', excerpt_en: null, excerpt_th: 'ย่อหน้าแรก',
  content_en: null,
  content_th: '<p>ย่อหน้าแรก<br>บรรทัดสอง</p>\n<div class="fb-video"><iframe src="https://www.facebook.com/plugins/video.php?href=x" title="Facebook video" loading="lazy"></iframe></div>',
  cover_image_url: null, tags: ['WHM'], is_published: true,
  published_at: new Date().toISOString(), created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
}

async function withFacebookArticle(page: Page) {
  await mockSupabase(page)
  await page.route(`${MOCK_SUPABASE}/rest/v1/articles**`, (route) => {
    const url = new URL(route.request().url())
    const all = [fbArticle, ...mockArticles]
    const slug = url.searchParams.get('slug')
    const rows = slug ? all.filter((r) => `eq.${r.slug}` === slug) : all
    const single = (route.request().headers()['accept'] ?? '').includes('vnd.pgrst.object')
    return route.fulfill({ json: single ? rows[0] : rows, status: single && rows.length !== 1 ? 406 : 200 })
  })
}

test.describe('Facebook articles, English mode', () => {
  test.use({ lang: 'en' })

  test('list shows the Thai post with a "Thai only" label; English articles have none', async ({ page }) => {
    await withFacebookArticle(page)
    await page.goto('/articles')
    const fbCard = page.getByRole('link', { name: /เตรียมตัวไป WHM ปี 2027/ })
    await expect(fbCard).toBeVisible()
    await expect(fbCard.getByText('Thai only')).toBeVisible()
    await expect(fbCard.locator('h3')).toHaveAttribute('lang', 'th')
    await expect(page.getByRole('link', { name: /WHM Guide/ }).getByText('Thai only')).toHaveCount(0)
  })

  test('detail shows the Thai body, the video, and a link to the original post', async ({ page }) => {
    await withFacebookArticle(page)
    await page.goto('/articles/fb-5678')
    await expect(page.getByRole('heading', { level: 1, name: 'เตรียมตัวไป WHM ปี 2027' })).toBeVisible()
    await expect(page.getByText('Thai only')).toBeVisible()
    await expect(page.getByText('บรรทัดสอง')).toBeVisible()
    await expect(page.locator('.article-body .fb-video iframe')).toHaveAttribute('title', 'Facebook video')
    const link = page.getByRole('link', { name: /View the original post on Facebook/ })
    await expect(link).toHaveAttribute('href', fbArticle.fb_permalink)
    await expect(link).toHaveAttribute('target', '_blank')
  })
})

test.describe('Facebook articles, Thai mode', () => {
  test.use({ lang: 'th' })
  test('no "Thai only" label; the Facebook link is in Thai', async ({ page }) => {
    await withFacebookArticle(page)
    await page.goto('/articles/fb-5678')
    await expect(page.getByRole('heading', { level: 1, name: 'เตรียมตัวไป WHM ปี 2027' })).toBeVisible()
    await expect(page.getByText('Thai only')).toHaveCount(0)
    await expect(page.getByRole('link', { name: /ดูโพสต์ต้นฉบับบน Facebook/ })).toBeVisible()
  })

  test('manual articles do not get a Facebook link', async ({ page }) => {
    await withFacebookArticle(page)
    await page.goto('/articles/whm-guide')
    await expect(page.getByRole('heading', { level: 1, name: 'คู่มือ WHM' })).toBeVisible()
    await expect(page.getByRole('link', { name: /ดูโพสต์ต้นฉบับบน Facebook/ })).toHaveCount(0)
  })
})
