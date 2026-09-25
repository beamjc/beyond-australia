// Transparent pathway scoring for the Study Pathway Finder.
// Every point comes from one answer (see `contributions`), so each result can be
// traced back to what the visitor chose. Scores are never shown to visitors.

import {
  budgetOptions, englishOptions, goalOptions, interestOptions, qualificationOptions,
  type BudgetId, type EnglishId, type FinderOption, type GoalId, type InterestId,
  type NextStepId, type PathwayId, type QualificationId, type TimingId,
} from "@/data/studyFinder";
import type { Bi } from "@/data/visaReadiness";
import { tiers } from "@/lib/CalculationEngine";

export interface StudyAnswers {
  age: string;
  english: EnglishId | null;
  goals: GoalId[];
  city: string | null;
  budget: BudgetId | null;
  interest: InterestId | null;
  qualification: QualificationId | null;
  experienceYears: string;
  field: string;
  timing: TimingId | null;
}

export const emptyStudyAnswers: StudyAnswers = {
  age: "", english: null, goals: [], city: null, budget: null, interest: null,
  qualification: null, experienceYears: "", field: "", timing: null,
};

export const PATHWAYS: PathwayId[] = ["elicos", "vet", "he"];
/** Score gap at or below which two pathways are presented as equally relevant. */
export const TIE_MARGIN = 1;

export interface Contribution { pathway: PathwayId; points: number; reason?: Bi }

/**
 * Lowest yearly tuition in the planner's own data (CalculationEngine tiers),
 * used only to flag when a budget band sits below every option we price.
 */
export const minAnnualTuition: Partial<Record<PathwayId, number>> = {
  he: Math.min(...tiers.filter((t) => t.sector === "he").map((t) => t.annualLow)),
  vet: Math.min(...tiers.filter((t) => t.sector === "vet").map((t) => t.annualLow)),
};

const collect = <Id extends string>(opts: FinderOption<Id>[], ids: (Id | null)[]): Contribution[] =>
  ids.flatMap((id) => {
    const opt = opts.find((o) => o.id === id);
    return opt?.weights
      ? Object.entries(opt.weights).map(([p, points]) => ({ pathway: p as PathwayId, points: points!, reason: opt.reason }))
      : [];
  });

export function scoreStudyAnswers(a: StudyAnswers) {
  const contributions = [
    ...collect(englishOptions, [a.english]),
    ...collect(interestOptions, [a.interest]),
    ...collect(goalOptions, a.goals),
    ...collect(qualificationOptions, [a.qualification]),
  ];
  const scores = Object.fromEntries(PATHWAYS.map((p) => [p, 0])) as Record<PathwayId, number>;
  for (const c of contributions) scores[c.pathway] += c.points;
  return { scores, contributions };
}

const LOW_ENGLISH: (EnglishId | null)[] = ["none", "le45", "50to55"];

export interface StudyRecommendation {
  scores: Record<PathwayId, number>;
  primary: PathwayId;
  /** Present when two pathways are within TIE_MARGIN of each other. */
  tieWith: PathwayId | null;
  alternative: PathwayId | null;
  reasons: Record<PathwayId, Bi[]>;
  budgetConstrained: PathwayId[];
  sequence: PathwayId[] | null;
  nextSteps: NextStepId[];
  showDowngradeNote: boolean;
  showMigrationNote: boolean;
}

export function recommendStudyPathway(a: StudyAnswers): StudyRecommendation {
  const { scores, contributions } = scoreStudyAnswers(a);
  // Stable order on equal scores: ELICOS, VET, University.
  const ranked = [...PATHWAYS].sort((x, y) => scores[y] - scores[x]);
  const [primary, second] = ranked;
  const tieWith = scores[primary] - scores[second] <= TIE_MARGIN ? second : null;
  const alternative = !tieWith && scores[second] > 0 ? second : null;

  const reasons = Object.fromEntries(
    PATHWAYS.map((p) => [
      p,
      contributions.filter((c) => c.pathway === p && c.points > 0 && c.reason).map((c) => c.reason!),
    ]),
  ) as Record<PathwayId, Bi[]>;

  const band = budgetOptions.find((b) => b.id === a.budget);
  const shown = [primary, ...(tieWith ? [tieWith] : [])];
  const budgetConstrained = shown.filter((p) => {
    const min = minAnnualTuition[p];
    return band?.max != null && min != null && band.max < min;
  });

  const lowEnglish = LOW_ENGLISH.includes(a.english);
  let sequence: PathwayId[] | null = null;
  if (primary === "elicos") sequence = ["elicos", scores.he > scores.vet ? "he" : "vet"];
  else if (primary === "vet") sequence = lowEnglish ? ["elicos", "vet"] : scores.he > 0 ? ["vet", "he"] : null;
  else if (lowEnglish) sequence = ["elicos", "he"];
  else if ((a.qualification === "highSchool" || a.qualification === "certDiploma") && scores.vet > 0) sequence = ["vet", "he"];

  const steps: NextStepId[] = [];
  if (lowEnglish) steps.push("checkEnglish");
  if (a.interest === "unsure" || a.goals.includes("unsure") || a.goals.includes("career")) steps.push("chooseField");
  if (budgetConstrained.length || a.budget === "unsure") steps.push("compareBudget");
  if (a.timing === "inAustralia" || a.timing === "within6") steps.push("planTiming");
  if (a.goals.includes("studyWork")) steps.push("visaInfo");
  steps.push("institutionRequirements");
  for (const extra of ["compareBudget", "checkEnglish"] as NextStepId[]) {
    if (steps.length < 3 && !steps.includes(extra)) steps.push(extra);
  }

  const higherQual = a.qualification === "bachelor" || a.qualification === "master";
  return {
    scores,
    primary,
    tieWith,
    alternative,
    reasons,
    budgetConstrained,
    sequence,
    nextSteps: steps.slice(0, 4),
    showDowngradeNote: higherQual && shown.includes("vet"),
    showMigrationNote: a.goals.includes("studyWork"),
  };
}

/** Age must be a whole number from 15 to 70 (same rule as before). */
export const isValidAge = (age: string) => {
  const n = Number(age);
  return age.trim() !== "" && Number.isInteger(n) && n >= 15 && n <= 70;
};

/** Optional; when given, a whole number from 0 to 50. */
export const isValidExperience = (years: string) => {
  if (years.trim() === "") return true;
  const n = Number(years);
  return Number.isInteger(n) && n >= 0 && n <= 50;
};
