'use client'

import { useLanguage } from "@/i18n/LanguageProvider";
import SectionHeader from "./SectionHeader";
import ReviewsCarousel from "./ReviewsCarousel";

const highlights: { key: "experience" | "founder" | "offices"; icon: string }[] = [
  { key: "experience", icon: "/icons/experience.png" },
  { key: "founder", icon: "/icons/founder.png" },
  { key: "offices", icon: "/icons/offices.png" },
];

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

        <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-10 sm:gap-8">
          {highlights.map(({ key, icon }) => (
            <div key={key} className="text-left">
              <img src={icon} alt="" className="w-14 h-14 mb-4" aria-hidden />
              <p className="text-sm sm:text-base font-medium text-foreground leading-relaxed">
                {t(`proof.highlights.${key}` as const)}
              </p>
            </div>
          ))}
        </div>

        <div className="max-w-4xl mx-auto mt-14">
          <ReviewsCarousel />
        </div>
      </div>
    </section>
  );
};

export default ProofStatsSection;
