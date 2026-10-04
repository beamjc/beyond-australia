import type { Language } from "@/i18n/translations";

// Fixed month names rather than Intl: server and browser ICU data can differ,
// which would cause hydration mismatches and inconsistent Thai abbreviations.
const MONTHS = {
  en: {
    long: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    short: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  },
  th: {
    long: ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"],
    short: ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."],
  },
} as const;

export interface PlannerDate {
  year: number;
  /** 1–12 */
  month: number;
  day?: number;
}

/** Thai dates use the Buddhist Era year (2026 → 2569). */
const displayYear = (lang: Language, year: number) => (lang === "th" ? year + 543 : year);

/** "October 2026" / "ตุลาคม 2569" */
export const formatMonthYear = (lang: Language, d: PlannerDate) =>
  `${MONTHS[lang].long[d.month - 1]} ${displayYear(lang, d.year)}`;

/** "2 October 2026" / "2 ตุลาคม 2569", or with style "short": "2 Oct 2026" / "2 ต.ค. 2569" */
export const formatDayMonthYear = (lang: Language, d: PlannerDate, style: "long" | "short" = "long") =>
  `${d.day ?? 1} ${MONTHS[lang][style][d.month - 1]} ${displayYear(lang, d.year)}`;
