'use client'

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Calendar, Users, FileCheck, Award, AlertTriangle, Clock, CalendarIcon } from "lucide-react";
import { format, differenceInDays, parse } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarPicker } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import SectionHeader from "../shared/SectionHeader";

type TimelineStep = {
  date: string;
  title: string;
  description: string;
  icon: typeof Calendar;
  status: "complete" | "action" | "upcoming";
  alert?: string;
};

const timeline2025: TimelineStep[] = [
  {
    date: "25 Feb 2025",
    title: "DCY Announcement",
    description: "The Department of Children and Youth announces the full WHM schedule for the fiscal year.",
    icon: Calendar,
    status: "complete",
  },
  {
    date: "7–14 Mar 2025",
    title: "Username/Password Registration",
    description: "Secure your login credentials via the DCY website. Max 500/day for 8 days = 4,000 total spots. Think of it like a limited concert ticket!",
    icon: Users,
    status: "complete",
    alert: "Very competitive — be ready at the exact opening time.",
  },
  {
    date: "Before 27 Mar 2025",
    title: "Prepare Everything",
    description: "IELTS 4.5+ overall (or PTE equivalent), bank certificate, qualifications — all must be ready BEFORE quota day.",
    icon: FileCheck,
    status: "complete",
    alert: "No second chances — have all documents prepared in advance.",
  },
  {
    date: "27 Mar 2025",
    title: "Quota Selection Day",
    description: "Out of 4,000 registered, ~2,000 are selected + 300–500 substitutes. This is your one-off chance.",
    icon: Award,
    status: "complete",
  },
  {
    date: "After Selection",
    title: "Document Submission & DCY Approval",
    description: "Submit your prepared documents to the DCY. If approved, you receive the Government Support Letter needed for the visa.",
    icon: FileCheck,
    status: "complete",
  },
  {
    date: "Before 1 Jul 2025",
    title: "Visa Application",
    description: "Apply for the Working Holiday (subclass 462) visa before the new Australian financial year begins.",
    icon: Award,
    status: "complete",
  },
];

const timeline2026: TimelineStep[] = [
  {
    date: "9 Mar 2026",
    title: "DCY Announcement",
    description: "The Department of Children and Youth announces the full WHM schedule for the fiscal year.",
    icon: Calendar,
    status: "complete",
  },
  {
    date: "23–28 Mar 2026",
    title: "Username/Password Registration",
    description: "Secure your login credentials via the DCY website. Max 500/day for 6 days = 3,000 total spots. Think of it like a limited concert ticket!",
    icon: Users,
    status: "action",
    alert: "Very competitive — be ready at the exact opening time.",
  },
  {
    date: "Before 8 Apr 2026",
    title: "Prepare Everything",
    description: "IELTS 4.5+ overall (or PTE equivalent), bank certificate, qualifications — all must be ready BEFORE quota day. You must obtain everything by 7 April 2026 at the latest.",
    icon: FileCheck,
    status: "action",
    alert: "No second chances — have all documents prepared in advance.",
  },
  {
    date: "8 Apr 2026",
    title: "Quota Selection Day",
    description: "Out of 3,000 registered, 2,000 are selected + 500 substitutes. This is your one-off chance.",
    icon: Award,
    status: "upcoming",
  },
  {
    date: "After Selection",
    title: "Document Submission & DCY Approval",
    description: "Submit your prepared documents to the DCY. If approved, you receive the Government Support Letter needed for the visa.",
    icon: FileCheck,
    status: "upcoming",
  },
  {
    date: "1 Jul 2026 onwards",
    title: "Visa Application",
    description: "You can apply for the Working Holiday (subclass 462) visa right when the new Australian financial year begins and after you receive the Government Support Letter from the DCY.",
    icon: Award,
    status: "upcoming",
  },
];

const statusColors = {
  complete: "bg-accent text-accent-foreground",
  action: "bg-primary text-primary-foreground animate-pulse-soft",
  upcoming: "bg-muted text-muted-foreground",
};

const QUOTA_DEADLINE = new Date(2026, 3, 7); // 7 April 2026 (last day to have everything ready)

const TimelineSection = ({ embedded = false }: { embedded?: boolean }) => {
  const [selectedYear, setSelectedYear] = useState<2025 | 2026>(2026);
  const [prepDate, setPrepDate] = useState<Date | undefined>(undefined);

  const steps = selectedYear === 2025 ? timeline2025 : timeline2026;

  const daysRemaining = useMemo(() => {
    if (!prepDate) return null;
    const diff = differenceInDays(QUOTA_DEADLINE, prepDate);
    return diff;
  }, [prepDate]);

  const content = (
    <>
      <SectionHeader
        eyebrow={`FY ${selectedYear} Schedule`}
        title="WHM Timeline"
        subtitle="Follow each step carefully. Timelines change yearly — stay updated with us."
      />

      {/* Year toggle */}
      <div className="flex justify-center mb-8">
        <div className="inline-flex rounded-xl border border-border bg-muted/50 p-1 gap-1">
          {([2025, 2026] as const).map((year) => (
            <button
              key={year}
              onClick={() => setSelectedYear(year)}
              className={cn(
                "px-5 py-2 rounded-lg text-sm font-medium transition-all",
                selectedYear === year
                  ? "bg-background text-foreground shadow-warm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              FY {year}
            </button>
          ))}
        </div>
      </div>

      {/* Preparation countdown — only for 2026 */}
      {selectedYear === 2026 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-xl mx-auto mb-12 rounded-2xl border border-primary/20 bg-primary/5 p-6"
        >
          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-5 h-5 text-primary" />
            <h3 className="font-bold text-foreground">Preparation Countdown</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            When do you plan to start preparing? We'll tell you how many days you have until the deadline (7 April 2026).
          </p>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full sm:w-[240px] justify-start text-left font-normal",
                    !prepDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {prepDate ? format(prepDate, "PPP") : "Pick your start date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarPicker
                  mode="single"
                  selected={prepDate}
                  onSelect={setPrepDate}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                  disabled={(date) => date > new Date(2026, 3, 7) || date < new Date()}
                />
              </PopoverContent>
            </Popover>

            {daysRemaining !== null && (
              <div className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm",
                daysRemaining > 14
                  ? "bg-accent/20 text-accent-foreground"
                  : daysRemaining > 7
                    ? "bg-primary/20 text-primary"
                    : "bg-destructive/20 text-destructive"
              )}>
                {daysRemaining > 0 ? (
                  <>
                    <span className="text-2xl font-bold">{daysRemaining}</span>
                    <span>day{daysRemaining !== 1 ? "s" : ""} to get everything ready</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                    <span>{daysRemaining === 0 ? "Today is the deadline!" : "This date is past the deadline."}</span>
                  </>
                )}
              </div>
            )}
          </div>
        </motion.div>
      )}

      <div className="relative max-w-3xl mx-auto">
        {/* Vertical line */}
        <div className="absolute left-6 md:left-8 top-0 bottom-0 w-0.5 bg-border" />

        {steps.map((step, index) => (
          <motion.div
            key={`${selectedYear}-${step.title}`}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="relative flex gap-6 md:gap-8 mb-10 last:mb-0"
          >
            <div className={`relative z-10 flex-shrink-0 w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center ${statusColors[step.status]}`}>
              <step.icon className="w-5 h-5 md:w-6 md:h-6" />
            </div>

            <div className="flex-1 pb-8">
              <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                {step.date}
              </span>
              <h3 className="text-lg md:text-xl font-bold text-foreground mt-1 mb-2">
                {step.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {step.description}
              </p>
              {step.alert && (
                <div className="mt-3 flex items-start gap-2 text-sm bg-primary/10 border border-primary/20 rounded-lg px-4 py-2.5">
                  <AlertTriangle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-foreground/80">{step.alert}</span>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </>
  );

  if (embedded) return content;
  return (
    <section id="timeline" className="py-20 bg-background">
      <div className="container">{content}</div>
    </section>
  );
};

export default TimelineSection;
