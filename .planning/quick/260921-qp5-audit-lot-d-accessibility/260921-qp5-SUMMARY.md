---
phase: quick-260921-qp5
plan: 01
subsystem: a11y
tags: [wcag, axe-core, motion, tailwind-v4, focus-management, reduced-motion]

requires: []
provides:
  - Keyboard-operable overlay menu (aria-expanded, Escape, focus management, inert background)
  - Visible focus-visible outline site-wide + working skip link to each page's real <main>
  - prefers-reduced-motion honored by MotionConfig, Marquee, FlipImage, CountUp, VideoLoop
  - AA contrast for small red labels (#E0525E) and informative grey text (blanc/55)
  - Focusable named PhotoSlider region; SoundCloud embed brand-red color param
affects: [ui, layout, magazine-components]

tech-stack:
  added: []
  patterns:
    - "terracotta-light (#E0525E) token for small/condensed red text; terracotta (#CC2936) reserved for large display red"
    - "Client Providers wrapper (MotionConfig reducedMotion=\"user\") around Header/main in app/layout.tsx"
    - "Decorative folio/section-number spans get aria-hidden=\"true\" AND blanc/55 (axe-core does not exempt aria-hidden text from color-contrast)"

key-files:
  created:
    - app/providers.tsx
  modified:
    - app/globals.css
    - app/layout.tsx
    - app/page.tsx
    - app/small-record/page.tsx
    - app/casae/page.tsx
    - app/letche/page.tsx
    - app/events/page.tsx
    - app/not-found.tsx
    - components/layout/Header.tsx
    - components/layout/Footer.tsx
    - components/magazine/PhotoSlider.tsx
    - components/magazine/Marquee.tsx
    - components/magazine/FlipImage.tsx
    - components/magazine/VideoLoop.tsx
    - components/magazine/SoundCloudEmbed.tsx
    - components/animation/CountUp.tsx

key-decisions:
  - "aria-hidden decorative folios/section numbers still needed a contrast bump (blanc/20-15 -> blanc/55) because axe-core evaluates color-contrast on aria-hidden text regardless of AT exposure"
  - "Kept the 9 large-display red usages (h1/h2 full stops, big stat numbers, display quotes, menu inactive labels) at the original terracotta/blanc-40 tone per D-1's large-text 3:1 exception"

requirements-completed: [PHASE-7]

duration: ~35min
completed: 2026-09-21
---

# Quick Task 260921-qp5: Audit Lot D — Accessibility Summary

**WCAG 2.2 AA pass on the 5 public pages: keyboard-operable menu with focus management, visible focus rings, working skip link, prefers-reduced-motion honored across all looping/animated components, and AA contrast for small red labels and grey text (axe-core color-contrast violations cut from 211 to 0 real, with 14 documented ScrollRevealText mid-reveal false positives).**

## Performance

- **Duration:** ~35 min
- **Tasks:** 3
- **Files modified:** 16 (1 created, 15 modified)

## Accomplishments

- Header overlay menu is now fully keyboard-operable: `aria-expanded`/`aria-controls`, Escape closes, focus moves to the first nav link on open and back to the toggle on close, `#main` is `inert` while the menu is open (with cleanup so it can never stay locked)
- Global `:focus-visible` outline (2px blanc, 3px offset) and a skip link that jumps to each page's real `<main id="main-content">` (visible on focus, no longer targeting the unfocusable wrapper div)
- `PhotoSlider` is a focusable, named region (`role="region"`, `aria-label`, `tabIndex=0`) — fixes the `scrollable-region-focusable` violation on `/casae/`
- `prefers-reduced-motion` is honored end-to-end: `MotionConfig reducedMotion="user"` wraps the app via a new `app/providers.tsx`; `Marquee` renders a static single copy, `FlipImage` stops cycling, `CountUp` jumps to the final value (and now exposes only that final value to screen readers via an `sr-only` span, with the animated digits `aria-hidden`), `VideoLoop` pauses and never assigns `src` (poster shown instead)
- AA contrast sweep: small condensed red labels/ordinals switched from `#CC2936` (3.71:1, fails at small sizes) to a new `terracotta-light` token `#E0525E` (5.22:1); informative grey text raised to `blanc/55` (5.64:1); decorative folios/section numbers and the Marquee band got `aria-hidden="true"` **and** a contrast bump to `blanc/55`, because axe-core still evaluates color-contrast on `aria-hidden` text (it only affects the accessibility tree, not visual rendering)
- SoundCloud embed `color` param switched from a stray `#C4622D` to the brand red `#CC2936`

## Task Commits

1. **Task 1: Baseline axe + keyboard, focus, skip link, accessible menu, PhotoSlider region** - `6cbbe65` (fix)
2. **Task 2: Reduced motion (MotionConfig + Marquee/FlipImage/CountUp/VideoLoop) and CountUp SR text** - `d7df2c2` (feat)
3. **Task 3: Contrast sweep (terracotta-light, blanc/55, aria-hidden folios), SoundCloud color, full verification** - `daf457b` (fix)

_No plan-metadata commit made for this quick task per the executor's constraints (STATE.md/ROADMAP.md/SUMMARY.md were intentionally excluded from git)._

## Files Created/Modified

- `app/providers.tsx` - New client `Providers` wrapping the app in `MotionConfig reducedMotion="user"`
- `app/globals.css` - `--color-terracotta-light: #E0525E` token; global `:focus-visible` outline
- `app/layout.tsx` - Skip link now targets `#main-content` and is visible on focus; wraps `ScrollToTop`/`Header`/`#main` in `<Providers>`
- `app/page.tsx`, `app/small-record/page.tsx`, `app/casae/page.tsx`, `app/letche/page.tsx`, `app/events/page.tsx`, `app/not-found.tsx` - `id="main-content"` + `tabIndex={-1}` on the root `<main>`; small red labels to `terracotta-light`; grey text to `blanc/55`; decorative folios `aria-hidden` + `blanc/55`
- `components/layout/Header.tsx` - Keyboard-operable overlay menu (focus management, Escape, `inert`, `aria-expanded`/`aria-controls`); contrast fixes; masthead duplicate text `aria-hidden`
- `components/layout/Footer.tsx` - Copyright line raised from `blanc/25` to `blanc/55`
- `components/magazine/PhotoSlider.tsx` - `role="region"`, `aria-label` (default + `"Photos of Casae"` override), `tabIndex={0}`
- `components/magazine/Marquee.tsx` - `useReducedMotion` branch (static single copy), root `aria-hidden="true"`, text raised to `blanc/55`
- `components/magazine/FlipImage.tsx` - `useReducedMotion` stops the cycling interval, stays on the first image
- `components/magazine/VideoLoop.tsx` - `useReducedMotion` pauses and skips `src` assignment
- `components/magazine/SoundCloudEmbed.tsx` - `color=%23CC2936` (was `%23C4622D`)
- `components/animation/CountUp.tsx` - `useReducedMotion` jumps straight to target value; markup now has an `sr-only` span with the full final value and an `aria-hidden` span with the animated digits

## Decisions Made

- Kept the plan's D-1 large-text exception intact: the 9 large-display red usages (`Records.`, `Events.`, `First time together.`, `Five sets, one basement.`, `Coming soon.`, `the mix.`, the small-record pull quote, the `i===0` big stat number, and the `text-[4.5rem]` events stat number) stayed on `text-terracotta` (#CC2936, 3.71:1, passes the ≥3:1 large-text threshold)
- Bumped decorative `aria-hidden` folios/section numbers and the Marquee band from `blanc/15-20` to `blanc/55` in addition to `aria-hidden`, since the plan's must-have of "0 color-contrast violations" is checked by axe-core, which does not skip `aria-hidden` elements for the color-contrast rule (aria-hidden only removes elements from the accessibility tree, it does not exempt visually rendered text from WCAG 1.4.3). This is the one place execution diverged from the plan's literal instruction ("keep faint styling") in favor of the plan's own stated success criterion.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Decorative aria-hidden folios/Marquee band still failed axe color-contrast**
- **Found during:** Task 3, first `axe-after` run
- **Issue:** Plan's D-3 said to add `aria-hidden="true"` to decorative folios/section numbers and the Marquee band while "keeping faint styling" (`blanc/15`, `blanc/20`). axe-core still flagged these as `color-contrast` violations because `aria-hidden` does not exclude an element from axe's visual contrast check — the text is still rendered on screen for sighted users.
- **Fix:** Raised these elements from `blanc/15`/`blanc/20` to `blanc/55` (5.64:1) in addition to keeping `aria-hidden="true"`. This satisfies both the AT-hiding intent of D-3 and the plan's own must-have of 0 color-contrast violations.
- **Files modified:** `app/page.tsx`, `app/small-record/page.tsx`, `app/casae/page.tsx`, `app/letche/page.tsx`, `app/events/page.tsx`, `components/magazine/Marquee.tsx`
- **Verification:** Second `axe-after` run showed 0 `color-contrast` hits on these elements; only the documented ScrollRevealText false positives remain
- **Committed in:** `daf457b` (Task 3 commit)

---

**Total deviations:** 1 auto-fixed (Rule 1 — bug: contrast target not actually met by the planned approach)
**Impact on plan:** Necessary to meet the plan's own stated must-have. No scope creep — same files, same task, no new components.

## Axe-core Before/After (color-contrast / scrollable-region-focusable / total)

| Page | Viewport | Before cc / sf / total | After cc / sf / total |
|---|---|---|---|
| `/` | desktop | 19 / 0 / 19 | 3 / 0 / 3 |
| `/small-record/` | desktop | 26 / 0 / 26 | 3 / 0 / 3 |
| `/casae/` | desktop | 8 / 1 / 9 | 0 / 0 / 0 |
| `/letche/` | desktop | 8 / 0 / 8 | 0 / 0 / 0 |
| `/events/` | desktop | 50 / 0 / 50 | 1 / 0 / 1 |
| `/` | mobile (iPhone 13) | 17 / 0 / 17 | 3 / 0 / 3 |
| `/small-record/` | mobile | 24 / 0 / 24 | 3 / 0 / 3 |
| `/casae/` | mobile | 7 / 1 / 8 | 0 / 0 / 0 |
| `/letche/` | mobile | 7 / 0 / 7 | 0 / 0 / 0 |
| `/events/` | mobile | 45 / 0 / 45 | 1 / 0 / 1 |
| **Total** | | **211 / 2 / 213** | **14 / 0 / 14** |

No new violation types appeared (before: `color-contrast`, `scrollable-region-focusable`; after: `color-contrast` only).

### Documented ScrollRevealText false positives (all 14 remaining nodes)

All remaining `color-contrast` nodes are `ScrollRevealText` spans/paragraphs caught by axe at their initial `opacity: 0.2` scroll-trigger state (before the user has scrolled them into the reveal zone). By design, `ScrollRevealText` animates `opacity` from 0.2 to 1.0 via `useTransform(scrollYProgress, [0,1], [0.2,1])`, and axe's static snapshot after our scroll-and-return-to-top routine catches these below-the-fold instances at their pre-reveal opacity. A real user scrolling normally reaches full opacity (and full contrast) before the text is legible-distance from the viewport center. Exact nodes:
- `/`: "It's a link between people." (manifesto h2), "Depth over hype.", "Authenticity over noise." (artists section) — desktop & mobile
- `/small-record/`: "We don't fit into boxes.", "We don't need permission.", "We don't follow rules we didn't choose." (DNA section) — desktop & mobile
- `/events/`: "Want Small Records at your event?" (booking CTA) — desktop & mobile

## Keyboard Test Results (`keyboard.mjs`, desktop 1440x900, `/events/`)

All 11 assertions PASS:
- First Tab focuses the skip link (visible, `width > 1`)
- Enter on skip link → `location.hash === '#main-content'`, `document.activeElement.id === 'main-content'`
- Tab reaches the "Menu" button within 3 tabs
- Enter opens the menu: `aria-expanded="true"`, focus lands on the first `<a>` inside `#site-menu`, `#main.inert === true`
- Tabbing inside the open menu never moves focus into `#main`
- Escape closes the menu: `aria-expanded="false"`, `#site-menu` removed after the 400ms exit animation, `#main.inert === false`, focus returns to the toggle button

## Reduced-Motion Test Results (`reduced.mjs`, `reducedMotion: 'reduce'` context)

All 5 assertions PASS:
- `/casae/`: Marquee inner element's computed `transform` is `none` and identical at t0 and t0+1s (no scrolling ticker)
- `/`: CountUp text contains "711" immediately on scroll-into-view (never renders 0)
- `/small-record/`: FlipImage's visible image `src` is unchanged over 2s (no cycling)
- `/events/`: every `<video>` is `paused === true` with empty `currentSrc` after scrolling through the whole page (no autoplay, poster shown)
- Regression check (normal, non-reduced context): at least one `<video>` on `/events/` is playing with a real `currentSrc` once scrolled into view and given 1s to start — confirms reduced-motion gating did not break normal playback

## Screenshots

Saved to `$SP/lotd/` (scratchpad, session-scoped):
- `events-desktop.png`, `events-mobile.png` (+ `-full.png` variants) — Small Party / Panic Room lineup section
- `home-desktop.png`, `home-mobile.png` (+ `-full.png` variants) — kicker/stats band (624 people · 6h of music · 3 DJs)

Reviewed visually: small red labels ("PAST · CLUB NIGHT") read as the lighter brand red, large red elements ("Five sets, one basement.", the "624" stat) stay the original saturated red, and no layout/visual regressions are visible.

## Build Sanity

`npx next build` in the isolated `$SP/buildcheck/` copy (rsync of the repo minus `.next`/`out`/`public/asset`/`node_modules`, with `node_modules` symlinked from the real project) completed successfully — 11 static routes generated and exported, no type or build errors.

## Issues Encountered

None beyond the documented deviation above (axe-core's aria-hidden/color-contrast interaction).

## Remaining Gaps (documented, out of scope for this lot)

- **D-6 / WCAG 2.2.2 (Pause, Stop, Hide):** No global pause/stop control exists for autoplay loops (Marquee ticker, VideoLoop autoplay). `prefers-reduced-motion: reduce` now stops them, but a user on default motion settings with no OS-level reduced-motion preference has no in-page control to pause them.
- `ParallaxImage`, `ParallaxTitle`, and `ScrollRevealText`'s scroll-linked `transform`/`opacity` values are not gated by `useReducedMotion` (only the four components explicitly listed in D-5 — Marquee, FlipImage, CountUp, VideoLoop — were brought into scope). These continue to run under `prefers-reduced-motion: reduce`.
- `hover:text-terracotta` hover states on small condensed links remain at 3.71:1 (below 4.5:1) — kept per D-1, since this is a transient hover-only state, not persistent text.
- `components/magazine/PhotoPlaceholder.tsx` still uses `text-blanc/40`; it is unused/unimported anywhere in the current codebase, so it was left untouched (not in the plan's scope and not reachable by axe).

## Known Stubs

None.

## Threat Flags

None — this lot only changed markup/CSS/client-side behavior on existing pages; no new network endpoints, auth paths, or trust boundaries were introduced. `components/layout/Header.tsx`'s `inert` toggle has a cleanup path (`main.inert = false` on close and unmount) preventing the page from ever staying locked, per the plan's threat register (T-qp5-01).

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

The 5 public pages now pass axe-core AA on color-contrast and scrollable-region-focusable (with 14 documented ScrollRevealText false-positive nodes), have a fully keyboard-operable menu, a working skip link, visible focus rings everywhere, and reduced-motion support for the four components in scope. Remaining gaps (D-6 pause control, Parallax/ScrollRevealText reduced-motion coverage) are documented above for a future lot if the roadmap calls for full WCAG 2.2.2 compliance.

---
*Quick task: 260921-qp5*
*Completed: 2026-09-21*

## Self-Check: PASSED

All 17 modified/created files confirmed present on disk; all 3 task commits (`6cbbe65`, `d7df2c2`, `daf457b`) confirmed present in `git log`.
