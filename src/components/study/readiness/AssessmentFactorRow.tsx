'use client'

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageProvider";
import { levelLabels, pick, type ReadinessFactor, type ReadinessLevel } from "@/data/visaReadiness";
import AssessmentFactorDetail from "./AssessmentFactorDetail";
import { levelBadge, levelDot } from "./levelStyles";

const AssessmentFactorRow = ({ factor, level }: { factor: ReadinessFactor; level: ReadinessLevel }) => {
  const { language } = useLanguage();
  const t = (b: Parameters<typeof pick>[0]) => pick(b, language);
  const [open, setOpen] = useState(false);
  const detailId = `vra-detail-${factor.id}`;

  return (
    <li>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={detailId}
        className="flex w-full min-h-[44px] items-start gap-3 px-4 py-3.5 text-left hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
      >
        <span className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${levelDot[level]}`} aria-hidden />
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-semibold text-foreground">{t(factor.label)}</span>
          <span className="mt-0.5 block text-sm text-muted-foreground leading-snug">{t(factor.result[level])}</span>
          <span className={`mt-2 inline-block rounded-full border px-2 py-0.5 text-xs font-medium ${levelBadge[level]}`}>
            {t(levelLabels[level])}
          </span>
        </span>
        <ChevronDown
          className={`mt-1 h-4 w-4 shrink-0 text-muted-foreground transition-transform motion-reduce:transition-none ${open ? "rotate-180" : ""}`}
          aria-hidden
        />
      </button>
      {open && <AssessmentFactorDetail factor={factor} id={detailId} />}
    </li>
  );
};

export default AssessmentFactorRow;
