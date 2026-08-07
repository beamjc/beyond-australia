'use client'

import { useLanguage } from "@/i18n/LanguageProvider";
import SectionHeader from "./SectionHeader";

const stats = ["rating", "experience", "license", "quota"] as const;

const ProofStatsSection = () => {
  const { t } = useLanguage();

  return (
    <section className="py-20 bg-card">
      <div className="container">
        <SectionHeader
          eyebrow={t("proof.eyebrow")}
          title={t("proof.title")}
          subtitle={t("proof.subtitle")}
        />

        <div className="max-w-4xl mx-auto rounded-2xl bg-background border border-border shadow-warm p-8 sm:p-10 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div key={stat} className="text-center">
              <div className="text-xl sm:text-2xl font-bold text-primary mb-1 break-words">
                {t(`proof.stats.${stat}.value` as const)}
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground">
                {t(`proof.stats.${stat}.label` as const)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProofStatsSection;
