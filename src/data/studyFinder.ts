// Study Pathway Finder: questions, answer weights and result copy (EN + TH).
// Weights follow the owner's starting model (2026-09-25). They are guidance
// weights, not admission requirements. Age and city carry no weight.
// Thai supplied by the owner is used verbatim; other Thai is draft (see
// docs/qa/thai-review-planning-hub.md).

import type { Bi } from "./visaReadiness";

export type PathwayId = "elicos" | "vet" | "he";
export type Weights = Partial<Record<PathwayId, number>>;

export interface FinderOption<Id extends string> {
  id: Id;
  label: Bi;
  desc?: Bi;
  weights?: Weights;
  /** Shown under "why" when this answer adds weight to the pathway shown. */
  reason?: Bi;
}

export type EnglishId = "none" | "le45" | "50to55" | "60to65" | "70plus";
export type GoalId = "studyWork" | "english" | "qualification" | "career" | "unsure";
export type BudgetId = "under10k" | "10to20k" | "20to35k" | "over35k" | "unsure";
export type InterestId = "elicos" | "vet" | "he" | "unsure";
export type QualificationId = "highSchool" | "certDiploma" | "bachelor" | "master";
export type TimingId = "inAustralia" | "within6" | "6to12" | "over12" | "unsure";

export const englishOptions: FinderOption<EnglishId>[] = [
  { id: "none", label: { th: "ยังไม่มีคะแนนภาษาอังกฤษ", en: "No English score yet" }, weights: { elicos: 3 }, reason: { th: "ยังไม่มีผลคะแนนภาษาอังกฤษ", en: "You don't have an English score yet" } },
  { id: "le45", label: { th: "IELTS 4.5 หรือต่ำกว่า", en: "IELTS 4.5 or lower" }, weights: { elicos: 4, vet: -1, he: -2 }, reason: { th: "คะแนน IELTS ประมาณ 4.5 หรือต่ำกว่า", en: "Your IELTS is about 4.5 or lower" } },
  { id: "50to55", label: { th: "IELTS 5.0–5.5", en: "IELTS 5.0–5.5" }, weights: { elicos: 2, vet: 1 }, reason: { th: "คะแนน IELTS ประมาณ 5.0–5.5", en: "Your IELTS is about 5.0–5.5" } },
  { id: "60to65", label: { th: "IELTS 6.0–6.5", en: "IELTS 6.0–6.5" }, weights: { vet: 2, he: 2 }, reason: { th: "คะแนน IELTS ประมาณ 6.0–6.5", en: "Your IELTS is about 6.0–6.5" } },
  { id: "70plus", label: { th: "IELTS 7.0 ขึ้นไป", en: "IELTS 7.0 or higher" }, weights: { he: 3, vet: 1 }, reason: { th: "คะแนน IELTS 7.0 ขึ้นไป", en: "Your IELTS is 7.0 or higher" } },
];

export const goalOptions: FinderOption<GoalId>[] = [
  // Long-term planning: context only, never extra weight (owner rule).
  { id: "studyWork", label: { th: "วางแผนเรียนและทำงานต่อในออสเตรเลีย", en: "Study and then work in Australia" } },
  { id: "english", label: { th: "พัฒนาภาษาอังกฤษ", en: "Improve my English" }, weights: { elicos: 4 }, reason: { th: "ต้องการพัฒนาภาษาอังกฤษ", en: "You want to improve your English" } },
  { id: "qualification", label: { th: "เรียนเพื่อเพิ่มวุฒิหรือทักษะ", en: "Gain a qualification or skills" }, weights: { vet: 2, he: 2 }, reason: { th: "ต้องการเพิ่มวุฒิหรือทักษะ", en: "You want a qualification or new skills" } },
  { id: "career", label: { th: "เปลี่ยนสายงาน / เพิ่มโอกาสด้านอาชีพ", en: "Change career / improve career options" }, weights: { vet: 2, he: 1 }, reason: { th: "ต้องการเปลี่ยนสายงานหรือเพิ่มโอกาสด้านอาชีพ", en: "You want to change career or improve your options" } },
  { id: "unsure", label: { th: "ยังไม่แน่ใจ", en: "Not sure yet" } },
];

export const cityOptions: FinderOption<string>[] = [
  "Sydney", "Melbourne", "Brisbane", "Perth", "Adelaide", "Gold Coast", "Canberra", "Hobart", "Darwin",
].map((c) => ({ id: c, label: { th: c, en: c } }))
  .concat([{ id: "any", label: { th: "ยังไม่แน่ใจ / เปิดรับทุกเมือง", en: "Not sure / open to any city" } }]);

/** Yearly tuition budget bands (AUD). `max` is used only as a constraint. */
export const budgetOptions: (FinderOption<BudgetId> & { max: number | null })[] = [
  { id: "under10k", label: { th: "ต่ำกว่า A$10,000", en: "Under A$10,000" }, max: 10_000 },
  { id: "10to20k", label: { th: "A$10,000–20,000", en: "A$10,000–20,000" }, max: 20_000 },
  { id: "20to35k", label: { th: "A$20,001–35,000", en: "A$20,001–35,000" }, max: 35_000 },
  { id: "over35k", label: { th: "มากกว่า A$35,000", en: "Over A$35,000" }, max: Infinity },
  { id: "unsure", label: { th: "ยังไม่แน่ใจ", en: "Not sure yet" }, max: null },
];

export const interestOptions: FinderOption<InterestId>[] = [
  { id: "elicos", label: { th: "เรียนภาษาอังกฤษ (ELICOS)", en: "English course (ELICOS)" }, desc: { th: "หลักสูตรภาษาอังกฤษ", en: "English language courses" }, weights: { elicos: 4 }, reason: { th: "สนใจเรียนภาษาอังกฤษ (ELICOS)", en: "You're interested in an English course" } },
  { id: "vet", label: { th: "สายวิชาชีพ (VET)", en: "Vocational (VET)" }, desc: { th: "Certificate, Diploma และหลักสูตรสายวิชาชีพ", en: "Certificates, diplomas and vocational courses" }, weights: { vet: 4 }, reason: { th: "สนใจเรียนสายวิชาชีพ (VET)", en: "You're interested in vocational study" } },
  { id: "he", label: { th: "มหาวิทยาลัย / Higher Education", en: "University / Higher Education" }, desc: { th: "Bachelor, Graduate Certificate, Master และหลักสูตรระดับมหาวิทยาลัย", en: "Bachelor, Graduate Certificate, Master and other university courses" }, weights: { he: 4 }, reason: { th: "สนใจเรียนระดับมหาวิทยาลัย", en: "You're interested in university study" } },
  { id: "unsure", label: { th: "ยังไม่แน่ใจ", en: "Not sure yet" } },
];

export const qualificationOptions: FinderOption<QualificationId>[] = [
  { id: "highSchool", label: { th: "มัธยมศึกษาหรือเทียบเท่า", en: "High school or equivalent" }, weights: { vet: 2, he: 1 }, reason: { th: "จบมัธยมศึกษาหรือเทียบเท่า", en: "You've finished high school" } },
  { id: "certDiploma", label: { th: "Certificate / Diploma", en: "Certificate / Diploma" }, weights: { vet: 2, he: 1 }, reason: { th: "มีวุฒิ Certificate / Diploma", en: "You have a certificate or diploma" } },
  { id: "bachelor", label: { th: "ปริญญาตรี", en: "Bachelor's degree" }, weights: { he: 3 }, reason: { th: "มีวุฒิปริญญาตรี", en: "You have a bachelor's degree" } },
  { id: "master", label: { th: "ปริญญาโทขึ้นไป", en: "Master's degree or higher" }, weights: { he: 3 }, reason: { th: "มีวุฒิปริญญาโทขึ้นไป", en: "You have a master's degree or higher" } },
];

export const timingOptions: FinderOption<TimingId>[] = [
  { id: "inAustralia", label: { th: "อยู่ที่ออสเตรเลียแล้ว", en: "Already in Australia" } },
  { id: "within6", label: { th: "ภายใน 6 เดือน", en: "Within 6 months" } },
  { id: "6to12", label: { th: "ประมาณ 6–12 เดือน", en: "In about 6–12 months" } },
  { id: "over12", label: { th: "มากกว่า 1 ปี", en: "More than a year from now" } },
  { id: "unsure", label: { th: "ยังไม่แน่ใจ", en: "Not sure yet" } },
];

export const pathwayInfo: Record<PathwayId, { name: Bi; short: Bi; desc: Bi; closing: Bi }> = {
  elicos: {
    name: { th: "เรียนภาษาอังกฤษ (ELICOS)", en: "English course (ELICOS)" },
    short: { th: "ELICOS", en: "ELICOS" },
    desc: { th: "หลักสูตรภาษาอังกฤษ สำหรับเตรียมความพร้อมก่อนเรียนต่อหรือใช้ชีวิตในออสเตรเลีย", en: "English courses to get ready for further study or life in Australia." },
    closing: {
      th: "การเริ่มจากหลักสูตร ELICOS จึงเป็นหนึ่งในตัวเลือกที่น่าสนใจสำหรับเตรียมความพร้อมก่อนเรียนต่อ",
      en: "so starting with an ELICOS course is one option worth considering to get ready for further study.",
    },
  },
  vet: {
    name: { th: "สายวิชาชีพ (VET)", en: "Vocational education (VET)" },
    short: { th: "VET", en: "VET" },
    desc: { th: "เรียนทักษะที่นำไปใช้กับงานได้โดยตรง ผ่านหลักสูตร Certificate หรือ Diploma", en: "Practical, job-focused skills through certificate or diploma courses." },
    closing: {
      th: "หลักสูตรสายวิชาชีพ (VET) จึงเป็นหนึ่งในตัวเลือกที่น่าสนใจ สำหรับเรียนทักษะที่นำไปใช้กับงานได้โดยตรง",
      en: "so a vocational (VET) course is one option worth considering for practical, job-focused skills.",
    },
  },
  he: {
    name: { th: "มหาวิทยาลัย / Higher Education", en: "University / Higher Education" },
    short: { th: "มหาวิทยาลัย", en: "University" },
    desc: { th: "Bachelor, Graduate Certificate, Master และหลักสูตรระดับมหาวิทยาลัย", en: "Bachelor, Graduate Certificate, Master and other university courses." },
    closing: {
      th: "การเรียนระดับมหาวิทยาลัยจึงเป็นหนึ่งในตัวเลือกที่น่าสนใจสำหรับเป้าหมายของคุณ",
      en: "so university study is one option worth considering for your goals.",
    },
  },
};

export type NextStepId = "checkEnglish" | "chooseField" | "compareBudget" | "planTiming" | "institutionRequirements" | "visaInfo";

export const nextStepCopy: Record<NextStepId, Bi> = {
  checkEnglish: { th: "เช็กระดับภาษาอังกฤษปัจจุบัน", en: "Check your current English level" },
  chooseField: { th: "เลือกสาขาที่สนใจ", en: "Choose the field you're interested in" },
  compareBudget: { th: "เปรียบเทียบค่าเรียนกับงบประมาณ", en: "Compare tuition with your budget" },
  planTiming: { th: "วางแผนเวลาสมัครให้ทันช่วงที่อยากเริ่มเรียน", en: "Plan your application around when you want to start" },
  institutionRequirements: { th: "ดูเงื่อนไขการสมัครของแต่ละสถาบัน", en: "Check each institution's entry requirements" },
  visaInfo: { th: "ศึกษาข้อมูลวีซ่าที่เกี่ยวข้องจากแหล่งข้อมูลทางการ", en: "Look up the related visa information from official sources" },
};

export const finderCopy = {
  title: { th: "ค้นหาเส้นทางเรียนที่เหมาะกับคุณ", en: "Find your study pathway" },
  subtitle: {
    th: "ตอบคำถามสั้น ๆ ไม่กี่ข้อ แล้วเราจะช่วยแนะนำเส้นทางเรียนในออสเตรเลียที่เหมาะกับเป้าหมายของคุณ",
    en: "Answer a few short questions and we'll suggest study pathways in Australia that fit your goals.",
  },
  step: { th: "ขั้นตอน {n} จาก {total}", en: "Step {n} of {total}" },
  next: { th: "ถัดไป", en: "Next" },
  back: { th: "ย้อนกลับ", en: "Back" },
  seeResults: { th: "ดูคำแนะนำ", en: "See suggestions" },
  startOver: { th: "เริ่มใหม่", en: "Start over" },

  qAge: { th: "ตอนนี้คุณอายุเท่าไหร่?", en: "How old are you?" },
  agePlaceholder: { th: "เช่น 24", en: "e.g. 24" },
  ageError: { th: "กรอกอายุเป็นตัวเลขระหว่าง 15–70 ปี", en: "Enter an age between 15 and 70." },
  qEnglish: { th: "ระดับภาษาอังกฤษของคุณตอนนี้เป็นอย่างไร?", en: "What is your English level now?" },
  englishHelper: {
    th: "หากใช้ผลสอบภาษาอังกฤษประเภทอื่น สามารถเลือกช่วงคะแนนที่ใกล้เคียงได้ในตอนนี้",
    en: "If you have a different English test, pick the closest range for now.",
  },
  qGoals: { th: "เป้าหมายหลักของคุณคืออะไร?", en: "What are your main goals?" },
  goalsHelper: { th: "เลือกได้มากกว่า 1 ข้อ", en: "Choose all that apply." },
  qCity: { th: "อยากเรียนที่เมืองไหนในออสเตรเลีย?", en: "Where in Australia would you like to study?" },
  qBudget: { th: "ตั้งงบค่าเรียนไว้ประมาณเท่าไหร่ต่อปี?", en: "Roughly what is your yearly tuition budget?" },
  qInterest: { th: "สนใจเรียนหลักสูตรแบบไหน?", en: "What kind of course interests you?" },
  qBackground: { th: "วุฒิการศึกษาสูงสุดและประสบการณ์ทำงานของคุณ", en: "Your highest qualification and work experience" },
  qualificationLabel: { th: "วุฒิการศึกษาสูงสุด", en: "Highest qualification" },
  experienceLabel: { th: "ประสบการณ์ทำงานกี่ปี?", en: "Years of work experience" },
  experienceError: { th: "กรอกจำนวนปีเป็นตัวเลข 0–50", en: "Enter a number from 0 to 50." },
  fieldLabel: { th: "ทำงานด้านไหน?", en: "What field do you work in?" },
  fieldPlaceholder: { th: "เช่น IT, Hospitality, Marketing", en: "e.g. IT, Hospitality, Marketing" },
  optional: { th: "(ไม่บังคับ)", en: "(optional)" },
  qTiming: { th: "ตอนนี้คุณวางแผนมาออสเตรเลียช่วงไหน?", en: "When are you planning to come to Australia?" },

  resultTitle: { th: "เส้นทางเรียนที่น่าสนใจสำหรับคุณ", en: "Study pathways worth exploring" },
  recommended: { th: "เส้นทางที่แนะนำ", en: "Suggested pathway" },
  tie: { th: "จากข้อมูลของคุณ มี 2 ทางเลือกที่น่าสนใจใกล้เคียงกัน", en: "Based on your answers, two options look similarly relevant." },
  fromAnswers: { th: "จากคำตอบของคุณ", en: "Based on your answers," },
  and: { th: " และ", en: " and " },
  whyTitle: { th: "ทำไมเราถึงแนะนำทางเลือกนี้?", en: "Why this suggestion?" },
  sequenceTitle: { th: "ตัวอย่างเส้นทางที่สามารถพิจารณาได้", en: "An example pathway you could consider" },
  alternativeTitle: { th: "อีกทางเลือกที่น่าสนใจ", en: "Another option worth a look" },
  budgetConstraint: {
    th: "เส้นทางนี้ค่อนข้างตรงกับเป้าหมายของคุณ แต่ค่าเรียนของบางหลักสูตรอาจสูงกว่างบที่ตั้งไว้",
    en: "This pathway fits your goals, but some courses may cost more than your budget.",
  },
  budgetIdeas: { th: "ลองพิจารณา", en: "You could" },
  budgetCompare: { th: "เปรียบเทียบค่าเรียนของแต่ละสถาบัน", en: "Compare fees across institutions" },
  budgetVet: { th: "ดูทางเลือกสายวิชาชีพ (VET)", en: "Look at vocational (VET) options" },
  budgetTalk: { th: "คุยกับทีม Beyond Study Center", en: "Talk with the Beyond Study Center team" },
  downgradeNote: {
    th: "หากกำลังพิจารณาหลักสูตรที่อยู่ในระดับต่ำกว่าวุฒิเดิม ควรดูว่าหลักสูตรนั้นเชื่อมโยงกับเป้าหมายด้านอาชีพของคุณอย่างไร",
    en: "If you're considering a course below your current qualification level, check how it connects to your career goals.",
  },
  nextTitle: { th: "สิ่งที่ควรทำต่อ", en: "What to do next" },
  cityNote: { th: "เมืองที่สนใจ: {city}", en: "Preferred city: {city}" },
  primaryCta: { th: "ติดต่อปรึกษาเราได้เลย", en: "Contact us for advice" },
  visaBridgeTitle: { th: "กำลังวางแผนเรื่องวีซ่าด้วย?", en: "Planning your visa too?" },
  visaBridgeCta: { th: "สำรวจตัวเลือกวีซ่าที่เกี่ยวข้อง", en: "Explore related visa options" },
  consultTitle: { th: "ยังไม่แน่ใจว่าจะเริ่มจากตรงไหน?", en: "Not sure where to start?" },
  consultSub: {
    th: "ทีม Beyond Study Center ช่วยดูตัวเลือกหลักสูตรและวางแผนเส้นทางเรียนเบื้องต้นให้คุณได้",
    en: "The Beyond Study Center team can help you look at course options and plan a study pathway.",
  },
  consultLine: { th: "ปรึกษาฟรีทาง LINE", en: "Free chat on LINE" },
  disclaimer: {
    th: "คำแนะนำนี้เป็นข้อมูลเบื้องต้นจากคำตอบที่คุณให้ไว้ หลักสูตรและเงื่อนไขการสมัครแตกต่างกันในแต่ละสถาบัน ควรตรวจสอบรายละเอียดอีกครั้งก่อนตัดสินใจ",
    en: "These suggestions are general guidance based on your answers. Courses and entry requirements differ between institutions, so check the details before you decide.",
  },
  migrationNote: {
    th: "หากต้องการคำแนะนำด้านวีซ่าหรือการย้ายถิ่นฐาน ควรตรวจสอบกับผู้ให้คำแนะนำที่มีคุณสมบัติเหมาะสม",
    en: "For visa or migration advice, check with a suitably qualified adviser.",
  },
} satisfies Record<string, Bi>;
