'use client'

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin, Wallet, User, Languages, Target,
  TrendingUp, TrendingDown, ShieldCheck, AlertTriangle,
  Settings, MessageCircle, Sparkles, ArrowRight,
  ChevronDown, Info, Plane, Briefcase, GraduationCap, Lightbulb,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import BSCConsultationCTA from "../shared/BSCConsultationCTA";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  type Location, type PathwayTier, type PathwayCalc, type ElicosOnlyCalc,
  type SkillBoosterKey, type ShortPathwayCalc,
  DEFAULT_FX_THB_PER_AUD, DEFAULT_ELICOS_WEEKLY,
  ELICOS_WEEKLY_MIN, ELICOS_WEEKLY_MAX, WHM_MAX_STUDY_WEEKS,
  VISA_FEE_AUD, VISA_FEE_WHM_AUD, SKILL_BOOSTERS, SUGGESTED_SAVINGS,
  sectorRates, tiers,
  calcEnglishPackage, computePathway, computeElicosOnly, computeShortPathway,
  riskBadge, fmtAUD, fmtTHB,
} from "@/lib/CalculationEngine";

type Goal = "english" | "vet" | "he" | "short";
type EnglishLevel = "none" | "4.5" | "5.0" | "5.5" | "6.0" | "6.5+";
type DegreeLevel = "bachelor" | "master";

const THAI_WHM_MIN_AGE = 31;

const englishOptions: { id: EnglishLevel; label: string; numeric: number }[] = [
  { id: "none",  label: "None",  numeric: 0 },
  { id: "4.5",   label: "4.5",   numeric: 4.5 },
  { id: "5.0",   label: "5.0",   numeric: 5.0 },
  { id: "5.5",   label: "5.5",   numeric: 5.5 },
  { id: "6.0",   label: "6.0",   numeric: 6.0 },
  { id: "6.5+",  label: "6.5+",  numeric: 6.5 },
];

const goalMeta: Record<Goal, { label: string; sub: string; sector: "vet" | "he" | "elicos" }> = {
  english: { label: "Learn English",     sub: "ELICOS pathway",       sector: "elicos" },
  vet:     { label: "Skilled Diploma",   sub: "VET — IELTS 6.0",      sector: "vet" },
  he:      { label: "Bachelor / Master", sub: "Higher Ed — IELTS 6.5", sector: "he" },
  short:   { label: "Short experience & Skill booster", sub: "WHM · Study Tour · Fast-track", sector: "vet" },
};

const BudgetStudyPlanner = () => {
  const [location, setLocation] = useState<Location>("offshore");
  const [currency, setCurrency] = useState<"THB" | "AUD">("THB");
  const [budget, setBudget] = useState<number>(800_000);
  const [age, setAge] = useState<number>(24);
  const [english, setEnglish] = useState<EnglishLevel>("5.0");
  const [goal, setGoal] = useState<Goal>("he");
  const [showSettings, setShowSettings] = useState(false);
  const [rate, setRate] = useState<number>(DEFAULT_FX_THB_PER_AUD);
  const [elicosWeekly, setElicosWeekly] = useState<number>(DEFAULT_ELICOS_WEEKLY);
  // Short Experience controls
  const [shortWeeks, setShortWeeks] = useState<number>(10);
  const [shortSkill, setShortSkill] = useState<SkillBoosterKey>("none");
  // Standalone "Learn English" duration (weeks)
  const [standaloneWeeks, setStandaloneWeeks] = useState<24 | 40>(24);
  // Higher Education degree level — affects course duration only
  const [degreeLevel, setDegreeLevel] = useState<DegreeLevel>("bachelor");

  const budgetAUD = currency === "AUD" ? budget : budget / rate;
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

  const budgetTHB = currency === "THB" ? budget : budget * rate;
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

  const fmtMoney = (aud: number) => (currency === "AUD" ? fmtAUD(aud) : fmtTHB(aud * rate));

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <Badge variant="secondary" className="mb-3 gap-1">
          <Sparkles className="w-3 h-3" /> March 2026 Visa Data
        </Badge>
        <h3 className="text-2xl md:text-3xl font-bold text-foreground">Study & Budget Planner</h3>
        <p className="text-muted-foreground text-sm mt-2">
          Estimate your real Initial Budget Coverage and visa grant likelihood as a Thai applicant.
        </p>
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Inputs */}
        <Card className="lg:col-span-2 border-border/60 bg-gradient-to-br from-background to-muted/30 backdrop-blur">
          <CardContent className="p-6 space-y-6">
            <div>
              <Label className="flex items-center gap-2 mb-3 text-foreground">
                <MapPin className="w-4 h-4 text-primary" /> Location
              </Label>
              <div className="grid grid-cols-2 gap-2">
                {(["offshore", "onshore"] as Location[]).map((loc) => (
                  <button
                    key={loc}
                    onClick={() => setLocation(loc)}
                    className={`px-3 py-2.5 rounded-lg border-2 text-sm font-medium transition-all ${
                      location === loc
                        ? "border-primary bg-primary/10 text-foreground"
                        : "border-border text-muted-foreground hover:border-primary/40"
                    }`}
                  >
                    {loc === "offshore" ? "Offshore (TH)" : "Onshore (AU)"}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <Label className="flex items-center gap-2 text-foreground">
                  <Wallet className="w-4 h-4 text-primary" /> Initial Available Capital
                </Label>
                <div className="flex rounded-md border border-border overflow-hidden text-xs">
                  {(["THB", "AUD"] as const).map((c) => (
                    <button
                      key={c}
                      onClick={() => {
                        if (c === currency) return;
                        setBudget(c === "AUD" ? Math.round(budget / rate) : Math.round(budget * rate));
                        setCurrency(c);
                      }}
                      className={`px-2.5 py-1 ${currency === c ? "bg-primary text-primary-foreground" : "bg-background text-muted-foreground"}`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
              <Input
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
                className="mt-4"
              />
              <p className="text-xs text-muted-foreground mt-2">
                ≈ {currency === "AUD" ? fmtTHB(budget * rate) : fmtAUD(budget / rate)}
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <Label className="flex items-center gap-2 text-foreground">
                  <User className="w-4 h-4 text-primary" /> Age
                </Label>
                <span className="text-sm font-semibold text-foreground">{age} yrs</span>
              </div>
              <Slider value={[age]} min={15} max={50} step={1} onValueChange={([v]) => setAge(v)} />
            </div>

            <div>
              <Label className="flex items-center gap-2 mb-3 text-foreground">
                <Languages className="w-4 h-4 text-primary" /> Current English (IELTS)
              </Label>
              <div className="grid grid-cols-6 gap-1.5">
                {englishOptions.map((o) => (
                  <button
                    key={o.id}
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
                    IELTS below 5.0 may require packaging with <strong>Level 1 Institutions</strong>.
                  </p>
                </div>
              )}
              {englishPkg.straightEntry && goal !== "english" && (
                <p className="text-xs text-emerald-600 mt-2 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Straight entry — no English package required.
                </p>
              )}
              {englishPkg.weeks > 0 && goal !== "english" && (
                <p className="text-xs text-muted-foreground mt-2">
                  Suggested ELICOS package: <strong className="text-foreground">{englishPkg.weeks} weeks</strong> @ ${elicosWeekly}/wk
                </p>
              )}
            </div>

            {/* Global English tuition slider — affects every pathway card */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label className="flex items-center gap-2 text-foreground">
                  <GraduationCap className="w-4 h-4 text-primary" /> English Tuition
                </Label>
                <span className="text-sm font-semibold text-foreground">${elicosWeekly}/wk</span>
              </div>
              <Slider
                value={[elicosWeekly]}
                min={ELICOS_WEEKLY_MIN}
                max={ELICOS_WEEKLY_MAX}
                step={10}
                onValueChange={([v]) => setElicosWeekly(v)}
              />
              <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                <span>${ELICOS_WEEKLY_MIN}/wk · budget</span>
                <span>${ELICOS_WEEKLY_MAX}/wk · premium</span>
              </div>
            </div>

            <div>
              <Label className="flex items-center gap-2 mb-3 text-foreground">
                <Target className="w-4 h-4 text-primary" /> Target Goal
              </Label>
              <div className="grid grid-cols-2 gap-2">
                {(Object.keys(goalMeta) as Goal[]).map((g) => (
                  <button
                    key={g}
                    onClick={() => setGoal(g)}
                    className={`px-3 py-2.5 rounded-lg border-2 text-left transition-all ${
                      goal === g ? "border-primary bg-primary/10" : "border-border hover:border-primary/40"
                    }`}
                  >
                    <div className="text-sm font-semibold text-foreground">{goalMeta[g].label}</div>
                    <div className="text-xs text-muted-foreground">{goalMeta[g].sub}</div>
                  </button>
                ))}
              </div>
            {goal === "he" && (
              <div className="mt-3">
                <Label className="text-xs text-muted-foreground mb-2 block">Degree level</Label>
                <div className="grid grid-cols-2 gap-2">
                  {([
                    { id: "bachelor", label: "Bachelor", sub: "3 years" },
                    { id: "master",   label: "Master",   sub: "2 years" },
                  ] as { id: DegreeLevel; label: string; sub: string }[]).map((d) => (
                    <button
                      key={d.id}
                      onClick={() => setDegreeLevel(d.id)}
                      className={`px-3 py-2 rounded-lg border-2 text-left transition-all ${
                        degreeLevel === d.id ? "border-primary bg-primary/10" : "border-border hover:border-primary/40"
                      }`}
                    >
                      <div className="text-sm font-semibold text-foreground">{d.label}</div>
                      <div className="text-[11px] text-muted-foreground">{d.sub}</div>
                    </button>
                  ))}
                </div>
                <p className="text-[11px] text-muted-foreground mt-1.5">
                  Same annual tuition — Bachelor runs 3 years, Master runs 2 years.
                </p>
              </div>
            )}
              {suggestShort && (
                <button
                  onClick={() => setGoal("short")}
                  className="mt-3 w-full text-left rounded-lg border border-amber-500/40 bg-amber-500/10 p-3 hover:bg-amber-500/15 transition-all"
                >
                  <div className="flex items-start gap-2">
                    <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-semibold text-amber-700">
                        Budget under ฿180,000? Try the WHM or Study Tour pathway first.
                      </p>
                      <p className="text-[11px] text-amber-700/80 mt-0.5">
                        Earn, learn and experience Australia before committing to a full degree.
                      </p>
                    </div>
                  </div>
                </button>
              )}
            </div>

            <div className="pt-2 border-t border-border">
              <button
                onClick={() => setShowSettings((s) => !s)}
                className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
              >
                <Settings className="w-3 h-3" /> Admin settings (FX & ELICOS rate)
              </button>
              {showSettings && (
                <div className="mt-3 space-y-3">
                  <div>
                    <Label className="text-xs text-muted-foreground">FX rate (THB per AUD)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={rate}
                      onChange={(e) => setRate(parseFloat(e.target.value) || 0)}
                      className="h-8 text-sm mt-1"
                    />
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    Tip: adjust the global English Tuition slider above to model providers from $200–$630/wk.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="lg:col-span-3 space-y-6">
          <Card className="border-border/60 bg-gradient-to-br from-primary/5 via-background to-background">
            <CardContent className="p-6 flex flex-col md:flex-row items-center gap-6">
              <Gauge pct={headlineCoverage} />
              <div className="flex-1 text-center md:text-left">
                <p className="text-sm text-muted-foreground mb-1">Initial Budget Coverage</p>
                <p className="text-3xl font-bold text-foreground">{fmtMoney(headlineUpfront)}</p>
                <p className="text-xs text-muted-foreground mt-2">
                  {goal === "short"
                    ? `Lowest WHM upfront — visa $${VISA_FEE_WHM_AUD} (no OSHC required) + ${shortWeeks}w English up to ${WHM_MAX_STUDY_WEEKS} wks.`
                    : <>Lowest upfront in your range. Includes deposit + visa (${VISA_FEE_AUD.toLocaleString()}) + OSHC pro-rata{englishPkg.weeks > 0 && ` + ${englishPkg.weeks}w English`}.</>}
                </p>
                {headlineCoverage >= 100 ? (
                  <Badge className="mt-3 bg-emerald-500/15 text-emerald-700 border-emerald-500/30">
                    <ShieldCheck className="w-3 h-3 mr-1" /> Budget covers upfront cost
                  </Badge>
                ) : headlineUpfront > 0 ? (
                  <Badge variant="outline" className="mt-3 border-amber-500/40 text-amber-700">
                    <AlertTriangle className="w-3 h-3 mr-1" /> Shortfall: {fmtMoney(headlineUpfront - budgetAUD)}
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
                  location={location}
                  englishNumeric={englishNumeric}
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
                    location={location}
                    elicosWeekly={elicosWeekly}
                  />
                ))
              )}
            </motion.div>
          </AnimatePresence>

          {/* Beyond Study Advantage overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-xl border border-primary/30 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-5"
          >
            <div className="flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-foreground">Beyond Study Advantage</p>
                <p className="text-sm text-muted-foreground mt-1">
                  National Offshore VET grant rate is just {sectorRates.vet.offshore}%. Beyond Study profiles typically maintain
                  <strong className="text-foreground"> 90%+ success</strong> through pre-screening. Contact
                  <strong className="text-foreground"> @beyondstudy</strong> for a detailed risk assessment.
                </p>
              </div>
            </div>
          </motion.div>

          <div className="rounded-xl border border-border bg-card p-5 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <p className="font-semibold text-foreground">Want a personal evaluation?</p>
              <p className="text-sm text-muted-foreground">Our experts will review your profile in 24h.</p>
            </div>
            <Button asChild size="lg" className="gap-2">
              <a href="https://line.me/R/ti/p/@beyondstudy" target="_blank" rel="noreferrer">
                <MessageCircle className="w-4 h-4" />
                Evaluate my profile with an expert
                <ArrowRight className="w-4 h-4" />
              </a>
            </Button>
          </div>

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
        <span className="text-3xl font-bold text-foreground">{Math.round(clamped)}%</span>
        <span className="text-xs text-muted-foreground mt-1">Budget covered</span>
      </div>
    </div>
  );
};

const PathwayCard = ({
  tier, calc, fmtMoney, location, elicosWeekly,
}: {
  tier: PathwayTier;
  calc: PathwayCalc;
  fmtMoney: (aud: number) => string;
  location: Location;
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
                {tier.sector === "he" ? "Higher Education" : "VET"}
              </p>
              <h4 className="font-bold text-foreground leading-tight">{tier.tier}</h4>
            </div>
            {tier.badge && <Badge variant="outline" className="text-[10px]">{tier.badge}</Badge>}
          </div>

          <div className="mb-4">
            <p className="text-2xl font-bold text-foreground">{fmtMoney(calc.upfront)}</p>
            <p className="text-xs text-muted-foreground">Initial Budget Coverage</p>
            <p className="text-xs text-muted-foreground mt-1">
              Total course value: {fmtMoney(calc.totalCourseValue)} ({tier.durationYears}y · visa ~{calc.visaMonths}mo)
            </p>
          </div>

          {/* Expandable budget breakdown */}
          <button
            onClick={() => setOpen((o) => !o)}
            className="w-full flex items-center justify-between text-xs font-medium text-primary hover:text-primary/80 mb-2"
          >
            <span>Initial Budget Details</span>
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
                    label={`1st English Tuition`}
                    sub={calc.englishWeeks > 0 ? `${calc.englishWeeks} wks @ $${elicosWeekly}` : "Straight entry"}
                    value={fmtMoney(calc.englishCost)}
                  />
                  <Row
                    label={`1st Tuition Deposit`}
                    sub={`${Math.round(tier.depositPct * 100)}% of ${fmtMoney(calc.annual)}`}
                    value={fmtMoney(calc.deposit)}
                  />
                  <Row label="Visa Fee (Student)" value={fmtMoney(calc.visaFee)} />
                  <Row label="OSHC" sub={`${calc.visaMonths} mo`} value={fmtMoney(calc.oshc)} />
                  <div className="border-t border-border pt-1.5 mt-1.5">
                    <Row label="Total Initial Payment" value={fmtMoney(calc.upfront)} bold />
                    <Row label="Remaining Tuition Balance" value={fmtMoney(calc.remainingTuition)} muted />
                    <Row label="Total Course Value" value={fmtMoney(calc.totalCourseValue)} muted />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className={`rounded-lg p-3 ${risk.bg}`}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-muted-foreground">Visa grant likelihood</span>
              <Badge variant="outline" className={`text-[10px] ${risk.text} border-current`}>{risk.label}</Badge>
            </div>
            <div className="flex items-baseline gap-2">
              <span className={`text-2xl font-bold ${risk.text}`}>{calc.adjusted.toFixed(1)}%</span>
              <span className="text-xs text-muted-foreground flex items-center gap-0.5">
                {calc.trend >= 0 ? <TrendingUp className="w-3 h-3 text-emerald-500" /> : <TrendingDown className="w-3 h-3 text-red-500" />}
                {calc.trend >= 0 ? "+" : ""}{calc.trend}% trend
              </span>
            </div>
            <p className="text-[10px] text-muted-foreground mt-1">
              Base {location} rate: {calc.baseRate}% (Mar 2026)
            </p>
          </div>

          <div className="mt-3 pt-3 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
            <span>Coverage</span>
            <span className={calc.coverage >= 100 ? "text-emerald-600 font-semibold" : "text-amber-600 font-semibold"}>
              {Math.min(999, Math.round(calc.coverage))}%
            </span>
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
  calc, fmtMoney, location, selected,
}: {
  calc: ElicosOnlyCalc;
  fmtMoney: (aud: number) => string;
  location: Location;
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
            <h4 className="font-bold text-foreground">{calc.weeks}-week English Course</h4>
          </div>
          {partPay && (
            <Badge variant="outline" className="text-[10px]">50% upfront</Badge>
          )}
        </div>

        <div className="grid grid-cols-3 gap-3 mt-4">
          <div>
            <p className="text-xs text-muted-foreground">Visa length</p>
            <p className="text-base font-bold text-foreground">~{calc.visaMonths} mo</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Initial Payment</p>
            <p className="text-base font-bold text-foreground">{fmtMoney(calc.upfront)}</p>
          </div>
          <div className={`rounded-lg p-2 ${risk.bg}`}>
            <p className="text-[10px] text-muted-foreground">Grant rate</p>
            <span className={`text-base font-bold ${risk.text}`}>{calc.adjusted.toFixed(1)}%</span>
            <p className="text-[10px] text-muted-foreground">{location} base {calc.baseRate}%</p>
          </div>
        </div>

        {partPay && (
          <p className="text-[11px] text-amber-700 bg-amber-500/10 border border-amber-500/30 rounded-md px-2 py-1.5 mt-3">
            Remaining tuition <strong>{fmtMoney(calc.remainingTuition)}</strong> payable later (not in initial budget).
          </p>
        )}

        <button
          onClick={() => setOpen((o) => !o)}
          className="mt-3 flex items-center justify-between w-full text-xs font-medium text-primary hover:text-primary/80"
        >
          <span>Initial Budget Details</span>
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
                  label={partPay ? "ELICOS Tuition (50% upfront)" : "ELICOS Tuition"}
                  sub={`${calc.weeks} wks @ $${calc.weeklyCost}`}
                  value={fmtMoney(calc.paidTuition)}
                />
                <Row label="Visa Fee" value={fmtMoney(calc.visaFee)} />
                <Row label="OSHC" sub={`${calc.visaMonths} mo`} value={fmtMoney(calc.oshc)} />
                <div className="border-t border-border pt-1.5 mt-1.5">
                  <Row label="Total Initial Payment" value={fmtMoney(calc.upfront)} bold />
                  {partPay && (
                    <>
                      <Row label="Remaining Tuition" value={fmtMoney(calc.remainingTuition)} muted />
                      <Row label="Total Course Value" value={fmtMoney(calc.tuition)} muted />
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
  calc24, calc40, selected, onSelect, fmtMoney, location, englishNumeric,
}: {
  calc24: ElicosOnlyCalc;
  calc40: ElicosOnlyCalc;
  selected: 24 | 40;
  onSelect: (w: 24 | 40) => void;
  fmtMoney: (aud: number) => string;
  location: Location;
  englishNumeric: number;
}) => {
  return (
    <div className="sm:col-span-2 space-y-4">
      <Card className="border-border/60">
        <CardContent className="p-5 space-y-3">
          <div className="flex items-start gap-3">
            <Languages className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-foreground">Stand-alone English Course</h4>
              <p className="text-xs text-muted-foreground mt-0.5">
                Pick a fixed duration. Your current IELTS isn’t required here — but having a recent test
                strengthens visa integrity (shows genuine intent and helps plan realistic outcomes).
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {([24, 40] as const).map((w) => (
              <button
                key={w}
                onClick={() => onSelect(w)}
                className={`px-3 py-2.5 rounded-lg border-2 text-left transition-all ${
                  selected === w ? "border-primary bg-primary/10" : "border-border hover:border-primary/40"
                }`}
              >
                <div className="text-sm font-semibold text-foreground">{w} weeks</div>
                <div className="text-[11px] text-muted-foreground">
                  {w === 24 ? "Pay full upfront · ~6 months study" : "50% upfront allowed · ~10 months study"}
                </div>
              </button>
            ))}
          </div>
          {englishNumeric > 0 && (
            <p className="text-[11px] text-emerald-600 flex items-start gap-1">
              <ShieldCheck className="w-3 h-3 mt-0.5 shrink-0" />
              IELTS {englishNumeric.toFixed(1)} on file — boosts visa integrity and helps project your
              expected exit level after {selected} weeks of study.
            </p>
          )}
        </CardContent>
      </Card>

      <div className="grid sm:grid-cols-2 gap-4">
        <ElicosCard calc={calc24} fmtMoney={fmtMoney} location={location} selected={selected === 24} />
        <ElicosCard calc={calc40} fmtMoney={fmtMoney} location={location} selected={selected === 40} />
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
  // Comparison vs Student visa for the same English weeks
  const studentVisaUpfront = shortWeeks * elicosWeekly + VISA_FEE_AUD + (700 * Math.max(1, Math.ceil(shortWeeks / 4) + 2)) / 12;
  const savingsVsStudent = Math.max(0, studentVisaUpfront - whm.upfrontLow);
  const whmEligible = age < THAI_WHM_MIN_AGE;

  return (
    <div className="sm:col-span-2 space-y-4">
      {/* Shared controls */}
      <Card className="border-border/60">
        <CardContent className="p-5 space-y-5">
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-foreground">Short experience & Skill booster</h4>
              <p className="text-xs text-muted-foreground mt-0.5">
                Not quite ready for a full degree? Build capital, skills and confidence first.
              </p>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <Label className="text-foreground text-sm">English / Skill course length</Label>
              <span className="text-sm font-semibold text-foreground">
                {shortWeeks} wks <span className="text-muted-foreground font-normal">/ max {WHM_MAX_STUDY_WEEKS}</span>
              </span>
            </div>
            <Slider
              value={[shortWeeks]}
              min={0}
              max={WHM_MAX_STUDY_WEEKS}
              step={1}
              onValueChange={([v]) => setShortWeeks(Math.min(WHM_MAX_STUDY_WEEKS, v))}
            />
            <p className="text-[11px] text-muted-foreground mt-1">
              WHM allows up to 17 weeks of study. Tuition uses your global ${elicosWeekly}/wk slider.
            </p>
          </div>

          <div>
            <Label className="text-foreground text-sm mb-2 block">Add a Fast-Track Skill Booster</Label>
            <div className="grid grid-cols-3 gap-2">
              {([
                { id: "none",      label: "English only", sub: "—" },
                { id: "childcare", label: "Childcare",    sub: `$${SKILL_BOOSTERS.childcare.low.toLocaleString()}–$${SKILL_BOOSTERS.childcare.high.toLocaleString()}` },
                { id: "agedCare",  label: "Aged Care",    sub: `$${SKILL_BOOSTERS.agedCare.low.toLocaleString()}–$${SKILL_BOOSTERS.agedCare.high.toLocaleString()}` },
              ] as { id: SkillBoosterKey; label: string; sub: string }[]).map((s) => (
                <button
                  key={s.id}
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

          {/* Suggested savings tooltips */}
          <TooltipProvider delayDuration={150}>
            <div className="flex flex-wrap gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge variant="outline" className="cursor-help gap-1 text-[10px]">
                    <Plane className="w-3 h-3" /> Suggested airfare
                  </Badge>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  Plan ฿{SUGGESTED_SAVINGS.airfareTHB.low.toLocaleString()}–฿{SUGGESTED_SAVINGS.airfareTHB.high.toLocaleString()} for a one-way ticket from Bangkok.
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge variant="outline" className="cursor-help gap-1 text-[10px]">
                    <Wallet className="w-3 h-3" /> Pocket money
                  </Badge>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  Carry ${SUGGESTED_SAVINGS.pocketAUD.low.toLocaleString()}–${SUGGESTED_SAVINGS.pocketAUD.high.toLocaleString()} AUD to settle in before your first paycheck.
                </TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>
        </CardContent>
      </Card>

      {/* Pathway comparison */}
      <div className="grid sm:grid-cols-2 gap-4">
        {whmEligible ? (
          <ShortCard
            icon={<Briefcase className="w-5 h-5 text-primary" />}
            title="Working Holiday (WHM)"
            tagline="Work, travel & learn — for budgets under ฿100,000"
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
                  <h4 className="font-bold text-foreground leading-tight">Working Holiday (WHM)</h4>
                  <p className="text-[11px] text-muted-foreground mt-0.5">Thailand–Australia WHM agreement</p>
                </div>
              </div>
              <div className="flex items-start gap-2 rounded-md bg-amber-500/10 border border-amber-500/30 p-2.5 mt-1">
                <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <p className="text-xs text-amber-700">
                  WHM (subclass 462) is not available to Thai nationals aged 31+. If you are currently 31 or older, you can consider other options like studying a master degree instead.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
        <ShortCard
          icon={<Plane className="w-5 h-5 text-primary" />}
          title="Study Tour (Tourist Visa)"
          tagline="Introductory experience — for budgets under ฿150,000"
          calc={tour}
          elicosWeekly={elicosWeekly}
          shortSkill="none"
          fmtMoney={fmtMoney}
          budgetAUD={budgetAUD}
          tourCta
        />
      </div>

      {/* Comparison row */}
      <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-transparent">
        <CardContent className="p-4">
          <p className="text-xs uppercase tracking-wide text-muted-foreground mb-2">Program Choice · Upfront comparison</p>
          <div className="grid sm:grid-cols-3 gap-3 text-sm">
            <div>
              <p className="text-muted-foreground text-xs">WHM (no OSHC, $670 visa)</p>
              <p className="font-bold text-foreground">{fmtMoney(whm.upfrontLow)}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Student visa equivalent ({shortWeeks}w + OSHC + $2,000 visa)</p>
              <p className="font-bold text-foreground">{fmtMoney(studentVisaUpfront)}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Estimated saving with WHM</p>
              <p className="font-bold text-emerald-600">{fmtMoney(savingsVsStudent)}</p>
            </div>
          </div>
        </CardContent>
      </Card>
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
  const visaLabel = calc.visaType === "whm" ? "Visa Fee (WHM)" : calc.visaType === "tourist" ? "Visa Fee (Tourist)" : "Visa Fee (Student)";
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
            <p className="text-xs text-muted-foreground">Initial Budget Coverage</p>
            <p className="text-2xl font-bold text-foreground">
              {fmtMoney(calc.upfrontLow)}
              {calc.upfrontHigh !== calc.upfrontLow && (
                <span className="text-base font-semibold text-muted-foreground"> – {fmtMoney(calc.upfrontHigh)}</span>
              )}
            </p>
          </div>

          <button
            onClick={() => setOpen((o) => !o)}
            className="w-full flex items-center justify-between text-xs font-medium text-primary hover:text-primary/80 mb-2"
          >
            <span>Initial Budget Details</span>
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
                    label="English Tuition"
                    sub={calc.englishWeeks > 0 ? `${calc.englishWeeks} wks @ $${elicosWeekly} (max ${WHM_MAX_STUDY_WEEKS} wks)` : "Optional"}
                    value={fmtMoney(calc.englishCost)}
                  />
                  {skillRange && (
                    <Row
                      label={shortSkill === "childcare" ? "Fast-Track Childcare" : "Fast-Track Aged Care"}
                      sub="Range — provider dependent"
                      value={skillRange}
                    />
                  )}
                  <Row label={visaLabel} value={fmtMoney(calc.visaFee)} />
                  <Row label="OSHC" sub="Not required for this visa" value={fmtMoney(0)} muted />
                  <div className="border-t border-border pt-1.5 mt-1.5">
                    <Row
                      label="Total Initial Payment"
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
            {covers ? "Budget covers upfront" : `Shortfall ${fmtMoney(Math.max(0, calc.upfrontLow - budgetAUD))}+`}
          </Badge>

          {tourCta && (
            <a
              href="https://line.me/R/ti/p/@beyondstudy"
              target="_blank"
              rel="noreferrer"
              className="mt-3 flex items-center justify-between rounded-lg border border-primary/30 bg-primary/5 px-3 py-2 text-xs text-primary hover:bg-primary/10"
            >
              <span>Want a custom-made Study Tour? Talk to a Beyond Study expert.</span>
              <ArrowRight className="w-3 h-3" />
            </a>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};