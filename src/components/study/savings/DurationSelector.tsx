'use client'

import { forwardRef } from "react";
import { fill, savingsCopy as c } from "@/data/savingsCopy";
import { Section, choiceClass, fmtA, useT } from "./shared";

interface Props { years: number; setYears: (n: number) => void; requiredAnnualSaving: number }

const DurationSelector = forwardRef<HTMLDivElement, Props>(({ years, setYears, requiredAnnualSaving }, ref) => {
  const { t } = useT();
  return (
    <Section title={t(c.durationLabel)} titleId="sav-duration">
      <div ref={ref} role="group" aria-labelledby="sav-duration" className="grid grid-cols-3 gap-2">
        {[1, 2, 3].map((y) => (
          <button key={y} type="button" aria-pressed={years === y} onClick={() => setYears(y)} className={choiceClass(years === y)}>
            {fill(t(c.years), { n: y })}
          </button>
        ))}
      </div>
      <p className="mt-3 text-sm text-muted-foreground">
        {t(c.requiredLead)}{" "}
        <span className="font-semibold text-foreground tabular-nums">{fmtA(requiredAnnualSaving)}</span> {t(c.perYear)}
      </p>
    </Section>
  );
});
DurationSelector.displayName = "DurationSelector";

export default DurationSelector;
