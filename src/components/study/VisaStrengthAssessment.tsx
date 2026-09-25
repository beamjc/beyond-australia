'use client'

import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, Info, Pencil } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageProvider";
import { pick, readinessCopy, readinessFactors, type ReadinessLevel } from "@/data/visaReadiness";
import { computeRiskScore, rankFactors, readinessScore, type SliderValues } from "@/lib/visaReadiness";
import { SITE_URL } from "../shared/BSCConsultationCTA";
import AssessmentQuestions from "./readiness/AssessmentQuestions";
import AssessmentSummary from "./readiness/AssessmentSummary";
import AssessmentPriorityActions from "./readiness/AssessmentPriorityActions";
import AssessmentGroup from "./readiness/AssessmentGroup";
import AssessmentActionPlan from "./readiness/AssessmentActionPlan";

const GROUPS: ReadinessLevel[] = ["high", "medium", "low"];

const scrollBehavior = (): ScrollBehavior =>
  typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";

/** Visa Readiness Check: answer 8 self-assessment sliders, then read a prioritised result. */
const VisaStrengthAssessment = () => {
  const { language } = useLanguage();
  const t = (b: Parameters<typeof pick>[0]) => pick(b, language);

  const [values, setValues] = useState<SliderValues>(() =>
    Object.fromEntries(readinessFactors.map((f) => [f.id, 50])),
  );
  const [step, setStep] = useState<"questions" | "result">("questions");
  const topRef = useRef<HTMLDivElement>(null);
  const resultHeadingRef = useRef<HTMLHeadingElement>(null);
  const detailsRef = useRef<HTMLDivElement>(null);
  const firstRender = useRef(true);

  const riskScore = computeRiskScore(readinessFactors, values);
  const ranked = useMemo(() => rankFactors(readinessFactors, values), [values]);

  // Bring the new step into view (and move focus to the result) after switching.
  useEffect(() => {
    if (firstRender.current) { firstRender.current = false; return; }
    topRef.current?.scrollIntoView({ behavior: scrollBehavior(), block: "start" });
    if (step === "result") resultHeadingRef.current?.focus({ preventScroll: true });
  }, [step]);

  return (
    <div ref={topRef} className="max-w-2xl mx-auto scroll-mt-24 space-y-4">
      <header className="text-center mb-6">
        <h3 className="text-2xl md:text-3xl font-bold text-foreground">{t(readinessCopy.title)}</h3>
        <p className="text-muted-foreground text-sm md:text-base mt-2">{t(readinessCopy.subtitle)}</p>
      </header>

      <a
        href={SITE_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="flex min-h-[44px] items-center justify-between gap-4 rounded-2xl border border-border bg-card px-4 py-3 sm:px-5 transition-colors hover:bg-muted/40"
      >
        <span>
          <span className="block text-sm font-semibold text-foreground">{t(readinessCopy.bannerTitle)}</span>
          <span className="block text-xs text-muted-foreground">Beyond Study Center</span>
        </span>
        <span className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-primary">
          {t(readinessCopy.bannerCta)}
          <ArrowRight className="w-4 h-4" />
        </span>
      </a>

      <p className="flex items-start gap-2 px-1 text-xs text-muted-foreground leading-relaxed">
        <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
        {t(readinessCopy.disclaimer)}
      </p>

      {step === "questions" ? (
        <AssessmentQuestions
          values={values}
          onChange={(id, v) => setValues((prev) => ({ ...prev, [id]: v }))}
          onSubmit={() => setStep("result")}
        />
      ) : (
        <>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setStep("questions")}
              className="inline-flex min-h-[44px] items-center gap-1.5 rounded-xl px-3 text-sm font-semibold text-primary hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Pencil className="w-4 h-4" />
              {t(readinessCopy.editAnswers)}
            </button>
          </div>

          <AssessmentSummary ref={resultHeadingRef} riskScore={riskScore} readiness={readinessScore(riskScore)} ranked={ranked} />

          <AssessmentPriorityActions
            ranked={ranked}
            onSeeAll={() => detailsRef.current?.scrollIntoView({ behavior: scrollBehavior(), block: "start" })}
          />

          <div ref={detailsRef} className="scroll-mt-24 space-y-3 pt-2">
            <h4 className="px-1 text-lg font-semibold text-foreground">{t(readinessCopy.detailsTitle)}</h4>
            {GROUPS.map((level) => {
              const items = ranked.filter((r) => r.level === level);
              if (!items.length) return null;
              return <AssessmentGroup key={level} level={level} items={items} defaultOpen={level === "high"} />;
            })}
          </div>

          <AssessmentActionPlan ranked={ranked} />
        </>
      )}
    </div>
  );
};

export default VisaStrengthAssessment;
