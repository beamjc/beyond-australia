'use client'

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

const ServicesSection = () => {
  const { t } = useLanguage();
  return (
    <section id="services" className="py-20 bg-background">
      <div className="container">
        <SectionHeader
          eyebrow={t("services.eyebrow")}
          title={t("services.title")}
          subtitle={t("services.subtitle")}
          className="mb-16"
        />

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {serviceItems.map((service, index) => {
            const title = t(`services.items.${service.key}.title` as const);
            const description = t(`services.items.${service.key}.description` as const);
            const tag = t(`services.items.${service.key}.tag` as const);
            const isDark = index % 2 === 1;
            return (
            <motion.div
              key={service.key}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              className={
                isDark
                  ? "group flex items-center gap-4 rounded-2xl border border-[#334eac] bg-[#334eac] p-6 transition-all hover:shadow-navy"
                  : "group flex items-center gap-4 rounded-2xl border border-[#7096D1]/40 bg-[#D0E3FF] p-6 transition-all hover:border-[#334eac]/60 hover:shadow-warm"
              }
            >
              <div className="flex-1 min-w-0">
                <h3 className={isDark ? "text-lg font-bold text-white mb-2" : "text-lg font-bold text-[#081F5C] mb-2"}>
                  {title}
                </h3>
                <p
                  className={
                    isDark
                      ? "text-sm text-[#D0E3FF] leading-relaxed mb-4"
                      : "text-sm text-[#334eac]/80 leading-relaxed mb-4"
                  }
                >
                  {description}
                </p>
                <span
                  className={
                    isDark
                      ? "inline-flex items-center rounded-full bg-[#bad6eb] px-4 py-2 text-sm font-semibold text-[#081F5C] transition-colors group-hover:bg-[#FFF9F0]"
                      : "inline-flex items-center rounded-full bg-[#FFF9F0] px-4 py-2 text-sm font-semibold text-[#081F5C] transition-colors group-hover:bg-[#334eac] group-hover:text-white"
                  }
                >
                  {tag}
                </span>
              </div>
              <div className="relative h-28 w-28 shrink-0 sm:h-32 sm:w-32">
                <Image
                  src={service.image}
                  alt=""
                  aria-hidden="true"
                  fill
                  sizes="128px"
                  className="object-contain transition-transform duration-300 group-hover:scale-105"
                />
              </div>
            </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
