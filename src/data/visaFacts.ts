// Dated visa facts and official links used by the pathway tools.
// Keep every number that can change here, with where it came from.
// status: "VERIFIED" = confirmed against the official page on checkedOn
// (Home Affairs pages render client-side; 2026-09-26 checks used the official
// page text shown in search results).
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
      checkedOn: "2026-09-26",
      status: "VERIFIED",
      note: "Home Affairs 462 page (via search excerpt): available to people 18 to 30; Thailand is an eligible country.",
    } satisfies DatedFact<{ min: number; max: number }>,
  },
  skilledPointsTest: {
    passMark: {
      value: 65,
      source: "https://immi.homeaffairs.gov.au/help-support/tools/points-calculator",
      checkedOn: "2026-09-26",
      status: "VERIFIED",
      note: "Home Affairs 189 points-tested stream (via search excerpt): points threshold of 65. Meeting it does not mean an invitation.",
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
