# Thai review — Batch 3: Savings planner

**Status: owner-supplied Thai applied verbatim on branch `qa/study-tools-redesign`. 14 DRAFT strings are on the branch but AWAITING EXTERNAL THAI EDITOR REVIEW.**

- Owner brief: 2026-09-25 (sections 1–30, including "one calculator, visa type as an input").
- Source: `src/data/savingsCopy.ts`. Components: `src/components/study/SavingsCalculator.tsx`, `src/components/study/savings/*`. Share button labels in `SavingsShareButtons.tsx` are unchanged existing Thai.
- Where: Home → Study → tab "คำนวณเงินออม" (`#study-panel-savings`).
- English: the calculator was English-only (ISS-001); the English column is new.
- Screenshots: `docs/qa/screenshots/savings/`.

Look first:
- `copy.workWhm`, `copy.workStudent`, `copy.studentHours` restate the existing English work-rights notes (48 h/fortnight, 6 months per employer). Facts are UNVERIFIED — see `factual-checks.md` FC-16…18.
- 2026-09-26: planning FX rate is now 23.5 (owner). `copy.fxHint` / `copy.footFx` replace "FX last updated {today}", which was always today's date (ISS-033).
- Owner example "ถ้าอยู่ 3 ปี … จากเป้าหมาย A$130,434" treats the goal as per-year; the calculator's goal is a **total**, so the sentence shows the total goal (e.g. A$43,478).

| ID | Key | English | Thai | Status |
|---|---|---|---|---|
| SAV-001 | copy.title | Plan your savings in Australia | **Owner text** — วางแผนเงินเก็บในออสเตรเลีย | Applied verbatim |
| SAV-002 | copy.subtitle | Work out roughly how much you need to earn to reach your savings goal. | **Owner text** — คำนวณว่าคุณต้องมีรายได้ประมาณเท่าไหร่ เพื่อเก็บเงินให้ได้ตามเป้าหมาย | Applied verbatim |
| SAV-003 | copy.goalTitle | Your savings goal | **Owner text** — เป้าหมายเงินเก็บของคุณ | Applied verbatim |
| SAV-004 | copy.goalLabel | How much do you want to save in total? | **Owner text** — อยากเก็บเงินทั้งหมดเท่าไหร่? | Applied verbatim |
| SAV-005 | copy.about | About {x} | **Owner text** — ประมาณ {x} | Applied verbatim |
| SAV-006 | copy.fxLine | 1 AUD = {rate} THB | 1 AUD = {rate} บาท | DRAFT — needs editor |
| SAV-007 | copy.fxEdit | Change rate | ปรับอัตราแลกเปลี่ยน | DRAFT — needs editor |
| SAV-008 | copy.fxInputLabel | Exchange rate (1 AUD = ? THB) | อัตราแลกเปลี่ยน (1 AUD = ? บาท) | DRAFT — needs editor |
| SAV-009 | copy.fxHint | A planning rate only, not a live rate. Check with your bank. | เป็นอัตราที่ใช้วางแผนเท่านั้น ไม่ใช่อัตราล่าสุด ควรเช็กกับธนาคารอีกครั้ง | DRAFT — needs editor |
| SAV-010 | copy.durationLabel | How long do you plan to stay in Australia? | **Owner text** — วางแผนอยู่ที่ออสเตรเลียนานแค่ไหน? | Applied verbatim |
| SAV-011 | copy.years | {n} yr | **Owner text** — {n} ปี | Applied verbatim |
| SAV-012 | copy.requiredLead | You need to save about | **Owner text** — คุณต้องเก็บเงินเฉลี่ยประมาณ | Applied verbatim |
| SAV-013 | copy.perYear | per year | **Owner text** — ต่อปี | Applied verbatim |
| SAV-014 | copy.slashYear | / year | **Owner text** — / ปี | Applied verbatim |
| SAV-015 | copy.slashMonth | / month | **Owner text** — / เดือน | Applied verbatim |
| SAV-016 | copy.visaLabel | Your visa type | **Owner text** — ประเภทวีซ่าของคุณ | Applied verbatim |
| SAV-017 | copy.visaHelper | Used to estimate tax for your visa type. | **Owner text** — ใช้สำหรับคำนวณภาษีโดยประมาณให้เหมาะกับประเภทวีซ่าของคุณ | Applied verbatim |
| SAV-018 | copy.visaWhm | Working Holiday | **Owner text** — Working Holiday | Applied verbatim |
| SAV-019 | copy.visaWhmSub | Visa 417 / 462 | **Owner text** — วีซ่า 417 / 462 | Applied verbatim |
| SAV-020 | copy.visaStudent | Student Visa | **Owner text** — Student Visa | Applied verbatim |
| SAV-021 | copy.visaStudentSub | Student visa 500 | **Owner text** — วีซ่านักเรียน 500 | Applied verbatim |
| SAV-022 | copy.workWhm | No weekly hour cap. Generally up to 6 months with one employer (extensions possible). | ไม่จำกัดชั่วโมงทำงานต่อสัปดาห์ โดยทั่วไปทำงานกับนายจ้างรายเดียวได้ไม่เกิน 6 เดือน (ขอขยายได้ในบางกรณี) | DRAFT — needs editor |
| SAV-023 | copy.workStudent | Up to 48 hours per fortnight during study periods; unlimited during official holidays and for Master by Research / PhD students. | ทำงานได้ไม่เกิน 48 ชั่วโมงต่อ 2 สัปดาห์ในช่วงเปิดเรียน ไม่จำกัดชั่วโมงในช่วงปิดภาคเรียน และไม่จำกัดสำหรับนักเรียน Master by Research / PhD | DRAFT — needs editor |
| SAV-024 | copy.incomeLabel | Yearly income before tax | **Owner text** — รายได้ก่อนหักภาษีต่อปี | Applied verbatim |
| SAV-025 | copy.incomeHelper | Pick a range, or use the slider to set your own. | **Owner text** — เลือกช่วงรายได้ หรือเลื่อนเพื่อกำหนดรายได้เอง | Applied verbatim |
| SAV-026 | copy.incomeCustom | Your own yearly income (AUD) | กำหนดรายได้ต่อปีเอง (AUD) | DRAFT — needs editor |
| SAV-027 | copy.studentHours | This income needs about {h} hours per fortnight at minimum wage — more than the 48 hours a student visa allows during study periods. | รายได้นี้ต้องทำงานประมาณ {h} ชั่วโมงต่อ 2 สัปดาห์ (คิดจากค่าแรงขั้นต่ำ) ซึ่งเกิน 48 ชั่วโมงที่ผู้ถือวีซ่านักเรียนทำงานได้ในช่วงเปิดเรียน | DRAFT — needs editor |
| SAV-028 | copy.expensesLabel | Monthly expenses | **Owner text** — ค่าใช้จ่ายต่อเดือน | Applied verbatim |
| SAV-029 | copy.expensesContext | Rent, food, transport and everyday costs, roughly. | **Owner text** — รวมค่าเช่า อาหาร เดินทาง และค่าใช้จ่ายทั่วไปโดยประมาณ | Applied verbatim |
| SAV-030 | copy.expensesCustom | Your own monthly expenses (AUD) | กำหนดค่าใช้จ่ายต่อเดือนเอง (AUD) | DRAFT — needs editor |
| SAV-031 | copy.expensesYearly | About {x} a year | **Owner text** — ค่าใช้จ่ายต่อปีประมาณ {x} | Applied verbatim |
| SAV-032 | copy.resultTitle | Your savings plan | **Owner text** — สรุปแผนการเงินของคุณ | Applied verbatim |
| SAV-033 | copy.gross | Income before tax | **Owner text** — รายได้ก่อนหักภาษี | Applied verbatim |
| SAV-034 | copy.tax | Estimated tax | **Owner text** — ภาษีโดยประมาณ | Applied verbatim |
| SAV-035 | copy.net | Income after tax | **Owner text** — รายได้หลังหักภาษี | Applied verbatim |
| SAV-036 | copy.yearlyExpenses | Yearly expenses | **Owner text** — ค่าใช้จ่ายต่อปี | Applied verbatim |
| SAV-037 | copy.yearlySavings | Expected savings per year | **Owner text** — เงินที่คาดว่าจะเก็บได้ต่อปี | Applied verbatim |
| SAV-038 | copy.totalSavings | Total over {yrs} | **Owner text** — เงินเก็บรวม {n} ปี | Applied verbatim |
| SAV-039 | copy.yourGoal | Your goal | **Owner text** — เป้าหมายของคุณ | Applied verbatim |
| SAV-040 | copy.shortfall | Still short by | **Owner text** — ยังขาดอีก | Applied verbatim |
| SAV-041 | copy.surplus | Above your goal by | เกินเป้าหมาย | DRAFT — needs editor |
| SAV-042 | copy.chipWhm | Working Holiday 417/462 | **Owner text** — Working Holiday 417/462 | Applied verbatim |
| SAV-043 | copy.chipStudent | Student Visa 500 | **Owner text** — Student Visa 500 | Applied verbatim |
| SAV-044 | copy.taxNoteWhm | Uses the Working Holiday Maker tax rates from the ATO data this tool uses. | **Owner text** — คำนวณจากอัตราภาษีสำหรับ Working Holiday Maker ตามข้อมูล ATO ที่ระบบใช้อยู่ | Applied verbatim |
| SAV-045 | copy.taxNoteStudent | Uses the tax settings this tool applies to Student Visa holders. | **Owner text** — คำนวณตามเงื่อนไขภาษีที่ระบบกำหนดสำหรับผู้ถือ Student Visa | Applied verbatim |
| SAV-046 | copy.taxShared | Tax is a rough estimate. Your actual tax depends on your tax residency, income and personal situation. | **Owner text** — ตัวเลขภาษีเป็นการประมาณเบื้องต้น ภาษีจริงอาจแตกต่างตามสถานะผู้เสียภาษี รายได้ และเงื่อนไขส่วนบุคคล | Applied verbatim |
| SAV-047 | copy.reachedTitle | This plan could reach your goal | **Owner text** — แผนนี้มีโอกาสถึงเป้าหมายที่ตั้งไว้ | Applied verbatim |
| SAV-048 | copy.notReachedTitle | Not at your goal yet | **Owner text** — ยังไม่ถึงเป้าหมายที่ตั้งไว้ | Applied verbatim |
| SAV-049 | copy.summaryIncome | With {income} a year and about {monthly} a month in expenses, you would save about {annual} a year. | **Owner text** — ถ้าคุณมีรายได้ {income} ต่อปี และใช้จ่ายประมาณ {monthly} ต่อเดือน คุณจะเก็บเงินได้ประมาณ {annual} ต่อปี | Applied verbatim |
| SAV-050 | copy.summaryNegative | With {income} a year and about {monthly} a month in expenses, you would spend about {annual} a year more than you take home. | ถ้าคุณมีรายได้ {income} ต่อปี และใช้จ่ายประมาณ {monthly} ต่อเดือน ค่าใช้จ่ายจะสูงกว่ารายได้หลังหักภาษีประมาณ {annual} ต่อปี | DRAFT — needs editor |
| SAV-051 | copy.summaryOneYearShort | Your goal is about {goal}, so you are still {gap} short. | **Owner text** — เป้าหมายของคุณคือประมาณ {goal} จึงยังขาดอีก {gap} | Applied verbatim |
| SAV-052 | copy.summaryOneYearReached | That reaches your goal of about {goal}. | ซึ่งถึงเป้าหมายประมาณ {goal} ของคุณแล้ว | DRAFT — needs editor |
| SAV-053 | copy.summaryMultiYear | Over {yrs} you would save about {total} towards your goal of {goal}. | **Owner text** — ถ้าอยู่ {n} ปี คุณจะเก็บได้ประมาณ {total} จากเป้าหมาย {goal} | Applied verbatim |
| SAV-054 | copy.requiredTitle | How much would you need to earn? | **Owner text** — ต้องมีรายได้เท่าไหร่ถึงจะถึงเป้าหมาย? | Applied verbatim |
| SAV-055 | copy.requiredLine | To reach this goal within {yrs}, you would need a yearly income before tax of about | **Owner text** — เพื่อให้ถึงเป้าหมายนี้ภายใน {n} ปี คุณต้องมีรายได้ก่อนหักภาษีประมาณ | Applied verbatim |
| SAV-056 | copy.adjustShort | Try adjusting your plan: | **Owner text** — ลองปรับแผนได้ เช่น | Applied verbatim |
| SAV-057 | copy.adjustFaster | Want to get there sooner? | **Owner text** — อยากให้ถึงเป้าหมายเร็วขึ้น? | Applied verbatim |
| SAV-058 | copy.adjustIncome | Earn more | **Owner text** — เพิ่มรายได้ | Applied verbatim |
| SAV-059 | copy.adjustExpenses | Spend less | **Owner text** — ลดค่าใช้จ่าย | Applied verbatim |
| SAV-060 | copy.adjustDuration | Stay longer | **Owner text** — เพิ่มระยะเวลา | Applied verbatim |
| SAV-061 | copy.footTax | Tax based on ATO {year} rates | **Owner text** — คำนวณภาษีจากอัตรา ATO ปี {{year}} | Applied — year is now filled by code (WHM 2025–26, Student 2026–27) after the 2026-09-26 tax check |
| SAV-062 | copy.footFx | Planning exchange rate 1 AUD = {rate} THB | อัตราแลกเปลี่ยนที่ใช้วางแผน 1 AUD = {rate} บาท | DRAFT — needs editor |
| SAV-063 | copy.ctaTitle | Not sure how much to budget? | **Owner text** — ไม่แน่ใจว่าควรวางแผนงบเท่าไหร่? | Applied verbatim |
| SAV-064 | copy.ctaSub | The Beyond Study Center team can help you plan tuition, living costs and an overall budget. | **Owner text** — ทีม Beyond Study Center ช่วยวางแผนค่าเรียน ค่าครองชีพ และงบประมาณเบื้องต้นให้คุณได้ | Applied verbatim |
| SAV-065 | copy.ctaPrimary | Free chat on LINE | **Owner text** — ปรึกษาฟรีทาง LINE | Applied verbatim |
| SAV-066 | copy.ctaSecondary | See our services | **Owner text** — ดูบริการของเรา | Applied verbatim |
| SAV-067 | copy.shareTitle | Share your result | **Owner text** — แชร์ผลคำนวณ | Applied verbatim |
| SAV-068 | income.49301 | Min wage | **Owner text** — ขั้นต่ำ | Applied verbatim |
| SAV-069 | income.49301.hint | $24.95/hr × 38 hr/week | $24.95/ชม. × 38 ชม./สัปดาห์ | DRAFT — needs editor |
| SAV-070 | income.40000 | Low | **Owner text** — ต่ำ | Applied verbatim |
| SAV-071 | income.60000 | Mid | **Owner text** — กลาง | Applied verbatim |
| SAV-072 | income.72000 | Median | **Owner text** — มัธยฐาน | Applied verbatim |
| SAV-073 | income.100000 | Average | **Owner text** — เฉลี่ย | Applied verbatim |
| SAV-074 | income.183100 | High | **Owner text** — สูง | Applied verbatim |
| SAV-075 | expense.2000 | Budget | **Owner text** — ประหยัด | Applied verbatim |
| SAV-076 | expense.2500 | Moderate | **Owner text** — ทั่วไป | Applied verbatim |
| SAV-077 | expense.3200 | Comfortable | **Owner text** — สบายขึ้น | Applied verbatim |
