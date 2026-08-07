'use client'

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  GraduationCap,
  MapPin,
  DollarSign,
  Clock,
  BookOpen,
  ChevronRight,
  ChevronLeft,
  X,
  MessageCircle,
  Building2,
  ChevronDown,
  ChevronUp,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  courses,
  fieldLabels,
  levelLabels,
  cityOptions,
  budgetRanges,
  durationRanges,
  type Course,
} from "@/data/courseData";

const TOTAL_STEPS = 5;

const stepMeta = [
  { icon: GraduationCap, title: "ระดับการศึกษา", subtitle: "Study Level" },
  { icon: BookOpen, title: "สาขาที่สนใจ", subtitle: "Field of Study" },
  { icon: MapPin, title: "เมืองที่ต้องการ", subtitle: "Preferred City" },
  { icon: DollarSign, title: "งบประมาณต่อปี", subtitle: "Annual Budget (AUD)" },
  { icon: Clock, title: "ระยะเวลาเรียน", subtitle: "Course Duration" },
];

interface Filters {
  level: string;
  field: string;
  city: string;
  budget: string;
  duration: string;
}

const emptyFilters: Filters = { level: "", field: "", city: "", budget: "", duration: "" };

const OptionCard = ({
  selected,
  onClick,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) => (
  <button
    onClick={onClick}
    className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
      selected
        ? "border-primary bg-primary/10 shadow-md"
        : "border-border hover:border-primary/40 hover:bg-muted/50"
    }`}
  >
    {children}
  </button>
);

const FinancialBadge = ({ level }: { level: string }) => {
  const config = {
    low: { label: "💰 Low", className: "bg-emerald-100 text-emerald-800 border-emerald-200" },
    medium: { label: "💰💰 Medium", className: "bg-amber-100 text-amber-800 border-amber-200" },
    high: { label: "💰💰💰 High", className: "bg-red-100 text-red-800 border-red-200" },
  }[level] || { label: level, className: "" };

  return (
    <span className={`inline-flex items-center text-xs px-2 py-0.5 rounded-full border ${config.className}`}>
      {config.label}
    </span>
  );
};

const CourseFinder = () => {
  const [step, setStep] = useState(0); // 0-4 = filter steps, 5 = results
  const [filters, setFilters] = useState<Filters>({ ...emptyFilters });
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  const setFilter = (key: keyof Filters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: prev[key] === value ? "" : value }));
  };

  const results = useMemo(() => {
    return courses.filter((c) => {
      if (filters.level && c.level !== filters.level) return false;
      if (filters.field && c.field !== filters.field) return false;
      if (filters.city && c.city !== filters.city) return false;
      if (filters.budget) {
        const range = budgetRanges.find((r) => r.id === filters.budget);
        if (range && (c.annualFeeAUD < range.min || c.annualFeeAUD > range.max)) return false;
      }
      if (filters.duration) {
        const range = durationRanges.find((r) => r.id === filters.duration);
        if (range && (c.durationYears < range.min || c.durationYears > range.max)) return false;
      }
      return true;
    });
  }, [filters]);

  const activeFilterTags = useMemo(() => {
    const tags: { key: keyof Filters; label: string }[] = [];
    if (filters.level) tags.push({ key: "level", label: levelLabels[filters.level]?.en || filters.level });
    if (filters.field) tags.push({ key: "field", label: fieldLabels[filters.field]?.en || filters.field });
    if (filters.city) tags.push({ key: "city", label: filters.city });
    if (filters.budget) tags.push({ key: "budget", label: budgetRanges.find((r) => r.id === filters.budget)?.label || "" });
    if (filters.duration) tags.push({ key: "duration", label: durationRanges.find((r) => r.id === filters.duration)?.label || "" });
    return tags;
  }, [filters]);

  const showResults = step === TOTAL_STEPS;

  const goNext = () => setStep((s) => Math.min(s + 1, TOTAL_STEPS));
  const goPrev = () => setStep((s) => Math.max(s - 1, 0));
  const goToResults = () => setStep(TOTAL_STEPS);
  const editSearch = () => setStep(0);

  return (
    <div className="max-w-3xl mx-auto">
      <AnimatePresence mode="wait">
        {!showResults ? (
          <motion.div
            key={`step-${step}`}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.25 }}
          >
            {/* Progress bar */}
            <div className="mb-8">
              <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
                <span>ขั้นตอนที่ {step + 1} จาก {TOTAL_STEPS}</span>
                <span>Step {step + 1} of {TOTAL_STEPS}</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-300"
                  style={{ width: `${((step + 1) / TOTAL_STEPS) * 100}%` }}
                />
              </div>
            </div>

            {/* Step title */}
            <div className="text-center mb-8">
              {(() => {
                const Icon = stepMeta[step].icon;
                return <Icon className="w-8 h-8 text-primary mx-auto mb-3" />;
              })()}
              <h3 className="text-xl font-bold text-foreground">{stepMeta[step].title}</h3>
              <p className="text-sm text-muted-foreground">{stepMeta[step].subtitle}</p>
            </div>

            {/* Step content */}
            <div className="grid gap-3">
              {step === 0 && (
                <>
                  {Object.entries(levelLabels).map(([key, val]) => (
                    <OptionCard key={key} selected={filters.level === key} onClick={() => setFilter("level", key)}>
                      <div className="font-medium text-foreground">{val.th}</div>
                      <div className="text-sm text-muted-foreground">{val.en}</div>
                    </OptionCard>
                  ))}
                  <OptionCard selected={filters.level === ""} onClick={() => setFilter("level", "")}>
                    <div className="font-medium text-foreground">ยังไม่แน่ใจ</div>
                    <div className="text-sm text-muted-foreground">I'm not sure</div>
                  </OptionCard>
                </>
              )}

              {step === 1 && (
                <>
                  {Object.entries(fieldLabels).map(([key, val]) => (
                    <OptionCard key={key} selected={filters.field === key} onClick={() => setFilter("field", key)}>
                      <div className="font-medium text-foreground">{val.th}</div>
                      <div className="text-sm text-muted-foreground">{val.en}</div>
                    </OptionCard>
                  ))}
                  <OptionCard selected={filters.field === "other"} onClick={() => setFilter("field", "other")}>
                    <div className="font-medium text-foreground">อื่นๆ</div>
                    <div className="text-sm text-muted-foreground">Other</div>
                  </OptionCard>
                </>
              )}

              {step === 2 && (
                <>
                  {cityOptions.map((city) => (
                    <OptionCard key={city} selected={filters.city === city} onClick={() => setFilter("city", city)}>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-primary" />
                        <span className="font-medium text-foreground">{city}</span>
                      </div>
                    </OptionCard>
                  ))}
                  <OptionCard selected={filters.city === ""} onClick={() => setFilter("city", "")}>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <div className="font-medium text-foreground">ยืดหยุ่น / เมืองไหนก็ได้</div>
                        <div className="text-sm text-muted-foreground">Flexible / Any</div>
                      </div>
                    </div>
                  </OptionCard>
                </>
              )}

              {step === 3 &&
                budgetRanges.map((range) => (
                  <OptionCard key={range.id} selected={filters.budget === range.id} onClick={() => setFilter("budget", range.id)}>
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-primary" />
                      <div>
                        <div className="font-medium text-foreground">{range.th}</div>
                        <div className="text-sm text-muted-foreground">{range.label}</div>
                      </div>
                    </div>
                  </OptionCard>
                ))}

              {step === 4 &&
                durationRanges.map((range) => (
                  <OptionCard key={range.id} selected={filters.duration === range.id} onClick={() => setFilter("duration", range.id)}>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-primary" />
                      <div>
                        <div className="font-medium text-foreground">{range.th}</div>
                        <div className="text-sm text-muted-foreground">{range.label}</div>
                      </div>
                    </div>
                  </OptionCard>
                ))}
            </div>

            {/* Navigation */}
            <div className="flex justify-between mt-8">
              <Button variant="ghost" onClick={goPrev} disabled={step === 0}>
                <ChevronLeft className="w-4 h-4 mr-1" /> ย้อนกลับ
              </Button>
              <div className="flex gap-2">
                <Button variant="outline" onClick={goToResults} className="text-sm">
                  <Search className="w-4 h-4 mr-1" /> ข้ามไปดูผลลัพธ์
                </Button>
                <Button onClick={goNext}>
                  ถัดไป <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Active filter tags */}
            <div className="flex flex-wrap items-center gap-2 mb-6">
              <Filter className="w-4 h-4 text-muted-foreground" />
              {activeFilterTags.length > 0 ? (
                activeFilterTags.map((tag) => (
                  <Badge
                    key={tag.key}
                    variant="secondary"
                    className="flex items-center gap-1 cursor-pointer hover:bg-destructive/10"
                    onClick={() => setFilter(tag.key, "")}
                  >
                    {tag.label}
                    <X className="w-3 h-3" />
                  </Badge>
                ))
              ) : (
                <span className="text-sm text-muted-foreground">แสดงทุกหลักสูตร (All courses)</span>
              )}
              <Button variant="ghost" size="sm" onClick={editSearch} className="ml-auto text-primary">
                <ChevronLeft className="w-4 h-4 mr-1" /> แก้ไขการค้นหา
              </Button>
            </div>

            <p className="text-sm text-muted-foreground mb-4">
              พบ {results.length} หลักสูตร ({results.length} courses found)
            </p>

            {results.length > 0 ? (
              <div className="grid gap-4">
                {results.map((course) => (
                  <CourseCard
                    key={course.id}
                    course={course}
                    expanded={expandedCard === course.id}
                    onToggle={() => setExpandedCard(expandedCard === course.id ? null : course.id)}
                  />
                ))}
              </div>
            ) : (
              <Card className="border-dashed">
                <CardContent className="py-12 text-center">
                  <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-foreground font-medium mb-2">
                    ยังไม่มีหลักสูตรที่ตรงกับที่คุณต้องการ
                  </p>
                  <p className="text-sm text-muted-foreground mb-6">
                    แต่ที่ปรึกษาของเราอาจมีตัวเลือกเพิ่มเติม
                  </p>
                  <Button asChild>
                    <a href="#contact">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      ติดต่อเรา — Contact Us
                    </a>
                  </Button>
                </CardContent>
              </Card>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const CourseCard = ({
  course,
  expanded,
  onToggle,
}: {
  course: Course;
  expanded: boolean;
  onToggle: () => void;
}) => (
  <Card className="overflow-hidden transition-shadow hover:shadow-md">
    <CardContent className="p-5">
      <div className="flex items-start gap-4">
        {/* Logo placeholder */}
        <div className="hidden sm:flex w-14 h-14 rounded-xl bg-muted items-center justify-center shrink-0">
          <Building2 className="w-6 h-6 text-muted-foreground" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <div>
              <p className="text-sm text-muted-foreground">{course.institution}</p>
              <h4 className="font-semibold text-foreground leading-tight">{course.courseName}</h4>
            </div>
            <FinancialBadge level={course.financialLevel} />
          </div>

          <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground mt-2">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" /> {course.city}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {course.durationYears < 1
                ? `${Math.round(course.durationYears * 12)} เดือน`
                : `${course.durationYears} ปี`}
            </span>
            <span className="flex items-center gap-1">
              <DollarSign className="w-3.5 h-3.5" /> ${course.annualFeeAUD.toLocaleString()}/yr
            </span>
          </div>

          <p className="text-sm text-foreground/80 mt-2">{course.shortDescriptionTH}</p>

          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <p className="text-sm text-muted-foreground mt-3 pt-3 border-t border-border">
                  {course.detailDescriptionTH}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex flex-wrap gap-2 mt-3">
            <Button variant="ghost" size="sm" onClick={onToggle} className="text-primary">
              {expanded ? (
                <>
                  <ChevronUp className="w-4 h-4 mr-1" /> ซ่อนรายละเอียด
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4 mr-1" /> ดูรายละเอียด
                </>
              )}
            </Button>
            <Button size="sm" asChild>
              <a href={course.contactURL}>
                <MessageCircle className="w-4 h-4 mr-1" /> ปรึกษาที่ปรึกษา
              </a>
            </Button>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);

export default CourseFinder;
