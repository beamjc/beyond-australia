'use client'

import { ArrowRight, Plane } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageProvider";

const steps = ["timeline", "checklist", "postcode", "faq2026"] as const;

const WHMJourneyTeaser = () => {
  const { t } = useLanguage();

  return (
    <section className="py-20 bg-card">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-sm font-semibold uppercase tracking-widest text-primary mb-2 block">
              {t("whmTeaser.eyebrow")}
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {t("whmTeaser.title")}
            </h2>
            <p className="text-muted-foreground mb-6 max-w-md leading-relaxed">
              {t("whmTeaser.subtitle")}
            </p>
            <a
              href="#whm"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 mb-10"
            >
              {t("whmTeaser.cta")}
              <ArrowRight className="w-4 h-4" />
            </a>
            <div className="grid sm:grid-cols-2 gap-5">
              {steps.map((step, i) => (
                <a
                  key={step}
                  href="#whm"
                  className="group block rounded-xl border border-border p-5 transition-all hover:border-primary/40 hover:shadow-warm"
                >
                  <span className="text-xs font-bold text-primary/60">0{i + 1}</span>
                  <h3 className="text-base font-semibold text-foreground mt-1">
                    {t(`whm.tabs.${step}` as const)}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    {t(`whmTeaser.steps.${step}.description` as const)}
                  </p>
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-primary mt-3 group-hover:underline">
                    {t("whmTeaser.viewDetails")}
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </a>
              ))}
            </div>
          </div>

          <div className="relative rounded-3xl bg-gradient-to-br from-primary/10 via-card to-muted/40 border border-border/60 p-10 flex flex-col items-center justify-center min-h-[380px]">
            <div className="w-24 h-24 rounded-full bg-primary/15 flex items-center justify-center mb-6">
              <Plane className="w-12 h-12 text-primary" />
            </div>
            <span className="text-sm font-semibold uppercase tracking-widest text-primary">
              {t("whmTeaser.panelLabel")}
            </span>

            <div className="absolute top-6 left-6 rounded-xl bg-background shadow-warm border border-border/60 px-4 py-3">
              <div className="text-lg font-bold text-foreground">462</div>
              <div className="text-[10px] text-muted-foreground uppercase tracking-wide">Visa Subclass</div>
            </div>
            <div className="absolute bottom-6 right-6 rounded-xl bg-background shadow-warm border border-border/60 px-4 py-3">
              <div className="text-lg font-bold text-foreground">2,000+</div>
              <div className="text-[10px] text-muted-foreground uppercase tracking-wide">Quota Spots</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WHMJourneyTeaser;
