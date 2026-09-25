// Dated visa facts and official links used by the pathway tools.
// Keep every number that can change here, with where it came from.
// status: "UNVERIFIED" = carried over from the previous tool and not yet
// confirmed against the live official page (Home Affairs pages are rendered
// client-side and could not be read automatically on 2026-09-25).
// See docs/qa/factual-checks.md (FC-22…).

export interface DatedFact<T> {
  value: T;
  effectiveFrom?: string;
  source: string;
  checkedOn: string;
  status: "VERIFIED" | "UNVERIFIED";
  note?: string;
}

export const visaFacts = {
  whm462Thailand: {
    ageRange: {
      value: { min: 18, max: 30 },
      source: "https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/work-holiday-462",
      checkedOn: "2026-09-25",
      status: "UNVERIFIED",
      note: "Age range for Thai passport holders, carried over from the previous Visa Pathway Finder.",
    } satisfies DatedFact<{ min: number; max: number }>,
  },
  skilledPointsTest: {
    passMark: {
      value: 65,
      source: "https://immi.homeaffairs.gov.au/help-support/tools/points-calculator",
      checkedOn: "2026-09-25",
      status: "UNVERIFIED",
      note: "Minimum points score for the points-tested skilled visas. Meeting it does not mean an invitation.",
    } satisfies DatedFact<number>,
  },
} as const;

/** Official pages, checked to respond (HTTP 200) on 2026-09-25. */
export const officialLinks = {
  visaFinder: "https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-finder",
  whm462: "https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/work-holiday-462",
  student500: "https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/student-500",
  skilledOccupationList: "https://immi.homeaffairs.gov.au/visas/working-in-australia/skill-occupation-list",
  pointsCalculator: "https://immi.homeaffairs.gov.au/help-support/tools/points-calculator",
  workingInAustralia: "https://immi.homeaffairs.gov.au/visas/working-in-australia",
  employerNomination186: "https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/employer-nomination-scheme-186",
  migrationAgentRegister: "https://portal.mara.gov.au/search-the-register-of-migration-agents/",
} as const;
