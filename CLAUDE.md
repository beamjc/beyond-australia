# Beyond Australia — functional QA workflow

## Goal
Systematically discover and test the existing website, fix confirmed implementation bugs, and retest. Keep the owner involved for product decisions, unclear intended behaviour, and changes affecting production. Do not add speculative features or redesign the site.

Reference URL: https://beyond-australia.jirachaiphat-c.workers.dev/
The reference site's functions have not yet been inspected. Treat this URL as production until the owner confirms otherwise. A local frontend can still connect to a production backend; verify the backend target before mutation tests.

## Known project setup
Based on the supplied package.json; recheck against the actual repository and lockfile.
- Next.js ^14.2.29, React ^18.3.1, TypeScript; Tailwind and Radix UI.
- react-hook-form and Zod; Supabase and TanStack React Query.
- Tiptap rich text editor; Framer Motion.
- OpenNext Cloudflare adapter and Wrangler.
- Existing scripts: dev = next dev; build = next build; start = next start; lint = next lint.
- preview = opennextjs-cloudflare build && opennextjs-cloudflare preview.
- deploy = opennextjs-cloudflare build && opennextjs-cloudflare deploy.
- No test script or testing framework is declared in the supplied package.json. Inspect the repository before concluding no tests exist.
- Determine the package manager from the lockfile. Do not silently upgrade the framework or dependencies.

## Start with discovery
1. Read existing project instructions, README, package scripts, route files, components, API handlers, schema/migrations, and existing tests. Preserve unrelated work.
2. Identify public and authenticated pages, roles, forms, calculations, searches, filters, uploads, editor flows, and external integrations actually present. Do not assume a feature exists because a dependency is installed.
3. Create docs/qa/coverage.md with one row per feature/scenario: ID, route, role, expected behaviour and its source, preconditions, status, evidence, related bug ID. Use NOT RUN, PASS, FAIL, BLOCKED, or NOT APPLICABLE.
4. Separate observed behaviour from intended behaviour. Derive expectations from documented requirements; label inferences and ask the owner when competing interpretations affect correctness.
5. Identify missing test accounts, backend access, environment variables, browser tools, and product decisions. Continue independent tests while blocked areas remain recorded.

## Environment and tools
- Work on an isolated QA branch. Preserve the current working tree; never reset or discard the owner's changes.
- Prefer a local or staging app backed by a dedicated test Supabase project, with representative synthetic data.
- Use an available browser automation tool for exploratory testing. Add Playwright Test to the repo if no suitable end-to-end runner exists, matching installed runtime constraints and current official documentation.
- Configure the test base URL explicitly. Mutation tests must refuse an unconfirmed target; do not default them to the public reference URL.
- Add suitable test scripts only after inspecting the repository. Use the existing package manager and retain the lockfile.
- Use test-only accounts for each discovered role. Load credentials through ignored environment files or a secret manager; never commit credentials, browser auth state, or service-role keys.
- If browser automation cannot run, record browser tests as BLOCKED. Static code review is not evidence that a user flow passed.
- Do not use the deploy script as a build check. The existing preview script builds and starts a preview; verify its bindings and backend target first.

## Test coverage
Apply each item only to discovered features; record absent features as NOT APPLICABLE.
- Navigation: internal links, menus, deep links, refresh, back/forward, unknown routes, and protected route access.
- Authentication: successful and invalid login, logout, session persistence/expiry, and role boundaries. Email-driven flows require a test inbox or mail capture environment.
- Forms: valid input, empty required fields, malformed input, boundaries, Thai/English text, submission errors, duplicate clicks, and successful persistence after reload.
- Data operations: create/read/update/delete on synthetic records; cancellation, confirmation, failure handling, and refreshing dependent lists/details.
- Search/filter/sort/pagination: matching/no results, combined controls, reset, boundaries, and stale cache after mutations.
- Calculations: independently calculate expected values from agreed rules; cover zero, boundaries, rounding, and units. Do not copy the implementation as the test oracle.
- Rich text and uploads: formatting, save/reopen, links/images, rejected files, and safe display of user content using harmless test fixtures in the test environment.
- Reliability: loading, empty, error, retry, and controlled network failure states; console errors and failed requests associated with each scenario.
- Access control: test anonymous access, each role, and two separate users' data against agreed permissions. Test backend enforcement in the test environment using ordinary user sessions, not an admin bypass. Hidden UI controls do not prove RLS correctness.
- Usability: exercise core flows at desktop and mobile viewport sizes; keyboard access, focus, dialogs, labels, and validation visibility. Record actual browser/viewports used; do not claim device coverage from viewport emulation alone.
- Deployment compatibility: run existing lint/build checks and a Cloudflare runtime preview smoke test where the environment permits. A Next.js development-server pass alone does not verify Cloudflare behaviour.

## Confirmed priority: login and admin publishing
The owner confirms that the site has login and that admins can post articles and events. Test these journeys first. Editing, deletion, drafts, scheduling, password reset, and registration are not yet confirmed; discover whether they exist before including them as requirements.

### Accounts and permissions
- Use separate browser contexts for an anonymous visitor, a test admin, and an authenticated non-admin if that role exists. Ask for a test fixture if the non-admin role cannot currently be exercised; do not silently mark permission checks passed.
- Test the actual login UI, not only preloaded authentication state: valid admin login, incorrect credentials, required-field validation, refresh/session persistence, logout, and protected deep links after logout.
- Use only a few intentional invalid-login attempts on dedicated test accounts; do not brute force or lock out real users.
- Verify anonymous and non-admin users cannot create, update, publish, or delete content through admin routes or the underlying API/database operations discovered in the repo. Run negative mutation checks only against the confirmed test backend. Assert both denial and unchanged data.
- Verify role enforcement uses trusted backend permissions. Changing client state or submitting an admin-like role value must not grant privileges. Use harmless fixtures in the test environment.
- Public read permissions for published content must follow the intended audience. If drafts exist, verify they cannot be read by unauthorised users via listings, direct URLs, or data endpoints.

### Articles
- Complete the admin login → create article → save/publish → public listing → article detail journey using synthetic content in the test environment.
- Discover required fields and test empty/invalid input, Thai and English text, rich text formatting, links, and cover/inline images where supported.
- Confirm successful content persists after reload, and a separate anonymous browser session sees the published version where public access is intended.
- Verify save failure produces a useful error without a false success message or losing entered content. Check duplicate submission behaviour.
- If implemented, test edit, draft/publish/unpublish, slug collision handling, preview, and deletion/cancellation. Verify public listings and details reflect changes without stale content. Do not invent missing lifecycle controls.

### Events
- Complete the admin login → create event → save/publish → public listing → event detail journey using synthetic content in the test environment.
- Discover actual fields, then validate required values, dates/times, location, images, descriptions, and registration links where supported.
- Establish the intended event timezone before judging date/time correctness. Check storage/display agreement and date boundaries; test end-before-start rejection if both fields exist. Test daylight-saving boundaries only where applicable.
- Verify list/detail consistency and persistence after reload. Exercise event filters, ordering, past/upcoming classification, status changes, editing, and deletion only if implemented.
- Do not follow through with real registrations, outbound notifications, or payments. Use test integrations, or record those steps as blocked.

### Priority completion evidence
Record separate results for admin login, article creation/public visibility, event creation/public visibility, and non-admin/anonymous write denial. A working admin UI alone does not prove backend permissions are correct. Retain IDs of uniquely labelled QA records and clean up only those records in the confirmed test environment.

## Test, fix, retest loop
1. Test high-value end-to-end journeys first, then work through the feature inventory.
2. For failures, record reproducible steps, expected/actual result, environment, severity, and screenshots/traces or concise logs in docs/qa/bugs.md. Remove personal data and tokens from evidence.
3. Fix confirmed implementation bugs within existing requirements. Keep changes small and retain existing component patterns.
4. Add a meaningful regression test where practical. Do not weaken assertions, skip failures, disable RLS, or replace real integrations with mocks merely to get a pass. Label mocked tests distinctly.
5. Retest the original failure and affected neighbouring flows. Use a separate reviewer subagent if available to review the fix and evidence; otherwise explicitly review it yourself.
6. Continue through independent scenarios without asking permission after every step. After three unsuccessful attempts on the same issue, record a blocker with attempted approaches, and continue other work.
7. Update docs/qa/progress.md after each feature group with completed work, remaining scenarios, commands/results, and the next action so another session can resume.

## Decision boundaries
May proceed: inspect code, add QA documentation/test tooling, run local tests, create and clean up uniquely labelled test data in a confirmed test environment, and make reversible fixes consistent with existing requirements.

Ask the owner when needed for: ambiguous business rules, changing scope or core UX, paid services, production deployment, production schema/data changes, or tests that send real communications or charge money. Prepare a concrete recommendation first. Honour any explicit approval already given for the exact scope.

On an unconfirmed/public production target, limit testing to read-only browsing and interactions with no submissions or external side effects. Do not send contact forms, create real leads/accounts, initiate password resets, or delete existing records. Never clean up records not created by this QA run.

## Completion and reporting
- Finish a bounded QA pass when every discovered scenario is PASS, FAIL, BLOCKED, or NOT APPLICABLE, with reasons and evidence. Do not leave NOT RUN entries unexplained.
- QA completed is not the same as release ready. Outstanding failures and blocked critical flows must remain visible.
- Report scenario counts, tested environments/roles/viewports, confirmed bugs and fixes, remaining issues, unverified assumptions, and specific owner decisions needed.
- Only claim tests that actually ran. Provide exact commands and outcomes, distinguish existing failures from regressions, and do not claim that testing guarantees the absence of bugs.
- Do not deploy unless explicitly authorised.
