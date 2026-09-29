---
phase: quick/260929-hle
plan: 01
subsystem: infra
tags: [next.js, vercel-blob, isr, links-store, server-components]

requires: []
provides:
  - "Server-capable Next.js build (output: 'export' removed) while /, /casae/, /letche/, /small-record/, /events/ stay statically prerendered"
  - "lib/links-schema.ts: LinkItem/LinksDoc types + parseLinksDoc() runtime validator that rebuilds a fresh object from whitelisted fields"
  - "lib/links-seed.ts: SEED_LINKS (the 7 shipped rows, stable ids) + seedDoc() + FEATURED_MIX (explicitly NOT store data)"
  - "lib/links-store.ts: getPublishedLinks/getDraftLinks/saveDraft/publishDraft + LINKS_TAG, Vercel Blob when BLOB_READ_WRITE_TOKEN is set, gitignored .links-store/*.json disk fallback otherwise"
  - "/links/ rendered from getPublishedLinks() with zero visual change (Playwright-verified parity at 390x844 and 1440x900)"
affects: [links-admin-part-2, links-page]

tech-stack:
  added: ["@vercel/blob@2.8.0"]
  patterns:
    - "Draft/published document store behind unstable_cache + revalidateTag, with a disk fallback selected purely by the presence of BLOB_READ_WRITE_TOKEN — the caller (page or future admin) never branches on backend"
    - "Untrusted store JSON is never trusted as-is: parseLinksDoc() rebuilds a fresh whitelisted object or returns null, and every read path degrades to seedDoc() rather than throwing"

key-files:
  created:
    - lib/links-schema.ts
    - lib/links-seed.ts
    - lib/links-store.ts
  modified:
    - next.config.ts
    - app/links/page.tsx
    - package.json
    - package-lock.json
    - .gitignore
    - .vercelignore
    - README.md

key-decisions:
  - "D-01: getPublishedLinks() cached via unstable_cache(tags:['links'], revalidate:3600); /links/ sets export const revalidate = 3600. Real invalidation is publishDraft() calling revalidateTag('links') itself — part 2 only needs to call publishDraft()"
  - "D-02: both links/published.json and links/draft.json are access:'public' on Blob (no secrets/PII in either). Switching the draft to 'private' is a documented one-literal follow-up once a token exists to test it"
  - "D-03/D-04: stable Blob pathnames (addRandomSuffix:false, allowOverwrite:true, cacheControlMaxAge:60); publishDraft() reads draft + writes published rather than using Blob copy()"
  - "D-05: FEATURED_MIX and the Panic Room recap card stay hardcoded in app/links/page.tsx, exported separately from lib/links-seed.ts so the store/LinksDoc shape never includes them"
  - "D-06: no admin UI, route handler, or server action added — saveDraft/publishDraft are written and typechecked but have no caller yet (as specified)"
  - "D-07 confirmed via Vercel docs (vercel.json#headers): 'This example configures custom response headers for static files, Vercel functions, and a wildcard that matches all routes' — vercel.json headers still apply to /images/** etc. on a non-static-export deployment. No change made to vercel.json"
  - "Renamed the planned useBlob() helper to blobEnabled() (functionally identical) — 'use*' names trip ESLint's react-hooks/rules-of-hooks even in a plain server module, and 0 lint errors is a hard requirement"

patterns-established:
  - "Server-only store module (lib/links-store.ts) is the single chokepoint for backend selection (Blob vs disk); page components only ever call the four public async functions, never touch process.env or fs directly"

requirements-completed: [BO1-01, BO1-02, BO1-03, BO1-04, BO1-05, BO1-06, BO1-07, BO1-08]

duration: 40min
completed: 2026-09-29
---

# Quick Task 260929-hle: Back-office /links part 1 (store + no static export) Summary

**Removed `output: 'export'`, added a Vercel Blob-backed draft/published links store with a disk fallback, and switched `/links/` to render from it — pixel- and DOM-identical to the pre-change page.**

## Performance

- **Duration:** ~40 min (baseline snapshot to final verification)
- **Started:** 2026-09-29T12:49Z (approx, first plan commit)
- **Completed:** 2026-09-29T12:53Z (task commits) + verification pass afterward
- **Tasks:** 3 (all completed, no checkpoints)
- **Files modified:** 10 (8 in Task 1, 2 in Task 2), plus one file outside the repo (`~/CLAUDE.md`, not committed)

## Accomplishments

- The site is no longer a static export: `npm run build` succeeds with a normal Next.js server build, while `/`, `/casae/`, `/letche/`, `/small-record/`, `/events/` remain statically prerendered (`○`), `sitemap.xml`/`robots.txt` remain static, and `/links` is ISR (`○` with `Revalidate: 1h`, not `ƒ` dynamic).
- `/links/` now renders its 7 rows from `getPublishedLinks()` (a real store), not from an array literal in the page — with zero observable change: Playwright parity check passed every assertion at both 390x844 and 1440x900 (identical 9 hrefs/order, identical anchor target/rel/className/text, 5 `data-app-link` anchors at the correct positions, identical images with `/images/_w/` srcsets at all 4 widths, no broken images, no horizontal overflow, deepest bottom unchanged (666.7px mobile / 756.7px desktop, both matching baseline within 1px), all tap targets ≥44px and matching baseline, and `main` outerHTML identical modulo React suspense comment markers.
- With no `BLOB_READ_WRITE_TOKEN` and no `.links-store/` on disk, the store degrades to `seedDoc()`: this was proven not just in dev but also inside the isolated production build, where the build log shows the single line `[links-store] BLOB_READ_WRITE_TOKEN missing — using .links-store/ on disk (dev only)` during static generation of `/links`, no error, no crash, and the prerendered HTML still contains the exact same 9 hrefs and 5 `data-app-link` anchors.
- `lib/links-store.ts` never wrote anything during this task — `.links-store/` never appeared on disk (`git status --porcelain` throughout only ever showed the untracked `.claude/`, which is intentionally never committed).

## Task Commits

Each task was committed atomically:

1. **Task 1: Baseline snapshot, drop static export, add @vercel/blob, build the store layer** - `4a04f7d` (feat)
2. **Task 2: Render /links/ from the published store + update the docs** - `c0011cf` (feat)
3. **Task 3: Prove parity (Playwright vs baseline) and prove the production build without static export** - no commit (verification-only task; the one fix needed was in a scratchpad test harness, not a source file — see Deviations)

**Plan metadata:** (this commit, docs-only, not pushed as part of task work per instructions — SUMMARY.md/STATE.md not committed by this executor per explicit constraint)

## Files Created/Modified

- `lib/links-schema.ts` - `LinkItem`/`LinksDoc` types + `parseLinksDoc()`, a whitelist-rebuild validator that returns `null` on anything unexpected
- `lib/links-seed.ts` - `SEED_LINKS` (7 rows, ids `instagram`/`soundcloud-casae`/`soundcloud-letche`/`youtube`/`events`/`label`/`booking`, `order: 1..7`), `seedDoc()`, `FEATURED_MIX` (not store data)
- `lib/links-store.ts` - `LINKS_TAG`, `getPublishedLinks`, `getDraftLinks`, `saveDraft`, `publishDraft`; Blob when `BLOB_READ_WRITE_TOKEN` set, `.links-store/*.json` disk fallback otherwise
- `next.config.ts` - removed the single `output: 'export'` line; everything else byte-identical
- `app/links/page.tsx` - async server component; `const LINKS = [...]` deleted; renders `getPublishedLinks()` filtered/sorted; featured mix row sourced from `FEATURED_MIX`; `export const revalidate = 3600` added
- `package.json` / `package-lock.json` - `@vercel/blob@2.8.0` added to `dependencies`
- `.gitignore` / `.vercelignore` - `.links-store/` / `.links-store` added
- `README.md` - line 20 no longer claims static export; documents ISR + `revalidateTag('links')`
- `~/CLAUDE.md` (outside repo, NOT committed) - "Deploiement" line updated to match

## Store API (for part 2)

```ts
// lib/links-store.ts
export const LINKS_TAG = 'links'
export async function getPublishedLinks(): Promise<LinksDoc>   // cached, tagged 'links', revalidate 3600, never throws, falls back to seedDoc()
export async function getDraftLinks(): Promise<LinksDoc>        // uncached; draft ?? published ?? seed
export async function saveDraft(doc: LinksDoc): Promise<LinksDoc>   // normalises order 1..N, validates, writes draft, may throw
export async function publishDraft(): Promise<LinksDoc>         // draft -> published, calls revalidateTag(LINKS_TAG) itself
```

`LinkItem` shape: `{ id, label, sublabel?, href, kind: 'internal'|'external'|'mail', active, order }`.
Seed ids (part 2 should key off these, do not invent new ones for the existing 7 rows): `instagram`, `soundcloud-casae`, `soundcloud-letche`, `youtube`, `events`, `label`, `booking`.

**Caching/invalidation contract:** `/links/` reads `getPublishedLinks()` inside a route with `export const revalidate = 3600` (ISR safety net only). The real invalidation path is: admin calls `publishDraft()` -> `publishDraft()` writes `links/published.json` then calls `revalidateTag('links')` itself -> next request to `/links/` gets the fresh document. Part 2 never needs to call `revalidateTag` directly.

**Access level:** both `links/published.json` and `links/draft.json` are written with `access: 'public'` (D-02). This is safe today (labels + public URLs only, no secrets). **Follow-up for part 2 or later:** switch the draft blob to `access: 'private'` once `BLOB_READ_WRITE_TOKEN` exists locally and the private path can actually be exercised — right now it would ship untested.

**Authn/authz for the write path is undesigned.** `saveDraft`/`publishDraft` have no caller and no access control in this task (per D-06/T-hle-07). Part 2 must design who is allowed to call them before adding any route handler/server action/admin UI.

**Href scheme validation is not yet enforced.** T-hle-02 notes that `saveDraft` is the correct chokepoint to reject `javascript:`/`data:` href schemes once an admin form exists — not done here since there is no caller yet.

## Production build route table (from the APFS-clone build, `next build --turbopack`)

```
Route (app)                         Size  First Load JS  Revalidate  Expire
┌ ○ /                            4.97 kB         197 kB
├ ○ /_not-found                      0 B         183 kB
├ ○ /apple-icon.png                  0 B            0 B
├ ○ /carousel                        0 B         183 kB
├ ○ /casae                       6.42 kB         189 kB
├ ○ /events                       4.5 kB         197 kB
├ ○ /letche                        554 B         193 kB
├ ○ /links                       6.55 kB         189 kB          1h      1y
├ ○ /robots.txt                      0 B            0 B
├ ○ /sitemap.xml                     0 B            0 B
├ ○ /small-record                  878 B         193 kB
└ ○ /v2                          13.7 kB         196 kB

○  (Static)  prerendered as static content
```

All routes are `○` (static/ISR); none are `ƒ` (dynamic, server-rendered on demand). `/links` carries `Revalidate: 1h / Expire: 1y`, which is the expected ISR marker from `export const revalidate = 3600` — legitimately not a plain static `○` without a revalidate window, but explicitly not `ƒ` either, matching the plan's success criterion. `/v2` and `/carousel` are still built locally (unchanged — excluded from the deploy by `.vercelignore`, not by the build).

`/links` HTML in `.next/server/app/links.html` was grepped directly: contains all 9 hrefs, exactly 5 `data-app-link` occurrences, and `/images/_w/` srcsets. `sitemap.xml` and `robots.txt` are emitted as static `.body`/`.meta` prerender artifacts (both `dynamic = 'force-static'`, untouched by this task) — `sitemap.xml` lists all 6 public pages including `/links/`, `robots.txt` is a plain static text file.

`next start` on port 3100 (clone only, :3000 never touched) served `/links/` 200 with the same 9 hrefs; `/images/logo/logo-wordmark-white.png` returned 200 with `Cache-Control: public, max-age=0` — that header comes from `next start`'s own defaults, not from `vercel.json` (informational only, per the plan). The :3100 process was killed after the check.

## `/images/_w/` srcsets: survived

Confirmed in three places: dev server curl output, Playwright-rendered `srcset` attributes (parity diff, all 4 widths present), and the production build's prerendered `.next/server/app/links.html`. The custom image loader (`lib/image-loader.ts`) and `next.config.ts`'s `images` block were untouched — `loader: 'custom'` is independent of `output` mode, exactly as measured fact 3 predicted.

## `vercel.json` headers finding (D-07, no code change)

Fetched https://vercel.com/docs/project-configuration/vercel-json and found, in the `headers` section: *"This example configures custom response headers for static files, Vercel functions, and a wildcard that matches all routes."* This confirms `vercel.json`'s `headers` block matches by `source` path pattern across the whole deployment regardless of whether the matched path is served as a static file or from a Vercel Function — so the existing cache-control rules for `/images/(.*)`, `/videos/(.*)`, `/og/(.*)`, `/fonts/(.*)` continue to apply unchanged now that the app is no longer a static export. **No change made to `vercel.json` or `next.config.ts`**, per instruction.

## `out/` leftover check

`grep -rn "out/" --exclude-dir={node_modules,.next,.git,.planning} .` turned up exactly the three harmless ignore entries measured fact 5 predicted: `.gitignore:3` (`out/`), `.vercelignore:4` (`out`), `eslint.config.mjs:11` (`'out/**'`). Two additional grep hits (`app/layout.tsx`, `README.md`) were false positives on the substring `layout/`, not `out/`. `README.md` and the global `~/CLAUDE.md` no longer claim static export (both updated in Task 2). Nothing else found; no follow-up needed.

## Decisions Made

See `key-decisions` in frontmatter (D-01 through D-07, plus the `useBlob` → `blobEnabled` rename). All decisions were locked by the plan except the rename, which was a mechanical deviation to satisfy ESLint (see below).

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Renamed `useBlob()` to `blobEnabled()` in `lib/links-store.ts`**
- **Found during:** Task 1, first `npm run lint` after writing the store
- **Issue:** The plan's exact spec named the backend-selection helper `useBlob()`. ESLint's `react-hooks/rules-of-hooks` flags any function whose name starts with `use` as a React Hook, even in a plain server-only module with no React import — `npm run lint` failed with 3 errors (`react-hooks/rules-of-hooks` at the declaration and both call sites).
- **Fix:** Renamed the function (and its 3 call sites) to `blobEnabled()`. No behavior change — same signature, same body, same call sites.
- **Files modified:** `lib/links-store.ts`
- **Verification:** `npx tsc --noEmit` and `npm run lint` both clean afterward
- **Committed in:** `4a04f7d` (Task 1 commit)

**2. [Rule 3 - Blocking, scratchpad only] `diff.mjs` mobile-only one-screen budget**
- **Found during:** Task 3, first run of the parity diff script
- **Issue:** My own `diff.mjs` harness initially applied the `<=700px` "one-screen budget" assertion at both 390x844 and 1440x900. The plan's `success_criteria` only requires that budget at 390x844 (desktop legitimately scrolls, baseline was 756.7px there); applying it at desktop caused a false FAIL.
- **Fix:** Scoped the `<=700px` assertion to the mobile viewport only; kept the "matches baseline within 1px" assertion at every viewport (which desktop already passed).
- **Files modified:** scratchpad only (`bo1/diff.mjs`), no repo files touched
- **Verification:** Re-ran `diff.mjs`, all checks PASS, exit 0
- **Committed in:** n/a (scratchpad, not part of the repo)

---

**Total deviations:** 2 auto-fixed (1 blocking in a source file, 1 blocking in a test harness only)
**Impact on plan:** Both were mechanical fixes required to satisfy the plan's own hard gates (0 lint errors; success criteria as literally written). No scope creep, no architectural change.

## Issues Encountered

- Could not read the `:3000` dev server's own stdout to directly observe the `[links-store] BLOB_READ_WRITE_TOKEN missing` warning line in real time — that dev server runs in a separate tty session (pid 73152, tty s003) not owned by this agent, and it has no log file redirect. Worked around this by observing the same warning fire during the isolated production build (`build.log`, captured verbatim in the route-table section above), and by confirming the dev server never threw (every `/links/` request returned 200 with the seeded 7 rows throughout the task).

## User Setup Required

None - no external service configuration required. (`BLOB_READ_WRITE_TOKEN` remains intentionally unset; when it is added later, the store automatically switches to Blob with no code change — see `lib/links-store.ts`'s `blobEnabled()`.)

## Next Phase Readiness

- Part 2 (admin UI) can call `getDraftLinks()` / `saveDraft()` / `publishDraft()` directly; no further store work needed.
- Follow-ups explicitly recorded for part 2 or later: (1) switch `links/draft.json` to `access: 'private'` once a token is available and testable (D-02), (2) design authn/authz for the write path before adding any route handler/server action (T-hle-07), (3) reject `javascript:`/`data:` href schemes in `saveDraft` once an admin form exists (T-hle-02).
- No blockers. `output: 'export'` is gone, the 5 content pages are still prerendered, `/links` is ISR, and the site was not deployed (`vercel --prod` was not run, per instruction).

---
*Phase: quick/260929-hle*
*Completed: 2026-09-29*

## Self-Check: PASSED

All 10 created/modified repo files found on disk (`lib/links-schema.ts`, `lib/links-seed.ts`,
`lib/links-store.ts`, `next.config.ts`, `app/links/page.tsx`, `README.md`, `.gitignore`,
`.vercelignore`, `package.json`, `package-lock.json`), the out-of-repo `~/CLAUDE.md` edit confirmed,
and both task commits (`4a04f7d`, `c0011cf`) found in `git log --oneline --all`.
