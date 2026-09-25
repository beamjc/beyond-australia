'use client'

import { ArrowDown } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageProvider";
import { pick, readinessCopy, type ReadinessFactor } from "@/data/visaReadiness";
import type { RankedFactor } from "@/lib/visaReadiness";

interface Props {
  ranked: RankedFactor<ReadinessFactor>[];
  onSeeAll: () => void;
}

/** The three most important non-low factors, in priority order. */
const AssessmentPriorityActions = ({ ranked, onSeeAll }: Props) => {
  const { language } = useLanguage();
  const t = (b: Parameters<typeof pick>[0]) => pick(b, language);
  const top = ranked.filter((r) => r.level !== "low").slice(0, 3);

  return (
    <section className="rounded-2xl border border-border bg-card p-5 sm:p-6">
      <h4 className="text-lg font-semibold text-foreground">{t(readinessCopy.priorityTitle)}</h4>
      {top.length === 0 ? (
        <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{t(readinessCopy.priorityEmpty)}</p>
      ) : (
        <ol className="mt-4 space-y-4">
          {top.map((r, i) => (
            <li key={r.factor.id} className="flex gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                {i + 1}
              </span>
              <div>
                <p className="text-sm font-semibold text-foreground">{t(r.factor.label)}</p>
                <p className="mt-0.5 text-sm text-muted-foreground leading-relaxed">{t(r.factor.priority)}</p>
              </div>
            </li>
          ))}
        </ol>
      )}
      <button
        type="button"
        onClick={onSeeAll}
        className="mt-4 inline-flex min-h-[44px] items-center gap-1.5 text-sm font-semibold text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
      >
        {t(readinessCopy.seeAll)}
        <ArrowDown className="w-4 h-4" />
      </button>
    </section>
  );
};

export default AssessmentPriorityActions;
