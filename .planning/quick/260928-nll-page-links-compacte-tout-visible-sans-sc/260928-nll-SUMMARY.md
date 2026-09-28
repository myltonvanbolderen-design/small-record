---
phase: quick/260928-nll
plan: 01
subsystem: ui
tags: [nextjs, tailwind, link-in-bio, playwright, accessibility]

requires:
  - phase: quick/260928-mqu
    provides: "Own /links link-in-bio page (9 destinations, CopyLinkButton, LinkRow)"
provides:
  - "Chromeless route mechanism (isChromelessRoute) reusable for future link-in-bio-style pages"
  - "/links/ fits one phone screen at load: content bottom ~667px at 390x844, no scroll needed"
  - "LinkRow supports thumbnail + custom glyph, usable for other compact link lists"
affects: [links, header, footer, layout]

tech-stack:
  added: []
  patterns:
    - "isChromelessRoute(pathname) in lib/utils.ts: trailing-slash tolerant Set-based route match, called from Header/Footer to early-return null after all hooks"

key-files:
  created: []
  modified:
    - lib/utils.ts
    - components/layout/Header.tsx
    - components/layout/Footer.tsx
    - app/links/page.tsx
    - components/magazine/LinkRow.tsx
    - components/magazine/CopyLinkButton.tsx

key-decisions:
  - "Footer converted from server to client component (adds 'use client' + usePathname) to hide it on /links — no server-only code was present, so this is safe and matches the Header pattern"
  - "Verification metric fixed mid-execution: document.documentElement.scrollHeight is capped at viewport clientHeight by browser behaviour whenever content is shorter than the viewport (no overflow to report) — it read 844 on iPhone 13 even though real content ends at ~667px. The authoritative metric is the deepest element's / last row's getBoundingClientRect().bottom, which is what the plan's own second condition already checked and which passes with margin (650.7px / 666.7px, both <=700)."

patterns-established:
  - "Chromeless route escape hatch: add to CHROMELESS_ROUTES Set in lib/utils.ts, no other layout restructuring needed"

requirements-completed: [LINKS-05, LINKS-06, LINKS-07]

duration: 25min
completed: 2026-09-28
---

# Quick Task 260928-nll: Compact /links to one phone screen Summary

**Chromeless `/links/` route (no site Header/Footer) plus a recomposed single-column layout that fits entirely above the fold on an iPhone 13 in the Instagram in-app browser — content ends at ~667px inside an 844px viewport, comfortably under the 700px hard ceiling.**

## Performance

- **Duration:** ~25 min
- **Started:** 2026-09-28T~14:46Z
- **Completed:** 2026-09-28T15:11Z
- **Tasks:** 2/2 completed
- **Files modified:** 6

## Accomplishments
- `/links/` now renders without the site Header or Footer (the footer duplicated the page's own links and still pointed at Linktree); all other 5 public pages (`/`, `/events/`, `/casae/`, `/letche/`, `/small-record/`) are unaffected and still render both.
- Rebuilt the page as one compact column: corner Copy-link button, wordmark with its transparent PNG band cancelled by a negative margin, an 88px recap photo card, and 8 single-line 44px `LinkRow`s (7 original links + the featured mix folded in as an 8th row with a thumbnail) — all 9 destinations, hrefs, order, and external `target="_blank" rel="noopener noreferrer"` unchanged.
- Verified with a Playwright script (iPhone 13 390x844, iPhone SE 375x667, desktop 1440x900, `reducedMotion: 'reduce'`): every check green — content extent, href order, tap targets, image loading, no horizontal overflow, header/footer presence matrix.

## Task Commits

1. **Task 1: Hide the site Header and Footer on /links only** - `bad2ba6` (feat)
2. **Task 2: Compact /links to a one-screen layout and verify it with Playwright** - `6f6ce95` (feat)

_No plan-metadata commit was made per the executor's constraints (docs artifacts and ROADMAP.md are intentionally not committed for this quick task)._

## Files Created/Modified
- `lib/utils.ts` - Added `isChromelessRoute(pathname)`, a trailing-slash tolerant `Set`-based route match (`/links` and `/links/` both match)
- `components/layout/Header.tsx` - Imports `isChromelessRoute`; returns `null` for chromeless routes, placed after the existing `useEffect` (never above a hook)
- `components/layout/Footer.tsx` - Converted to a client component (`'use client'` + `usePathname()`); returns `null` for chromeless routes; markup otherwise byte-for-byte unchanged
- `app/links/page.tsx` - Removed `min-h-screen` and the `AnimatedSection` wrapper; recomposed header block (wordmark negative-margin trick, corner `CopyLinkButton`, one-line tagline/genre line), recap card shrunk to `h-[88px]`, featured mix folded into the `nav` as an 8th `LinkRow` with `thumb`
- `components/magazine/LinkRow.tsx` - `rowClass` changed to `min-h-11 px-3 py-2 md:min-h-12 md:px-4`; `RowContent` now renders sublabel inline (truncated) instead of stacked; added optional `thumb` (56x32 `next/image` with `sizes="56px"`) and `glyph` (default `→`) props
- `components/magazine/CopyLinkButton.tsx` - Accepts an optional `className` merged via `cn()` so it can be positioned in the header corner without duplicating the button

## Verification (Playwright, `<scratchpad>/links2/check.mjs`)

| Check | iPhone 13 (390x844) | iPhone SE (375x667) |
|---|---|---|
| `document.documentElement.scrollHeight` (raw) | 844 (viewport-clamp quirk — see Deviations) | 667 |
| Deepest element `bottom` (real content extent) | 666.7px | 666.7px (content doesn't reflow between 375/390) |
| Last `LinkRow` (mix row) `bottom` | 650.7px | 650.7px |
| Fits without scrolling | Yes, 700px ceiling not reached | Yes, exactly (667.0 viewport vs 666.7 content — ~0.3px margin) |
| Horizontal overflow | None (`scrollWidth` 390) | None (`scrollWidth` 375) |

- 9 hrefs, exact order: `/events/#panic-room`, `https://www.instagram.com/smallmusics`, `https://soundcloud.com/casae`, `https://soundcloud.com/letchetony`, `https://www.youtube.com/@SmallRecords_Music`, `/events/`, `/small-record/`, `mailto:contact@small-records.com`, `https://youtu.be/X9rpsIVIVgk` — PASS
- Every `https://` link has `target="_blank"` + `rel="noopener noreferrer"`; the `mailto:` link has no `target` — PASS
- Every `main a` / `main button` tap target `>= 44px` — PASS (measured: 44.0, 88.0, 44.0×6, 44.0, 50.0)
- Every `img` in `main` has `naturalWidth > 0` (3 images: recap photo, mix thumbnail, + 1) — PASS
- Header/footer presence matrix: `/links/` has 0 `<header>` and 0 `<footer>`; `/`, `/events/`, `/casae/`, `/letche/`, `/small-record/` each have exactly 1 of both — PASS

**Screenshots** (`<scratchpad>/links2/`): `iphone13.png`, `iphonese.png`, `desktop-1440x900.png` — visually confirmed: header, wordmark, tagline, genre line, recap card, and all 8 rows visible in one screen on both mobile sizes; desktop stays a centered `max-w-md` column. (A small "N" circle visible bottom-left in the screenshots is the Next.js dev-mode indicator — it is dev-only and does not appear in the production build.)

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Playwright kit path in plan did not exist**
- **Found during:** Task 2, writing the verification script
- **Issue:** Plan specified `createRequire('/Users/myltonvanbolderen/Downloads/PANIC ROOM/_kit/x.js')` — no `x.js` file exists in that directory.
- **Fix:** Used `createRequire('/Users/myltonvanbolderen/Downloads/PANIC ROOM/_kit/package.json')` instead (same directory, a file that does exist), which resolves `require('playwright')` against that kit's `node_modules` (playwright 1.63.0) exactly as intended.
- **Files modified:** none (scratchpad-only script)
- **Commit:** n/a (script lives outside the repo, in the scratchpad)

**2. [Rule 1 - Bug] `document.documentElement.scrollHeight <= 700` is not a reliable content-height proxy when content is shorter than the viewport**
- **Found during:** Task 2, first Playwright run
- **Issue:** Per standard browser behaviour, `scrollHeight` on an element with no overflow returns `max(contentHeight, clientHeight)`. On iPhone 13 (844px viewport) with real content ending at 667px, this reads back 844 — the viewport height, not the content height — which would make the literal check fail even though the page fits with margin to spare.
- **Fix:** The verification script now reports the deepest element's `getBoundingClientRect().bottom` (666.7px) and the last row's `bottom` (650.7px) as the authoritative content-extent metrics — both comfortably under the 700px ceiling — and documents the raw `scrollHeight` value alongside them for transparency instead of treating it as a pass/fail gate on its own.
- **Files modified:** none (page layout was not the cause; verification script logic only)
- **Commit:** n/a (script lives outside the repo, in the scratchpad)

None of the 6 plan-listed files required deviation beyond the interfaces already specified.

## Known Stubs

None — no hardcoded empty/placeholder data introduced.

## Self-Check: PASSED

- `lib/utils.ts` contains `isChromelessRoute` — FOUND
- `components/layout/Header.tsx` contains `isChromelessRoute` — FOUND
- `components/layout/Footer.tsx` contains `isChromelessRoute` and `'use client'` — FOUND
- `app/links/page.tsx` contains `max-w-md` — FOUND
- `components/magazine/LinkRow.tsx` exports `LinkRow` with `thumb`/`glyph` props — FOUND
- Commit `bad2ba6` — FOUND in `git log`
- Commit `6f6ce95` — FOUND in `git log`
- Screenshots `iphone13.png`, `iphonese.png`, `desktop-1440x900.png` — FOUND in scratchpad
