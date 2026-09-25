'use client'

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageProvider";
import { levelLabels, pick, readinessCopy, type ReadinessFactor, type ReadinessLevel } from "@/data/visaReadiness";
import type { RankedFactor } from "@/lib/visaReadiness";
import AssessmentFactorRow from "./AssessmentFactorRow";
import { levelDot } from "./levelStyles";

interface Props {
  level: ReadinessLevel;
  items: RankedFactor<ReadinessFactor>[];
  defaultOpen?: boolean;
}

const AssessmentGroup = ({ level, items, defaultOpen = false }: Props) => {
  const { language } = useLanguage();
  const t = (b: Parameters<typeof pick>[0]) => pick(b, language);
  const [open, setOpen] = useState(defaultOpen);
  const listId = `vra-group-${level}`;

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={listId}
        className="flex w-full min-h-[52px] items-center gap-3 px-4 py-3 text-left hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
      >
        <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${levelDot[level]}`} aria-hidden />
        <span className="flex-1 text-sm font-semibold text-foreground">{t(levelLabels[level])}</span>
        <span className="text-sm text-muted-foreground tabular-nums">
          {t(readinessCopy.itemsCount).replace("{n}", String(items.length))}
        </span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform motion-reduce:transition-none ${open ? "rotate-180" : ""}`}
          aria-hidden
        />
      </button>
      {open && (
        <ul id={listId} className="divide-y divide-border border-t border-border">
          {items.map((r) => (
            <AssessmentFactorRow key={r.factor.id} factor={r.factor} level={r.level} />
          ))}
        </ul>
      )}
    </div>
  );
};

export default AssessmentGroup;
