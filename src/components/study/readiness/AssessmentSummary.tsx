'use client'

import { forwardRef } from "react";
import { useLanguage } from "@/i18n/LanguageProvider";
import {
  levelMetricLabels, pick, readinessCopy, verdicts,
  type ReadinessFactor, type ReadinessLevel,
} from "@/data/visaReadiness";
import { verdictBand, type RankedFactor } from "@/lib/visaReadiness";
import { levelDot } from "./levelStyles";

interface Props {
  riskScore: number;
  readiness: number;
  ranked: RankedFactor<ReadinessFactor>[];
}

const LEVELS: ReadinessLevel[] = ["high", "medium", "low"];

const AssessmentSummary = forwardRef<HTMLHeadingElement, Props>(({ riskScore, readiness, ranked }, headingRef) => {
  const { language } = useLanguage();
  const t = (b: Parameters<typeof pick>[0]) => pick(b, language);
  const band = verdictBand(riskScore);
  const verdict = verdicts[band];

  const counts = Object.fromEntries(LEVELS.map((l) => [l, ranked.filter((r) => r.level === l).length])) as Record<ReadinessLevel, number>;

  // Name the top concerns (high first, otherwise medium), at most two.
  const focusLevel: ReadinessLevel | null = counts.high ? "high" : counts.medium ? "medium" : null;
  const focus = band === "strong" || !focusLevel
    ? []
    : ranked.filter((r) => r.level === focusLevel).slice(0, 2).map((r) => {
        const label = t(r.factor.label);
        return language === "en" ? label.toLowerCase() : label;
      });
  const desc =
    t(verdict.desc) +
    (focus.length ? t(readinessCopy.especially) + focus.join(t(readinessCopy.and)) : "") +
    (language === "en" ? "." : "");

  return (
    <section className="rounded-2xl border border-border bg-card p-5 sm:p-6">
      <div className="flex items-baseline justify-between gap-4">
        <p className="text-sm text-muted-foreground">{t(readinessCopy.scoreLabel)}</p>
        <p className="text-foreground tabular-nums">
          <span className="text-3xl font-bold">{readiness}</span>
          <span className="text-base text-muted-foreground"> / 100</span>
        </p>
      </div>
      <div
        className="mt-3 h-1.5 w-full rounded-full bg-muted overflow-hidden"
        role="img"
        aria-label={`${t(readinessCopy.scoreLabel)} ${readiness} / 100`}
      >
        <div className="h-full rounded-full bg-primary transition-[width] duration-500 motion-reduce:transition-none" style={{ width: `${readiness}%` }} />
      </div>
      <p className="text-xs text-muted-foreground mt-2">{t(readinessCopy.scoreNote)}</p>

      <h4 ref={headingRef} tabIndex={-1} className="mt-5 text-xl font-semibold text-foreground focus:outline-none">
        {t(verdict.title)}
      </h4>
      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{desc}</p>

      <ul className="mt-5 grid gap-2 sm:grid-cols-3">
        {LEVELS.map((l) => (
          <li key={l} className="flex items-center gap-3 rounded-xl border border-border bg-background px-3 py-2.5">
            <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${levelDot[l]}`} aria-hidden />
            <span className="text-lg font-semibold text-foreground tabular-nums">{counts[l]}</span>
            <span className="text-xs text-muted-foreground leading-snug">{t(levelMetricLabels[l])}</span>
          </li>
        ))}
      </ul>
    </section>
  );
});
AssessmentSummary.displayName = "AssessmentSummary";

export default AssessmentSummary;
