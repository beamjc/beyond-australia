import { defineConfig, devices } from '@playwright/test'

// Local QA harness. Supabase points at an unreachable local URL with a dummy
// key; e2e tests that need content intercept those requests with mock
// fixtures (see tests/e2e/fixtures.ts). Mocked results are NOT proof of live
// integration or RLS behaviour.
const PORT = 3100
const MOCK_SUPABASE_URL = 'http://127.0.0.1:54321'

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 60_000,
  fullyParallel: true,
  reporter: [['list']],
  use: {
    baseURL: `http://127.0.0.1:${PORT}`,
    trace: 'retain-on-failure',
    timezoneId: 'Asia/Bangkok',
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } } },
    { name: 'tablet', use: { ...devices['Desktop Chrome'], viewport: { width: 768, height: 1024 }, hasTouch: true } },
    { name: 'mobile', use: { ...devices['Pixel 7'], viewport: { width: 390, height: 844 } } },
  ],
  webServer: {
    command: `npm run build && npx next start -p ${PORT}`,
    url: `http://127.0.0.1:${PORT}`,
    timeout: 300_000,
    reuseExistingServer: !process.env.CI,
    env: {
      NEXT_PUBLIC_SUPABASE_URL: MOCK_SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: 'qa-dummy-anon-key',
      NEXT_TELEMETRY_DISABLED: '1',
    },
  },
})
