// Pure helpers for the LIFF lead form (unit-tested in tests/unit/liffForm.test.ts).
// Option values are stored in English so staff see consistent data; labels are
// shown in the visitor's language. Thai labels pending editor review.

export interface Option {
  value: string;
  th: string;
  en: string;
}

export const LEVEL_OPTIONS: Option[] = [
  { value: "High school", th: "มัธยมปลาย", en: "High school" },
  { value: "Bachelor (studying)", th: "กำลังเรียนปริญญาตรี", en: "Studying a bachelor's degree" },
  { value: "Bachelor graduate", th: "จบปริญญาตรีแล้ว", en: "Bachelor's graduate" },
  { value: "Master's or higher", th: "ปริญญาโทขึ้นไป", en: "Master's or higher" },
  { value: "Working", th: "ทำงานแล้ว", en: "Working" },
];

// Values match what the Budget Planner sends (see BudgetStudyPlanner leadDraft).
export const PROGRAM_OPTIONS: Option[] = [
  { value: "English course", th: "เรียนภาษาอังกฤษ", en: "English course" },
  { value: "Short course", th: "คอร์สระยะสั้น / เพิ่มทักษะ", en: "Short course / upskilling" },
  { value: "Diploma / VET", th: "เรียนสายอาชีพ (VET)", en: "Vocational (VET)" },
  { value: "Bachelor", th: "ปริญญาตรี", en: "Bachelor's degree" },
  { value: "Master", th: "ปริญญาโท", en: "Master's degree" },
  { value: "Not sure", th: "ยังไม่แน่ใจ", en: "Not sure yet" },
];

const TH_MONTHS = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];
const EN_MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

/**
 * The next four start periods, counted from the month after `now`, as
 * quarters ("Jan–Mar 2027"). Courses start at different times, so quarters
 * avoid implying fixed intake dates. Thai labels use the Buddhist year.
 */
export function buildIntakes(now: Date): Option[] {
  const out: Option[] = [];
  // First quarter that starts after the current month.
  let q = Math.floor(now.getMonth() / 3) + 1;
  let y = now.getFullYear();
  if (q > 3) { q = 0; y += 1; }
  for (let i = 0; i < 4; i++) {
    const m0 = q * 3;
    const value = `${EN_MONTHS[m0].slice(0, 3)}–${EN_MONTHS[m0 + 2].slice(0, 3)} ${y}`;
    out.push({ value, en: value, th: `${TH_MONTHS[m0]}–${TH_MONTHS[m0 + 2]} ${y + 543}` });
    q += 1;
    if (q > 3) { q = 0; y += 1; }
  }
  out.push({ value: "Not sure", th: "ยังไม่แน่ใจ", en: "Not sure yet" });
  return out;
}

/** Adds a saved value that is no longer in the list (e.g. a past intake) so it isn't lost. */
export function withValue(options: Option[], value: string | null | undefined): Option[] {
  if (!value || options.some((o) => o.value === value)) return options;
  return [{ value, th: value, en: value }, ...options];
}

/** Thai or Australian style numbers: digits with optional +, spaces, dashes, dots, brackets. */
export function isValidPhone(v: string): boolean {
  return /^\+?\d{8,15}$/.test(v.replace(/[\s().-]/g, ""));
}

export function isValidEmail(v: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
}
