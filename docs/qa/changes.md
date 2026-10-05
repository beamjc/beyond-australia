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

## Owner decisions applied — 2026-09-26

- **Tax (checked on ato.gov.au):** tables moved to `src/data/taxRates.ts` with source and date. Student Visa now uses the **2026–27 resident** rates (15% on $18,201–45,000; was 16% in 2025–26). WHM keeps the **2025–26** table, the latest the ATO has published (15% on the first $45,000). The footnote names the year per visa type. Example at A$60,000: Student tax A$8,788 → **A$8,520**; WHM unchanged at A$11,250.
- **FX:** one planning rate, **23.5 THB per AUD**, for the Budget Planner (was 23.48) and the Savings planner (was 23). ฿800,000 → A$34,043; ฿1,000,000 → A$42,553.
- **Study Finder CTA:** "ดูหลักสูตรที่เหมาะกับฉัน" → **"ติดต่อปรึกษาเราได้เลย"**, linking to the Beyond Study Center inquiry page. The consultation card below keeps LINE only (no duplicate website button).
- **Skilled result title:** "คุณสมบัติครบตามเกณฑ์คะแนนขั้นต่ำของ Points Test" (owner's "คุณสมบัติครบ", limited to the points minimum; the summary still says an invitation depends on other factors).
- **Visa facts:** WHM 462 age 18–30 and the 65-point pass mark are now marked VERIFIED; student work hours verified (no code change).

## Home page sections and owner copy — 2026-10-01

Thai and English wording below was given directly by the owner (owner-directed, not a Claude suggestion), so it was applied without the external editor batch.

- **Section backgrounds:** home sections now alternate white (`--card`) and tinted (`--muted`) via `data-band` attributes and rules in `src/app/globals.css`. Events and Articles render nothing when empty, so the bands after Study are resolved with `:has()` to keep the alternation unbroken. Checked in the browser with both present: services white → WHM tint → study white → events tint → articles white → proof tint → CTA (blue).
- **Proof section** (`ProofStatsSection.tsx`): removed eyebrow "ได้รับความไว้วางใจทั่วประเทศ", title "ตัวเลขจริง ความน่าเชื่อถือจริง" and subtitle "สนับสนุนโดย Beyond Study Center พาร์ทเนอร์ด้านการศึกษาที่ได้รับใบอนุญาต" → title **"ต้องการคำปรึกษาเพิ่มเติม ติดต่อเรา"**, subtitle **"Beyond Study Center"** (EN "Need more advice? Contact us"). The three highlights are now cards styled like the Services cards (alternating light/dark fills). The icons (`experience/founder/offices.png`) had a fake checkerboard baked into the pixels; it was removed (real transparency) and the images were trimmed to 512 px.
- **CTA banner** (`CTABanner.tsx`): removed "ถึงเวลาเริ่มต้นเส้นทางสู่ออสเตรเลียของคุณ", the QEAC subtitle and both trust lines (QEAC licence numbers, "ช่วยคนไทยมากว่า 15 ปี") → **"ต้องการปรึกษาเพิ่มเติม ติดต่อเราได้เลย"** (EN "Need more advice? Get in touch"), with the `planning_with_beyond.png` artwork on the left (above the heading on mobile). Button and destination unchanged.

## WHM Timeline in Thai + WAH → WHM — 2026-10-01

Thai wording below was supplied directly by the owner (owner-directed), so it was applied as given without the external editor batch.

- **Timeline** (`TimelineSection.tsx`): all visible text was hard-coded English, so Thai visitors saw English. UI strings moved to `whm.timeline.*` in `src/i18n/translations.ts`; step data (dates, titles, descriptions, alerts) is now `{ en, th }` in the component. English wording unchanged.
  - Before (TH mode): "WHM Timeline" / "Preparation Countdown" / "Quota Selection Day" → after: "ไทม์ไลน์ WHM" / "นับถอยหลังเตรียมตัว" / "วันกดโควตา".
  - Owner's bold emphasis kept ("ก่อนวันกดโควตา", "หนังสือรับรองจากรัฐบาล (Government Support Letter)") via `**…**` markers; alert lines are now semi-bold in both languages.
  - Date picker and chosen date use the Thai date-fns locale in TH mode (Gregorian year, matching the owner's copy).
  - Screenshots: `screenshots/tl-th-desktop.png`, `screenshots/tl-th-mobile.png`.
- **WAH → WHM** (owner request): 9 visible strings in `BudgetStudyPlanner.tsx` (e.g. "ค่าวีซ่า WAH" → "ค่าวีซ่า WHM", "Working Holiday (WAH)" → "Working Holiday (WHM)") and 2 in `FAQ2026.tsx` ("Timeline & ภาพรวม WAH 2026" → "… WHM 2026"). Brand name "ThaiWAHClub" left unchanged.
- Not changed (open): FY 2026 dates are all past as of 2026-10-01 — cards 2–3 are still highlighted as current and the countdown picker disables every date. Needs the FY 2027 schedule from DCY.
- **Follow-up (owner request):** removed the "current step" highlight from FY 2026 — Username/Password Registration and Prepare Everything changed from `action` to `complete` (Quota Selection Day, also past, set to `complete`). No card is highlighted now; the dates and text are unchanged.
- **Follow-up (owner request):** Preparation Countdown box (นับถอยหลังเตรียมตัว) hidden via `SHOW_COUNTDOWN = false` in `TimelineSection.tsx`; code and translations kept so it can be turned back on with the FY 2027 dates.

## Budget Study Planner visual refresh — 2026-10-02 (branch `qa/budget-planner-visual`)

Owner-requested UI polish with the supplied illustrations. Layout/styling only: no calculation, state or copy changes, and no new visible Thai text (all artwork is decorative with `alt=""`).

- **Assets:** the 7 PNGs in `public/icons/` (0.4–1 MB each) were trimmed of transparent padding, resized and saved as WebP with alpha in `public/images/budget-planner/` (≈180 KB total). The originals were left untouched and are not referenced.
- **Header:** tinted panel with `graduation_flight_to_sydney` on the right (md+) or below the text (mobile, 200px wide).
- **Inputs:** goal cards get small category icons (English → book/globe, vocational → briefcase, bachelor/master → cap/diploma, short course → clock/book) and a check mark when selected; the icon stacks above the title below 440px so Thai titles don't wrap mid-word. Location and currency are now segmented controls; IELTS buttons use a 3-column grid (6 on tablet) with 40px+ targets; value chips for age and ELICOS price; more spacing between sections.
- **Summary card:** gauge kept as the focus; wallet icon beside "จำนวนเงินคร่าวๆที่ต้องใช้"; larger amount; subtle sky tint.
- **Result cards:** the upfront amount comes first, then total tuition and duration as two tiles. The old "ค่าเรียนทั้งหมด: X (3 ปี · วีซ่า ~N เดือน)" line was split into the tiles: same words, without the colon/brackets. The tuition note, the risk block and then the breakdown toggle follow. The toggle is now a full-width 40px row; the breakdown box has a border. Hover-lift animation removed from non-clickable cards.
- **CTA:** `BSCConsultationCTA` gained an optional `illustration` prop (used only by the planner): warm tint, text and buttons on the left, `friendly_student_advising_session` on the right (below on mobile), 44px buttons. Other callers are unchanged.
- **Shared slider** (`ui/slider.tsx`, affects all tools): the track was mid-blue under a navy range (low contrast); it is now `primary/15`. The thumb has a shadow and a slight hover scale (motion-safe only).
- Dark mode: line art sits on a light tile/plate so the dark outlines stay visible.
- Checks: `tsc` clean; 62/62 Vitest; lint with no new warnings; `next build` OK; Budget Planner e2e 15/15 (desktop/tablet/mobile); no horizontal overflow at 1440/768/390 for the English, degree and short-course goals. Screenshots are in `screenshots/budget-planner-visual/`.

## Onshore Student visa checker + owner removals — 2026-10-04/05 (branch `qa/onshore-student-visa-checker`)

All Thai and English wording below was **supplied by the owner** in the request, so it was applied as given without the external editor batch. No calculation changes.

- **Visa rule alert** (`OnshoreStudentVisaCheck.tsx` → `VisaRuleAlert`) is a compact pale-blue card below the planner header. It has a badge ("อัปเดตกฎวีซ่า • 2 ต.ค. 2569"), a shield icon, a headline, a description, and an outline CTA "เช็กว่าฉันยื่น Onshore ได้ไหม". The CTA selects "ออสเตรเลีย", scrolls to the selector and focuses the checker. The source line links to the Home Affairs "Applying … while in Australia" page.
- **Eligibility panel** appears under "ยื่นวีซ่าจากที่ไหน" only when "ออสเตรเลีย" is selected; it expands by height and opacity, with no animation under reduced motion. Questions are shown one at a time: current visa, then the study plan (Student 500 only), then the result. Earlier answers show as a small summary. "แก้ไขคำตอบ" returns to the visa question with the previous choices still highlighted. Focus moves to each new step's heading. Answers are kept in the planner's state, so they survive the language switch, Thailand/Australia toggles and tab switches. Nothing is sent or stored.
- **Result tones:** must/generally offshore → amber (plane icon); may be eligible → primary blue (badge icon), not green, so it doesn't read as an approval; further assessment → neutral grey with a LINE CTA. No red, and no "not eligible" wording. A disclaimer sits under every result. The Thai-applicant ASEAN note is collapsed by default at the bottom of the panel, in both languages.
- **Freshness badge:** "อ้างอิงข้อมูลจากเดือนกันยายน 2569" → "อัปเดตข้อมูลล่าสุด ตุลาคม 2569" / "Last updated October 2026". The month and year come from `PLANNER_DATA_UPDATED` (`src/data/studyVisaRules.ts`). The rule date is `STUDENT_VISA_ONSHORE_RULE.effective`. Both are formatted by `src/lib/plannerDates.ts` (fixed month names, Buddhist Era year in Thai).
- **Logic:** `src/lib/onshoreStudentVisa.ts` (pure). Expected outcomes come from Home Affairs (FC-28–FC-31).
- **Owner removals (2026-10-05):**
  - Visa Readiness (เช็กความพร้อมก่อนยื่นวีซ่า): removed the "อยากปรึกษาเรื่องเรียนต่อออสเตรเลีย? / ปรึกษาฟรี" banner.
  - Savings planner (วางแผนเงินเก็บในออสเตรเลีย): removed the "ไม่แน่ใจว่าควรวางแผนงบเท่าไหร่?" card and the "แชร์ผลคำนวณ" LINE/Facebook share block. Deleted `SavingsConsultationCTA.tsx`, `SavingsShareButtons.tsx` and their copy keys. The result card now fills the right column on its own.
  - Study tab "คำนวณค่าเรียน" (Financial Calculator) is **hidden, not deleted**, via `HIDDEN_STUDY_TABS` in `src/components/plan/shared.tsx`. Planning-hub "related tools" and the explorer's "คำนวณค่าเรียน" action are hidden while the tab is hidden. Its e2e tests are `describe.skip` with a re-enable note.
- **Checks:** `tsc` clean; Vitest 70/70 (8 new); lint has only the 4 pre-existing `<img>` warnings; `next build` and `opennextjs-cloudflare build` OK; Playwright **93 passed, 6 skipped** (Financial Calculator ×3 viewports), 0 failed, on desktop 1440 / tablet 768 / mobile 390 (emulation). Screenshots are in `screenshots/onshore-checker/`.

## Budget Planner: shorter input panel — 2026-10-05 (branch `qa/planner-compact-layout`)

Owner feedback: the left panel had become too long, so visitors scrolled up and down to finish a calculation. Layout and behaviour only. No new visible text and no calculation changes.

1. **"ยื่นวีซ่าจากที่ไหน" is now the last input** (after English course price). The onshore checker expands at the end of the card instead of pushing budget, age and IELTS below the fold.
2. **Floating summary bar** (`SummaryBar`). It appears while the inputs are on screen but the summary card is not (IntersectionObserver; 60% of the card visible counts as "in view"). It shows a coverage ring with %, "จำนวนเงินคร่าวๆที่ต้องใช้" and the amount (a range for short courses), plus an arrow towards the summary. Tapping it scrolls to the summary card. On mobile it sits to the left of the floating LINE/Facebook buttons; from 640 px up it is centred and 384 px wide. With reduced motion it appears without animation. It reuses existing strings ("ครอบคลุมงบประมาณ" is screen-reader only).
3. **Checker result collapses to one row:** status plus the selected answers ("Work and Holiday Visa (Subclass 462)"), with a chevron. Tapping it shows the explanation and any CTA. The intro paragraph and the separate answer summary are hidden once there is a result. The disclaimer and "แก้ไขคำตอบ" stay visible.

Panel height with the checker answered: desktop 1,637 → 1,401 px; mobile 1,902 → 1,628 px. The calculation inputs now come before the checker, so it no longer delays them. Screenshots: `screenshots/onshore-checker/compact-*.png`.

Checks: `tsc` clean; Vitest 70/70; lint has only the 4 pre-existing warnings; `next build` OK; Playwright 96 passed / 6 skipped (hidden calculator) on all three viewports, including the new test "location is the last input; summary bar…".

## Nav label: "วางแผนเส้นทาง" → "วางแผนเรียนต่อ" — 2026-10-05 (branch `qa/planner-compact-layout`)

Owner-supplied Thai wording, applied verbatim. `nav.visaPathways` (TH) in `src/i18n/translations.ts` changed from "วางแผนเส้นทาง" to "วางแผนเรียนต่อ". The header menu and the footer both read this key, so both update. The link target (`#plan`), the English label, and the Study tab "วางแผนเส้นทาง" (`study.tabs.options`) are unchanged.

## Consultation CTA: full name instead of "BSC" — 2026-10-05 (owner request, owner wording)

- `BSCConsultationCTA.tsx` ("ต้องการคำแนะนำจากผู้เชี่ยวชาญ?"): "เว็บไซต์ BSC" → **"เว็บไซต์ Beyond Study Center"**; "BSC Website" → **"Beyond Study Center website"**. Same destination.
- The longer label wrapped both buttons onto two lines at 1024–1440 px, where the text column sits beside the artwork. In the illustrated variant the buttons now stack at equal width from `md` (max 320 px) and don't wrap; they stay side by side at 640–767 px and stacked on phones. Screenshots: `screenshots/onshore-checker/cta-th-*.png`.
- Follow-up (owner request): the Study tab `study.tabs.options` (TH) also changed from "วางแผนเส้นทาง" to "วางแผนเรียนต่อ", so the menu label and the tab it opens now match. Tab id `options` is unchanged.

## Onshore CTA first click + Postcode Checker data — 2026-10-05

- ISS-042 `BudgetStudyPlanner.tsx`: the alert CTA now scrolls on the first click too. When the checker is still closed, the jump waits for the panel's first animation frame, after framer-motion has measured it and restored the scroll. Already-open and reduced-motion paths are unchanged. Regression: `tests/e2e/public.spec.ts` ("alert CTA selects Australia…") now asserts the heading is in the viewport.
- ISS-043 `postcodeData.ts`: bushfire QLD `[4515, 4519]` → `4515, [4517, 4519]`; added Norfolk Island `2899` to Regional Australia. Source and check date in the file header and FC-17. Regression tests in `tests/unit/postcode.test.ts`.
- `PostcodeChecker.tsx`: result headings show the postcode padded to 4 digits (872 → 0872). No wording change.
- Thai translation of the Postcode Checker: proposed only, in `thai-review-postcode-checker.md` (needs the Thai editor; PC-05/08/09 and IND-04 also change the English).
- ISS-044 Postcode Checker redesign (owner approved, English first): `postcodeData.ts` areas now have an `id` and `work` types; `checkPostcode` also returns `work` (each kind of work once, with the matched areas). `PostcodeChecker.tsx` lists work types with official examples, area/date tags, an "other jobs" row (incl. Home Affairs' current support-role flexibility) and the list date. Headings: "Postcode 4810 is eligible!" → "Work that counts at postcode 4810"; "is not eligible" → "is not in a specified work area". `aria-live` on the result. Screenshots `screenshots/postcode-checker/new-*.png` (before: `th-*.png`). Tests: unit (grouping) + e2e (each type once, no overflow).
- **Thai batch: Postcode Checker — owner-approved 2026-10-05 (not editor-reviewed; owner's decision).** `PostcodeChecker.tsx` now has `en`/`th` copy chosen by `useLanguage()` (closes the Postcode part of ISS-001). Thai is applied verbatim from `thai-review-postcode-checker.md`, with the intro alternative. English updated to match the owner's edits: `otherTitle` "Other jobs, like retail or office work" → "Other jobs"; `otherBody` drops "such as admin or cleaning". Before/after examples:
  - Heading, listed: (EN only) "Postcode 4810 is eligible!" → **"งานที่นับได้ใน Postcode 4810"** — a list match doesn't make every job count.
  - Heading, not listed: (EN only) "Postcode 2000 is not eligible" → **"Postcode 2000 ไม่อยู่ในพื้นที่ Specified Work"**.
  - Intro: (EN only) "…(subclass 462) extension." → **"ใส่ Postcode ของเมืองที่สนใจ เพื่อเช็กว่างานประเภทไหนสามารถยื่นวีซ่า Work and Holiday ปีที่ 2 หรือ 3 ได้"** — says what the tool checks; no "extension".
  - Left as the owner wrote them (flagged, not changed): tags "(Northern Australia)" / "(Regional Australia)" in brackets; "ฟื้นฟูหลังน้ำท่วม และพายุ" has a space before "และ".
  - e2e: Thai test (labels, headings, no overflow). Screenshots `screenshots/postcode-checker/th-new-*.png`.


## 2026-10-05 — Mobile & tablet usability pass

Phone/tablet-only layout changes (desktop pixel-identical); details and measurements in `docs/qa/mobile-tablet-pass.md`. Files: `StudySection.tsx`, `WHMSection.tsx`, `FloatingLineButton.tsx`, `FloatingFacebookButton.tsx`, new `hooks/use-hide-on-scroll-down.ts`, `SavingsCalculator.tsx` + new `savings/SavingsResultBar.tsx`, `TopUniversities.tsx`, `FAQ2026.tsx`, `savings/IncomeSelector.tsx`, `BudgetStudyPlanner.tsx` (toggle height only), `ui/slider.tsx` (thumb size below lg). No copy changes.
- Follow-up: Budget Planner step-by-step mode below lg (`BudgetStudyPlanner.tsx` `WizardHeader`/`WizardNav`; new DRAFT string "ดูผลการคำนวณ", BSP-143); navbar uses the hamburger menu below lg (`Navbar.tsx`).
