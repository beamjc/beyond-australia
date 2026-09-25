// Visa Options Explorer: the whole decision tree as data (EN + TH).
// An orientation tool only: results say what may be worth checking, never
// eligibility, approval chances or migration outcomes. Numbers that can change
// come from src/data/visaFacts.ts. Owner Thai is verbatim; the rest is draft
// (docs/qa/thai-review-planning-hub.md).

import type { Bi } from "./visaReadiness";
import { officialLinks as L, visaFacts } from "./visaFacts";

const AGE = visaFacts.whm462Thailand.ageRange.value;
const PASS = visaFacts.skilledPointsTest.passMark.value;

export type ToolId = "studyFinder" | "planner" | "calculator" | "savings" | "strength" | "universities";
export type IconKey = "plane" | "cap" | "briefcase" | "building" | "help" | "check" | "wallet" | "book";

export type Action =
  | { kind: "tool"; label: Bi; tool: ToolId }
  | { kind: "node"; label: Bi; node: string }
  | { kind: "link"; label: Bi; href: string; external?: boolean }
  | { kind: "back"; label: Bi };

export interface QuestionNode {
  kind: "question";
  id: string;
  title: Bi;
  helper?: Bi;
  options: { id: string; label: Bi; icon?: IconKey; next: string; reason?: Bi }[];
}

export interface ResultNode {
  kind: "result";
  id: string;
  eyebrow: Bi;
  title: Bi;
  summary: Bi;
  sequence?: Bi[];
  checksTitle?: Bi;
  checks?: Bi[];
  numbered?: boolean;
  actions: Action[];
  related: ToolId[];
  sources: { label: Bi; href: string }[];
  consult: "study" | "migration";
  bridge?: { title: Bi; action: Action };
}

export interface CompareNode {
  kind: "compare";
  id: string;
  title: Bi;
  cards: { title: Bi; fit: Bi; icon: IconKey; action: Action }[];
  sources: { label: Bi; href: string }[];
}

export type ExplorerNode = QuestionNode | ResultNode | CompareNode;

const bi = (th: string, en: string): Bi => ({ th, en });

const EXPLORE = bi("ตัวเลือกที่ควรศึกษาต่อ", "Worth exploring");
const CHECK_NEXT = bi("สิ่งที่ควรเช็กต่อ", "What to check next");
const HA = (label: Bi, href: string) => ({ label, href });
const toCompare: Action = { kind: "node", label: bi("ดูตัวเลือกวีซ่าอื่น", "See other visa options"), node: "compare" };
const toStudy: Action = { kind: "tool", label: bi("หาเส้นทางเรียนที่เหมาะกับคุณ", "Find your study pathway"), tool: "studyFinder" };

export const START_NODE = "start";

export const explorerNodes: ExplorerNode[] = [
  {
    kind: "question",
    id: "start",
    title: bi("ตอนนี้สถานการณ์ของคุณใกล้เคียงกับข้อไหนที่สุด?", "Which is closest to your situation right now?"),
    options: [
      { id: "whm", icon: "plane", label: bi("อยากไปทำงานและท่องเที่ยวในออสเตรเลีย", "I want to work and travel in Australia"), next: "whm-age", reason: bi("อยากไปทำงานและท่องเที่ยวในออสเตรเลีย", "You want to work and travel in Australia") },
      { id: "study", icon: "cap", label: bi("อยากไปเรียนต่อ", "I want to study"), next: "student-plan", reason: bi("ต้องการเรียนต่อ", "You want to study") },
      { id: "skilled", icon: "briefcase", label: bi("มีประสบการณ์ทำงานและอยากดู Skilled Visa", "I have work experience and want to look at skilled visas"), next: "skilled-list", reason: bi("มีประสบการณ์ทำงานและสนใจ Skilled Visa", "You have work experience and are interested in skilled visas") },
      { id: "employer", icon: "building", label: bi("มีนายจ้างในออสเตรเลียที่สนใจสนับสนุนวีซ่า", "An Australian employer is interested in sponsoring me"), next: "employer-status", reason: bi("มีนายจ้างในออสเตรเลียที่สนใจสนับสนุนวีซ่า", "An Australian employer is interested in sponsoring you") },
      { id: "unsure", icon: "help", label: bi("ยังไม่แน่ใจ อยากดูทุกตัวเลือก", "Not sure — show me all the options"), next: "compare" },
    ],
  },

  // ---- Working Holiday ----
  {
    kind: "question",
    id: "whm-age",
    title: bi("อายุของคุณตอนที่จะยื่นวีซ่า", "Your age when you apply"),
    helper: bi("Working Holiday มีเงื่อนไขเรื่องอายุ ซึ่งแตกต่างกันตามสัญชาติ", "Working Holiday visas have age limits that depend on your passport."),
    options: [
      { id: "in", label: bi(`${AGE.min}–${AGE.max} ปี`, `${AGE.min}–${AGE.max}`), next: "whm-passport", reason: bi(`อายุอยู่ในช่วง ${AGE.min}–${AGE.max} ปี`, `You're aged ${AGE.min}–${AGE.max}`) },
      { id: "over", label: bi(`มากกว่า ${AGE.max} ปี`, `Over ${AGE.max}`), next: "whm-age-over" },
      { id: "unsure", label: bi("ยังไม่แน่ใจ", "Not sure"), next: "whm-passport" },
    ],
  },
  {
    kind: "question",
    id: "whm-passport",
    title: bi("คุณถือพาสปอร์ตไทยหรือไม่?", "Do you hold a Thai passport?"),
    helper: bi("เงื่อนไข Working Holiday แตกต่างกันตามสัญชาติ", "Working Holiday conditions depend on your nationality."),
    options: [
      { id: "thai", label: bi("ใช่ ถือพาสปอร์ตไทย", "Yes, a Thai passport"), next: "whm-goal", reason: bi("ถือพาสปอร์ตไทย (วีซ่า 462)", "You hold a Thai passport (subclass 462)") },
      { id: "other", label: bi("ถือพาสปอร์ตประเทศอื่น", "Another passport"), next: "whm-goal" },
    ],
  },
  {
    kind: "question",
    id: "whm-goal",
    title: bi("เป้าหมายหลักของคุณคืออะไร?", "What is your main goal?"),
    options: [
      { id: "travel", label: bi("ท่องเที่ยวและใช้ชีวิต", "Travel and experience life there"), next: "whm-result", reason: bi("อยากท่องเที่ยวและใช้ชีวิตในออสเตรเลีย", "You want to travel and experience life in Australia") },
      { id: "work", label: bi("ทำงานหาประสบการณ์และรายได้", "Work for experience and income"), next: "whm-result", reason: bi("อยากทำงานหาประสบการณ์และรายได้", "You want work experience and income") },
      { id: "study", label: bi("อยากลองเรียนระยะสั้นด้วย", "Also try some short study"), next: "whm-result-study", reason: bi("สนใจเรียนระยะสั้นด้วย", "You're also interested in short study") },
      { id: "unsure", label: bi("ยังไม่แน่ใจ", "Not sure"), next: "whm-result" },
    ],
  },
  ...(["whm-result", "whm-result-study"] as const).map((id): ResultNode => ({
    kind: "result",
    id,
    eyebrow: EXPLORE,
    title: bi("Working Holiday อาจเป็นตัวเลือกที่ควรศึกษาต่อ", "A Working Holiday visa may be worth exploring"),
    summary: bi(
      "จากคำตอบของคุณ วีซ่า Working Holiday (417/462) อาจเกี่ยวข้องกับแผนของคุณ ควรตรวจสอบเงื่อนไขล่าสุดก่อนเตรียมตัว",
      "Based on your answers, a Working Holiday visa (417/462) may relate to your plans. Check the latest conditions before you prepare.",
    ),
    checksTitle: CHECK_NEXT,
    checks: [
      bi("อายุและสัญชาติ", "Age and nationality"),
      bi("เงื่อนไขของ subclass ที่เกี่ยวข้อง", "Conditions for the relevant subclass"),
      bi("หลักฐานทางการเงิน", "Financial evidence"),
      bi("เงื่อนไขด้านการทำงาน", "Work conditions"),
      bi("เงื่อนไขสำหรับปีที่ 2 / 3 หากเกี่ยวข้อง", "Second and third year conditions, if relevant"),
    ],
    actions: [
      { kind: "link", label: bi("ดูรายละเอียด Working Holiday", "See Working Holiday details"), href: "#whm" },
    ],
    related: id === "whm-result-study" ? ["studyFinder", "savings"] : ["savings", "calculator"],
    sources: [HA(bi("Work and Holiday visa (subclass 462)", "Work and Holiday visa (subclass 462)"), L.whm462)],
    consult: "migration",
  })),
  {
    kind: "result",
    id: "whm-age-over",
    eyebrow: bi("ควรตรวจสอบเพิ่มเติม", "Worth checking"),
    title: bi("Working Holiday อาจไม่ตรงกับช่วงอายุที่กำหนด", "Working Holiday may not match the age limit"),
    summary: bi(
      `สำหรับผู้ถือพาสปอร์ตไทย เงื่อนไขอายุของวีซ่า 462 คือ ${AGE.min}–${AGE.max} ปี ลองตรวจสอบเงื่อนไขล่าสุดจาก Home Affairs หรือดูตัวเลือกวีซ่าอื่นที่อาจเกี่ยวข้องกับแผนของคุณ`,
      `For Thai passport holders, the subclass 462 age range is ${AGE.min}–${AGE.max}. Check the latest conditions with Home Affairs, or look at other visa options that may relate to your plans.`,
    ),
    actions: [toCompare],
    related: ["studyFinder", "savings"],
    sources: [HA(bi("Work and Holiday visa (subclass 462)", "Work and Holiday visa (subclass 462)"), L.whm462)],
    consult: "migration",
  },

  // ---- Student ----
  {
    kind: "question",
    id: "student-plan",
    title: bi("Student Visa — คุณกำลังวางแผนแบบไหน?", "Student visa — where are you in your planning?"),
    options: [
      { id: "ready", icon: "check", label: bi("พร้อมเลือกหลักสูตรแล้ว", "Ready to choose a course"), next: "student-ready", reason: bi("พร้อมเลือกหลักสูตรแล้ว", "You're ready to choose a course") },
      { id: "unsure", icon: "help", label: bi("อยากเรียน แต่ยังไม่แน่ใจว่าจะเรียนอะไร", "I want to study but don't know what yet"), next: "student-unsure", reason: bi("ยังไม่แน่ใจว่าจะเรียนอะไร", "You're not sure what to study yet") },
      { id: "english", icon: "book", label: bi("ต้องพัฒนาภาษาอังกฤษก่อน", "I need to improve my English first"), next: "student-english", reason: bi("ต้องการพัฒนาภาษาอังกฤษก่อน", "You want to improve your English first") },
      { id: "budget", icon: "wallet", label: bi("กังวลเรื่องงบประมาณ", "I'm worried about costs"), next: "student-budget", reason: bi("กังวลเรื่องงบประมาณ", "You're concerned about costs") },
    ],
  },
  {
    kind: "result",
    id: "student-ready",
    eyebrow: EXPLORE,
    title: bi("Student Visa (Subclass 500)", "Student Visa (Subclass 500)"),
    summary: bi("จากคำตอบของคุณ คุณมีเป้าหมายหลักด้านการเรียนต่อในออสเตรเลีย", "Based on your answers, your main goal is to study in Australia."),
    checksTitle: bi("สิ่งที่ควรทำต่อ", "What to do next"),
    numbered: true,
    checks: [
      bi("เลือกประเภทหลักสูตร", "Choose a type of course"),
      bi("เช็กค่าเรียนและงบประมาณ", "Check tuition and your budget"),
      bi("ตรวจสอบเงื่อนไข Student Visa", "Check the Student visa requirements"),
    ],
    actions: [toStudy, { kind: "link", label: bi("ดูข้อมูลจาก Home Affairs", "See Home Affairs information"), href: L.student500, external: true }],
    related: ["calculator", "strength"],
    sources: [HA(bi("Student visa (subclass 500)", "Student visa (subclass 500)"), L.student500)],
    consult: "study",
  },
  {
    kind: "result",
    id: "student-unsure",
    eyebrow: EXPLORE,
    title: bi("เริ่มจากหาเส้นทางเรียนที่เหมาะกับคุณ", "Start by finding your study pathway"),
    summary: bi(
      "ตอบคำถามสั้น ๆ เพื่อดูว่าคุณควรเริ่มจากภาษาอังกฤษ สายวิชาชีพ หรือมหาวิทยาลัย",
      "Answer a few short questions to see whether to start with English, vocational study or university.",
    ),
    actions: [],
    related: ["universities", "calculator"],
    sources: [HA(bi("Student visa (subclass 500)", "Student visa (subclass 500)"), L.student500)],
    consult: "study",
    bridge: { title: bi("ยังไม่แน่ใจว่าจะเรียนอะไร?", "Not sure what to study?"), action: { ...toStudy, label: bi("หาเส้นทางเรียนที่เหมาะกับคุณ", "Find your study pathway") } },
  },
  {
    kind: "result",
    id: "student-english",
    eyebrow: EXPLORE,
    title: bi("ELICOS อาจเป็นจุดเริ่มต้นที่น่าสนใจ", "ELICOS may be a good place to start"),
    summary: bi(
      "หากระดับภาษาอังกฤษยังไม่ถึงเงื่อนไขของหลักสูตรที่สนใจ การเรียนภาษาอังกฤษก่อนสามารถช่วยเตรียมความพร้อมได้",
      "If your English is not yet at the level your course requires, an English course first can help you prepare.",
    ),
    sequence: [bi("ELICOS", "ELICOS"), bi("VET / Higher Education", "VET / Higher Education")],
    actions: [
      { kind: "tool", label: bi("ดูตัวเลือก ELICOS", "See ELICOS options"), tool: "planner" },
      toStudy,
    ],
    related: ["savings", "calculator"],
    sources: [HA(bi("Student visa (subclass 500)", "Student visa (subclass 500)"), L.student500)],
    consult: "study",
  },
  {
    kind: "result",
    id: "student-budget",
    eyebrow: EXPLORE,
    title: bi("ยังมีตัวเลือกที่เหมาะกับงบประมาณให้สำรวจ", "There are still options to explore for your budget"),
    summary: bi("ค่าเรียนแตกต่างกันตามหลักสูตรและสถาบัน", "Tuition varies by course and institution."),
    checksTitle: bi("ลองทำต่อ", "Try next"),
    actions: [
      { kind: "tool", label: bi("คำนวณค่าเรียน", "Estimate study costs"), tool: "calculator" },
      { kind: "tool", label: bi("วางแผนเงินเก็บ", "Plan your savings"), tool: "savings" },
      toStudy,
    ],
    related: [],
    sources: [HA(bi("Student visa (subclass 500)", "Student visa (subclass 500)"), L.student500)],
    consult: "study",
  },

  // ---- Skilled ----
  {
    kind: "question",
    id: "skilled-list",
    title: bi("อาชีพของคุณอยู่ใน Skilled Occupation List หรือไม่?", "Is your occupation on the Skilled Occupation List?"),
    options: [
      { id: "listed-calc", label: bi("อยู่ในรายการ และเคยคำนวณคะแนนแล้ว", "It's on the list and I've worked out my points"), next: "skilled-points", reason: bi("อาชีพอยู่ใน Skilled Occupation List", "Your occupation is on the list") },
      { id: "listed-unsure", label: bi("อยู่ในรายการ แต่ยังไม่แน่ใจเรื่องคะแนน", "It's on the list but I'm not sure about points"), next: "skilled-check-points", reason: bi("อาชีพอยู่ใน Skilled Occupation List", "Your occupation is on the list") },
      { id: "not-listed", label: bi("ไม่อยู่ในรายการ", "It's not on the list"), next: "skilled-not-listed" },
      { id: "unsure", label: bi("ยังไม่แน่ใจ", "Not sure"), next: "skilled-unsure" },
    ],
  },
  {
    kind: "question",
    id: "skilled-points",
    title: bi("คะแนน Points Test ของคุณประมาณเท่าไหร่?", "Roughly what is your points test score?"),
    options: [
      { id: "high", label: bi(`${PASS} คะแนนขึ้นไป`, `${PASS} or more`), next: "skilled-min-met", reason: bi(`คะแนนประมาณ ${PASS} ขึ้นไป`, `Your score is about ${PASS} or more`) },
      { id: "low", label: bi(`ต่ำกว่า ${PASS} คะแนน`, `Under ${PASS}`), next: "skilled-low" },
      { id: "unsure", label: bi("ยังไม่แน่ใจ", "Not sure"), next: "skilled-check-points" },
    ],
  },
  {
    kind: "result",
    id: "skilled-min-met",
    eyebrow: EXPLORE,
    title: bi("คุณผ่านเกณฑ์คะแนนขั้นต่ำที่ใช้ใน Points Test เบื้องต้น", "You may meet the basic minimum points score"),
    summary: bi(
      "แต่การได้รับ invitation ขึ้นอยู่กับประเภทวีซ่า อาชีพ รอบการเชิญ และปัจจัยอื่น ๆ ด้วย",
      "But whether you're invited depends on the visa, your occupation, invitation rounds and other factors.",
    ),
    checksTitle: bi("สิ่งที่ควรตรวจสอบต่อ", "What to check next"),
    checks: [
      bi("Skills Assessment", "Skills assessment"),
      bi("ระดับภาษาอังกฤษ", "English level"),
      bi("คุณสมบัติของอาชีพ", "Occupation eligibility"),
      bi("การคำนวณคะแนน", "Points calculation"),
      bi("เงื่อนไขการได้รับ invitation", "Invitation requirements"),
    ],
    actions: [{ kind: "link", label: bi("เปิด Points Calculator ของ Home Affairs", "Open the Home Affairs points calculator"), href: L.pointsCalculator, external: true }],
    related: ["strength"],
    sources: [HA(bi("Points calculator", "Points calculator"), L.pointsCalculator), HA(bi("Skilled occupation list", "Skilled occupation list"), L.skilledOccupationList)],
    consult: "migration",
  },
  {
    kind: "result",
    id: "skilled-low",
    eyebrow: bi("ควรตรวจสอบเพิ่มเติม", "Worth checking"),
    title: bi("คะแนนปัจจุบันอาจยังมีข้อจำกัด", "Your current score may be limiting"),
    summary: bi(
      "ลองตรวจสอบว่ามีปัจจัยใดที่อาจเปลี่ยนคะแนนได้ เช่น ภาษาอังกฤษ ประสบการณ์ทำงาน คุณสมบัติคู่สมรส หรือเงื่อนไขอื่นที่เกี่ยวข้อง",
      "Check which factors could change your score, such as English, work experience, partner skills or other relevant conditions.",
    ),
    actions: [{ kind: "link", label: bi("เปิด Points Calculator ของ Home Affairs", "Open the Home Affairs points calculator"), href: L.pointsCalculator, external: true }, toCompare],
    related: [],
    sources: [HA(bi("Points calculator", "Points calculator"), L.pointsCalculator)],
    consult: "migration",
  },
  {
    kind: "result",
    id: "skilled-check-points",
    eyebrow: bi("ควรตรวจสอบเพิ่มเติม", "Worth checking"),
    title: bi("ลองคำนวณคะแนนเบื้องต้นก่อน", "Work out your points first"),
    summary: bi(
      "Points Calculator ของ Home Affairs ช่วยให้เห็นคะแนนโดยประมาณจากอายุ ภาษาอังกฤษ ประสบการณ์ และวุฒิการศึกษา",
      "The Home Affairs points calculator gives an estimate based on age, English, experience and qualifications.",
    ),
    actions: [
      { kind: "link", label: bi("เปิด Points Calculator ของ Home Affairs", "Open the Home Affairs points calculator"), href: L.pointsCalculator, external: true },
      { kind: "back", label: bi("กลับมาทำต่อ", "Back to the question") },
    ],
    related: [],
    sources: [HA(bi("Points calculator", "Points calculator"), L.pointsCalculator)],
    consult: "migration",
  },
  {
    kind: "result",
    id: "skilled-not-listed",
    eyebrow: bi("ควรตรวจสอบเพิ่มเติม", "Worth checking"),
    title: bi("อาชีพปัจจุบันอาจไม่ตรงกับ Skilled pathway ที่กำลังดู", "Your occupation may not match this skilled pathway"),
    summary: bi(
      "คุณยังสามารถสำรวจตัวเลือกอื่นได้ เช่น วีซ่าประเภทอื่น หรือศึกษาว่าอาชีพที่เกี่ยวข้องกับประสบการณ์ของคุณมีตัวเลือกอะไรบ้าง",
      "You can still explore other options, such as other visa types, or look at which options relate to your experience.",
    ),
    actions: [
      toCompare,
      { kind: "tool", label: bi("สำรวจเส้นทางการเรียน", "Explore study pathways"), tool: "studyFinder" },
      { kind: "link", label: bi("ตรวจสอบข้อมูลจาก Home Affairs", "Check Home Affairs information"), href: L.skilledOccupationList, external: true },
    ],
    related: [],
    sources: [HA(bi("Skilled occupation list", "Skilled occupation list"), L.skilledOccupationList)],
    consult: "migration",
  },
  {
    kind: "result",
    id: "skilled-unsure",
    eyebrow: bi("ควรตรวจสอบเพิ่มเติม", "Worth checking"),
    title: bi("ยังไม่แน่ใจ? เช็กได้จากแหล่งข้อมูลทางการ", "Not sure? Check the official list"),
    summary: bi(
      "ดูว่าอาชีพของคุณอยู่ในรายการหรือไม่ แล้วกลับมาตอบคำถามต่อได้",
      "See whether your occupation is on the list, then come back and continue.",
    ),
    actions: [
      { kind: "link", label: bi("เช็ก Skilled Occupation List", "Check the Skilled Occupation List"), href: L.skilledOccupationList, external: true },
      { kind: "back", label: bi("กลับมาทำต่อ", "Back to the question") },
    ],
    related: [],
    sources: [HA(bi("Skilled occupation list", "Skilled occupation list"), L.skilledOccupationList)],
    consult: "migration",
  },

  // ---- Employer-sponsored ----
  {
    kind: "question",
    id: "employer-status",
    title: bi("นายจ้างเสนอสนับสนุนวีซ่าให้คุณแล้วหรือยัง?", "Has an employer offered to sponsor you?"),
    options: [
      { id: "discussing", label: bi("ใช่ กำลังคุยรายละเอียดกันอยู่", "Yes, we're discussing details"), next: "employer-match", reason: bi("กำลังคุยรายละเอียดกับนายจ้างเรื่อง sponsorship", "You're discussing sponsorship with an employer") },
      { id: "interested", label: bi("นายจ้างสนใจ แต่ยังไม่ได้เริ่มขั้นตอน", "An employer is interested but hasn't started"), next: "employer-match", reason: bi("มีนายจ้างที่สนใจสนับสนุน", "An employer is interested in sponsoring you") },
      { id: "none", label: bi("ยังไม่มีนายจ้าง", "No employer yet"), next: "employer-none" },
    ],
  },
  {
    kind: "question",
    id: "employer-match",
    title: bi("ตำแหน่งงานและประสบการณ์ของคุณตรงกับงานที่นายจ้างต้องการหรือไม่?", "Do your role and experience match what the employer needs?"),
    options: [
      { id: "yes", label: bi("ตรงกับงานที่นายจ้างต้องการ", "Yes, they match"), next: "employer-result", reason: bi("ประสบการณ์ตรงกับตำแหน่งงาน", "Your experience matches the role") },
      { id: "partly", label: bi("ตรงบางส่วน", "Partly"), next: "employer-result" },
      { id: "unsure", label: bi("ยังไม่แน่ใจ", "Not sure"), next: "employer-result" },
    ],
  },
  {
    kind: "result",
    id: "employer-result",
    eyebrow: EXPLORE,
    title: bi("เส้นทาง Employer-Sponsored อาจเป็นตัวเลือกที่ควรศึกษาต่อ", "An employer-sponsored visa may be worth exploring"),
    summary: bi(
      "จากข้อมูลที่คุณให้มา คุณมีนายจ้างที่สนใจสนับสนุน จึงควรตรวจสอบรายละเอียดของวีซ่าที่เกี่ยวข้องกับตำแหน่งงานของคุณเพิ่มเติม",
      "Based on your answers, an employer is interested in sponsoring you, so check the details of the visas that relate to your role.",
    ),
    checksTitle: bi("ควรเช็กต่อ", "Check next"),
    checks: [
      bi("ตำแหน่งงานอยู่ในรายการอาชีพที่เกี่ยวข้องหรือไม่", "Whether the role is on the relevant occupation list"),
      bi("ประสบการณ์ทำงานตรงตามเงื่อนไขหรือไม่", "Whether your work experience meets the requirements"),
      bi("คุณสมบัติด้านภาษาอังกฤษ", "English requirements"),
      bi("เงินเดือนและ market salary requirement", "Salary and the market salary requirement"),
      bi("เงื่อนไขของนายจ้างและ nomination", "Employer and nomination requirements"),
    ],
    actions: [
      { kind: "link", label: bi("ตรวจสอบข้อมูลจาก Home Affairs", "Check Home Affairs information"), href: L.workingInAustralia, external: true },
      { kind: "link", label: bi("ปรึกษาผู้เชี่ยวชาญด้าน Migration", "Find a registered migration agent"), href: L.migrationAgentRegister, external: true },
    ],
    related: [],
    sources: [
      HA(bi("Working in Australia", "Working in Australia"), L.workingInAustralia),
      HA(bi("Employer Nomination Scheme (subclass 186)", "Employer Nomination Scheme (subclass 186)"), L.employerNomination186),
    ],
    consult: "migration",
  },
  {
    kind: "result",
    id: "employer-none",
    eyebrow: bi("ควรตรวจสอบเพิ่มเติม", "Worth checking"),
    title: bi("Employer-Sponsored ต้องมีนายจ้างที่สนับสนุน", "Employer sponsorship needs an employer"),
    summary: bi(
      "เส้นทางนี้ต้องมีนายจ้างในออสเตรเลียที่เสนอชื่อ (nomination) ให้คุณ ลองดูตัวเลือกอื่นที่อาจเกี่ยวข้องกับแผนของคุณ",
      "This pathway needs an Australian employer to nominate you. Look at other options that may relate to your plans.",
    ),
    actions: [toCompare],
    related: [],
    sources: [HA(bi("Working in Australia", "Working in Australia"), L.workingInAustralia)],
    consult: "migration",
  },

  // ---- Not sure: comparison ----
  {
    kind: "compare",
    id: "compare",
    title: bi("เปรียบเทียบตัวเลือกหลัก", "Compare the main options"),
    cards: [
      { icon: "plane", title: bi("Working Holiday", "Working Holiday"), fit: bi("คนที่ต้องการเดินทางและทำงานระยะสั้น และมีคุณสมบัติตามเงื่อนไขของประเทศ/อายุ", "People who want to travel and work short-term and meet the country and age conditions"), action: { kind: "node", label: bi("ดูรายละเอียด", "See details"), node: "whm-age" } },
      { icon: "cap", title: bi("Student Visa", "Student Visa"), fit: bi("คนที่มีเป้าหมายด้านการเรียนที่ชัดเจน", "People with a clear study goal"), action: { kind: "tool", label: bi("วางแผนการเรียน", "Plan your study"), tool: "studyFinder" } },
      { icon: "briefcase", title: bi("Skilled", "Skilled"), fit: bi("ผู้ที่มีอาชีพและคุณสมบัติที่เกี่ยวข้องกับ skilled migration", "People whose occupation and skills relate to skilled migration"), action: { kind: "node", label: bi("เช็กเบื้องต้น", "Quick check"), node: "skilled-list" } },
      { icon: "building", title: bi("Employer-Sponsored", "Employer-Sponsored"), fit: bi("ผู้ที่มีหรือกำลังคุยกับนายจ้างออสเตรเลียเรื่อง sponsorship", "People who have, or are talking to, an Australian employer about sponsorship"), action: { kind: "node", label: bi("ดูเงื่อนไขเบื้องต้น", "See the basics"), node: "employer-status" } },
    ],
    sources: [HA(bi("Visa finder", "Visa finder"), L.visaFinder)],
  },
];

export const toolLabels: Record<ToolId, Bi> = {
  studyFinder: bi("หาเส้นทางเรียน", "Find a study pathway"),
  planner: bi("วางแผนเรียน & งบประมาณ", "Study & budget planner"),
  calculator: bi("คำนวณค่าเรียน", "Estimate study costs"),
  savings: bi("วางแผนเงินเก็บ", "Plan your savings"),
  strength: bi("เช็กความพร้อมก่อนยื่นวีซ่า", "Visa readiness check"),
  universities: bi("ค้นหามหาวิทยาลัย", "Find universities"),
};

export const explorerCopy = {
  title: bi("สำรวจตัวเลือกวีซ่า", "Explore visa options"),
  subtitle: bi("ตอบคำถามไม่กี่ข้อ เพื่อดูว่ามีวีซ่าประเภทไหนที่คุณควรศึกษาต่อ", "Answer a few questions to see which visa types are worth looking into."),
  question: bi("คำถาม {n} จาก {total}", "Question {n} of {total}"),
  back: bi("ย้อนกลับ", "Back"),
  startOver: bi("เริ่มใหม่", "Start over"),
  whyTitle: bi("ทำไมตัวเลือกนี้จึงขึ้นมา?", "Why this appeared"),
  sequenceTitle: bi("ตัวอย่างเส้นทาง", "Example pathway"),
  relatedTitle: bi("เครื่องมือที่อาจช่วยคุณต่อ", "Tools that may help next"),
  sourcesTitle: bi("แหล่งข้อมูลทางการ", "Official sources"),
  consultMigration: bi(
    "หากต้องการคำแนะนำเฉพาะด้านวีซ่า ควรปรึกษาผู้ให้คำแนะนำด้าน Migration ที่มีคุณสมบัติเหมาะสม",
    "For advice about your visa, talk to a suitably qualified migration adviser.",
  ),
  consultMigrationLink: bi("ค้นหา Registered Migration Agent", "Find a registered migration agent"),
  consultStudyTitle: bi("ยังไม่แน่ใจว่าควรเริ่มจากตรงไหน?", "Not sure where to start?"),
  consultStudySub: bi(
    "ทีม Beyond Study Center ช่วยดูตัวเลือกหลักสูตรและวางแผนการเรียนเบื้องต้นให้ได้ฟรี",
    "The Beyond Study Center team can help you look at courses and plan your study, free.",
  ),
  consultLine: bi("ปรึกษาฟรีทาง LINE", "Free chat on LINE"),
} satisfies Record<string, Bi>;

export const hubCopy = {
  back: bi("วางแผนเส้นทางไปออสเตรเลีย", "Plan your pathway to Australia"),
  title: bi("วางแผนเส้นทางไปออสเตรเลีย", "Plan your pathway to Australia"),
  intro1: bi("ยังไม่แน่ใจว่าควรเริ่มจากตรงไหน?", "Not sure where to start?"),
  intro2: bi(
    "ลองสำรวจเส้นทางการเรียนและตัวเลือกวีซ่าเบื้องต้นที่อาจเหมาะกับแผนของคุณ",
    "Explore study pathways and visa options that may suit your plans.",
  ),
  studyTitle: bi("หาเส้นทางเรียนที่เหมาะกับคุณ", "Find your study pathway"),
  studyDesc: bi(
    "ตอบคำถามสั้น ๆ เพื่อดูว่าคุณควรเริ่มจากภาษาอังกฤษ สายวิชาชีพ หรือมหาวิทยาลัย",
    "Answer a few short questions to see whether to start with English, vocational study or university.",
  ),
  studyCta: bi("เริ่มวางแผนการเรียน", "Start planning your study"),
  visaTitle: bi("สำรวจตัวเลือกวีซ่า", "Explore visa options"),
  visaDesc: bi(
    "ดูภาพรวมว่า Working Holiday, Student, Skilled หรือ Employer-Sponsored แตกต่างกันอย่างไร และควรศึกษาตัวเลือกไหนต่อ",
    "See how Working Holiday, Student, Skilled and Employer-Sponsored visas differ, and which to look into next.",
  ),
  visaCta: bi("สำรวจเส้นทางวีซ่า", "Explore visa pathways"),
  disclaimer: bi(
    "ข้อมูลนี้เป็นเพียงคำแนะนำเบื้องต้นเพื่อช่วยให้คุณเข้าใจตัวเลือกต่าง ๆ เงื่อนไขวีซ่าสามารถเปลี่ยนแปลงได้ และแต่ละเคสมีรายละเอียดแตกต่างกัน ควรตรวจสอบข้อมูลล่าสุดจาก Department of Home Affairs หรือผู้ให้คำแนะนำที่มีคุณสมบัติเหมาะสมก่อนตัดสินใจ",
    "This is general guidance to help you understand the options. Visa rules change and every case is different, so check the latest information from the Department of Home Affairs or a qualified adviser before you decide.",
  ),
} satisfies Record<string, Bi>;
