---
phase: quick-260922-naw
plan: 01
subsystem: lab (local-only test route)
tags: [lab, film-contact-sheet, lightbox, scroll-animation, motion, playwright]
dependency-graph:
  requires: []
  provides:
    - "app/lab route (noindex, excluded from prod via .vercelignore)"
    - "components/lab/frames.ts (FILM_FRAMES, FILM_PICKS)"
    - "components/lab/ContactSheet.tsx + FilmLightbox.tsx"
    - "components/lab/DevelopingPhoto.tsx"
  affects:
    - ".vercelignore"
tech-stack:
  added: []
  patterns:
    - "useSyncExternalStore + matchMedia for SSR-safe responsive chunk sizing"
    - "createPortal to document.body for a modal that must live outside an inert #main"
    - "useTransform callback deciding 'none' internally to keep a MotionValue-bound CSS property from being silently ignored on plain-string override"
key-files:
  created:
    - components/lab/frames.ts
    - components/lab/ContactSheet.tsx
    - components/lab/FilmLightbox.tsx
    - components/lab/DevelopingPhoto.tsx
    - app/lab/layout.tsx
    - app/lab/page.tsx
    - public/images/panic-room/film/*.jpg (22 files)
  modified:
    - .vercelignore
decisions:
  - "Backdrop fade layer needs pointer-events-none, otherwise it swallows the click meant to close the lightbox"
  - "Drive filter through the MotionValue in all cases (branch on reduced-motion inside the useTransform callback) rather than swapping style.filter between a MotionValue and a literal string across renders"
metrics:
  duration: "~55 min"
  completed: 2026-09-22
---

# Quick Task 260922-naw: Lab test page — film contact sheet and Développement Summary

Local-only `/lab` route comparing two treatments for the Panic Room film roll — a realistic contact sheet with hand-drawn red felt-tip picks and a working lightbox, and a scroll-driven "Développement" section that brings the 5 picks from latent grayscale to true color — built entirely with `motion/react` scroll hooks and verified end-to-end with Playwright (55/55 assertions, desktop + iPhone 13 + reduced-motion).

## What was built

**Media (Task 1)** — 22 frames from the Panic Room roll (frame numbers 04–29, skipping gaps), copied from `~/Downloads/PANIC ROOM/` (root folder + the "photo pour carrouselle" subfolder for 08/09/14) into:
- `public/asset/panic-room/film/NN.jpg` — untouched originals, gitignored
- `public/images/panic-room/film/NN.jpg` — 1600px-long-edge, quality 82, progressive, EXIF-stripped, all confirmed 3:2 landscape (1600×1060, ratio 1.509)

`components/lab/frames.ts` exports `FILM_FRAMES` (22, ordered) and `FILM_PICKS` (the 5 picks: 08, 10, 14, 16, 25 with real captions) and marks the 5 fogged/blank frames (05, 13, 18, 26, 29) — confirmed visually via a montage before committing.

**Route shell** — `app/lab/page.tsx` (noindex/nofollow metadata, title "Lab") + `app/lab/layout.tsx` (scopes `lazyDog.variable` for `font-dog`, used by the felt-tip star/exclaim marks). `.vercelignore` gained `app/lab`; `app/sitemap.ts` untouched.

**ContactSheet + FilmLightbox (Task 2)** — Film strips chunked 6-per-row at lg+, 4-per-row below (via a `useChunkSize` hook on `useSyncExternalStore` + `matchMedia('(min-width:1024px)')`, SSR-safe), horizontal-scrolling on mobile (`snap-x snap-mandatory`, contained — no page-level overflow). Each strip has SVG-data-URI sprocket-hole bands top/bottom, a repeating mono "SMALL 400 · PANIC ROOM 11.09.26 ·" edge line, and a per-frame "NN ▸ NNA" marking. The 5 picks carry an irregular, overshooting hand-drawn red circle (`FeltCircle`, per-frame rotation variance) plus a small star/exclaim in `font-dog`; the 5 fogged frames carry a red X (`FeltCross`) and are plain non-interactive `<div>`s (no tabindex, no focusable children). Clicking/Enter on a pick or normal frame opens `FilmLightbox`, portaled to `document.body` (required since it must live outside `#main`, which becomes `inert` while open). Prev/Next and ←/→ skip fogged frames (`step()` walks with wraparound); Esc/Close/backdrop-click close; focus returns to the button of the last-viewed frame.

**DevelopingPhoto (Task 3)** — `useScroll({ target: ref, offset: ['start end', 'center center'] })` drives a `useTransform` that maps scroll progress to `grayscale/brightness/contrast/sepia`, animating only the wrapper `div`'s `filter` (never the `<img>`, never an overlay). Wired into the page as `FILM_PICKS.map(f => <DevelopingPhoto frame={f} />)` with generous vertical spacing so each pick can reach viewport center.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Backdrop click didn't close the lightbox**
- **Found during:** Task 2 self-verification (before committing)
- **Issue:** The decorative backdrop-fade `motion.div` (`absolute inset-0 -z-10`) sat on top of the container in paint order and intercepted all pointer events, so `e.target === e.currentTarget` on the container's `onClick` never matched — clicking anywhere on the backdrop was silently swallowed.
- **Fix:** Added `pointer-events-none` to the decorative fade layer so clicks pass through to the container.
- **Files modified:** `components/lab/FilmLightbox.tsx`
- **Commit:** `8467d91`

**2. [Rule 1 - Bug] `prefers-reduced-motion` didn't suppress the develop filter**
- **Found during:** Task 3 Playwright verification (`reduced-motion` context: all `[data-develop]` filters stayed full grayscale instead of `none`)
- **Root cause:** The original code swapped the whole `style` prop between `{ filter }` (a `motion` `MotionValue`) and a plain string `'none'` depending on `useReducedMotion()`. `motion` binds a CSS property to its `MotionValue`-driven render path the first time it sees one; a later render passing a literal string for the same key is silently ignored by that internal fast path, so the DOM's `filter` never actually updated even though React's `reduce` state was correctly `true` (confirmed via console + `matchMedia` — not a hook-timing bug).
- **Fix:** Keep `filter` always `MotionValue`-driven; the `useTransform` callback itself now returns `'none'` when `reduce` is true (or when scroll progress ≥ 0.995), so the CSS property's binding type never changes across renders.
- **Files modified:** `components/lab/DevelopingPhoto.tsx`
- **Commit:** `ebfa58f`

**3. [Rule 1 - Test precision] Mobile "centered" filter check off by ~0.1% due to smooth-scroll**
- **Found during:** Task 3 Playwright verification
- **Issue:** `scrollIntoViewIfNeeded({ block: 'center' })` interacts with the site's global `scroll-behavior: smooth` (globals.css), so sampling immediately after didn't always land at the exact mathematical center; scroll progress landed at ~0.998 instead of 1, one test assertion falling just short of the original `p >= 0.999` threshold.
- **Fix:** (a) verify script now computes the exact target `scrollY` from `getBoundingClientRect()` and scrolls with explicit `behavior: 'instant'` to bypass the CSS smooth-scroll; (b) loosened the component's "developed" threshold from `p >= 0.999` to `p >= 0.995` — a difference imperceptible in the rendered filter but tolerant of the sub-pixel viewport differences the emulated iPhone 13 introduces.
- **Files modified:** `components/lab/DevelopingPhoto.tsx`; verify script not committed (scratchpad only)
- **Commit:** `ebfa58f`

No architectural deviations — plan executed as designed otherwise.

## Verification

- `npx tsc --noEmit`: 0 errors (after every task)
- `npm run lint`: 0 errors (after every task)
- Playwright verification (`verify.mjs`, run against the already-running dev server on :3000, chromium via the Playwright install at `~/Downloads/PANIC ROOM/_kit/node_modules/`): **55/55 assertions PASS** across desktop (1440×900), iPhone 13, and a `reducedMotion: 'reduce'` context — 22 frames rendered, 5 picks correctly marked and focusable, 5 fogged frames correctly non-focusable with no focusable children, lightbox open/close/backdrop/Esc/focus-return/inert-toggle all correct, arrow-key and button navigation skip fogged frames in both directions, develop filter reaches literal `'none'` exactly at center for both the first and last pick on both viewports, reduced-motion forces `'none'` throughout with no scroll needed, zero broken images, zero horizontal page overflow.
- `.vercelignore` contains `app/lab`; `git diff HEAD~3 -- app/sitemap.ts` is empty.
- `git log --name-only` across the 3 commits confirms nothing under `public/asset/`, `public/images/_w/`, or `.claude/` was ever staged.

### Screenshots (scratchpad, not committed)

All in `/private/tmp/claude-501/-Users-myltonvanbolderen-small-record/54b5f0cd-5a66-4186-b337-6738006c59de/scratchpad/lab/`:
- `desktop-sheet-top.png`, `desktop-sheet-picks.png`, `mobile-sheet-top.png`, `mobile-sheet-picks.png` — contact sheet, both viewports
- `desktop-lightbox.png`, `mobile-lightbox.png` — lightbox open
- `desktop-develop-entering.png` / `-half.png` / `-centered.png` (+ `mobile-*` equivalents) — the develop transition at three scroll positions
- `peek-desktop-top.png`, `peek-mobile-top.png`, `peek-lightbox-04.png`, `peek-desktop-picks.png` — earlier ad hoc visual-review screenshots taken during Task 2

Visual review confirmed: crisp SVG sprocket holes, legible mono edge markings, irregular hand-drawn red circles overshooting the frame edges on exactly the 5 picks (08, 10, 14, 16, 25), red X crosses on exactly the 5 fogged frames (05, 13, 18, 26, 29), mobile strips scroll horizontally within themselves with no page-level overflow, and the develop section reads as a genuine "photo developing" effect (dark/desaturated → full color) rather than a simple fade.

## Self-Check: PASSED

- `components/lab/frames.ts` — FOUND
- `components/lab/ContactSheet.tsx` — FOUND
- `components/lab/FilmLightbox.tsx` — FOUND
- `components/lab/DevelopingPhoto.tsx` — FOUND
- `app/lab/layout.tsx` — FOUND
- `app/lab/page.tsx` — FOUND
- `public/images/panic-room/film/` (22 JPEGs) — FOUND
- Commit `5f57628` — FOUND (`git log --oneline --all`)
- Commit `8467d91` — FOUND
- Commit `ebfa58f` — FOUND
