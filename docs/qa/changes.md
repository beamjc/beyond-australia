# Change log — QA pass 1 (2026-09-23)

Branch: `claude/tender-tesla-7g4bgt`. Nothing merged or deployed.

## Rule change

- **CLAUDE.md**: added "Thai copy review gate". Thai wording is no longer changed autonomously; suggestions go to `docs/qa/thai-review-<feature>.md` for the external Thai editor, and only approved wording is applied. Batch 1 = Budget Study Planner.

## Thai copy changes

**None applied.** Batch 1 suggestions (89 rows) are in `docs/qa/thai-review-budget-planner.md`, awaiting the editor. Representative suggestions (not live):

| ID | Current | Suggested | Why |
|---|---|---|---|
| BSP-051 | จำนวนเงินคร่าวๆที่ต้องใช้ | เงินก้อนแรกที่ต้องใช้ (ประมาณ) | The figure is only the first payment, not the total cost. |
| BSP-055 | คุณมีเงินเพียงพอแล้วที่จะสมัครเรียนได้ | งบนี้พอสำหรับเงินก้อนแรกแล้ว | Current text implies eligibility/financial capacity. |
| BSP-118 | อยากปรึกษาเพิ่มเติม? ติดต่อทีมงานของเราได้เลย | สอบถามผ่าน LINE | The link opens LINE; say so. |
| BSP-039 | ยังไม่เคยสอบ | ยังไม่สอบ | Fits the 52 px button on mobile without wrapping. |

## Code changes (non-copy — no visible text added or reworded)

| Area | Files | Change | Issue |
|---|---|---|---|
| Section reveal animation | `src/components/shared/RevealOnScroll.tsx` | Fade in as a section's top enters; never fade content that is on screen; CSS `motion-reduce:` override (JS toggle after hydration left `opacity: 0`, caught by the new test). | ISS-002 |
| Tabs | `src/components/whm/WHMSection.tsx`, `src/components/study/StudySection.tsx` | Keep panels mounted with `hidden`; ARIA tabs. | ISS-005, ISS-021 |
| Budget Planner | `src/components/study/BudgetStudyPlanner.tsx` | Budget stored once in AUD (no toggle drift); label/`id` associations; slider names from existing labels; `aria-pressed` on choices; `aria-expanded` on breakdowns; `type="button"`. | ISS-008, ISS-021 |
| Slider primitive | `src/components/ui/slider.tsx` | Forward `aria-label`/`aria-labelledby` to the focusable thumb. | ISS-021 |
| Financial Calculator | `src/components/study/FinancialCalculator.tsx` | Clamp negative fees/paid and dependant counts; associate labels. | ISS-007, ISS-021 |
| Study Options | `src/components/study/StudyOptionsForm.tsx` | "Next" requires a whole-number age 15–70; input named by its question. | ISS-020 |
| Visa Strength | `src/components/study/VisaStrengthAssessment.tsx` | `-400` → `-700` text shades; slider names; end-label colours follow risk (not side). Scoring weights unchanged. | ISS-021 |
| Postcode Checker | `src/components/whm/PostcodeChecker.tsx` | `aria-label` using the existing placeholder text. | ISS-021 |
| Checklist / FAQ | `src/components/whm/ChecklistSection.tsx`, `FAQ2026.tsx` | `aria-expanded`; ticks are `role=checkbox` with the item name and a larger hit area. | ISS-021 |
| Reviews | `src/components/shared/ReviewsCarousel.tsx` | Do not render `[...]` placeholder reviews. | ISS-004 |
| Home events | `src/components/shared/EventsSection.tsx` | Upcoming preview filters to ongoing or today-onwards. | ISS-006 |
| Articles | `src/app/articles/page.tsx`, `[slug]/page.tsx`, `src/components/articles/ArticleCard.tsx` | Null-safe `tags`; "Back to Articles" links to `/articles`. | ISS-009, ISS-014 |

## Tooling

- `package.json`: `test` (Vitest) and `test:e2e` (Playwright) scripts; dev deps `@playwright/test@1.56.1` (matches the preinstalled Chromium), `vitest@3.2.7`. Lockfile updated with npm.
- `playwright.config.ts`: builds and serves the app on :3100 with a **dummy** Supabase URL/key; desktop 1440, tablet 768, mobile 390 projects; `Asia/Bangkok` timezone.
- `vitest.config.ts`, `tests/unit/*` (engine + postcode), `tests/e2e/*` (fixtures + public journeys).
- `.eslintrc.json` (`next/core-web-vitals`, `react/no-unescaped-entities` off). Note: this makes `next build` run lint; it now passes.
- `.gitignore`: Playwright output folders.

## 2026-09-24 — Grant-rate data update (owner-approved)

- `src/lib/CalculationEngine.ts`: `sectorRates` updated to Home Affairs BP0015, Thai citizens, primary applicants, 1 Sep 2025 – 31 Aug 2026 (HE 94.6/93.4, ELICOS 51.7/87.3, VET 23.8/63.4 offshore/onshore); added `GRANT_RATE_PERIOD` and source comment. Age multipliers unchanged.
- Unit test guards the recorded values; `scripts/qa/grant_rates_thailand.py` recomputes them from the latest 12 months of any new BP0015 file.
- Visible label change ("average approval rate … not a prediction") is approved in principle; Thai wording waits for the editor (BSP-074).
