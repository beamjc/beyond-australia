// Visible copy for the Savings planner (Study → Savings tab), EN + TH.
// Thai supplied by the owner (2026-09-25) is used verbatim; other Thai strings
// are drafts listed in docs/qa/thai-review-savings.md for the external editor.

import type { Bi } from "./visaReadiness";

export const INCOME_PRESETS: { value: number; label: Bi; hint?: Bi }[] = [
  { value: 49301, label: { th: "ขั้นต่ำ", en: "Min wage" }, hint: { th: "$24.95/ชม. × 38 ชม./สัปดาห์", en: "$24.95/hr × 38 hr/week" } },
  { value: 40000, label: { th: "ต่ำ", en: "Low" } },
  { value: 60000, label: { th: "กลาง", en: "Mid" } },
  { value: 72000, label: { th: "มัธยฐาน", en: "Median" } },
  { value: 100000, label: { th: "เฉลี่ย", en: "Average" } },
  { value: 183100, label: { th: "สูง", en: "High" } },
];

export const EXPENSE_PRESETS: { value: number; label: Bi }[] = [
  { value: 2000, label: { th: "ประหยัด", en: "Budget" } },
  { value: 2500, label: { th: "ทั่วไป", en: "Moderate" } },
  { value: 3200, label: { th: "สบายขึ้น", en: "Comfortable" } },
];

export const savingsCopy = {
  title: { th: "วางแผนเงินเก็บในออสเตรเลีย", en: "Plan your savings in Australia" },
  subtitle: {
    th: "คำนวณว่าคุณต้องมีรายได้ประมาณเท่าไหร่ เพื่อเก็บเงินให้ได้ตามเป้าหมาย",
    en: "Work out roughly how much you need to earn to reach your savings goal.",
  },

  goalTitle: { th: "เป้าหมายเงินเก็บของคุณ", en: "Your savings goal" },
  goalLabel: { th: "อยากเก็บเงินทั้งหมดเท่าไหร่?", en: "How much do you want to save in total?" },
  about: { th: "ประมาณ {x}", en: "About {x}" },
  fxLine: { th: "1 AUD = {rate} บาท", en: "1 AUD = {rate} THB" },
  fxEdit: { th: "ปรับอัตราแลกเปลี่ยน", en: "Change rate" },
  fxInputLabel: { th: "อัตราแลกเปลี่ยน (1 AUD = ? บาท)", en: "Exchange rate (1 AUD = ? THB)" },
  fxHint: {
    th: "เป็นอัตราที่ใช้วางแผนเท่านั้น ไม่ใช่อัตราล่าสุด ควรเช็กกับธนาคารอีกครั้ง",
    en: "A planning rate only, not a live rate. Check with your bank.",
  },

  durationLabel: { th: "วางแผนอยู่ที่ออสเตรเลียนานแค่ไหน?", en: "How long do you plan to stay in Australia?" },
  years: { th: "{n} ปี", en: "{n} yr" },
  requiredLead: { th: "คุณต้องเก็บเงินเฉลี่ยประมาณ", en: "You need to save about" },
  perYear: { th: "ต่อปี", en: "per year" },
  slashYear: { th: "/ ปี", en: "/ year" },
  slashMonth: { th: "/ เดือน", en: "/ month" },

  visaLabel: { th: "ประเภทวีซ่าของคุณ", en: "Your visa type" },
  visaHelper: {
    th: "ใช้สำหรับคำนวณภาษีโดยประมาณให้เหมาะกับประเภทวีซ่าของคุณ",
    en: "Used to estimate tax for your visa type.",
  },
  visaWhm: { th: "Working Holiday", en: "Working Holiday" },
  visaWhmSub: { th: "วีซ่า 417 / 462", en: "Visa 417 / 462" },
  visaStudent: { th: "Student Visa", en: "Student Visa" },
  visaStudentSub: { th: "วีซ่านักเรียน 500", en: "Student visa 500" },
  workWhm: {
    th: "ไม่จำกัดชั่วโมงทำงานต่อสัปดาห์ โดยทั่วไปทำงานกับนายจ้างรายเดียวได้ไม่เกิน 6 เดือน (ขอขยายได้ในบางกรณี)",
    en: "No weekly hour cap. Generally up to 6 months with one employer (extensions possible).",
  },
  workStudent: {
    th: "ทำงานได้ไม่เกิน 48 ชั่วโมงต่อ 2 สัปดาห์ในช่วงเปิดเรียน ไม่จำกัดชั่วโมงในช่วงปิดภาคเรียน และไม่จำกัดสำหรับนักเรียน Master by Research / PhD",
    en: "Up to 48 hours per fortnight during study periods; unlimited during official holidays and for Master by Research / PhD students.",
  },

  incomeLabel: { th: "รายได้ก่อนหักภาษีต่อปี", en: "Yearly income before tax" },
  incomeHelper: { th: "เลือกช่วงรายได้ หรือเลื่อนเพื่อกำหนดรายได้เอง", en: "Pick a range, or use the slider to set your own." },
  incomeCustom: { th: "กำหนดรายได้ต่อปีเอง (AUD)", en: "Your own yearly income (AUD)" },
  studentHours: {
    th: "รายได้นี้ต้องทำงานประมาณ {h} ชั่วโมงต่อ 2 สัปดาห์ (คิดจากค่าแรงขั้นต่ำ) ซึ่งเกิน 48 ชั่วโมงที่ผู้ถือวีซ่านักเรียนทำงานได้ในช่วงเปิดเรียน",
    en: "This income needs about {h} hours per fortnight at minimum wage — more than the 48 hours a student visa allows during study periods.",
  },

  expensesLabel: { th: "ค่าใช้จ่ายต่อเดือน", en: "Monthly expenses" },
  expensesContext: {
    th: "รวมค่าเช่า อาหาร เดินทาง และค่าใช้จ่ายทั่วไปโดยประมาณ",
    en: "Rent, food, transport and everyday costs, roughly.",
  },
  expensesCustom: { th: "กำหนดค่าใช้จ่ายต่อเดือนเอง (AUD)", en: "Your own monthly expenses (AUD)" },
  expensesYearly: { th: "ค่าใช้จ่ายต่อปีประมาณ {x}", en: "About {x} a year" },

  resultTitle: { th: "สรุปแผนการเงินของคุณ", en: "Your savings plan" },
  gross: { th: "รายได้ก่อนหักภาษี", en: "Income before tax" },
  tax: { th: "ภาษีโดยประมาณ", en: "Estimated tax" },
  net: { th: "รายได้หลังหักภาษี", en: "Income after tax" },
  yearlyExpenses: { th: "ค่าใช้จ่ายต่อปี", en: "Yearly expenses" },
  yearlySavings: { th: "เงินที่คาดว่าจะเก็บได้ต่อปี", en: "Expected savings per year" },
  totalSavings: { th: "เงินเก็บรวม {n} ปี", en: "Total over {yrs}" },
  yourGoal: { th: "เป้าหมายของคุณ", en: "Your goal" },
  shortfall: { th: "ยังขาดอีก", en: "Still short by" },
  surplus: { th: "เกินเป้าหมาย", en: "Above your goal by" },
  chipWhm: { th: "Working Holiday 417/462", en: "Working Holiday 417/462" },
  chipStudent: { th: "Student Visa 500", en: "Student Visa 500" },
  taxNoteWhm: {
    th: "คำนวณจากอัตราภาษีสำหรับ Working Holiday Maker ตามข้อมูล ATO ที่ระบบใช้อยู่",
    en: "Uses the Working Holiday Maker tax rates from the ATO data this tool uses.",
  },
  taxNoteStudent: {
    th: "คำนวณตามเงื่อนไขภาษีที่ระบบกำหนดสำหรับผู้ถือ Student Visa",
    en: "Uses the tax settings this tool applies to Student Visa holders.",
  },
  taxShared: {
    th: "ตัวเลขภาษีเป็นการประมาณเบื้องต้น ภาษีจริงอาจแตกต่างตามสถานะผู้เสียภาษี รายได้ และเงื่อนไขส่วนบุคคล",
    en: "Tax is a rough estimate. Your actual tax depends on your tax residency, income and personal situation.",
  },

  reachedTitle: { th: "แผนนี้มีโอกาสถึงเป้าหมายที่ตั้งไว้", en: "This plan could reach your goal" },
  notReachedTitle: { th: "ยังไม่ถึงเป้าหมายที่ตั้งไว้", en: "Not at your goal yet" },
  summaryIncome: {
    th: "ถ้าคุณมีรายได้ {income} ต่อปี และใช้จ่ายประมาณ {monthly} ต่อเดือน คุณจะเก็บเงินได้ประมาณ {annual} ต่อปี",
    en: "With {income} a year and about {monthly} a month in expenses, you would save about {annual} a year.",
  },
  summaryNegative: {
    th: "ถ้าคุณมีรายได้ {income} ต่อปี และใช้จ่ายประมาณ {monthly} ต่อเดือน ค่าใช้จ่ายจะสูงกว่ารายได้หลังหักภาษีประมาณ {annual} ต่อปี",
    en: "With {income} a year and about {monthly} a month in expenses, you would spend about {annual} a year more than you take home.",
  },
  summaryOneYearShort: { th: "เป้าหมายของคุณคือประมาณ {goal} จึงยังขาดอีก {gap}", en: "Your goal is about {goal}, so you are still {gap} short." },
  summaryOneYearReached: { th: "ซึ่งถึงเป้าหมายประมาณ {goal} ของคุณแล้ว", en: "That reaches your goal of about {goal}." },
  summaryMultiYear: {
    th: "ถ้าอยู่ {n} ปี คุณจะเก็บได้ประมาณ {total} จากเป้าหมาย {goal}",
    en: "Over {yrs} you would save about {total} towards your goal of {goal}.",
  },

  requiredTitle: { th: "ต้องมีรายได้เท่าไหร่ถึงจะถึงเป้าหมาย?", en: "How much would you need to earn?" },
  requiredLine: { th: "เพื่อให้ถึงเป้าหมายนี้ภายใน {n} ปี คุณต้องมีรายได้ก่อนหักภาษีประมาณ", en: "To reach this goal within {yrs}, you would need a yearly income before tax of about" },

  adjustShort: { th: "ลองปรับแผนได้ เช่น", en: "Try adjusting your plan:" },
  adjustFaster: { th: "อยากให้ถึงเป้าหมายเร็วขึ้น?", en: "Want to get there sooner?" },
  adjustIncome: { th: "เพิ่มรายได้", en: "Earn more" },
  adjustExpenses: { th: "ลดค่าใช้จ่าย", en: "Spend less" },
  adjustDuration: { th: "เพิ่มระยะเวลา", en: "Stay longer" },

  footTax: { th: "คำนวณภาษีจากอัตรา ATO ปี {year}", en: "Tax based on ATO {year} rates" },
  footFx: { th: "อัตราแลกเปลี่ยนที่ใช้วางแผน 1 AUD = {rate} บาท", en: "Planning exchange rate 1 AUD = {rate} THB" },

  ctaTitle: { th: "ไม่แน่ใจว่าควรวางแผนงบเท่าไหร่?", en: "Not sure how much to budget?" },
  ctaSub: {
    th: "ทีม Beyond Study Center ช่วยวางแผนค่าเรียน ค่าครองชีพ และงบประมาณเบื้องต้นให้คุณได้",
    en: "The Beyond Study Center team can help you plan tuition, living costs and an overall budget.",
  },
  ctaPrimary: { th: "ปรึกษาฟรีทาง LINE", en: "Free chat on LINE" },
  ctaSecondary: { th: "ดูบริการของเรา", en: "See our services" },
  shareTitle: { th: "แชร์ผลคำนวณ", en: "Share your result" },
} satisfies Record<string, Bi>;

export const fill = (s: string, vars: Record<string, string | number>) =>
  s.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? String(vars[k]) : m));
