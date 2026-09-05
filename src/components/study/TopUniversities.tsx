'use client'

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Calendar, DollarSign, Clock, ArrowUpDown, MapPin, Building } from "lucide-react";
import { subjectGroups, type University } from "@/data/universities";
import { Badge } from "@/components/ui/badge";
// Button removed — sourceUrl is internal only

type SortKey = "ausRank" | "worldRank" | "tuition";

const sortLabels: Record<SortKey, string> = {
  ausRank: "Australia Rank",
  worldRank: "World Rank",
  tuition: "Tuition (low→high)",
};

const TopUniversities = () => {
  const [activeSubject, setActiveSubject] = useState(subjectGroups[0]?.subjectId ?? "");
  const [sortBy, setSortBy] = useState<SortKey>("ausRank");

  const group = subjectGroups.find((g) => g.subjectId === activeSubject);

  const sorted = useMemo(() => {
    if (!group) return [];
    return [...group.universities].sort((a, b) => {
      if (sortBy === "ausRank") return a.ausRank - b.ausRank;
      if (sortBy === "worldRank") return a.worldRank - b.worldRank;
      return (a.courses[0]?.tuitionPerYear ?? 0) - (b.courses[0]?.tuitionPerYear ?? 0);
    });
  }, [group, sortBy]);

  return (
    <div>
      {/* Subject selector */}
      <div className="flex flex-wrap gap-2 mb-6">
        {subjectGroups.map((g) => (
          <button
            key={g.subjectId}
            onClick={() => { setActiveSubject(g.subjectId); setSortBy("ausRank"); }}
            className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeSubject === g.subjectId
                ? "bg-primary text-primary-foreground shadow-warm"
                : "bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80"
            }`}
          >
            {g.label}
          </button>
        ))}
        <button
          disabled
          className="px-5 py-2.5 rounded-lg text-sm font-medium bg-muted/40 text-muted-foreground/50 cursor-not-allowed"
        >
          More subjects coming soon…
        </button>
      </div>

      {/* Sort controls */}
      <div className="flex items-center gap-2 mb-6 flex-wrap">
        <ArrowUpDown className="w-4 h-4 text-muted-foreground" />
        <span className="text-sm text-muted-foreground mr-1">Sort by:</span>
        {(Object.keys(sortLabels) as SortKey[]).map((key) => (
          <button
            key={key}
            onClick={() => setSortBy(key)}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              sortBy === key
                ? "bg-secondary text-secondary-foreground"
                : "bg-muted/60 text-muted-foreground hover:bg-muted"
            }`}
          >
            {sortLabels[key]}
          </button>
        ))}
      </div>

      {/* Cards */}
      {!group || group.universities.length === 0 ? (
        <div className="rounded-xl border border-border bg-popover p-12 text-center">
          <p className="text-muted-foreground">More subjects coming soon</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {sorted.map((uni, i) => (
            <UniversityCard key={uni.id} uni={uni} index={i} />
          ))}
        </div>
      )}

      <p className="mt-6 text-center text-xs text-muted-foreground">
        Rankings and tuition data compiled from each university&apos;s official website (tuition figures last verified September 2026). Figures are reviewed periodically and may change — always confirm current fees and intake dates on the university&apos;s course page before applying.
      </p>
    </div>
  );
};

const UniversityCard = ({ uni, index }: { uni: University; index: number }) => {
  const course = uni.courses[0];
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      className="group relative flex rounded-xl border border-border bg-popover overflow-hidden hover:shadow-warm transition-shadow"
    >
      {/* Left accent */}
      <div className="w-16 sm:w-20 shrink-0 bg-primary/10 flex flex-col items-center justify-center gap-1 border-r border-border">
        <span className="text-2xl sm:text-3xl font-bold text-primary font-display">#{uni.ausRank}</span>
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground">AUS</span>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 sm:p-5 min-w-0">
        <h4 className="font-display font-semibold text-foreground text-base sm:text-lg leading-tight mb-2 truncate">
          {uni.name}
        </h4>

        {/* Ranking chips */}
        <div className="flex flex-wrap gap-2 mb-3">
          <Badge variant="outline" className="text-xs gap-1">
            🌍 World #{uni.worldRankLabel ?? uni.worldRank}
          </Badge>
          <Badge variant="outline" className="text-xs gap-1">
            🇦🇺 Australia #{uni.ausRank}
          </Badge>
        </div>

        {/* City & Campus */}
        {(uni.city || uni.campus) && (
          <div className="flex flex-wrap gap-x-4 gap-y-1 mb-3 text-xs text-muted-foreground">
            {uni.city && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3 shrink-0" /> {uni.city}
              </span>
            )}
            {uni.campus && (
              <span className="flex items-center gap-1">
                <Building className="w-3 h-3 shrink-0" /> {uni.campus}
              </span>
            )}
          </div>
        )}

        {course && (
          <div className="space-y-1.5 text-sm">
            <p className="text-muted-foreground text-xs uppercase tracking-wider">Example course</p>
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-medium text-foreground">{course.name}</span>
              <Badge variant="secondary" className="text-xs">
                <Clock className="w-3 h-3 mr-1" />
                {course.durationLabel ?? `${course.durationYears} ${course.durationYears === 1 ? "year" : "years"}`}
              </Badge>
            </div>

            <div className="flex items-start gap-2 text-muted-foreground">
              <Calendar className="w-3.5 h-3.5 mt-0.5 shrink-0" />
              <span className="text-xs leading-relaxed">{course.intake}</span>
            </div>

            <div className="flex items-center gap-2 text-muted-foreground">
              <DollarSign className="w-3.5 h-3.5 shrink-0" />
              <span className="text-xs">
                ${course.tuitionPerYear.toLocaleString()} / year ({course.tuitionYear})
              </span>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default TopUniversities;
