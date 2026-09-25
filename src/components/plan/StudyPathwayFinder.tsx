'use client'

import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Info, RotateCcw } from "lucide-react";
import {
  budgetOptions, cityOptions, englishOptions, finderCopy as c, goalOptions, interestOptions,
  nextStepCopy, pathwayInfo, qualificationOptions, timingOptions, type GoalId, type NextStepId, type PathwayId,
} from "@/data/studyFinder";
import { fill } from "@/data/savingsCopy";
import type { Bi } from "@/data/visaReadiness";
import type { ToolId } from "@/data/visaExplorer";
import {
  emptyStudyAnswers, isValidAge, isValidExperience, recommendStudyPathway,
  type StudyAnswers, type StudyRecommendation,
} from "@/lib/studyFinder";
import {
  AUTO_ADVANCE_MS, Card, CheckList, ConsultBlock, PathwayOption, RelatedTools, Sequence, ToolHeader,
  btnPrimary, btnSecondary, useKeepTopInView, usePlanNav, useT,
} from "./shared";

type SingleKey = "english" | "city" | "budget" | "interest" | "timing";
const STEPS = ["age", "english", "goals", "city", "budget", "interest", "background", "timing"] as const;

const inputCls =
  "w-full min-h-[48px] rounded-xl border border-border bg-background px-4 text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary";

const StudyPathwayFinder = ({ onHub }: { onHub: () => void }) => {
  const { t } = useT();
  const [step, setStep] = useState(0);
  const [a, setA] = useState<StudyAnswers>(emptyStudyAnswers);
  const [done, setDone] = useState(false);
  const [pending, setPending] = useState(false);
  const [touched, setTouched] = useState({ age: false, exp: false });
  const timer = useRef<ReturnType<typeof setTimeout>>();
  const topRef = useKeepTopInView(`${step}-${done}`);
  useEffect(() => () => clearTimeout(timer.current), []);

  const key = STEPS[step];
  const last = step === STEPS.length - 1;
  const canNext =
    key === "age" ? isValidAge(a.age)
    : key === "goals" ? a.goals.length > 0
    : key === "background" ? a.qualification !== null && isValidExperience(a.experienceYears)
    : a[key] !== null;

  const next = () => (last ? setDone(true) : setStep((s) => s + 1));
  const back = () => setStep((s) => Math.max(0, s - 1));

  /** Single choice: highlight, then move on after a short pause (not on the last question). */
  const pick = <K extends SingleKey>(k: K, v: StudyAnswers[K]) => {
    setA((prev) => ({ ...prev, [k]: v }));
    if (last || pending) return;
    setPending(true);
    timer.current = setTimeout(() => { setPending(false); setStep((s) => s + 1); }, AUTO_ADVANCE_MS);
  };

  const toggleGoal = (g: GoalId) =>
    setA((prev) => {
      if (g === "unsure") return { ...prev, goals: prev.goals.includes("unsure") ? [] : ["unsure"] };
      const without = prev.goals.filter((x) => x !== "unsure" && x !== g);
      return { ...prev, goals: prev.goals.includes(g) ? without : [...without, g] };
    });

  if (done) {
    return (
      <div ref={topRef} className="scroll-mt-24">
        <ToolHeader title={t(c.title)} onHub={onHub} />
        <StudyResult answers={a} rec={recommendStudyPathway(a)} onRestart={() => { setA(emptyStudyAnswers); setStep(0); setDone(false); setTouched({ age: false, exp: false }); }} onEdit={() => setDone(false)} />
      </div>
    );
  }

  const titles: Record<(typeof STEPS)[number], Bi> = {
    age: c.qAge, english: c.qEnglish, goals: c.qGoals, city: c.qCity, budget: c.qBudget,
    interest: c.qInterest, background: c.qBackground, timing: c.qTiming,
  };
  const qid = `sf-q-${key}`;

  const singles = (k: SingleKey, opts: { id: string; label: Bi; desc?: Bi }[], cols: "one" | "sm2" | "two" = "sm2") => (
    <div role="radiogroup" aria-labelledby={qid} className={`grid gap-2 ${cols === "two" ? "grid-cols-2" : cols === "sm2" ? "sm:grid-cols-2" : ""}`}>
      {opts.map((o) => (
        <PathwayOption
          key={o.id}
          label={t(o.label)}
          desc={o.desc ? t(o.desc) : undefined}
          selected={a[k] === o.id}
          disabled={pending}
          onClick={() => pick(k, o.id as never)}
        />
      ))}
    </div>
  );

  return (
    <div ref={topRef} className="scroll-mt-24">
      <ToolHeader
        title={t(c.title)}
        onHub={onHub}
        progress={step / STEPS.length}
        progressLabel={fill(t(c.step), { n: step + 1, total: STEPS.length })}
      />
      {step === 0 && <p className="-mt-2 mb-4 text-sm text-muted-foreground">{t(c.subtitle)}</p>}

      <Card>
        <h4 id={qid} className="text-lg font-semibold text-foreground">{t(titles[key])}</h4>
        <div className="mt-4">
          {key === "age" && (
            <>
              <input
                type="number"
                inputMode="numeric"
                min={15}
                max={70}
                value={a.age}
                aria-labelledby={qid}
                aria-invalid={touched.age && !isValidAge(a.age)}
                aria-describedby="sf-age-err"
                placeholder={t(c.agePlaceholder)}
                onChange={(e) => setA({ ...a, age: e.target.value })}
                onBlur={() => setTouched((x) => ({ ...x, age: true }))}
                onKeyDown={(e) => { if (e.key === "Enter" && isValidAge(a.age)) next(); }}
                className={inputCls}
              />
              {touched.age && !isValidAge(a.age) && <p id="sf-age-err" className="mt-2 text-sm text-red-700 dark:text-red-400">{t(c.ageError)}</p>}
            </>
          )}
          {key === "english" && (
            <>
              {singles("english", englishOptions)}
              <p className="mt-3 text-xs text-muted-foreground">{t(c.englishHelper)}</p>
            </>
          )}
          {key === "goals" && (
            <>
              <p className="-mt-2 mb-3 text-sm text-muted-foreground">{t(c.goalsHelper)}</p>
              <div role="group" aria-labelledby={qid} className="grid gap-2">
                {goalOptions.map((g) => (
                  <PathwayOption key={g.id} multi label={t(g.label)} selected={a.goals.includes(g.id)} onClick={() => toggleGoal(g.id)} />
                ))}
              </div>
            </>
          )}
          {key === "city" && singles("city", cityOptions, "two")}
          {key === "budget" && singles("budget", budgetOptions)}
          {key === "interest" && singles("interest", interestOptions, "one")}
          {key === "background" && (
            <div className="space-y-5">
              <div>
                <p id="sf-qual" className="mb-2 text-sm font-medium text-foreground">{t(c.qualificationLabel)}</p>
                <div role="radiogroup" aria-labelledby="sf-qual" className="grid gap-2 sm:grid-cols-2">
                  {qualificationOptions.map((q) => (
                    <PathwayOption key={q.id} label={t(q.label)} selected={a.qualification === q.id} onClick={() => setA({ ...a, qualification: q.id })} />
                  ))}
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="sf-exp" className="mb-2 block text-sm font-medium text-foreground">{t(c.experienceLabel)} <span className="font-normal text-muted-foreground">{t(c.optional)}</span></label>
                  <input
                    id="sf-exp"
                    type="number"
                    inputMode="numeric"
                    min={0}
                    max={50}
                    value={a.experienceYears}
                    aria-invalid={touched.exp && !isValidExperience(a.experienceYears)}
                    aria-describedby="sf-exp-err"
                    placeholder="0"
                    onChange={(e) => setA({ ...a, experienceYears: e.target.value })}
                    onBlur={() => setTouched((x) => ({ ...x, exp: true }))}
                    className={inputCls}
                  />
                  {touched.exp && !isValidExperience(a.experienceYears) && <p id="sf-exp-err" className="mt-2 text-sm text-red-700 dark:text-red-400">{t(c.experienceError)}</p>}
                </div>
                <div>
                  <label htmlFor="sf-field" className="mb-2 block text-sm font-medium text-foreground">{t(c.fieldLabel)} <span className="font-normal text-muted-foreground">{t(c.optional)}</span></label>
                  <input id="sf-field" type="text" value={a.field} placeholder={t(c.fieldPlaceholder)} onChange={(e) => setA({ ...a, field: e.target.value })} className={inputCls} />
                </div>
              </div>
            </div>
          )}
          {key === "timing" && singles("timing", timingOptions)}
        </div>

        <div className="mt-6 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={back}
            disabled={step === 0}
            className="inline-flex min-h-[44px] items-center gap-1.5 rounded-lg px-2 text-sm font-medium text-muted-foreground hover:text-foreground disabled:opacity-30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden /> {t(c.back)}
          </button>
          <button type="button" onClick={next} disabled={!canNext || pending} className={`${btnPrimary} disabled:opacity-50`}>
            {t(last ? c.seeResults : c.next)} <ArrowRight className="h-4 w-4" aria-hidden />
          </button>
        </div>
      </Card>
    </div>
  );
};

const lc = (s: string) => s.charAt(0).toLowerCase() + s.slice(1);

const PathwayBlock = ({ p, rec, lead }: { p: PathwayId; rec: StudyRecommendation; lead?: boolean }) => {
  const { t, language } = useT();
  const info = pathwayInfo[p];
  const reasons = rec.reasons[p];
  const r = reasons.slice(0, 2).map(t);
  const sentence = !r.length
    ? t(info.desc)
    : language === "th"
      ? `${t(c.fromAnswers)} ${r.join(t(c.and))} ${t(info.closing)}`
      : `${t(c.fromAnswers)} ${r.map(lc).join(t(c.and))}, ${t(info.closing)}`;
  return (
    <div>
      <h5 className={`${lead ? "text-xl" : "text-lg"} font-bold text-foreground`}>{t(info.name)}</h5>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{sentence}</p>
      {reasons.length > 0 && (
        <div className="mt-4">
          <p className="text-sm font-semibold text-foreground">{t(c.whyTitle)}</p>
          <div className="mt-2"><CheckList items={reasons.map(t)} /></div>
        </div>
      )}
    </div>
  );
};

const StudyResult = ({ answers, rec, onRestart, onEdit }: { answers: StudyAnswers; rec: StudyRecommendation; onRestart: () => void; onEdit: () => void }) => {
  const { t } = useT();
  const nav = usePlanNav();
  const stepAction: Partial<Record<NextStepId, () => void>> = {
    compareBudget: () => nav.openTab("courses"),
    visaInfo: () => nav.openTool("visa", "student"),
  };
  const shown = [rec.primary, ...(rec.tieWith ? [rec.tieWith] : [])];
  const city = answers.city && answers.city !== "any" ? answers.city : null;
  const related: ToolId[] = ["savings", "calculator", shown.includes("he") ? "universities" : "strength"];

  return (
    <div className="space-y-4">
      <h4 className="text-lg font-semibold text-foreground">{t(c.resultTitle)}</h4>

      <Card>
        <p className="text-xs font-semibold uppercase tracking-wide text-primary">{t(rec.tieWith ? c.tie : c.recommended)}</p>
        <div className={`mt-2 ${rec.tieWith ? "grid gap-6 sm:grid-cols-2" : ""}`}>
          {shown.map((p) => <PathwayBlock key={p} p={p} rec={rec} lead={!rec.tieWith} />)}
        </div>

        {rec.budgetConstrained.length > 0 && (
          <div className="mt-5 rounded-xl bg-amber-500/10 p-4">
            <p className="flex items-start gap-2 text-sm font-medium text-amber-900 dark:text-amber-200">
              <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden /> {t(c.budgetConstraint)}
            </p>
            <p className="mt-2 text-xs font-medium text-amber-900/80 dark:text-amber-200/80">{t(c.budgetIdeas)}</p>
            <ul className="mt-1 list-disc pl-5 text-sm text-amber-900/90 dark:text-amber-200/90">
              <li>{t(c.budgetCompare)}</li>
              {!shown.includes("vet") && <li>{t(c.budgetVet)}</li>}
              <li>{t(c.budgetTalk)}</li>
            </ul>
          </div>
        )}

        {rec.showDowngradeNote && <p className="mt-4 rounded-xl bg-muted/50 p-3 text-sm text-foreground/80">{t(c.downgradeNote)}</p>}

        {rec.sequence && (
          <div className="mt-5">
            <p className="text-sm font-semibold text-foreground">{t(c.sequenceTitle)}</p>
            <div className="mt-2"><Sequence steps={rec.sequence.map((p) => t(pathwayInfo[p].short))} /></div>
          </div>
        )}
      </Card>

      {rec.alternative && (
        <Card>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t(c.alternativeTitle)}</p>
          <h5 className="mt-1 text-lg font-bold text-foreground">{t(pathwayInfo[rec.alternative].name)}</h5>
          <p className="mt-1 text-sm text-muted-foreground">{t(pathwayInfo[rec.alternative].desc)}</p>
        </Card>
      )}

      <Card>
        <p className="text-sm font-semibold text-foreground">{t(c.nextTitle)}</p>
        <ol className="mt-3 space-y-2">
          {rec.nextSteps.map((s, i) => (
            <li key={s} className="flex items-start gap-2.5 text-sm">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">{i + 1}</span>
              {stepAction[s] ? (
                <button type="button" onClick={stepAction[s]} className="min-h-[24px] pt-0.5 text-left font-medium text-primary underline-offset-2 hover:underline">
                  {t(nextStepCopy[s])}
                </button>
              ) : (
                <span className="pt-0.5 text-foreground/90">{t(nextStepCopy[s])}</span>
              )}
            </li>
          ))}
        </ol>
        {city && <p className="mt-4 text-xs text-muted-foreground">{fill(t(c.cityNote), { city })}</p>}
        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          <button type="button" onClick={() => nav.openTab("courses")} className={btnPrimary}>
            {t(c.primaryCta)} <ArrowRight className="h-4 w-4" aria-hidden />
          </button>
        </div>
      </Card>

      <Card className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-semibold text-foreground">{t(c.visaBridgeTitle)}</p>
        <button type="button" onClick={() => nav.openTool("visa", "student")} className={btnSecondary}>
          {t(c.visaBridgeCta)} <ArrowRight className="h-4 w-4" aria-hidden />
        </button>
      </Card>

      <RelatedTools tools={related} />
      <ConsultBlock kind="study" title={c.consultTitle} sub={c.consultSub} siteLabel={c.consultSite} />

      <div className="space-y-1 px-1 text-xs leading-relaxed text-muted-foreground">
        <p>{t(c.disclaimer)}</p>
        {rec.showMigrationNote && <p>{t(c.migrationNote)}</p>}
      </div>

      <div className="flex items-center justify-between gap-3">
        <button type="button" onClick={onEdit} className="inline-flex min-h-[44px] items-center gap-1.5 rounded-lg px-2 text-sm font-medium text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" aria-hidden /> {t(c.back)}
        </button>
        <button type="button" onClick={onRestart} className="inline-flex min-h-[44px] items-center gap-1.5 rounded-lg px-2 text-sm font-medium text-primary hover:underline">
          <RotateCcw className="h-4 w-4" aria-hidden /> {t(c.startOver)}
        </button>
      </div>
    </div>
  );
};

export default StudyPathwayFinder;
