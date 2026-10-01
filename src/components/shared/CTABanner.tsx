'use client'

import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageProvider";

const SITE_URL = "https://www.beyondstudycenter.com/inquiry-form/";

const CTABanner = () => {
  const { t } = useLanguage();

  return (
    <section className="py-12 sm:py-16 bg-secondary text-secondary-foreground">
      <div className="container flex flex-col items-center gap-8 text-center lg:flex-row lg:text-left">
        <Image
          src="/icons/planning_with_beyond.png"
          alt=""
          aria-hidden="true"
          width={1536}
          height={1024}
          sizes="(max-width: 1024px) 80vw, 360px"
          className="w-full max-w-xs shrink-0 lg:w-[360px] lg:max-w-none"
        />
        <h2 className="flex-1 text-3xl md:text-4xl font-bold">{t("ctaBanner.title")}</h2>
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
