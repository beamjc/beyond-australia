# Budget Planner "visa pass %" — check against official data

Checked: 2026-09-24. Source: Department of Home Affairs, **BP0015 Student visa grant rates** (data.gov.au, dataset `student-visas`, file listed as "at 2026-08-31"; licence CC BY 2.5 AU), https://data.gov.au/data/dataset/student-visas. Grant rate = granted ÷ (granted + refused). Filter: Citizenship = Thailand, **primary applicants**, decisions **Jul 2025 – Mar 2026** (FY 2025-26 Q1–Q3), the period named in `CalculationEngine.ts`. Reproduce with `scripts/qa/grant_rates_thailand.py`. The data is marked provisional and is revised monthly.

## 1. Base rates — match the official data

| Sector | Applied from | Site value | Official (primary) | Decisions | Official (all applicants) |
|---|---|---|---|---|---|
| University (HE) | Thailand | 93.6 | **93.6** | 594 | 93.1 |
| University (HE) | Australia | 93.1 | 93.6 | 362 | 92.8 |
| English (ELICOS) | Thailand | 49.5 | **49.5** | 656 | 49.5 |
| English (ELICOS) | Australia | 83.2 | 83.5 | 231 | 82.8 |
| Vocational (VET) | Thailand | 25.0 | 25.3 | 91 | 24.4 |
| Vocational (VET) | Australia | 55.7 | 56.2 | 2,233 | 55.9 |

All six are within 0.5 points — the site's base rates are real Home Affairs figures for Thai applicants in that period (small differences are consistent with later monthly revisions). For context, full FY 2025-26 (primary): HE 94.5 / 92.9, ELICOS 50.5 / 84.7, VET 25.4 / 59.7.

## 2. Age factors — partly supported, several are not

Site figure = base × age factor. "Official" is the real grant rate for that age group. **n** = number of decisions (small n = unreliable).

| Sector / from | Age | n | Official rate | Site shows | Comment |
|---|---|---|---|---|---|
| HE / Thailand | 20–24 | 184 | 96.2 | 93.6 | close |
| HE / Thailand | 25–29 | 105 | 88.6 | 86.1 | close |
| HE / Thailand | 30–34 | 46 | 84.8 | 73.0 | site too low |
| HE / Thailand | 35–39 | 12 | 75.0 | 56.2 | site much too low; n tiny |
| HE / Australia | 30–34 | 74 | 86.5 | 88.4 | close |
| ELICOS / Thailand | 20–24 | 258 | 62.8 | 62.9 | exact |
| ELICOS / Thailand | 25–29 | 232 | 44.8 | 42.1 | close |
| ELICOS / Thailand | 30–34 | 86 | 38.4 | 34.7 | close |
| VET / Australia | 20–24 | 198 | 72.7 | 55.7 | site too low |
| VET / Australia | 25–29 | 906 | 66.6 | 55.7 | site too low |
| VET / Australia | 30–34 | 700 | 54.1 | 55.7 | close |
| VET / Australia | 35–39 | 253 | 36.0 | 44.6 | site too high |
| VET / Australia | 40+ | 169 | 18.9 | 36.2 | **site ~2× too high** |
| VET / Thailand | any | 2–29 each | 0–38 | 16–25 | n too small to judge |

Full table (all age groups): run the script.

## 3. What the number is — and is not

- It is the **share of Thai applicants in that sector/location (and roughly that age) who were granted**, in a past period.
- It is **not** the visitor's own chance: it ignores course, provider, study history, finances, English score, immigration history — and all three university tiers show the same figure.
- Several age groups have fewer than 30 decisions, so their rates swing a lot month to month.

## Recommendation (owner decision)

1. **Keep the base rate, relabel it honestly** (Thai wording via the editor), e.g. "Average approval rate for Thai applicants — university, applying from Thailand: 93.6% (Home Affairs, Jul 2025 – Mar 2026)".
2. **Replace the hand-made age factors** with the official age-group rate where the group has ≥ 30 decisions; otherwise show only the sector average. Or drop age adjustment entirely.
3. Show the period and source under the figure, and one line that it is not a personal prediction.
4. Refresh from BP0015 periodically (it updates monthly) — the script makes this repeatable.

No calculation has been changed; this needs the owner's approval (CLAUDE.md: scoring assumptions).
