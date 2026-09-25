'use client'

import { ArrowRight } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { useLanguage } from "@/i18n/LanguageProvider";
import { pick, readinessCopy, readinessFactors } from "@/data/visaReadiness";
import type { SliderValues } from "@/lib/visaReadiness";

interface Props {
  values: SliderValues;
  onChange: (id: string, value: number) => void;
  onSubmit: () => void;
}

/** Input step: one compact row per factor. The sliders feed the unchanged scoring. */
const AssessmentQuestions = ({ values, onChange, onSubmit }: Props) => {
  const { language } = useLanguage();
  const t = (b: Parameters<typeof pick>[0]) => pick(b, language);

  return (
    <section className="rounded-2xl border border-border bg-card">
      <div className="p-5 sm:p-6 border-b border-border">
        <h4 className="text-lg font-semibold text-foreground">{t(readinessCopy.questionsTitle)}</h4>
        <p className="text-sm text-muted-foreground mt-1">{t(readinessCopy.questionsHint)}</p>
      </div>

      <ol className="divide-y divide-border">
        {readinessFactors.map((f, i) => {
          const labelId = `vra-q-${f.id}`;
          return (
            <li key={f.id} className="p-5 sm:px-6">
              <p id={labelId} className="text-sm font-semibold text-foreground mb-4">
                <span className="text-muted-foreground font-normal mr-1.5">{i + 1}.</span>
                {t(f.label)}
              </p>
              <Slider
                value={[values[f.id]]}
                onValueChange={([v]) => onChange(f.id, v)}
                max={100}
                step={1}
                aria-labelledby={labelId}
                className="py-2"
              />
              <div className="mt-2 flex justify-between gap-4 text-xs leading-snug">
                <div className="max-w-[48%]">
                  <p className="font-medium text-foreground">{t(f.input.left)}</p>
                  <p className="text-muted-foreground">{t(f.input.leftHint)}</p>
                </div>
                <div className="max-w-[48%] text-right">
                  <p className="font-medium text-foreground">{t(f.input.right)}</p>
                  <p className="text-muted-foreground">{t(f.input.rightHint)}</p>
                </div>
              </div>
            </li>
          );
        })}
      </ol>

      <div className="p-5 sm:p-6 border-t border-border">
        <button
          type="button"
          onClick={onSubmit}
          className="w-full min-h-[44px] inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          {t(readinessCopy.seeResult)}
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </section>
  );
};

export default AssessmentQuestions;
