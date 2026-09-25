// Australian income tax tables used by the Savings planner.
// Checked against ato.gov.au on 2026-09-26 (see docs/qa/factual-checks.md FC-16).
// Tax on income = base + rate × (income − from), using the highest bracket
// whose `from` is below the income. Medicare levy and offsets are not included.

export interface TaxBracket { from: number; base: number; rate: number }
export interface TaxTable { incomeYear: string; source: string; checkedOn: string; note?: string; brackets: TaxBracket[] }

export const taxTables = {
  workingHolidayMaker: {
    incomeYear: "2025–26",
    source: "https://www.ato.gov.au/tax-rates-and-codes/tax-rates-working-holiday-makers",
    checkedOn: "2026-09-26",
    note: "Latest year the ATO has published for working holiday makers (page last updated 18 June 2025).",
    brackets: [
      { from: 0, base: 0, rate: 0.15 },
      { from: 45_000, base: 6_750, rate: 0.30 },
      { from: 135_000, base: 33_750, rate: 0.37 },
      { from: 190_000, base: 54_100, rate: 0.45 },
    ],
  },
  resident: {
    incomeYear: "2026–27",
    source: "https://www.ato.gov.au/tax-rates-and-codes/tax-rates-australian-residents",
    checkedOn: "2026-09-26",
    note: "Full-year residents with the full tax-free threshold (page last updated 13 August 2026). 16% → 15% from 1 July 2026.",
    brackets: [
      { from: 0, base: 0, rate: 0 },
      { from: 18_200, base: 0, rate: 0.15 },
      { from: 45_000, base: 4_020, rate: 0.30 },
      { from: 135_000, base: 31_020, rate: 0.37 },
      { from: 190_000, base: 51_370, rate: 0.45 },
    ],
  },
} satisfies Record<string, TaxTable>;

export function taxFromTable(income: number, table: TaxTable): number {
  if (income <= 0) return 0;
  let b = table.brackets[0];
  for (const x of table.brackets) if (income > x.from) b = x;
  return b.base + (income - b.from) * b.rate;
}
