'use client'

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageProvider";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import type { TranslationKey } from "@/i18n/translations";

const heroBg = '/hero-bg.jpg';

type HeroSlide = {
  image: string;
  titleLine1Key: TranslationKey;
  titleHighlightKey: TranslationKey;
  titleLine2Key: TranslationKey;
  subtitleKey: TranslationKey;
  ctaPrimaryKey: TranslationKey;
  ctaPrimaryHref: string;
  ctaSecondaryKey: TranslationKey;
  ctaSecondaryHref: string;
};

// Add more entries here to grow the hero into a multi-slide carousel.
const heroSlides: HeroSlide[] = [
  {
    image: heroBg,
    titleLine1Key: "hero.titleLine1",
    titleHighlightKey: "hero.titleHighlight",
    titleLine2Key: "hero.titleLine2",
    subtitleKey: "hero.subtitle",
    ctaPrimaryKey: "hero.ctaPrimary",
    ctaPrimaryHref: "#whm",
    ctaSecondaryKey: "hero.ctaSecondary",
    ctaSecondaryHref: "#visa-pathway",
  },
];

const HeroSection = () => {
  const { t } = useLanguage();
  const [api, setApi] = useState<CarouselApi>();
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const bgOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  useEffect(() => {
    if (!api || heroSlides.length < 2) return;

    const interval = setInterval(() => {
      api.canScrollNext() ? api.scrollNext() : api.scrollTo(0);
    }, 7000);

    return () => clearInterval(interval);
  }, [api]);

  return (
    <section ref={sectionRef} className="relative overflow-hidden">
      <Carousel setApi={setApi} opts={{ loop: true }} className="w-full">
        <CarouselContent className="ml-0">
          {heroSlides.map((slide, index) => (
            <CarouselItem key={slide.image + index} className="pl-0">
              <div className="relative min-h-[90vh] flex items-center">
                {/* Background */}
                <motion.div className="absolute inset-0" style={{ opacity: bgOpacity }}>
                  <img
                    src={slide.image}
                    alt="Journey from Thailand to Australia"
                    className="w-full h-full object-cover"
                    loading={index === 0 ? "eager" : "lazy"}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/20" />
                </motion.div>

                <div className="container relative z-10 py-20">
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    className="max-w-3xl mx-auto flex flex-col items-center text-center"
                  >
                    <h1 className="flex flex-col gap-1.5 md:gap-2 text-4xl md:text-6xl lg:text-7xl font-bold text-secondary-foreground mb-6">
                      <span className="leading-normal">{t(slide.titleLine1Key)}</span>
                      <span className="text-gradient-gold leading-normal">{t(slide.titleHighlightKey)}</span>
                      <span className="leading-normal">{t(slide.titleLine2Key)}</span>
                    </h1>

                    <p className="text-lg md:text-xl text-secondary-foreground/80 max-w-2xl mb-10 font-light leading-relaxed">
                      {t(slide.subtitleKey)}
                    </p>

                    <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                      <a
                        href={slide.ctaPrimaryHref}
                        className="group inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-base font-semibold text-accent-foreground transition-transform hover:scale-105 hover:opacity-90"
                      >
                        {t(slide.ctaPrimaryKey)}
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </a>
                      <a
                        href={slide.ctaSecondaryHref}
                        className="group inline-flex items-center gap-2 rounded-full border border-secondary-foreground/50 px-6 py-3 text-base font-semibold text-secondary-foreground transition-colors hover:border-gold-glow hover:text-gold-glow"
                      >
                        {t(slide.ctaSecondaryKey)}
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </a>
                    </div>
                  </motion.div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {heroSlides.length > 1 && (
          <>
            <CarouselPrevious className="left-4 md:left-8 border-white/40 bg-white/10 text-white hover:bg-white/20 hover:text-white" />
            <CarouselNext className="right-4 md:right-8 border-white/40 bg-white/10 text-white hover:bg-white/20 hover:text-white" />
          </>
        )}
      </Carousel>
    </section>
  );
};

export default HeroSection;
