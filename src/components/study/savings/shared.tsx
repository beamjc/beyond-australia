'use client'

import type { ReactNode } from "react";
import { useLanguage } from "@/i18n/LanguageProvider";
import type { Bi } from "@/data/visaReadiness";

/** Returns a translator for Bi strings in the current language. */
export const useT = () => {
  const { language } = useLanguage();
  return { language, t: (b: Bi) => b[language] };
};

const money = (symbol: string) => (n: number) =>
  `${n < 0 ? "−" : ""}${symbol}${Math.round(Math.abs(n)).toLocaleString("en-US")}`;
export const fmtA = money("A$");
export const fmtB = money("฿");

export const yearsText = (n: number, language: "en" | "th") =>
  language === "th" ? `${n} ปี` : `${n} year${n === 1 ? "" : "s"}`;

/** Neutral card for one input step. */
export const Section = ({
  title, helper, titleId, aside, children,
}: {
  title: string;
  helper?: string;
  titleId?: string;
  aside?: ReactNode;
  children: ReactNode;
}) => (
  <section className="rounded-2xl border border-border bg-card p-5 sm:p-6">
    <div className="flex items-start justify-between gap-3">
      <div>
        <h4 id={titleId} className="font-semibold text-foreground">{title}</h4>
        {helper && <p className="mt-1 text-sm text-muted-foreground">{helper}</p>}
      </div>
      {aside}
    </div>
    <div className="mt-4">{children}</div>
  </section>
);

/** Choice button used for presets and segmented controls. */
export const choiceClass = (selected: boolean) =>
  `min-h-[44px] rounded-xl border px-3 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
    selected
      ? "border-primary bg-primary/10 font-semibold text-foreground"
      : "border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground"
  }`;

export const inputClass =
  "w-full min-h-[44px] rounded-xl border border-border bg-background px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary";
