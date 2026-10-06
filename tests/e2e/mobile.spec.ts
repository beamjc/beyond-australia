import { test, expect, mockSupabase, stepShow } from './fixtures'

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

  test('Savings result bar waits until the steps are finished; the result is shown at the end', async ({ page }) => {
    test.skip(isDesktop(page.viewportSize()!.width), 'desktop shows the result beside the inputs')
    await mockSupabase(page)
    await page.goto('/#study')
    await page.locator('#study-tab-savings').click()
    const panel = page.locator('#study-panel-savings')
    const income = panel.getByRole('textbox', { name: /รายได้ต่อปี/ })
    await stepShow(page, '#study-panel-savings', income)
    await income.fill('80000')
    const bar = panel.getByRole('button', { name: /เงินที่คาดว่าจะเก็บได้ต่อปี/ })
    // No figures while the visitor is still answering (they would come from defaults).
    await page.mouse.wheel(0, 200); await page.waitForTimeout(300)
    await expect(bar).toBeHidden()
    await panel.getByRole('button', { name: 'ถัดไป', exact: true }).click()
    await panel.getByRole('button', { name: /ดูผลการคำนวณ/ }).click()
    await expect(page.locator('#sav-result')).toBeInViewport()
    await expect(panel.locator('section[aria-labelledby="sav-result"]')).toContainText('A$')
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

  test('Budget Planner asks one question at a time on phones/tablets; desktop shows all inputs', async ({ page }) => {
    await mockSupabase(page)
    await page.goto('/#study')
    const panel = page.locator('#study-panel-courses')
    const progress = panel.getByRole('progressbar')
    if (isDesktop(page.viewportSize()!.width)) {
      await expect(progress).toBeHidden()
      for (const sel of ['#bsp-budget', '#bsp-location']) await expect(page.locator(sel)).toBeVisible()
      await expect(panel.getByRole('slider', { name: /อายุ/ })).toBeVisible()
      return
    }
    await expect(progress).toHaveAttribute('aria-label', 'ขั้นตอน 1 จาก 5')
    await expect(page.locator('#bsp-budget')).toBeHidden()
    await expect(panel.getByText('ครอบคลุมงบประมาณ').first()).toBeHidden() // results wait until the end

    // Picking a goal moves straight on.
    await panel.getByRole('button', { name: /ปริญญาโท/ }).click()
    await expect(progress).toHaveAttribute('aria-label', 'ขั้นตอน 2 จาก 5')
    await expect(page.locator('#bsp-budget')).toBeVisible()
    await page.locator('#bsp-budget').fill('500000')
    await panel.getByRole('button', { name: 'ถัดไป', exact: true }).click()
    await expect(panel.getByRole('slider', { name: /อายุ/ })).toBeVisible()
    await panel.getByRole('button', { name: /ย้อนกลับ/ }).click()
    await expect(page.locator('#bsp-budget')).toHaveValue('500,000')
    await panel.getByRole('button', { name: 'ถัดไป', exact: true }).click()
    await panel.getByRole('button', { name: 'ถัดไป', exact: true }).click()
    await panel.getByRole('button', { name: 'ถัดไป', exact: true }).click()
    await expect(progress).toHaveAttribute('aria-label', 'ขั้นตอน 5 จาก 5')
    await panel.getByRole('button', { name: /ดูผลการคำนวณ/ }).click()

    // Results, with the answers listed and editable.
    await expect(panel.getByText('ครอบคลุมงบประมาณ').first()).toBeInViewport()
    const budgetRow = panel.getByRole('button', { name: /งบที่เตรียมไว้.*฿500,000/ })
    await expect(budgetRow).toBeVisible()
    await expect(panel.getByRole('button', { name: /เป้าหมายการเรียน.*ปริญญาโท/ })).toBeVisible()
    await budgetRow.click()
    await expect(progress).toHaveAttribute('aria-label', 'ขั้นตอน 2 จาก 5')
    await expect(page.locator('#bsp-budget')).toBeVisible()
  })

  test('Budget Planner: English-only goal skips the IELTS step', async ({ page }) => {
    test.skip(isDesktop(page.viewportSize()!.width), 'stepped flow is phones/tablets only')
    await mockSupabase(page)
    await page.goto('/#study')
    const panel = page.locator('#study-panel-courses')
    await panel.getByRole('button', { name: /เรียนภาษาอังกฤษ/ }).click()
    await expect(panel.getByRole('progressbar')).toHaveAttribute('aria-label', 'ขั้นตอน 2 จาก 4')
  })

  test('Savings asks one card at a time on phones/tablets; result adjust buttons reopen the step', async ({ page }) => {
    await mockSupabase(page)
    await page.goto('/#study')
    await page.locator('#study-tab-savings').click()
    const panel = page.locator('#study-panel-savings')
    const progress = panel.getByRole('progressbar')
    if (isDesktop(page.viewportSize()!.width)) {
      await expect(progress).toBeHidden()
      await expect(page.locator('#sav-result')).toBeVisible()
      await expect(panel.getByRole('textbox', { name: /รายได้ต่อปี/ })).toBeVisible()
      return
    }
    await expect(progress).toHaveAttribute('aria-label', 'ขั้นตอน 1 จาก 5')
    await expect(page.locator('#sav-result')).toBeHidden()
    for (let i = 0; i < 4; i++) await panel.getByRole('button', { name: 'ถัดไป', exact: true }).click()
    await expect(progress).toHaveAttribute('aria-label', 'ขั้นตอน 5 จาก 5')
    await panel.getByRole('button', { name: /ดูผลการคำนวณ/ }).click()
    await expect(page.locator('#sav-result')).toBeInViewport()
    await expect(panel.getByRole('button', { name: /รายได้ก่อนหักภาษีต่อปี.*A\$60,000/ })).toBeVisible()
    // "Increase income" reopens the income step with the field focused.
    await panel.getByRole('button', { name: 'เพิ่มรายได้' }).click()
    await expect(progress).toHaveAttribute('aria-label', 'ขั้นตอน 4 จาก 5')
    await expect(panel.getByRole('textbox', { name: /รายได้ต่อปี/ })).toBeFocused()
  })
})
