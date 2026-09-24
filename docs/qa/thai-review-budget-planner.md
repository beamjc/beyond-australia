# Thai review — Batch 1: Budget Study Planner

**Status: AWAITING EXTERNAL THAI EDITOR REVIEW. Nothing in this file has been applied to the site.**

- Component: `src/components/study/BudgetStudyPlanner.tsx` (UI) and `src/lib/CalculationEngine.ts` (labels that come from data)
- Where: Home page → Study section → first tab "Course Finder" / "ค้นหาหลักสูตร" (`#study-panel-courses`)
- Line numbers: as of branch `claude/tender-tesla-7g4bgt`, 2026-09-23 (after the non-copy fixes in `docs/qa/changes.md`)
- Prepared: 2026-09-23

## How to review

For each row, mark one of: **OK** (use suggestion) / **EDIT** (write your wording) / **KEEP** (keep current Thai). Add a comment if needed.

- **English**: the planner has **no English version today** — it shows Thai even when a visitor picks EN (issue ISS-001). The English column is a *proposed* EN draft so both languages can be added together. Please check that the Thai and English say the same thing.
- **Variables** in `{braces}` are filled in by code. Keep them in the sentence; they may move.
- **Length**: "short" = must fit a small button or badge; limits below are measured from the screenshots at 390 px mobile width.
- Rows marked ⚠️ are not just wording: the current text makes a claim that is unsupported, inconsistent with the calculation, or needs an owner decision. They are also in `docs/qa/issues.md`.
- Money is formatted by code: THB as `฿800,000`, AUD as `$34,072`. The exchange rate the planner uses is **fixed at 1 AUD = 23.48 THB** (`DEFAULT_FX_THB_PER_AUD`) and is not shown to the visitor today (see BSP-035).

### What the visitor is doing

The visitor picks a study goal, where they will apply from, their budget, age and current IELTS score. The right side shows an estimate of the **first payment needed before/at the start of study** (not the whole cost) and cards that compare course levels. Nothing is submitted or saved.

## Screenshots

Mocked environment (local build, no real Supabase content — not relevant to this tool). Thai UI.

| View | Desktop 1440 px | Mobile 390 px |
|---|---|---|
| Bachelor (default) with breakdowns open | [desktop-01](screenshots/budget-planner/desktop-01-bachelor-default.png) | [mobile-01](screenshots/budget-planner/mobile-01-bachelor-default.png) |
| Learn English only (24/40 weeks) | [desktop-02](screenshots/budget-planner/desktop-02-english.png) | [mobile-02](screenshots/budget-planner/mobile-02-english.png) |
| Vocational, IELTS 4.5 (Level 1 note) | [desktop-03](screenshots/budget-planner/desktop-03-vet-low-ielts.png) | [mobile-03](screenshots/budget-planner/mobile-03-vet-low-ielts.png) |
| Short course, age 24 | [desktop-04](screenshots/budget-planner/desktop-04-short-age24.png) | [mobile-04](screenshots/budget-planner/mobile-04-short-age24.png) |
| Budget ฿150,000 (low-budget tip) | [desktop-05](screenshots/budget-planner/desktop-05-lowbudget-tip.png) | — |
| Short course, age 35 + Childcare (WHM not available) | [desktop-06](screenshots/budget-planner/desktop-06-short-age35.png) | — |

---

## A. Header

| ID | Source | Where / what the user is doing | English (proposed) | Current Thai | Suggested Thai | Variables / length |
|---|---|---|---|---|---|---|
| BSP-001 ⚠️ | BudgetStudyPlanner.tsx:131 | Small badge above the title; first thing seen | Figures as of {month year} | อ้างอิงข้อมูลจากเดือนกันยายน 2569 | ข้อมูลค่าใช้จ่าย ณ {เดือน ปี} | Short badge (~30 chars). ⚠️ Says September 2569, but the code's fees and grant-rate data are labelled March 2026 / 2025 values (`CalculationEngine.ts:7,46`). Owner to confirm the real "as of" date before any wording is chosen. **Owner decision 2026-09-24: leave this claim as it is — editor reviews wording only; do not change the meaning.** |
| BSP-002 | :133 | Tool title | Plan your study budget for Australia | วางแผนงบเรียนต่อออสเตรเลียเบื้องต้น | วางแผนงบเรียนต่อออสเตรเลีย | H3, one line on desktop; wraps to 2 lines on mobile — OK. "เบื้องต้น" moved to subtitle. |
| BSP-003 | :135 | Subtitle under title | A rough estimate of the money you need to get started, with a breakdown of each cost. | ประเมินเงินที่ต้องเตรียมในช่วงเริ่มต้น พร้อมดูรายการค่าใช้จ่ายแบบคร่าวๆ | ประมาณเงินก้อนแรกที่ต้องเตรียมก่อนเริ่มเรียน พร้อมรายละเอียดแต่ละรายการ (ยังไม่รวมค่าครองชีพและตั๋วเครื่องบิน) | 1–2 lines. Adds what is *not* included — the headline figure excludes living costs and flights, which a first-time visitor may assume are included. |

## B. Inputs — study goal

| ID | Source | Where / what the user is doing | English (proposed) | Current Thai | Suggested Thai | Variables / length |
|---|---|---|---|---|---|---|
| BSP-010 | :145 | Label above the 5 goal buttons | What do you want to study? | เป้าหมายการเรียน | อยากเรียนอะไร | Label, one line. |
| BSP-011 | :156 | Goal button title | English course | เรียนภาษาอังกฤษ | เรียนภาษาอังกฤษ | No change suggested. Button in 2-column grid: ≈150 px wide on mobile. |
| BSP-012 | :157 | Goal button sub-text | ELICOS course | หลักสูตร ELICOS | คอร์สภาษา (ELICOS) | ≤ 2 short lines at 12 px. |
| BSP-013 | :167 | Goal button title | Vocational (VET) | เรียนสายอาชีพ | สายอาชีพ (VET) | Short. |
| BSP-014 ⚠️ | :168 | Goal button sub-text | Usually needs IELTS 6.0 | IELTS ขั้นต่ำ 6.0 | ส่วนใหญ่ต้องใช้ IELTS 6.0 | Short. ⚠️ Entry scores are set by each provider; the code assumes 6.0 (`SECTOR_ENTRY_IELTS`). Softened so it is not read as an official minimum. UNVERIFIED — see factual-checks FC-06. |
| BSP-015 | :178 | Goal button title | Bachelor's degree | ปริญญาตรี | ปริญญาตรี | KEEP. |
| BSP-016 | :179 | Goal button sub-text | Usually IELTS 6.5 · about 3 years | ควรจะมี IELTS อย่างน้อย 6.5 ใช้เวลาเรียนประมาณ 3 ปี | ส่วนใหญ่ใช้ IELTS 6.5 · เรียนประมาณ 3 ปี | ≤ 2 lines at 12 px on mobile; current text wraps to 3–4 lines (see mobile-01). |
| BSP-017 | :189 | Goal button title | Master's degree | ปริญญาโท | ปริญญาโท | KEEP. |
| BSP-018 | :190 | Goal button sub-text | Usually IELTS 6.5 · about 2 years | ควรจะมี IELTS อย่างน้อย 6.5 ใช้เวลาเรียนประมาณ 2 ปี | ส่วนใหญ่ใช้ IELTS 6.5 · เรียนประมาณ 2 ปี | As BSP-016. |
| BSP-019 | :200 | Goal button title (full width) | Short course / skills | คอร์สระยะสั้น / เพิ่มทักษะ | คอร์สสั้น / เพิ่มทักษะ | Short. |
| BSP-020 ⚠️ | :201 | Goal button sub-text | For Work and Holiday visa holders, or fast-track courses | เหมาะสำหรับผู้ที่ถือวีซ่า WAH หรือต้องการเรียนคอร์ส Fast Track | เหมาะกับคนที่ถือวีซ่า Work and Holiday หรืออยากเรียนคอร์สเร่งรัด | ⚠️ "WAH" is not an official abbreviation and appears nowhere else on the site (nav says "Work and Holiday", other tools say "WHM"). Suggest one term site-wide: **Work and Holiday (462)**. Applies to every "WAH" row below. |
| BSP-021 | :213 | Amber tip shown when budget < ฿180,000 (clickable; switches goal to short course) | Budget under ฿180,000? Try Work and Holiday, or study on a visitor visa first | งบต่ำกว่า ฿180,000? ลองเส้นทาง WAH หรือเรียนด้วยวีซ่าท่องเที่ยวก่อน | งบไม่ถึง ฿180,000? ลองดูทางเลือก Work and Holiday หรือเรียนระยะสั้นด้วยวีซ่าท่องเที่ยว | 12 px bold, ≤ 2 lines. Threshold ฿180,000 is fixed in code (`:102`). Whole box is a button — text should read as an action. |
| BSP-022 | :216 | Tip sub-text | Earn, learn and experience Australia before committing to a full course. | หารายได้ เรียนรู้ และสัมผัสประสบการณ์ที่ออสเตรเลีย ก่อนตัดสินใจเรียนต่อแบบเต็มรูปแบบ | ได้ทั้งทำงาน เรียน และลองใช้ชีวิตที่ออสเตรเลีย ก่อนตัดสินใจเรียนต่อระยะยาว | 11 px, ≤ 2 lines. "ทำงาน" only applies to Work and Holiday, not visitor visa — acceptable because the tip names both; editor may prefer to split. |

## C. Inputs — location, budget, age, English

| ID | Source | Where / what the user is doing | English (proposed) | Current Thai | Suggested Thai | Variables / length |
|---|---|---|---|---|---|---|
| BSP-030 | :226 | Label above 2 location buttons | Where will you apply from? | ยื่นวีซ่าจากที่ไหน | จะยื่นวีซ่าจากที่ไหน | One line. |
| BSP-031 | :241 | Location button | Thailand | ประเทศไทย | ประเทศไทย | KEEP. Short. |
| BSP-032 | :241 | Location button | In Australia | ออสเตรเลีย | ในออสเตรเลีย | Short. Clarifies "applying while already in Australia". |
| BSP-033 | :250 | Label for budget input + slider | Your budget | งบที่เตรียมไว้ | งบที่มีตอนนี้ | Shares a row with the THB/AUD toggle: ≤ ~18 chars on mobile. |
| BSP-034 | :253–266 | THB / AUD toggle | THB / AUD | THB / AUD | THB / AUD | KEEP (currency codes). Buttons are 11 px — noted as a small-target issue in issues.md. |
| BSP-035 | :287 | Line under the slider showing the other currency | ≈ {amount} | ≈ {amount} | ≈ {amount} (1 AUD ≈ {rate} บาท) | `{amount}` = converted budget, `{rate}` = 23.48. Makes the exchange-rate assumption visible (BSP-073 alternative location). |
| BSP-036 | :294 | Label for age slider | Your age | อายุผู้สมัคร | อายุของคุณ | Shares a row with value `{age} ปี`. |
| BSP-037 | :296 | Age value | {age} years | {age} ปี | {age} ปี | KEEP. Range 15–50. |
| BSP-038 | :305 | Label above IELTS buttons (hidden for "English course") | Your current IELTS score (roughly) | ตอนนี้คะแนน IELTS คุณอยู่ที่ประมาณเท่าไหร่ | ตอนนี้ได้ IELTS ประมาณเท่าไร | One line on desktop, 2 on mobile OK. |
| BSP-039 | :35 | IELTS option (6-column grid) | Not taken | ยังไม่เคยสอบ | ยังไม่สอบ | **Very short**: button is ≈ 52 px wide on mobile; current text wraps to 2 lines. Other options are "4.5"…"6.5+" (numbers, no change). |
| BSP-040 ⚠️ | :328 | Amber note when IELTS 4.5 | With IELTS below 5.0, we recommend an Evidence Level 1 provider | ถ้า IELTS ต่ำกว่า 5.0 แนะนำให้เรียนกับโรงเรียน **Level 1** | ถ้า IELTS ต่ำกว่า 5.0 แนะนำให้เลือกสถาบันที่อยู่ในกลุ่ม **Level 1** (กลุ่มที่กรมตรวจคนเข้าเมืองจัดว่าความเสี่ยงต่ำ) | ≤ 3 lines. ⚠️ "Level 1" is unexplained jargon. Suggested explanation is UNVERIFIED (FC-07) — editor/owner to confirm what "Level 1" means here. Also: "ยังไม่สอบ" does not show this note, although the calculation treats it like 5.0 — see ISS-012. **Owner decision 2026-09-24: leave this claim as it is — editor reviews wording only; do not change the meaning.** |
| BSP-041 | :334 | Green note when IELTS meets entry score | Your English score already meets entry — no English course needed | ระดับภาษาอังกฤษคุณโอเคแล้ว! ไม่จำเป็นต้องเรียนภาษา | คะแนนภาษาของคุณถึงเกณฑ์แล้ว ไม่ต้องเรียนภาษาเพิ่ม | ≤ 2 lines. Less casual ("โอเคแล้ว!"), same meaning. |
| BSP-042 | :339 | Note when English is packaged | Suggested English course: {weeks} weeks at about ${weekly}/week | แนะนำให้เรียนภาษาเป็นระยะเวลา **{weeks} สัปดาห์** ราคาประมาณ ${weekly}/สัปดาห์ | แนะนำเรียนภาษาเพิ่ม **{weeks} สัปดาห์** ค่าเรียนประมาณ ${weekly} ต่อสัปดาห์ (AUD) | `{weeks}` = 10/20/30, `{weekly}` = 200–630. Adds currency (the `$` is AUD, not USD). |
| BSP-043 | :348 | Label for English-fee slider | English course fee | ค่าเรียนภาษา | ค่าเรียนภาษาต่อสัปดาห์ | Shares row with `${weekly}/สัปดาห์`. |
| BSP-044 | :350, :361, :362 | Slider value and min/max captions | ${n}/week | ${n}/สัปดาห์ | ${n}/สัปดาห์ | KEEP. 10 px captions. |
| BSP-045 | :369 | Footnote at bottom of the input card | All figures are estimates only. | ราคาที่แสดงเป็นแค่การประมาณเท่านั้น | ตัวเลขทั้งหมดเป็นการประมาณ ค่าใช้จ่ายจริงขึ้นอยู่กับสถาบันและวีซ่าของแต่ละคน | 11 px. |

## D. Results — headline summary card

| ID | Source | Where / what the user is doing | English (proposed) | Current Thai | Suggested Thai | Variables / length |
|---|---|---|---|---|---|---|
| BSP-050 | :478 | Text inside the circular gauge, above `{pct}%` | Your budget covers | ครอบคลุมงบประมาณ | งบของคุณครอบคลุม | **Must fit a 176 px circle** (~14 Thai chars at 12 px). The % is budget ÷ first payment, capped at 100. |
| BSP-051 | :380, :512, :887 | Label above the main amount (headline, pathway cards, short cards) | Estimated first payment | จำนวนเงินคร่าวๆที่ต้องใช้ | เงินก้อนแรกที่ต้องใช้ (ประมาณ) | One line. ⚠️ Current wording reads as "total money needed". The number is only English course + deposit + visa fee + OSHC (study) or English + course + visa fee (short). |
| BSP-052 | :389 | Caption under headline — short-course goal | Includes the Work and Holiday visa fee and {weeks} weeks of English | รวมค่าวีซ่า WAH และค่าเรียนภาษาเป็นเวลา {weeks} สัปดาห์ | รวมค่าวีซ่า Work and Holiday และค่าเรียนภาษา {weeks} สัปดาห์ | `{weeks}` 0–17. ⚠️ When age ≥ 31 the WHM card is hidden but the headline still shows WHM figures and this caption (ISS-010). A second caption is needed for that case: see BSP-053. |
| BSP-053 (new) | would sit at :389 | Caption under headline — short course, age ≥ 31 (visitor-visa figures) | Includes the visitor visa fee and {weeks} weeks of English | — (does not exist) | รวมค่าวีซ่าท่องเที่ยวและค่าเรียนภาษา {weeks} สัปดาห์ | Needed to fix ISS-010 without showing WHM numbers to people who cannot apply. |
| BSP-054 | :390 | Caption under headline — study goals | Includes deposit, student visa fee and OSHC{ and {weeks} weeks of English} | รวมค่ามัดจำ ค่าวีซ่านักเรียน ค่าประกัน OSHC{ และค่าเรียนภาษา {weeks} สัปดาห์} | รวมค่ามัดจำค่าเรียน ค่าวีซ่านักเรียน ประกันสุขภาพ OSHC{ และค่าเรียนภาษา {weeks} สัปดาห์} ยังไม่รวมค่าครองชีพและตั๋วเครื่องบิน | Optional part in `{…}` shown only when English weeks > 0. OSHC briefly explained as health insurance. |
| BSP-055 ⚠️ | :394, :946 | Green badge when budget ≥ first payment | Your budget covers the estimated first payment | คุณมีเงินเพียงพอแล้วที่จะสมัครเรียนได้ | งบนี้พอสำหรับเงินก้อนแรกแล้ว | Badge, one line on mobile (≤ ~30 chars). ⚠️ Current text implies the visitor can apply/has enough money. It ignores living costs and the separate **financial capacity evidence** for a student visa (Financial Calculator tab). |
| BSP-056 | :398 | Amber badge when budget is short | Short by {amount} | ยังขาดอยู่: {amount} | ยังขาดอีก {amount} | `{amount}` = formatted money. Short badge. |
| BSP-057 | :946 | Same, on short-course cards (no colon today) | Short by {amount} | ยังขาดอยู่ {amount} | ยังขาดอีก {amount} | Make identical to BSP-056. |

## E. Results — study pathway cards (VET / Bachelor / Master)

| ID | Source | Where / what the user is doing | English (proposed) | Current Thai | Suggested Thai | Variables / length |
|---|---|---|---|---|---|---|
| BSP-060 | :503 | Small caps line above the card title | Higher education / Vocational | เรียนระดับปริญญาตรีขึ้นไป / เรียนวิชาชีพ | ระดับมหาวิทยาลัย / สายอาชีพ (VET) | Uppercase style has no effect on Thai; keep short. "วิชาชีพ" vs "สายอาชีพ" (BSP-013) — use one term. |
| BSP-061 ⚠️ | CalculationEngine.ts:149–154 | Card titles (English only today) | Budget Diploma · Skilled (Standard) · Skilled (Premium) · Affordable University · Good Quality University · Go8 / Elite | (English shown to Thai visitors) | ดิพลอมาราคาประหยัด · สายอาชีพ (มาตรฐาน) · สายอาชีพ (พรีเมียม) · มหาวิทยาลัยค่าเรียนย่อมเยา · มหาวิทยาลัยคุณภาพดี · กลุ่ม Go8 / มหาวิทยาลัยชั้นนำ | Card title, ≤ 2 lines. ⚠️ Owner to confirm tier names; "Good Quality University" implies others are not. Suggested Thai keeps the English meaning. |
| BSP-062 ⚠️ | CalculationEngine.ts:149 | Badge on Budget Diploma card | No 485 pathway | (English) | ไม่ต่อวีซ่า 485 ได้ | Badge ≤ ~16 chars. ⚠️ Claim that budget diplomas never lead to a 485 visa is a legal/eligibility statement — UNVERIFIED (FC-08). **Owner decision 2026-09-24: leave this claim as it is — editor reviews wording only; do not change the meaning.** |
| BSP-063 ⚠️ | :514 | Line under amount | Total tuition: {amount} ({years} yrs · visa ~{months} months) | ค่าเรียนทั้งหมด: {amount} ({years} ปี · วีซ่า ~{months} เดือน) | ค่าเรียนตลอดหลักสูตร {amount} ({years} ปี · วีซ่าประมาณ {months} เดือน) | `{months}` can be fractional, e.g. **48.5** — code shows the decimal (ISS-013). Editor: is "48.5 เดือน" acceptable, or should code round? |
| BSP-064 | :525, :631, :902 | Expand/collapse toggle for breakdown | Cost breakdown | รายละเอียดค่าใช้จ่าย | ดูรายละเอียดค่าใช้จ่าย | Toggle link, one line. |
| BSP-065 | :539, :916, :645 | Breakdown row | English course | ค่าเรียนภาษา | ค่าเรียนภาษา | KEEP. |
| BSP-066 | :540, :646 | Breakdown sub-row | {weeks} weeks @ ${weekly} | {weeks} สัปดาห์ @ ${weekly} | {weeks} สัปดาห์ × ${weekly} | 10 px. "@" is unusual in Thai text. |
| BSP-067 ⚠️ | :544 | Breakdown row | First tuition payment (deposit) | ค่าเรียนเทอมแรก | ค่าเรียนงวดแรก (มัดจำ) | ⚠️ Value is 25% or 50% of the yearly fee, which is not necessarily one term. |
| BSP-068 | :545 | Sub-row under BSP-067 | {pct}% of {annual} | {pct}% ของ {annual} | {pct}% ของค่าเรียนต่อปี {annual} | `{pct}` = 25 or 50. Adds "per year" so the base is clear. |
| BSP-069 | :548, :649 | Breakdown row | Student visa fee | ค่าวีซ่านักเรียน | ค่าธรรมเนียมวีซ่านักเรียน | KEEP-able. Value is fixed $2,000 (FC-01). |
| BSP-070 | :549, :650, :928 | Breakdown row + sub | OSHC health insurance · {months} months | ค่าประกัน OSHC · {months} เดือน | ประกันสุขภาพนักเรียน (OSHC) · {months} เดือน | Explains OSHC. On short-course cards the value is always $0 and shown muted. |
| BSP-071 ⚠️ | :551, :652, :931 | Bold subtotal | Total first payment | ค่าใช้จ่ายที่ต้องจ่ายวันที่สมัครเรียน | รวมเงินก้อนแรก | ⚠️ Not all items are paid on one "application day" (deposit at enrolment, visa fee at lodgement, OSHC before the visa). |
| BSP-072 | :552, :655 | Muted row | Remaining tuition | ค่าเทอมที่เหลือ | ค่าเรียนส่วนที่เหลือ | Consistent with BSP-081. |
| BSP-073 | :553, :656 | Muted row | Total tuition | ค่าเรียนทั้งหมด | ค่าเรียนตลอดหลักสูตร | Same as BSP-063. (Exchange-rate note proposed at BSP-035.) |
| BSP-074 ⚠️ | :562 | Label in the coloured box at the bottom of each card, above `{rate}%` | *Owner decision needed* | เปอร์เซนต์ที่วีซ่าจะผ่าน | **Do not reword until owner decides.** If kept: อัตราอนุมัติโดยเฉลี่ยของกลุ่มที่คล้ายกัน (ไม่ใช่โอกาสของคุณเอง) | ⚠️ **High priority.** Label promises "the percentage your visa will pass". The number is a heuristic: a sector grant rate × an age multiplier (`CalculationEngine.ts:47–95, 207`), clamped 8–98 %, shown with one decimal. It is not the visitor's probability. Also misspelt (เปอร์เซ็นต์). See ISS-003 and FC-05. |
| BSP-075 ⚠️ | CalculationEngine.ts:101–108 | Badge next to BSP-074 | Low risk · Moderate · High risk · Critical risk | (English shown) | ความเสี่ยงต่ำ · ปานกลาง · ความเสี่ยงสูง · ความเสี่ยงสูงมาก | Badge 10 px. Same caveat as BSP-074. |

## F. Results — "Learn English only" goal

| ID | Source | Where / what the user is doing | English (proposed) | Current Thai | Suggested Thai | Variables / length |
|---|---|---|---|---|---|---|
| BSP-080 | :685 | Card heading | English course only | เรียนภาษาอย่างเดียว | เรียนภาษาอย่างเดียว | KEEP. |
| BSP-081 | :687–688 | Explanation | You can choose how many weeks to study. An English course doesn't require an IELTS score, but having one can strengthen your visa application by showing you are serious about improving your English. | เรียนจำนวนสัปดาห์ที่อยากเรียนได้เลย การเรียนภาษาไม่จำเป็นต้องใช้คะแนนสอบภาษาอังกฤษ เช่น IELTS แต่การมีคะแนนภาษาจะช่วยเพิ่มน้ำหนักและแสดงถึงความตั้งใจในการยื่นวีซ่าว่าเราต้องการมาพัฒนาภาษาจริงๆ | เลือกจำนวนสัปดาห์ได้ตามต้องการ คอร์สภาษาไม่บังคับต้องมีคะแนน IELTS แต่ถ้ามีคะแนนจะช่วยให้ใบสมัครวีซ่าน่าเชื่อถือขึ้น เพราะแสดงว่าคุณตั้งใจมาพัฒนาภาษาจริง | 12 px paragraph, ≤ 4 lines on mobile. |
| BSP-082 | :703 | Duration option title | {w} weeks | {w} สัปดาห์ | {w} สัปดาห์ | KEEP. `{w}` = 24 or 40. |
| BSP-083 | :705 | Option sub-text (24 wk) | Pay in full · about 6 months | ต้องจ่ายค่าเรียนเต็มจำนวน ใช้ระยะเวลาเรียนประมาณ 6 เดือน | จ่ายค่าเรียนเต็มจำนวน · เรียนประมาณ 6 เดือน | 11 px, ≤ 2 lines in half-width button. |
| BSP-084 ⚠️ | :705 | Option sub-text (40 wk) | Pay 50% upfront · about 10 months | จ่ายค่าเรียนครึ่งนึงก่อนได้ ใช้ระยะเวลาเรียนประมาณ 10 เดือน | จ่ายก่อน 50% ได้ · เรียนประมาณ 10 เดือน | ⚠️ "50% upfront for 40-week courses" is a business/provider assumption — owner to confirm. "ครึ่งนึง" is spoken style. **Owner decision 2026-09-24: leave this claim as it is — editor reviews wording only; do not change the meaning.** |
| BSP-085 | :600 | Card eyebrow | ELICOS | ELICOS | ELICOS | KEEP. |
| BSP-086 | :601 | Card title | {weeks}-week English course | ระยะเวลาเรียนคอร์สภาษาอังกฤษ {weeks} สัปดาห์ | คอร์สภาษาอังกฤษ {weeks} สัปดาห์ | One line. |
| BSP-087 | :604 | Badge (40-week card) | 50% deposit option | จ่ายก่อน 50% ได้ | จ่ายก่อน 50% ได้ | KEEP. Same caveat as BSP-084. **Owner decision 2026-09-24: leave this claim as it is — editor reviews wording only; do not change the meaning.** |
| BSP-088 | :610–611 | Stat label + value | Expected visa length · ~{months} months | ระยะเวลาของวีซ่าที่คาดว่าจะได้ · ~{months} เดือน | ระยะวีซ่าโดยประมาณ · ~{months} เดือน | Half-width stat label, ≤ 2 lines. |
| BSP-089 | :614 | Stat label | First payment | ค่าใช้จ่ายที่ต้องจ่ายครั้งแรก | เงินก้อนแรก | Half-width. Align with BSP-051/071. |
| BSP-090 | :621 | Amber line (40-week) | Remaining tuition {amount} | ค่าเรียนที่เหลือ **{amount}** | ค่าเรียนส่วนที่เหลือ **{amount}** (จ่ายภายหลัง) | 11 px. |
| BSP-091 | :645 | Breakdown row (40-week) | English course (50% now) | ค่าเรียนภาษา (จ่าย 50%) | ค่าเรียนภาษา (จ่ายก่อน 50%) | Row label. |

## G. Results — short course / skills goal

| ID | Source | Where / what the user is doing | English (proposed) | Current Thai | Suggested Thai | Variables / length |
|---|---|---|---|---|---|---|
| BSP-100 | :752 | Card heading | Short course / skills | คอร์สระยะสั้น / เพิ่มทักษะ | คอร์สสั้น / เพิ่มทักษะ | Same as BSP-019. |
| BSP-101 | :754 | Card intro | An option if you don't want to study a full degree | เป็นทางเลือกสำหรับนักเรียนที่ไม่ต้องการเรียนคอร์สปริญญา | ทางเลือกสำหรับคนที่ยังไม่อยากเรียนหลักสูตรยาว | 12 px, 1–2 lines. Original says "degree"; VET is also not a degree — "หลักสูตรยาว" covers both. Editor to confirm. |
| BSP-102 | :761 | Slider label | English study weeks | ระยะเวลาที่ต้องเรียนภาษาเพิ่ม | เรียนภาษากี่สัปดาห์ | Shares row with `{weeks} สัปดาห์`. "ต้อง" wrongly implies it is required. |
| BSP-103 | :763 | Slider value | {weeks} weeks | {weeks} สัปดาห์ | {weeks} สัปดาห์ | KEEP. 0–17. |
| BSP-104 ⚠️ | :775 | Helper under slider | Work and Holiday visa holders can study up to 17 weeks | สำหรับวีซ่า WAH จะเรียนได้มากสุด 17 สัปดาห์ | ผู้ถือวีซ่า Work and Holiday เรียนได้สูงสุด 17 สัปดาห์ | 11 px. ⚠️ Slider is capped at 17 for the visitor-visa card too — see FC-04 (visitor visa study limit is a different rule, 3 months). |
| BSP-105 | :780 | Label above 3 skill buttons | Add a short vocational course? | เรียนคอร์สวิชาชีพระยะสั้นที่อยากเรียน | เพิ่มคอร์สวิชาชีพระยะสั้น | Label, one line. |
| BSP-106 | :783 | Skill option | English only | ภาษาอย่างเดียว | เรียนแค่ภาษา | 3-column grid ≈ 100 px on mobile. |
| BSP-107 | :784–785 | Skill options | Childcare · Aged Care | Childcare · Aged Care | ดูแลเด็ก (Childcare) · ดูแลผู้สูงอายุ (Aged Care) | Very narrow; if too long, keep English on the button and add Thai as sub-text. Sub shows `${low}–${high}` AUD range. |
| BSP-108 | :811, :825 | Card title | Work and Holiday (462) | Working Holiday (WAH) | Work and Holiday (462) | See BSP-020. |
| BSP-109 ⚠️ | :812 | Card tagline | Study, work and gain new experience on a budget of up to ฿100,000 | เรียน ทำงาน และ หาประสบการณ์ใหม่ด้วยงบไม่เกิน 100,000 บาท | เรียน ทำงาน และหาประสบการณ์ใหม่ ด้วยงบไม่เกิน 100,000 บาท | ⚠️ "ด้วยงบไม่เกิน 100,000 บาท" is contradicted by the tool's own numbers: 17 weeks × $630 + Childcare high + visa ≈ $19,280 ≈ ฿452,700. Suggest removing the fixed promise (owner decision). **Owner decision 2026-09-24: keep the budget promise.** Revised suggestion keeps it: only spacing fixed. |
| BSP-110 | :826 | Sub-heading on "not eligible" card (age ≥ 31) | Work and Holiday requirements | ข้อกำหนดของวีซ่า WAH | เงื่อนไขวีซ่า Work and Holiday | 11 px. |
| BSP-111 ⚠️ | :832 | Amber explanation (age ≥ 31) | Thai citizens aged 31 or over can't apply for Work and Holiday, but can apply for a student visa. Whether a visa is granted depends on each applicant's background and study purpose. | สำหรับคนไทยที่มีอายุ 31 ปีขึ้นไปจะไม่สามารถสมัครวีซ่า WAH ได้ แต่จะสามารถสมัครวีซ่านักเรียนได้ ทั้งนี้โอกาสที่วีซ่าจะผ่านนั้นขึ้นอยู่กับประวัติและจุดประสงค์ในการเรียนของแต่ละคน | คนไทยอายุ 31 ปีขึ้นไปสมัครวีซ่า Work and Holiday ไม่ได้ แต่ยังสมัครวีซ่านักเรียนได้ ผลการพิจารณาขึ้นอยู่กับประวัติและเหตุผลในการเรียนของแต่ละคน | 12 px, ≤ 4 lines. ⚠️ Age rule (18–30 at application) UNVERIFIED this session (FC-03). Note the slider allows 15–17, where WHM is also not available but the WHM card still shows (ISS-011). |
| BSP-112 | :840 | Card title | Study on a visitor visa | เรียนด้วยวีซ่าท่องเที่ยว | เรียนระยะสั้นด้วยวีซ่าท่องเที่ยว | ≤ 2 lines. |
| BSP-113 ⚠️ | :841 | Card tagline | Study and travel on a budget of up to ฿150,000 | เรียนและท่องเที่ยวด้วยงบไม่เกิน 150,000 บาท | เรียนภาษาระยะสั้นควบคู่กับการท่องเที่ยว ด้วยงบไม่เกิน 150,000 บาท | ⚠️ Same fixed-budget promise problem as BSP-109. **Owner decision 2026-09-24: keep the budget promise.** Revised suggestion keeps it: only the leading phrase reworded. |
| BSP-114 | :869 | Visa fee row label | Work and Holiday visa fee / Visitor visa fee / Student visa fee | ค่าวีซ่า WAH / ค่าวีซ่าท่องเที่ยว / ค่าวีซ่านักเรียน | ค่าวีซ่า Work and Holiday / ค่าวีซ่าท่องเที่ยว / ค่าวีซ่านักเรียน | Row label. Values: $670 / $200 / $2,000 (FC-01, FC-02). |
| BSP-115 | :917 | Breakdown sub-row | {weeks} weeks × ${weekly} (max {max} weeks) | {weeks} สัปดาห์ @ ${weekly} (สูงสุด {max} สัปดาห์) | {weeks} สัปดาห์ × ${weekly} (สูงสุด {max} สัปดาห์) | `{max}` = 17. |
| BSP-116 | :922 | Breakdown row | Fast-track Childcare / Aged Care | Fast-Track Childcare / Fast-Track Aged Care | คอร์สเร่งรัด Childcare / คอร์สเร่งรัด Aged Care | Row label. |
| BSP-117 | :923 | Sub-row | Price depends on course and provider | ราคาจะขึ้นอยู่กับคอร์สและโรงเรียน | ราคาขึ้นอยู่กับคอร์สและสถาบัน | 10 px. |
| BSP-118 | :956 | Link on visitor-visa card (opens LINE) | Ask us on LINE | อยากปรึกษาเพิ่มเติม? ติดต่อทีมงานของเราได้เลย | สอบถามผ่าน LINE | The link opens `https://line.me/R/ti/p/@beyondstudy` — button text should say it opens LINE (CLAUDE.md guidance). One line. |

## H. Shared consultation box under the results (context only)

`BSCConsultationCTA` is shared by several tools and is **not part of this batch**; listed so the editor sees it on the screenshots. It will be reviewed with a later batch.

## Notes for the editor

1. **Terminology to settle once** (then applied everywhere): Work and Holiday / WHM / WAH; สายอาชีพ vs วิชาชีพ; สถาบัน vs โรงเรียน; เงินก้อนแรก for the "first payment" concept; OSHC explained once as ประกันสุขภาพนักเรียน.
2. Owner decisions (2026-09-24): BSP-001, 040, 062, 084, 087 — leave the claims as they are; BSP-109/113 — keep the budget promises. Still open for the owner: BSP-074/075 (visa-rate label). Rows BSP-014, 055, 061, 104, 111 contain claims that need an **owner/factual decision** before final wording — see `docs/qa/issues.md` and `docs/qa/factual-checks.md`.
3. After approval, the plan is to move all planner strings into `src/i18n/translations.ts` (EN + TH) in one change, so the English version is added at the same time.
