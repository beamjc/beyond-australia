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

## 2026-09-24 — Official rates by age group (owner-approved)

- New generated data file `src/data/grantRates.ts` (BP0015, Thai primary applicants, 1 Sep 2025 – 31 Aug 2026): average + six age groups per course type/location, with decision counts.
- `CalculationEngine.ts`: removed hand-made `ageMultiplier` and unused `trend` values; new `grantRateFor()` returns the age-group rate (≥ 30 decisions) or the all-ages average, clamped 8–98 %; results carry `ageSpecific` for the future label.
- Example changes a visitor will see: University from Thailand age 32: 73.0 → **84.5**; Vocational in Australia age 42: 36.2 → **22.1**; English from Thailand age 22: 62.9 → **61.5**.
- Unit tests cover lookup, fallback, clamp and age boundaries. Label text still waits for the Thai editor (BSP-074).

### Follow-up 2026-09-24 — small groups use the old method

- Owner: for age groups with < 30 decisions, keep the old calculation (all-ages average × original age factor) rather than the plain average. `ageMultiplier` restored for this fallback only. Example: University from Thailand, age 37: 94.6 → **56.8**.


# Owner-requested changes — 2026-09-25

Branch: `qa/study-tools-redesign` (from `main` @ 646194a). Nothing merged or deployed.

## Budget Study Planner — one university card

- Owner request: Bachelor and Master show **one** university card instead of Affordable / Good Quality / Go8 cards, priced at an average, with a note that fees depend on faculty and university.
- `src/lib/CalculationEngine.ts`: the three `he-*` tiers are replaced by `he-avg`. Annual tuition = mean of the former tier midpoints (30,000 + 40,000 + 55,000) / 3 = **$41,667**. `PathwayTier.annual` (optional) overrides the low/high midpoint; VET tiers are unchanged. Duration still comes from the degree choice (3 years bachelor, 2 years master). Grant-rate figures were already identical for all university tiers.
- `src/components/study/BudgetStudyPlanner.tsx`: the university card spans the full result width, the title reuses the existing ปริญญาตรี / ปริญญาโท labels, and it shows the owner's note verbatim (BSP-130). A polished version and an optional "average per year" line are in `thai-review-budget-planner.md` (BSP-130, BSP-131) for the editor.
- Example (bachelor, offshore, IELTS 5.0, $250/wk): before, first payment $27,329 / $32,329 / $39,829 across three cards; after, one card at **$33,163** (English $7,500 + 50% deposit $20,833.50 + visa $2,000 + OSHC $2,829.17).
- Tests: `tests/unit/calculationEngine.test.ts` now checks the `he-avg` figures (derived above), that only one university tier exists, and that VET tiers still use the midpoint.

## Visa Readiness Check (replaces the Visa Strength Assessment layout)

- Owner brief: turn the "risk calculator" into an "application readiness assistant"; do not change the assessment logic.
- **Logic unchanged**: 8 factors, weights (1, 1.2, 1.3, 1, 1.5, 1, 0.8 inverted, 1.1 inverted), weighted risk formula, per-factor thresholds (≤33 / ≤66) and verdict bands (≤20 / ≤40 / ≤55 / ≤75) moved as-is into `src/lib/visaReadiness.ts`, with unit tests. The only presentation change: the headline shows **readiness = 100 − risk score**.
- **Flow**: the sliders were both the input and the "result". Now: step 1 = 8 compact slider questions → "ดูผลความพร้อม"; step 2 = result with no sliders (summary + 3 counts, top-3 priority card, grouped accordions — high open by default, empty groups hidden — and a final plan + consultation CTA). "แก้ไขคำตอบ" returns to step 1 with answers kept. Focus moves to the result heading; scrolling honours reduced motion.
- **Content is data**: all copy (EN + TH), factor results per level, explanations, checklists and actions live in `src/data/visaReadiness.ts`; components only render. Components: `AssessmentQuestions`, `AssessmentSummary`, `AssessmentPriorityActions`, `AssessmentGroup`, `AssessmentFactorRow`, `AssessmentFactorDetail`, `AssessmentActionPlan` (`src/components/study/readiness/`).
- **Bilingual**: the tool now follows the EN/TH switch (was English-only, ISS-001). Tab label: "เช็กความพร้อมก่อนยื่นวีซ่า" / "Visa Readiness Check".
- **Thai**: owner-supplied text applied verbatim; 92 draft strings listed in `thai-review-visa-readiness.md` for the editor (review gate).
- Consultation links unchanged (`SITE_URL`, `LINE_URL`, now exported from `BSCConsultationCTA`).

| Before | After |
|---|---|
| "Higher Risk" red card, score "61 /100 risk" | "คะแนนความพร้อม 39 / 100", "มีหลายจุดที่ควรเตรียมเพิ่มเติม" (neutral card; colour only on dots/badges) |
| "Low / Medium / High risk" chips | ไม่มีข้อกังวลเด่นชัด / ควรเตรียมข้อมูลเพิ่มเติม / ควรตรวจสอบเป็นพิเศษ |
| English disclaimer | Owner's Thai disclaimer, small and neutral |

## Savings planner — one calculator

- Owner brief: one savings planner, visa type as an input; Thai-first layout; do not change the calculation or tax logic.
- **What differed between the old WHM / Student modes** (checked in code before refactoring): only (1) the tax function — WHM scale vs resident scale, (2) the work-rights info box, (3) the student-only warning when the income needs > 48 h/fortnight at minimum wage. Goal, currency, FX, duration, income, expenses, the savings maths and the result layout were already shared.
- `src/lib/savings.ts`: the unchanged tax functions behind `calculateTax({ visaType, annualIncome })`, a shared `computeSavingsPlan`, and `requiredGrossIncome` (owner's optional "income needed" line — bisection on the same tax function, exact to the dollar; unit-tested). Unit tests in `tests/unit/savings.test.ts` use hand-derived figures.
- UI: `SavingsCalculator.tsx` + `savings/` (`SavingsGoalInput`, `DurationSelector`, `VisaTypeSelector`, `IncomeSelector`, `ExpenseSelector`, `SavingsResult`, `SavingsConsultationCTA`). Order: goal → duration → visa → income → expenses → result → CTA → share; result sits beside the inputs on desktop (sticky only on screens ≥ 1000 px tall so it is never cut off). Switching visa type changes only the tax figures, tax note, work-rights note and student-hours check — nothing resets.
- Status box replaces the red-bordered panel: neutral result card; green/red only in the status area and the gap figure. The owner's status body and personal summary were combined into one sentence block to avoid repeating the same numbers twice; "ลองปรับแผน" and the quick actions were combined (buttons scroll to and focus the matching input). "เพิ่มระยะเวลา" is hidden when 3 years is already selected or the goal is reached.
- Bugs fixed: ISS-032 (currency toggle changed the goal), ISS-033 (FX "last updated" was always today).
- CTA: "ปรึกษาฟรีทาง LINE" → existing LINE URL; "ดูบริการของเรา" → the site's `#services` section. Share buttons now secondary (outline), same URLs and message.
- Example (WHM, A$60,000, A$2,000/month, ฿1,000,000, 1 year): tax A$11,250, take-home A$48,750, savings A$24,750, still short A$18,728, income needed A$86,755. Student Visa: tax A$8,788, savings A$27,212.

## Planning hub: Study Pathway Finder + Visa Options Explorer

- **IA / navigation**: Study section eyebrow "เส้นทางการศึกษา" → "วางแผนเส้นทางไปออสเตรเลีย" (EN "Plan your pathway to Australia"). Tab "ทางเลือกการเรียน" → "วางแผนเส้นทาง" (tab id `options` kept). Nav item "เส้นทางวีซ่า" → "วางแผนเส้นทาง" linking to `#plan`; hero "Explore Visa Pathways" → `#plan`. The separate Visa Pathway Finder section was removed from the home page; `/#visa-pathway` still works and opens the explorer. Removed: `src/components/visa/VisaPathwaySection.tsx`, `src/components/study/StudyOptionsForm.tsx`.
- **Hub** (`src/components/plan/PlanningPathwayHub.tsx`): landing with two cards; both tools stay mounted, so answers survive switching. Compact tool header (← back to hub, tool name, "คำถาม X จาก Y" + bar); no hero per step, no breadcrumbs.
- **Connections**: study result → "กำลังวางแผนเรื่องวีซ่าด้วย?" opens the explorer on the Student branch; explorer Student results → Study Finder; "Related tools" (2–3) open the planner, cost/savings calculators, readiness check or universities tab. Neither tool requires the other.
- **Old Study Options logic** (for the record): 8 questions, then an if/else list — low English → ELICOS; "Migrate permanently" → skilled-list courses and (age > 30) a points warning; lowest budget → "VET from ~A$6,000/year… strong visa pathway outcomes"; age 18–30 with some English → "eligible for a WHM visa… stepping stone". No pathway was ranked.
- **New Study Finder logic** (`src/lib/studyFinder.ts`): three scores (ELICOS / VET / University) built only from English, course interest, goals and qualification with the owner's weights (`src/data/studyFinder.ts`); age and city have no weight; "study and work in Australia" adds no weight (context note + visa step only). Top two within 1 point → shown as two similar options. Budget is a constraint note, never a score change (Profile E stays University). Reasons list only answers that added weight to the pathway shown. Profiles A–E and tie/age/city rules are unit-tested.
- **Old Visa Pathway tree** (for the record): 18 nodes starting with "employer willing to pay ≥ A$76,515"; results included "You're competitive!", "You're on a strong path", "Fastest to PR", WHM/Student "stepping stone", "study a new field to qualify"; one generic Home Affairs link on "info" results only.
- **New explorer** (`src/data/visaExplorer.ts`, `src/lib/visaExplorer.ts`): situation-first start question; WHM (age, passport, goal), Student (plan → study-linked results), Skilled (list → points, never a dead end: "เช็ก Skilled Occupation List" + "กลับมาทำต่อ"), Employer (status → role match → checks), Not sure → comparison of 4 options. Every result: summary, why (from the choices made), what to check, actions, related tools, official sources. Migration topics point to a qualified adviser (OMARA register), not BSC; study topics show the BSC LINE CTA. Tree integrity, sources and banned phrases are unit-tested.
- Auto-advance after a 200 ms selected state on single-choice questions (not on the last Study question); Back keeps earlier answers.
