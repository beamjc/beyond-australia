'use client'

import { motion } from "framer-motion";
import {
  Languages,
  Shield,
  GraduationCap,
  Coffee,
  Heart,
  Users,
} from "lucide-react";
import { useLanguage } from "@/i18n/LanguageProvider";
import SectionHeader from "./SectionHeader";

const serviceItems = [
  { icon: Languages, key: "ielts" as const },
  { icon: GraduationCap, key: "student" as const },
  { icon: Shield, key: "insurance" as const },
  { icon: Coffee, key: "shortCourses" as const },
  { icon: Heart, key: "migration" as const },
  { icon: Users, key: "community" as const },
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
            return (
            <motion.div
              key={service.key}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              className="group rounded-2xl border border-border/60 bg-background p-6 transition-all hover:border-primary/40 hover:shadow-warm"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-11 h-11 rounded-xl bg-primary flex items-center justify-center group-hover:bg-accent transition-colors">
                  <service.icon className="w-5 h-5 text-primary-foreground group-hover:text-accent-foreground transition-colors" />
                </div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/80 bg-muted/70 px-2.5 py-1 rounded-full">
                  {tag}
                </span>
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">{title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
            </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
