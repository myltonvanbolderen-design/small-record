---
phase: quick-260921-sqn
plan: 01
subsystem: frontend
tags: [refactor, cleanup, eslint, dead-code, magazine-components]
requires: []
provides:
  - components/magazine/SectionHeader.tsx
  - components/magazine/MediaTile.tsx
  - components/magazine/EventFacts.tsx
  - lib/events-jsonld.ts
  - eslint.config.mjs
affects:
  - app/events/page.tsx
  - app/page.tsx
  - app/small-record/page.tsx
  - app/casae/page.tsx
  - app/letche/page.tsx
tech-stack:
  added:
    - "eslint@9.39.5 (devDependency)"
    - "eslint-config-next@15.5.25 (devDependency)"
    - "@eslint/eslintrc@3.3.7 (devDependency)"
  patterns:
    - "Server-component shared magazine primitives (SectionHeader/MediaTile/EventFacts) composed with verbatim class strings, no cn()/twMerge, to preserve byte-identical markup"
key-files:
  created:
    - components/magazine/SectionHeader.tsx
    - components/magazine/MediaTile.tsx
    - components/magazine/EventFacts.tsx
    - lib/events-jsonld.ts
    - eslint.config.mjs
  modified:
    - app/events/page.tsx
    - app/page.tsx
    - app/small-record/page.tsx
    - app/casae/page.tsx
    - app/letche/page.tsx
    - components/layout/Header.tsx
    - package.json
    - package-lock.json
decisions:
  - "Kept events/page.tsx at 554 lines (4 over the ~550 soft target, well under the 600 hard ceiling) rather than force further array-driven compaction that would reduce readability"
  - "SectionHeader intentionally excludes the AnimatedSection wrapper — callers keep differing wrap styles (blur/scale) around it"
  - "No new lint errors from the eslint/eslint-config-next/@eslint/eslintrc devDeps; pre-existing high-severity advisories (nanoid, postcss, sharp, puppeteer's ip-address/ws chain) are unrelated and untouched"
metrics:
  duration: "7m23s"
  completed: "2026-09-21"
  tasks: 3
  files_changed: 13
---

# Quick Task 260921-sqn: Audit Lot E2 — Shared Components & Dead Code Summary

Removed 3 unused animation/magazine components, extracted three shared magazine primitives (SectionHeader, MediaTile, EventFacts) to shrink `app/events/page.tsx` from 848 to 554 lines, and installed ESLint 9 (flat config, `next/core-web-vitals` + `next/typescript`) with 0 errors — all proven zero-visual-change via a normalized before/after static-export HTML diff.

## What Was Built

**Task 1 — Baseline + dead code removal** (commit `18adcc7`)
- Built an APFS clone of the repo in scratchpad, ran `npm run build` there, and normalized the static export of all 5 public pages (BUILD_ID, chunk hashes, and `__next_f.push` RSC payload scripts stripped) plus concatenated CSS — this became the "before" snapshot.
- Grepped `app components lib scripts tools` for `FadingOverlay|TextReveal|PhotoPlaceholder`: zero importers anywhere (including `app/v2`, `app/carousel`, `components/v2`).
- Deleted `components/animation/FadingOverlay.tsx`, `components/animation/TextReveal.tsx`, `components/magazine/PhotoPlaceholder.tsx`.

**Task 2 — Shared components extraction** (commit `be31b8b`)
- `components/magazine/SectionHeader.tsx` — kicker + h2 + optional meta/folio/aside, server component, byte-identical markup to the 8 call sites it replaces.
- `components/magazine/MediaTile.tsx` — aspect wrapper + `next/image` OR `VideoLoop`, with optional bottom-gradient caption.
- `components/magazine/EventFacts.tsx` — Venue/Date two-column facts grid, used on both `/events` sections.
- `lib/events-jsonld.ts` — the two `MusicEvent` JSON-LD objects moved verbatim out of `app/events/page.tsx`.
- `app/events/page.tsx` refactored: 5 section headers → `SectionHeader`, 13 media tiles → `MediaTile` (photo/video groups driven by local `const` arrays + `.map`), 2 Venue/Date blocks → `EventFacts`. **848 → 554 lines.**
- `SectionHeader` also applied on `app/page.tsx` (The Artists, Latest · Live, Featured Mix), `app/casae/page.tsx` and `app/letche/page.tsx` (Listen/Selected Mixes), and `app/small-record/page.tsx` (Live/On the floor via the `aside` prop for the "All events" Link, and Featured Mix).
- Left inline per plan: `app/small-record/page.tsx` "What We Do" header (no h2/inner-div structure — doesn't match the SectionHeader shape).

**Task 3 — ESLint 9 + zero-visual-change proof** (commit `441fd59`)
- Installed `eslint@9.39.5`, `eslint-config-next@15.5.25`, `@eslint/eslintrc@3.3.7` as devDependencies only.
- `eslint.config.mjs`: flat config via `FlatCompat`, extends `next/core-web-vitals` + `next/typescript`, ignores `.next/out/public/node_modules`, `app/v2`, `app/carousel`, `components/v2`, `tools`, `scripts`, `.planning`, `.claude`.
- Added `"lint": "eslint ."` to `package.json` scripts.
- `npm run lint` found 1 warning: `@next/next/no-img-element` on the intentional native gnome `<img>` in `components/layout/Header.tsx` (per CLAUDE.md: native `<img>` + inline `invert(1)` filter, Tailwind's `invert` utility conflicts in v4). Added `{/* eslint-disable-next-line @next/next/no-img-element */}` matching the existing pattern already used in Footer/small-record. Final: **0 errors, 0 warnings.**
- Built a fresh APFS clone (`e2-after`) from the final committed state, ran `npm run build` there (lint now runs as part of `next build` — succeeded), normalized its export, and diffed against the `e2-before` baseline.

## Line Counts (events page)

| | Before | After | Delta |
|---|---|---|---|
| `app/events/page.tsx` | 848 | 554 | -294 (-35%) |

554 lines is 4 over the plan's "~550" soft target but comfortably under the 600 hard ceiling — accepted as-is; further compaction of the const-driven media arrays would have hurt readability for no functional gain.

## Deleted Files

- `components/animation/FadingOverlay.tsx` (0 importers)
- `components/animation/TextReveal.tsx` (0 importers)
- `components/magazine/PhotoPlaceholder.tsx` (0 importers — confirmed by re-grep across `app components lib scripts tools`)

## SectionHeader Applied / Not Applied

Applied (8 sites, matching kicker+h2(+meta)(+folio|aside) structure):
- `app/events/page.tsx`: 001 Small Party, 002 Gambetta, 003 Featured Mix, 004 Fête, 005 Coming soon
- `app/page.tsx`: The Artists (003), Latest · Live (no folio), Featured Mix (004)
- `app/casae/page.tsx`: Listen/Selected Mixes (005)
- `app/letche/page.tsx`: Listen/Selected Mixes (006)
- `app/small-record/page.tsx`: Live/On the floor (via `aside` prop carrying the "All events" `Link`, no folio), Featured Mix (005)

Left inline (structurally different, per plan instruction):
- `app/small-record/page.tsx` "What We Do" header (L150 originally) — no `<h2>`/inner-div wrapper, just a flat kicker + folio row.

## Dev Server Status

| Check | Status |
|---|---|
| Before any change | 200 |
| Before `npm install` (eslint deps) | 200 |
| After `npm install` (eslint deps) | 200 |
| After all 3 commits, final check | 200 |

Dev server on :3000 was never restarted or killed. No build was ever run inside the project directory — all builds happened in APFS clones under the scratchpad (`$SP/e2-before`, `$SP/e2-after`).

## Lint Result

`npm run lint` (eslint 9, flat config, `next/core-web-vitals` + `next/typescript`): **0 errors, 0 warnings** (final state — the single initial warning on Header.tsx's gnome `<img>` was resolved with an inline eslint-disable comment, consistent with the existing Footer/small-record pattern).

`npx tsc --noEmit`: passes.

`npm run build` inside the scratchpad "after" clone (which now runs lint-as-part-of-build since eslint is installed): succeeded.

## HTML Diff Result (Zero Visual Change Proof)

Normalized static-export HTML (BUILD_ID, `/_next/static/*` hashes, and inline RSC `__next_f.push` payload scripts stripped) for all 5 public pages, diffed before (pre-Task-1) vs after (post-Task-3, final committed state):

| Page | Result |
|---|---|
| `/` (index.html) | **IDENTICAL** |
| `/small-record` | **IDENTICAL** |
| `/casae` | **IDENTICAL** |
| `/letche` | **IDENTICAL** |
| `/events` | **IDENTICAL** |

No fix commit was required — the refactor produced byte-identical markup on the first attempt.

## CSS Diff Result

Concatenated `_next/static/**/*.css` (normalized, sorted by filename, split on `}`), diffed before vs after:

1. **Font-face block reordering** — the same `@font-face` declarations for Playfair Display, Bebas Neue, DM Sans, petitCochon, lazyDog appear in both builds, just at a different position in the concatenated file, because Turbopack's per-build chunk-hash filenames change the sort order used by the normalizer. Not a content change — pure build-noise.
2. **Two rule removals**, both exclusively used by the deleted `PhotoPlaceholder.tsx`:
   - `.text-label{font-size:var(--text-label)}` and the `--text-label` custom property in the `@layer theme` block
   - `.tracking-widest{...}` and the `--tracking-widest` custom property
   Verified via `git show <pre-cleanup-commit>:components/magazine/PhotoPlaceholder.tsx` — it was the only file in the codebase using `text-label`/`tracking-widest`; grepping the current tree confirms no remaining usage (Tailwind v4 scans source files and only emits the utility classes that are referenced, so deleting the last consumer removed the generated rule).

No unexpected CSS additions or modifications.

## Deviations from Plan

None — plan executed as written. The 554-vs-550 line-count variance and the single lint-warning fix on Header.tsx were both explicitly anticipated and handled per the plan's own instructions.

## Auth Gates

None encountered.

## CLAUDE.md Note

Per the plan constants, `/Users/myltonvanbolderen/CLAUDE.md` lives outside the repo and was not edited during task execution (only referenced for context). As instructed by the orchestrator's post-task constraint, it has been updated (uncommitted, outside the repo) after this SUMMARY was written to: remove `FadingOverlay`/`TextReveal` from the `components/animation/` list, add `SectionHeader`/`MediaTile`/`EventFacts` to the `components/magazine/` list, and mention `npm run lint` (0 errors required, runs as part of `next build`).

## Self-Check: PASSED

Files verified to exist:
- FOUND: components/magazine/SectionHeader.tsx
- FOUND: components/magazine/MediaTile.tsx
- FOUND: components/magazine/EventFacts.tsx
- FOUND: lib/events-jsonld.ts
- FOUND: eslint.config.mjs
- MISSING (expected, deleted): components/animation/FadingOverlay.tsx
- MISSING (expected, deleted): components/animation/TextReveal.tsx
- MISSING (expected, deleted): components/magazine/PhotoPlaceholder.tsx

Commits verified in `git log --oneline`:
- FOUND: 18adcc7 chore(cleanup): remove unused FadingOverlay, TextReveal, PhotoPlaceholder
- FOUND: be31b8b refactor(events): extract SectionHeader, MediaTile, EventFacts shared components
- FOUND: 441fd59 chore(lint): add ESLint 9 flat config (next/core-web-vitals, next/typescript)
