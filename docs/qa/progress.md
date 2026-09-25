# QA progress & resume notes

Last updated: 2026-09-23 · Branch `claude/tender-tesla-7g4bgt` · Not merged, not deployed.

## Done (pass 1)

- CLAUDE.md: Thai copy review gate added (no autonomous Thai rewrites).
- Test harness: Vitest (unit) + Playwright (e2e, 3 viewports) with mocked Supabase.
- Thai review batch 1 prepared: `docs/qa/thai-review-budget-planner.md` + 10 screenshots in `docs/qa/screenshots/budget-planner/`. **Not applied.**
- 12 non-copy fixes (see `changes.md`), each retested.
- Reports: `coverage.md`, `issues.md`, `factual-checks.md`, `changes.md`.

## How to run

```bash
npm ci
npm test                 # Vitest unit tests
npm run test:e2e         # builds + starts on :3100 with a dummy Supabase URL; mocks content
npx playwright test --project=mobile   # one viewport
```

Live content needs real `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` (public anon key only) in `.env.local` (git-ignored). Without them `next build` fails (ISS-015).

## Blockers in this session

1. **Network policy** denied `beyond-australia.jirachaiphat-c.workers.dev` (reference site), `immi.homeaffairs.gov.au`, `www.ato.gov.au`, `www.fairwork.gov.au`, `beyondstudycenter.com`, `line.me`. → no live-site comparison, no official-source verification, no link resolution checks. Fix: allow these domains in the cloud environment's Network access settings.
2. **No Supabase env vars** → live articles/events and RLS not tested (mocked only).
3. Cloudflare connector not authorised — not needed (no deploy).

## Tool language inventory (for ISS-001)

| Component | Language today |
|---|---|
| BudgetStudyPlanner | Thai only |
| PostcodeChecker, TimelineSection, TopUniversities, StudyOptionsForm, FinancialCalculator, SavingsCalculator, VisaStrengthAssessment, VisaPathwaySection | English only |
| ChecklistSection, FAQ2026 | Fixed mixed Thai/English |
| Shell (Navbar, Hero, Services, section headers, CTA, Footer, floating buttons, articles/events pages) | Follows EN/TH switch |

## Next steps (in order)

1. **Thai batch 1 (Budget Planner)** — when the editor returns the file: move all planner strings into `src/i18n/translations.ts` (EN + TH), apply only approved Thai, then apply the held fix for ISS-010 (needs BSP-053) and the ISS-013 rounding answer. Retest with `-g "Budget Study Planner"` and retake screenshots.
2. Owner decisions still open: ISS-003 (visa "pass %" — calculation explained in issues.md), ISS-011/012, real reviews (ISS-004), confirm Supabase env in Cloudflare (ISS-015).
   Deferred by owner 2026-09-24: real reviews / Google API; sending batch 1 to the Thai editor.
   Decided 2026-09-24: keep budget promises (ISS-023); keep university rankings as is (ISS-030); leave ⚠️ claims BSP-001/040/062/084/087.

3. Re-run `factual-checks.md` with sources reachable; update constants + unit tests only for unambiguous, source-backed changes.
4. Next review batches (suggested order by visitor impact): Visa Pathway → Financial Calculator → Savings Calculator → Postcode Checker (with ISS-019) → Study Options → Visa Strength → Top Universities → Timeline/Checklist/FAQ → events/articles states (ISS-016/017/018).
5. Remaining NOT RUN rows in `coverage.md` (back/forward, full keyboard focus audit, FIN-03, SAV-03, OPT-04, CON-11).

## Google reviews option (asked 2026-09-24, not built)

- **Google Places API (Place Details, `reviews` field):** official; returns at most 5 reviews chosen by Google (not selectable), needs a Google Cloud API key with billing, must show Google attribution and the reviewer's name/photo/link, must not edit review text, and caching is restricted. Call it from the server (Cloudflare Worker route) so the key isn't exposed; needs a Place ID and network access to `places.googleapis.com`.
- **Manual copy** into `src/data/reviews.ts` (current design): free, you choose the reviews, but it doesn't update itself. Show source + link for each review.
- **Third-party widgets:** add an external script/tracking, which CLAUDE.md asks us to avoid.

## Session 2026-09-25 — owner-requested redesigns (branch `qa/study-tools-redesign`)

Done (each with unit tests, Thai review file, screenshots):
1. Budget Planner: one averaged university card (`he-avg`, A$41,667/yr) + owner note. `thai-review-budget-planner.md` BSP-130/131.
2. Visa Readiness Check (was Visa Strength): questions → result, grouped factors; scoring unchanged. `thai-review-visa-readiness.md`.
3. Savings planner: one calculator, visa type as input; fixed ISS-032/033. `thai-review-savings.md`.
4. Planning hub: Study Pathway Finder (scored, explainable) + Visa Options Explorer (data tree, official links); old Study Options and Visa Pathway section removed. `thai-review-planning-hub.md`.

Environment: the repo's `node_modules` is partly evicted by iCloud (ISS-031); `next dev`, `next build`, lint and e2e were run from a copy outside iCloud (`npm ci`). Vitest runs fine in place.

Next steps:
- External Thai editor: review DRAFT rows in the four review files before merging.
- Owner decisions: see "Decisions needed" in the session report (FX 23 vs 23.48; UNVERIFIED visa facts FC-16…23; "ดูหลักสูตรที่เหมาะกับฉัน" destination; floating buttons on mobile ISS-030; "ผ่าน" wording in skilled result).
- OpenNext Cloudflare build/preview smoke check not run this session.
