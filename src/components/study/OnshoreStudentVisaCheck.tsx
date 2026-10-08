'use client'

import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  ShieldCheck, ArrowRight, ExternalLink, CheckCircle2, ChevronDown,
  PlaneTakeoff, BadgeCheck, MessageCircle, Search, Info, Pencil,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/i18n/LanguageProvider";
import type { Language } from "@/i18n/translations";
import { LINE_URL } from "../shared/BSCConsultationCTA";
import { STUDENT_VISA_ONSHORE_RULE } from "@/data/studyVisaRules";
import { formatDayMonthYear } from "@/lib/plannerDates";
import {
  type CurrentVisa, type StudyPlan, type OnshoreOutcome, type OutcomeTone,
  CURRENT_VISAS, STUDY_PLANS, OUTCOME_TONE, needsStudyPlan, onshoreOutcome,
} from "@/lib/onshoreStudentVisa";

// Owner-supplied copy (2026-10-04). Thai wording is the owner's own, not an
// editor suggestion; see docs/qa/changes.md.
interface OutcomeCopy {
  status: string;
  description: string;
  extra?: string;
  cta?: string;
}

const copy = (lang: Language) => {
  const rule = STUDENT_VISA_ONSHORE_RULE.effective;
  const dateShort = formatDayMonthYear(lang, rule, "short");
  const dateLong = formatDayMonthYear(lang, rule);
  if (lang === "th") {
    return {
      alert: {
        badge: `อัปเดตกฎวีซ่า • ${dateShort}`,
        headline: "กฎ Student Visa สำหรับการยื่นในออสเตรเลียมีการเปลี่ยนแปลง",
        description: "หากคุณอยู่ในออสเตรเลียและกำลังวางแผนยื่น Student Visa ใหม่ คุณอาจไม่สามารถยื่นจากในประเทศได้ ขึ้นอยู่กับวีซ่าที่ถืออยู่และหลักสูตรที่ต้องการเรียนต่อ",
        cta: "เช็กว่าฉันยื่น Onshore ได้ไหม",
        source: "อ้างอิงข้อมูลจาก Australian Department of Home Affairs",
      },
      panel: {
        heading: "คุณกำลังวางแผนยื่น Student Visa จากในออสเตรเลีย",
        description: `ตั้งแต่วันที่ ${dateLong} มีข้อจำกัดใหม่สำหรับการยื่น Student Visa แบบ Onshore กรุณาตรวจสอบวีซ่าปัจจุบันของคุณก่อนดำเนินการต่อ`,
        visaQuestion: "ตอนนี้คุณถือวีซ่าอะไรอยู่?",
        planQuestion: "คุณกำลังวางแผนเรียนต่อแบบไหน?",
        change: "แก้ไขคำตอบ",
      },
      visas: {
        "500": "Student Visa (Subclass 500)",
        "462": "Work and Holiday Visa (Subclass 462)",
        "485": "Temporary Graduate Visa (Subclass 485)",
        "600": "Visitor Visa (Subclass 600)",
        other: "วีซ่าอื่น ๆ",
      } satisfies Record<CurrentVisa, string>,
      plans: {
        continue: "เรียนหลักสูตรเดิมต่อเพื่อให้จบ",
        higher: "เรียนต่อในระดับคุณวุฒิที่สูงขึ้น",
        same: "เรียนหลักสูตรใหม่ในระดับเดียวกัน",
        phd: "กำลังจะเรียน PhD",
        unsure: "อื่น ๆ / ไม่แน่ใจ",
      } satisfies Record<StudyPlan, string>,
      outcomes: {
        whm462: {
          status: "ต้องยื่นจากนอกออสเตรเลีย",
          description: `ผู้ถือ Work and Holiday Visa (Subclass 462) ไม่สามารถยื่น Student Visa ใหม่จากในออสเตรเลียได้ภายใต้กฎที่มีผลตั้งแต่ ${dateLong}`,
          extra: "คุณจะต้องออกจากออสเตรเลียและยื่น Student Visa จากต่างประเทศ",
        },
        grad485: {
          status: "ต้องยื่นจากนอกออสเตรเลีย",
          description: "ผู้ถือ Temporary Graduate Visa (Subclass 485) ไม่สามารถยื่น Student Visa ใหม่จากในออสเตรเลียได้",
        },
        visitor600: {
          status: "ต้องยื่นจากนอกออสเตรเลีย",
          description: "ผู้ถือ Visitor Visa (Subclass 600) ไม่สามารถยื่น Student Visa ใหม่จากในออสเตรเลียได้",
        },
        otherVisa: {
          status: "ต้องตรวจสอบเพิ่มเติม",
          description: "สิทธิ์ในการยื่น Student Visa จากในออสเตรเลียขึ้นอยู่กับวีซ่าที่คุณถืออยู่และเงื่อนไขของวีซ่านั้น",
          cta: "ตรวจสอบกับที่ปรึกษา",
        },
        studentContinue: {
          status: "อาจยื่น Onshore ได้",
          description: "หากคุณต้องใช้เวลาเพิ่มไม่เกิน 12 เดือนเพื่อเรียนหลักสูตรเดิมให้จบ และยังเรียนกับสถานศึกษาเดิม คุณอาจเข้าเงื่อนไขยกเว้น",
        },
        studentHigher: {
          status: "อาจยื่น Onshore ได้",
          description: "หากหลักสูตรใหม่เป็นการเรียนต่อไปยังคุณวุฒิที่สูงขึ้น คุณอาจเข้าเงื่อนไขยกเว้นสำหรับการยื่น Student Visa จากในออสเตรเลีย",
          extra: "ตัวอย่าง: Bachelor → Master",
        },
        studentSame: {
          status: "โดยทั่วไปต้องยื่นจากนอกออสเตรเลีย",
          description: "การเริ่มหลักสูตรใหม่ในระดับคุณวุฒิเดียวกันโดยทั่วไปไม่ถือเป็นการเรียนต่อไปยังระดับที่สูงขึ้น",
          extra: "ตัวอย่าง: Master → Master",
        },
        studentPhd: {
          status: "อาจยื่น Onshore ได้",
          description: "ผู้สมัครที่กำลังจะเรียนหลักสูตรระดับ PhD อาจเข้าเงื่อนไขยกเว้นสำหรับการยื่นจากในออสเตรเลีย",
        },
        studentUnsure: {
          status: "ควรตรวจสอบเพิ่มเติม",
          description: "กรณีของคุณอาจขึ้นอยู่กับระดับ AQF หลักสูตรเดิม หลักสูตรใหม่ และผู้ให้บริการการศึกษา",
          cta: "ให้ Beyond ช่วยตรวจสอบ",
        },
      } satisfies Record<OnshoreOutcome, OutcomeCopy>,
      thaiNote: {
        heading: "ข้อมูลเพิ่มเติมสำหรับผู้สมัครสัญชาติไทย",
        body: "ประเทศไทยอยู่ในกลุ่มประเทศ ASEAN ที่อาจได้รับข้อยกเว้นบางประการเกี่ยวกับการรวมคู่สมรสหรือบุตรไว้ใน Student Visa application อย่างไรก็ตาม เงื่อนไขครอบครัวและเงื่อนไขการยื่น Onshore เป็นคนละส่วนกัน และควรตรวจสอบแยกกัน",
      },
      disclaimer: "ข้อมูลนี้จัดทำขึ้นเพื่อช่วยวางแผนเบื้องต้นเท่านั้น ไม่ใช่คำแนะนำด้านกฎหมายหรือคำแนะนำด้านการย้ายถิ่นฐาน กรุณาตรวจสอบข้อมูลล่าสุดกับ Department of Home Affairs หรือผู้ให้คำปรึกษาที่ได้รับอนุญาตก่อนยื่นวีซ่า",
    };
  }
  return {
    alert: {
      badge: `Visa rule update • ${dateShort}`,
      headline: "Student Visa rules for applications in Australia have changed",
      description: "If you are currently in Australia and planning to apply for a new Student Visa, you may no longer be eligible to apply onshore. This depends on your current visa and your intended course of study.",
      cta: "Check my onshore eligibility",
      source: "Based on information from the Australian Department of Home Affairs",
    },
    panel: {
      heading: "You are planning to apply for a Student Visa from within Australia",
      description: `From ${dateLong}, new restrictions apply to some onshore Student Visa applications. Check your current visa before continuing.`,
      visaQuestion: "What visa do you currently hold?",
      planQuestion: "What are you planning to study next?",
      change: "Change answer",
    },
    visas: {
      "500": "Student Visa (Subclass 500)",
      "462": "Work and Holiday Visa (Subclass 462)",
      "485": "Temporary Graduate Visa (Subclass 485)",
      "600": "Visitor Visa (Subclass 600)",
      other: "Other visa",
    } satisfies Record<CurrentVisa, string>,
    plans: {
      continue: "Continue my current course to complete it",
      higher: "Progress to a higher qualification level",
      same: "Start another course at the same qualification level",
      phd: "Start a PhD",
      unsure: "Other / Not sure",
    } satisfies Record<StudyPlan, string>,
    outcomes: {
      whm462: {
        status: "You must apply from outside Australia",
        description: `Work and Holiday Visa (Subclass 462) holders cannot lodge a new Student Visa application from within Australia under the rules effective from ${dateLong}.`,
        extra: "You will need to leave Australia and lodge your Student Visa application offshore.",
      },
      grad485: {
        status: "You must apply from outside Australia",
        description: "Temporary Graduate Visa (Subclass 485) holders cannot lodge a new Student Visa application from within Australia.",
      },
      visitor600: {
        status: "You must apply from outside Australia",
        description: "Visitor Visa (Subclass 600) holders cannot lodge a new Student Visa application from within Australia.",
      },
      otherVisa: {
        status: "Further assessment required",
        description: "Your ability to apply for a Student Visa from within Australia depends on your current visa and its conditions.",
        cta: "Speak with an adviser",
      },
      studentContinue: {
        status: "You may be eligible to apply onshore",
        description: "If you need no more than 12 additional months to complete your existing course with the same education provider, you may qualify for an exemption.",
      },
      studentHigher: {
        status: "You may be eligible to apply onshore",
        description: "If your new course represents progression to a higher qualification level, you may qualify for an exemption allowing an onshore Student Visa application.",
        extra: "Example: Bachelor → Master",
      },
      studentSame: {
        status: "You will generally need to apply offshore",
        description: "Starting another course at the same qualification level is generally not considered progression to a higher qualification.",
        extra: "Example: Master → Master",
      },
      studentPhd: {
        status: "You may be eligible to apply onshore",
        description: "Applicants commencing a PhD may qualify for an exemption allowing an onshore Student Visa application.",
      },
      studentUnsure: {
        status: "Further assessment recommended",
        description: "Your situation may depend on the AQF level, your previous course, your new course and the education provider.",
        cta: "Ask Beyond Study Center about my case",
      },
    } satisfies Record<OnshoreOutcome, OutcomeCopy>,
    thaiNote: {
      heading: "Additional information for Thai applicants",
      body: "Thailand is included among eligible ASEAN countries for certain family-related Student Visa exemptions. Family-member rules and onshore application eligibility are separate requirements and should be assessed independently.",
    },
    disclaimer: "This tool is for general planning only. It is not legal or migration advice. Always confirm the latest requirements with the Department of Home Affairs or an appropriately authorised adviser before lodging a visa application.",
  };
};

// ---------------------------------------------------------------------------
// Alert card (below the planner header)
// ---------------------------------------------------------------------------

export const VisaRuleAlert = ({ onCheck }: { onCheck: () => void }) => {
  const { language } = useLanguage();
  const c = copy(language).alert;
  return (
    <section
      aria-labelledby="visa-rule-alert-heading"
      className="mb-6 rounded-2xl border border-sky-200/80 bg-sky-50/70 p-4 sm:p-5 dark:border-primary/25 dark:bg-primary/10"
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-6">
        <div className="flex flex-1 min-w-0 items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-background text-primary ring-1 ring-sky-200/80 dark:ring-primary/25">
            <ShieldCheck className="h-5 w-5" aria-hidden />
          </span>
          <div className="min-w-0">
            <Badge variant="secondary" className="mb-1.5 gap-1 bg-primary/10 text-primary hover:bg-primary/10">
              {c.badge}
            </Badge>
            <h4 id="visa-rule-alert-heading" className="text-sm sm:text-base font-semibold leading-snug text-foreground">
              {c.headline}
            </h4>
            <p className="mt-1 text-xs sm:text-sm leading-relaxed text-muted-foreground">{c.description}</p>
            <a
              href={STUDENT_VISA_ONSHORE_RULE.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1.5 inline-flex items-center gap-1 rounded text-[11px] text-muted-foreground underline-offset-2 hover:text-foreground hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {c.source}
              <ExternalLink className="h-3 w-3 shrink-0" aria-hidden />
            </a>
          </div>
        </div>
        <button
          type="button"
          onClick={onCheck}
          className="inline-flex min-h-11 w-full shrink-0 items-center justify-center gap-2 rounded-xl border-2 border-primary bg-background px-4 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 md:w-auto"
        >
          {c.cta}
          <ArrowRight className="h-4 w-4" aria-hidden />
        </button>
      </div>
    </section>
  );
};

// ---------------------------------------------------------------------------
// Eligibility panel (below "ยื่นวีซ่าจากที่ไหน" when Australia is selected)
// ---------------------------------------------------------------------------

export type OnshoreStep = "visa" | "plan" | "result";

export interface OnshoreCheckState {
  visa: CurrentVisa | null;
  plan: StudyPlan | null;
  step: OnshoreStep;
}

export const initialOnshoreCheck: OnshoreCheckState = { visa: null, plan: null, step: "visa" };

export const ONSHORE_PANEL_HEADING_ID = "onshore-check-heading";

const toneStyles: Record<OutcomeTone, { box: string; icon: string; status: string; Icon: typeof PlaneTakeoff }> = {
  offshore: {
    box: "border-amber-500/40 bg-amber-500/10",
    icon: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
    status: "text-amber-800 dark:text-amber-300",
    Icon: PlaneTakeoff,
  },
  maybe: {
    box: "border-primary/30 bg-primary/[0.06]",
    icon: "bg-primary/10 text-primary",
    status: "text-primary",
    Icon: BadgeCheck,
  },
  assess: {
    box: "border-border bg-muted/60",
    icon: "bg-background text-muted-foreground ring-1 ring-border",
    status: "text-foreground",
    Icon: Search,
  },
};

const optionButton = (selected: boolean) =>
  `relative flex min-h-11 w-full items-center rounded-lg border-2 py-2.5 pl-3 pr-8 text-left text-sm leading-snug transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 ${
    selected
      ? "border-primary bg-primary/[0.06] font-semibold text-foreground shadow-sm"
      : "border-border bg-background text-foreground/90 hover:border-primary/40 hover:bg-muted/40"
  }`;

const linkButton =
  "inline-flex min-h-9 items-center gap-1.5 rounded-md px-1 text-xs font-medium text-primary hover:text-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

export const OnshoreEligibilityPanel = ({
  state, onChange,
}: {
  state: OnshoreCheckState;
  onChange: (next: OnshoreCheckState) => void;
}) => {
  const { language } = useLanguage();
  const c = copy(language);
  const reduceMotion = useReducedMotion();
  const outcome = state.step === "result" ? onshoreOutcome(state.visa, state.plan) : null;

  // Options disappear after an answer, so move focus to the next step's
  // heading (only after a click here, never on first render).
  const focusNext = useRef(false);
  const stepHeading = useRef<HTMLElement | null>(null);
  const setStepHeading = (el: HTMLElement | null) => { stepHeading.current = el; };
  useEffect(() => {
    if (!focusNext.current) return;
    focusNext.current = false;
    stepHeading.current?.focus();
  }, [state.step]);

  const go = (next: OnshoreCheckState) => {
    focusNext.current = true;
    onChange(next);
  };

  const chooseVisa = (visa: CurrentVisa) =>
    go({ ...state, visa, step: needsStudyPlan(visa) ? "plan" : "result" });
  const choosePlan = (plan: StudyPlan) => go({ ...state, plan, step: "result" });
  // Keeps earlier answers highlighted so the visitor can see what they chose.
  const changeAnswer = () => go({ ...state, step: "visa" });

  const stepMotion = reduceMotion
    ? {}
    : { initial: { opacity: 0, y: 6 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.2 } };

  return (
    <div className="mt-3 rounded-xl border border-sky-200/80 bg-sky-50/60 p-4 dark:border-primary/25 dark:bg-primary/10">
      <h4
        id={ONSHORE_PANEL_HEADING_ID}
        tabIndex={-1}
        className="text-sm font-semibold leading-snug text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
      >
        {c.panel.heading}
      </h4>
      {/* The intro is hidden once there is a result, to keep the input card short. */}
      {state.step !== "result" && (
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{c.panel.description}</p>
      )}

      <div className="mt-4">
        {/* Keyed fade-in without exit animations, so the next step's heading
            exists when focus moves to it. */}
          {state.step === "visa" && (
            <motion.div key="visa" {...stepMotion}>
              <Question id="onshore-q-visa" label={c.panel.visaQuestion} headingRef={setStepHeading}>
                {CURRENT_VISAS.map((v) => (
                  <button key={v} type="button" aria-pressed={state.visa === v} onClick={() => chooseVisa(v)} className={optionButton(state.visa === v)}>
                    {c.visas[v]}
                    {state.visa === v && <CheckCircle2 className="absolute right-2.5 h-4 w-4 text-primary" aria-hidden />}
                  </button>
                ))}
              </Question>
            </motion.div>
          )}

          {state.step === "plan" && state.visa && (
            <motion.div key="plan" {...stepMotion} className="space-y-4">
              <AnswerSummary rows={[[c.panel.visaQuestion, c.visas[state.visa]]]} />
              <Question id="onshore-q-plan" label={c.panel.planQuestion} headingRef={setStepHeading}>
                {STUDY_PLANS.map((p) => (
                  <button key={p} type="button" aria-pressed={state.plan === p} onClick={() => choosePlan(p)} className={optionButton(state.plan === p)}>
                    {c.plans[p]}
                    {state.plan === p && <CheckCircle2 className="absolute right-2.5 h-4 w-4 text-primary" aria-hidden />}
                  </button>
                ))}
              </Question>
              <button type="button" onClick={changeAnswer} className={linkButton}>
                <Pencil className="h-3.5 w-3.5" aria-hidden /> {c.panel.change}
              </button>
            </motion.div>
          )}

          {outcome && state.visa && (
            <motion.div key={`result-${outcome}`} {...stepMotion} className="space-y-2">
              <OutcomeCard
                tone={OUTCOME_TONE[outcome]}
                text={c.outcomes[outcome]}
                answers={[c.visas[state.visa], ...(needsStudyPlan(state.visa) && state.plan ? [c.plans[state.plan]] : [])].join(" · ")}
                headingRef={setStepHeading}
              />
              <button type="button" onClick={changeAnswer} className={linkButton}>
                <Pencil className="h-3.5 w-3.5" aria-hidden /> {c.panel.change}
              </button>
              <p className="flex items-start gap-1.5 border-t border-border/70 pt-2.5 text-[11px] leading-relaxed text-muted-foreground">
                <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
                {c.disclaimer}
              </p>
            </motion.div>
          )}
      </div>

      <ThaiApplicantNote heading={c.thaiNote.heading} body={c.thaiNote.body} />
    </div>
  );
};

const Question = ({
  id, label, headingRef, children,
}: {
  id: string;
  label: string;
  headingRef: (el: HTMLElement | null) => void;
  children: ReactNode;
}) => (
  <div>
    <p id={id} ref={headingRef} tabIndex={-1} className="mb-2.5 rounded text-sm font-semibold text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring">
      {label}
    </p>
    {/* One column in the narrow desktop input card; two on tablets. */}
    <div role="group" aria-labelledby={id} className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
      {children}
    </div>
  </div>
);

const AnswerSummary = ({ rows }: { rows: [string, string][] }) => (
  <dl className="space-y-1.5 rounded-lg bg-background/70 px-3 py-2.5 ring-1 ring-border/70">
    {rows.map(([q, a]) => (
      <div key={q}>
        <dt className="text-[11px] text-muted-foreground">{q}</dt>
        <dd className="text-sm font-medium text-foreground">{a}</dd>
      </div>
    ))}
  </dl>
);

/**
 * Result collapsed to one row (status + the answers given); the row toggles
 * the explanation and any CTA, so the input card stays short.
 */
const OutcomeCard = ({
  tone, text, answers, headingRef,
}: {
  tone: OutcomeTone;
  text: OutcomeCopy;
  answers: string;
  headingRef: (el: HTMLElement | null) => void;
}) => {
  const [open, setOpen] = useState(false);
  const s = toneStyles[tone];
  return (
    <div className={`rounded-xl border ${s.box}`}>
      <button
        ref={headingRef}
        type="button"
        aria-expanded={open}
        aria-controls="onshore-result-details"
        onClick={() => setOpen((o) => !o)}
        className="flex min-h-11 w-full items-center gap-2.5 rounded-xl p-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${s.icon}`}>
          <s.Icon className="h-4 w-4" aria-hidden />
        </span>
        <span className="min-w-0 flex-1">
          <span className={`block text-sm font-bold leading-snug ${s.status}`}>{text.status}</span>
          <span className="mt-0.5 block text-xs leading-snug text-muted-foreground">{answers}</span>
        </span>
        <ChevronDown className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform motion-reduce:transition-none ${open ? "rotate-180" : ""}`} aria-hidden />
      </button>
      <div id="onshore-result-details" hidden={!open} className="px-3.5 pb-3.5">
        <p className="text-sm leading-relaxed text-foreground/85">{text.description}</p>
        {text.extra && <p className="mt-1.5 text-xs font-medium text-muted-foreground">{text.extra}</p>}
        {text.cta && (
          <a
            href={LINE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:w-auto"
          >
            <MessageCircle className="h-4 w-4" aria-hidden />
            {text.cta}
            <ExternalLink className="h-3.5 w-3.5" aria-hidden />
          </a>
        )}
      </div>
    </div>
  );
};

const ThaiApplicantNote = ({ heading, body }: { heading: string; body: string }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="mt-4 border-t border-sky-200/80 pt-2 dark:border-primary/20">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="onshore-thai-note"
        onClick={() => setOpen((o) => !o)}
        className="flex min-h-10 w-full items-center justify-between gap-2 rounded-lg px-1 text-left text-xs font-medium text-primary hover:text-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <span>{heading}</span>
        <ChevronDown className={`h-4 w-4 shrink-0 transition-transform motion-reduce:transition-none ${open ? "rotate-180" : ""}`} aria-hidden />
      </button>
      <p id="onshore-thai-note" hidden={!open} className="px-1 pb-1 pt-1 text-xs leading-relaxed text-muted-foreground">
        {body}
      </p>
    </div>
  );
};
