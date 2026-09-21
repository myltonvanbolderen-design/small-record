---
phase: quick-260921-on4
plan: 01
subsystem: seo
tags: [nextjs, metadata, opengraph, json-ld, sitemap, robots, schema-org]

requires:
  - phase: quick-260921-odr
    provides: Perf/security audit lot A (Next 15.5.25, lazy videos)
provides:
  - Per-page share metadata (og:title/description/url/image + canonical) for all 5 public pages
  - lib/seo.ts pageMetadata() helper
  - Static sitemap.xml (5 URLs) and robots.txt
  - Crawlable Footer nav to all public routes
  - mailto links for casae@/letche@/contact@
  - English site language (lang="en", og:locale en_US)
  - Enriched MusicGroup JSON-LD + MusicEvent JSON-LD (Panic Room, Gambetta)
affects: [seo, sharing, deployment]

tech-stack:
  added: []
  patterns:
    - "pageMetadata() helper in lib/seo.ts for consistent per-page OpenGraph/Twitter/canonical metadata (Next does not deep-merge openGraph across layout/page)"
    - "app/sitemap.ts and app/robots.ts use explicit path lists with `export const dynamic = 'force-static'` for static export compatibility"

key-files:
  created:
    - lib/seo.ts
    - app/sitemap.ts
    - app/robots.ts
    - public/og/og-casae.jpg
    - public/og/og-letche.jpg
    - public/og/og-label.jpg
    - public/og/og-events.jpg
  modified:
    - app/layout.tsx
    - app/page.tsx
    - app/casae/page.tsx
    - app/letche/page.tsx
    - app/small-record/page.tsx
    - app/events/page.tsx
    - components/layout/Footer.tsx

key-decisions:
  - "Used ffmpeg scale+crop (1200:-2, crop 1200:630, centered, -q:v 3) for share images instead of manual export, to match existing asset pipeline conventions"
  - "sitemap.ts/robots.ts use explicit hardcoded path arrays rather than filesystem route discovery, so /v2 and /carousel (dev-only routes) are never advertised"
  - "Layout openGraph kept as fallback only (no alternates/canonical), so 404 and other non-metadata pages don't inherit a wrong canonical"

patterns-established:
  - "pageMetadata({ title, ogTitle, description, path, image }) is the single source of truth for per-page share metadata; new pages should use it"

requirements-completed: [PHASE-5-SEO-SHARING]

duration: ~20min
completed: 2026-09-21
---

# Quick Task 260921-on4: Audit Lot B — SEO & Sharing Summary

**Per-page OpenGraph/canonical metadata via a new `lib/seo.ts` helper, static sitemap.xml/robots.txt, crawlable Footer nav, mailto booking emails, English locale, and enriched MusicGroup/MusicEvent JSON-LD — verified against the local dev server and a clean `next build` in an isolated scratchpad copy.**

## Performance

- **Duration:** ~20 min
- **Completed:** 2026-09-21
- **Tasks:** 3/3
- **Files modified:** 13 (7 created, 6 modified across the 3 commits, plus Footer.tsx)

## Accomplishments

- Each of the 5 public pages (`/`, `/casae/`, `/letche/`, `/small-record/`, `/events/`) now emits its own distinct `og:title`, `og:description`, `og:url`, `og:image`, and a trailing-slash canonical link via `lib/seo.ts`'s `pageMetadata()` helper.
- Generated 4 new 1200x630 share images (`public/og/og-{casae,letche,label,events}.jpg`) via ffmpeg scale+center-crop from existing source photos; home page keeps its existing `/og-image.jpg` (1200x800).
- `app/sitemap.ts` and `app/robots.ts` (both `force-static`) publish an explicit 5-URL sitemap and a robots.txt allowing all crawlers and pointing to the sitemap — `/v2` and `/carousel` are never listed since the sitemap uses a hardcoded path array.
- Footer now has a crawlable `<nav aria-label="Footer">` linking to all 5 public routes (previously `/small-record/` had zero internal links pointing to it in the DOM at all times, since Header nav only renders when the overlay menu is open).
- `casae@`, `letche@`, `contact@` booking emails are now `mailto:` links (previously plain, unclickable text).
- Site language switched from French to English: `<html lang="en">`, `og:locale: en_US` everywhere.
- Layout `MusicGroup` JSON-LD enriched with `logo`, `image`, `email`, member `url`s pointing to small-records.com artist pages + SoundCloud `sameAs`, and a YouTube `sameAs` entry.
- `/events` now emits a `MusicEvent` JSON-LD array (2 objects: "Small Party — Small Records × Panic Room" and "Early Reflections × Small Records — Gambetta Club") with dates, venue addresses, performers, and organizers.
- Verified `next build` succeeds in an isolated scratchpad copy (to avoid corrupting the running dev server's `.next`), confirming `out/sitemap.xml` and `out/robots.txt` exist and contain no reference to `v2` or `carousel`.

## Task Commits

1. **Task 1: Per-page share images + metadata helper + page metadata, lang en** - `a7ece0a` (feat)
2. **Task 2: sitemap.xml + robots.txt, Footer internal nav, mailto emails** - `a46db83` (feat)
3. **Task 3: JSON-LD MusicGroup enrichment + MusicEvent on /events, final build check** - `9bbb4d8` (feat)

_No plan-metadata commit was made per this task's constraints (SUMMARY.md/STATE.md/PLAN.md/ROADMAP.md are not committed for this quick task)._

## Files Created/Modified

- `lib/seo.ts` - `pageMetadata()` helper + `SITE_URL` constant, builds full openGraph/twitter/canonical metadata per page
- `app/sitemap.ts` - Explicit 5-path static sitemap (`force-static`)
- `app/robots.ts` - Static robots.txt, allow all, points to sitemap.xml (`force-static`)
- `public/og/og-casae.jpg`, `og-letche.jpg`, `og-label.jpg`, `og-events.jpg` - 1200x630 share images generated via ffmpeg
- `app/layout.tsx` - `lang="en"`, fallback openGraph updated (locale en_US, url `/`), MusicGroup JSON-LD enriched
- `app/page.tsx`, `app/casae/page.tsx`, `app/letche/page.tsx`, `app/small-record/page.tsx` - Replaced bare `metadata` object with `pageMetadata({...})`
- `app/events/page.tsx` - `pageMetadata({...})` + `eventsJsonLd` array rendered as `<script type="application/ld+json">`
- `components/layout/Footer.tsx` - Added crawlable `<nav aria-label="Footer">` with links to all 5 routes; raised external link opacity from `blanc/30` to `blanc/50`; removed unused `Image` import, added `Link`

## Decisions Made

- ffmpeg `scale=1200:-2,crop=1200:630` (no x/y offset = centered crop) with `-q:v 3` for share images — matches the project's existing ffmpeg-based asset pipeline (per CLAUDE.md conventions) rather than introducing a new image tool.
- Descriptions were re-checked with `node` for 140–160 character length before writing (home: 158, casae: 156, letche: 157, label: 156, events: 154 — all within range).
- Final `next build` was run against an isolated rsync copy in the scratchpad (excluding `.next`, `out`, `public/asset`, `node_modules`, with `node_modules` symlinked back) per this task's explicit constraint not to touch the running dev server's `.next` directory. Build succeeded there without disturbing the dev server (confirmed still returning HTTP 200 afterward).

## Deviations from Plan

None - plan executed exactly as written. All 3 tasks matched their `<action>` and `<done>` criteria without requiring Rule 1-4 fixes.

## Issues Encountered

None.

## Verification Results

**tsc:** `npx tsc --noEmit` clean after every task.

**OG images (sips):**
| File | Width | Height |
|---|---|---|
| og-casae.jpg | 1200 | 630 |
| og-events.jpg | 1200 | 630 |
| og-label.jpg | 1200 | 630 |
| og-letche.jpg | 1200 | 630 |

**Per-page metadata (curl localhost:3000, dev server):**

| Path | lang | canonical | og:title | og:url | og:image | og:locale |
|---|---|---|---|---|---|---|
| `/` | en | `https://small-records.com/` | Small Records — DJ crew & label, Paris | `https://small-records.com/` | `/og-image.jpg` | en_US |
| `/casae/` | en | `https://small-records.com/casae/` | Casae \| Small Records | `https://small-records.com/casae/` | `/og/og-casae.jpg` | en_US |
| `/letche/` | en | `https://small-records.com/letche/` | Letche \| Small Records | `https://small-records.com/letche/` | `/og/og-letche.jpg` | en_US |
| `/small-record/` | en | `https://small-records.com/small-record/` | The Label \| Small Records | `https://small-records.com/small-record/` | `/og/og-label.jpg` | en_US |
| `/events/` | en | `https://small-records.com/events/` | Events \| Small Records | `https://small-records.com/events/` | `/og/og-events.jpg` | en_US |

Home `<title>` confirmed not doubled: `Small Records — DJ crew &amp; label, Paris`.

**sitemap.xml** (localhost:3000/sitemap.xml): lists exactly 5 URLs (`/`, `/small-record/`, `/casae/`, `/letche/`, `/events/`), each with `lastmod`, `changefreq: monthly`, `priority` (1 for home, 0.8 for others).

**robots.txt** (localhost:3000/robots.txt):
```
User-Agent: *
Allow: /

Sitemap: https://small-records.com/sitemap.xml
```

**Footer nav** (on `/small-record/`): `<nav aria-label="Footer">` contains `href="/"`, `href="/small-record/"`, `href="/casae/"`, `href="/letche/"`, `href="/events/"`.

**mailto links:** `/casae/` → `mailto:casae@small-records.com`; `/letche/` → `mailto:letche@small-records.com`; `/small-record/` → `mailto:contact@small-records.com`.

**JSON-LD:** `/events/` contains 2 `"@type":"MusicEvent"` occurrences; home page contains `youtube.com/@SmallRecords_Music` in the MusicGroup `sameAs` array; layout JSON-LD contains `logo`, `image`, and `email` fields pointing to small-records.com assets.

**Build (scratchpad, isolated from dev server):**
```
▲ Next.js 15.5.25
✓ Compiled successfully in 3.5s
✓ Generating static pages (14/14)
✓ Exporting (2/2)
```
- `out/sitemap.xml` exists, `out/robots.txt` exists.
- Neither file contains `v2` or `carousel`.
- `out/events/index.html` contains `MusicEvent` (grep -c → 1 matching line, both objects on that line).
- Dev server on port 3000 confirmed still responding `200` after the isolated build (untouched).

## User Setup Required

None - no external service configuration required. Out of scope per plan: www→apex redirect (Vercel setting) and ImprovMX mailbox checks remain for a future session (already tracked in project CLAUDE.md TODO).

## Next Phase Readiness

- SEO/sharing foundation (Phase 5 roadmap criteria) is complete and build-verified; safe to deploy with `vercel --prod` when the user is ready (not done in this task per constraints).
- Remaining project TODOs (email redirects, real Events timeline content, mobile device testing) are unrelated to this task and untouched.

---
*Quick task: 260921-on4*
*Completed: 2026-09-21*

## Self-Check: PASSED

All 15 files (lib/seo.ts, app/sitemap.ts, app/robots.ts, 4 og/*.jpg, app/layout.tsx, 5 page.tsx files, components/layout/Footer.tsx, this SUMMARY.md) confirmed present on disk. All 3 task commits (a7ece0a, a46db83, 9bbb4d8) confirmed present in git log.
