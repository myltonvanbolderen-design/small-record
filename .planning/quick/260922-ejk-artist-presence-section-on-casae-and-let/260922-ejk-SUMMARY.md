---
phase: quick-260922-ejk
plan: 01
subsystem: ui
tags: [nextjs, tailwind, next-image, static-export, magazine-grid, scroll-anchor]

requires: []
provides:
  - "lib/presence.ts: EVENTS map + per-artist PRESENCE lists (single source of truth for artist live history)"
  - "components/magazine/ArtistPresence.tsx: compact 3-card 'Presence' section replacing the big ArtistLive 'On stage' block on /casae/ and /letche/"
  - "Anchors panic-room, gambetta-club, fete-de-la-musique on /events/ sections (scroll-mt-20)"
  - "Fixed: ScrollToTop no longer overrides #anchor scroll on route change"
affects: [casae-page, letche-page, events-page, navigation]

tech-stack:
  added: []
  patterns:
    - "Data/view split for repeated artist content: lib/presence.ts holds EVENTS + PRESENCE constants, ArtistPresence.tsx is a pure server component reading from it — adding a future event is one EVENTS entry + one PRESENCE entry per artist + one section id on /events/"
    - "object-position tuned per-photo as full literal Tailwind arbitrary-value strings (never concatenated) so Tailwind v4's source scanner picks them up"

key-files:
  created:
    - lib/presence.ts
    - components/magazine/ArtistPresence.tsx
  modified:
    - app/casae/page.tsx
    - app/letche/page.tsx
    - app/events/page.tsx
    - components/layout/ScrollToTop.tsx
    - /Users/myltonvanbolderen/CLAUDE.md (outside repo, not committed)
  removed:
    - components/magazine/ArtistLive.tsx
    - public/images/panic-room/letche-lessovik.jpg

key-decisions:
  - "Casæ's two landscape thumbnails needed positions not specified in the plan (panic-room, fete-de-la-musique) — read both JPGs directly, measured face position visually, set object-[65%_center] and object-[40%_center] respectively; verified correct via Playwright screenshots on first attempt, no re-tuning needed"
  - "Global :focus-visible style in globals.css already covers Link focus state — skipped adding a redundant focus-visible:outline class per plan's own fallback instruction"

patterns-established: []

requirements-completed: [QUICK-260922-ejk]

duration: ~35min
completed: 2026-09-22
---

# Quick Task 260922-ejk: Artist Presence section on Casæ and Letché Summary

**Replaced the large Panic Room "On stage" block on /casae/ and /letche/ with a compact 3-card "Presence" section (every event the artist played, newest first, linking to /events/#anchor) driven by a single lib/presence.ts data file — and fixed a pre-existing bug where ScrollToTop was silently cancelling all #anchor navigation.**

## Performance

- **Duration:** ~35 min
- **Completed:** 2026-09-22T10:35:00Z
- **Tasks:** 2
- **Files modified:** 5 code files (+ 1 file removed, + 1 image removed, + CLAUDE.md outside repo)

## Accomplishments
- `lib/presence.ts`: typed `EVENTS` map (Panic Room, Gambetta Club, Fête de la Musique — name/date/venue/href) and `PRESENCE` record with newest-first photo entries for both artists.
- `components/magazine/ArtistPresence.tsx`: server component rendering a `SectionHeader` ("Presence" / "Where {name} played") + a 3-column `aspect-[4/5]` photo grid, each card a `Link` to `/events/#<anchor>`, hover scale + terracotta title color, no overlay.
- `/casae/` and `/letche/`: `ArtistLive` import and usage replaced with `ArtistPresence artist="casae|letche" name="Casæ|Letché"`, `HorizontalRule` before it kept.
- `/events/`: added `id="panic-room"`, `id="gambetta-club"`, `id="fete-de-la-musique"` + `scroll-mt-20` to the three matching `<section>` elements.
- Removed `components/magazine/ArtistLive.tsx` and the now-unused `public/images/panic-room/letche-lessovik.jpg` (confirmed via grep no remaining references anywhere in app/components/lib/tools).
- Playwright verification (iPhone 13 + 1440×900, both artist pages): 0 broken images, 0 horizontal overflow, all 6 `object-position` computed styles matched `lib/presence.ts` literals exactly on the first pass — no crop tuning needed.
- **Found and fixed a blocking bug**: `components/layout/ScrollToTop.tsx` called `window.scrollTo(0, 0)` on every route change, which raced with and cancelled the browser's native scroll-to-hash, so clicking a Presence card never actually landed on the target section. Fixed by skipping the reset when the new URL carries a `#hash`. Re-verified: all three anchors (mobile card click, desktop card click, direct `/events/#fete-de-la-musique` goto) now land with the target `<h2>` visible below the fixed header.
- `npx tsc --noEmit` and `npm run lint` pass with 0 errors after both commits.

## Task Commits

1. **Task 1: Presence data + component, wire into artist pages, anchors on /events/, remove ArtistLive** - `ebd18f9` (feat)
2. **Task 2 (deviation, Rule 1/3): Fix ScrollToTop cancelling #anchor scroll** - `1cce319` (fix)

No separate "tune Presence thumbnail crops" commit was needed — all 6 `object-position` values were correct on the first Playwright pass (see Deviations below for the one non-crop fix that was required).

**Plan metadata:** not committed by this executor per instructions (orchestrator commits SUMMARY.md/STATE.md).

## Files Created/Modified
- `lib/presence.ts` - `EVENTS` (id/name/date/venue/href per event) + `PRESENCE` (newest-first photo entries per artist), single source of truth
- `components/magazine/ArtistPresence.tsx` - Compact 3-card Presence section, server component, `next/image` + custom WebP loader, `AnimatedSection` around the header text only
- `app/casae/page.tsx` - `ArtistLive` → `ArtistPresence artist="casae" name="Casæ"`
- `app/letche/page.tsx` - `ArtistLive` → `ArtistPresence artist="letche" name="Letché"`
- `app/events/page.tsx` - `id` + `scroll-mt-20` added to the Panic Room, Gambetta Club, and Fête de la Musique sections
- `components/layout/ScrollToTop.tsx` - Skip `scrollTo(0,0)` when the new URL has a `#hash`, so anchor navigation from Presence cards (and any other `#hash` link) works
- `components/magazine/ArtistLive.tsx` - Removed (no longer used anywhere)
- `public/images/panic-room/letche-lessovik.jpg` - Removed (only consumer was the removed ArtistLive usage)
- `/Users/myltonvanbolderen/CLAUDE.md` - Architecture tree updated (`ArtistPresence` in magazine/ list, `presence.ts` in lib/ list), NOT committed to git (lives outside the repo)

## Decisions Made
- Casæ's two landscape photo positions (`casae-pro.jpg` for Panic Room, `casae-live.jpg` for Fête de la Musique) were left as guesses in the plan; read both images directly, visually located the face, and set `object-[65%_center]` / `object-[40%_center]` respectively. Playwright screenshots confirmed both crops keep Casæ's face fully visible with no re-tuning needed.
- Skipped adding an explicit `focus-visible:outline` class on the card `Link`s: `app/globals.css` already defines a global `:focus-visible { outline: 2px solid var(--color-blanc); outline-offset: 3px }` that covers all interactive elements, matching the plan's own stated fallback ("if globals.css already provides a global :focus-visible style, skip").

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] ScrollToTop cancelled #anchor scroll on route change**
- **Found during:** Task 2 (Playwright anchor-click verification)
- **Issue:** `components/layout/ScrollToTop.tsx` ran `window.scrollTo(0, 0)` in a `useEffect` on every `pathname` change. This raced with (and always won against) the browser/Next.js scroll-to-hash behavior, so navigating to `/events/#panic-room` etc. always landed at the very top of the page instead of at the target section — silently breaking every `#anchor` link on the site, not just the new Presence cards. This directly blocked the plan's own must-have truth ("Clicking a card goes to /events/#anchor and the event heading is visible below the fixed header").
- **Fix:** Added a guard: `if (window.location.hash) return` before the `scrollTo(0, 0)` call, so the reset only fires on hash-less navigations.
- **Files modified:** `components/layout/ScrollToTop.tsx`
- **Verification:** Re-ran the Playwright script; all three anchor checks (`panic-room` via mobile card click, `gambetta-club` via desktop card click, `fete-de-la-musique` via direct goto) now report the target `<h2>`'s `top` between the fixed header's bottom and the viewport height. Screenshots saved (see below).
- **Committed in:** `1cce319`

---

**Total deviations:** 1 auto-fixed (1 blocking bug, pre-existing, outside the plan's stated file list but required to satisfy the plan's own verification criteria)
**Impact on plan:** Necessary fix — without it, the entire "click a card, land on the anchor" feature (the core purpose of linking cards to `/events/`) would not work for any page on the site, not just the two touched by this plan. No scope creep: single 2-line guard, no other behavior changed.

## Issues Encountered
None beyond the ScrollToTop deviation above.

## User Setup Required

None - no external service configuration required. Not deployed (`vercel --prod` intentionally not run); dev server on :3000 left running untouched throughout, no `npm install` performed.

## Verification Results

- `npx tsc --noEmit`: 0 errors (both commits).
- `npm run lint`: 0 errors (both commits).
- `grep -rn "ArtistLive\|letche-lessovik" app components lib tools`: no matches (only the deleted file's own identifier text, confirmed gone after `git rm`).
- `grep -c 'id="panic-room"\|id="gambetta-club"\|id="fete-de-la-musique"' app/events/page.tsx`: 3.
- Playwright (iPhone 13 + 1440×900, /casae/ and /letche/): 0 broken images, 0 horizontal overflow (`scrollWidth === innerWidth` on all 4 combinations), 6/6 `object-position` computed styles match `lib/presence.ts` literals exactly.
- Face review (all 6 thumbnails, read via screenshots): correct named artist visible and well-framed in every card — Casæ (curly hair, mustache, red NY cap/Panic Room, olive jacket/Gambetta, sunglasses+white tee/Fête); Letché (mullet, thin mustache, white flame cap+Diesel tee/Panic Room, red Adidas jacket+flame cap, left person/Gambetta, tank top, left person/Fête).
- Anchor clicks: mobile card click → `/events/#panic-room`, desktop card click → `/events/#gambetta-club`, direct goto → `/events/#fete-de-la-musique` — all three land with the section heading visible below the fixed header (confirmed via `getBoundingClientRect()` and screenshots).

### Screenshot paths (for orchestrator review)
All under `/private/tmp/claude-501/-Users-myltonvanbolderen-small-record/54b5f0cd-5a66-4186-b337-6738006c59de/scratchpad/presence/`:
- `casae-mobile.png`, `casae-desktop.png` - full Presence section, /casae/
- `letche-mobile.png`, `letche-desktop.png` - full Presence section, /letche/
- `casae-card1-mobile.png` / `card2` / `card3` - single-card close-ups, /casae/ (Panic Room, Gambetta Club, Fête de la Musique)
- `letche-card1-mobile.png` / `card2` / `card3` - single-card close-ups, /letche/ (Panic Room, Gambetta Club, Fête de la Musique)
- `panic-room-landing.png` - post-click landing on /events/#panic-room (mobile)
- `gambetta-club-landing.png` - post-click landing on /events/#gambetta-club (desktop)
- `fete-de-la-musique-landing.png` - direct-goto landing on /events/#fete-de-la-musique (desktop)

## Next Phase Readiness
- Code committed (`ebd18f9`, `1cce319`), tsc/lint green, dev server untouched, nothing deployed.
- Adding a future live event going forward is: one `EVENTS` entry in `lib/presence.ts` + one `PRESENCE` entry per artist who played it + one matching `id`/`scroll-mt-20` on the target `/events/` section.
- Remaining project TODOs (per CLAUDE.md): configure email redirects on small-records.com, fill in the real "Coming soon" timeline, test on a real mobile device.

---
*Phase: quick-260922-ejk*
*Completed: 2026-09-22*

## Self-Check: PASSED

- FOUND: lib/presence.ts
- FOUND: components/magazine/ArtistPresence.tsx
- FOUND: ArtistLive.tsx removed
- FOUND: letche-lessovik.jpg removed
- FOUND: ScrollToTop hash guard (components/layout/ScrollToTop.tsx)
- FOUND: commit ebd18f9
- FOUND: commit 1cce319
- FOUND: 13 screenshots in scratchpad/presence/
