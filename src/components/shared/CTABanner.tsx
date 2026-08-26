'use client'

import { ArrowRight, CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageProvider";

const SITE_URL = "https://www.beyondstudycenter.com/inquiry-form/";

const CTABanner = () => {
  const { t } = useLanguage();

  return (
    <section className="py-16 sm:py-20 bg-secondary text-secondary-foreground">
      <div className="container flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
        <div className="max-w-xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t("ctaBanner.title")}</h2>
          <p className="text-secondary-foreground/70 leading-relaxed">{t("ctaBanner.subtitle")}</p>
          <div className="flex flex-wrap gap-x-6 gap-y-2 mt-6 text-sm text-secondary-foreground/80">
            <span className="inline-flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-accent shrink-0" />
              {t("ctaBanner.trust1")}
            </span>
            <span className="inline-flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-accent shrink-0" />
              {t("ctaBanner.trust2")}
            </span>
          </div>
        </div>
        <a
          href={SITE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 rounded-full gradient-gold px-8 py-4 text-base font-semibold text-accent-foreground shadow-warm transition-transform hover:scale-105 shrink-0"
        >
          {t("ctaBanner.cta")}
          <ArrowRight className="w-5 h-5" />
        </a>
      </div>
    </section>
  );
};

export default CTABanner;
