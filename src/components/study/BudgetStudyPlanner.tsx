'use client'

import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  MapPin, Wallet, User, Languages, Target,
  ShieldCheck, AlertTriangle,
  Sparkles, ArrowRight,
  ChevronDown, ArrowDown, ArrowUp, Info, Plane, Briefcase, GraduationCap, Lightbulb, CheckCircle2, Clock,
} from "lucide-react";
import {
  AnswerList, StepNav, StepProgress, STEP_AUTO_ADVANCE_MS, isBelowLg, stepVisibility, useBelowLg, useStepFlowScroll,
} from "../shared/StepFlow";
import BSCConsultationCTA, { type CTAIllustration } from "../shared/BSCConsultationCTA";
import {
  VisaRuleAlert, OnshoreEligibilityPanel, initialOnshoreCheck, ONSHORE_PANEL_HEADING_ID,
  type OnshoreCheckState,
} from "./OnshoreStudentVisaCheck";
import { useLanguage } from "@/i18n/LanguageProvider";
import { PLANNER_DATA_UPDATED } from "@/data/studyVisaRules";
import { formatMonthYear } from "@/lib/plannerDates";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  type Location, type PathwayTier, type PathwayCalc, type ElicosOnlyCalc,
  type SkillBoosterKey, type ShortPathwayCalc,
  DEFAULT_FX_THB_PER_AUD, DEFAULT_ELICOS_WEEKLY,
  ELICOS_WEEKLY_MIN, ELICOS_WEEKLY_MAX, WHM_MAX_STUDY_WEEKS,
  SKILL_BOOSTERS,
  tiers,
  calcEnglishPackage, computePathway, computeElicosOnly, computeShortPathway,
  riskBadge, fmtAUD, fmtTHB,
} from "@/lib/CalculationEngine";

type Goal = "english" | "vet" | "he" | "short";
type EnglishLevel = "none" | "4.5" | "5.0" | "5.5" | "6.0" | "6.5+";
type DegreeLevel = "bachelor" | "master";

const THAI_WHM_MIN_AGE = 31;

const englishOptions: { id: EnglishLevel; label: string; numeric: number }[] = [
  { id: "none",  label: "ยังไม่เคยสอบ",  numeric: 0 },
  { id: "4.5",   label: "4.5",   numeric: 4.5 },
  { id: "5.0",   label: "5.0",   numeric: 5.0 },
  { id: "5.5",   label: "5.5",   numeric: 5.5 },
  { id: "6.0",   label: "6.0",   numeric: 6.0 },
  { id: "6.5+",  label: "6.5+",  numeric: 6.5 },
];

// Illustrations are pre-trimmed WebP copies of the owner-supplied PNGs in
// public/icons (resized for display; transparent backgrounds kept).
const ART_DIR = "/images/budget-planner";
const ART = {
  header: `${ART_DIR}/graduation_flight_to_sydney.webp`,
  wallet: `${ART_DIR}/secure_wallet_with_coins_and_shield.webp`,
  english: `${ART_DIR}/global_learning_book_icon.webp`,
  vet: `${ART_DIR}/briefcase_and_wrench_toolkit_icon.webp`,
  degree: `${ART_DIR}/graduation_cap_book_and_diploma.webp`,
  short: `${ART_DIR}/quick_study_clock_and_book.webp`,
  consult: { src: `${ART_DIR}/friendly_student_advising_session.webp`, width: 720, height: 548 } satisfies CTAIllustration,
};

// Shared visual tokens so every control group in the planner looks alike.
const sectionLabel = "flex items-center gap-2 mb-3 text-sm font-semibold text-foreground";
const segmentGroup = "grid grid-cols-2 gap-1 rounded-xl bg-muted p-1";
const segmentButton = (active: boolean) =>
  `rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
    active
      ? "bg-background text-foreground font-semibold shadow-sm ring-1 ring-border"
      : "text-muted-foreground hover:text-foreground"
  }`;
const valueChip = "rounded-full bg-primary/10 px-2.5 py-0.5 text-sm font-semibold text-primary tabular-nums";
// The line art uses dark outlines, so it sits on a light tile in dark mode.
const artTile = "shrink-0 rounded-lg bg-sky-50 dark:bg-white/90";

const BudgetStudyPlanner = () => {
  const [location, setLocation] = useState<Location>("offshore");
  const [currency, setCurrency] = useState<"THB" | "AUD">("THB");
  // Budget is stored once, in AUD, and displayed in the selected currency.
  // Converting the stored value back and forth on every currency toggle
  // accumulated rounding drift (฿800,000 → $34,072 → ฿800,011).
  const [budgetAUD, setBudgetAUD] = useState<number>(800_000 / DEFAULT_FX_THB_PER_AUD);
  const [age, setAge] = useState<number>(24);
  const [english, setEnglish] = useState<EnglishLevel>("5.0");
  const [goal, setGoal] = useState<Goal>("he");
  const rate = DEFAULT_FX_THB_PER_AUD;
  const budget = Math.round(currency === "AUD" ? budgetAUD : budgetAUD * rate);
  const setBudget = (v: number) => setBudgetAUD(currency === "AUD" ? v : v / rate);
  const [elicosWeekly, setElicosWeekly] = useState<number>(DEFAULT_ELICOS_WEEKLY);
  // Short Experience controls
  const [shortWeeks, setShortWeeks] = useState<number>(10);
  const [shortSkill, setShortSkill] = useState<SkillBoosterKey>("none");
  // Standalone "Learn English" duration (weeks)
  const [standaloneWeeks, setStandaloneWeeks] = useState<24 | 40>(24);
  // Higher Education degree level — affects course duration only
  const [degreeLevel, setDegreeLevel] = useState<DegreeLevel>("bachelor");
  // Onshore Student visa checker (shown when applying from Australia). Kept
  // here so answers survive language switches and Thailand/Australia toggles.
  const [onshoreCheck, setOnshoreCheck] = useState<OnshoreCheckState>(initialOnshoreCheck);
  const [jumpToOnshore, setJumpToOnshore] = useState(false);
  const reduceMotion = useReducedMotion();

  // Compact result bar: shown while the inputs are on screen but the summary
  // card is not, so every change is visible without scrolling back.
  const inputsRef = useRef<HTMLDivElement>(null);
  const summaryRef = useRef<HTMLDivElement>(null);
  const [inputsInView, setInputsInView] = useState(false);
  const [summaryInView, setSummaryInView] = useState(true);
  const [summaryBelow, setSummaryBelow] = useState(false);
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const nav = { rootMargin: "-64px 0px 0px 0px" }; // fixed navbar
    const inputs = new IntersectionObserver(([e]) => setInputsInView(e.isIntersecting), nav);
    const summary = new IntersectionObserver(([e]) => setSummaryInView(e.isIntersecting), { ...nav, threshold: 0.6 });
    if (inputsRef.current) inputs.observe(inputsRef.current);
    if (summaryRef.current) summary.observe(summaryRef.current);
    return () => { inputs.disconnect(); summary.disconnect(); };
  }, []);
  const showSummaryBar = inputsInView && !summaryInView;

  // Arrow direction (summary above or below). Observer callbacks don't fire
  // when the card jumps from below to above the screen, so track scroll
  // while the bar is shown.
  useEffect(() => {
    if (!showSummaryBar) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const el = summaryRef.current;
      if (el) setSummaryBelow(el.getBoundingClientRect().top > 0);
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { window.removeEventListener("scroll", onScroll); cancelAnimationFrame(frame); };
  }, [showSummaryBar]);

  // Alert CTA: bring the location selector into view and focus the checker
  // once it has rendered.
  const jumpToChecker = useCallback(() => {
    document.getElementById("bsp-location")?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
    document.getElementById(ONSHORE_PANEL_HEADING_ID)?.focus({ preventScroll: true });
  }, [reduceMotion]);
  // When the checker is opening, framer-motion measures its "auto" height and
  // then restores the window scroll, which cancels a smooth scroll started
  // earlier. So wait for the first animated frame (after measuring).
  const jumpWhenExpanded = useRef(false);
  useEffect(() => {
    if (!jumpToOnshore) return;
    setJumpToOnshore(false);
    jumpToChecker();
  }, [jumpToOnshore, jumpToChecker]);
  const onCheckOnshore = () => {
    // Phones/tablets: open the step-by-step flow at the location step.
    setWizDone(false);
    setWizStep(LAST_STEP);
    if (location === "onshore" || reduceMotion) setJumpToOnshore(true);
    else jumpWhenExpanded.current = true;
    setLocation("onshore");
  };

  // Phones/tablets (below lg): one input group per screen, then the results.
  // Desktop shows every group beside the results, as before.
  const [wizStep, setWizStep] = useState(0);
  const [wizDone, setWizDone] = useState(false);
  const steps: WizardStep[] = goal === "english"
    ? ["goal", "budget", "age", "location"]
    : ["goal", "budget", "age", "english", "location"];
  const stepIdx = Math.min(wizStep, steps.length - 1);
  const currentStep = steps[stepIdx];
  /** Hide an input group on phones/tablets unless it is the current step.
   *  The step's first group drops the space-y gap left by hidden groups above it
   *  (phones/tablets only), so every step starts at the same distance. */
  const stepClass = (s: WizardStep, keepGap = false) => {
    const current = !wizDone && currentStep === s;
    return current ? (keepGap ? "" : "max-lg:!mt-0") : stepVisibility(false);
  };
  const goToStep = (i: number) => { setWizDone(false); setWizStep(i); };
  // While stepping on phones/tablets the total would come from default
  // values the visitor has not chosen yet, so the floating bar waits until
  // the steps are finished.
  const belowLg = useBelowLg();
  const finishWizard = () => setWizDone(true);

  // Keep the planner in view between steps; bring the results up at the end.
  useStepFlowScroll(inputsRef, summaryRef, stepIdx, wizDone, reduceMotion);

  // Choosing a goal on phones/tablets moves straight on to the next step.
  const advanceTimer = useRef<ReturnType<typeof setTimeout>>();
  useEffect(() => () => clearTimeout(advanceTimer.current), []);
  const chooseGoal = (apply: () => void) => {
    apply();
    if (wizDone || !isBelowLg()) return;
    clearTimeout(advanceTimer.current);
    advanceTimer.current = setTimeout(() => setWizStep(1), STEP_AUTO_ADVANCE_MS);
  };

  const englishNumeric = englishOptions.find((o) => o.id === english)?.numeric ?? 0;

  const targetSector: "vet" | "he" = goal === "he" ? "he" : "vet";

  const englishPkg = useMemo(
    () => calcEnglishPackage(englishNumeric, targetSector, elicosWeekly),
    [englishNumeric, targetSector, elicosWeekly],
  );

  const relevantTiers = useMemo(() => {
    if (goal === "english") return [] as PathwayTier[];
    const list = tiers.filter((t) => t.sector === (goal === "he" ? "he" : "vet"));
    if (goal === "he") {
      const years = degreeLevel === "master" ? 2 : 3;
      return list.map((t) => ({ ...t, durationYears: years }));
    }
    return list;
  }, [goal, degreeLevel]);

  const pathwayResults = useMemo(
    () => relevantTiers.map((t) => ({ tier: t, calc: computePathway(t, englishPkg, location, age, budgetAUD) })),
    [relevantTiers, englishPkg, location, age, budgetAUD],
  );

  // Standalone English: duration is user-selected (24 or 40 weeks),
  // independent of current IELTS. 40-week courses allow 50% upfront.
  const elicos24 = useMemo(
    () => computeElicosOnly(24, elicosWeekly, location, age, budgetAUD, "student", 1),
    [elicosWeekly, location, age, budgetAUD],
  );
  const elicos40 = useMemo(
    () => computeElicosOnly(40, elicosWeekly, location, age, budgetAUD, "student", 0.5),
    [elicosWeekly, location, age, budgetAUD],
  );
  const elicosCalc = standaloneWeeks === 24 ? elicos24 : elicos40;

  const budgetTHB = budgetAUD * rate;
  const suggestShort = budgetTHB < 180_000 && goal !== "short";

  const whmShort = useMemo(
    () => computeShortPathway("whm", shortWeeks, elicosWeekly, shortSkill, budgetAUD),
    [shortWeeks, elicosWeekly, shortSkill, budgetAUD],
  );
  const tourShort = useMemo(
    () => computeShortPathway("tourist", shortWeeks, elicosWeekly, "none", budgetAUD),
    [shortWeeks, elicosWeekly, budgetAUD],
  );

  const headlineCoverage =
    goal === "english" ? elicosCalc.coverage
    : goal === "short" ? whmShort.coverageLow
    : pathwayResults.length ? Math.max(...pathwayResults.map((r) => r.calc.coverage)) : 0;

  const headlineUpfront =
    goal === "english" ? elicosCalc.upfront
    : goal === "short" ? whmShort.upfrontLow
    : pathwayResults.length ? Math.min(...pathwayResults.map((r) => r.calc.upfront)) : 0;

  const headlineUpfrontHigh = goal === "short" ? whmShort.upfrontHigh : headlineUpfront;

  const fmtMoney = (aud: number) => (currency === "AUD" ? fmtAUD(aud) : fmtTHB(aud * rate));

  return (
    <div className="max-w-6xl mx-auto">
      <PlannerHeader />
      <VisaRuleAlert onCheck={onCheckOnshore} />

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Inputs */}
        <Card ref={inputsRef} className="lg:col-span-2 self-start rounded-2xl border-border/60 bg-gradient-to-br from-background to-muted/40 shadow-sm">
          {/* Outside CardContent: as a space-y child it would add a top margin to
              the first input group on desktop, where it is hidden. */}
          <div className="px-5 pt-5 sm:px-6 sm:pt-6 lg:hidden">
            {wizDone ? (
              <AnswerList
                answers={[
                  { key: "goal" as WizardStep, label: "เป้าหมายการเรียน", value: goalTitle(goal, degreeLevel) },
                  { key: "budget" as WizardStep, label: "งบที่เตรียมไว้", value: currency === "AUD" ? fmtAUD(budgetAUD) : fmtTHB(budgetTHB) },
                  { key: "age" as WizardStep, label: "อายุผู้สมัคร", value: `${age} ปี` },
                  ...(goal !== "english"
                    ? [{ key: "english" as WizardStep, label: "IELTS", value: englishOptions.find((o) => o.id === english)?.label ?? "" }]
                    : []),
                  { key: "location" as WizardStep, label: "ยื่นวีซ่าจากที่ไหน", value: location === "offshore" ? "ประเทศไทย" : "ออสเตรเลีย" },
                ].map((a) => ({ ...a, onEdit: () => goToStep(steps.indexOf(a.key)) }))}
                editAllLabel="แก้ไขคำตอบ"
                onEditAll={() => goToStep(0)}
              />
            ) : (
              <StepProgress label={`ขั้นตอน ${stepIdx + 1} จาก ${steps.length}`} step={stepIdx} total={steps.length} />
            )}
          </div>
          <CardContent className={`p-5 sm:p-6 space-y-7 ${wizDone ? "max-lg:pt-0" : ""}`}>
            <div className={stepClass("goal")}>
              <Label className={sectionLabel}>
                <Target className="w-4 h-4 text-primary" aria-hidden /> เป้าหมายการเรียน
              </Label>
              <div className="grid grid-cols-2 gap-2.5">
                <GoalOption
                  selected={goal === "english"}
                  onClick={() => chooseGoal(() => setGoal("english"))}
                  icon={ART.english}
                  title="เรียนภาษาอังกฤษ"
                  sub="หลักสูตร ELICOS"
                />
                <GoalOption
                  selected={goal === "vet"}
                  onClick={() => chooseGoal(() => setGoal("vet"))}
                  icon={ART.vet}
                  title="เรียนสายอาชีพ"
                  sub="IELTS ขั้นต่ำ 6.0"
                />
                <GoalOption
                  selected={goal === "he" && degreeLevel === "bachelor"}
                  onClick={() => chooseGoal(() => { setGoal("he"); setDegreeLevel("bachelor"); })}
                  icon={ART.degree}
                  title="ปริญญาตรี"
                  sub="ควรจะมี IELTS อย่างน้อย 6.5 ใช้เวลาเรียนประมาณ 3 ปี"
                />
                <GoalOption
                  selected={goal === "he" && degreeLevel === "master"}
                  onClick={() => chooseGoal(() => { setGoal("he"); setDegreeLevel("master"); })}
                  icon={ART.degree}
                  title="ปริญญาโท"
                  sub="ควรจะมี IELTS อย่างน้อย 6.5 ใช้เวลาเรียนประมาณ 2 ปี"
                />
                <GoalOption
                  selected={goal === "short"}
                  onClick={() => chooseGoal(() => setGoal("short"))}
                  icon={ART.short}
                  title="คอร์สระยะสั้น / เพิ่มทักษะ"
                  sub="เหมาะสำหรับผู้ที่ถือวีซ่า WHM หรือต้องการเรียนคอร์ส Fast Track"
                  className="col-span-2"
                />
              </div>
              {suggestShort && (
                <button
                  type="button"
                  onClick={() => setGoal("short")}
                  className="mt-3 w-full text-left rounded-xl border border-amber-500/40 bg-amber-500/10 p-3 hover:bg-amber-500/15 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <div className="flex items-start gap-2">
                    <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" aria-hidden />
                    <div>
                      <p className="text-xs font-semibold text-amber-700">
                        งบต่ำกว่า ฿180,000? ลองเส้นทาง WHM หรือเรียนด้วยวีซ่าท่องเที่ยวก่อน
                      </p>
                      <p className="text-[11px] text-amber-700/80 mt-0.5">
                        ทำงานหารายได้และลองใช้ชีวิตที่ออสเตรเลียก่อน แล้วค่อยตัดสินใจเรียนต่อเต็มรูปแบบ
                      </p>
                    </div>
                  </div>
                </button>
              )}
            </div>


            <div className={stepClass("budget")}>
              <div className="flex items-center justify-between gap-3 mb-3">
                <Label htmlFor="bsp-budget" id="bsp-budget-label" className={`${sectionLabel} mb-0`}>
                  <Wallet className="w-4 h-4 text-primary" aria-hidden /> งบที่เตรียมไว้
                </Label>
                <div className="flex rounded-lg bg-muted p-0.5 text-xs">
                  {(["THB", "AUD"] as const).map((c) => (
                    <button
                      key={c}
                      type="button"
                      aria-pressed={currency === c}
                      onClick={() => setCurrency(c)}
                      className={`h-10 lg:h-8 px-3 ${segmentButton(currency === c)}`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
              <Input
                id="bsp-budget"
                type="text"
                inputMode="numeric"
                value={budget.toLocaleString()}
                onChange={(e) => {
                  const n = parseInt(e.target.value.replace(/[^\d]/g, ""), 10);
                  setBudget(isNaN(n) ? 0 : n);
                }}
                className="h-12 rounded-xl text-lg font-semibold tabular-nums"
              />
              <Slider
                value={[budget]}
                min={currency === "AUD" ? 5_000 : 100_000}
                max={currency === "AUD" ? 150_000 : 3_500_000}
                step={currency === "AUD" ? 500 : 10_000}
                onValueChange={([v]) => setBudget(v)}
                aria-labelledby="bsp-budget-label"
                className="mt-5"
              />
              <p className="text-xs text-muted-foreground mt-2.5 tabular-nums">
                ≈ {currency === "AUD" ? fmtTHB(budgetTHB) : fmtAUD(budgetAUD)}
              </p>
            </div>

            <div className={stepClass("age")}>
              <div className="flex items-center justify-between gap-3 mb-4">
                <Label id="bsp-age-label" className={`${sectionLabel} mb-0`}>
                  <User className="w-4 h-4 text-primary" aria-hidden /> อายุผู้สมัคร
                </Label>
                <span className={valueChip}>{age} ปี</span>
              </div>
              <Slider value={[age]} min={15} max={50} step={1} onValueChange={([v]) => setAge(v)} aria-labelledby="bsp-age-label" />
            </div>

            {goal !== "english" && (
              <>
                <div className={stepClass("english")}>
                  <Label className={sectionLabel}>
                    <Languages className="w-4 h-4 text-primary" aria-hidden /> ตอนนี้คะแนน IELTS คุณอยู่ที่ประมาณเท่าไหร่
                  </Label>
                  <div className="grid grid-cols-3 sm:grid-cols-6 lg:grid-cols-3 gap-2">
                    {englishOptions.map((o) => (
                      <button
                        key={o.id}
                        type="button"
                        aria-pressed={english === o.id}
                        onClick={() => setEnglish(o.id)}
                        className={`min-h-10 px-1.5 py-2 rounded-lg border text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                          english === o.id
                            ? "border-primary bg-primary text-primary-foreground shadow-sm"
                            : "border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground"
                        }`}
                      >
                        {o.label}
                      </button>
                    ))}
                  </div>
                  {englishPkg.needsLevel1 && (
                    <div className="mt-3 flex items-start gap-2 rounded-lg bg-amber-500/10 border border-amber-500/30 p-2.5">
                      <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" aria-hidden />
                      <p className="text-xs text-amber-700">
                        ถ้า IELTS ต่ำกว่า 5.0 แนะนำให้เรียนกับโรงเรียน <strong>Level 1</strong>
                      </p>
                    </div>
                  )}
                  {englishPkg.straightEntry && (
                    <p className="text-xs text-emerald-600 mt-3 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" aria-hidden /> ระดับภาษาอังกฤษของคุณผ่านเกณฑ์แล้ว ไม่จำเป็นต้องเรียนภาษา
                    </p>
                  )}
                  {englishPkg.weeks > 0 && (
                    <p className="text-xs text-muted-foreground mt-3">
                      แนะนำให้เรียนภาษาเป็นระยะเวลา <strong className="text-foreground">{englishPkg.weeks} สัปดาห์</strong> ราคาประมาณ ${elicosWeekly}/สัปดาห์
                    </p>
                  )}
                </div>

                {/* Global English tuition slider — affects every pathway card */}
                <div className={stepClass("english", true)}>
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <Label id="bsp-elicos-label" className={`${sectionLabel} mb-0`}>
                      <GraduationCap className="w-4 h-4 text-primary" aria-hidden /> ค่าเรียนภาษา
                    </Label>
                    <span className={valueChip}>${elicosWeekly}/สัปดาห์</span>
                  </div>
                  <Slider
                    value={[elicosWeekly]}
                    min={ELICOS_WEEKLY_MIN}
                    max={ELICOS_WEEKLY_MAX}
                    step={10}
                    onValueChange={([v]) => setElicosWeekly(v)}
                    aria-labelledby="bsp-elicos-label"
                  />
                  <div className="flex justify-between text-[11px] text-muted-foreground mt-2">
                    <span>${ELICOS_WEEKLY_MIN}/สัปดาห์</span>
                    <span>${ELICOS_WEEKLY_MAX}/สัปดาห์</span>
                  </div>
                </div>
              </>
            )}

            {/* Last: the onshore checker can expand here without pushing the
                inputs that drive the calculation out of view. */}
            <div id="bsp-location" className={`scroll-mt-24 ${stepClass("location")}`}>
              <Label className={sectionLabel}>
                <MapPin className="w-4 h-4 text-primary" aria-hidden /> ยื่นวีซ่าจากที่ไหน
              </Label>
              <div className={segmentGroup}>
                {(["offshore", "onshore"] as Location[]).map((loc) => (
                  <button
                    key={loc}
                    type="button"
                    aria-pressed={location === loc}
                    onClick={() => setLocation(loc)}
                    className={`min-h-11 ${segmentButton(location === loc)}`}
                  >
                    {loc === "offshore" ? "ประเทศไทย" : "ออสเตรเลีย"}
                  </button>
                ))}
              </div>
              <AnimatePresence initial={false}>
                {location === "onshore" && (
                  <motion.div
                    key="onshore-check"
                    initial={reduceMotion ? false : { height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={reduceMotion ? { opacity: 0, transition: { duration: 0 } } : { height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    onUpdate={() => {
                      if (!jumpWhenExpanded.current) return;
                      jumpWhenExpanded.current = false;
                      jumpToChecker();
                    }}
                    className="overflow-hidden"
                  >
                    <OnshoreEligibilityPanel state={onshoreCheck} onChange={setOnshoreCheck} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {!wizDone && (
              <StepNav
                canBack={stepIdx > 0}
                last={stepIdx === steps.length - 1}
                backLabel="ย้อนกลับ"
                nextLabel="ถัดไป"
                doneLabel="ดูผลการคำนวณ"
                onBack={() => setWizStep(stepIdx - 1)}
                onNext={() => (stepIdx === steps.length - 1 ? finishWizard() : setWizStep(stepIdx + 1))}
              />
            )}

            {/* After the steps (phones/tablets) every input group above is hidden, so drop the gap. */}
            <p className={`flex items-center gap-1.5 text-[11px] text-muted-foreground pt-4 border-t border-border ${wizDone ? "max-lg:!mt-0" : ""}`}>
              <Info className="w-3.5 h-3.5 shrink-0" aria-hidden /> ราคาที่แสดงเป็นแค่การประมาณเท่านั้น
            </p>
          </CardContent>
        </Card>

        {/* Results */}
        <div className={`lg:col-span-3 space-y-6 ${wizDone ? "" : "max-lg:hidden"}`}>
          <div ref={summaryRef} className="scroll-mt-24">
          <SummaryCard
            coverage={headlineCoverage}
            amount={
              <>
                {fmtMoney(headlineUpfront)}
                {headlineUpfrontHigh !== headlineUpfront && (
                  <span className="text-xl font-semibold text-muted-foreground"> – {fmtMoney(headlineUpfrontHigh)}</span>
                )}
              </>
            }
            note={
              goal === "short"
                ? `รวมค่าวีซ่า WHM และค่าเรียนภาษาเป็นเวลา ${shortWeeks} สัปดาห์`
                : <>รวมค่ามัดจำ ค่าวีซ่านักเรียน ค่าประกัน OSHC{englishPkg.weeks > 0 && ` และค่าเรียนภาษา ${englishPkg.weeks} สัปดาห์`}</>
            }
            status={
              headlineCoverage >= 100 ? (
                <Badge className="bg-emerald-500/15 text-emerald-700 border-emerald-500/30 hover:bg-emerald-500/15">
                  <ShieldCheck className="w-3 h-3 mr-1" aria-hidden /> คุณมีเงินเพียงพอแล้วที่จะสมัครเรียนได้
                </Badge>
              ) : headlineUpfrontHigh > 0 ? (
                <Badge variant="outline" className="border-amber-500/40 bg-amber-500/10 text-amber-700">
                  <AlertTriangle className="w-3 h-3 mr-1" aria-hidden /> ยังขาดอยู่: {fmtMoney(Math.max(0, headlineUpfrontHigh - budgetAUD))}
                </Badge>
              ) : null
            }
          />
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={goal + location}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="grid sm:grid-cols-2 gap-4"
            >
              {goal === "english" ? (
                <StandaloneEnglishSection
                  calc24={elicos24}
                  calc40={elicos40}
                  selected={standaloneWeeks}
                  onSelect={setStandaloneWeeks}
                  fmtMoney={fmtMoney}
                />
              ) : goal === "short" ? (
                <ShortPathwaySection
                  whm={whmShort}
                  tour={tourShort}
                  shortWeeks={shortWeeks}
                  setShortWeeks={setShortWeeks}
                  shortSkill={shortSkill}
                  setShortSkill={setShortSkill}
                  elicosWeekly={elicosWeekly}
                  fmtMoney={fmtMoney}
                  budgetAUD={budgetAUD}
                  age={age}
                />
              ) : (
                pathwayResults.map(({ tier, calc }) => (
                  <PathwayCard
                    key={tier.id}
                    tier={tier}
                    calc={calc}
                    fmtMoney={fmtMoney}
                    elicosWeekly={elicosWeekly}
                    degreeLevel={goal === "he" ? degreeLevel : undefined}
                  />
                ))
              )}
            </motion.div>
          </AnimatePresence>

          <BSCConsultationCTA illustration={ART.consult} />
        </div>
      </div>

      <SummaryBar
        visible={showSummaryBar && (!belowLg || wizDone)}
        coverage={headlineCoverage}
        amount={
          headlineUpfrontHigh !== headlineUpfront
            ? `${fmtMoney(headlineUpfront)} – ${fmtMoney(headlineUpfrontHigh)}`
            : fmtMoney(headlineUpfront)
        }
        below={summaryBelow}
        onClick={() => summaryRef.current?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" })}
      />
    </div>
  );
};

type WizardStep = "goal" | "budget" | "age" | "english" | "location";
const LAST_STEP = 99; // clamped to the last step for the current goal
const goalTitle = (goal: Goal, degree: DegreeLevel) =>
  goal === "english" ? "เรียนภาษาอังกฤษ"
  : goal === "vet" ? "เรียนสายอาชีพ"
  : goal === "short" ? "คอร์สระยะสั้น / เพิ่มทักษะ"
  : degree === "master" ? "ปริญญาโท" : "ปริญญาตรี";

const PlannerHeader = () => {
  const { language } = useLanguage();
  const updated = formatMonthYear(language, PLANNER_DATA_UPDATED);
  return (
    <div className="relative mb-4 overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br from-sky-50 via-background to-background px-5 py-6 sm:px-8 sm:py-8 dark:from-primary/10">
      <div className="flex flex-col items-center gap-4 md:flex-row md:items-center md:gap-8">
        <div className="flex-1 text-center md:text-left">
          <Badge variant="secondary" className="mb-3 gap-1">
            <Sparkles className="w-3 h-3" aria-hidden /> {language === "th" ? `อัปเดตข้อมูลล่าสุด ${updated}` : `Last updated ${updated}`}
          </Badge>
          <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">วางแผนงบเรียนต่อออสเตรเลียเบื้องต้น</h3>
          <p className="text-muted-foreground text-sm md:text-base mt-2 max-w-xl md:max-w-none">
            ประเมินเงินที่ต้องเตรียมในช่วงเริ่มต้น พร้อมดูรายการค่าใช้จ่ายแบบคร่าวๆ
          </p>
        </div>
        <Image
          src={ART.header}
          alt=""
          aria-hidden="true"
          width={720}
          height={394}
          sizes="(max-width: 768px) 200px, (max-width: 1024px) 240px, 300px"
          className="h-auto w-[200px] shrink-0 opacity-90 md:w-[240px] lg:w-[300px] dark:rounded-xl dark:bg-white/90 dark:p-2"
        />
      </div>
    </div>
  );
};

const GoalOption = ({
  selected, onClick, icon, title, sub, className = "",
}: {
  selected: boolean;
  onClick: () => void;
  icon: string;
  title: string;
  sub: string;
  className?: string;
}) => (
  <button
    type="button"
    aria-pressed={selected}
    onClick={onClick}
    className={`relative flex flex-col gap-1.5 rounded-xl border-2 p-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
      selected
        ? "border-primary bg-primary/[0.06] shadow-sm"
        : "border-border bg-background hover:border-primary/40 hover:bg-muted/40"
    } ${className}`}
  >
    {selected && <CheckCircle2 className="absolute right-2 top-2 w-4 h-4 text-primary" aria-hidden />}
    {/* Icon stacks above the title on narrow phones so Thai titles don't break mid-word. */}
    <span className="flex flex-col items-start gap-1.5 pr-5 min-[440px]:flex-row min-[440px]:items-center min-[440px]:gap-2">
      <Image src={icon} alt="" aria-hidden="true" width={160} height={160} sizes="32px" className={`${artTile} h-8 w-8 p-0.5`} />
      <span className="text-sm font-semibold leading-snug text-foreground">{title}</span>
    </span>
    <span className="text-xs leading-snug text-muted-foreground">{sub}</span>
  </button>
);

const SummaryCard = ({
  coverage, amount, note, status,
}: {
  coverage: number;
  amount: ReactNode;
  note: ReactNode;
  status: ReactNode;
}) => (
  <Card className="rounded-2xl border-border/60 bg-gradient-to-br from-sky-50/80 via-background to-background shadow-sm dark:from-primary/10">
    <CardContent className="p-5 sm:p-6 flex flex-col md:flex-row items-center gap-6 md:gap-8">
      <Gauge pct={coverage} />
      <div className="flex-1 min-w-0 text-center md:text-left">
        <div className="mb-2 flex items-center justify-center gap-2 md:justify-start">
          <Image src={ART.wallet} alt="" aria-hidden="true" width={160} height={160} sizes="32px" className={`${artTile} h-8 w-8 p-0.5`} />
          <p className="text-sm font-medium text-muted-foreground">จำนวนเงินคร่าวๆที่ต้องใช้</p>
        </div>
        <p className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground tabular-nums">{amount}</p>
        <p className="text-xs sm:text-sm text-muted-foreground mt-2 leading-relaxed">{note}</p>
        {status && <div className="mt-4">{status}</div>}
      </div>
    </CardContent>
  </Card>
);

const gaugeColor = (pct: number) => (pct >= 100 ? "hsl(var(--primary))" : pct >= 60 ? "#f59e0b" : "#ef4444");

/** Floating one-line version of the summary card (mobile: left of the floating LINE/Facebook buttons). */
const SummaryBar = ({
  visible, coverage, amount, below, onClick,
}: {
  visible: boolean;
  coverage: number;
  amount: string;
  below: boolean;
  onClick: () => void;
}) => {
  const reduceMotion = useReducedMotion();
  const pct = Math.max(0, Math.min(100, coverage));
  const r = 15;
  const c = 2 * Math.PI * r;
  const Arrow = below ? ArrowDown : ArrowUp;
  return (
    <div className="pointer-events-none fixed bottom-4 left-4 right-[88px] z-40 sm:left-1/2 sm:right-auto sm:w-[24rem] sm:-translate-x-1/2">
      <AnimatePresence>
        {visible && (
          <motion.button
            type="button"
            onClick={onClick}
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? { opacity: 0, transition: { duration: 0 } } : { opacity: 0, y: 12 }}
            transition={{ duration: 0.2 }}
            className="pointer-events-auto flex min-h-14 w-full items-center gap-3 rounded-2xl border border-border bg-background/95 px-3 py-2 text-left shadow-lg backdrop-blur focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <span className="relative h-10 w-10 shrink-0">
              <svg viewBox="0 0 36 36" className="h-full w-full -rotate-90" aria-hidden>
                <circle cx="18" cy="18" r={r} stroke="hsl(var(--muted))" strokeWidth="4" fill="none" />
                <circle cx="18" cy="18" r={r} stroke={gaugeColor(pct)} strokeWidth="4" strokeLinecap="round" fill="none"
                  strokeDasharray={c} strokeDashoffset={c - (pct / 100) * c} />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold tabular-nums text-foreground">
                <span className="sr-only">ครอบคลุมงบประมาณ </span>{Math.round(pct)}%
              </span>
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[11px] leading-tight text-muted-foreground">จำนวนเงินคร่าวๆที่ต้องใช้</span>
              <span className="block truncate text-base font-bold leading-snug tabular-nums text-foreground">{amount}</span>
            </span>
            <Arrow className="h-4 w-4 shrink-0 text-primary" aria-hidden />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

const DetailsToggle = ({ open, onToggle }: { open: boolean; onToggle: () => void }) => (
  <button
    type="button"
    aria-expanded={open}
    onClick={onToggle}
    className="w-full min-h-10 flex items-center justify-between rounded-lg px-1 text-sm font-medium text-primary hover:text-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
  >
    <span>รายละเอียดค่าใช้จ่าย</span>
    <ChevronDown className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`} aria-hidden />
  </button>
);

const Gauge = ({ pct }: { pct: number }) => {
  const clamped = Math.max(0, Math.min(100, pct));
  const r = 72;
  const c = 2 * Math.PI * r;
  const offset = c - (clamped / 100) * c;
  const stroke = gaugeColor(clamped);
  return (
    <div className="relative w-44 h-44">
      <svg viewBox="0 0 180 180" className="w-full h-full -rotate-90">
        <circle cx="90" cy="90" r={r} stroke="hsl(var(--muted))" strokeWidth="14" fill="none" />
        <motion.circle
          cx="90" cy="90" r={r}
          stroke={stroke}
          strokeWidth="14"
          strokeLinecap="round"
          fill="none"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xs text-muted-foreground mb-1">ครอบคลุมงบประมาณ</span>
        <span className="text-3xl font-bold text-foreground">{Math.round(clamped)}%</span>
      </div>
    </div>
  );
};

const PathwayCard = ({
  tier, calc, fmtMoney, elicosWeekly, degreeLevel,
}: {
  tier: PathwayTier;
  calc: PathwayCalc;
  fmtMoney: (aud: number) => string;
  elicosWeekly: number;
  degreeLevel?: DegreeLevel;
}) => {
  const [open, setOpen] = useState(false);
  const risk = riskBadge(calc.adjusted);
  const isDegree = tier.sector === "he";

  return (
    <div className={isDegree ? "sm:col-span-2" : undefined}>
      <Card className={`h-full rounded-2xl border-2 ring-1 shadow-sm ${risk.ring}`}>
        <CardContent className="p-5 sm:p-6">
          <div className="flex items-start justify-between gap-3 mb-4">
            <div className="flex items-center gap-3 min-w-0">
              <Image
                src={isDegree ? ART.degree : ART.vet}
                alt=""
                aria-hidden="true"
                width={160}
                height={160}
                sizes="40px"
                className={`${artTile} h-10 w-10 p-1`}
              />
              <div className="min-w-0">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  {isDegree ? "เรียนระดับปริญญาตรีขึ้นไป" : "เรียนวิชาชีพ"}
                </p>
                <h4 className="text-lg font-bold text-foreground leading-tight">
                  {isDegree ? (degreeLevel === "master" ? "ปริญญาโท" : "ปริญญาตรี") : tier.tier}
                </h4>
              </div>
            </div>
            {tier.badge && <Badge variant="outline" className="text-[10px] shrink-0">{tier.badge}</Badge>}
          </div>

          <div className="mb-4">
            <p className="text-xs text-muted-foreground">จำนวนเงินคร่าวๆที่ต้องใช้</p>
            <p className="text-3xl font-bold tracking-tight text-foreground tabular-nums">{fmtMoney(calc.upfront)}</p>
          </div>

          <div className="grid grid-cols-1 min-[420px]:grid-cols-2 gap-2 mb-4">
            <div className="rounded-xl bg-muted/50 px-3 py-2.5">
              <p className="text-xs text-muted-foreground">ค่าเรียนทั้งหมด</p>
              <p className="text-base font-semibold text-foreground tabular-nums">{fmtMoney(calc.totalCourseValue)}</p>
            </div>
            <div className="rounded-xl bg-muted/50 px-3 py-2.5 flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary shrink-0" aria-hidden />
              <p className="text-sm font-semibold text-foreground">
                {tier.durationYears} ปี · วีซ่า ~{calc.visaMonths} เดือน
              </p>
            </div>
          </div>

          {isDegree && (
            <div className="mb-4 flex items-start gap-2 rounded-xl bg-amber-500/10 border border-amber-500/30 p-3">
              <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" aria-hidden />
              <p className="text-xs leading-relaxed text-amber-700">
                ราคาค่าเรียนเป็นการประมาณเท่านั้น ค่าเรียนขึ้นอยู่กับคณะและมหาวิทยาลัยที่เลือกเรียน
              </p>
            </div>
          )}

          <div className={`rounded-xl p-3 mb-3 ${risk.bg}`}>
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="text-xs text-muted-foreground">เปอร์เซนต์ที่วีซ่าจะผ่าน</span>
              <Badge variant="outline" className={`text-[10px] ${risk.text} border-current`}>{risk.label}</Badge>
            </div>
            <span className={`text-2xl font-bold tabular-nums ${risk.text}`}>{calc.adjusted.toFixed(1)}%</span>
          </div>

          {/* Expandable budget breakdown */}
          <div className="border-t border-border pt-2">
            <DetailsToggle open={open} onToggle={() => setOpen((o) => !o)} />
            <AnimatePresence initial={false}>
              {open && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <div className={breakdownBox}>
                    <Row
                      label="ค่าเรียนภาษา"
                      sub={calc.englishWeeks > 0 ? `${calc.englishWeeks} สัปดาห์ @ $${elicosWeekly}` : undefined}
                      value={fmtMoney(calc.englishCost)}
                    />
                    <Row
                      label="ค่าเรียนเทอมแรก"
                      sub={`${Math.round(tier.depositPct * 100)}% ของ ${fmtMoney(calc.annual)}`}
                      value={fmtMoney(calc.deposit)}
                    />
                    <Row label="ค่าวีซ่านักเรียน" value={fmtMoney(calc.visaFee)} />
                    <Row label="ค่าประกัน OSHC" sub={`${calc.visaMonths} เดือน`} value={fmtMoney(calc.oshc)} />
                    <div className={breakdownTotals}>
                      <Row label="ค่าใช้จ่ายที่ต้องจ่ายวันที่สมัครเรียน" value={fmtMoney(calc.upfront)} bold />
                      <Row label="ค่าเทอมที่เหลือ" value={fmtMoney(calc.remainingTuition)} muted />
                      <Row label="ค่าเรียนทั้งหมด" value={fmtMoney(calc.totalCourseValue)} muted />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const breakdownBox = "space-y-2 text-xs rounded-xl border border-border/60 bg-muted/30 p-3 mt-1 mb-1";
const breakdownTotals = "border-t border-border pt-2 mt-2 space-y-1.5";

const Row = ({ label, sub, value, bold, muted }: { label: string; sub?: string; value: string; bold?: boolean; muted?: boolean }) => (
  <div className="flex items-center justify-between gap-3">
    <div className="min-w-0">
      <p className={`${bold ? "font-semibold text-foreground" : muted ? "text-muted-foreground" : "text-foreground"}`}>{label}</p>
      {sub && <p className="text-[10px] text-muted-foreground">{sub}</p>}
    </div>
    <span className={`tabular-nums ${bold ? "font-bold text-foreground" : muted ? "text-muted-foreground" : "text-foreground"}`}>{value}</span>
  </div>
);

const ElicosCard = ({
  calc, fmtMoney, selected,
}: {
  calc: ElicosOnlyCalc;
  fmtMoney: (aud: number) => string;
  selected?: boolean;
}) => {
  const [open, setOpen] = useState(false);
  const risk = riskBadge(calc.adjusted);
  const partPay = calc.paidPct < 1;
  return (
    <Card className={`h-full rounded-2xl border-2 ring-1 shadow-sm ${risk.ring} ${selected ? "border-primary" : ""}`}>
      <CardContent className="p-5 sm:p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">ELICOS</p>
            <h4 className="font-bold text-foreground">ระยะเวลาเรียนคอร์สภาษาอังกฤษ {calc.weeks} สัปดาห์</h4>
          </div>
          {partPay && (
            <Badge variant="outline" className="text-[10px]">จ่ายก่อน 50% ได้</Badge>
          )}
        </div>

        <div className="mt-4">
          <p className="text-xs text-muted-foreground">ค่าใช้จ่ายที่ต้องจ่ายครั้งแรก</p>
          <p className="text-2xl font-bold tracking-tight text-foreground tabular-nums">{fmtMoney(calc.upfront)}</p>
        </div>
        <div className="mt-3 rounded-xl bg-muted/50 px-3 py-2.5 flex items-start gap-2">
          <Clock className="w-4 h-4 text-primary shrink-0 mt-0.5" aria-hidden />
          <div>
            <p className="text-xs text-muted-foreground">ระยะเวลาของวีซ่าที่คาดว่าจะได้</p>
            <p className="text-sm font-semibold text-foreground">~{calc.visaMonths} เดือน</p>
          </div>
        </div>

        {partPay && (
          <p className="text-xs text-amber-700 bg-amber-500/10 border border-amber-500/30 rounded-xl px-3 py-2 mt-3">
            ค่าเรียนที่เหลือ <strong>{fmtMoney(calc.remainingTuition)}</strong>
          </p>
        )}

        <div className="mt-3 border-t border-border pt-2">
        <DetailsToggle open={open} onToggle={() => setOpen((o) => !o)} />
        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <div className={breakdownBox}>
                <Row
                  label={partPay ? "ค่าเรียนภาษา (จ่าย 50%)" : "ค่าเรียนภาษา"}
                  sub={`${calc.weeks} สัปดาห์ @ $${calc.weeklyCost}`}
                  value={fmtMoney(calc.paidTuition)}
                />
                <Row label="ค่าวีซ่านักเรียน" value={fmtMoney(calc.visaFee)} />
                <Row label="ค่าประกัน OSHC" sub={`${calc.visaMonths} เดือน`} value={fmtMoney(calc.oshc)} />
                <div className={breakdownTotals}>
                  <Row label="ค่าใช้จ่ายที่ต้องจ่ายวันที่สมัครเรียน" value={fmtMoney(calc.upfront)} bold />
                  {partPay && (
                    <>
                      <Row label="ค่าเทอมที่เหลือ" value={fmtMoney(calc.remainingTuition)} muted />
                      <Row label="ค่าเรียนทั้งหมด" value={fmtMoney(calc.tuition)} muted />
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        </div>
      </CardContent>
    </Card>
  );
};

const StandaloneEnglishSection = ({
  calc24, calc40, selected, onSelect, fmtMoney,
}: {
  calc24: ElicosOnlyCalc;
  calc40: ElicosOnlyCalc;
  selected: 24 | 40;
  onSelect: (w: 24 | 40) => void;
  fmtMoney: (aud: number) => string;
}) => {
  return (
    <div className="sm:col-span-2 space-y-4">
      <Card className="rounded-2xl border-border/60 shadow-sm">
        <CardContent className="p-5 sm:p-6 space-y-4">
          <div className="flex items-start gap-3">
            <Image src={ART.english} alt="" aria-hidden="true" width={160} height={160} sizes="40px" className={`${artTile} h-10 w-10 p-1`} />
            <div>
              <h4 className="font-bold text-foreground">เรียนภาษาอย่างเดียว</h4>
              <p className="text-xs text-muted-foreground mt-0.5">
                เรียนจำนวนสัปดาห์ที่อยากเรียนได้เลย การเรียนภาษาไม่จำเป็นต้องใช้คะแนนสอบภาษาอังกฤษ เช่น IELTS
                แต่การมีคะแนนภาษาจะช่วยเพิ่มน้ำหนักและแสดงถึงความตั้งใจในการยื่นวีซ่าว่าเราต้องการมาพัฒนาภาษาจริงๆ
              </p>
            </div>
          </div>
          <div className={segmentGroup}>
            {([24, 40] as const).map((w) => (
              <button
                key={w}
                type="button"
                aria-pressed={selected === w}
                onClick={() => onSelect(w)}
                className={`px-3 py-2.5 text-left ${segmentButton(selected === w)}`}
              >
                <div className="text-sm font-semibold text-foreground">{w} สัปดาห์</div>
                <div className="text-[11px] text-muted-foreground">
                  {w === 24 ? "ต้องจ่ายค่าเรียนเต็มจำนวน ใช้ระยะเวลาเรียนประมาณ 6 เดือน" : "จ่ายค่าเรียนครึ่งหนึ่งก่อนได้ ใช้ระยะเวลาเรียนประมาณ 10 เดือน"}
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid sm:grid-cols-2 gap-4">
        <ElicosCard calc={calc24} fmtMoney={fmtMoney} selected={selected === 24} />
        <ElicosCard calc={calc40} fmtMoney={fmtMoney} selected={selected === 40} />
      </div>
    </div>
  );
};

export default BudgetStudyPlanner;

// ============================================================
// Short experience & Skill booster section
// ============================================================

const ShortPathwaySection = ({
  whm, tour, shortWeeks, setShortWeeks, shortSkill, setShortSkill,
  elicosWeekly, fmtMoney, budgetAUD, age,
}: {
  whm: ShortPathwayCalc;
  tour: ShortPathwayCalc;
  shortWeeks: number;
  setShortWeeks: (n: number) => void;
  shortSkill: SkillBoosterKey;
  setShortSkill: (k: SkillBoosterKey) => void;
  elicosWeekly: number;
  fmtMoney: (aud: number) => string;
  budgetAUD: number;
  age: number;
}) => {
  const whmEligible = age < THAI_WHM_MIN_AGE;

  return (
    <div className="sm:col-span-2 space-y-4">
      {/* Shared controls */}
      <Card className="rounded-2xl border-border/60 shadow-sm">
        <CardContent className="p-5 sm:p-6 space-y-6">
          <div className="flex items-start gap-3">
            <Image src={ART.short} alt="" aria-hidden="true" width={160} height={160} sizes="40px" className={`${artTile} h-10 w-10 p-1`} />
            <div>
              <h4 className="font-bold text-foreground">คอร์สระยะสั้น / เพิ่มทักษะ</h4>
              <p className="text-xs text-muted-foreground mt-0.5">
                เป็นทางเลือกสำหรับนักเรียนที่ไม่ต้องการเรียนคอร์สปริญญา
              </p>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between gap-3 mb-4">
              <Label id="bsp-short-weeks-label" className="text-foreground text-sm font-semibold">ระยะเวลาที่ต้องเรียนภาษาเพิ่ม</Label>
              <span className={valueChip}>
                {shortWeeks} สัปดาห์
              </span>
            </div>
            <Slider
              value={[shortWeeks]}
              min={0}
              max={WHM_MAX_STUDY_WEEKS}
              step={1}
              onValueChange={([v]) => setShortWeeks(Math.min(WHM_MAX_STUDY_WEEKS, v))}
              aria-labelledby="bsp-short-weeks-label"
            />
            <p className="text-[11px] text-muted-foreground mt-2">
              สำหรับวีซ่า WHM จะเรียนได้มากสุด 17 สัปดาห์
            </p>
          </div>

          <div>
            <Label className="text-foreground text-sm font-semibold mb-3 block">เรียนคอร์สวิชาชีพระยะสั้นที่อยากเรียน</Label>
            <div className="grid grid-cols-3 gap-2">
              {([
                { id: "none",      label: "ภาษาอย่างเดียว", sub: "—" },
                { id: "childcare", label: "Childcare",    sub: `$${SKILL_BOOSTERS.childcare.low.toLocaleString()}–$${SKILL_BOOSTERS.childcare.high.toLocaleString()}` },
                { id: "agedCare",  label: "Aged Care",    sub: `$${SKILL_BOOSTERS.agedCare.low.toLocaleString()}–$${SKILL_BOOSTERS.agedCare.high.toLocaleString()}` },
              ] as { id: SkillBoosterKey; label: string; sub: string }[]).map((s) => (
                <button
                  key={s.id}
                  type="button"
                  aria-pressed={shortSkill === s.id}
                  onClick={() => setShortSkill(s.id)}
                  className={`min-h-11 px-2.5 py-2 rounded-xl border-2 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                    shortSkill === s.id ? "border-primary bg-primary/[0.06] shadow-sm" : "border-border bg-background hover:border-primary/40"
                  }`}
                >
                  <div className="text-xs font-semibold text-foreground">{s.label}</div>
                  <div className="text-[10px] text-muted-foreground">{s.sub}</div>
                </button>
              ))}
            </div>
          </div>

        </CardContent>
      </Card>

      {/* Pathway comparison */}
      <div className="grid sm:grid-cols-2 gap-4">
        {whmEligible ? (
          <ShortCard
            icon={<Briefcase className="w-5 h-5 text-primary" />}
            title="Working Holiday (WHM)"
            tagline="เรียนและทำงานที่ออสเตรเลียด้วยงบไม่เกิน 100,000 บาท"
            calc={whm}
            elicosWeekly={elicosWeekly}
            shortSkill={shortSkill}
            fmtMoney={fmtMoney}
            budgetAUD={budgetAUD}
          />
        ) : (
          <Card className="h-full rounded-2xl border-2 border-dashed border-border bg-muted/30">
            <CardContent className="p-5 flex flex-col gap-2">
              <div className="flex items-start gap-2">
                <Briefcase className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-foreground leading-tight">Working Holiday (WHM)</h4>
                  <p className="text-[11px] text-muted-foreground mt-0.5">ข้อกำหนดของวีซ่า WHM</p>
                </div>
              </div>
              <div className="flex items-start gap-2 rounded-md bg-amber-500/10 border border-amber-500/30 p-2.5 mt-1">
                <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <p className="text-xs text-amber-700">
                  สำหรับคนไทยที่มีอายุ 31 ปีขึ้นไปจะไม่สามารถสมัครวีซ่า WHM ได้ แต่จะสามารถสมัครวีซ่านักเรียนได้ ทั้งนี้โอกาสที่วีซ่าจะผ่านนั้นขึ้นอยู่กับประวัติและจุดประสงค์ในการเรียนของแต่ละคน
                </p>
              </div>
            </CardContent>
          </Card>
        )}
        <ShortCard
          icon={<Plane className="w-5 h-5 text-primary" />}
          title="เรียนด้วยวีซ่าท่องเที่ยว"
          tagline="เรียนและท่องเที่ยวด้วยงบไม่เกิน 150,000 บาท"
          calc={tour}
          elicosWeekly={elicosWeekly}
          shortSkill="none"
          fmtMoney={fmtMoney}
          budgetAUD={budgetAUD}
          tourCta
        />
      </div>

    </div>
  );
};

const ShortCard = ({
  icon, title, tagline, calc, elicosWeekly, shortSkill, fmtMoney, budgetAUD, tourCta,
}: {
  icon: React.ReactNode;
  title: string;
  tagline: string;
  calc: ShortPathwayCalc;
  elicosWeekly: number;
  shortSkill: SkillBoosterKey;
  fmtMoney: (aud: number) => string;
  budgetAUD: number;
  tourCta?: boolean;
}) => {
  const [open, setOpen] = useState(true);
  const visaLabel = calc.visaType === "whm" ? "ค่าวีซ่า WHM" : calc.visaType === "tourist" ? "ค่าวีซ่าท่องเที่ยว" : "ค่าวีซ่านักเรียน";
  const skillRange = shortSkill === "none"
    ? null
    : `${fmtMoney(SKILL_BOOSTERS[shortSkill].low)} – ${fmtMoney(SKILL_BOOSTERS[shortSkill].high)}`;
  const covers = budgetAUD >= calc.upfrontHigh;
  return (
    <div>
      <Card className="h-full rounded-2xl border-2 border-border shadow-sm">
        <CardContent className="p-5 sm:p-6">
          <div className="flex items-start gap-2 mb-3">
            {icon}
            <div className="min-w-0">
              <h4 className="font-bold text-foreground leading-tight">{title}</h4>
              <p className="text-[11px] text-muted-foreground mt-0.5">{tagline}</p>
            </div>
          </div>

          <div className="mb-3">
            <p className="text-xs text-muted-foreground">จำนวนเงินคร่าวๆที่ต้องใช้</p>
            <p className="text-2xl font-bold tracking-tight text-foreground tabular-nums">
              {fmtMoney(calc.upfrontLow)}
              {calc.upfrontHigh !== calc.upfrontLow && (
                <span className="text-base font-semibold text-muted-foreground"> – {fmtMoney(calc.upfrontHigh)}</span>
              )}
            </p>
          </div>

          <div className="border-t border-border pt-2 mb-3">
          <DetailsToggle open={open} onToggle={() => setOpen((o) => !o)} />
          <AnimatePresence initial={false}>
            {open && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
              >
                <div className={breakdownBox}>
                  <Row
                    label="ค่าเรียนภาษา"
                    sub={calc.englishWeeks > 0 ? `${calc.englishWeeks} สัปดาห์ @ $${elicosWeekly} (สูงสุด ${WHM_MAX_STUDY_WEEKS} สัปดาห์)` : undefined}
                    value={fmtMoney(calc.englishCost)}
                  />
                  {skillRange && (
                    <Row
                      label={shortSkill === "childcare" ? "Fast-Track Childcare" : "Fast-Track Aged Care"}
                      sub="ราคาจะขึ้นอยู่กับคอร์สและโรงเรียน"
                      value={skillRange}
                    />
                  )}
                  <Row label={visaLabel} value={fmtMoney(calc.visaFee)} />
                  <Row label="ค่าประกัน OSHC" value={fmtMoney(0)} muted />
                  <div className={breakdownTotals}>
                    <Row
                      label="ค่าใช้จ่ายที่ต้องจ่ายวันที่สมัครเรียน"
                      value={skillRange ? `${fmtMoney(calc.upfrontLow)} – ${fmtMoney(calc.upfrontHigh)}` : fmtMoney(calc.upfrontLow)}
                      bold
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          </div>

          <Badge
            variant="outline"
            className={covers ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-700" : "border-amber-500/40 bg-amber-500/10 text-amber-700"}
          >
            {covers ? <ShieldCheck className="w-3 h-3 mr-1" /> : <AlertTriangle className="w-3 h-3 mr-1" />}
            {covers ? "คุณมีเงินเพียงพอแล้วที่จะสมัครเรียนได้" : `ยังขาดอยู่ ${fmtMoney(Math.max(0, calc.upfrontHigh - budgetAUD))}`}
          </Badge>

          {tourCta && (
            <a
              href="https://line.me/R/ti/p/@beyondstudy"
              target="_blank"
              rel="noreferrer"
              className="mt-4 flex min-h-11 items-center justify-between gap-2 rounded-xl border border-primary/30 bg-primary/5 px-3 py-2 text-xs font-medium text-primary hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <span>อยากปรึกษาเพิ่มเติม? ทักทีมงานได้เลย</span>
              <ArrowRight className="w-3 h-3 shrink-0" aria-hidden />
            </a>
          )}
        </CardContent>
      </Card>
    </div>
  );
};