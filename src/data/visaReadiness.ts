// Content for the Visa Readiness Check (Study → "strength" tab).
// Scoring weights and directions are unchanged from the original Visa Strength
// Assessment; see src/lib/visaReadiness.ts for the calculation.
//
// Thai copy: strings supplied by the owner (2026-09-25) are used verbatim.
// Everything else is a draft listed in docs/qa/thai-review-visa-readiness.md
// for the external Thai editor.

import type { Language } from "@/i18n/translations";

export type Bi = Record<Language, string>;
export type ReadinessLevel = "high" | "medium" | "low";

export const pick = (b: Bi, lang: Language) => b[lang];

export interface ReadinessFactor {
  id: string;
  weight: number;
  /** true = a higher slider value means LESS concern */
  inverted?: boolean;
  label: Bi;
  /** Slider ends: `left` is value 0, `right` is value 100. */
  input: { left: Bi; leftHint: Bi; right: Bi; rightHint: Bi };
  /** Short result line for the visitor's current level. */
  result: Record<ReadinessLevel, Bi>;
  why: Bi;
  prepare: Bi[];
  /** One-line "what to do" for the priority card. */
  priority: Bi;
  action: { title: Bi; desc: Bi };
}

export const readinessFactors: ReadinessFactor[] = [
  {
    id: "age",
    weight: 1,
    label: { th: "อายุ", en: "Age" },
    input: {
      left: { th: "อายุน้อย", en: "Younger" },
      leftHint: { th: "ต่ำกว่า 25 ปี", en: "Under 25" },
      right: { th: "อายุมาก", en: "Older" },
      rightHint: { th: "มากกว่า 35 ปี", en: "Over 35" },
    },
    result: {
      low: { th: "อายุอยู่ในช่วงทั่วไปของผู้สมัครเรียน", en: "Your age is typical for student applicants" },
      medium: { th: "อายุสูงกว่าช่วงทั่วไปของผู้สมัครเรียนเล็กน้อย", en: "Your age is a little above the typical student range" },
      high: { th: "อายุสูงกว่าช่วงทั่วไปของผู้สมัครเรียน", en: "Your age is above the typical student range" },
    },
    why: {
      th: "อายุเพียงอย่างเดียวไม่ได้เป็นตัวตัดสินผลการสมัคร แต่ควรสามารถอธิบายได้ว่าการเรียนในช่วงนี้สอดคล้องกับเส้นทางการศึกษาและอาชีพของคุณอย่างไร",
      en: "Age alone does not decide an application, but you should be able to explain how studying now fits your education and career path.",
    },
    prepare: [
      { th: "เหตุผลที่เลือกเรียนในช่วงนี้", en: "Why you are choosing to study now" },
      { th: "ความเชื่อมโยงระหว่างหลักสูตรกับประสบการณ์ที่ผ่านมา", en: "How the course links to your past experience" },
      { th: "เป้าหมายอาชีพหลังเรียนจบ", en: "Your career goal after graduating" },
    ],
    priority: {
      th: "อธิบายว่าการเรียนในช่วงนี้สอดคล้องกับเส้นทางการศึกษาและอาชีพของคุณอย่างไร",
      en: "Explain how studying now fits your education and career path.",
    },
    action: {
      title: { th: "อธิบายเหตุผลที่เรียนในช่วงนี้", en: "Explain why you are studying now" },
      desc: { th: "เชื่อมโยงการเรียนกับประสบการณ์และเป้าหมายอาชีพของคุณ", en: "Link the course to your experience and career goals." },
    },
  },
  {
    id: "studyGap",
    weight: 1.2,
    label: { th: "ระยะเวลาที่เว้นจากการเรียน", en: "Study gap" },
    input: {
      left: { th: "เพิ่งเรียนจบ", en: "Recent study" },
      leftHint: { th: "ไม่ได้เว้นช่วงการเรียน", en: "No gap" },
      right: { th: "เว้นมานาน", en: "Long gap" },
      rightHint: { th: "5 ปีขึ้นไป", en: "5+ years" },
    },
    result: {
      low: { th: "เรียนต่อเนื่อง / เพิ่งจบการศึกษา", en: "Continuous study / recently graduated" },
      medium: { th: "เว้นจากการเรียนมาระยะหนึ่ง", en: "Some time away from study" },
      high: { th: "เว้นจากการเรียนมานาน", en: "A long time away from study" },
    },
    why: {
      th: "การเว้นช่วงการเรียนเป็นเวลานานไม่ได้หมายความว่าจะมีปัญหาในการสมัคร แต่ควรอธิบายให้เห็นว่าช่วงที่ผ่านมาได้ทำอะไร และทำไมการกลับมาเรียนในตอนนี้จึงสอดคล้องกับเส้นทางของคุณ",
      en: "A long study gap does not mean your application will have problems, but you should explain what you did in that time and why returning to study now fits your path.",
    },
    prepare: [
      { th: "ประวัติการทำงานหรือกิจกรรมในช่วงที่ผ่านมา", en: "Your work history or activities during the gap" },
      { th: "เหตุผลที่ตัดสินใจกลับมาเรียนในตอนนี้", en: "Why you decided to return to study now" },
      { th: "ความเชื่อมโยงระหว่างหลักสูตรและเป้าหมายอาชีพ", en: "How the course links to your career goals" },
    ],
    priority: {
      th: "อธิบายว่าช่วงที่ผ่านมาได้ทำงานหรือทำกิจกรรมอะไร และเหตุใดจึงต้องการกลับมาเรียนในตอนนี้",
      en: "Explain what work or activities you did in the gap, and why you want to return to study now.",
    },
    action: {
      title: { th: "อธิบายช่วงที่เว้นจากการเรียน", en: "Explain your study gap" },
      desc: { th: "ระบุว่าช่วงดังกล่าวทำงาน เรียนเพิ่มเติม หรือทำกิจกรรมอะไร", en: "Say whether you worked, studied or did other activities during that time." },
    },
  },
  {
    id: "downgrade",
    weight: 1.3,
    label: { th: "ระดับการศึกษาที่กำลังจะเรียน", en: "Level of the new course" },
    input: {
      left: { th: "ระดับเดิมหรือสูงขึ้น", en: "Same or higher level" },
      leftHint: { th: "เช่น ปริญญาตรี → ปริญญาโท", en: "e.g. Bachelor → Master" },
      right: { th: "ระดับที่ต่ำลง", en: "Lower level" },
      rightHint: { th: "เช่น ปริญญาโท → Diploma", en: "e.g. Master → Diploma" },
    },
    result: {
      low: { th: "เรียนต่อในระดับเดิมหรือสูงขึ้น", en: "Studying at the same or a higher level" },
      medium: { th: "ระดับการศึกษาใหม่อาจต้องอธิบายเหตุผลเพิ่มเติม", en: "The new course level may need some explanation" },
      high: { th: "เรียนในระดับที่ต่ำลง", en: "Studying at a lower level" },
    },
    why: {
      th: "หากเลือกระดับการศึกษาที่ต่ำกว่าวุฒิเดิม ควรมีเหตุผลที่ชัดเจนว่าหลักสูตรใหม่นี้จะช่วยเติมเต็มทักษะหรือเชื่อมโยงกับเป้าหมายด้านอาชีพอย่างไร",
      en: "If you choose a lower level than your current qualification, give a clear reason how the new course adds skills or connects to your career goals.",
    },
    prepare: [
      { th: "เหตุผลที่เลือกหลักสูตรระดับนี้", en: "Why you chose a course at this level" },
      { th: "ทักษะที่หลักสูตรนี้จะช่วยเติมเต็ม", en: "The skills this course will add" },
      { th: "ความเชื่อมโยงกับเป้าหมายอาชีพ", en: "How it connects to your career goals" },
    ],
    priority: {
      th: "อธิบายว่าหลักสูตรนี้จะช่วยเติมเต็มทักษะหรือเชื่อมโยงกับเป้าหมายอาชีพอย่างไร",
      en: "Explain how this course adds skills or connects to your career goals.",
    },
    action: {
      title: { th: "อธิบายเหตุผลที่เลือกหลักสูตรนี้", en: "Explain why you chose this course" },
      desc: { th: "แสดงให้เห็นว่าหลักสูตรช่วยเติมเต็มความรู้หรือทักษะใด", en: "Show which knowledge or skills the course adds." },
    },
  },
  {
    id: "fieldChange",
    weight: 1,
    label: { th: "ความเกี่ยวข้องของสาขาที่เลือก", en: "Relevance of your chosen field" },
    input: {
      left: { th: "สายเดิม หรือมีเหตุผลเชื่อมโยง", en: "Same field or clear link" },
      leftHint: { th: "มีประสบการณ์หรือแผนอาชีพรองรับ", en: "Backed by experience or a career plan" },
      right: { th: "คนละสาย ไม่มีเหตุผลรองรับ", en: "Unrelated field, no reason" },
      rightHint: { th: "ยังอธิบายไม่ได้ว่าทำไมเปลี่ยนสาย", en: "No clear reason for the switch yet" },
    },
    result: {
      low: { th: "เรียนในสายเดิม หรือมีเหตุผลเชื่อมโยงชัดเจน", en: "Same field, or a clearly explained link" },
      medium: { th: "สาขาที่เลือกยังเชื่อมโยงกับประวัติเดิมได้ไม่ชัดเจนนัก", en: "The link between your new field and your background is not yet clear" },
      high: { th: "เปลี่ยนไปเรียนคนละสายโดยไม่มีเหตุผลรองรับ", en: "Switching to an unrelated field without a supporting reason" },
    },
    why: {
      th: "หากเปลี่ยนสายการเรียน ควรอธิบายความเชื่อมโยงกับประสบการณ์ที่ผ่านมา ความสนใจ หรือแผนอาชีพในอนาคต",
      en: "If you are changing fields, explain how it connects to your past experience, interests or future career plans.",
    },
    prepare: [
      { th: "ประสบการณ์หรือความสนใจที่เกี่ยวข้องกับสาขาใหม่", en: "Experience or interests related to the new field" },
      { th: "เหตุผลที่ตัดสินใจเปลี่ยนสาย", en: "Why you decided to change fields" },
      { th: "แผนอาชีพที่ใช้ความรู้จากสาขานี้", en: "A career plan that uses this field" },
    ],
    priority: {
      th: "อธิบายความเชื่อมโยงระหว่างสาขาใหม่กับประสบการณ์และแผนอาชีพ",
      en: "Explain how the new field links to your experience and career plan.",
    },
    action: {
      title: { th: "อธิบายเหตุผลที่เลือกสาขานี้", en: "Explain why you chose this field" },
      desc: { th: "เชื่อมโยงสาขาใหม่กับประสบการณ์ ความสนใจ หรือแผนอาชีพ", en: "Link the new field to your experience, interests or career plan." },
    },
  },
  {
    id: "immigrationHistory",
    weight: 1.5,
    label: { th: "ประวัติด้านวีซ่าและการเดินทาง", en: "Visa and travel history" },
    input: {
      left: { th: "ไม่มีประวัติที่ต้องกังวล", en: "No concerns" },
      leftHint: { th: "ไม่เคยมีปัญหาด้านวีซ่า", en: "No visa problems before" },
      right: { th: "เคยมีปัญหาด้านวีซ่า", en: "Past visa problems" },
      rightHint: { th: "เช่น ถูกปฏิเสธวีซ่า อยู่เกินกำหนด หรือทำผิดเงื่อนไข", en: "e.g. refusals, overstays or breaches" },
    },
    result: {
      low: { th: "ไม่มีประวัติที่ต้องกังวล", en: "No history of concern" },
      medium: { th: "มีประวัติด้านวีซ่าบางอย่างที่ควรอธิบาย", en: "Some visa history that should be explained" },
      high: { th: "เคยมีปัญหาด้านวีซ่า", en: "Past visa problems" },
    },
    why: {
      th: "หากเคยมีประวัติ เช่น ถูกปฏิเสธวีซ่า ถูกยกเลิกวีซ่า หรือไม่ปฏิบัติตามเงื่อนไขวีซ่า ควรให้ข้อมูลอย่างครบถ้วนและตรงไปตรงมา หากไม่แน่ใจ ควรปรึกษา Registered Migration Agent",
      en: "If you have been refused a visa, had a visa cancelled, or not met visa conditions, give complete and honest information. If you are unsure, talk to a registered migration agent.",
    },
    prepare: [
      { th: "รายละเอียดวีซ่าที่เคยยื่นและผลการพิจารณา", en: "Details of past visa applications and outcomes" },
      { th: "เอกสารที่เกี่ยวข้อง เช่น หนังสือแจ้งผลการปฏิเสธ", en: "Related documents, such as refusal letters" },
      { th: "คำอธิบายสิ่งที่เปลี่ยนไปจากครั้งก่อน", en: "What has changed since then" },
    ],
    priority: {
      th: "ให้ข้อมูลประวัติวีซ่าอย่างครบถ้วน และเตรียมเอกสารที่เกี่ยวข้อง",
      en: "Give complete visa history and prepare the related documents.",
    },
    action: {
      title: { th: "เตรียมข้อมูลประวัติวีซ่า", en: "Prepare your visa history" },
      desc: { th: "รวบรวมรายละเอียดและเอกสารของวีซ่าที่เคยยื่น และอธิบายอย่างตรงไปตรงมา", en: "Collect details and documents for past visas and explain them honestly." },
    },
  },
  {
    id: "timeInAustralia",
    weight: 1,
    label: { th: "ระยะเวลาที่เคยอยู่ในออสเตรเลีย", en: "Time already spent in Australia" },
    input: {
      left: { th: "ไม่เคยอยู่ หรืออยู่ไม่นาน", en: "None or short" },
      leftHint: { th: "มาครั้งแรก หรือเคยมาระยะสั้น", en: "First visit or a short stay" },
      right: { th: "อยู่มาหลายปี", en: "Several years" },
      rightHint: { th: "อยู่ในออสเตรเลียมาแล้วหลายปี", en: "Already in Australia for years" },
    },
    result: {
      low: { th: "ไม่เคยอยู่ หรือเคยอยู่ไม่นาน", en: "Never stayed, or only a short stay" },
      medium: { th: "เคยอยู่ในออสเตรเลียมาระยะหนึ่ง", en: "Some time already spent in Australia" },
      high: { th: "เคยอยู่ในออสเตรเลียเป็นเวลานาน", en: "A long time already spent in Australia" },
    },
    why: {
      th: "หากเคยอยู่ในออสเตรเลียต่อเนื่องหลายปี ควรสามารถอธิบายได้ว่าการเรียนหลักสูตรใหม่นี้สอดคล้องกับเส้นทางของคุณอย่างไร",
      en: "If you have been in Australia for several years, you should be able to explain how this new course fits your path.",
    },
    prepare: [
      { th: "สรุปวีซ่าและสิ่งที่ทำระหว่างอยู่ออสเตรเลีย", en: "A summary of your visas and what you did in Australia" },
      { th: "เหตุผลที่ต้องเรียนหลักสูตรใหม่นี้", en: "Why you need this new course" },
      { th: "ความก้าวหน้าจากการเรียนหรือทำงานที่ผ่านมา", en: "Progress from your past study or work" },
    ],
    priority: {
      th: "อธิบายว่าหลักสูตรใหม่ต่อยอดจากสิ่งที่ทำในออสเตรเลียอย่างไร",
      en: "Explain how the new course builds on what you have done in Australia.",
    },
    action: {
      title: { th: "อธิบายช่วงเวลาที่อยู่ในออสเตรเลีย", en: "Explain your time in Australia" },
      desc: { th: "สรุปสิ่งที่ทำที่ผ่านมา และเหตุผลที่หลักสูตรใหม่เหมาะกับเส้นทางของคุณ", en: "Summarise what you have done and why the new course suits your path." },
    },
  },
  {
    id: "evidence",
    weight: 0.8,
    inverted: true,
    label: { th: "ความพร้อมของเอกสารประกอบ", en: "Supporting documents" },
    input: {
      left: { th: "ยังไม่มีเอกสารรองรับ", en: "No documents yet" },
      leftHint: { th: "ข้อมูลส่วนใหญ่ยังเป็นการบอกเล่า", en: "Mostly self-declared" },
      right: { th: "มีเอกสารยืนยันชัดเจน", en: "Clear documents" },
      rightHint: { th: "เช่น Transcript หนังสือรับรองการทำงาน", en: "e.g. transcripts, employer letters" },
    },
    result: {
      low: { th: "มีเอกสารยืนยันชัดเจน", en: "Clear supporting documents" },
      medium: { th: "มีเอกสารบางส่วน แต่ยังไม่ครบ", en: "Some documents, but not all" },
      high: { th: "ยังมีข้อมูลที่ไม่มีเอกสารรองรับ", en: "Some information has no supporting documents" },
    },
    why: {
      th: "ควรเตรียมเอกสารที่เกี่ยวข้อง เช่น Transcript หนังสือรับรองการทำงาน หลักฐานทางการเงิน หรือเอกสารจากสถาบัน เพื่อสนับสนุนข้อมูลที่ให้ไว้",
      en: "Prepare related documents, such as transcripts, employer letters, financial evidence or letters from institutions, to support what you say.",
    },
    prepare: [
      { th: "Transcript และวุฒิการศึกษา", en: "Transcripts and qualifications" },
      { th: "หนังสือรับรองการทำงาน", en: "Employer reference letters" },
      { th: "หลักฐานทางการเงิน และเอกสารจากสถาบัน", en: "Financial evidence and institution letters" },
    ],
    priority: {
      th: "เตรียม Transcript หนังสือรับรองการทำงาน และหลักฐานทางการเงินให้พร้อม",
      en: "Get your transcripts, employer letters and financial evidence ready.",
    },
    action: {
      title: { th: "เตรียมเอกสารสนับสนุน", en: "Prepare supporting documents" },
      desc: { th: "เช่น Transcript หนังสือรับรองการทำงาน และหลักฐานทางการเงิน", en: "e.g. transcripts, employer letters and financial evidence." },
    },
  },
  {
    id: "postStudyPlans",
    weight: 1.1,
    inverted: true,
    label: { th: "แผนหลังเรียนจบ", en: "Post-study plans" },
    input: {
      left: { th: "ยังไม่มีแผนชัดเจน", en: "No clear plan" },
      leftHint: { th: "ยังไม่รู้ว่าจะทำอะไรหลังเรียนจบ", en: "Not sure what to do after graduating" },
      right: { th: "มีเป้าหมายชัดเจน", en: "Clear goal" },
      rightHint: { th: "มีเส้นทางอาชีพหรือการเรียนต่อที่ชัดเจน", en: "A clear career or further-study path" },
    },
    result: {
      low: { th: "มีเป้าหมายหลังเรียนจบชัดเจน", en: "Clear goals after graduating" },
      medium: { th: "มีแผนหลังเรียนจบคร่าวๆ แต่ยังไม่ละเอียด", en: "A rough plan after graduating, not yet detailed" },
      high: { th: "แผนหลังเรียนจบยังไม่ชัดเจน", en: "Post-study plans are not yet clear" },
    },
    why: {
      th: "ควรอธิบายว่าหลังจบการศึกษา คุณต้องการนำความรู้และทักษะที่ได้รับไปใช้กับเส้นทางอาชีพอย่างไร",
      en: "Explain how you plan to use the knowledge and skills from the course in your career after graduating.",
    },
    prepare: [
      { th: "ตำแหน่งงานหรือสายอาชีพที่ตั้งเป้าไว้", en: "The role or career you are aiming for" },
      { th: "ทักษะจากหลักสูตรที่จะนำไปใช้", en: "Skills from the course you will use" },
      { th: "ข้อมูลตลาดงานหรือโอกาสที่เกี่ยวข้อง", en: "Related job-market information or opportunities" },
    ],
    priority: {
      th: "ทำให้เห็นความเชื่อมโยงระหว่างหลักสูตรและเส้นทางอาชีพหลังเรียนอย่างชัดเจน",
      en: "Show a clear link between the course and your career path after study.",
    },
    action: {
      title: { th: "วางแผนอาชีพหลังเรียนจบ", en: "Plan your career after graduating" },
      desc: { th: "อธิบายว่าหลักสูตรเชื่อมโยงกับเป้าหมายในอนาคตอย่างไร", en: "Explain how the course connects to your future goals." },
    },
  },
];

export const levelLabels: Record<ReadinessLevel, Bi> = {
  high: { th: "ควรตรวจสอบเป็นพิเศษ", en: "Check carefully" },
  medium: { th: "ควรเตรียมข้อมูลเพิ่มเติม", en: "Prepare more information" },
  low: { th: "ไม่มีข้อกังวลเด่นชัด", en: "No clear concern" },
};

/** Summary metric labels (the number is shown before the label). */
export const levelMetricLabels: Record<ReadinessLevel, Bi> = {
  high: { th: "ประเด็นที่ควรตรวจสอบเป็นพิเศษ", en: "to check carefully" },
  medium: { th: "ประเด็นที่ควรเตรียมเพิ่มเติม", en: "to prepare more for" },
  low: { th: "ประเด็นไม่มีข้อกังวลเด่นชัด", en: "with no clear concern" },
};

export type VerdictBand = "strong" | "some" | "several" | "many" | "serious";

export const verdicts: Record<VerdictBand, { title: Bi; desc: Bi }> = {
  strong: {
    title: { th: "ภาพรวมค่อนข้างพร้อม", en: "You look well prepared overall" },
    desc: {
      th: "จากข้อมูลที่คุณกรอก ยังไม่พบประเด็นที่ต้องกังวลเด่นชัด ควรเตรียมเอกสารให้ครบและอธิบายเป้าหมายการเรียนให้ชัดเจน",
      en: "Based on your answers, there are no clear concerns. Keep your documents complete and explain your study goals clearly",
    },
  },
  some: {
    title: { th: "มีบางจุดที่ควรเตรียมเพิ่มเติม", en: "A few points need more preparation" },
    desc: {
      th: "จากข้อมูลที่คุณกรอก มีบางประเด็นที่อาจต้องอธิบายหรือเตรียมหลักฐานเพิ่มเติม",
      en: "Based on your answers, a few points may need more explanation or evidence",
    },
  },
  several: {
    title: { th: "มีหลายจุดที่ควรเตรียมเพิ่มเติม", en: "Several points need more preparation" },
    desc: {
      th: "จากข้อมูลที่คุณกรอก มีหลายประเด็นที่ควรอธิบายหรือเตรียมหลักฐานเพิ่มเติม การขอคำแนะนำจากผู้เชี่ยวชาญจะช่วยให้เตรียมตัวได้ครบขึ้น",
      en: "Based on your answers, several points need more explanation or evidence. Professional guidance can help you prepare fully",
    },
  },
  many: {
    title: { th: "ควรเตรียมตัวเพิ่มเติมก่อนยื่น", en: "Prepare more before you apply" },
    desc: {
      th: "จากข้อมูลที่คุณกรอก มีหลายประเด็นที่ควรเตรียมให้พร้อมก่อนยื่น แนะนำให้ปรึกษา Registered Migration Agent",
      en: "Based on your answers, many points should be ready before you apply. We recommend talking to a registered migration agent",
    },
  },
  serious: {
    title: { th: "ควรปรึกษาผู้เชี่ยวชาญก่อนยื่น", en: "Get professional advice before you apply" },
    desc: {
      th: "จากข้อมูลที่คุณกรอก มีประเด็นสำคัญหลายข้อที่ควรเตรียม แนะนำให้ขอคำแนะนำจาก Registered Migration Agent ก่อนยื่นวีซ่า",
      en: "Based on your answers, several important points need preparation. We recommend advice from a registered migration agent before applying",
    },
  },
};

export const readinessCopy = {
  title: { th: "เช็กความพร้อมก่อนยื่นวีซ่า", en: "Visa readiness check" },
  subtitle: {
    th: "ดูว่ามีจุดไหนที่ควรเตรียมเพิ่มเติม พร้อมคำแนะนำเบื้องต้นก่อนยื่นวีซ่า",
    en: "See which points to prepare further, with basic guidance before you apply for a visa.",
  },
  bannerTitle: { th: "อยากปรึกษาเรื่องเรียนต่อออสเตรเลีย?", en: "Want to talk about studying in Australia?" },
  bannerCta: { th: "ปรึกษาฟรี", en: "Free consultation" },
  disclaimer: {
    th: "ผลการประเมินนี้เป็นเพียงข้อมูลเบื้องต้น เพื่อช่วยให้คุณเห็นประเด็นที่ควรเตรียมเพิ่มเติม ไม่ใช่คำแนะนำด้านกฎหมายหรือการย้ายถิ่นฐาน และไม่สามารถใช้คาดการณ์ผลการพิจารณาวีซ่าได้ เนื่องจากแต่ละเคสจะได้รับการพิจารณาเป็นรายบุคคลโดย Department of Home Affairs",
    en: "This is a general self-check to help you see what to prepare. It is not legal or migration advice and cannot predict a visa decision, because every case is assessed individually by the Department of Home Affairs.",
  },
  questionsTitle: { th: "ตอบคำถามสั้นๆ 8 ข้อ", en: "Answer 8 quick questions" },
  questionsHint: {
    th: "เลื่อนแถบให้ใกล้กับสถานการณ์ของคุณมากที่สุด",
    en: "Move each slider to the point closest to your situation.",
  },
  seeResult: { th: "ดูผลความพร้อม", en: "See my readiness" },
  editAnswers: { th: "แก้ไขคำตอบ", en: "Edit answers" },
  scoreLabel: { th: "คะแนนความพร้อม", en: "Readiness score" },
  scoreNote: {
    th: "คะแนนนี้ช่วยจัดลำดับสิ่งที่ควรเตรียม ไม่ใช่โอกาสที่วีซ่าจะผ่าน",
    en: "This score helps you prioritise what to prepare. It is not a chance of visa approval.",
  },
  especially: { th: " โดยเฉพาะ", en: ", especially " },
  and: { th: "และ", en: " and " },
  priorityTitle: { th: "สิ่งที่ควรเตรียมก่อนยื่นวีซ่า", en: "What to prepare before applying" },
  priorityEmpty: {
    th: "ยังไม่พบประเด็นที่ต้องเตรียมเป็นพิเศษ ควรเตรียมเอกสารประกอบให้ครบ และอธิบายเป้าหมายการเรียนให้ชัดเจน",
    en: "No points stand out. Keep your supporting documents complete and explain your study goals clearly.",
  },
  seeAll: { th: "ดูคำแนะนำทั้งหมด", en: "See all guidance" },
  detailsTitle: { th: "รายละเอียดการประเมิน", en: "Assessment details" },
  itemsCount: { th: "{n} ประเด็น", en: "{n} items" },
  whyTitle: { th: "ทำไมเรื่องนี้จึงควรอธิบาย?", en: "Why this matters" },
  prepareTitle: { th: "สิ่งที่ควรเตรียม", en: "What to prepare" },
  planTitle: { th: "สิ่งที่คุณควรเตรียมเพิ่มเติม", en: "Your preparation plan" },
  ctaTitle: {
    th: "ยังไม่แน่ใจว่าเคสของคุณควรเตรียมอะไรเพิ่มเติม?",
    en: "Not sure what your case needs?",
  },
  ctaSub: { th: "ปรึกษาทีม Beyond Study Center ได้ฟรี", en: "Talk to the Beyond Study Center team for free." },
  ctaPrimary: { th: "ปรึกษาฟรี", en: "Free consultation" },
} satisfies Record<string, Bi>;
