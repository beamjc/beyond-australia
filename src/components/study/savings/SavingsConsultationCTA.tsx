'use client'

import { MessageCircle } from "lucide-react";
import { savingsCopy as c } from "@/data/savingsCopy";
import { LINE_URL } from "../../shared/BSCConsultationCTA";
import { useT } from "./shared";

const SavingsConsultationCTA = () => {
  const { t } = useT();
  return (
    <section className="rounded-2xl border border-border bg-primary/5 p-5 sm:p-6 dark:bg-primary/10">
      <h4 className="font-semibold text-foreground">{t(c.ctaTitle)}</h4>
      <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{t(c.ctaSub)}</p>
      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <a
          href={LINE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
        >
          <MessageCircle className="h-4 w-4" aria-hidden />
          {t(c.ctaPrimary)}
        </a>
        <a
          href="/#services"
          className="inline-flex min-h-[44px] items-center justify-center rounded-xl border border-border bg-background px-5 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
        >
          {t(c.ctaSecondary)}
        </a>
      </div>
    </section>
  );
};

export default SavingsConsultationCTA;
