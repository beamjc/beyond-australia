// Scoring for the Visa Readiness Check. The formula, weights and thresholds are
// the ones used by the original Visa Strength Assessment; only the presentation
// changed (a readiness score is shown as 100 − risk score).

import type { ReadinessFactor, ReadinessLevel, VerdictBand } from "@/data/visaReadiness";

export type SliderValues = Record<string, number>;

/** 0 = no concern, 100 = strongest concern, for one factor. */
export function factorRisk(factor: Pick<ReadinessFactor, "inverted">, raw: number): number {
  return factor.inverted ? 100 - raw : raw;
}

export function riskLevel(risk: number): ReadinessLevel {
  if (risk <= 33) return "low";
  if (risk <= 66) return "medium";
  return "high";
}

/** Weighted risk score 0–100 (rounded), as in the original assessment. */
export function computeRiskScore(
  factors: Pick<ReadinessFactor, "id" | "weight" | "inverted">[],
  values: SliderValues,
): number {
  const totalWeight = factors.reduce((sum, f) => sum + f.weight, 0);
  const weighted =
    (factors.reduce((sum, f) => sum + (factorRisk(f, values[f.id]) * f.weight) / 100, 0) / totalWeight) * 100;
  return Math.round(weighted);
}

export const readinessScore = (riskScore: number) => 100 - riskScore;

/** Same bands as the original verdicts (≤20, ≤40, ≤55, ≤75, above). */
export function verdictBand(riskScore: number): VerdictBand {
  if (riskScore <= 20) return "strong";
  if (riskScore <= 40) return "some";
  if (riskScore <= 55) return "several";
  if (riskScore <= 75) return "many";
  return "serious";
}

const levelOrder: Record<ReadinessLevel, number> = { high: 0, medium: 1, low: 2 };

export interface RankedFactor<F> {
  factor: F;
  risk: number;
  level: ReadinessLevel;
}

/** Factors ordered by level (high first), then weighted risk, then original order. */
export function rankFactors<F extends Pick<ReadinessFactor, "id" | "weight" | "inverted">>(
  factors: F[],
  values: SliderValues,
): RankedFactor<F>[] {
  return factors
    .map((factor, i) => {
      const risk = factorRisk(factor, values[factor.id]);
      return { factor, risk, level: riskLevel(risk), i };
    })
    .sort(
      (a, b) =>
        levelOrder[a.level] - levelOrder[b.level] ||
        b.risk * b.factor.weight - a.risk * a.factor.weight ||
        a.i - b.i,
    )
    .map(({ factor, risk, level }) => ({ factor, risk, level }));
}
