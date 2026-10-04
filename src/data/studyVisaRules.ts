// Dates and sources shown by the Budget Study Planner. Edit the values here;
// the UI formats them for each language (see src/lib/plannerDates.ts).

/** "Last updated" month shown in the planner header badge. */
export const PLANNER_DATA_UPDATED = { year: 2026, month: 10 } as const;

/**
 * Student visa onshore-lodgement rule (Migration Amendment (Student Visa
 * Reform) Regulations 2026). Checked 2026-10-04, see docs/qa/factual-checks.md
 * FC-28–FC-31.
 */
export const STUDENT_VISA_ONSHORE_RULE = {
  effective: { year: 2026, month: 10, day: 2 },
  sourceUrl:
    "https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/changes-to-student-visa-application-rules-500-590/applying-in-australia",
} as const;
