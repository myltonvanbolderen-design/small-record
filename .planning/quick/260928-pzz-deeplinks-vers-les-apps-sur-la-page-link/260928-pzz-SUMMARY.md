---
phase: quick/260928-pzz
plan: 01
subsystem: ui
tags: [deeplinks, in-app-browser, next.js, client-component, playwright]

requires: []
provides:
  - "Pure deeplink data module (lib/app-links.ts) keyed by https href, with UA-based in-app-browser detection"
  - "AppLink client anchor that attempts instagram:// / youtube:// / intent:// schemes only inside social in-app webviews, with a cancellable ~900ms iOS fallback timer and OS-owned Android fallback"
  - "LinkRow optional app prop wiring 5 external /links/ rows to native app deeplinks with zero visual/behavioural change outside in-app browsers"
affects: [links-page, seo]

tech-stack:
  added: []
  patterns:
    - "UA-gated client-side deeplink escape from in-app webviews: detect via regex on navigator.userAgent inside the click handler only (never render), preventDefault + location.href to a custom scheme, with a cancellable setTimeout fallback to the plain https href"
    - "intent:// URL builder with S.browser_fallback_url so Android's OS handles the fallback with no JS timer"

key-files:
  created:
    - lib/app-links.ts
    - components/magazine/AppLink.tsx
  modified:
    - components/magazine/LinkRow.tsx
    - app/links/page.tsx

key-decisions:
  - "Both SoundCloud rows keep ios: null — soundcloud://users:ID is not a parseable URL (throws synchronously on location.href assignment), and no verified alternate scheme exists; iOS in-app users keep the plain https navigation for these two rows only"
  - "Fragment (#Intent;...;end) is not observable via Chromium requestfailed events, so the S.browser_fallback_url payload is asserted by a Node unit harness compiling lib/app-links.ts directly, not from the DOM"

patterns-established:
  - "Deeplink module pattern: pure data + detector in lib/, thin 'use client' anchor component, optional prop on the existing row component — no change to server-rendered markup when the prop is absent"

requirements-completed: [DEEPLINK-01, DEEPLINK-02, DEEPLINK-03, DEEPLINK-04, DEEPLINK-05, DEEPLINK-06]

duration: 35min
completed: 2026-09-28
---

# Quick Task 260928-pzz: Native app deeplinks on /links Summary

**The 5 external rows on `/links/` (Instagram, both SoundCloud profiles, YouTube channel, YouTube mix) now escape Instagram/TikTok/Facebook/Snapchat/LinkedIn/Twitter in-app webviews straight into the native app on iOS and Android, with zero change to behaviour in Safari, Chrome, desktop, or on a modified click.**

## Performance

- **Duration:** ~35 min
- **Completed:** 2026-09-28
- **Tasks:** 2/2
- **Files modified:** 4 (lib/app-links.ts, components/magazine/AppLink.tsx, components/magazine/LinkRow.tsx, app/links/page.tsx)

## Accomplishments

- New pure module `lib/app-links.ts`: `getInAppPlatform(ua)` UA detector (Android checked before iOS, since some Android in-app UAs also carry `like Mac OS X`) and `APP_LINKS` table keyed by the exact https hrefs rendered on `/links/`.
- New client component `components/magazine/AppLink.tsx`: renders a real `<a target="_blank" rel="noopener noreferrer">`, reads `navigator.userAgent` only inside the click handler (never at render — the page is statically exported), bails out on modified/non-left clicks, on iOS arms a cancellable 900ms fallback timer (cleared on `visibilitychange`/`pagehide`/`blur`/unmount) before attempting the custom scheme, on Android navigates straight to `intent://...;S.browser_fallback_url=...;end` with no timer.
- `LinkRow` gained an optional `app` prop that swaps the plain `<a>` for `<AppLink>` on the `external` branch only, keeping `RowContent` (and therefore all classes/markup) byte-identical; `internal` and `mail` branches are untouched.
- `app/links/page.tsx` wires `APP_LINKS[href]` into the 5 external rows (4 from the `LINKS` array + the standalone mix row); no change to labels, order, hrefs, or kinds.
- Proved the behaviour offline-deterministically with a Node unit harness (41 assertions over the compiled module) and a 4-user-agent Playwright suite (36 assertions) against the running dev server, with all external origins stubbed so no real network call to Instagram/SoundCloud/YouTube was made.

## Task Commits

1. **Task 1: Deeplink module, AppLink client anchor, LinkRow app prop, wire the 5 external rows** - `27d1d03` (feat)
2. **Task 2: Prove the behaviour with a Node unit harness + Playwright across 4 user agents** - no second commit (all checks passed on the first run, no fix needed to Task 1 files)

_No plan-metadata commit per this quick task's constraints (SUMMARY.md/STATE.md are not committed, ROADMAP.md is not touched)._

## Files Created/Modified

- `lib/app-links.ts` - `AppTarget` type, `getInAppPlatform(ua)`, `APP_LINKS` table (5 entries), private `intent()` builder
- `components/magazine/AppLink.tsx` - `'use client'` anchor with the deeplink-then-fallback click handler
- `components/magazine/LinkRow.tsx` - added optional `app?: AppTarget` prop, external branch delegates to `AppLink` when `app` is present
- `app/links/page.tsx` - imports `APP_LINKS`, passes `app={APP_LINKS[href]}` to the mapped rows and the mix row

## Deeplink Table Shipped

| Row (href, unchanged) | ios | android (intent://, all carry `S.browser_fallback_url`) |
|---|---|---|
| `https://www.instagram.com/smallmusics` | `instagram://user?username=smallmusics` | `intent://user?username=smallmusics#Intent;scheme=instagram;package=com.instagram.android;S.browser_fallback_url=...;end` |
| `https://soundcloud.com/casae` | `null` (unparseable `soundcloud://users:ID` scheme, see decision below) | `intent://soundcloud.com/casae#Intent;scheme=https;package=com.soundcloud.android;S.browser_fallback_url=...;end` |
| `https://soundcloud.com/letchetony` | `null` (same reason) | `intent://soundcloud.com/letchetony#Intent;scheme=https;package=com.soundcloud.android;S.browser_fallback_url=...;end` |
| `https://www.youtube.com/@SmallRecords_Music` | `youtube://www.youtube.com/@SmallRecords_Music` | `intent://www.youtube.com/@SmallRecords_Music#Intent;scheme=https;package=com.google.android.youtube;S.browser_fallback_url=...;end` |
| `https://youtu.be/X9rpsIVIVgk` | `youtube://X9rpsIVIVgk` | `intent://www.youtube.com/watch?v=X9rpsIVIVgk#Intent;scheme=https;package=com.google.android.youtube;S.browser_fallback_url=...;end` |

Internal rows (`/events/`, `/small-record/`, `/events/#panic-room`) and `mailto:contact@small-records.com` have no `AppTarget` entry and carry no `data-app-link` marker or handler — confirmed by browser check (e).

## Verification Results

**Static checks:**
- `npx tsc --noEmit` — 0 errors (run after Task 1 and again after Task 2)
- `npm run lint` — 0 errors (ESLint 9 flat config, `next/core-web-vitals` + `next/typescript`)
- `git diff --stat` after Task 1 — exactly the 4 planned files; `git diff package.json` empty (no dependency added)

**Unit harness** (`unit.mjs`, compiled `lib/app-links.ts` via `npx tsc`, no install) — **41/41 PASS, exit 0**:
- `getInAppPlatform` matrix: `null` for iPhone Safari UA / Pixel Chrome UA / Desktop Chrome UA / `undefined`; `'ios'` for iPhone + Instagram/FBIOS/LinkedInApp UA suffixes; `'android'` for Pixel + Instagram/BytedanceWebview UA suffixes
- `Object.keys(APP_LINKS)` exactly matches the 5 https URLs of the url_table
- Every `android` value: parses as a URL, starts with `intent://`, contains `;package=com.`, contains the exact `S.browser_fallback_url=` + `encodeURIComponent(key)` payload, ends with `;end`
- Every non-null `ios` value parses and uses scheme `instagram:` or `youtube:`; both SoundCloud entries confirmed `ios === null` (regression guard)

**Playwright browser checks** (`check.mjs`, Playwright 1.63 chromium, external origins stubbed offline) — **36/36 PASS, exit 0**:
- (a) Normal mobile UA (iPhone 13, no in-app marker): Instagram click opens a popup on the plain https URL, page stays on `/links/`, no `instagram://` requestfailed
- (b) iOS in-app (Instagram UA suffix): Instagram, YouTube channel, and the mix row each fire a `requestfailed` with the exact `instagram://`/`youtube://` URL, stay on `/links/` at t=300ms, and land on the https URL by t≤2500ms (proving the ~900ms fallback timer fires); both SoundCloud rows behave like case (a) — plain https popup, no custom-scheme attempt (`ios: null` confirmed live)
- (c) Android in-app (Instagram UA suffix): Instagram and SoundCloud-casae each fire a `requestfailed` with an `intent://...` prefix, page stays on `/links/` after 1500ms with no popup and no `pageerror` (no JS timer — OS owns the fallback; the `S.browser_fallback_url` payload itself is covered by unit check A.3 since Chromium strips the URL fragment from `requestfailed` events)
- (d) Modified click (Meta+click, iOS in-app UA): no custom-scheme `requestfailed`, `page.url()` unchanged after 1500ms — `preventDefault` never ran
- (e) Untouched rows: exactly 5 `data-app-link` anchors with the expected hrefs; `/events/`, `/small-record/`, `/events/#panic-room`, and the mailto row carry no `data-app-link`; mailto anchor has no `target`; full 9-href DOM order unchanged (`/events/#panic-room`, instagram, soundcloud-casae, soundcloud-letchetony, youtube-channel, `/events/`, `/small-record/`, mailto, mix); every https row has `target="_blank"` and `rel` containing both `noopener` and `noreferrer`
- (f) Layout at 390×844 (iPhone 13, reduced motion): `scrollHeight=667`, deepest element bottom `=666.7px` (≤700 hard pass), last row bottom `=650.7px`, `scrollWidth=390 === viewportWidth=390` (no horizontal overflow), every row tap target ≥44px tall (44–50px measured). Three screenshots written to the scratchpad: `iphone13.png`, `iphone13-instagram-ua.png`, `pixel7-instagram-ua.png`.

**One-screen budget:** still holds — deepest bottom 666.7px, well under the 700px hard limit, unchanged from before this task (the deeplink logic adds no DOM, no new elements, no class changes).

## Deviations from Plan

None — plan executed exactly as written. Task 2's verification passed on the first run of both scripts, so no fix commit was needed (the plan explicitly calls this the expected outcome).

## Threat Flags

None — all threat-model dispositions (`T-pzz-01` through `T-pzz-06`) were satisfied as designed: targets come only from the frozen `APP_LINKS` table (no runtime/query-param input), `S.browser_fallback_url` is built via `encodeURIComponent` inside a single `intent()` helper, `rel="noopener noreferrer"` is present on every external anchor including `AppLink`, the UA-based branch selection only affects the visitor's own device, the fallback timer is always cleared or caught, and no new public data is exposed beyond what was already on the page.

## Self-Check: PASSED

- FOUND: `lib/app-links.ts`
- FOUND: `components/magazine/AppLink.tsx`
- FOUND: `components/magazine/LinkRow.tsx` (modified)
- FOUND: `app/links/page.tsx` (modified)
- FOUND commit `27d1d03` in `git log --oneline`
- FOUND: 3 screenshots in the scratchpad (`iphone13.png`, `iphone13-instagram-ua.png`, `pixel7-instagram-ua.png`)
- FOUND: unit.mjs exit 0 (41/41 PASS), check.mjs exit 0 (36/36 PASS)
