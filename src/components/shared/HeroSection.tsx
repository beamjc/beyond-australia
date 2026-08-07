'use client'

import { motion } from "framer-motion";
import { ArrowRight, Globe } from "lucide-react";
const heroBg = '/hero-bg.jpg';
import { useLanguage } from "@/i18n/LanguageProvider";

const HeroSection = () => {
  const { t } = useLanguage();
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src={heroBg}
          alt="Journey from Thailand to Australia"
          className="w-full h-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 gradient-hero opacity-85" />
      </div>

      <div className="container relative z-10 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-3xl"
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/20 px-4 py-1.5 mb-6 border border-primary/30">
            <Globe className="w-4 h-4 text-gold-glow" />
            <span className="text-sm font-medium text-gold-glow">
              {t("hero.badge")}
            </span>
          </div>

          <h1 className="flex flex-col gap-1.5 md:gap-2 text-4xl md:text-6xl lg:text-7xl font-bold text-secondary-foreground mt-2 mb-6">
            <span className="leading-normal">{t("hero.titleLine1")}</span>
            <span className="text-gradient-gold leading-normal">{t("hero.titleHighlight")}</span>
            <span className="leading-normal">{t("hero.titleLine2")}</span>
          </h1>

          <p className="text-lg md:text-xl text-secondary-foreground/80 max-w-2xl mb-10 font-light leading-relaxed">
            {t("hero.subtitle")}
          </p>

          <div className="flex flex-col sm:flex-row gap-8 sm:gap-12">
            <a
              href="#whm"
              className="group inline-flex w-fit items-center gap-2 border-b border-secondary-foreground/50 pb-2 text-base font-semibold text-secondary-foreground underline-offset-8 transition-colors hover:border-gold-glow hover:text-gold-glow"
            >
              {t("hero.ctaPrimary")}
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </a>
            <a
              href="#visa-pathway"
              className="group inline-flex w-fit items-center gap-2 border-b border-secondary-foreground/50 pb-2 text-base font-semibold text-secondary-foreground underline-offset-8 transition-colors hover:border-gold-glow hover:text-gold-glow"
            >
              {t("hero.ctaSecondary")}
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
