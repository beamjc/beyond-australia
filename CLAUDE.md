# Beyond Australia — public QA, Thai language, and usability

## Mission and authority
Test and improve the public bilingual site for Thai visitors considering Australia through Work and Holiday (subclass 462) or study. Help visitors understand options and reach Beyond Study Center through existing consultation links.

The owner authorises autonomous decisions on public-site UX (not Thai wording; see "Thai copy review gate" below). Implement reasonable, reversible improvements without asking for approval for each edit. Fix bugs, improve layout, navigation, validation behaviour, mobile usability, and accessibility. Preserve the brand, bilingual experience, feature set, and business purpose. Work through a bounded pass, not an endless redesign.

Admin, login, authentication changes, publishing, account setup, database mutations, and schema/RLS changes are OUT OF SCOPE for this pass. All existing accounts are admins by design according to the owner's code review; do not invent a non-admin role or change that model.

Reference site: https://beyond-australia.jirachaiphat-c.workers.dev/
The inventory below comes from the owner's code review, not a completed live test. Verify it against the repository and browser. Do not claim features pass merely because their code exists.

## Public inventory
- `/`: hero, services, proof statistics, reviews carousel, CTA banner, footer, floating LINE/Facebook links, remembered EN/TH language selection.
- Working Holiday section: Timeline, stage-based Checklist, Postcode Checker backed by `src/data/postcodeData.ts`, FAQ 2026.
- Study section: Budget Study Planner (`src/lib/CalculationEngine.ts`), Top Universities, multi-step Study Options questionnaire, Financial Calculator, Savings Calculator with LINE/Facebook sharing, Visa Strength Assessment sliders.
- Visa Pathway decision tree: employer sponsorship, points-tested, WHM, student options.
- Home previews of published articles and events from Supabase.
- `/articles`, `/articles/[slug]`, `/events` with date ordering and online/offline/hybrid labels.
- Study Options only displays a result. It does not submit or save visitor answers. Consultation links go to beyondstudycenter.com, LINE, or Facebook.
- `src/components/study/CourseFinder.tsx` is unused. Do not activate or spend QA effort on it unless actual routing contradicts this inventory.

## Setup and execution
1. Read project instructions, README, routes, translation resources, calculations, package scripts, lockfile, and existing tests. Preserve unrelated changes and work on a dedicated branch.
2. Use the lockfile's package manager. No tests/test script exist according to the owner's review; verify before adding tools. Install Playwright Test and Chromium if needed. Add a lightweight unit runner for pure calculation tests only where useful.
3. Configure Playwright to start the local app using its webServer configuration. Discover the actual Supabase environment-variable names. Use only the public publishable/anon key for published-content reads; no admin credentials or service-role key are needed.
4. Do not block the whole task on Supabase access. Run client-only tools and clearly labelled mocked content tests while recording real content integration as BLOCKED if unavailable. Mocks are not proof of live integration or RLS correctness.
5. Keep credentials, browser state, personal data, and sensitive logs out of Git. Do not print environment values.
6. Test locally or on preview. Reading published production content is within scope; do not write to Supabase, submit external inquiries, send LINE/Facebook messages, or post shares. Verify link targets/payloads without sending anything.
7. Existing scripts from the supplied package.json: dev = next dev; build = next build; lint = next lint; preview = opennextjs-cloudflare build && opennextjs-cloudflare preview; deploy = opennextjs-cloudflare build && opennextjs-cloudflare deploy. Recheck against the actual repo. Use build/preview checks, never deploy as a test.
8. No Cloudflare, Gmail, Google Calendar, or Morningstar connector authorisation is needed for this scoped work. If a specific test is blocked, explain the exact dependency and continue independent work.
9. If browser tools are unavailable, mark interactive tests BLOCKED and continue code/copy review. Never report browser tests as executed when they were not.

## Thai copy review gate (overrides the wording autonomy below)
Do NOT rewrite, replace, or reword visible Thai copy autonomously. An external Thai editor reviews all Thai wording suggestions before they are applied.
- Put Thai suggestions in a review file (e.g. `docs/qa/thai-review-<feature>.md`) with: string ID and source file, where the text appears and what the user is doing, English text, current Thai text, suggested Thai text, and variables/length constraints. Add desktop and mobile screenshots where possible.
- Apply Thai suggestions only after the editor has approved them, and only the approved wording. Record the approval batch in `docs/qa/changes.md`.
- Review batches go one feature at a time. Batch 1 = Budget Study Planner.
- Allowed without review: functional bug fixes, non-copy usability/accessibility fixes (layout, targets, focus, ARIA attributes, overflow, state), and moving existing strings into translation keys without changing their Thai wording. New visible Thai text needed for a fix must be proposed in a review file first; until approved, prefer fixes that need no new Thai copy.
- English copy changes that would require matching Thai changes wait for the same review.
- The style rules in the next section are the criteria for writing suggestions, not permission to apply them.

## Thai language and bilingual style
Review every public UI string: headings, tabs, field labels, placeholders, options, helper text, validation, buttons, empty/loading/error states, calculated results, tooltips, pathway outcomes, and contact/share copy.

- Write natural contemporary Thai for a first-time visitor, not literal translations from English. Use short, concrete sentences and everyday vocabulary; keep technical terms when necessary and explain them briefly.
- Use a warm, clear, professional tone. Avoid bureaucratic wording, unnecessary English, hype, pressure, and repeating ครับ/ค่ะ on every label. Use a consistent voice.
- Explain what a tool helps the visitor decide, what information to enter, and what its result means. Buttons should describe the real next action. For example, use ดูผลแนะนำ rather than ส่งข้อมูล when nothing is sent; use สอบถามผ่าน LINE when the button opens LINE.
- Candidate wording such as วางแผนงบเรียนต่อ, ประมาณการเงินเก็บ, and ปรึกษาเรื่องเรียนต่อ is illustrative, not mandatory. Choose text that fits the actual function.
- Distinguish budget, tuition, living costs, funds to demonstrate, gross income, tax, and estimated savings. Make AUD/THB, monthly/yearly periods, hours/week, and conversion assumptions explicit.
- Preserve legal and factual meaning during copy edits. Explain estimates as estimates. Avoid visa-approval guarantees, fabricated success rates, and unsupported promises of savings, jobs, or eligibility.
- A slider-based Visa Strength Assessment is not a validated approval probability. Inspect the model; make its limitations and self-assessment nature clear without inventing probability claims or silently changing scoring weights.
- Keep English and Thai aligned. If an English concept changes for clarity, update both languages. Check mixed-language fallbacks, untranslated strings, Thai wrapping, font readability, dates, and number/currency formatting.
- Preserve entered answers and results when switching language unless a documented requirement says otherwise. Check language persistence across refresh and public-page navigation.
- Do not invent reviews, proof statistics, partner credentials, university claims, fees, or business promises. Flag unsupported claims.
- Record representative before/after examples and reasons in the change log. Thai copy changes require external editor approval first (see the review gate above).
- Review displayed Supabase article/event text, but do not rewrite database records. Put suggested editorial corrections in the report. UI labels and rendering code remain editable.

## UX decision rules
Autonomously improve issues supported by browser observation or clear code evidence: confusing hierarchy, unclear CTAs, small targets, horizontal overflow, hidden validation, weak contrast, lost state, unclear units, inconsistent controls, and poor result explanations. Reuse existing Tailwind/Radix component patterns and brand styling.

Show useful results before consultation prompts, preserve optional contact actions, and avoid adding lead capture, tracking, new personal-data storage, accounts, or obstructive popups. Keep consultation destinations unchanged unless the owner confirms a replacement; report broken/ambiguous links.

Ask only when a material business decision is unresolved: changing service offers or contact destinations, removing a major feature, adding paid services/data collection, altering unsupported financial/scoring assumptions, or deploying. Prepare a concrete recommendation and continue other work. Do not ask the owner to decide routine spacing. Thai wording goes through the external editor review gate.

## Required coverage
Create `docs/qa/coverage.md`: scenario ID, feature, language, viewport/browser, expected behaviour/source, result, evidence, related issue. Use NOT RUN, PASS, FAIL, BLOCKED, NOT APPLICABLE.

### Navigation and home
- All section links/tabs, deep links, back/forward, refresh, sticky navigation if present, carousel controls, CTA destinations, footer, floating buttons, and page-not-found states.
- Working Holiday's four tabs and Study's six tabs are reachable and legible on mobile. Keyboard navigation, visible focus, form labels, error associations, slider keyboard controls, and reduced-motion behaviour.
- Both languages at representative mobile (390px), tablet (768px), and desktop (1440px) widths. Cover every tab in both languages; repeat full journeys at mobile and desktop. Do not call viewport emulation real-device testing.

### Working Holiday tools
- Timeline order and clarity; checklist stage navigation, checking/unchecking/reset, and persistence only if implemented.
- Postcodes as strings: blank, whitespace, nonnumeric, too short/long, unknown valid-format values, boundary entries, and leading zeros. Do not destroy leading zeros through numeric conversion.
- Distinguish postcode-list membership from full specified-work eligibility. Check any location/work-type/date conditions against official sources before making claims. Do not invent those conditions from memory.
- FAQs: expand/collapse, bilingual completeness, dates, links, and factual freshness.

### Study tools
- Budget Planner: valid, zero/negative, blank, excessive and boundary values; age, English level, goal combinations; no-result states; THB/AUD conversion and rounding; changes recalculate consistently without double conversion. Derive expected values independently from documented assumptions rather than copying the implementation.
- Top Universities: readable bilingual content, working links/images, and unsupported claims flagged.
- Study Options: required answers, next/back, answer preservation, result consistency, restart, and appropriate labels. Inspect network behaviour and code to confirm answers are not transmitted or saved; preserve that behaviour.
- Financial Calculator: tuition/living/travel components, partner/children toggles and counts, zero dependants, stale hidden values, invalid inputs, units, totals, and clear breakdown. Separate budgeting estimates from official financial-evidence requirements.
- Savings Calculator: WHM/student scenarios, income, tax assumptions, expenses, periods, negative savings, boundary inputs, and comparison consistency. Verify LINE/Facebook URL encoding, Unicode, intended shared content and fallback where implemented, without sending shares.
- Visa Strength Assessment: slider endpoints/keyboard input, result updates, consistency, understandable explanations, and appropriate presentation of uncertainty. Do not treat a heuristic score as a legal eligibility decision.

### Visa Pathway
- Traverse every reachable branch/outcome, back/reset, changed earlier answers, and stale downstream state. Check that Thai explanations and next steps match the selected route without guaranteeing eligibility.

### Public articles and events
- Published-content loading, empty/error states, retries if implemented, previews, list/detail links, unknown article slugs, bilingual fallback, long titles/content, and image failures.
- Event dates/order, ongoing entries, online/offline/hybrid labels, location text, and explicit timezone where needed. Use a controlled clock and mock fixtures for date boundaries; distinguish those results from real published-content reads.
- Confirm public queries filter published content. Without a controlled unpublished fixture, do not claim full verification that drafts cannot be accessed. Record that limit without expanding into admin or RLS work.

## Facts, calculations, and official sources
Visa, specified-work, financial-evidence, work-rights, and tax information is time-sensitive. Inspect the code for assumptions and dated values. Verify proposed factual corrections against current primary sources: Australian Department of Home Affairs for immigration and the Australian Taxation Office for tax. Use other official providers for their own fees; identify exchange rates as dated rates or explicit planning assumptions.

For each factual check, record the exact source URL, date checked, rule/effective period, current site value, and proposed correction in `docs/qa/factual-checks.md`. Check nationality, visa subclass, work type, tax year, and other applicable conditions before applying a rule. If sources conflict, are inaccessible, or require legal interpretation, mark UNVERIFIED and flag the decision; continue other work. Never claim a whole calculator is accurate solely because its arithmetic tests pass.

Unambiguous source-backed corrections may be implemented with evidence and regression coverage. Business-specific estimates, scoring weights, and ambiguous eligibility interpretations require a recommendation to the owner. Do not remove important qualifications simply to shorten Thai copy.

## Workflow and completion
1. Inventory actual features and copy, then create a bounded test plan. Prioritise broken journeys/calculations, misleading wording, and mobile friction before cosmetic polish.
2. Test → record evidence → fix/improve → retest. Add meaningful regression tests for calculations, stateful journeys, and confirmed bugs; do not create brittle tests that merely mirror implementation or snapshot every sentence.
3. Use a reviewer subagent if available for independent Thai/UX and regression review. Otherwise perform a separate review pass yourself. Avoid simultaneous edits to the same files.
4. Maintain `docs/qa/issues.md`, `docs/qa/changes.md` (including before/after Thai examples), and `docs/qa/progress.md`. Record next steps so a later cloud session can resume.
5. After three unsuccessful attempts on an issue, record the blocker and continue independent scenarios. Do not lower assertions, suppress real errors, or claim mocked results as live passes.
6. Run relevant tests, lint/type checks supported by the repo, Next.js build, and OpenNext Cloudflare build/preview smoke checks where possible. Report environment restrictions and pre-existing failures separately. Do not use deployment to verify build compatibility.
7. Finish when all scoped scenarios have a result or an explicit blocker, priority improvements are implemented/retested, and the report is ready. Do not keep generating cosmetic work indefinitely.
8. Report tested scope/languages/viewports, actual command results, fixes, Thai/UX improvements, official-source checks, remaining bugs, unverified integrations, and decisions needed. Include useful before/after screenshots and reproduction evidence without secrets.
9. Commit only task-related code, lockfile/test changes, and documentation to the QA branch as appropriate. Prepare reviewable changes; do not merge or deploy without explicit authorisation. Report honestly if Git access prevents committing or pushing.
