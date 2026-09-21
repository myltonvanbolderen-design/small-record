---
phase: quick-260921-odr
plan: 01
subsystem: perf-security
tags: [nextjs, ffmpeg, video, intersection-observer, tailwind-v4, npm-audit, static-export]

requires: []
provides:
  - "9 event-loop videos re-encoded to H.264 576w yuv420p, no audio, faststart (35M -> 24M)"
  - "Viewport-gated VideoLoop (IntersectionObserver, rootMargin 200px, preload=none, src attached only on approach)"
  - "Lazy-loaded, titled YouTube/SoundCloud iframes"
  - "CSS-only PageTransition (.page-enter keyframe), no JS-gated opacity in server HTML"
  - "v2 doodle fonts (petit-cochon, lazy-dog) scoped to /v2 only, out of root layout"
  - "next pinned 15.5.25 (from 15.5.14), npm audit --omit=dev: 0 critical"
affects: [events-page, home-page, casae-page, letche-page, v2-route, deps]

tech-stack:
  added: []
  patterns:
    - "VideoLoop: no src/autoPlay on initial render; IntersectionObserver attaches src and calls play() only when within 200px of viewport, pauses on exit"
    - "PageTransition converted from client 'motion' component to a server component using a CSS @keyframes entrance class, respecting prefers-reduced-motion"
    - "Tailwind v4 @theme inline for CSS custom properties that must resolve at the element (v2 font wrapper) instead of :root, since the underlying next/font variable is no longer global"

key-files:
  created:
    - app/v2/layout.tsx
  modified:
    - public/videos/casae-sornettes.mp4
    - public/videos/letche-sornettes.mp4
    - public/videos/gambetta-casae.mp4
    - public/videos/gambetta-duo.mp4
    - public/videos/gambetta-silhouette.mp4
    - public/videos/panic-casae.mp4
    - public/videos/panic-lessovik.mp4
    - public/videos/panic-letche.mp4
    - public/videos/panic-momal.mp4
    - components/magazine/VideoLoop.tsx
    - components/magazine/YouTubeEmbed.tsx
    - components/magazine/SoundCloudEmbed.tsx
    - components/animation/PageTransition.tsx
    - app/globals.css
    - app/layout.tsx
    - package.json
    - package-lock.json

key-decisions:
  - "panic-lessovik.mp4 source was yuvj420p (full color range); added -color_range tv to the ffmpeg re-encode so the output is true yuv420p/limited-range like the other 8 files, matching the plan's must_have"
  - "Used transform: none (not translateY(0)) in the page-enter 'to' keyframe as the plan recommended, to avoid creating a containing block for position:fixed descendants (app/v2/page.tsx has a fixed badge rendered inside PageTransition)"
  - "Did not run npm audit fix / npm audit fix --force for the 4 remaining high/moderate advisories (nanoid, postcss via next's own bundled copy, sharp) — postcss fix requires a breaking next@16 upgrade, explicitly out of scope for this task which pins next@15.5.25 exact"
  - "Verified all runtime behavior (Task 2 and Task 3) via a disposable temporary dev server on port 3099, never touching the user's port-3000 process, because that process was already returning 500 on all routes independent of this task's changes (confirmed by testing the same code on the fresh instance, which served everything correctly)"

requirements-completed: [PHASE4-SC1, PHASE4-SC2, PHASE4-SC3, PHASE4-SC4]

duration: ~25min
completed: 2026-09-21
---

# Quick Task 260921-odr: Audit Lot A (Perf and Security) Summary

**Re-encoded all 9 /events loop videos to H.264 576w/no-audio/faststart (35M -> 24M), made VideoLoop viewport-gated via IntersectionObserver, lazy-loaded YouTube/SoundCloud iframes, replaced the JS-gated PageTransition opacity with a CSS-only entrance, scoped the v2 doodle fonts out of the root layout, and bumped next to 15.5.25 to clear the critical advisory.**

## Performance

- **Duration:** ~25 min
- **Completed:** 2026-09-21T15:42:14Z
- **Tasks:** 3 (4 commits)
- **Files modified:** 9 videos, 5 runtime components/styles, 3 font-scoping files, 2 dependency files

## Accomplishments

- **Task 1 — Video re-encode:** All 9 files in `public/videos/` backed up to gitignored `public/asset/videos-backup/`, then re-encoded from the backups (`ffmpeg -vf scale=576:-2 -c:v libx264 -profile:v high -pix_fmt yuv420p -crf 26 -preset slow -an -movflags +faststart`). Sornettes clips (HEVC 1080p10 + AAC audio, -90° rotation tag) autorotated correctly into upright 576x1024 H.264 with no audio — verified visually via extracted frames. `panic-lessovik.mp4` needed an added `-color_range tv` flag (source was full-range `yuvj420p`) to land on true `yuv420p`. Total `public/videos/` size: 35M -> 24M.
- **Task 2 — Runtime lazy-loading:** `VideoLoop` no longer renders `autoPlay`/`<source>`; it starts with `preload="none"` and no `src`, then an `IntersectionObserver` (rootMargin `200px 0px`) attaches `src` and calls `.play()` only when the element nears the viewport, pausing on exit. `YouTubeEmbed`/`SoundCloudEmbed` gained `loading="lazy"` and an optional `title` prop with sensible defaults (existing callers unaffected). `PageTransition` dropped `'use client'` and `motion` entirely, now a plain server component wrapping children in `.page-enter` (CSS `@keyframes`, `prefers-reduced-motion` disables it) — server HTML has no inline `opacity:0` gate.
- **Task 3 — Fonts + deps:** Root `app/layout.tsx` no longer imports/applies `petitCochon`/`lazyDog`; new `app/v2/layout.tsx` wraps `/v2` children in a div carrying just those two font variables. `app/globals.css` moved `--font-pig`/`--font-dog` into a separate `@theme inline` block so the utility resolves at the element (inside the v2 wrapper) rather than `:root` (where the variable would now be undefined). Verified via CSS output: `.font-pig` resolves to `var(--font-petit-cochon)`, and the `<html>` class list on `/` no longer includes the doodle font classes. `next` bumped from `15.5.14` to `15.5.25` (exact pin); `npm audit --omit=dev` now reports 0 critical (4 remaining: 1 moderate + 3 high — `nanoid`, `postcss` via next's bundled copy, `sharp`; postcss fix needs a breaking `next@16` upgrade, out of scope). `npx next build` succeeds, including `/v2` and `/carousel` routes.

## Task Commits

1. **Task 1: Re-encode all 9 looping videos** - `0c1347d` (perf)
2. **Task 2: Viewport-gated VideoLoop, lazy titled iframes, CSS-only PageTransition** - `db09137` (perf)
3. **Task 3a: Scope v2 fonts to /v2** - `a5649f6` (perf)
4. **Task 3b: Bump next to 15.5.25** - `9549c6b` (fix)

## Files Created/Modified

- `public/videos/{casae,letche}-sornettes.mp4`, `public/videos/gambetta-{casae,duo,silhouette}.mp4`, `public/videos/panic-{casae,lessovik,letche,momal}.mp4` - Re-encoded H.264 576w yuv420p, no audio, faststart
- `components/magazine/VideoLoop.tsx` - Viewport-gated via IntersectionObserver, `preload="none"`, no autoplay
- `components/magazine/YouTubeEmbed.tsx` / `SoundCloudEmbed.tsx` - `loading="lazy"` + `title` prop
- `components/animation/PageTransition.tsx` - CSS-only entrance, no client JS
- `app/globals.css` - `.page-enter` keyframes + reduced-motion override; `--font-pig`/`--font-dog` moved to `@theme inline`
- `app/layout.tsx` - Removed petitCochon/lazyDog from imports and `<html>` className
- `app/v2/layout.tsx` - New: scopes doodle font variables to `/v2`
- `package.json` / `package-lock.json` - `next` 15.5.14 -> 15.5.25 (exact)

## Decisions & Deviations

- **[Deviation, in-scope fix] panic-lessovik.mp4 color range:** source was full-range `yuvj420p`; added `-color_range tv` to the ffmpeg command for this one file so it lands on true limited-range `yuv420p` like the plan's must_have requires and like the other 8 files. No plan text changed, just an ffmpeg flag addition to hit the stated target.
- **[Deviation, environment] Port-3000 dev server was already crashing (500 on every route, including static-only routes like `/favicon.ico`) before any edits in this session were verified.** Rather than touching that process (explicitly forbidden), all Task 2/3 curl verifications were run against a disposable temporary `next dev --turbopack` instance on port 3099, which served everything correctly with the same code — confirming the code is fine and the port-3000 process itself needs a restart, independent of this task.
- No architectural changes; no npm audit fix/force run (out of scope, would require a next@16 breaking upgrade for the postcss advisory).

## Next Phase Readiness

- Four commits ready: `0c1347d`, `db09137`, `a5649f6`, `9549c6b`.
- **Dev server on port 3000 needs a manual restart** (`npx next dev --turbopack --port 3000`) — it is unresponsive (500 on all routes) independent of this task's changes; the code itself was fully verified working via a temporary instance.
- No deploy performed (per instructions).
- Remaining npm audit items (nanoid, postcss-via-next, sharp) are pre-existing, non-critical, and out of this task's scope; the postcss one requires a breaking next@16 upgrade to fully clear.

---
*Phase: quick-260921-odr*
*Completed: 2026-09-21*

## Self-Check: PASSED

- FOUND: public/videos/casae-sornettes.mp4
- FOUND: components/magazine/VideoLoop.tsx
- FOUND: components/animation/PageTransition.tsx
- FOUND: app/v2/layout.tsx
- FOUND: app/globals.css
- FOUND: commit 0c1347d
- FOUND: commit db09137
- FOUND: commit a5649f6
- FOUND: commit 9549c6b
