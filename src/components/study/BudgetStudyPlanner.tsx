'use client'

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin, Wallet, User, Languages, Target,
  ShieldCheck, AlertTriangle,
  Sparkles, ArrowRight,
  ChevronDown, Info, Plane, Briefcase, GraduationCap, Lightbulb,
} from "lucide-react";
import BSCConsultationCTA from "../shared/BSCConsultationCTA";
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
      <div className="text-center mb-8">
        <Badge variant="secondary" className="mb-3 gap-1">
          <Sparkles className="w-3 h-3" /> อ้างอิงข้อมูลจากเดือนกันยายน 2569
        </Badge>
        <h3 className="text-2xl md:text-3xl font-bold text-foreground">วางแผนงบเรียนต่อออสเตรเลียเบื้องต้น</h3>
        <p className="text-muted-foreground text-sm mt-2">
          ประเมินเงินที่ต้องเตรียมในช่วงเริ่มต้น พร้อมดูรายการค่าใช้จ่ายแบบคร่าวๆ
        </p>
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Inputs */}
        <Card className="lg:col-span-2 border-border/60 bg-gradient-to-br from-background to-muted/30 backdrop-blur">
          <CardContent className="p-6 space-y-6">
            <div>
              <Label className="flex items-center gap-2 mb-3 text-foreground">
                <Target className="w-4 h-4 text-primary" /> เป้าหมายการเรียน
              </Label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  aria-pressed={goal === "english"}
                  onClick={() => setGoal("english")}
                  className={`px-3 py-2.5 rounded-lg border-2 text-left transition-all ${
                    goal === "english" ? "border-primary bg-primary/10" : "border-border hover:border-primary/40"
                  }`}
                >
                  <div className="text-sm font-semibold text-foreground">เรียนภาษาอังกฤษ</div>
                  <div className="text-xs text-muted-foreground">หลักสูตร ELICOS</div>
                </button>
                <button
                  type="button"
                  aria-pressed={goal === "vet"}
                  onClick={() => setGoal("vet")}
                  className={`px-3 py-2.5 rounded-lg border-2 text-left transition-all ${
                    goal === "vet" ? "border-primary bg-primary/10" : "border-border hover:border-primary/40"
                  }`}
                >
                  <div className="text-sm font-semibold text-foreground">เรียนสายอาชีพ</div>
                  <div className="text-xs text-muted-foreground">IELTS ขั้นต่ำ 6.0</div>
                </button>
                <button
                  type="button"
                  aria-pressed={goal === "he" && degreeLevel === "bachelor"}
                  onClick={() => { setGoal("he"); setDegreeLevel("bachelor"); }}
                  className={`px-3 py-2.5 rounded-lg border-2 text-left transition-all ${
                    goal === "he" && degreeLevel === "bachelor" ? "border-primary bg-primary/10" : "border-border hover:border-primary/40"
                  }`}
                >
                  <div className="text-sm font-semibold text-foreground">ปริญญาตรี</div>
                  <div className="text-xs text-muted-foreground">ควรจะมี IELTS อย่างน้อย 6.5 ใช้เวลาเรียนประมาณ 3 ปี</div>
                </button>
                <button
                  type="button"
                  aria-pressed={goal === "he" && degreeLevel === "master"}
                  onClick={() => { setGoal("he"); setDegreeLevel("master"); }}
                  className={`px-3 py-2.5 rounded-lg border-2 text-left transition-all ${
                    goal === "he" && degreeLevel === "master" ? "border-primary bg-primary/10" : "border-border hover:border-primary/40"
                  }`}
                >
                  <div className="text-sm font-semibold text-foreground">ปริญญาโท</div>
                  <div className="text-xs text-muted-foreground">ควรจะมี IELTS อย่างน้อย 6.5 ใช้เวลาเรียนประมาณ 2 ปี</div>
                </button>
                <button
                  type="button"
                  aria-pressed={goal === "short"}
                  onClick={() => setGoal("short")}
                  className={`col-span-2 px-3 py-2.5 rounded-lg border-2 text-left transition-all ${
                    goal === "short" ? "border-primary bg-primary/10" : "border-border hover:border-primary/40"
                  }`}
                >
                  <div className="text-sm font-semibold text-foreground">คอร์สระยะสั้น / เพิ่มทักษะ</div>
                  <div className="text-xs text-muted-foreground">เหมาะสำหรับผู้ที่ถือวีซ่า WAH หรือต้องการเรียนคอร์ส Fast Track</div>
                </button>
              </div>
              {suggestShort && (
                <button
                  onClick={() => setGoal("short")}
                  className="mt-3 w-full text-left rounded-lg border border-amber-500/40 bg-amber-500/10 p-3 hover:bg-amber-500/15 transition-all"
                >
                  <div className="flex items-start gap-2">
                    <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-semibold text-amber-700">
                        งบต่ำกว่า ฿180,000? ลองเส้นทาง WAH หรือเรียนด้วยวีซ่าท่องเที่ยวก่อน
                      </p>
                      <p className="text-[11px] text-amber-700/80 mt-0.5">
                        หารายได้ เรียนรู้ และสัมผัสประสบการณ์ที่ออสเตรเลีย ก่อนตัดสินใจเรียนต่อแบบเต็มรูปแบบ
                      </p>
                    </div>
                  </div>
                </button>
              )}
            </div>

            <div>
              <Label className="flex items-center gap-2 mb-3 text-foreground">
                <MapPin className="w-4 h-4 text-primary" /> ยื่นวีซ่าจากที่ไหน
              </Label>
              <div className="grid grid-cols-2 gap-2">
                {(["offshore", "onshore"] as Location[]).map((loc) => (
                  <button
                    key={loc}
                    type="button"
                    aria-pressed={location === loc}
                    onClick={() => setLocation(loc)}
                    className={`px-3 py-2.5 rounded-lg border-2 text-sm font-medium transition-all ${
                      location === loc
                        ? "border-primary bg-primary/10 text-foreground"
                        : "border-border text-muted-foreground hover:border-primary/40"
                    }`}
                  >
                    {loc === "offshore" ? "ประเทศไทย" : "ออสเตรเลีย"}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <Label htmlFor="bsp-budget" id="bsp-budget-label" className="flex items-center gap-2 text-foreground">
                  <Wallet className="w-4 h-4 text-primary" /> งบที่เตรียมไว้
                </Label>
                <div className="flex rounded-md border border-border overflow-hidden text-xs">
                  {(["THB", "AUD"] as const).map((c) => (
                    <button
                      key={c}
                      type="button"
                      aria-pressed={currency === c}
                      onClick={() => setCurrency(c)}
                      className={`px-2.5 py-1 ${currency === c ? "bg-primary text-primary-foreground" : "bg-background text-muted-foreground"}`}
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
                className="text-lg font-semibold"
              />
              <Slider
                value={[budget]}
                min={currency === "AUD" ? 5_000 : 100_000}
                max={currency === "AUD" ? 150_000 : 3_500_000}
                step={currency === "AUD" ? 500 : 10_000}
                onValueChange={([v]) => setBudget(v)}
                aria-labelledby="bsp-budget-label"
                className="mt-4"
              />
              <p className="text-xs text-muted-foreground mt-2">
                ≈ {currency === "AUD" ? fmtTHB(budgetTHB) : fmtAUD(budgetAUD)}
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <Label id="bsp-age-label" className="flex items-center gap-2 text-foreground">
                  <User className="w-4 h-4 text-primary" /> อายุผู้สมัคร
                </Label>
                <span className="text-sm font-semibold text-foreground">{age} ปี</span>
              </div>
              <Slider value={[age]} min={15} max={50} step={1} onValueChange={([v]) => setAge(v)} aria-labelledby="bsp-age-label" />
            </div>

            {goal !== "english" && (
              <>
                <div>
                  <Label className="flex items-center gap-2 mb-3 text-foreground">
                    <Languages className="w-4 h-4 text-primary" /> ตอนนี้คะแนน IELTS คุณอยู่ที่ประมาณเท่าไหร่
                  </Label>
                  <div className="grid grid-cols-6 gap-1.5">
                    {englishOptions.map((o) => (
                      <button
                        key={o.id}
                        type="button"
                        aria-pressed={english === o.id}
                        onClick={() => setEnglish(o.id)}
                        className={`px-1 py-2 rounded-md border text-xs font-medium transition-all ${
                          english === o.id
                            ? "border-primary bg-primary/10 text-foreground"
                            : "border-border text-muted-foreground hover:border-primary/40"
                        }`}
                      >
                        {o.label}
                      </button>
                    ))}
                  </div>
                  {englishPkg.needsLevel1 && (
                    <div className="mt-3 flex items-start gap-2 rounded-md bg-amber-500/10 border border-amber-500/30 p-2.5">
                      <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <p className="text-xs text-amber-700">
                        ถ้า IELTS ต่ำกว่า 5.0 แนะนำให้เรียนกับโรงเรียน <strong>Level 1</strong>
                      </p>
                    </div>
                  )}
                  {englishPkg.straightEntry && (
                    <p className="text-xs text-emerald-600 mt-2 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" /> ระดับภาษาอังกฤษคุณโอเคแล้ว! ไม่จำเป็นต้องเรียนภาษา
                    </p>
                  )}
                  {englishPkg.weeks > 0 && (
                    <p className="text-xs text-muted-foreground mt-2">
                      แนะนำให้เรียนภาษาเป็นระยะเวลา <strong className="text-foreground">{englishPkg.weeks} สัปดาห์</strong> ราคาประมาณ ${elicosWeekly}/สัปดาห์
                    </p>
                  )}
                </div>

                {/* Global English tuition slider — affects every pathway card */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label id="bsp-elicos-label" className="flex items-center gap-2 text-foreground">
                      <GraduationCap className="w-4 h-4 text-primary" /> ค่าเรียนภาษา
                    </Label>
                    <span className="text-sm font-semibold text-foreground">${elicosWeekly}/สัปดาห์</span>
                  </div>
                  <Slider
                    value={[elicosWeekly]}
                    min={ELICOS_WEEKLY_MIN}
                    max={ELICOS_WEEKLY_MAX}
                    step={10}
                    onValueChange={([v]) => setElicosWeekly(v)}
                    aria-labelledby="bsp-elicos-label"
                  />
                  <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                    <span>${ELICOS_WEEKLY_MIN}/สัปดาห์</span>
                    <span>${ELICOS_WEEKLY_MAX}/สัปดาห์</span>
                  </div>
                </div>
              </>
            )}

            <p className="text-[11px] text-muted-foreground pt-2 border-t border-border">
              ราคาที่แสดงเป็นแค่การประมาณเท่านั้น
            </p>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="lg:col-span-3 space-y-6">
          <Card className="border-border/60 bg-gradient-to-br from-primary/5 via-background to-background">
            <CardContent className="p-6 flex flex-col md:flex-row items-center gap-6">
              <Gauge pct={headlineCoverage} />
              <div className="flex-1 text-center md:text-left">
                <p className="text-sm text-muted-foreground mb-1">จำนวนเงินคร่าวๆที่ต้องใช้</p>
                <p className="text-3xl font-bold text-foreground">
                  {fmtMoney(headlineUpfront)}
                  {headlineUpfrontHigh !== headlineUpfront && (
                    <span className="text-xl font-semibold text-muted-foreground"> – {fmtMoney(headlineUpfrontHigh)}</span>
                  )}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  {goal === "short"
                    ? `รวมค่าวีซ่า WAH และค่าเรียนภาษาเป็นเวลา ${shortWeeks} สัปดาห์`
                    : <>รวมค่ามัดจำ ค่าวีซ่านักเรียน ค่าประกัน OSHC{englishPkg.weeks > 0 && ` และค่าเรียนภาษา ${englishPkg.weeks} สัปดาห์`}</>}
                </p>
                {headlineCoverage >= 100 ? (
                  <Badge className="mt-3 bg-emerald-500/15 text-emerald-700 border-emerald-500/30">
                    <ShieldCheck className="w-3 h-3 mr-1" /> คุณมีเงินเพียงพอแล้วที่จะสมัครเรียนได้
                  </Badge>
                ) : headlineUpfrontHigh > 0 ? (
                  <Badge variant="outline" className="mt-3 border-amber-500/40 text-amber-700">
                    <AlertTriangle className="w-3 h-3 mr-1" /> ยังขาดอยู่: {fmtMoney(Math.max(0, headlineUpfrontHigh - budgetAUD))}
                  </Badge>
                ) : null}
              </div>
            </CardContent>
          </Card>

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
                  />
                ))
              )}
            </motion.div>
          </AnimatePresence>

          <BSCConsultationCTA />
        </div>
      </div>
    </div>
  );
};

const Gauge = ({ pct }: { pct: number }) => {
  const clamped = Math.max(0, Math.min(100, pct));
  const r = 72;
  const c = 2 * Math.PI * r;
  const offset = c - (clamped / 100) * c;
  const stroke = clamped >= 100 ? "hsl(var(--primary))" : clamped >= 60 ? "#f59e0b" : "#ef4444";
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
  tier, calc, fmtMoney, elicosWeekly,
}: {
  tier: PathwayTier;
  calc: PathwayCalc;
  fmtMoney: (aud: number) => string;
  elicosWeekly: number;
}) => {
  const [open, setOpen] = useState(false);
  const risk = riskBadge(calc.adjusted);

  return (
    <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
      <Card className={`h-full border-2 ring-1 ${risk.ring}`}>
        <CardContent className="p-5">
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                {tier.sector === "he" ? "เรียนระดับปริญญาตรีขึ้นไป" : "เรียนวิชาชีพ"}
              </p>
              <h4 className="font-bold text-foreground leading-tight">{tier.tier}</h4>
            </div>
            {tier.badge && <Badge variant="outline" className="text-[10px]">{tier.badge}</Badge>}
          </div>

          <div className="mb-4">
            <p className="text-2xl font-bold text-foreground">{fmtMoney(calc.upfront)}</p>
            <p className="text-xs text-muted-foreground">จำนวนเงินคร่าวๆที่ต้องใช้</p>
            <p className="text-xs text-muted-foreground mt-1">
              ค่าเรียนทั้งหมด: {fmtMoney(calc.totalCourseValue)} ({tier.durationYears} ปี · วีซ่า ~{calc.visaMonths} เดือน)
            </p>
          </div>

          {/* Expandable budget breakdown */}
          <button
            type="button"
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
            className="w-full flex items-center justify-between text-xs font-medium text-primary hover:text-primary/80 mb-2"
          >
            <span>รายละเอียดค่าใช้จ่าย</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`} />
          </button>
          <AnimatePresence initial={false}>
            {open && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
              >
                <div className="space-y-1.5 text-xs bg-muted/40 rounded-lg p-3 mb-3">
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
                  <div className="border-t border-border pt-1.5 mt-1.5">
                    <Row label="ค่าใช้จ่ายที่ต้องจ่ายวันที่สมัครเรียน" value={fmtMoney(calc.upfront)} bold />
                    <Row label="ค่าเทอมที่เหลือ" value={fmtMoney(calc.remainingTuition)} muted />
                    <Row label="ค่าเรียนทั้งหมด" value={fmtMoney(calc.totalCourseValue)} muted />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className={`rounded-lg p-3 ${risk.bg}`}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-muted-foreground">เปอร์เซนต์ที่วีซ่าจะผ่าน</span>
              <Badge variant="outline" className={`text-[10px] ${risk.text} border-current`}>{risk.label}</Badge>
            </div>
            <div className="flex items-baseline gap-2">
              <span className={`text-2xl font-bold ${risk.text}`}>{calc.adjusted.toFixed(1)}%</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

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
    <Card className={`border-2 ring-1 ${risk.ring} ${selected ? "border-primary" : ""}`}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">ELICOS</p>
            <h4 className="font-bold text-foreground">ระยะเวลาเรียนคอร์สภาษาอังกฤษ {calc.weeks} สัปดาห์</h4>
          </div>
          {partPay && (
            <Badge variant="outline" className="text-[10px]">จ่ายก่อน 50% ได้</Badge>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3 mt-4">
          <div>
            <p className="text-xs text-muted-foreground">ระยะเวลาของวีซ่าที่คาดว่าจะได้</p>
            <p className="text-base font-bold text-foreground">~{calc.visaMonths} เดือน</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">ค่าใช้จ่ายที่ต้องจ่ายครั้งแรก</p>
            <p className="text-base font-bold text-foreground">{fmtMoney(calc.upfront)}</p>
          </div>
        </div>

        {partPay && (
          <p className="text-[11px] text-amber-700 bg-amber-500/10 border border-amber-500/30 rounded-md px-2 py-1.5 mt-3">
            ค่าเรียนที่เหลือ <strong>{fmtMoney(calc.remainingTuition)}</strong>
          </p>
        )}

        <button
          type="button"
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
          className="mt-3 flex items-center justify-between w-full text-xs font-medium text-primary hover:text-primary/80"
        >
          <span>รายละเอียดค่าใช้จ่าย</span>
          <ChevronDown className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`} />
        </button>
        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <div className="space-y-1.5 text-xs bg-muted/40 rounded-lg p-3 mt-2">
                <Row
                  label={partPay ? "ค่าเรียนภาษา (จ่าย 50%)" : "ค่าเรียนภาษา"}
                  sub={`${calc.weeks} สัปดาห์ @ $${calc.weeklyCost}`}
                  value={fmtMoney(calc.paidTuition)}
                />
                <Row label="ค่าวีซ่านักเรียน" value={fmtMoney(calc.visaFee)} />
                <Row label="ค่าประกัน OSHC" sub={`${calc.visaMonths} เดือน`} value={fmtMoney(calc.oshc)} />
                <div className="border-t border-border pt-1.5 mt-1.5">
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
      <Card className="border-border/60">
        <CardContent className="p-5 space-y-3">
          <div className="flex items-start gap-3">
            <Languages className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-foreground">เรียนภาษาอย่างเดียว</h4>
              <p className="text-xs text-muted-foreground mt-0.5">
                เรียนจำนวนสัปดาห์ที่อยากเรียนได้เลย การเรียนภาษาไม่จำเป็นต้องใช้คะแนนสอบภาษาอังกฤษ เช่น IELTS
                แต่การมีคะแนนภาษาจะช่วยเพิ่มน้ำหนักและแสดงถึงความตั้งใจในการยื่นวีซ่าว่าเราต้องการมาพัฒนาภาษาจริงๆ
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {([24, 40] as const).map((w) => (
              <button
                key={w}
                type="button"
                aria-pressed={selected === w}
                onClick={() => onSelect(w)}
                className={`px-3 py-2.5 rounded-lg border-2 text-left transition-all ${
                  selected === w ? "border-primary bg-primary/10" : "border-border hover:border-primary/40"
                }`}
              >
                <div className="text-sm font-semibold text-foreground">{w} สัปดาห์</div>
                <div className="text-[11px] text-muted-foreground">
                  {w === 24 ? "ต้องจ่ายค่าเรียนเต็มจำนวน ใช้ระยะเวลาเรียนประมาณ 6 เดือน" : "จ่ายค่าเรียนครึ่งนึงก่อนได้ ใช้ระยะเวลาเรียนประมาณ 10 เดือน"}
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
      <Card className="border-border/60">
        <CardContent className="p-5 space-y-5">
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-foreground">คอร์สระยะสั้น / เพิ่มทักษะ</h4>
              <p className="text-xs text-muted-foreground mt-0.5">
                เป็นทางเลือกสำหรับนักเรียนที่ไม่ต้องการเรียนคอร์สปริญญา
              </p>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <Label id="bsp-short-weeks-label" className="text-foreground text-sm">ระยะเวลาที่ต้องเรียนภาษาเพิ่ม</Label>
              <span className="text-sm font-semibold text-foreground">
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
            <p className="text-[11px] text-muted-foreground mt-1">
              สำหรับวีซ่า WAH จะเรียนได้มากสุด 17 สัปดาห์
            </p>
          </div>

          <div>
            <Label className="text-foreground text-sm mb-2 block">เรียนคอร์สวิชาชีพระยะสั้นที่อยากเรียน</Label>
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
                  className={`px-2 py-2 rounded-lg border-2 text-left transition-all ${
                    shortSkill === s.id ? "border-primary bg-primary/10" : "border-border hover:border-primary/40"
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
            title="Working Holiday (WAH)"
            tagline="เรียน ทำงาน และ หาประสบการณ์ใหม่ด้วยงบไม่เกิน 100,000 บาท"
            calc={whm}
            elicosWeekly={elicosWeekly}
            shortSkill={shortSkill}
            fmtMoney={fmtMoney}
            budgetAUD={budgetAUD}
          />
        ) : (
          <Card className="h-full border-2 border-dashed border-border bg-muted/30">
            <CardContent className="p-5 flex flex-col gap-2">
              <div className="flex items-start gap-2">
                <Briefcase className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-foreground leading-tight">Working Holiday (WAH)</h4>
                  <p className="text-[11px] text-muted-foreground mt-0.5">ข้อกำหนดของวีซ่า WAH</p>
                </div>
              </div>
              <div className="flex items-start gap-2 rounded-md bg-amber-500/10 border border-amber-500/30 p-2.5 mt-1">
                <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <p className="text-xs text-amber-700">
                  สำหรับคนไทยที่มีอายุ 31 ปีขึ้นไปจะไม่สามารถสมัครวีซ่า WAH ได้ แต่จะสามารถสมัครวีซ่านักเรียนได้ ทั้งนี้โอกาสที่วีซ่าจะผ่านนั้นขึ้นอยู่กับประวัติและจุดประสงค์ในการเรียนของแต่ละคน
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
  const visaLabel = calc.visaType === "whm" ? "ค่าวีซ่า WAH" : calc.visaType === "tourist" ? "ค่าวีซ่าท่องเที่ยว" : "ค่าวีซ่านักเรียน";
  const skillRange = shortSkill === "none"
    ? null
    : `${fmtMoney(SKILL_BOOSTERS[shortSkill].low)} – ${fmtMoney(SKILL_BOOSTERS[shortSkill].high)}`;
  const covers = budgetAUD >= calc.upfrontHigh;
  return (
    <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
      <Card className="h-full border-2 border-border">
        <CardContent className="p-5">
          <div className="flex items-start gap-2 mb-3">
            {icon}
            <div className="min-w-0">
              <h4 className="font-bold text-foreground leading-tight">{title}</h4>
              <p className="text-[11px] text-muted-foreground mt-0.5">{tagline}</p>
            </div>
          </div>

          <div className="mb-3">
            <p className="text-xs text-muted-foreground">จำนวนเงินคร่าวๆที่ต้องใช้</p>
            <p className="text-2xl font-bold text-foreground">
              {fmtMoney(calc.upfrontLow)}
              {calc.upfrontHigh !== calc.upfrontLow && (
                <span className="text-base font-semibold text-muted-foreground"> – {fmtMoney(calc.upfrontHigh)}</span>
              )}
            </p>
          </div>

          <button
            type="button"
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
            className="w-full flex items-center justify-between text-xs font-medium text-primary hover:text-primary/80 mb-2"
          >
            <span>รายละเอียดค่าใช้จ่าย</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`} />
          </button>
          <AnimatePresence initial={false}>
            {open && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
              >
                <div className="space-y-1.5 text-xs bg-muted/40 rounded-lg p-3 mb-3">
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
                  <div className="border-t border-border pt-1.5 mt-1.5">
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

          <Badge
            variant="outline"
            className={covers ? "border-emerald-500/40 text-emerald-700" : "border-amber-500/40 text-amber-700"}
          >
            {covers ? <ShieldCheck className="w-3 h-3 mr-1" /> : <AlertTriangle className="w-3 h-3 mr-1" />}
            {covers ? "คุณมีเงินเพียงพอแล้วที่จะสมัครเรียนได้" : `ยังขาดอยู่ ${fmtMoney(Math.max(0, calc.upfrontHigh - budgetAUD))}`}
          </Badge>

          {tourCta && (
            <a
              href="https://line.me/R/ti/p/@beyondstudy"
              target="_blank"
              rel="noreferrer"
              className="mt-3 flex items-center justify-between rounded-lg border border-primary/30 bg-primary/5 px-3 py-2 text-xs text-primary hover:bg-primary/10"
            >
              <span>อยากปรึกษาเพิ่มเติม? ติดต่อทีมงานของเราได้เลย</span>
              <ArrowRight className="w-3 h-3" />
            </a>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};