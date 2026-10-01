'use client'

import Image from "next/image";
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
    <section data-band="proof" className="py-20">
      <div className="container">
        <SectionHeader
          title={t("proof.title")}
          subtitle={t("proof.subtitle")}
        />

        {/* Same card treatment as ServicesSection: alternating light/dark
            brand fills, text left, artwork right. */}
        <div className="grid lg:grid-cols-3 gap-6">
          {highlights.map(({ key, icon }, index) => {
            const isDark = index % 2 === 1;
            return (
              <div
                key={key}
                className={
                  isDark
                    ? "relative flex min-h-48 items-center gap-4 overflow-hidden rounded-2xl border border-[#7096D1] bg-[#7096D1] p-6 transition-all hover:shadow-warm"
                    : "relative flex min-h-48 items-center gap-4 overflow-hidden rounded-2xl border border-[#7096D1]/40 bg-[#D0E3FF] p-6 transition-all hover:border-[#334eac]/60 hover:shadow-warm"
                }
              >
                <p
                  className={
                    isDark
                      ? "flex-1 text-sm sm:text-base font-medium leading-relaxed text-[#081F5C]"
                      : "flex-1 text-sm sm:text-base font-medium leading-relaxed text-[#334eac]"
                  }
                >
                  {t(`proof.highlights.${key}` as const)}
                </p>
                <Image
                  src={icon}
                  alt=""
                  aria-hidden="true"
                  width={112}
                  height={112}
                  className="h-24 w-24 shrink-0 object-contain sm:h-28 sm:w-28"
                />
              </div>
            );
          })}
        </div>

        <div className="max-w-4xl mx-auto mt-14">
          <ReviewsCarousel />
        </div>
      </div>
    </section>
  );
};

export default ProofStatsSection;
