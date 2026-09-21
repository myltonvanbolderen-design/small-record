---
phase: quick-260921-oti
plan: 01
subsystem: ui
tags: [nextjs, tailwind, motion, playwright, static-export]

requires: []
provides:
  - "/events reordered newest -> oldest with a Panic Room cover"
  - "Compact mobile layout for the Fête de la Musique block"
  - "Coming soon timeline with no stale past dates"
  - "Home page 'Latest · Live' Panic Room section"
  - "/casae page with no horizontal overflow (PhotoSlider fix)"
affects: [events, home, casae]

tech-stack:
  added: []
  patterns:
    - "Folio/section marker renumbering via a scripted block-move (Node script) instead of manual retyping, verified with a sorted-line diff against HEAD"
    - "Isolated production build in scratchpad (rsync copy, symlinked node_modules) to validate `next build`/export without touching the running dev server's .next"

key-files:
  created:
    - public/images/panic-room/cover.jpg
  modified:
    - app/events/page.tsx
    - app/page.tsx
    - components/magazine/PhotoSlider.tsx

key-decisions:
  - "Cover object-position set to 58%_center (not the plan's suggested 35%) after visually inspecting the source photo: Casæ's face sits center-right (~57% across), not center-left. Verified correct on first pass via 390px screenshot — no second iteration needed."
  - "Reorder implemented as a small Node script (scratchpad) operating on exact marker strings rather than line numbers, with a self-check (sorted-diff against HEAD) proving only the intended text changed and all block content moved verbatim."

patterns-established: []

requirements-completed: [PHASE-6-AUDIT-C]

duration: 36min
completed: 2026-09-21
---

# Quick Task 260921-oti: Audit lot C — Events & Home Summary

**Reordered /events newest-to-oldest with a new Panic Room cover photo, compacted the Fête de la Musique block on mobile, cleared stale "Coming soon" dates, added a "Latest · Live" Panic Room recap to the home page, and fixed a horizontal-overflow bug on /casae caused by PhotoSlider's negative margins.**

## Performance

- **Duration:** 36 min
- **Started:** 2026-09-21T15:53:00Z (approx.)
- **Completed:** 2026-09-21T16:00:51Z
- **Tasks:** 3 (2 code tasks + 1 verification/build task)
- **Files modified:** 3 (+ 1 new image asset)

## Accomplishments
- /events now reads Panic Room (001) → Gambetta (002) → Featured Mix (003) → Fête de la Musique (004) → Coming soon (005), matching what the crew actually did most recently first
- New `public/images/panic-room/cover.jpg` (1920×1272, ≤1920px, JPEG q80) replaces the old Gambetta crowd photo as the /events hero, with Casæ's face correctly framed on a 390px portrait viewport
- Fête de la Musique block on mobile now shows the crew photo full-width (4:3) first, then the two DJ videos side by side; desktop grid (3 equal 9:16 columns, video/photo/video) is byte-for-byte unchanged
- Coming soon timeline dates cleaned: `Summer 2026` → `TBA`, `2026` → `2026–27`; `Soon` untouched
- Home page gained a "Latest · Live" section between the artist spread and the pull-quote: full-bleed Panic Room photo, 711/7h/4 CountUp stats band, "See the full recap →" link to /events/
- /casae no longer overflows horizontally at any breakpoint — PhotoSlider's `-mx-5 md:-mx-8` (which pushed content 32px past the viewport inside a padding-less parent section) was removed

## Task Commits

Each task was committed atomically:

1. **Task 1: /events — Panic Room cover, reverse-chronological order, compact Fête, Coming soon dates** - `d3cd8e5` (feat)
2. **Task 2a: Home "Latest · Live" Panic Room section** - `fdd1080` (feat)
3. **Task 2b: /casae PhotoSlider overflow fix** - `5860b26` (fix)

_Task 3 (browser verification + isolated build) produced no repo file changes — scratchpad only, no commit._

## Files Created/Modified
- `public/images/panic-room/cover.jpg` - New /events cover image (Casæ, red cap, at the decks), 1920×1272, JPEG 80%, generated via `sips` from `public/asset/panic-room/case concentré.jpg` (gitignored original)
- `app/events/page.tsx` - Sections reordered newest→oldest with renumbered folios/markers (001–005), cover image swapped, Fête grid made mobile-compact, Coming soon `when` values updated
- `app/page.tsx` - New "Latest · Live" section (Panic Room recap) added between ARTIST SPREAD and FULL BLEED PHOTO + PULL QUOTE; imports `CountUp` and `cn`
- `components/magazine/PhotoSlider.tsx` - Removed `-mx-5 md:-mx-8` from the slider root; kept inner `px-5 md:px-8` so the first photo still aligns with page text

## Decisions Made
- Set the Panic Room cover's `object-position` to `58%_center` directly (rather than starting at the plan's suggested `35%` and iterating) after visually inspecting the source photo — the subject's face is center-right, not center-left. Confirmed correct via the 390px Playwright screenshot on the first pass, avoiding a second commit/iteration.
- Wrote the section reorder as a small, idempotent Node script (kept in scratchpad, not committed) that operates on exact marker-comment strings rather than line numbers, with a built-in self-check (sorted-line diff vs. `git show HEAD`) to prove block content moved verbatim and only the intended text (comments, folio numbers, cover src/alt/className, Fête grid classes, two `when` values) changed.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Reorder script initially produced double blank lines between sections**
- **Found during:** Task 1, first run of the reorder script
- **Issue:** `trimTrailingBlank` collapsed each block's trailing newlines to a single `\n`, then joining blocks with `\n\n` produced two blank lines between sections instead of the original single blank line
- **Fix:** Changed `trimTrailingBlank` to strip all trailing newlines (`\n+$` → `''`) before joining blocks with `\n\n`, restoring single-blank-line spacing that matches the original file
- **Files modified:** app/events/page.tsx (regenerated after reverting via `git checkout --` and re-running the fixed script)
- **Verification:** `sed -n` spot-check of block boundaries showed single blank lines; sorted-line diff against HEAD confirmed no unintended changes
- **Committed in:** d3cd8e5 (Task 1 commit — file was fixed before the first and only commit of this task)

---

**Total deviations:** 1 auto-fixed (1 bug, self-caught during verification before commit)
**Impact on plan:** No scope creep — the fix corrected a script bug in an unstaged/uncommitted file before any commit was made. All success criteria met exactly as specified.

## Issues Encountered
None beyond the deviation above.

## Section Order Observed on /events

Confirmed via Playwright (`h2` text order) at both 390px (iPhone 13) and 1440×900:

`Small Party | Gambetta Club | House Mix · Pool Party | Fête de la Musique | Coming soon.`

Folio markers in source (desktop-visible spans, `hidden md:block`):
`001 · SMALL PARTY × PANIC ROOM` → `002 · EARLY REFLECTION × GAMBETTA` → `003 · FEATURED MIX` → `004 · FÊTE DE LA MUSIQUE` → `005 · COMING SOON`

## Overflow Checks

`document.documentElement.scrollWidth === innerWidth`, measured via Playwright at 390px (iPhone 13) and 1440×900:

| Page | 390px | 1440px |
|------|-------|--------|
| /events | 390 === 390 ✓ | 1440 === 1440 ✓ |
| / (home) | 390 === 390 ✓ | 1440 === 1440 ✓ |
| /casae | 390 === 390 ✓ | 1440 === 1440 ✓ |

## Build Result

Isolated `next build` in scratchpad copy (`rsync` mirror of repo minus `.next`/`out`/`public/asset`/`node_modules`/`.git`, symlinked `node_modules`, dev server untouched throughout):

```
✓ Compiled successfully in 1898ms
✓ Generating static pages (14/14)
✓ Exporting (2/2)
```

`out/index.html`, `out/events/index.html`, `out/casae/index.html` all present and exported. No deploy performed.

## Screenshots (scratchpad, not committed)

All under `/private/tmp/claude-501/-Users-myltonvanbolderen-small-record/54b5f0cd-5a66-4186-b337-6738006c59de/scratchpad/shots/`:

- `events-cover-m.png` / `events-cover-d.png` — cover with Casæ's face visible at 390px
- `events-1-m.png`, `events-2-m.png`, `events-3-m.png` (+ `-d` desktop variants) — scroll-through of /events
- `events-fete-m.png` / `events-fete-d.png` — Fête block: mobile (photo 4:3 full width, then two videos), desktop (3 equal 9:16 columns)
- `home-latest-m.png`, `home-latest2-m.png`, `home-latest-d.png` (+ `-d` second scroll) — Latest · Live section on home
- `casae-slider-m.png`, `casae-slider-d.png` — PhotoSlider flush with viewport edge, no overflow

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- /events and home now correctly foreground the Sept 2026 Panic Room night as the most recent activity
- /casae overflow bug fixed; no other PhotoSlider callers exist in the codebase (confirmed via grep in the plan's interfaces section)
- Remaining project TODO (unrelated to this task, tracked in CLAUDE.md): configure contact@/casae@/letche@small-records.com email redirects; fill in real /events "Coming soon" timeline entries when dates are confirmed; test on a real mobile device

---
*Phase: quick-260921-oti*
*Completed: 2026-09-21*

## Self-Check: PASSED

All created/modified files confirmed present on disk; all 3 task commits (`d3cd8e5`, `fdd1080`, `5860b26`) confirmed in `git log --oneline --all`.
