import { test, expect, mockSupabase } from './fixtures'

// Phone/tablet layout (below the lg breakpoint). Desktop is checked separately
// and must stay unchanged.
const isDesktop = (w: number) => w >= 1024

test.describe('phone & tablet usability', () => {
  test.use({ lang: 'th' })

  test('every WHM and Study tab is visible without sideways scrolling', async ({ page }) => {
    test.skip(isDesktop(page.viewportSize()!.width), 'desktop keeps the scrollable row')
    await mockSupabase(page)
    await page.goto('/')
    for (const list of await page.getByRole('tablist').all()) {
      for (const tab of await list.getByRole('tab').all()) {
        if (!(await tab.isVisible())) continue
        const box = (await tab.boundingBox())!
        expect(box.x).toBeGreaterThanOrEqual(0)
        expect(box.x + box.width).toBeLessThanOrEqual(page.viewportSize()!.width)
        expect(box.height).toBeGreaterThanOrEqual(40)
      }
    }
  })

  test('Savings shows a result bar while editing inputs, and it jumps to the result', async ({ page }) => {
    test.skip(isDesktop(page.viewportSize()!.width), 'desktop shows the result beside the inputs')
    await mockSupabase(page)
    await page.goto('/#study')
    await page.locator('#study-tab-savings').click()
    const income = page.locator('#study-panel-savings').getByRole('textbox', { name: /รายได้ต่อปี/ })
    await income.scrollIntoViewIfNeeded()
    await income.fill('80000')
    const bar = page.locator('#study-panel-savings').getByRole('button', { name: /เงินที่คาดว่าจะเก็บได้ต่อปี/ })
    await expect(bar).toBeVisible()
    await bar.click()
    await expect(page.locator('#sav-result')).toBeInViewport()
    await expect(bar).toBeHidden()
  })

  test('floating LINE/Facebook buttons tuck away while scrolling down and return on scroll up', async ({ page }) => {
    await mockSupabase(page)
    await page.goto('/')
    const line = page.locator('a.fixed[href^="https://line.me/ti/p/"]')
    await expect(line).toBeVisible()
    await page.mouse.wheel(0, 1500); await page.waitForTimeout(150)
    await page.mouse.wheel(0, 600); await page.waitForTimeout(700)
    if (isDesktop(page.viewportSize()!.width)) {
      await expect(line).toHaveCSS('opacity', '1')
      return
    }
    await expect(line).toHaveAttribute('aria-hidden', 'true')
    await expect(line).toHaveCSS('pointer-events', 'none')
    await page.mouse.wheel(0, -400); await page.waitForTimeout(700)
    await expect(line).not.toHaveAttribute('aria-hidden', 'true')
    await expect(line).toHaveCSS('opacity', '1')
  })

  test('Top Universities subjects are one swipeable row on phones/tablets', async ({ page }) => {
    test.skip(isDesktop(page.viewportSize()!.width), 'desktop keeps the wrapping list')
    await mockSupabase(page)
    await page.goto('/#study')
    await page.locator('#study-tab-universities').click()
    const chips = page.locator('#study-panel-universities button[aria-pressed]').filter({ hasNotText: /Rank|Tuition/ })
    const tops = new Set<number>()
    for (const c of await chips.all()) tops.add(Math.round((await c.boundingBox())!.y))
    expect(tops.size).toBe(1)
    // Last subject can be reached by swiping and selected.
    const last = chips.last()
    await last.scrollIntoViewIfNeeded()
    await last.click()
    await expect(last).toHaveAttribute('aria-pressed', 'true')
    const noOverflow = await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)
    expect(noOverflow).toBe(true)
  })
})
