// LINE (LIFF) lead flow with MOCKED LINE SDK and MOCKED Edge Functions.
// Passing tests here show the website and LIFF page send and render the right
// data. They are NOT evidence that LINE login, the Edge Functions, or LINE
// messaging work live. Nothing is sent to LINE or Supabase.
import type { Page, Request } from '@playwright/test'
import { test, expect, mockSupabase, MOCK_SUPABASE, plannerShow, plannerResults } from './fixtures'

const FN = `${MOCK_SUPABASE}/functions/v1`
const LIFF_ID = '1234567890-QaTest01'
const DRAFT = 'd_QaDraftId1234567890ab'

/** Replaces LINE's SDK with a fake that is already logged in. */
async function fakeLiff(page: Page, opts: { inClient?: boolean } = {}) {
  await page.route('https://static.line-scdn.net/**', (route) =>
    route.fulfill({
      contentType: 'application/javascript',
      body: `window.__liffCalls = [];
        window.liff = {
          init: async (c) => { window.__liffCalls.push(['init', c.liffId]) },
          isLoggedIn: () => true,
          login: (o) => window.__liffCalls.push(['login', o && o.redirectUri]),
          logout: () => window.__liffCalls.push(['logout']),
          getIDToken: () => 'fake.id.token.for.qa.only.0123456789',
          isInClient: () => ${opts.inClient ?? true},
          closeWindow: () => window.__liffCalls.push(['close']),
        };`,
    }),
  )
}

const session = {
  profile: { name: 'Nong', picture: null },
  isFriend: false,
  returning: false,
  draft: { tool: 'budget-planner', summary: 'เป้าหมายการเรียน: เรียนภาษาอังกฤษ\nELICOS: 40 สัปดาห์' },
  prefill: { full_name: null, nickname: 'Nong', age: 26, visa_interest: 'student', phone: null, email: null, current_level: null, program_interest: 'English course', intake: null },
}

test.describe('LIFF lead form (/line)', () => {
  test.use({ lang: 'th' })

  test('shows the website answers, validates, and submits the draft ID with the form', async ({ page }) => {
    await fakeLiff(page)
    let sessionBody: Record<string, unknown> | null = null
    let submitReq: Request | null = null
    await page.route(`${FN}/liff-session`, async (route) => {
      sessionBody = route.request().postDataJSON()
      await route.fulfill({ json: session })
    })
    await page.route(`${FN}/submit-lead`, async (route) => {
      submitReq = route.request()
      await route.fulfill({ json: { ok: true, leadId: 'x', isFriend: true } })
    })

    await page.goto(`/line?d=${DRAFT}`)
    await expect(page.getByRole('heading', { name: 'สวัสดีค่ะ คุณNong' })).toBeVisible()
    expect(sessionBody).toEqual({ idToken: 'fake.id.token.for.qa.only.0123456789', draftId: DRAFT })
    expect(await page.evaluate(() => (window as unknown as { __liffCalls: unknown[] }).__liffCalls)).toContainEqual(['init', LIFF_ID])

    await expect(page.getByText('ELICOS: 40 สัปดาห์')).toBeVisible()
    await expect(page.getByRole('link', { name: /เพิ่มเพื่อนใน LINE/ })).toHaveAttribute('href', 'https://line.me/R/ti/p/@beyondstudy')
    await expect(page.locator('#program_interest')).toHaveValue('English course')
    await expect(page.locator('#nickname')).toHaveValue('Nong')
    await expect(page.locator('#age')).toHaveValue('26')
    await expect(page.locator('#visa_interest')).toHaveValue('student')

    // Empty submit: errors shown and linked, nothing sent.
    await page.getByRole('button', { name: 'ส่งข้อมูลให้ทีมที่ปรึกษา' }).click()
    await expect(page.locator('#full_name')).toHaveAttribute('aria-invalid', 'true')
    await expect(page.locator('#full_name')).toBeFocused()
    await expect(page.locator('#full_name-error')).toBeVisible()
    await expect(page.locator('#consent-error')).toBeVisible()
    // Owner request 2026-11-21: phone is optional, and there is no news/marketing checkbox.
    await expect(page.locator('#phone-error')).toHaveCount(0)
    await expect(page.locator('#phone')).not.toHaveAttribute('required', /.*/)
    await expect(page.locator('input[name="consent_marketing"]')).toHaveCount(0)
    await expect(page.getByText('รับข่าวสารและทุนการศึกษาทาง LINE')).toHaveCount(0)
    expect(submitReq).toBeNull()

    await page.locator('#full_name').fill('Nong Test')
    await expect(page.locator('#full_name-error')).toHaveCount(0)
    await page.locator('#phone').fill('081 234 5678')
    await page.locator('#intake').selectOption({ index: 1 })
    await page.locator('#consent_privacy').check()
    await page.getByRole('button', { name: 'ส่งข้อมูลให้ทีมที่ปรึกษา' }).click()

    await expect(page.getByRole('heading', { name: 'ได้รับข้อมูลแล้วค่ะ' })).toBeVisible()
    const body = submitReq!.postDataJSON()
    expect(body.draftId).toBe(DRAFT)
    expect(body.idToken).toBe('fake.id.token.for.qa.only.0123456789')
    expect(body.form).toMatchObject({ full_name: 'Nong Test', age: '26', visa_interest: 'student', phone: '081 234 5678', program_interest: 'English course' })
    expect(body.form.intake).not.toBe('')
    expect(body.consent).toEqual({ privacy: true })

    await page.getByRole('button', { name: 'ปิดหน้านี้' }).click()
    expect(await page.evaluate(() => (window as unknown as { __liffCalls: unknown[] }).__liffCalls)).toContainEqual(['close'])
  })

  test('age and visa are required; the course question only shows for a student visa', async ({ page }) => {
    await fakeLiff(page)
    let body: Record<string, any> | null = null
    await page.route(`${FN}/liff-session`, (r) => r.fulfill({ json: { ...session, draft: null, prefill: { ...session.prefill, age: null, visa_interest: null } } }))
    await page.route(`${FN}/submit-lead`, async (r) => { body = r.request().postDataJSON(); await r.fulfill({ json: { ok: true, isFriend: true } }) })
    await page.goto('/line')
    await expect(page.locator('#program_interest')).toHaveCount(0)
    await page.locator('#full_name').fill('Nong Test')
    await page.locator('#phone').fill('12')   // optional, but a malformed number is still caught
    await page.locator('#consent_privacy').check()
    await page.locator('#age').fill('12')
    await page.getByRole('button', { name: 'ส่งข้อมูลให้ทีมที่ปรึกษา' }).click()
    await expect(page.locator('#age-error')).toBeVisible()
    await expect(page.locator('#visa_interest-error')).toBeVisible()
    await expect(page.locator('#phone-error')).toBeVisible()
    expect(body).toBeNull()
    await page.locator('#phone').fill('')        // blank phone is fine

    await page.locator('#age').fill('22')
    await page.locator('#visa_interest').selectOption('student')
    await expect(page.locator('#program_interest')).toBeVisible()
    await page.locator('#program_interest').selectOption('Master')
    await page.locator('#visa_interest').selectOption('whm')
    await expect(page.locator('#program_interest')).toHaveCount(0)
    await page.getByRole('button', { name: 'ส่งข้อมูลให้ทีมที่ปรึกษา' }).click()
    await expect(page.getByRole('heading', { name: 'ได้รับข้อมูลแล้วค่ะ' })).toBeVisible()
    expect(body!.form).toMatchObject({ age: '22', visa_interest: 'whm', program_interest: '', phone: '' })
  })

  test('server-side field errors are shown on the matching fields', async ({ page }) => {
    await fakeLiff(page)
    await page.route(`${FN}/liff-session`, (r) => r.fulfill({ json: { ...session, isFriend: true } }))
    await page.route(`${FN}/submit-lead`, (r) => r.fulfill({ status: 422, json: { error: 'x', fields: { phone: 'invalid' } } }))
    await page.goto('/line')
    await page.locator('#full_name').fill('Nong Test')
    await page.locator('#phone').fill('081 234 5678')
    await page.locator('#consent_privacy').check()
    await page.getByRole('button', { name: 'ส่งข้อมูลให้ทีมที่ปรึกษา' }).click()
    await expect(page.locator('#phone-error')).toBeVisible()
    await expect(page.getByRole('heading', { name: 'ได้รับข้อมูลแล้วค่ะ' })).toHaveCount(0)
  })

  test('expired login re-logs in once instead of looping', async ({ page }) => {
    await fakeLiff(page)
    let calls = 0
    await page.route(`${FN}/liff-session`, (r) => { calls++; return r.fulfill({ status: 401, json: { error: 'expired' } }) })
    await page.goto('/line')
    await expect.poll(() => page.evaluate(() => ((window as unknown as { __liffCalls?: unknown[][] }).__liffCalls ?? []).map((c) => c[0]))).toContain('login')
    // Second load in the same tab (the fake login does not navigate): shows the error, no second login.
    await page.reload()
    await expect(page.getByRole('heading', { name: 'เปิดแบบฟอร์มไม่สำเร็จ' })).toBeVisible()
    expect(calls).toBe(2)
  })
})

test.describe('Budget Planner — LINE button with LIFF configured', () => {
  test.use({ lang: 'th' })

  async function toResults(page: Page) {
    await mockSupabase(page)
    await page.goto('/?utm_source=facebook&utm_campaign=qa#study')
    const panel = page.locator('#study-panel-courses')
    await plannerShow(page, panel.getByRole('button', { name: /เรียนภาษาอังกฤษ/ }))
    await panel.getByRole('button', { name: /เรียนภาษาอังกฤษ/ }).click()
    await plannerShow(page, panel.getByRole('button', { name: 'On Shore (ในประเทศออสเตรเลีย)', exact: true }))
    await panel.getByRole('button', { name: 'On Shore (ในประเทศออสเตรเลีย)', exact: true }).click()
    await plannerResults(page)
    await panel.getByRole('button', { name: /^40 สัปดาห์/ }).click()
    return panel.getByRole('link', { name: 'LINE: @beyondstudy' })
  }

  test('saves the answers as a draft and opens the LIFF form with only the draft ID', async ({ page, context }) => {
    const line = await toResults(page)
    let draft: Record<string, unknown> | null = null
    await page.route(`${FN}/save-draft`, async (r) => { draft = r.request().postDataJSON(); await r.fulfill({ json: { draftId: DRAFT } }) })
    await context.route('https://liff.line.me/**', (r) => r.fulfill({ contentType: 'text/html', body: '<p>liff</p>' }))

    const [popup] = await Promise.all([page.waitForEvent('popup'), line.click()])
    await popup.waitForURL(`https://liff.line.me/${LIFF_ID}?d=${DRAFT}`)

    expect(draft!.tool).toBe('budget-planner')
    const answers = draft!.answers as Record<string, unknown>
    expect(answers.summary).toContain('ELICOS: 40 สัปดาห์')
    expect(answers.program_interest).toBe('English course')
    expect(answers.visa_interest).toBe('student')
    expect(draft!.source).toMatchObject({ utm_source: 'facebook', utm_campaign: 'qa' })
    // The page itself stays on the site.
    expect(new URL(page.url()).pathname).toBe('/')
  })

  test('falls back to the normal LINE link if the draft cannot be saved', async ({ page, context }) => {
    const line = await toResults(page)
    await page.route(`${FN}/save-draft`, (r) => r.fulfill({ status: 500, json: { error: 'down' } }))
    await context.route('https://line.me/**', (r) => r.fulfill({ contentType: 'text/html', body: '<p>line</p>' }))
    const [popup] = await Promise.all([page.waitForEvent('popup'), line.click()])
    await popup.waitForURL(/^https:\/\/line\.me\//)
  })
})

test.describe('Answers from several tools are combined', () => {
  test.use({ lang: 'th' })

  test('postcode check + budget planner reach staff as one draft from any @beyondstudy LINE link', async ({ page, context }) => {
    await mockSupabase(page)
    let draft: Record<string, any> | null = null
    await page.route(`${FN}/save-draft`, async (r) => { draft = r.request().postDataJSON(); await r.fulfill({ json: { draftId: DRAFT } }) })
    await context.route('https://liff.line.me/**', (r) => r.fulfill({ contentType: 'text/html', body: '<p>liff</p>' }))

    await page.goto('/#whm')
    await page.locator('#whm-tab-postcode').click()
    const pc = page.locator('#whm-panel-postcode')
    await pc.getByRole('textbox').fill('4810')
    await pc.getByRole('button', { name: 'ตรวจสอบ' }).click()
    await expect(pc.getByText(/4810/).first()).toBeVisible()

    const line = await (async () => {
      const panel = page.locator('#study-panel-courses')
      await page.locator('#study-tab-courses').click()
      await plannerShow(page, panel.getByRole('button', { name: /เรียนภาษาอังกฤษ/ }))
      await panel.getByRole('button', { name: /เรียนภาษาอังกฤษ/ }).click()
      await plannerShow(page, panel.getByRole('button', { name: 'On Shore (ในประเทศออสเตรเลีย)', exact: true }))
      await panel.getByRole('button', { name: 'On Shore (ในประเทศออสเตรเลีย)', exact: true }).click()
      await plannerResults(page)
      return page.locator('footer a[aria-label="LINE"]')
    })()

    await line.scrollIntoViewIfNeeded()
    const [popup] = await Promise.all([page.waitForEvent('popup'), line.click()])
    await popup.waitForURL(`https://liff.line.me/${LIFF_ID}?d=${DRAFT}`)
    expect(draft!.tool).toBe('website-tools')
    expect(draft!.answers.tools_used).toEqual(['postcode-checker', 'budget-planner'])
    expect(draft!.answers.summary).toContain('Postcode 4810')
    expect(draft!.answers.summary).toContain('เป้าหมายการเรียน: เรียนภาษาอังกฤษ')
    expect(draft!.answers.visa_interest).toBe('student') // the planner was used last
  })

  test('with no answers yet, LINE links open the normal chat and nothing is saved', async ({ page, context }) => {
    await mockSupabase(page)
    let saved = false
    await page.route(`${FN}/save-draft`, async (r) => { saved = true; await r.fulfill({ json: { draftId: DRAFT } }) })
    await context.route('https://line.me/**', (r) => r.fulfill({ contentType: 'text/html', body: '<p>line</p>' }))
    await page.goto('/')
    const line = page.locator('footer a[aria-label="LINE"]')
    await line.scrollIntoViewIfNeeded()
    const [popup] = await Promise.all([page.waitForEvent('popup'), line.click()])
    await popup.waitForURL('https://line.me/ti/p/@beyondstudy')
    expect(saved).toBe(false)
  })
})
