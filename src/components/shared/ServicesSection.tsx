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
                  ? "group relative h-[380px] overflow-hidden rounded-2xl border border-[#334eac] bg-[#334eac] transition-all hover:shadow-navy"
                  : "group relative h-[380px] overflow-hidden rounded-2xl border border-[#7096D1]/40 bg-[#D0E3FF] transition-all hover:border-[#334eac]/60 hover:shadow-warm"
              }
            >
              <Image
                src={service.image}
                alt=""
                aria-hidden="true"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
              />
              <div
                className={
                  isDark
                    ? "pointer-events-none absolute inset-0 bg-gradient-to-t from-[#334eac] via-[#334eac]/85 to-transparent"
                    : "pointer-events-none absolute inset-0 bg-gradient-to-t from-[#D0E3FF] via-[#D0E3FF]/85 to-transparent"
                }
              />
              <div className="absolute inset-x-0 bottom-0 p-6">
                <h3 className={isDark ? "text-lg font-bold text-white mb-2" : "text-lg font-bold text-[#081F5C] mb-2"}>
                  {title}
                </h3>
                <p
                  className={
                    isDark
                      ? "text-sm text-[#D0E3FF] leading-relaxed"
                      : "text-sm text-[#334eac]/80 leading-relaxed"
                  }
                >
                  {description}
                </p>
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
