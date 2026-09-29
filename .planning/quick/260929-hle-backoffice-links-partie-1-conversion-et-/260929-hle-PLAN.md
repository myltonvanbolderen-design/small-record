---
phase: quick/260929-hle
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - package.json
  - package-lock.json
  - next.config.ts
  - .gitignore
  - .vercelignore
  - lib/links-schema.ts
  - lib/links-seed.ts
  - lib/links-store.ts
  - app/links/page.tsx
  - README.md
autonomous: true
requirements: [BO1-01, BO1-02, BO1-03, BO1-04, BO1-05, BO1-06, BO1-07, BO1-08]

must_haves:
  truths:
    - "The app no longer uses `output: 'export'`: `npm run build` succeeds and produces a normal Next.js server build, while `/`, `/casae/`, `/letche/`, `/small-record/`, `/events/` are still prerendered at build time (static, not per-request dynamic)"
    - "`/links/` renders its 7 link rows from the published document returned by `getPublishedLinks()`, not from an array literal in the page file"
    - "With no `BLOB_READ_WRITE_TOKEN` and no `.links-store/` on disk, `/links/` still renders the exact same 7 rows as today (seed fallback), and logs one warning line instead of crashing"
    - "The rendered `/links/` is byte-equivalent to the pre-change baseline: same 9 hrefs in the same DOM order, same labels/sublabels, same classes, same 5 `data-app-link` anchors, same target/rel, one-screen budget still holds at 390x844 (deepest bottom <= 700px), no horizontal overflow"
    - "Images on `/links/` still go through the custom loader: the rendered `srcset` still points at `/images/_w/{640,1080,1280,1920}/...webp` in dev AND in the production build output"
    - "`lib/links-store.ts` exposes getPublishedLinks / getDraftLinks / saveDraft / publishDraft, backed by Vercel Blob when `BLOB_READ_WRITE_TOKEN` is set and by `.links-store/*.json` on disk otherwise; `.links-store/` is gitignored and vercelignored"
    - "Part 2 can invalidate `/links/` by calling `publishDraft()` (which calls `revalidateTag('links')` itself) — the tag is exported as `LINKS_TAG`"
    - "The featured mix row and the Panic Room recap card are still hardcoded in the page and are NOT part of the store document"
    - "A row whose href has no `APP_LINKS` entry renders as a plain anchor with no deeplink handler and no crash"
  artifacts:
    - path: "next.config.ts"
      provides: "Server-capable Next config: no output:'export', trailingSlash + custom image loader unchanged"
      contains: "loaderFile"
    - path: "lib/links-schema.ts"
      provides: "LinkItem / LinksDoc types + runtime validator for untrusted store JSON"
      exports: ["LinkItem", "LinksDoc", "LINK_KINDS", "parseLinksDoc"]
    - path: "lib/links-seed.ts"
      provides: "The 7 current rows as the initial/emergency document, plus the hardcoded FEATURED_MIX row"
      exports: ["SEED_LINKS", "seedDoc", "FEATURED_MIX"]
    - path: "lib/links-store.ts"
      provides: "Draft/published store over Vercel Blob with a disk fallback for local dev"
      exports: ["LINKS_TAG", "getPublishedLinks", "getDraftLinks", "saveDraft", "publishDraft"]
      contains: "BLOB_READ_WRITE_TOKEN"
    - path: "app/links/page.tsx"
      provides: "Async server component reading the published doc; visual result unchanged"
      contains: "getPublishedLinks"
  key_links:
    - from: "app/links/page.tsx"
      to: "lib/links-store.ts"
      via: "await getPublishedLinks() in the async server component"
      pattern: "await getPublishedLinks\\(\\)"
    - from: "lib/links-store.ts"
      to: "@vercel/blob"
      via: "get/put on links/published.json and links/draft.json"
      pattern: "from '@vercel/blob'"
    - from: "lib/links-store.ts"
      to: "lib/links-seed.ts"
      via: "seedDoc() used as initial document and as emergency fallback on read failure"
      pattern: "seedDoc\\(\\)"
    - from: "lib/links-store.ts"
      to: "next/cache"
      via: "unstable_cache({ tags: [LINKS_TAG] }) on read, revalidateTag(LINKS_TAG) in publishDraft"
      pattern: "revalidateTag"
    - from: "app/links/page.tsx"
      to: "lib/app-links.ts"
      via: "APP_LINKS[link.href] passed as the app prop (undefined when absent)"
      pattern: "APP_LINKS\\[link\\.href\\]"
---

<objective>
Part 1 of the `/links` mini back-office: take the site off static export, move the link-in-bio rows
into a real store (Vercel Blob, draft + published), and make `/links/` render from it — with **zero**
visual change.

Purpose: the admin page of part 2 needs a server. This task makes the server exist and gives part 2 a
store layer it can just import. Part 2 builds the UI; **do not build any admin UI, route handler or
server action here.**
Output: `output: 'export'` removed, `@vercel/blob` added, `lib/links-schema.ts` + `lib/links-seed.ts` +
`lib/links-store.ts` created, `app/links/page.tsx` reading from the store, docs updated.
</objective>

<execution_context>
@$HOME/.claude/get-shit-done/workflows/execute-plan.md
@$HOME/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@CLAUDE.md
@.planning/quick/260928-pzz-deeplinks-vers-les-apps-sur-la-page-link/260928-pzz-SUMMARY.md
@next.config.ts
@app/links/page.tsx
@components/magazine/LinkRow.tsx
@lib/app-links.ts
@lib/image-loader.ts

<interfaces>
<!-- Contracts the executor needs. No codebase exploration required. -->

**next.config.ts (current, 15 lines)**
```ts
import type { NextConfig } from 'next'
const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    // keep in sync with tools/image-variants.mjs WIDTHS and lib/image-loader.ts IMAGE_WIDTHS
    loader: 'custom',
    loaderFile: './lib/image-loader.ts',
    deviceSizes: [640, 1080, 1280, 1920],
    imageSizes: [640],
  },
}
export default nextConfig
```
Only the `output` line is removed. Everything else stays byte-identical.

**components/magazine/LinkRow.tsx (unchanged by this task)**
```ts
interface LinkRowProps {
  href: string
  label: string
  sublabel?: string
  kind?: 'internal' | 'external' | 'mail'
  thumb?: { src: string; alt: string }
  glyph?: string
  app?: AppTarget
}
export function LinkRow(props: LinkRowProps): JSX.Element
```
`app` undefined -> the plain `<a target="_blank" rel="noopener noreferrer">` branch. That is already
the "no deeplink entry" path — nothing to add.

**lib/app-links.ts (unchanged by this task)**
`export const APP_LINKS: Record<string, AppTarget>` keyed by the exact https href, 5 entries:
instagram/smallmusics, soundcloud/casae, soundcloud/letchetony, youtube/@SmallRecords_Music,
youtu.be/X9rpsIVIVgk.

**lib/image-loader.ts (unchanged by this task)** — `'use client'` module, default export
`imageLoader({src,width})` -> `/images/_w/{pickWidth(width)}/{name}.webp` for `/images/**.jpg|jpeg`,
passthrough otherwise. Removing `output: 'export'` must not change this: `loader: 'custom'` is
independent of the output mode.

**app/links/page.tsx (current)** — sync server component. `export const metadata = pageMetadata({...})`,
then a local `const LINKS: {label, sublabel?, href, kind}[]` of 7 entries, then the JSX: wordmark img,
two taglines, `CopyLinkButton`, the Panic Room recap `<Link href="/events/#panic-room">` card with
`<Image src="/images/panic-room/trio.jpg" fill priority sizes="(min-width: 448px) 448px, 100vw">`,
then `<nav aria-label="Small Records links">` containing `LINKS.map(...)` + the standalone featured
mix `LinkRow`.

**The 7 rows, verbatim (order = DOM order today)**
| # | label | sublabel | href | kind |
|---|---|---|---|---|
| 1 | `Instagram` | `@smallmusics` | `https://www.instagram.com/smallmusics` | external |
| 2 | `SoundCloud — Casæ` | — | `https://soundcloud.com/casae` | external |
| 3 | `SoundCloud — Letché` | — | `https://soundcloud.com/letchetony` | external |
| 4 | `YouTube` | — | `https://www.youtube.com/@SmallRecords_Music` | external |
| 5 | `Events & recaps` | — | `/events/` | internal |
| 6 | `The Label` | — | `/small-record/` | internal |
| 7 | `Booking` | `contact@small-records.com` | `mailto:contact@small-records.com` | mail |

(Labels contain real typographic characters: `—` em dash, `æ`, `é`. Copy them exactly.)

**The featured mix row (stays hardcoded, NOT in the store)**
`href="https://youtu.be/X9rpsIVIVgk"`, `kind="external"`, `label="House Mix · Pool Party"`,
`sublabel="Summer set"`, `glyph="▶"`, `thumb={{ src: '/images/mix-pool-party.jpg', alt: 'House mix,
pool party set in the South of France' }}`, `app={APP_LINKS['https://youtu.be/X9rpsIVIVgk']}`.

**The 9 hrefs in DOM order on `/links/` (must not change)**
1. `/events/#panic-room` (recap card) 2. instagram 3. soundcloud/casae 4. soundcloud/letchetony
5. youtube channel 6. `/events/` 7. `/small-record/` 8. `mailto:contact@small-records.com`
9. `https://youtu.be/X9rpsIVIVgk`. Exactly 5 carry `data-app-link` (2,3,4,5,9).
`CopyLinkButton` is a `<button>`, not an anchor.
</interfaces>

<measured_facts>
<!-- Probed during planning. Do NOT re-derive. -->

1. **`@vercel/blob` latest is `2.8.0`** and its `dist/index.d.ts` exports: `put`, `get`, `head`, `del`,
   `list`, `copy`, `rename`, `putImage`, `putFromUrl` + multipart helpers.
   - `put(pathname, body, { access: 'public' | 'private', addRandomSuffix?, allowOverwrite?,
     contentType?, cacheControlMaxAge?, token?, ... })`. Docs: `addRandomSuffix` **defaults to false**;
     `allowOverwrite` **must be true** to overwrite an existing pathname (otherwise it throws);
     `cacheControlMaxAge` is in seconds and **cannot be lower than 60**.
   - `get(urlOrPathname, { access, useCache? })` -> `Promise<GetBlobResult | null>`; returns `null`
     when not found. Result is `{ statusCode, stream, headers, blob }` where `stream` is a web
     `ReadableStream` on 200 and `null` on 304. **When given a pathname it resolves the store id from
     the token / `BLOB_STORE_ID`.** `useCache: false` bypasses the CDN cache and reads origin storage —
     required here so a publish is visible immediately.
2. **The dev server is already running on :3000** (`curl http://localhost:3000/links/` -> 200). Next
   dev **auto-restarts itself** when `next.config.ts` changes ("Found a change in next.config.ts.
   Restarting the server..."). You must **never** kill or restart it yourself. If after editing the
   config `curl` starts failing for more than ~30s, stop and report — do not run any `next dev`.
3. `sharp@0.34.5` is present in `node_modules` (transitively), so `prebuild`
   (`node tools/image-variants.mjs`) works locally, and `public/images/_w/{640,1080,1280,1920}/`
   already exist and are populated.
4. Playwright kit: `createRequire('/Users/myltonvanbolderen/Downloads/PANIC ROOM/_kit/package.json')`
   then `require('playwright')`. Chromium installed. Descriptors available: `iPhone 13`, `Pixel 7`,
   `Desktop Chrome`.
5. Only two places in the repo mention static export outside `.planning/`:
   - `README.md:20` — "Next.js 15 (App Router) en export statique (`output: 'export'`), déployé sur Vercel"
   - `/Users/myltonvanbolderen/CLAUDE.md:30` — "**Deploiement** : Site statique/SSG (`output: 'export'`)"
     (this file is the user's global memory, **outside the git repo** — edit it but do NOT try to commit it)
   `.gitignore:3` and `eslint.config.mjs:11` also list `out/` — those are harmless leftovers, leave them.
   `.vercelignore` lists `out` — harmless, leave it.
6. `app/sitemap.ts` and `app/robots.ts` both already have `export const dynamic = 'force-static'`.
   Leave both files **completely untouched** — that directive is exactly what keeps them static once
   the app is server-capable.
7. Routes that exist: `/`, `/casae`, `/letche`, `/small-record`, `/events`, `/links`, `/carousel`,
   `/v2`, `/_not-found`, `/sitemap.xml`, `/robots.txt`. `/v2` and `/carousel` are excluded from the
   deploy by `.vercelignore` but **are** built locally — that is unchanged.
8. Scratchpad =
   `/private/tmp/claude-501/-Users-myltonvanbolderen-small-record/54b5f0cd-5a66-4186-b337-6738006c59de/scratchpad`.
   `/private/tmp` and `/Users` are on the same APFS Data volume, so `cp -c -R` (clone) works between them.
</measured_facts>

<decisions>
<!-- Locked. Implement exactly this; do not re-litigate. -->

**D-01 — Caching of `/links/`: `unstable_cache` + tag, NOT `force-dynamic`.**
`getPublishedLinks()` wraps the raw store read in `unstable_cache(fn, ['links:published'],
{ tags: [LINKS_TAG], revalidate: 3600 })`, and `app/links/page.tsx` sets `export const revalidate = 3600`.
Justification: `/links/` is the QR/bio landing page — it must be CDN-fast and must survive a Blob
outage, so it stays prerendered. `force-dynamic` would mean a Blob round-trip on every single tap.
The hourly `revalidate` is only a self-healing net; the real invalidation is `revalidateTag('links')`,
which `publishDraft()` calls itself, so part 2 just calls `publishDraft()` and the page updates on the
next request.

**D-02 — Blob access level: `access: 'public'` for BOTH `links/published.json` and `links/draft.json`.**
Justification: the published document is literally the public page content, and the draft holds the
same shape of data (labels + public URLs) — no secrets, no PII. `access: 'private'` exists in 2.8.0 but
cannot be exercised locally (no token yet), so shipping it untested would be the riskier choice.
Record in the SUMMARY that switching the draft to `'private'` is a one-literal follow-up once a token
is available and testable.

**D-03 — Blob keys and write options.** `links/published.json` and `links/draft.json`, written with
`{ access: 'public', addRandomSuffix: false, allowOverwrite: true, contentType: 'application/json',
cacheControlMaxAge: 60 }`. Stable pathnames are required so `get(pathname)` works without bookkeeping.

**D-04 — `publishDraft()` does read-draft + write-published, not Blob `copy()`.** The same code path
then works for the disk fallback, and there is exactly one write helper to reason about.

**D-05 — The featured mix row and the Panic Room recap card stay hardcoded.** They are not plain
links (thumb, glyph, custom card markup). Only the 7 rows live in the store. `FEATURED_MIX` moves to
`lib/links-seed.ts` as a **separate named export** that is *not* part of `LinksDoc`, so part 2 cannot
mistake it for store data. Leave a comment saying so.

**D-06 — No admin UI, no route handler, no server action in this task.** `saveDraft`/`publishDraft`
are written and type-checked but have no caller yet. That is expected; do not add one.

**D-07 — `vercel.json` is NOT modified.** Its `headers` block keeps applying: on Vercel, `vercel.json`
`headers` are matched at the CDN layer for every path of the deployment, including `public/` assets,
whether the framework output is static or serverless. Task 3 confirms this against the Vercel docs and
records the finding; if the docs contradict it, **report it, do not change anything** — moving the
rules into `next.config.ts` `headers()` is a follow-up task, not this one.
</decisions>
</context>

<tasks>

<task type="auto">
  <name>Task 1: Baseline snapshot, drop static export, add @vercel/blob, build the store layer</name>
  <files>package.json, package-lock.json, next.config.ts, .gitignore, .vercelignore, lib/links-schema.ts, lib/links-seed.ts, lib/links-store.ts</files>
  <action>
**(a) FIRST — capture the pre-change baseline. Do this before editing anything.**

The dev server on :3000 is currently serving the old page. Write
`<scratchpad>/bo1/snapshot.mjs`, a reusable script that takes an output path and dumps a DOM
fingerprint of `http://localhost:3000/links/` at iPhone 13 / 390x844 (reducedMotion 'reduce'):
- ordered list of `main a` -> `{ href, target, rel, hasAppLink: a.hasAttribute('data-app-link'), text: textContent.replace(/\s+/g,' ').trim(), className }`
- ordered list of `main img` -> `{ src, srcset, alt, sizes, naturalWidth, naturalHeight, className }`
- `document.documentElement.scrollWidth`, `scrollHeight`
- max bottom of any element inside `main`, and bottom of the last row
- every `main a, main button` bounding box height
- the full `main` outerHTML
Write it as pretty JSON. Run it now:
`node <scratchpad>/bo1/snapshot.mjs <scratchpad>/bo1/before.json` and also take
`<scratchpad>/bo1/before-390.png` (fullPage) and `<scratchpad>/bo1/before-1440.png` (1440x900).
Print the key numbers. **If this fails, stop and report — the whole task depends on this baseline.**

**(b) Add the dependency.**
```
cd /Users/myltonvanbolderen/small-record && npm install @vercel/blob
```
This is the one allowed install. It must land in `dependencies` (not dev). It rewrites
`package.json` + `package-lock.json` — both get committed. It does not restart the dev server; if the
dev server logs a module-resolution hiccup, just re-`curl` — it recovers on its own. Install nothing
else, update nothing else.

**(c) `next.config.ts` — delete the single line `output: 'export',`.**
Nothing else changes: `trailingSlash: true` stays, the whole `images` block (comment included) stays
byte-identical. Then wait for the dev server to auto-restart (measured fact 2) and confirm
`curl -s -o /dev/null -w '%{http_code}' http://localhost:3000/links/` -> 200.

**(d) `.gitignore` — append `.links-store/`** (after `public/images/_w/`, keep the file's style).
**`.vercelignore` — add `.links-store` under the "Secrets / local" block.**

**(e) `lib/links-schema.ts` (new).** Pure, no imports, no React, no Next.
```ts
export const LINK_KINDS = ['internal', 'external', 'mail'] as const
export type LinkKind = (typeof LINK_KINDS)[number]

export interface LinkItem {
  id: string
  label: string
  sublabel?: string
  href: string
  kind: LinkKind
  active: boolean
  order: number
}

export interface LinksDoc {
  items: LinkItem[]
  updatedAt: string
}

/** Validate untrusted JSON coming out of the store. Returns null on anything unexpected. */
export function parseLinksDoc(raw: unknown): LinksDoc | null { ... }
```
`parseLinksDoc` must check: `raw` is a non-null object; `items` is an array; every item has a non-empty
string `id`, a non-empty string `label`, a non-empty string `href`, `kind` in `LINK_KINDS`, a boolean
`active`, a finite number `order`, and `sublabel` is `undefined` or a string; `updatedAt` is a string
(default to `new Date(0).toISOString()` if missing). Return a **freshly built** object containing only
those fields — never pass the raw object through. Reject (return `null`) rather than throw.

**(f) `lib/links-seed.ts` (new).**
```ts
import type { LinkItem, LinksDoc } from '@/lib/links-schema'

/** The 7 rows as shipped on 2026-09-28. Initial store content AND emergency fallback. */
export const SEED_LINKS: LinkItem[] = [ ... ]

export function seedDoc(): LinksDoc {
  return { items: SEED_LINKS.map((i) => ({ ...i })), updatedAt: new Date(0).toISOString() }
}

/**
 * NOT part of the store document. The featured mix row is not a plain link (thumbnail + custom
 * glyph), so it stays hardcoded in app/links/page.tsx. The admin UI (part 2) must not surface it.
 */
export const FEATURED_MIX = { href: '...', label: '...', sublabel: '...', glyph: '▶',
  thumb: { src: '...', alt: '...' } } as const
```
Fill `SEED_LINKS` from the 7-row table in `<interfaces>`, in that order, with
`order: 1..7`, `active: true` and these stable ids (part 2 will key off them):
`instagram`, `soundcloud-casae`, `soundcloud-letche`, `youtube`, `events`, `label`, `booking`.
Omit `sublabel` entirely on rows 2-6 (do not set it to `''`).
Fill `FEATURED_MIX` from the "featured mix row" block in `<interfaces>`, verbatim.
`seedDoc()` must return a fresh copy each call so no caller can mutate the seed.

**(g) `lib/links-store.ts` (new).** Server-only module — never import it from a `'use client'` file.
```ts
import { unstable_cache, revalidateTag } from 'next/cache'
import { get, put } from '@vercel/blob'
import fs from 'node:fs/promises'
import path from 'node:path'
import { parseLinksDoc, type LinksDoc } from '@/lib/links-schema'
import { seedDoc } from '@/lib/links-seed'

export const LINKS_TAG = 'links'
const PUBLISHED_KEY = 'links/published.json'
const DRAFT_KEY = 'links/draft.json'
const DEV_DIR = path.join(process.cwd(), '.links-store')
```
Backend selection: `function useBlob() { return Boolean(process.env.BLOB_READ_WRITE_TOKEN) }`.
Warn **once** per process when falling back (module-level `let warnedOnce = false`):
`console.warn('[links-store] BLOB_READ_WRITE_TOKEN missing — using .links-store/ on disk (dev only)')`.

Private helpers:
- `async function readRaw(key: string): Promise<unknown | null>`
  - Blob: `const res = await get(key, { access: 'public', useCache: false })`; if `!res || !res.stream`
    return `null`; else `return await new Response(res.stream).json()`.
    If the installed runtime turns out not to expose `get`, fall back to
    `list({ prefix: 'links/' })` + `fetch(blob.url, { cache: 'no-store' }).then(r => r.json())` — but
    only if `get` actually fails; `get` is the documented path (measured fact 1).
  - Disk: `JSON.parse(await fs.readFile(path.join(DEV_DIR, basename(key)), 'utf8'))`, returning `null`
    on `ENOENT`.
  - Wrap the whole body in try/catch: on **any** error, `console.error('[links-store] read failed', err)`
    and return `null`. Reading must never throw.
- `async function writeRaw(key: string, doc: LinksDoc): Promise<void>`
  - Blob: `await put(key, JSON.stringify(doc, null, 2), { access: 'public', addRandomSuffix: false,
    allowOverwrite: true, contentType: 'application/json', cacheControlMaxAge: 60 })`.
  - Disk: `await fs.mkdir(DEV_DIR, { recursive: true })` then `fs.writeFile(...)`.
  - Guard first: `if (!useBlob() && process.env.VERCEL) throw new Error('[links-store] Vercel Blob is
    not configured (BLOB_READ_WRITE_TOKEN missing) — refusing to write to a read-only filesystem')`.
  - Writes **may** throw (part 2 surfaces the error to the admin). Do not swallow.
- `async function readDoc(key: string): Promise<LinksDoc | null>` = `parseLinksDoc(await readRaw(key))`,
  logging `console.error('[links-store] corrupt document at <key>, ignoring')` when the parse returns null
  but the raw read returned something.

Public API — exactly these four plus `LINKS_TAG`:
```ts
export async function getPublishedLinks(): Promise<LinksDoc>
export async function getDraftLinks(): Promise<LinksDoc>
export async function saveDraft(doc: LinksDoc): Promise<LinksDoc>
export async function publishDraft(): Promise<LinksDoc>
```
- `getPublishedLinks()` = `unstable_cache(async () => (await readDoc(PUBLISHED_KEY)) ?? seedDoc(),
  ['links:published'], { tags: [LINKS_TAG], revalidate: 3600 })()` — per **D-01**. Never returns
  null, never throws: empty/absent/corrupt store -> `seedDoc()`.
- `getDraftLinks()` = **uncached** (the admin must always see what it just saved):
  `(await readDoc(DRAFT_KEY)) ?? (await readDoc(PUBLISHED_KEY)) ?? seedDoc()` — a missing draft
  starts from what is live, and a virgin store starts from the seed.
- `saveDraft(doc)`: normalise first — `const next = { items: [...doc.items].sort((a,b) => a.order -
  b.order).map((item, i) => ({ ...item, order: i + 1 })), updatedAt: new Date().toISOString() }`;
  validate with `parseLinksDoc(next)` and throw `new Error('[links-store] invalid document')` if it
  returns null; `await writeRaw(DRAFT_KEY, parsed)`; return `parsed`.
- `publishDraft()`: `const draft = await getDraftLinks()`; `const next = { ...draft, updatedAt: new
  Date().toISOString() }`; `await writeRaw(PUBLISHED_KEY, next)`; then
  `try { revalidateTag(LINKS_TAG) } catch { /* called outside a request scope (script/test) — the
  hourly revalidate still covers it */ }`; return `next`. Per **D-04**.

Add a file-header comment stating: server-only; Blob when `BLOB_READ_WRITE_TOKEN` is set, `.links-store/`
on disk otherwise; published is read through `unstable_cache` tagged `links`; part 2 only needs
`getDraftLinks` / `saveDraft` / `publishDraft`.

**Do not touch** `app/links/page.tsx` in this task, nor `app/sitemap.ts`, `app/robots.ts`,
`vercel.json`, `lib/image-loader.ts`, `tools/image-variants.mjs`, or any other page.
  </action>
  <verify>
    <automated>cd /Users/myltonvanbolderen/small-record && npx tsc --noEmit && npm run lint</automated>
    <automated>cd /Users/myltonvanbolderen/small-record && ! grep -q "output:" next.config.ts && grep -q "loaderFile" next.config.ts && grep -q "@vercel/blob" package.json && grep -q ".links-store" .gitignore && grep -q ".links-store" .vercelignore && echo CONFIG_OK</automated>
    <automated>cd /Users/myltonvanbolderen/small-record && curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/links/ | grep -qx 200 && echo DEV_OK</automated>
    <automated>test -s "/private/tmp/claude-501/-Users-myltonvanbolderen-small-record/54b5f0cd-5a66-4186-b337-6738006c59de/scratchpad/bo1/before.json" && echo BASELINE_OK</automated>
  </verify>
  <done>
`<scratchpad>/bo1/before.json` + the two baseline screenshots exist. `next.config.ts` has no `output`
key and an otherwise byte-identical body. `@vercel/blob` is in `dependencies` with `package-lock.json`
updated. `lib/links-schema.ts`, `lib/links-seed.ts`, `lib/links-store.ts` exist and export exactly the
symbols listed in `must_haves.artifacts`. `.links-store/` is in `.gitignore` and `.vercelignore`.
`npx tsc --noEmit` and `npm run lint` are both clean, the dev server still answers 200 on `/links/`.
Commit (stage these exact paths only):
`git add package.json package-lock.json next.config.ts .gitignore .vercelignore lib/links-schema.ts lib/links-seed.ts lib/links-store.ts`
message `feat(links): leave static export, add a Blob-backed draft/published links store`
ending with `Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>`.
  </done>
</task>

<task type="auto">
  <name>Task 2: Render /links/ from the published store + update the docs</name>
  <files>app/links/page.tsx, README.md</files>
  <action>
**(a) `app/links/page.tsx`.**
- Keep `export const metadata = pageMetadata({...})` exactly as is.
- Add `export const revalidate = 3600` (per **D-01**) right after the metadata export, with a one-line
  comment: `// ISR safety net; the real invalidation is revalidateTag('links') from publishDraft().`
- Delete the local `const LINKS = [...]` array entirely.
- Make the component async:
```tsx
export default async function LinksPage() {
  const { items } = await getPublishedLinks()
  const links = items.filter((i) => i.active).sort((a, b) => a.order - b.order)
  ...
}
```
- In the `<nav>`, replace `LINKS.map(...)` with `links.map((link) => (<LinkRow key={link.id} href={link.href}
  label={link.label} sublabel={link.sublabel} kind={link.kind} app={APP_LINKS[link.href]} />))`.
  `key` moves from `link.label` to `link.id`. `app` stays `APP_LINKS[link.href]` -> `undefined` for any
  href with no deeplink entry, which `LinkRow` already renders as a plain anchor (see `<interfaces>`).
- Replace the hardcoded featured mix `LinkRow` props with `FEATURED_MIX` from `@/lib/links-seed`
  (`href`, `label`, `sublabel`, `glyph`, `thumb`), keeping `kind="external"` and
  `app={APP_LINKS[FEATURED_MIX.href]}`. It stays a standalone `LinkRow` **after** the mapped rows,
  inside the same `<nav>` — per **D-05**.
- **Everything else is untouched**: `PageTransition`, the `<main>` classes, the wordmark `<img>`, both
  taglines, `CopyLinkButton`, the whole Panic Room recap `<Link>` card and its `<Image>` props
  (`priority`, `sizes`, classes). No class string anywhere may change.
- Imports: add `import { getPublishedLinks } from '@/lib/links-store'` and
  `import { FEATURED_MIX } from '@/lib/links-seed'`. Remove nothing else.
- Do **not** add `'use client'`, do not add a route handler, do not add any admin UI (**D-06**).

**(b) `README.md` line 20.** Replace
`- Next.js 15 (App Router) en export statique (\`output: 'export'\`), déployé sur Vercel`
with a line saying the app is a Next.js 15 App Router app deployed on Vercel (plus de `output: 'export'`
depuis le back-office `/links`), pages statiquement prérendues, `/links` en ISR revalidée par
`revalidateTag('links')`. Keep the file's French tone and bullet style. Change nothing else in README.

**(c) `/Users/myltonvanbolderen/CLAUDE.md` line 30** (the user's global memory, **outside the repo**):
replace `- **Deploiement** : Site statique/SSG (\`output: 'export'\`)` with
`- **Deploiement** : Next.js sur Vercel (SSG/ISR, plus d'\`output: 'export'\` depuis le back-office /links)`.
**Do not `git add` this file** — it is not in the repository. Mention the edit in the SUMMARY.

**(d) Sanity check while the dev server is up** (no restart): `curl -s http://localhost:3000/links/`
must still contain the 9 hrefs, 5 `data-app-link`, and `/images/_w/` in the `srcset`.
  </action>
  <verify>
    <automated>cd /Users/myltonvanbolderen/small-record && npx tsc --noEmit && npm run lint</automated>
    <automated>cd /Users/myltonvanbolderen/small-record && grep -q "await getPublishedLinks()" app/links/page.tsx && grep -q "export const revalidate" app/links/page.tsx && ! grep -q "const LINKS" app/links/page.tsx && echo PAGE_OK</automated>
    <automated>cd /Users/myltonvanbolderen/small-record && H=$(curl -s http://localhost:3000/links/) && [ "$(printf '%s' "$H" | grep -o 'data-app-link' | wc -l | tr -d ' ')" = 5 ] && printf '%s' "$H" | grep -q 'mailto:contact@small-records.com' && printf '%s' "$H" | grep -q '/images/_w/' && echo RENDER_OK</automated>
  </verify>
  <done>
`/links/` is served by an async server component reading `getPublishedLinks()`; no link array literal
remains in the page; the featured mix row and the recap card are still hardcoded. `curl` shows 9 hrefs,
5 `data-app-link` anchors, the mailto row, and `/images/_w/` srcsets. `npx tsc --noEmit` and
`npm run lint` clean. README line 20 and the global CLAUDE.md line 30 no longer claim static export.
Commit (stage these exact paths only):
`git add app/links/page.tsx README.md`
message `feat(links): render /links from the published store` ending with
`Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>`.
  </done>
</task>

<task type="auto">
  <name>Task 3: Prove parity (Playwright vs baseline) and prove the production build without static export</name>
  <files>scratchpad only (source files only if a check fails)</files>
  <action>
Scratchpad =
`/private/tmp/claude-501/-Users-myltonvanbolderen-small-record/54b5f0cd-5a66-4186-b337-6738006c59de/scratchpad`.
Work in `<scratchpad>/bo1/`. **Never kill or restart the :3000 dev server. No `npm install`.**

**A. Parity vs the Task 1 baseline.**
Re-run the snapshot script: `node <scratchpad>/bo1/snapshot.mjs <scratchpad>/bo1/after.json`, plus
`after-390.png` and `after-1440.png`. Then write `<scratchpad>/bo1/diff.mjs` which loads
`before.json` + `after.json` and asserts, printing one PASS/FAIL line each with the evidence:
1. The ordered `href` list is identical (9 entries, same order) — print both lists on failure.
2. For every anchor: same `target`, same `rel`, same `hasAppLink`, same normalised `text`, same
   `className`. Exactly 5 anchors have `data-app-link`, and they are #2,3,4,5,9.
3. The mailto anchor still has no `target`.
4. The ordered `img` list is identical on `src`, `alt`, `sizes`, `srcset` and `className`; every
   `srcset` for a `/images/**.jpg` source contains `/images/_w/` and all four widths
   (640, 1080, 1280, 1920) where the baseline had them; every img has `naturalWidth > 0`
   (no broken image).
5. `scrollWidth <= 390` at 390x844 (no horizontal overflow), and `scrollWidth` / `scrollHeight` match
   the baseline.
6. One-screen budget: deepest element bottom in `main` **<= 700** AND equal to the baseline value
   (tolerance 1px for sub-pixel rounding).
7. Every tap target in `main` (`a`, `button`) is **>= 44px** tall, and each height matches the
   baseline within 1px.
8. `main` outerHTML: report the unified diff. The only tolerated differences are React internal
   comment markers / `<!--$-->` suspense boundaries introduced by the async component. **Any
   difference in a tag, attribute, class or text node is a FAIL.**
Repeat the geometry checks (5,6,7) at 1440x900 as well, against the baseline captured at that size.
Exit non-zero on any FAIL. If something fails, fix `app/links/page.tsx` / `lib/links-seed.ts` and
re-run until green.

**B. Seed / fallback behaviour.**
- Confirm `BLOB_READ_WRITE_TOKEN` is unset (`env | grep -c BLOB_READ_WRITE_TOKEN` -> 0) and that
  `/Users/myltonvanbolderen/small-record/.links-store/` does **not** exist. So the rows currently on
  screen are proven to come from `seedDoc()` through the store — say so explicitly in the output.
- Check the dev server log (or a fresh request) shows the single `[links-store] BLOB_READ_WRITE_TOKEN
  missing` warning and no error/stack.
- Round-trip the disk backend with a throwaway Next-free harness is not possible (`unstable_cache`
  needs a Next runtime), so instead: `ls /Users/myltonvanbolderen/small-record/.links-store 2>/dev/null`
  must still report nothing afterwards — **part 1 must never write anything** (no caller exists, D-06).
  Report this as a PASS line.
- Confirm `git status --porcelain` never lists `.links-store` (it is ignored) and lists no unexpected file.

**C. Production build, in an APFS clone.**
```
SC=/private/tmp/claude-501/-Users-myltonvanbolderen-small-record/54b5f0cd-5a66-4186-b337-6738006c59de/scratchpad
rm -rf "$SC/build-clone"
cp -c -R /Users/myltonvanbolderen/small-record "$SC/build-clone"   # APFS clone: real node_modules copy
rm -rf "$SC/build-clone/.next" "$SC/build-clone/out"
cd "$SC/build-clone" && npm run build 2>&1 | tee "$SC/bo1/build.log"
```
(If `cp -c` is rejected, retry without `-c`. Turbopack breaks on symlinked `node_modules`, so **never**
symlink it.) `npm run build` runs `prebuild` (image variants, incremental — the `_w/` tree is already
cloned so it is a no-op) then `next build --turbopack`, i.e. exactly what Vercel runs.
Assertions, each PASS/FAIL with the evidence quoted from `build.log`:
1. The build **succeeds** (exit 0) with no `output: 'export'` and no error about dynamic features.
2. Paste the full route table. Assert `/`, `/casae`, `/letche`, `/small-record`, `/events` are
   prerendered (`○` static, or `●` SSG) and **not** `ƒ` dynamic. Report exactly what marker `/links`,
   `/sitemap.xml`, `/robots.txt`, `/_not-found`, `/v2`, `/carousel` got, and the legend lines. Do not
   assert a specific marker for `/links` — `revalidate = 3600` legitimately makes it `●`/ISR — just
   assert it is **not** `ƒ` (Dynamic, server-rendered on demand).
3. The prerendered `/links` HTML in the build output contains `/images/_w/` srcsets and the 9 hrefs:
   `grep -rl '/images/_w/' "$SC/build-clone/.next/server/app" | head` and grep the links HTML for the
   9 hrefs + 5 `data-app-link`. Report which file holds it.
4. `sitemap.xml` and `robots.txt` are produced as static files at build time (they carry
   `dynamic = 'force-static'`) — find them under `.next/server/app/` and show their content.
5. Then `cd "$SC/build-clone" && PORT=3100 npx next start` **in the background on port 3100 only**
   (never 3000). `curl -s http://localhost:3100/links/` must return 200 with the same 9 hrefs, and
   `curl -sI http://localhost:3100/images/logo/logo-wordmark-white.png` must return 200 — record the
   `cache-control` it reports (informational: that header comes from `next start`, not from
   `vercel.json`). Kill **only** this :3100 process when done (`kill` the PID you started).

**D. `vercel.json` headers — documentation check, no code change (D-07).**
Fetch the Vercel docs on `vercel.json` `headers` (e.g. https://vercel.com/docs/project-configuration)
and confirm in writing whether `headers` still apply to a Next.js deployment that is **not** a static
export, and specifically to `public/` assets served from `/images/...`. Quote the relevant sentence in
the SUMMARY. If the docs say the rules would no longer match, **report it as a follow-up** — do not
edit `vercel.json` or `next.config.ts` in this task.

**E. Leftover `out/` assumptions.**
`grep -rn "out/" --exclude-dir=node_modules --exclude-dir=.next --exclude-dir=.git --exclude-dir=.planning .`
and confirm only `.gitignore:3` and `eslint.config.mjs:11` remain (plus `.vercelignore`'s `out`), all of
which are harmless ignore entries. Confirm `README.md` and the global `CLAUDE.md` no longer claim static
export (Task 2). List anything else found in the SUMMARY as a follow-up; fix only if it is a one-line
doc edit.

Print a final PASS/FAIL summary table and exit non-zero on any failure.
  </action>
  <verify>
    <automated>cd /Users/myltonvanbolderen/small-record && npx tsc --noEmit && npm run lint</automated>
    <automated>node "/private/tmp/claude-501/-Users-myltonvanbolderen-small-record/54b5f0cd-5a66-4186-b337-6738006c59de/scratchpad/bo1/diff.mjs"</automated>
    <automated>grep -qE "Compiled successfully|✓ Generating static pages" "/private/tmp/claude-501/-Users-myltonvanbolderen-small-record/54b5f0cd-5a66-4186-b337-6738006c59de/scratchpad/bo1/build.log" && ! grep -qi "Failed to compile\|Build error" "/private/tmp/claude-501/-Users-myltonvanbolderen-small-record/54b5f0cd-5a66-4186-b337-6738006c59de/scratchpad/bo1/build.log" && echo BUILD_OK</automated>  </verify>
  <done>
`diff.mjs` exits 0 with every parity check PASS at both 390x844 and 1440x900: identical 9 hrefs in
identical order, identical target/rel/text/classes, 5 `data-app-link` anchors, identical images with
`/images/_w/` srcsets and no broken image, no horizontal overflow, deepest bottom <= 700px and equal to
the baseline, all tap targets >= 44px, and the `main` outerHTML differing only by React suspense
markers. The clone build in `<scratchpad>/build-clone` succeeded with the route table recorded, the 5
content pages still prerendered, `/links` not `ƒ` dynamic, `/images/_w/` srcsets present in the build
output, `sitemap.xml` + `robots.txt` emitted statically, and `next start` on :3100 serving `/links/`
correctly (that :3100 process is stopped; :3000 was never touched). The Vercel `headers` finding and
the `out/` grep result are written up. `git status --porcelain` shows no unexpected or untracked file
(`.links-store` never appeared).
Only commit if a fix to a source file was required: stage the exact path(s) and use a `fix(links): ...`
message ending with `Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>`. The expected outcome is no
third commit. **Do NOT deploy** (`vercel --prod` is not run).
  </done>
</task>

</tasks>

<threat_model>
## Trust Boundaries

| Boundary | Description |
|----------|-------------|
| Vercel Blob store -> server render of `/links/` | Untrusted JSON crosses into the rendered page (labels and hrefs become DOM) |
| local disk `.links-store/*.json` -> server render | Same, for the dev fallback |
| build/runtime env (`BLOB_READ_WRITE_TOKEN`) -> store layer | A secret selects the backend |
| public internet -> the app | The site stops being pure static files and starts running server code on Vercel |
| store writer (`saveDraft`/`publishDraft`) -> store | Write path exists but has no caller in this task |

## STRIDE Threat Register

| Threat ID | Category | Component | Disposition | Mitigation Plan |
|-----------|----------|-----------|-------------|-----------------|
| T-hle-01 | Tampering | `lib/links-store.ts` read path | mitigate | Every document is run through `parseLinksDoc()`, which rebuilds a fresh object from whitelisted fields and rejects anything else; a rejected/absent/corrupt document falls back to `seedDoc()`, so `/links/` can never render attacker-shaped data or an empty page |
| T-hle-02 | Tampering | `href` values reaching `LinkRow` | mitigate | Rendered through `next/link` or `<a href>` with React escaping; external rows keep `rel="noopener noreferrer"`. Note as a part-2 requirement: the admin form must reject `javascript:`/`data:` schemes at write time (`saveDraft` is the chokepoint) — out of scope here since no caller exists yet |
| T-hle-03 | Information disclosure | `links/draft.json` at `access: 'public'` | accept | Per **D-02**: labels + public URLs only, no secrets, no PII; the pathname sits under a random store id. Documented follow-up: switch the draft to `access: 'private'` once a token exists and it can be tested |
| T-hle-04 | Information disclosure | `BLOB_READ_WRITE_TOKEN` | mitigate | Only read via `process.env` inside a server-only module; never imported from a `'use client'` file, never interpolated into a log line (the warning only states the variable is *missing*); `.env*` is already gitignored and vercelignored |
| T-hle-05 | Denial of service | Blob outage / latency on every request | mitigate | Per **D-01** the published read is wrapped in `unstable_cache` and the page is prerendered with `revalidate = 3600`, so a Blob outage serves the last good render; `readRaw` swallows every error and `getPublishedLinks` degrades to `seedDoc()` instead of throwing a 500 |
| T-hle-06 | Denial of service | Write to a read-only serverless filesystem | mitigate | `writeRaw` throws an explicit, actionable error when `process.env.VERCEL` is set but the token is missing, instead of an opaque `EROFS` deep in the stack |
| T-hle-07 | Elevation of privilege | New server surface (site is no longer a static export) | mitigate | This task adds **no** route handler, **no** server action and **no** admin page (**D-06**); the only new server code is a read on one prerendered route. Authn/authz for the write path is an explicit part-2 requirement — record it as such in the SUMMARY |
| T-hle-08 | Repudiation | Who changed the links | accept | Single-operator site; `updatedAt` is stamped on every `saveDraft`/`publishDraft`. Full audit logging is out of scope |
</threat_model>

<verification>
- `npx tsc --noEmit` -> 0 errors
- `npm run lint` -> 0 errors (ESLint also runs inside `next build`)
- `node <scratchpad>/bo1/diff.mjs` -> every parity check PASS at 390x844 and 1440x900, exit 0
- `npm run build` inside the APFS clone `<scratchpad>/build-clone` -> exit 0, route table recorded,
  the 5 content pages prerendered, `/links` not `ƒ` dynamic, `/images/_w/` srcsets present in the
  prerendered HTML, `sitemap.xml` + `robots.txt` emitted statically
- `npx next start` on **:3100 only** in the clone -> `/links/` 200 with the same 9 hrefs; process stopped
  afterwards. The :3000 dev server is never killed or restarted at any point
- `git diff --stat` touches only the 10 files in `files_modified`; `git status --porcelain` never shows
  `.links-store`, `public/asset`, `public/images/_w` or `.claude`
- Exactly one `npm install` was run (`@vercel/blob`), and `package-lock.json` is committed with it
- No deploy (`vercel --prod` is NOT run)
</verification>

<success_criteria>
- `output: 'export'` is gone; `npm run build` succeeds and `/`, `/casae/`, `/letche/`, `/small-record/`,
  `/events/` are still prerendered at build time
- `/links/` is an async server component reading `getPublishedLinks()`; no link array literal remains
  in the page
- With no token and no `.links-store/`, `/links/` renders the exact same 7 rows as before via the seed,
  logging one warning and never throwing
- The rendered page is indistinguishable from the pre-change baseline: 9 hrefs in the same order, same
  labels/classes/target/rel, 5 `data-app-link` anchors, tap targets >= 44px, no horizontal overflow,
  deepest bottom <= 700px at 390x844, no broken images
- The custom image pipeline is untouched and still emits `/images/_w/{640,1080,1280,1920}/*.webp`
  srcsets in dev and in the production build
- `lib/links-store.ts` exports `LINKS_TAG`, `getPublishedLinks`, `getDraftLinks`, `saveDraft`,
  `publishDraft`, backed by Vercel Blob when `BLOB_READ_WRITE_TOKEN` is set and by gitignored
  `.links-store/*.json` otherwise
- Part 2 can invalidate `/links/` by calling `publishDraft()` alone
- The featured mix row and the Panic Room recap card are still hardcoded and explicitly documented as
  outside the store
- No admin UI, route handler or server action was added; nothing was deployed
</success_criteria>

<output>
After completion, create
`.planning/quick/260929-hle-backoffice-links-partie-1-conversion-et-/260929-hle-SUMMARY.md`.
It must include, for part 2: the exact store API signatures, the seed ids, the caching/invalidation
contract (`revalidateTag('links')` via `publishDraft()`), the `access: 'public'` draft decision and its
follow-up, the recorded build route table, the Vercel `vercel.json` `headers` finding, and the explicit
note that authn/authz for the admin write path is still to be designed.
</output>
