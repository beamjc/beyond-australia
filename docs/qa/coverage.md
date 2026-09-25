# Coverage — QA pass 1 (2026-09-23)

Environment: local production build (`next build` + `next start`) in Chromium 141.0.7390.37 (Playwright 1.56.1) with **viewport emulation — not real devices**. Viewports: desktop 1440×900, tablet 768×1024 (touch), mobile 390×844 (Pixel 7 profile). Timezone Asia/Bangkok. Supabase: **mocked** (fixtures in `tests/e2e/fixtures.ts`). Live reference site and official sources: **blocked by network policy**.

Results: NOT RUN · PASS · FAIL · BLOCKED · NOT APPLICABLE. "(M)" = mocked content only. Automated = `tests/e2e/public.spec.ts` / `tests/unit/*`; all e2e rows ran on all three viewports unless noted.

## Navigation & home

| ID | Feature | Lang | Viewport | Expected (source) | Result | Evidence | Issue |
|---|---|---|---|---|---|---|---|
| NAV-01 | Home loads, `<html lang>` matches choice, no page errors | EN, TH | D/T/M | CLAUDE.md inventory | PASS | e2e "home (en/th) loads…" | — |
| NAV-02 | All 4 WHM tabs + 6 Study tabs selectable, panel visible, `aria-selected` | EN, TH | D/T/M | inventory | PASS | same test | ISS-005 |
| NAV-03 | No horizontal page overflow on any tab | EN, TH | D/T/M | CLAUDE.md UX rules | PASS | `noHorizontalOverflow` per tab | — |
| NAV-04 | Language persists after reload and to `/articles` | EN→TH | D/T/M | inventory "remembered EN/TH" | PASS | e2e "language choice persists…" | — |
| NAV-05 | Tool content follows selected language | EN, TH | code + browser | CLAUDE.md bilingual | FAIL | 11 tool components ignore language | ISS-001 |
| NAV-06 | Tab inputs preserved when switching tabs | TH | D/T/M | CLAUDE.md "lost state" | PASS (after fix) | e2e "inputs survive…" | ISS-005 |
| NAV-07 | Sections readable while on screen; reduced motion honoured | — | D/T/M | CLAUDE.md reduced motion | PASS (after fix; FAIL before: 0.47 opacity) | e2e "sections are fully opaque…" | ISS-002 |
| NAV-08 | Unknown route → 404 | — | D/T/M + Workers preview | Next.js | PASS | e2e; `wrangler dev` `/nope` 404 | — |
| NAV-09 | Section anchor links / deep links `#whm`, `#study`, `#visa-pathway` | — | D/T/M | nav | PASS | used by every e2e journey | — |
| NAV-10 | Browser back/forward across pages | — | — | CLAUDE.md | NOT RUN | — | — |
| NAV-11 | Mobile menu opens and exposes language switch | TH | M | Navbar | PASS | e2e language test (mobile path) | — |
| NAV-12 | CTA / floating LINE / Facebook / BSC link targets (not opened) | — | D/T/M | inventory | PASS (href only) | e2e link test; destinations unchanged | ISS-025 |
| NAV-13 | Reviews block shows no placeholder text | TH | D/T/M | CLAUDE.md "no invented reviews" | PASS (after fix; FAIL before) | e2e | ISS-004 |
| NAV-14 | Proof statistics claims supported | — | code | CLAUDE.md | NOT RUN (needs owner evidence) | "15+ years" etc. not verifiable | — |
| NAV-15 | Keyboard: visible focus on all controls, full tab order | — | — | CLAUDE.md a11y | NOT RUN (only sliders/checkbox keyboard-tested) | — | — |

## Working Holiday tools

| ID | Feature | Lang | Viewport | Expected | Result | Evidence | Issue |
|---|---|---|---|---|---|---|---|
| WHM-01 | Timeline renders | EN/TH | D/T/M | inventory | PASS (render only) | NAV-02 | — |
| WHM-02 | Timeline order/dates correct | — | — | official sources | BLOCKED | sources blocked | — |
| WHM-03 | Checklist stage expand/collapse | TH | D/T/M | code | PASS | e2e | ISS-021 |
| WHM-04 | Checklist check/uncheck (click + keyboard) | TH | D/T/M | code | PASS | e2e | ISS-021 |
| WHM-05 | Checklist reset / persistence | — | — | only if implemented | NOT APPLICABLE | not implemented | ISS-034 |
| WHM-06 | Postcode: non-digits stripped, <3 digits disabled, >4 digits truncated | EN | D/T/M | code | PASS | e2e | — |
| WHM-07 | Postcode leading zero kept (0870 displayed, matched as NT) | EN | D/T/M + unit | CLAUDE.md | PASS | e2e + unit | — |
| WHM-08 | Postcode listed / not listed / boundaries | — | unit | encoded list | PASS | `tests/unit/postcode.test.ts` | — |
| WHM-09 | Postcode list matches Home Affairs | — | — | FC-17 | BLOCKED | sources blocked | — |
| WHM-10 | Postcode result wording vs eligibility | EN | — | CLAUDE.md | FAIL (overclaims) | code | ISS-019 |
| WHM-11 | FAQ expand/collapse | — | D/T/M | code | PASS | e2e | — |
| WHM-12 | FAQ factual freshness | — | — | official | BLOCKED | — | — |

## Study tools

| ID | Feature | Lang | Viewport | Expected | Result | Evidence | Issue |
|---|---|---|---|---|---|---|---|
| BSP-T01 | Engine arithmetic (English weeks, visa months, OSHC, deposit, upfront, coverage, ELICOS-only, short pathway cap) | — | unit | hand-derived from documented assumptions | PASS (13 tests) | `tests/unit/calculationEngine.test.ts` | — |
| BSP-T02 | THB⇄AUD round trip | TH | D/T/M | no drift | PASS (after fix) | e2e | ISS-008 |
| BSP-T03 | Blank budget → 0, no NaN, 0 % | TH | D/T/M | — | PASS | e2e | — |
| BSP-T04 | Low-budget tip < ฿180,000 switches goal | TH | D/T/M | code | PASS | e2e | — |
| BSP-T05 | Sliders keyboard + named | TH | D/T/M | a11y | PASS | e2e (Home/End on age) | ISS-021 |
| BSP-T06 | Short course, age ≥ 31 headline consistent with cards | TH | D | — | FAIL | screenshot desktop-06 | ISS-010 |
| BSP-T07 | Excessive budget (> slider max) | TH | — | — | NOT RUN (input accepts; slider pins at max) | code | — |
| BSP-T08 | Visa "pass %" presentation | TH | D/M | CLAUDE.md no probability claims | FAIL | screenshots | ISS-003 |
| BSP-T09 | Fees/rates current | — | — | FC-01…10 | BLOCKED | — | — |
| BSP-T10 | Thai copy review | TH | D/M | CLAUDE.md gate | Review file ready; NOT APPLIED | `thai-review-budget-planner.md` | ISS-001 |
| UNI-01 | Top Universities renders | EN/TH | D/T/M | — | PASS (render only) | NAV-02 | — |
| UNI-02 | Ranks/fees sourced | — | — | — | BLOCKED / FAIL (source not shown) | FC-18 | ISS-030 |
| OPT-01 | Age validation 15–70 | EN | D/T/M | input min/max | PASS (after fix) | e2e | ISS-020 |
| OPT-02 | Answers kept on Back; full walk to result | EN | D/T/M | — | PASS | e2e | — |
| OPT-03 | No external network requests during/after questionnaire | EN | D/T/M | inventory "not transmitted" | PASS | e2e request log (only localhost) | — |
| OPT-04 | Restart | EN | — | — | NOT RUN | — | — |
| FIN-01 | Negative fee/children cannot reduce total | EN | D/T/M | — | PASS (after fix; FAIL before) | e2e ($31,710) | ISS-007 |
| FIN-02 | Partner + 2 children (school-age clamp) breakdown | EN | D/T/M | hand-derived $99,006 | PASS | e2e | — |
| FIN-03 | Short-course months rule; stale hidden months after switching Yes/No | EN | — | — | NOT RUN | — | — |
| FIN-04 | Amounts match Home Affairs | — | — | FC-11 | BLOCKED | — | — |
| SAV-01 | LINE/Facebook share URLs encode Thai + page URL (not sent) | TH | D/T/M | CLAUDE.md | PASS | e2e | — |
| SAV-02 | Tax / wage assumptions current | — | — | FC-12…15 | BLOCKED | — | ISS-027 |
| SAV-03 | Negative savings / boundary inputs | EN | — | — | NOT RUN | — | — |
| SAV-04 | One calculator: visa switch changes tax only; defaults match hand-derived figures; 3 years reaches goal; THB↔AUD round-trip | TH | e2e (new) + 390/1440 script | owner brief; `tests/unit/savings.test.ts` | PASS (script + e2e 2026-09-25, D/T/M) | `screenshots/savings/` | ISS-032 |
| SAV-05 | Income needed to reach goal | — | unit | derived: WHM (67,478.26 − 6,750)/0.7 = 86,754.66 | PASS | unit | — |
| VSA-01 | 8 sliders named; safe/risky ends → readiness 100 "You look well prepared overall" / 0 "Get professional advice…"; no sliders on the result; Edit keeps answers; rows expand | EN | e2e (updated) | code (weights unchanged, `tests/unit/visaReadiness.test.ts`) | PASS (e2e 2026-09-25, D/T/M) | e2e | ISS-021 |
| VSA-02 | Uncertainty presentation: owner disclaimer + "score is not a chance of approval" note; status terms describe preparation priority | TH | M/D (viewport emulation) | owner brief 2026-09-25 | PASS (screenshots) — Thai drafts await editor | `screenshots/visa-readiness/` | — |
| VSA-03 | Scoring formula, weights, per-factor thresholds and verdict bands identical to the original | — | unit | original component (main @ 646194a) | PASS | `tests/unit/visaReadiness.test.ts` | — |
| VSA-04 | Thai result: no horizontal overflow, no page errors, no leftover English except names (Beyond Study Center, Department of Home Affairs, Transcript, LINE) | TH | 390 / 1440 | owner brief | PASS | screenshot script | ISS-030 |

## Visa Pathway

| ID | Feature | Lang | Viewport | Expected | Result | Evidence | Issue |
|---|---|---|---|---|---|---|---|
| VP-01 | Every branch reaches an outcome (11 outcomes) with Start Over | EN | D/T/M | `flowData` | PASS | e2e DFS | — |
| VP-02 | Back returns to previous question; Start Over to first | EN | D/T/M | — | PASS | e2e | — |
| VP-03 | Salary threshold current | — | — | FC-16 | BLOCKED | — | — |
| VP-04 | Thai explanations | TH | — | — | FAIL (English only) | code | ISS-001 |

## Articles & events

| ID | Feature | Lang | Viewport | Expected | Result | Evidence | Issue |
|---|---|---|---|---|---|---|---|
| CON-01 | Live published content loads | — | — | Supabase | BLOCKED (no env vars; reference site blocked) | — | ISS-015 |
| CON-02 | Home "Upcoming" excludes past events; includes ongoing | EN | D/T/M | section title | PASS (M, after fix) | e2e request + render | ISS-006 |
| CON-03 | `/events` type labels, ongoing, list | EN | D/T/M | inventory | PASS (M) | e2e | — |
| CON-04 | `/events` empty state | EN | D/T/M | — | PASS (M) | e2e | — |
| CON-05 | Error state distinguishable from empty | — | — | CLAUDE.md | FAIL (M) — error shown as empty/hidden | code + e2e | ISS-016 |
| CON-06 | `/articles` null tags, published filter in every request | EN | D/T/M | schema | PASS (M, after fix) | e2e | ISS-014 |
| CON-07 | Article detail from direct link; back to list | EN | D/T/M | — | PASS (M, after fix) | e2e | ISS-009 |
| CON-08 | Unknown slug | EN | D/T/M | — | PASS (M) render; HTTP 200 soft-404 | e2e + Workers preview | ISS-018 |
| CON-09 | Drafts not accessible | — | — | RLS | BLOCKED — queries filter `is_published=eq.true` (verified in request URLs, M); RLS not testable without a controlled unpublished fixture | — | — |
| CON-10 | Dates/timezone, Thai month format | TH | — | — | FAIL (English format) | code | ISS-017 |
| CON-11 | Image failure handling | — | — | — | NOT RUN (fixture has a broken cover URL; no assertion written) | — | — |

## Build & tooling

| ID | Check | Result | Evidence |
|---|---|---|---|
| BLD-01 | `npx tsc --noEmit` | PASS | 0 errors |
| BLD-02 | `npm run lint` | PASS | 0 errors, 5 pre-existing `<img>` warnings (after adding config; was unconfigured) |
| BLD-03 | `npm test` (Vitest) | PASS | 18/18 |
| BLD-04 | `npm run test:e2e` (Playwright, 3 viewports) | PASS | 84/84 |
| BLD-05 | `next build` without Supabase env | FAIL (pre-existing) | ISS-015 |
| BLD-06 | `next build` with dummy env | PASS | — |
| BLD-07 | `opennextjs-cloudflare build` | PASS | "OpenNext build complete" |
| BLD-08 | Local Workers preview (`wrangler dev` on the OpenNext output) smoke | PASS | `/`, `/articles`, `/events` 200; `/nope` 404; planner HTML present |
| BLD-09 | Deploy | NOT APPLICABLE (not permitted) | — |


## Planning hub (2026-09-25)

| ID | Scenario | Lang | Viewport | Expected / source | Result | Evidence | Issue |
|---|---|---|---|---|---|---|---|
| PLN-01 | Journeys A–F (study unsure → finder; student + English → ELICOS; employer checks; skilled 65+ no "competitive"; not listed → other options; not sure → comparison) | TH | 390 / 1440 | owner brief §31 | PASS (script on dev server) | `screenshots/planning-hub/` | — |
| PLN-02 | G: mobile — no hero per step, no breadcrumbs, start question + options fit one viewport (326 px of 844) | TH | 390 | owner brief §22 | PASS | `plan-mobile-9-visa-start.png` | ISS-030 (floating buttons) |
| PLN-03 | Study Finder profiles A–E, ties, age/city no effect, reasons traceable | — | unit | owner brief §26 | PASS | `tests/unit/studyFinder.test.ts` | — |
| PLN-04 | Explorer tree integrity, sources, banned phrases, facts from config | — | unit | owner brief §24–27 | PASS | `tests/unit/visaExplorer.test.ts` | — |
| PLN-05 | Age 15–70 validation, answers kept on Back, nothing sent over the network; DFS over every explorer branch | EN | e2e D/T/M | — | PASS (2026-09-25) | `tests/e2e/public.spec.ts` | ISS-034 |

### e2e run 2026-09-25 (production build, mocked Supabase, run from a copy outside iCloud — ISS-031)

- First full run (default workers): 78 passed / 9 failed — 3 readability checks still targeted the removed `#visa-pathway` section (test updated); 2 home-tab checks exposed ISS-034 (fixed); explorer DFS (×3) and WHM checklist (mobile ×1) timed out under load but passed when run alone.
- After the fixes, full run with `--workers=3`: **87 passed / 0 failed** (desktop 1440, tablet 768, mobile 390). The DFS reload wait was raised to 15 s. Viewport emulation only — not real devices.
