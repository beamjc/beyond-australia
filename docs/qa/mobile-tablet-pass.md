# Mobile & tablet usability pass (2026-10-05)

Scope: phones (390 × 844) and tablets (768 × 1024), Thai UI. **Desktop (≥ 1024 px, Tailwind `lg`) intentionally unchanged.** No visible copy added or reworded.

## How it was tested

- The live site (`beyond-australia.jirachaiphat-c.workers.dev`) was confirmed to serve current `main` (text from the latest commit, `f4d2751`, is in the live HTML). The browser in this environment cannot trust the egress proxy's certificate (TLS checks were not bypassed), so interactive tests ran on a **local production build of `main`**, with articles/events mocked. Viewport emulation in Chromium 141, not real devices.
- Desktop unchanged: every WHM/Study tab + the full page at 1440 × 900, EN and TH, were screenshotted before and after and compared pixel by pixel → **identical**. The only differing regions also differ between two runs of the unchanged code (a checklist animation and a blinking text caret).

## Findings (before)

| Area | Phone | Tablet | Problem |
|---|---|---|---|
| Study tab bar | 5 tabs in a 981 px row on a 358 px screen | 981 px on 736 px | Most tabs off-screen; visitors must discover sideways scrolling |
| WHM tab bar | 605 px on 358 px | fits | Last tabs off-screen on phones |
| Floating LINE/Facebook buttons | — | — | Fixed over the right edge, covering right-aligned numbers and slider ends (e.g. Savings summary "A$60,0…") |
| Savings calculator | 3.0 screens; result card below 5 input cards | 2.2 screens | Every input change needs ~2 screens of scrolling to see the result |
| Top Universities | 3.8 screens; ~10 subject chips stacked one per line before any result | 1.7 | Long scroll before results; rank column repeats the "Australia #n" badge and squeezes text |
| FAQ categories, uni sort, THB/AUD | 28–32 px tall | same | Small tap targets |
| Sliders | 20 px handles | same | Hard to grab with a finger |
| Budget Planner | 3.9 screens | 2.4 | Already has a floating result bar — no change needed |
| Planning hub tools | ≤ 1.4 screens per step, view stays at top | — | OK |

## Changes (phones/tablets only)

1. **Tab bars** (WHM, Study): grid below `lg` — 2 columns on phones, 3 (Study) / 4 (WHM) on tablets — so every tab is visible; tabs ≥ 44 px tall.
2. **Floating LINE/Facebook buttons**: slide away while scrolling down, return on scroll up, near the top, or at the page end (`useHideOnScrollDown`). Desktop: always shown, as before.
3. **Savings**: compact result bar (expected savings per year + shortfall/surplus) appears while the inputs are on screen and the result card is not; tap → jumps to the full result. Reuses existing labels.
4. **Top Universities**: subjects become one swipeable row; the duplicate rank column is hidden on phones (< 640 px). Phone panel 3.8 → 3.4 screens, and results start right after the subject row.
5. **Tap targets**: FAQ category chips, university sort buttons, Budget Planner THB/AUD toggle ≥ 40 px; slider handles 28 px; Savings income slider taller.

## Verification

- New `tests/e2e/mobile.spec.ts` (phone + tablet; desktop asserts the old behaviour where relevant): all tabs on screen and ≥ 40 px; Savings bar appears and jumps to the result; floating buttons tuck/return; university subjects in one row with no page overflow.
- Full e2e suite: 109 passed + the 2 fixed tests re-run (9 skipped = phone-only tests on desktop). Unit tests, `tsc`, lint: pass. Desktop pixel comparison: identical.
- Screenshots: `docs/qa/screenshots/mobile/`.

## Not changed / follow-ups

- Budget Planner (3.9 screens on phones) is long mainly because of content (onshore notice, five input groups); its existing result bar covers the scrolling problem.
- Visa Readiness (2 screens: 8 sliders then a results button) and Checklist/FAQ (accordion content) left as is.
- Tablet landscape (≥ 1024 px) uses the desktop layout by design.
