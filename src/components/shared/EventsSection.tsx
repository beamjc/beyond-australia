'use client'

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Calendar, MapPin, Monitor, Users, ArrowRight } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageProvider";
import { supabase } from "@/lib/supabase";
import { Event } from "@/types/event";
import { format } from "date-fns";

const typeStyles = {
  online: { icon: Monitor, className: "bg-accent/10 text-accent" },
  offline: { icon: MapPin, className: "bg-primary/10 text-primary" },
  hybrid: { icon: Users, className: "bg-secondary text-secondary-foreground" },
};

const EventsSection = () => {
  const { t, language } = useLanguage();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("events")
      .select("*")
      .eq("is_published", true)
      .order("event_date", { ascending: true, nullsFirst: false })
      .limit(3)
      .then(({ data, error }) => {
        if (error) console.error("EventsSection fetch error:", error);
        setEvents(data ?? []);
        setLoading(false);
      });
  }, []);

  if (!loading && events.length === 0) return null;

  return (
    <section id="events" className="py-20 bg-background">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="flex items-end justify-between">
            <div className="text-center flex-1">
              <span className="text-sm font-semibold uppercase tracking-widest text-primary mb-2 block">
                {t("events.eyebrow")}
              </span>
              <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
                {t("events.title")}
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                {t("events.subtitle")}
              </p>
            </div>
            <Link
              href="/events"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline shrink-0 mb-1"
            >
              {language === "th" ? "ดูกิจกรรมทั้งหมด" : "Show All"}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>

        {loading ? (
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-2xl border border-border bg-card h-48 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {events.map((event, index) => {
              const typeInfo = typeStyles[event.event_type];
              const title = language === "th" ? event.title_th : event.title_en;
              const location = (language === "th" ? event.location_th : event.location_en) ?? "";
              const description = (language === "th" ? event.description_th : event.description_en) ?? "";
              const typeLabel = t(`events.typeLabels.${event.event_type}` as const);
              const date = event.is_ongoing
                ? (language === "th" ? "ต่อเนื่อง" : "Ongoing")
                : event.event_date
                  ? format(new Date(event.event_date), "MMM d, yyyy")
                  : "";
              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="rounded-2xl border border-border gradient-card p-6 hover:shadow-warm transition-shadow"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      {date}
                    </div>
                    <span className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${typeInfo.className}`}>
                      <typeInfo.icon className="w-3 h-3" />
                      {typeLabel}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-2">{title}</h3>
                  {description && <p className="text-sm text-muted-foreground leading-relaxed mb-3">{description}</p>}
                  {location && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="w-3 h-3" />
                      {location}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default EventsSection;
