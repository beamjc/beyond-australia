'use client'

import { Check } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageProvider";
import { pick, readinessCopy, type ReadinessFactor } from "@/data/visaReadiness";

const AssessmentFactorDetail = ({ factor, id }: { factor: ReadinessFactor; id: string }) => {
  const { language } = useLanguage();
  const t = (b: Parameters<typeof pick>[0]) => pick(b, language);

  return (
    <div id={id} className="px-4 pb-4 pl-10 sm:pl-11 space-y-4">
      <div>
        <p className="text-sm font-semibold text-foreground">{t(readinessCopy.whyTitle)}</p>
        <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{t(factor.why)}</p>
      </div>
      <div>
        <p className="text-sm font-semibold text-foreground">{t(readinessCopy.prepareTitle)}</p>
        <ul className="mt-2 space-y-1.5">
          {factor.prepare.map((p) => (
            <li key={p.en} className="flex items-start gap-2 text-sm text-muted-foreground">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
              {t(p)}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AssessmentFactorDetail;
