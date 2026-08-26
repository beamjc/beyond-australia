'use client'

import { useState, useMemo, useRef, useEffect } from "react";
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

  // "Breathing" effect: cards drift apart from the row's center card while
  // actively scrolling, then spring back together once scrolling stops.
  // Deliberately done as a `transform` (not `gap`/margin) so it's purely
  // visual — it never changes scrollWidth, so it can't fight the native
  // CSS scroll-snap the way a layout-affecting property would.
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    // Wheel/touch scrolling has an inertial tail after the input stops —
    // a fixed silence-based debounce fires early mid-tail, flips isScrolling
    // back and forth, and the cards visibly pulse in/out instead of settling
    // once. `scrollend` fires exactly once true momentum has fully stopped,
    // so prefer it; fall back to a longer debounce where it's unsupported.
    const supportsScrollEnd = "onscrollend" in window;
    let fallbackTimeout: ReturnType<typeof setTimeout> | null = null;

    const handleScroll = () => {
      setIsScrolling(true);
      if (!supportsScrollEnd) {
        if (fallbackTimeout) clearTimeout(fallbackTimeout);
        fallbackTimeout = setTimeout(() => setIsScrolling(false), 350);
      }
    };
    const handleScrollEnd = () => setIsScrolling(false);

    scroller.addEventListener("scroll", handleScroll, { passive: true });
    if (supportsScrollEnd) scroller.addEventListener("scrollend", handleScrollEnd);

    return () => {
      scroller.removeEventListener("scroll", handleScroll);
      if (supportsScrollEnd) scroller.removeEventListener("scrollend", handleScrollEnd);
      if (fallbackTimeout) clearTimeout(fallbackTimeout);
    };
  }, []);

  const midIndex = (steps.length - 1) / 2;

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

      <div className="relative">
        {/* Edge fades to hint scrollability */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-6 w-8 md:w-16 bg-gradient-to-r from-background to-transparent z-20" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-6 w-8 md:w-16 bg-gradient-to-l from-background to-transparent z-20" />

        <div
          ref={scrollerRef}
          className="timeline-scroll snap-x snap-mandatory overflow-x-auto pb-6 [-webkit-overflow-scrolling:touch]"
        >
          <div className="relative flex items-stretch gap-6 md:gap-10 px-6 sm:px-10 md:px-[clamp(24px,12vw,140px)] min-w-max">
            {/* Dashed connector line */}
            <div
              className="absolute top-[38px] md:top-[42px] left-0 right-0 border-t-2 border-dashed"
              style={{ borderColor: "#BAD6EB" }}
            />

            {steps.map((step, index) => {
              const isActive = step.status === "action";
              return (
                <motion.div
                  key={`${selectedYear}-${step.title}`}
                  initial={{ opacity: 0, y: 16, x: 0 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    x: isScrolling ? (index - midIndex) * 16 : 0,
                  }}
                  transition={{
                    opacity: { delay: index * 0.08 },
                    y: { delay: index * 0.08 },
                    x: { type: "spring", stiffness: 260, damping: 24 },
                  }}
                  className="snap-center relative flex flex-col items-center shrink-0 w-[250px] sm:w-[280px]"
                >
                  {/* Date label */}
                  <span
                    className={cn(
                      "text-xs sm:text-sm font-semibold uppercase tracking-wider text-center mb-3 px-2",
                      isActive ? "text-foreground" : "text-muted-foreground"
                    )}
                  >
                    {step.date}
                  </span>

                  {/* Node */}
                  <div
                    className="relative z-10 flex items-center justify-center w-9 h-9 rounded-full border-4 bg-background shrink-0"
                    style={{ borderColor: "#BAD6EB" }}
                  >
                    <div
                      className={cn(
                        "w-3.5 h-3.5 rounded-full",
                        isActive ? "bg-primary animate-pulse-soft" : "bg-[#BAD6EB]"
                      )}
                    />
                  </div>

                  {/* Card */}
                  <div
                    className={cn(
                      "mt-6 w-full flex-1 flex flex-col rounded-2xl overflow-hidden transition-shadow",
                      isActive ? "shadow-warm z-10" : "opacity-90"
                    )}
                  >
                    <div
                      className={cn(
                        "flex items-center gap-2 px-5 py-4 h-[68px] sm:h-[76px] shrink-0",
                        isActive ? "bg-primary" : "bg-[#D0E3FF]"
                      )}
                    >
                      <step.icon className={cn("w-4 h-4 flex-shrink-0", isActive ? "text-primary-foreground" : "text-primary")} />
                      <h3
                        title={step.title}
                        className={cn(
                          "text-sm sm:text-base font-bold leading-tight line-clamp-2",
                          isActive ? "text-primary-foreground" : "text-foreground"
                        )}
                      >
                        {step.title}
                      </h3>
                    </div>

                    <div
                      className="p-5 flex-1 flex flex-col"
                      style={{ background: isActive ? "#FFF9F0" : "rgba(186, 214, 235, 0.25)" }}
                    >
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {step.description}
                      </p>
                      {step.alert && (
                        <>
                          <div className="border-t border-dashed my-3" style={{ borderColor: "#BAD6EB" }} />
                          <div className="flex items-start gap-2 text-xs">
                            <AlertTriangle className="w-3.5 h-3.5 text-primary flex-shrink-0 mt-0.5" />
                            <span className="text-foreground/80">{step.alert}</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Mobile scroll hint */}
        <p className="text-center text-xs text-muted-foreground mt-1 md:hidden">
          ← Swipe to see the full timeline →
        </p>
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
