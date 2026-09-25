import { test, expect, mockSupabase, noHorizontalOverflow } from './fixtures'

const STUDY_TABS = ['courses', 'universities', 'options', 'calculator', 'savings', 'strength']
const WHM_TABS = ['timeline', 'checklist', 'postcode', 'faq2026']

for (const lang of ['en', 'th'] as const) {
  test.describe(`home (${lang})`, () => {
    test.use({ lang })

    test('loads, sets <html lang>, no page errors, no horizontal overflow on any tab', async ({ page, errors }) => {
      await mockSupabase(page)
      await page.goto('/')
      await expect(page.locator('html')).toHaveAttribute('lang', lang)
      for (const [section, tabs] of [['whm', WHM_TABS], ['study', STUDY_TABS]] as const) {
        for (const id of tabs) {
          const tab = page.locator(`#${section}-tab-${id}`)
          await tab.scrollIntoViewIfNeeded()
          await tab.click()
          await expect(tab).toHaveAttribute('aria-selected', 'true')
          const panel = page.locator(`#${section}-panel-${id}`)
          await expect(panel).toBeVisible()
          await expect(panel).not.toBeEmpty()
          await noHorizontalOverflow(page)
        }
      }
      expect(errors).toEqual([])
    })
  })
}

test('language choice persists across reload and page navigation', async ({ page }) => {
  await mockSupabase(page)
  await page.goto('/')
  if (page.viewportSize()!.width < 768) await page.locator('nav button.md\\:hidden').click()
  await page.locator('nav').getByRole('button', { name: 'th', exact: true }).locator('visible=true').click()
  await expect(page.locator('html')).toHaveAttribute('lang', 'th')
  await page.reload()
  await expect(page.locator('html')).toHaveAttribute('lang', 'th')
  await page.goto('/articles')
  await expect(page.locator('html')).toHaveAttribute('lang', 'th')
})

test.describe('Budget Study Planner', () => {
  test.use({ lang: 'th' })

  test('currency toggle round-trip keeps the entered budget exactly', async ({ page }) => {
    await mockSupabase(page)
    await page.goto('/#study')
    const input = page.locator('#bsp-budget')
    await input.fill('800000')
    const thb = page.locator('#study-panel-courses').getByRole('button', { name: 'THB', exact: true })
    const aud = page.locator('#study-panel-courses').getByRole('button', { name: 'AUD', exact: true })
    for (let i = 0; i < 3; i++) {
      await aud.click(); await thb.click()
    }
    await expect(input).toHaveValue('800,000')
    await aud.click()
    // 800,000 / 23.48 = 34,071.55 → shown rounded
    await expect(input).toHaveValue('34,072')
  })

  test('inputs survive switching to another Study tab and back', async ({ page }) => {
    await mockSupabase(page)
    await page.goto('/#study')
    await page.locator('#bsp-budget').fill('1234567')
    await page.locator('#study-tab-savings').click()
    await page.locator('#study-tab-courses').click()
    await expect(page.locator('#bsp-budget')).toHaveValue('1,234,567')
  })

  test('sliders are keyboard operable and named', async ({ page }) => {
    await mockSupabase(page)
    await page.goto('/#study')
    const age = page.locator('#study-panel-courses').getByRole('slider', { name: /อายุ/ })
    await age.focus()
    await page.keyboard.press('End')
    await expect(age).toHaveAttribute('aria-valuenow', '50')
    await page.keyboard.press('Home')
    await expect(age).toHaveAttribute('aria-valuenow', '15')
  })

  test('blank budget is treated as 0 and shows a shortfall, not NaN', async ({ page }) => {
    await mockSupabase(page)
    await page.goto('/#study')
    await page.locator('#bsp-budget').fill('')
    const panel = page.locator('#study-panel-courses')
    await expect(panel).not.toContainText('NaN')
    await expect(panel.getByText('0%').first()).toBeVisible()
  })

  test('low-budget tip appears below ฿180,000 and switches goal to short courses', async ({ page }) => {
    await mockSupabase(page)
    await page.goto('/#study')
    await page.locator('#bsp-budget').fill('150000')
    const tip = page.getByRole('button', { name: /งบต่ำกว่า/ })
    await expect(tip).toBeVisible()
    await tip.click()
    await expect(page.getByRole('button', { name: /คอร์สระยะสั้น/ }).first()).toHaveAttribute('aria-pressed', 'true')
  })
})

test.describe('Postcode checker', () => {
  test('keeps leading zeros, strips non-digits, gates length', async ({ page }) => {
    await mockSupabase(page)
    await page.goto('/#whm')
    await page.locator('#whm-tab-postcode').click()
    const input = page.getByLabel('Enter postcode (e.g. 4810)')
    const btn = page.locator('#whm-panel-postcode').getByRole('button', { name: 'Check' })
    await input.fill('ab')
    await expect(input).toHaveValue('')
    await input.fill('08')
    await expect(btn).toBeDisabled()
    await input.fill('0870')
    await btn.click()
    await expect(page.getByText('Postcode 0870 is eligible!')).toBeVisible()
    await input.fill('2000')
    await btn.click()
    await expect(page.getByText('Postcode 2000 is not eligible')).toBeVisible()
    await input.fill('123456')
    await expect(input).toHaveValue('1234')
  })
})

test.describe('Financial calculator', () => {
  test('negative dependants and fees cannot reduce the total', async ({ page }) => {
    await mockSupabase(page)
    await page.goto('/#study')
    await page.locator('#study-tab-calculator').click()
    await page.getByLabel('Annual course fee (AUD)').fill('-5000')
    await page.getByLabel('Number of children coming with you').fill('-3')
    const panel = page.locator('#study-panel-calculator')
    await expect(page.getByLabel('Number of children coming with you')).toHaveValue('0')
    // 0 fee + 29,710 living + 2,000 travel
    await expect(panel.getByText('$31,710')).toBeVisible()
    await expect(panel).not.toContainText('-$')
  })

  test('partner + children + school-age breakdown sums correctly', async ({ page }) => {
    await mockSupabase(page)
    await page.goto('/#study')
    await page.locator('#study-tab-calculator').click()
    await page.getByLabel('Annual course fee (AUD)').fill('20000')
    await page.getByLabel('Amount already paid (AUD)').fill('5000')
    await page.getByLabel('Partner coming with you').check()
    await page.getByLabel('Number of children coming with you').fill('2')
    await page.getByLabel('Of these, how many are school-age?').fill('5')
    await expect(page.getByLabel('Of these, how many are school-age?')).toHaveValue('2')
    // 15,000 + 29,710 + 10,394 + 2×4,449 + 2×13,502 + 4×2,000 = 99,006
    await expect(page.locator('#study-panel-calculator').getByText('$99,006')).toBeVisible()
  })
})

test.describe('Study Options', () => {
  test('age must be 15–70; answers survive Back; nothing is sent over the network', async ({ page }) => {
    const external: string[] = []
    page.on('request', (r) => { const u = new URL(r.url()); if (!['127.0.0.1', 'localhost'].includes(u.hostname)) external.push(r.url()) })
    await mockSupabase(page)
    await page.goto('/#study')
    await page.locator('#study-tab-options').click()
    const panel = page.locator('#study-panel-options')
    const age = panel.getByLabel('How old are you?')
    const next = panel.getByRole('button', { name: /Next/ })
    for (const bad of ['-5', '0', '200', '14']) { await age.fill(bad); await expect(next).toBeDisabled() }
    await age.fill('25'); await expect(next).toBeEnabled(); await next.click()
    await panel.getByRole('button', { name: 'IELTS 5.0–5.5' }).click()
    await next.click()
    await panel.getByRole('button', { name: /Back/ }).click()
    await panel.getByRole('button', { name: /Back/ }).click()
    await expect(age).toHaveValue('25')
    const before = external.length
    // walk to the end
    await next.click(); await next.click()
    await panel.getByRole('button', { name: 'Improve my English skills' }).click(); await next.click()
    await panel.getByRole('button', { name: 'Sydney' }).click(); await next.click()
    await panel.getByRole('button', { name: '10,000 AUD or lower' }).click(); await next.click()
    await panel.getByRole('button', { name: 'Not sure yet' }).click(); await next.click()
    await panel.getByRole('button', { name: 'Bachelor\'s degree' }).click(); await next.click()
    await panel.getByRole('button', { name: 'Not sure' }).click()
    await panel.getByRole('button', { name: /See Results/ }).click()
    await expect(panel.getByText(/ELICOS|English/).first()).toBeVisible()
    expect(external.slice(before)).toEqual([])
  })
})

test.describe('Savings share links', () => {
  test.use({ lang: 'th' })
  test('LINE/Facebook share URLs encode Thai text and page URL (not opened)', async ({ page }) => {
    await mockSupabase(page)
    await page.goto('/#study')
    await page.locator('#study-tab-savings').click()
    const line = page.locator('#study-panel-savings a[href^="https://line.me/R/msg/text/"]')
    const href = await line.getAttribute('href')
    expect(href).toMatch(/^https:\/\/line\.me\/R\/msg\/text\/\?/)
    const msg = decodeURIComponent(href!.split('?')[1])
    expect(msg).toContain('คำนวณเงินออมออสเตรเลียแล้ว')
    expect(msg).toContain('http://127.0.0.1:3100/')
    const fb = await page.locator('#study-panel-savings a[href^="https://www.facebook.com/sharer/"]').getAttribute('href')
    expect(new URL(fb!).searchParams.get('u')).toContain('http://127.0.0.1:3100/')
  })
})

test.describe('Visa Readiness Check', () => {
  test('questions step → result step; endpoints map to readiness 100 / 0; answers survive Edit', async ({ page }) => {
    await mockSupabase(page)
    await page.goto('/#study')
    await page.locator('#study-tab-strength').click()
    const panel = page.locator('#study-panel-strength')
    const sliders = panel.getByRole('slider')
    await expect(sliders).toHaveCount(8)
    // Scoring is unchanged: normal factors are safest at Home (0), inverted ones at End (100).
    const normal = [/Age/, /Study gap/, /Level of the new course/, /Relevance of your chosen field/, /Visa and travel history/, /Time already spent in Australia/]
    const inverted = [/Supporting documents/, /Post-study plans/]
    const press = async (names: RegExp[], key: string) => {
      for (const n of names) { await panel.getByRole('slider', { name: n }).focus(); await page.keyboard.press(key) }
    }
    await press(normal, 'Home'); await press(inverted, 'End')
    await panel.getByRole('button', { name: 'See my readiness' }).click()
    await expect(sliders).toHaveCount(0) // no sliders on the result
    await expect(panel.getByText('100', { exact: true })).toBeVisible()
    await expect(panel.getByRole('heading', { name: 'You look well prepared overall' })).toBeVisible()
    await panel.getByRole('button', { name: 'Edit answers' }).click()
    await expect(panel.getByRole('slider', { name: /Age/ })).toHaveAttribute('aria-valuenow', '0')
    await press(normal, 'End'); await press(inverted, 'Home')
    await panel.getByRole('button', { name: 'See my readiness' }).click()
    await expect(panel.getByText('0', { exact: true }).first()).toBeVisible()
    await expect(panel.getByRole('heading', { name: 'Get professional advice before you apply' })).toBeVisible()
    // High group is open by default; each factor row expands.
    const rows = panel.locator('[aria-controls^="vra-detail-"]')
    await expect(rows).toHaveCount(8)
    await rows.first().click()
    await expect(rows.first()).toHaveAttribute('aria-expanded', 'true')
    await expect(panel.getByText('What to prepare').first()).toBeVisible()
  })
})

test.describe('Visa Pathway', () => {
  test('every branch reaches an outcome; Back and Start over work', async ({ page }) => {
    test.setTimeout(240_000) // DFS reloads the page once per path
    await mockSupabase(page)
    await page.goto('/#visa-pathway')
    const section = page.locator('#visa-pathway')
    const outcomes = new Set<string>()
    const card = section.locator('div.rounded-2xl.border-2.p-8')
    const heading = () => card.locator('h3').innerText()
    const optionLabels = () => card.locator('.flex.flex-col.gap-3 > button').allInnerTexts()
    // DFS over option labels, replaying each path from a fresh load.
    const stack: string[][] = [[]]
    let guard = 0
    while (stack.length && guard++ < 60) {
      const path = stack.pop()!
      // Unique query forces a real load; a same-URL hash goto keeps React state.
      await page.goto(`/?path=${guard}#visa-pathway`)
      for (const label of path) {
        await card.getByRole('button', { name: label, exact: true }).click()
        await page.waitForTimeout(400) // AnimatePresence swap
      }
      const opts = (await optionLabels()).map((o) => o.trim()).filter(Boolean)
      if (opts.length === 0) {
        outcomes.add(await heading())
        await expect(card.getByRole('button', { name: 'Start Over' })).toBeVisible()
        continue
      }
      for (const o of opts) stack.push([...path, o])
    }
    expect(outcomes.size).toBe(11)
    // Back returns to the previous question; Start over returns to the first.
    await page.goto('/?path=final#visa-pathway')
    const first = await heading()
    await section.getByRole('button', { name: 'No / Not yet', exact: true }).click()
    await page.waitForTimeout(400)
    await section.getByRole('button', { name: 'Student visa', exact: true }).click()
    await page.waitForTimeout(400)
    await section.getByRole('button', { name: /Back/ }).click()
    await page.waitForTimeout(400)
    await expect(card.locator('h3')).toHaveText('What would you like to explore?')
    await section.getByRole('button', { name: 'Student visa', exact: true }).click()
    await page.waitForTimeout(400)
    await section.getByRole('button', { name: /concerned about costs/ }).click()
    await page.waitForTimeout(400)
    await section.getByRole('button', { name: 'Start Over' }).click()
    await expect(card.locator('h3')).toHaveText(first)
  })
})

test.describe('Articles & events (MOCKED content)', () => {
  test('home events preview requests only upcoming/ongoing and hides past events', async ({ page }) => {
    const reqs = await mockSupabase(page)
    await page.goto('/')
    await page.locator('#events').scrollIntoViewIfNeeded()
    await expect(page.locator('#events').getByText('Online Q&A')).toBeVisible()
    await expect(page.locator('#events')).not.toContainText('Past Seminar')
    await expect(page.locator('#events')).toContainText('Weekly Clinic')
    expect(reqs.some((u) => u.includes('/events') && u.includes('is_published=eq.true') && u.includes('event_date.gte.'))).toBe(true)
  })

  test('/events lists type labels and ongoing entries', async ({ page }) => {
    await mockSupabase(page)
    await page.goto('/events')
    for (const t of ['Online Q&A', 'Hybrid Fair', 'Weekly Clinic', 'Past Seminar']) await expect(page.getByText(t)).toBeVisible()
    await expect(page.getByText('Ongoing')).toBeVisible()
  })

  test('/events empty state', async ({ page }) => {
    await mockSupabase(page, 'empty')
    await page.goto('/events')
    await expect(page.getByText('No events yet')).toBeVisible()
  })

  test('/articles tolerates null tags and filters published only', async ({ page, errors }) => {
    const reqs = await mockSupabase(page)
    await page.goto('/articles')
    await expect(page.getByText('WHM Guide')).toBeVisible()
    await expect(page.getByText('Null Tags Article')).toBeVisible()
    expect(errors).toEqual([])
    expect(reqs.filter((u) => u.includes('/articles')).every((u) => u.includes('is_published=eq.true'))).toBe(true)
  })

  test('article detail from a direct link: back goes to /articles', async ({ page }) => {
    await mockSupabase(page)
    await page.goto('/articles/whm-guide')
    await expect(page.getByRole('heading', { name: 'WHM Guide' })).toBeVisible()
    await page.getByRole('link', { name: /Back to Articles/ }).click()
    await expect(page).toHaveURL(/\/articles$/)
  })

  test('unknown slug shows not-found with a working link', async ({ page }) => {
    await mockSupabase(page)
    await page.goto('/articles/does-not-exist')
    await expect(page.getByText('Article not found.')).toBeVisible()
    await page.getByRole('link', { name: /Back to Articles/ }).click()
    await expect(page).toHaveURL(/\/articles$/)
  })

  test('Supabase failure on home does not break the page', async ({ page, errors }) => {
    await mockSupabase(page, 'error')
    await page.goto('/')
    await expect(page.locator('#study')).toBeVisible()
    expect(errors).toEqual([])
  })
})

test('unknown route returns 404 page', async ({ page }) => {
  const res = await page.goto('/no-such-page')
  expect(res?.status()).toBe(404)
})

test.describe('reduced motion & readability', () => {
  test('sections are fully opaque while being read (both motion settings)', async ({ page, browser }) => {
    for (const reducedMotion of ['no-preference', 'reduce'] as const) {
      const ctx = await browser.newContext({ viewport: page.viewportSize()!, reducedMotion })
      const p = await ctx.newPage()
      await mockSupabase(p)
      await p.goto('/')
      for (const sel of ['#whm', '#study', '#visa-pathway']) {
        const { top, h } = await p.evaluate((s) => { const el = document.querySelector(s)!; return { top: el.getBoundingClientRect().top + scrollY, h: (el as HTMLElement).offsetHeight } }, sel)
        const vh = page.viewportSize()!.height
        for (const off of [0, Math.max(0, h - vh)]) {
          await p.evaluate((y) => window.scrollTo(0, y), top + off)
          await p.waitForTimeout(300)
          const op = await p.evaluate((s) => Number(getComputedStyle(document.querySelector(s)!.parentElement!).opacity), sel)
          expect(op, `${sel} @+${off} (${reducedMotion})`).toBeGreaterThan(0.99)
        }
      }
      await ctx.close()
    }
  })
})

test('floating and consultation links point at the expected destinations (not opened)', async ({ page }) => {
  await mockSupabase(page)
  await page.goto('/')
  const hrefs = await page.locator('a[href^="http"]').evaluateAll((as) => as.map((a) => (a as HTMLAnchorElement).href))
  expect(hrefs.some((h) => h.startsWith('https://www.beyondstudycenter.com/'))).toBe(true)
  expect(hrefs.some((h) => h.includes('line.me'))).toBe(true)
  expect(hrefs.some((h) => h.includes('facebook.com'))).toBe(true)
})

test.describe('WHM checklist & FAQ', () => {
  test('checklist items check/uncheck via keyboard-accessible checkbox; stage toggles expose state', async ({ page }) => {
    await mockSupabase(page)
    await page.goto('/#whm')
    await page.locator('#whm-tab-checklist').click()
    const panel = page.locator('#whm-panel-checklist')
    const box = panel.getByRole('checkbox').first()
    await expect(box).toHaveAttribute('aria-checked', 'false')
    await box.focus(); await page.keyboard.press('Enter')
    await expect(box).toHaveAttribute('aria-checked', 'true')
    await box.click()
    await expect(box).toHaveAttribute('aria-checked', 'false')
    const stage = panel.locator('button[aria-expanded]').first()
    const before = await stage.getAttribute('aria-expanded')
    await stage.click()
    await expect(stage).toHaveAttribute('aria-expanded', before === 'true' ? 'false' : 'true')
  })

  test('FAQ items expand and collapse', async ({ page }) => {
    await mockSupabase(page)
    await page.goto('/#whm')
    await page.locator('#whm-tab-faq2026').click()
    const panel = page.locator('#whm-panel-faq2026')
    const q = panel.locator('button[aria-expanded]').first()
    // The default category may hold only notices; find one with questions.
    const cats = panel.locator('button:not([aria-expanded])')
    for (let i = 0; i < (await cats.count()) && (await q.count()) === 0; i++) await cats.nth(i).click()
    await expect(q).toHaveAttribute('aria-expanded', 'false')
    await q.click(); await expect(q).toHaveAttribute('aria-expanded', 'true')
    await q.click(); await expect(q).toHaveAttribute('aria-expanded', 'false')
  })
})

test('placeholder reviews are never rendered', async ({ page }) => {
  await mockSupabase(page)
  await page.goto('/')
  await expect(page.locator('body')).not.toContainText('[ชื่อผู้รีวิว')
  await expect(page.locator('body')).not.toContainText('[วางข้อความรีวิว')
})
