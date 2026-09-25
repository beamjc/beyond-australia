'use client'

import { GraduationCap, Plane } from "lucide-react";
import { savingsCopy as c } from "@/data/savingsCopy";
import type { SavingsVisaType } from "@/lib/savings";
import { Section, useT } from "./shared";

const VisaTypeSelector = ({ visaType, setVisaType }: { visaType: SavingsVisaType; setVisaType: (v: SavingsVisaType) => void }) => {
  const { t } = useT();
  const options = [
    { id: "whm" as const, icon: Plane, title: c.visaWhm, sub: c.visaWhmSub },
    { id: "student" as const, icon: GraduationCap, title: c.visaStudent, sub: c.visaStudentSub },
  ];
  return (
    <Section title={t(c.visaLabel)} helper={t(c.visaHelper)} titleId="sav-visa">
      <div role="radiogroup" aria-labelledby="sav-visa" className="grid grid-cols-2 gap-2">
        {options.map((o) => {
          const on = visaType === o.id;
          return (
            <button
              key={o.id}
              type="button"
              role="radio"
              aria-checked={on}
              onClick={() => setVisaType(o.id)}
              className={`min-h-[56px] rounded-xl border px-3 py-2.5 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                on ? "border-primary bg-primary/10" : "border-border bg-background hover:border-primary/40"
              }`}
            >
              <span className={`flex items-center gap-1.5 text-sm ${on ? "font-semibold text-foreground" : "font-medium text-foreground/80"}`}>
                <o.icon className="h-4 w-4 shrink-0" aria-hidden />
                {t(o.title)}
              </span>
              <span className="mt-0.5 block text-xs text-muted-foreground">{t(o.sub)}</span>
            </button>
          );
        })}
      </div>
      <p className="mt-3 text-xs text-muted-foreground leading-relaxed">{t(visaType === "whm" ? c.workWhm : c.workStudent)}</p>
    </Section>
  );
};

export default VisaTypeSelector;
