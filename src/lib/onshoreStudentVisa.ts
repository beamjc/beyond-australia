// Onshore Student visa checker used by the Budget Study Planner.
// Informational only: it maps two answers to a cautious outcome and never
// sends or stores them. Rules follow the Home Affairs pages listed in
// docs/qa/factual-checks.md (FC-28–FC-31).

export type CurrentVisa = "500" | "462" | "485" | "600" | "other";
export type StudyPlan = "continue" | "higher" | "same" | "phd" | "unsure";

export const CURRENT_VISAS: CurrentVisa[] = ["500", "462", "485", "600", "other"];
export const STUDY_PLANS: StudyPlan[] = ["continue", "higher", "same", "phd", "unsure"];

export type OnshoreOutcome =
  | "whm462" | "grad485" | "visitor600" | "otherVisa"
  | "studentContinue" | "studentHigher" | "studentSame" | "studentPhd" | "studentUnsure";

/** offshore: must / generally must apply offshore; maybe: may qualify for an exemption; assess: needs review. */
export type OutcomeTone = "offshore" | "maybe" | "assess";

export const OUTCOME_TONE: Record<OnshoreOutcome, OutcomeTone> = {
  whm462: "offshore",
  grad485: "offshore",
  visitor600: "offshore",
  otherVisa: "assess",
  studentContinue: "maybe",
  studentHigher: "maybe",
  studentSame: "offshore",
  studentPhd: "maybe",
  studentUnsure: "assess",
};

const STUDENT_OUTCOME: Record<StudyPlan, OnshoreOutcome> = {
  continue: "studentContinue",
  higher: "studentHigher",
  same: "studentSame",
  phd: "studentPhd",
  unsure: "studentUnsure",
};

/** Student visa holders need a second answer; every other visa resolves from the first. */
export const needsStudyPlan = (visa: CurrentVisa | null) => visa === "500";

/** Outcome for the selected answers, or null while an answer is still missing. */
export function onshoreOutcome(visa: CurrentVisa | null, plan: StudyPlan | null): OnshoreOutcome | null {
  switch (visa) {
    case null: return null;
    case "462": return "whm462";
    case "485": return "grad485";
    case "600": return "visitor600";
    case "other": return "otherVisa";
    case "500": return plan ? STUDENT_OUTCOME[plan] : null;
  }
}
