---
phase: quick/260928-mqu
plan: 01
subsystem: frontend
tags: [links-in-bio, seo, sitemap, accessibility]
requirements: [LINKS-01, LINKS-02, LINKS-03, LINKS-04]
dependency-graph:
  requires: []
  provides:
    - "/links/ route (own link-in-bio page)"
    - "LinkRow shared component (magazine link rows)"
    - "CopyLinkButton client component"
  affects:
    - app/sitemap.ts
tech-stack:
  added: []
  patterns:
    - "LinkRow: server component, kind: 'internal' | 'external' | 'mail' switches Link vs raw <a>"
    - "CopyLinkButton: 'use client', navigator.clipboard with try/catch, 2s reset via useEffect cleanup"
key-files:
  created:
    - app/links/page.tsx
    - components/magazine/LinkRow.tsx
    - components/magazine/CopyLinkButton.tsx
  modified:
    - app/sitemap.ts
    - public/images/mix-pool-party.jpg (newly committed asset)
decisions:
  - "LinkRow ships with a 'kind' prop (internal/external/mail) instead of the initial 'external?: boolean' sketch, per the plan's own refinement for the mailto case (mailto must get no target/rel)."
  - "CopyLinkButton shipped (not skipped) — stayed under the ~40-line budget once the tap-target fix was applied."
metrics:
  duration: "~35 min"
  completed: 2026-09-28
---

# Phase quick/260928-mqu Plan 01: Small Records link-in-bio page (/links) Summary

Own `/links/` link-in-bio page (wordmark, Panic Room recap card, 7 tappable rows, featured mix
card) built to replace the near-empty Linktree, verified with Playwright at 390×844 and 1440×900,
and the static export confirmed in a scratchpad clone.

## What was built

- `app/links/page.tsx` — server component, `pageMetadata()` with title "Links", the agreed
  ~150-char description mentioning Instagram/SoundCloud/YouTube/booking/Paris, `path: '/links/'`,
  `og-label.jpg` share image. Content order: wordmark header (+ tagline + genre line +
  `CopyLinkButton`) → Panic Room recap card linking to `/events/#panic-room` → 7 `LinkRow`s in a
  `<nav aria-label="Small Records links">` → featured mix card linking to the YouTube mix.
- `components/magazine/LinkRow.tsx` — server component, `kind: 'internal' | 'external' | 'mail'`
  (refined from the plan's initial `external?: boolean` sketch, per the plan's own note that the
  mailto row needs a third case with no `target`/`rel`). One shared `rowClass` for visual parity
  across all three branches.
- `components/magazine/CopyLinkButton.tsx` — `'use client'`, `navigator.clipboard.writeText`
  in a `try/catch`, 2s auto-reset via `useEffect` cleanup, `aria-live="polite"` sr-only status text.
- `app/sitemap.ts` — reworked from a flat `PATHS` array to an explicit
  `{ path, priority }[]` list; the 5 existing routes keep their priorities (`/` = 1, rest = 0.8),
  `/links/` added at `0.6`.
- `public/images/mix-pool-party.jpg` committed (was already on disk, untracked); its four WebP
  variants generated via `npm run images` into `public/images/_w/` (gitignored, regenerated at
  Vercel `prebuild`).

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 2 - missing critical functionality] `CopyLinkButton` tap target was 15.6px, below the
plan's 44px accessibility floor**
- **Found during:** Task 2, Playwright mobile pass (measured `getBoundingClientRect().height`
  for every `main a` and the copy button, per the plan's own verification step 4).
- **Issue:** The button was styled as plain small text with no padding
  (`font-condensed text-[0.65rem] …`), so its hit area was ~15.6px tall — well under the
  44px floor the plan's `must_haves.truths` requires for every tap target on the page.
- **Fix:** Added `inline-flex min-h-11 items-center justify-center px-3 py-2` to the button's
  className. Visual size/weight of the label text is unchanged; only the invisible hit area grew.
- **Files modified:** `components/magazine/CopyLinkButton.tsx`
- **Commit:** `137d0c2` (folded into the single Task 2 commit, since the fix landed before the
  first commit was made — no separate fix commit was needed)

**2. [Verification-script correction, not a site fix] Playwright selector over-matched two
unrelated global buttons**
- **Found during:** first run of the tap-target assertion.
- **Issue:** The check script's selector was `main a, button` (comma-separated, so `button` was
  unscoped to `<main>`), which also caught the site Header's hamburger "Menu" button (16.8px) and
  a floating `ScrollToTop` button (32px) — both outside `/links/`'s own markup and out of this
  task's scope per the deviation rules' scope boundary.
- **Fix:** Scoped the selector to `main a, main button` in the scratchpad check script only.
  No production file was touched for this one; the Header/ScrollToTop tap targets are
  pre-existing and out of scope — logged here for visibility, not fixed.

None of the automatic fixes above required an architectural decision; both were handled inline
within the two-fix-attempt budget.

## Measured results (Playwright, http://localhost:3000/links/)

**Hrefs (DOM order, `main a[href]`, mobile pass):**
1. `http://localhost:3000/events/#panic-room` (recap card)
2. `https://www.instagram.com/smallmusics`
3. `https://soundcloud.com/casae`
4. `https://soundcloud.com/letchetony`
5. `https://www.youtube.com/@SmallRecords_Music`
6. `http://localhost:3000/events/`
7. `http://localhost:3000/small-record/`
8. `mailto:contact@small-records.com`
9. `https://youtu.be/X9rpsIVIVgk` (mix card)

All 9 match the plan's expected list exactly (order differs slightly from the plan's list only
because the recap-card link appears before the nav in DOM order — this was always the case per
the page structure in the plan, section (b) precedes section (c)). No missing, no extra hrefs.

**target/rel:** every `https://` link has `target="_blank"` + `rel="noopener noreferrer"`; the
`mailto:` link has no `target`. Verified on both passes (9 links each).

**Broken images:** 0 — all 5 `<img>`/`<Image>` elements (wordmark, recap photo, mix thumbnail,
plus 2 more from the persistent Header/Footer wordmark images) have `naturalWidth > 0`.

**Tap targets (mobile, 390×844):** after the fix, minimum height = **44px** exactly
(`CopyLinkButton`). All `LinkRow`s measure 56px or more (`Instagram`/`Booking` rows are 67.2px
due to the sublabel line; the plain rows are 56px = `min-h-14`). Recap card 218.75px, mix card
196.875px.

**Horizontal scroll:** none on either viewport
(`scrollWidth === innerWidth` at both 390px and 1440px).

**Mobile scroll height:** `document.documentElement.scrollHeight` = **1996px** on the 390×844
viewport — above the plan's ~1300px (1.5-screen) target (≈2.35 screens at 844px viewport height).
Not auto-trimmed: the plan explicitly asks to report the real number and propose a trim rather
than silently ship or silently cut content, and Task 3 (human checkpoint) is where layout/vertical
rhythm gets a call. Proposed trim if the user wants it shorter: tighten the `mt-10`/`mt-12`
spacers between the four sections (recap card, nav, mix card) to `mt-6`/`mt-8`, and/or reduce the
recap-card aspect ratio from `16/10` to `16/9`. Rough savings: ~150-200px from spacing, ~60-80px
from the aspect-ratio change — would land close to the target without touching content.

**Sitemap:** `curl http://localhost:3000/sitemap.xml` contains exactly one
`https://small-records.com/links/` entry with `<priority>0.6</priority>`.

**Static export:** built in a scratchpad APFS clone (`npx next build` — not run in the project
directory, dev server left untouched). `out/links/index.html` exists, `out/sitemap.xml` contains
`/links/`.

**Screenshots:**
- `/private/tmp/claude-501/-Users-myltonvanbolderen-small-record/54b5f0cd-5a66-4186-b337-6738006c59de/scratchpad/links/iphone13.png` (390×844, full page)
- `/private/tmp/claude-501/-Users-myltonvanbolderen-small-record/54b5f0cd-5a66-4186-b337-6738006c59de/scratchpad/links/desktop.png` (1440×900, full page)

Note: these live in the session-scoped scratchpad, not the repo — they will not survive beyond
this session unless copied elsewhere before the environment is torn down.

## Commit

- `137d0c2` — `feat(links): own link-in-bio page at /links`
  (`app/links/page.tsx`, `app/sitemap.ts`, `components/magazine/CopyLinkButton.tsx`,
  `components/magazine/LinkRow.tsx`, `public/images/mix-pool-party.jpg`)

`git status --short` after the commit shows only pre-existing untracked planning/tooling
directories (`.claude/`, `.planning/quick/…`) — nothing unexpected was staged.

## Known Stubs

None. Every link resolves to a real, live URL; no placeholder content.

## Threat Flags

None. `/links/` is a static page with the same trust boundary as the rest of the site (no new
network endpoints, no new auth paths, no schema changes). All external links use plain `https://`
or `mailto:` with standard `rel` hardening — no new surface introduced beyond what the plan's
`<threat_model>`-equivalent constraints already covered (plain-https-only, no custom schemes).

## Not done (by design — Task 3 is a human checkpoint)

Task 3 (human-verify checkpoint) was intentionally left for the orchestrator/user: reviewing the
two screenshots, confirming wording/row order, and deciding whether to accept the 1996px mobile
scroll height as-is or ask for the trim proposed above. No deploy was performed.

## Self-Check: PASSED

- `app/links/page.tsx` — FOUND
- `components/magazine/LinkRow.tsx` — FOUND
- `components/magazine/CopyLinkButton.tsx` — FOUND
- `app/sitemap.ts` (modified) — FOUND
- `public/images/mix-pool-party.jpg` — FOUND (tracked in git)
- `public/images/_w/640/mix-pool-party.webp`, `1080/`, `1280/`, `1920/` — FOUND
- commit `137d0c2` — FOUND in `git log --oneline`
- `out/links/index.html` in scratchpad build clone — FOUND
