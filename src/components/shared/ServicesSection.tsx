'use client'

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useLanguage } from "@/i18n/LanguageProvider";
import SectionHeader from "./SectionHeader";

const serviceItems = [
  { image: "/icons/ielts.png", key: "ielts" as const },
  { image: "/icons/student.png", key: "student" as const },
  { image: "/icons/insurance.png", key: "insurance" as const },
  { image: "/icons/short-courses.png", key: "shortCourses" as const },
  { image: "/icons/migration.png", key: "migration" as const },
  { image: "/icons/community.png", key: "community" as const },
];

// Page names in a description that become links (owner request 2026-11-21).
const PAGE_LINKS: Record<string, string> = {
  ThaiWahClub: "https://www.facebook.com/Thaiwahclub",
  "Beyond Study Center": "https://www.facebook.com/BeyondStudyCenter",
};
const linkPages = (text: string) => {
  const parts = text.split(new RegExp(`(${Object.keys(PAGE_LINKS).join("|")})`));
  return parts.map((part, i) =>
    PAGE_LINKS[part] ? (
      <a key={i} href={PAGE_LINKS[part]} target="_blank" rel="noopener noreferrer" className="font-semibold text-[#081F5C] underline underline-offset-2 hover:no-underline">
        {part}
      </a>
    ) : (
      part
    ),
  );
};

const ServicesSection = () => {
  const { t } = useLanguage();
  // Mobile (< md): cards scroll sideways with snap, the next card peeking in,
  // plus position dots (owner request 2026-11-21). md+ keeps the grid.
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const onScroll = () => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.firstElementChild as HTMLElement | null;
    if (!card) return;
    const step = card.offsetWidth + 16; // gap-4
    setActive(Math.min(serviceItems.length - 1, Math.round(el.scrollLeft / step)));
  };
  const goTo = (i: number) => {
    const el = trackRef.current;
    const card = el?.children[i] as HTMLElement | undefined;
    if (!el || !card) return;
    const left = el.scrollLeft + card.getBoundingClientRect().left - el.getBoundingClientRect().left - 32; // px-8
    el.scrollTo({ left, behavior: "smooth" });
  };
  return (
    <section id="services" data-band="services" className="py-20">
      <div className="container">
        <SectionHeader
          eyebrow={t("services.eyebrow")}
          title={t("services.title")}
          subtitle={t("services.subtitle")}
          className="mb-16"
        />

        <div
          ref={trackRef}
          onScroll={onScroll}
          data-testid="services-track"
          className="-mx-8 flex snap-x snap-mandatory scroll-px-8 gap-4 overflow-x-auto px-8 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:mx-0 md:grid md:snap-none md:grid-cols-2 md:gap-6 md:overflow-visible md:px-0 md:pb-0 lg:grid-cols-3"
        >
          {serviceItems.map((service, index) => {
            const title = t(`services.items.${service.key}.title` as const);
            const description = t(`services.items.${service.key}.description` as const);
            const isDark = index % 2 === 1;
            return (
            <motion.div
              key={service.key}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: Math.min(index, 2) * 0.08 }}
              className={
                isDark
                  ? "group relative min-h-48 w-[85%] shrink-0 snap-start overflow-hidden rounded-2xl border border-[#7096D1] bg-[#7096D1] transition-all hover:shadow-warm md:w-auto"
                  : "group relative min-h-48 w-[85%] shrink-0 snap-start overflow-hidden rounded-2xl border border-[#7096D1]/40 bg-[#D0E3FF] transition-all hover:border-[#334eac]/60 hover:shadow-warm md:w-auto"
              }
            >
              <div className="absolute inset-y-0 right-0 w-2/5">
                <Image
                  src={service.image}
                  alt=""
                  aria-hidden="true"
                  fill
                  sizes="(max-width: 768px) 40vw, (max-width: 1024px) 20vw, 14vw"
                  className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div
                className={
                  isDark
                    ? "pointer-events-none absolute inset-0 bg-gradient-to-r from-[#7096D1] via-[#7096D1]/70 to-transparent"
                    : "pointer-events-none absolute inset-0 bg-gradient-to-r from-[#D0E3FF] via-[#D0E3FF]/70 to-transparent"
                }
              />
              <div className="relative z-10 flex min-h-48 w-3/5 flex-col justify-center p-6">
                <h3 className="text-lg font-bold text-[#081F5C] mb-2">
                  {title}
                </h3>
                <p
                  className={
                    isDark
                      ? "text-sm text-[#081F5C]/80 leading-relaxed"
                      : "text-sm text-[#334eac]/80 leading-relaxed"
                  }
                >
                  {service.key === "community" ? linkPages(description) : description}
                </p>
              </div>
            </motion.div>
            );
          })}
        </div>

        <div className="mt-5 flex justify-center gap-2 md:hidden">
          {serviceItems.map((service, i) => (
            <button
              key={service.key}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`${i + 1} / ${serviceItems.length}`}
              aria-current={i === active ? "true" : undefined}
              className="flex h-6 w-6 items-center justify-center"
            >
              <span className={`block h-2 rounded-full transition-all ${i === active ? "w-5 bg-[#081F5C]" : "w-2 bg-[#7096D1]/50"}`} />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
