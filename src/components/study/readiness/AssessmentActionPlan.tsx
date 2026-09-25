'use client'

import { ArrowRight, MessageCircle } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageProvider";
import { pick, readinessCopy, type ReadinessFactor } from "@/data/visaReadiness";
import type { RankedFactor } from "@/lib/visaReadiness";
import { LINE_URL, SITE_URL } from "../../shared/BSCConsultationCTA";

/** Final plan: every factor that needs attention, highest priority first, then the consultation CTA. */
const AssessmentActionPlan = ({ ranked }: { ranked: RankedFactor<ReadinessFactor>[] }) => {
  const { language } = useLanguage();
  const t = (b: Parameters<typeof pick>[0]) => pick(b, language);
  const steps = ranked.filter((r) => r.level !== "low");

  return (
    <section className="rounded-2xl border border-border bg-card p-5 sm:p-6">
      <h4 className="text-lg font-semibold text-foreground">{t(readinessCopy.planTitle)}</h4>
      {steps.length === 0 ? (
        <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{t(readinessCopy.priorityEmpty)}</p>
      ) : (
        <ol className="mt-4 space-y-4">
          {steps.map((r, i) => (
            <li key={r.factor.id} className="flex gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-border text-sm font-semibold text-foreground">
                {i + 1}
              </span>
              <div>
                <p className="text-sm font-semibold text-foreground">{t(r.factor.action.title)}</p>
                <p className="mt-0.5 text-sm text-muted-foreground leading-relaxed">{t(r.factor.action.desc)}</p>
              </div>
            </li>
          ))}
        </ol>
      )}

      <div className="mt-6 rounded-xl bg-primary/5 p-4 sm:p-5 dark:bg-primary/10">
        <p className="font-semibold text-foreground">{t(readinessCopy.ctaTitle)}</p>
        <p className="mt-1 text-sm text-muted-foreground">{t(readinessCopy.ctaSub)}</p>
        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          <a
            href={SITE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            {t(readinessCopy.ctaPrimary)}
            <ArrowRight className="w-4 h-4" />
          </a>
          <a
            href={LINE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl border border-border bg-background px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
          >
            <MessageCircle className="w-4 h-4 text-[#00B900]" />
            LINE: @beyondstudy
          </a>
        </div>
      </div>
    </section>
  );
};

export default AssessmentActionPlan;
