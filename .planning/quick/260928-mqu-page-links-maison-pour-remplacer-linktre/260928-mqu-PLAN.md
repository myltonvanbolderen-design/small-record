---
phase: quick/260928-mqu
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - app/links/page.tsx
  - components/magazine/LinkRow.tsx
  - components/magazine/CopyLinkButton.tsx
  - app/sitemap.ts
  - public/images/mix-pool-party.jpg
autonomous: false
requirements: [LINKS-01, LINKS-02, LINKS-03, LINKS-04]

must_haves:
  truths:
    - "Visiting /links/ shows the wordmark, an intro line, a Panic Room recap card, 7 tappable link rows and a featured mix card, in that order"
    - "Every link points at the exact URL agreed with the user; external ones open in a new tab with rel=noopener noreferrer"
    - "On an iPhone-sized viewport the whole page is one centered column, every tap target is at least 44px tall, and there is no horizontal scroll"
    - "/links/ appears in the generated sitemap with priority 0.6"
    - "The page shares as 'Small Records — all our links' with the og-label image"
  artifacts:
    - path: "app/links/page.tsx"
      provides: "The /links route: metadata + full page composition"
      contains: "pageMetadata"
    - path: "components/magazine/LinkRow.tsx"
      provides: "Reusable big tappable link row (internal Link or external a)"
      exports: ["LinkRow"]
    - path: "components/magazine/CopyLinkButton.tsx"
      provides: "Client-side copy-to-clipboard button with Copied state"
      exports: ["CopyLinkButton"]
    - path: "app/sitemap.ts"
      provides: "Sitemap including /links/ at priority 0.6"
      contains: "/links/"
  key_links:
    - from: "app/links/page.tsx"
      to: "components/magazine/LinkRow.tsx"
      via: "import + 7 LinkRow instances"
      pattern: "LinkRow"
    - from: "app/links/page.tsx"
      to: "/events/#panic-room"
      via: "next/link on the recap card"
      pattern: "/events/#panic-room"
    - from: "app/links/page.tsx"
      to: "/images/mix-pool-party.jpg"
      via: "next/image fill with sizes"
      pattern: "mix-pool-party"
---

<objective>
Build `/links/` — Small Records' own link-in-bio page — to replace a near-empty Linktree
(4 links, one of them an expired Shotgun event, plus Linktree ads).

Purpose: give the crew one Instagram-bio URL they own, that always points at live content
(latest recap, socials, booking) and looks like the rest of the magazine.
Output: a deployed-ready `/links/` route, a reusable `LinkRow` component, a small
`CopyLinkButton`, sitemap entry, and the already-on-disk mix thumbnail committed.
</objective>

<execution_context>
@$HOME/.claude/get-shit-done/workflows/execute-plan.md
</execution_context>

<context>
@/Users/myltonvanbolderen/CLAUDE.md
@app/small-record/page.tsx
@components/magazine/SectionHeader.tsx
@components/magazine/MediaTile.tsx
@components/layout/Footer.tsx
@lib/seo.ts
@app/sitemap.ts
@app/not-found.tsx

## Environment facts (already verified — do not re-check)

- `next.config.ts`: `output: 'export'`, `trailingSlash: true`, custom image loader
  (`lib/image-loader.ts`) that rewrites `/images/x.jpg` → `/images/_w/{640|1080|1280|1920}/x.webp`.
  Never pass `unoptimized`; ALWAYS pass `sizes` on `<Image fill>`.
- `public/images/mix-pool-party.jpg` exists on disk (1280×720, untracked — must be committed).
  Its WebP variants do NOT exist yet in `public/images/_w/` → `npm run images` is required
  or the image 404s. The script is incremental (skips up-to-date files), so it is fast.
- The site `Header` is `fixed top-0` and the layout renders `Header` + `children` + `Footer`.
  Pages elsewhere start with a full-height cover, so they need no top padding — `/links/`
  is a short page and DOES need explicit top padding to clear the fixed masthead.
- `/events/page.tsx` has `<section id="panic-room" className="scroll-mt-20 …">` → `/events/#panic-room` resolves.
- Dev server is ALREADY RUNNING on http://localhost:3000 (`npx next dev --turbopack --port 3000`)
  in the user's own terminal. Never kill, restart, or `npm install`. Turbopack picks up the new route.
- Playwright: `~/Downloads/PANIC ROOM/_kit/node_modules` (playwright + playwright-core, chromium
  installed). Use `createRequire` from that path in a script placed in the scratchpad.
- Scratchpad: `/private/tmp/claude-501/-Users-myltonvanbolderen-small-record/54b5f0cd-5a66-4186-b337-6738006c59de/scratchpad`

## Interfaces

From `lib/seo.ts`:
```ts
export const SITE_URL = 'https://small-records.com'
export function pageMetadata(opts: {
  title: string | { absolute: string }
  ogTitle: string
  description: string
  path: string
  image: { url: string; width: number; height: number; alt: string }
}): Metadata
```
Note: root layout has `title.template = '%s | Small Records'` → pass `title: 'Links'` only.

From `app/sitemap.ts` (current shape — will be reworked in Task 1):
```ts
const PATHS = ['/', '/small-record/', '/casae/', '/letche/', '/events/']
// priority: path === '/' ? 1 : 0.8
```

Design tokens (`app/globals.css`): `--color-noir #0A0A0A`, `--color-blanc #F5F0E8`,
`--color-terracotta #CC2936`, `--color-terracotta-light #E0525E` (the only red allowed for
small text). Fonts: `font-display` (Playfair), `font-condensed` (Bebas), `font-body` (DM Sans).

## Locked decisions (do NOT reopen)

- Route `/links/`, public, deployed (must NOT be added to `.vercelignore`).
- Plain `https://` hrefs only for Instagram/SoundCloud/YouTube — universal links open the
  native app when installed. NO custom schemes (`instagram://`), NO JS scheme+timeout tricks.
- Do NOT touch the existing `linktr.ee` links in Header/Footer/small-record — the user keeps
  Linktree alive for now.
- Do NOT embed the YouTube iframe on /links/ — thumbnail card only (page weight).
- No dark full-photo overlays: bottom gradients only, per CLAUDE.md.
</context>

<tasks>

<task type="auto">
  <name>Task 1: Build the /links page, LinkRow + CopyLinkButton, sitemap entry</name>
  <files>
    app/links/page.tsx,
    components/magazine/LinkRow.tsx,
    components/magazine/CopyLinkButton.tsx,
    app/sitemap.ts
  </files>
  <action>
**1. `components/magazine/LinkRow.tsx`** — server component (no `'use client'`). Props:
`{ href: string; label: string; sublabel?: string; external?: boolean }`.
Renders `next/link` when `external` is falsy, a raw `<a target="_blank" rel="noopener noreferrer">`
when true. Single shared className so both branches look identical — build it as a `const rowClass`
used by both. Styling:
`group flex min-h-14 w-full items-center justify-between gap-4 border border-blanc/15 px-4 py-3 transition-colors hover:border-terracotta hover:bg-blanc/5`
(`min-h-14` = 56px, the agreed tap-target floor).
Inside: a left column with `label` in `font-condensed text-[0.8rem] uppercase tracking-[0.2em] text-blanc`
and, if present, `sublabel` in `font-body text-[0.75rem] text-blanc/55` (never lighter than /55).
Right: `<span aria-hidden="true" className="font-condensed text-blanc/40 transition-transform group-hover:translate-x-1">→</span>`.

**2. `components/magazine/CopyLinkButton.tsx`** — `'use client'`, self-contained, no deps beyond React.
`useState<boolean>` + `navigator.clipboard.writeText('https://small-records.com/links/')`
inside a `try/catch` (clipboard rejects on insecure origins — on failure leave the label unchanged).
On success set `copied` true and reset after 2000ms via `setTimeout`, clearing the timer in a
`useEffect` cleanup so an unmount doesn't set state. Button: `type="button"`,
`aria-label="Copy the link to this page"`, visible text `Copy link` → `Copied` when `copied`,
plus `<span aria-live="polite" className="sr-only">{copied ? 'Link copied' : ''}</span>`.
Style it discreet: `font-condensed text-[0.65rem] uppercase tracking-[0.25em] text-blanc/55
transition-colors hover:text-terracotta`. Keep it under ~40 lines; if it starts needing anything
else, drop the component entirely and note the skip in the summary.

**3. `app/links/page.tsx`** — server component. Export
`const metadata = pageMetadata({ title: 'Links', ogTitle: 'Small Records — all our links',
description: '…', path: '/links/', image: { url: '/og/og-label.jpg', width: 1200, height: 630,
alt: 'Casae and Letche, Small Records' } })`. The description must be ~150 chars and mention
Instagram, SoundCloud, YouTube, booking and Paris — e.g.
`'All Small Records links in one place: Instagram, SoundCloud (Casae & Letche), YouTube mixes, live recaps and booking. Paris DJ crew and label.'`

Structure (wrap in `<PageTransition>` like the other pages):
`<main id="main-content" tabIndex={-1} className="min-h-screen bg-noir text-blanc outline-none">`
then `<div className="mx-auto w-full max-w-md px-5 pt-28 pb-20 md:pt-32">` — the top padding is
what clears the fixed Header. Sections separated by `mt-10` / `mt-12`, single column at every width.

  a. **Header block** (centered): native `<img src="/images/logo/logo-wordmark-white.png"
     alt="Small Records" className="mx-auto h-auto w-56 object-contain" />` with
     `{/* eslint-disable-next-line @next/next/no-img-element */}` above it — no filter, no next/image
     (CLAUDE.md). Then `<h1 className="sr-only">Small Records — links</h1>`, then
     `DJ crew & label · Paris` in `font-condensed text-[0.7rem] uppercase tracking-[0.4em] text-blanc/70`
     and `House · Techno · Baile Funk · Afrohouse · Disco` in
     `font-body text-[0.75rem] text-blanc/55`. Render the `CopyLinkButton` at the end of this block.

  b. **Latest recap card** — `<Link href="/events/#panic-room" className="group relative block
     overflow-hidden">` containing `<div className="relative aspect-[16/10] w-full overflow-hidden">`
     with `<Image src="/images/panic-room/trio.jpg" alt="Casae, Letche and Lessovik at Panic Room"
     fill priority className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
     sizes="(min-width: 448px) 448px, 100vw" />`, a bottom gradient
     `absolute inset-0 bg-gradient-to-t from-noir/90 via-noir/20 to-transparent` (bottom-readability
     gradient only — no flat veil), and an absolutely-positioned caption at
     `inset-x-0 bottom-0 p-4`: kicker `Latest · Live` in
     `font-condensed text-[0.55rem] uppercase tracking-[0.4em] text-terracotta-light`,
     title `Small Party @ Panic Room` in `font-display text-[1.4rem] font-bold leading-none`,
     meta `Sept 11, 2026 · 711 people` in `font-body text-[0.8rem] text-blanc/55`.

  c. **Link rows** — a `<nav aria-label="Small Records links">` with `flex flex-col gap-3`,
     mapping a module-level `const LINKS` array over `LinkRow`, in EXACTLY this order and with
     EXACTLY these hrefs:
     1. `Instagram` / sub `@smallmusics` / `https://www.instagram.com/smallmusics` / external
     2. `SoundCloud — Casæ` / `https://soundcloud.com/casae` / external
     3. `SoundCloud — Letché` / `https://soundcloud.com/letchetony` / external
     4. `YouTube` / `https://www.youtube.com/@SmallRecords_Music` / external
     5. `Events & recaps` / `/events/` / internal
     6. `The Label` / `/small-record/` / internal
     7. `Booking` / sub `contact@small-records.com` / `mailto:contact@small-records.com` / external
        (mailto must NOT get `target="_blank"` — give `LinkRow` a third case, or set
        `external` only for `http(s)` hrefs and render mailto as a plain `<a>` with no target/rel.
        Simplest: `kind: 'internal' | 'external' | 'mail'` in the array, `LinkRow` switches on it.)

  d. **Featured mix card** — `<a href="https://youtu.be/X9rpsIVIVgk" target="_blank"
     rel="noopener noreferrer" className="group relative block overflow-hidden">`,
     `<div className="relative aspect-video w-full overflow-hidden">` +
     `<Image src="/images/mix-pool-party.jpg" alt="House mix, pool party set in the South of France"
     fill className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
     sizes="(min-width: 448px) 448px, 100vw" />`, a centered play badge
     (`absolute inset-0 flex items-center justify-center` → a `h-14 w-14 rounded-full border
     border-blanc/70 bg-noir/50 backdrop-blur-sm flex items-center justify-center` with a `▶`
     glyph, `aria-hidden="true"` — a small badge, not a full-photo veil), bottom gradient +
     caption `Featured Mix` kicker (terracotta-light), title `House Mix · Pool Party`,
     meta `Summer DJ set · South of France`.

Do NOT wrap the photo cards in `AnimatedSection` (CLAUDE.md: text only, it makes photos flicker).
A single `AnimatedSection` around the header text block (a) is fine; skip animation elsewhere.

**4. `app/sitemap.ts`** — replace the flat `PATHS` string array with an explicit
`{ path, priority }` list so priorities are per-route, keeping the existing five entries at their
current values (`/` → 1, the rest → 0.8) and adding `{ path: '/links/', priority: 0.6 }`.
Keep `export const dynamic = 'force-static'` and the `lastModified` / `changeFrequency` fields.

**5. Generate the WebP variants for the new photo:** `npm run images`
(this is a plain node script, NOT an install). It must produce
`public/images/_w/640/mix-pool-party.webp` and the 1080/1280/1920 siblings.
`public/images/_w/` is gitignored — generated locally and at Vercel `prebuild`.

Do NOT add `/links` to `.vercelignore`. Do NOT add a `/links` entry to the Header/Footer nav
(not requested). Do NOT modify any `linktr.ee` href.
  </action>
  <verify>
    <automated>cd /Users/myltonvanbolderen/small-record && npx tsc --noEmit && npm run lint && ls public/images/_w/640/mix-pool-party.webp && curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/links/</automated>
  </verify>
  <done>
`npx tsc --noEmit` clean, `npm run lint` reports 0 errors, the four WebP variants of
`mix-pool-party` exist, and the running dev server returns 200 for `http://localhost:3000/links/`.
  </done>
</task>

<task type="auto">
  <name>Task 2: Verify with Playwright at two viewports + static export, then commit</name>
  <files>
    (verification only — plus any fix needed in app/links/page.tsx or components/magazine/LinkRow.tsx)
  </files>
  <action>
Write a single throwaway Node script in the scratchpad (`scratchpad/links/check.mjs`) that uses
Playwright from the kit:

```js
import { createRequire } from 'node:module'
const require = createRequire('/Users/myltonvanbolderen/Downloads/PANIC ROOM/_kit/')
const { chromium } = require('playwright')
```

Point it at `http://localhost:3000/links/` (the dev server already running — never restart it).
Run two passes and save screenshots (full page) into `scratchpad/links/`:
- `iphone13.png` — viewport 390×844, `deviceScaleFactor: 3`, `isMobile: true`, `hasTouch: true`
- `desktop.png` — viewport 1440×900

Assert and PRINT the real measured values for each of these:
1. **Exact hrefs.** Read every `main a[href]` in DOM order and compare against the expected list
   (absolute URLs after resolution): `https://www.instagram.com/smallmusics`,
   `https://soundcloud.com/casae`, `https://soundcloud.com/letchetony`,
   `https://www.youtube.com/@SmallRecords_Music`, `http://localhost:3000/events/`,
   `http://localhost:3000/small-record/`, `mailto:contact@small-records.com`,
   `http://localhost:3000/events/#panic-room` (recap card), `https://youtu.be/X9rpsIVIVgk` (mix card).
   Any typo or missing trailing slash on the internal ones is a FAIL.
2. **target/rel on external links:** every `a[href^="https://"]` inside `main` has
   `target="_blank"` and `rel` containing both `noopener` and `noreferrer`. The `mailto:` link
   must have NO `target`.
3. **No broken images:** every `<img>` in the document has `naturalWidth > 0` (covers the wordmark,
   the trio photo and the mix thumbnail through the WebP loader).
4. **Tap targets (mobile pass only):** `getBoundingClientRect().height >= 44` for every
   `main a`, and for the copy button. Print the minimum height found.
5. **No horizontal scroll:** `document.documentElement.scrollWidth === window.innerWidth` on both passes.
6. **Page length (mobile pass):** print `document.documentElement.scrollHeight`. Target < 1300px
   (~1.5 screens). If it is above, report the real number in the summary and propose the trim
   (tighter vertical rhythm / smaller cards) rather than silently shipping a long page.

Then confirm the sitemap: `curl -s http://localhost:3000/sitemap.xml | grep -c 'small-records.com/links/'`
must be 1, and the entry must carry `<priority>0.6</priority>`.

Then confirm the static export really emits the route — copy the repo into the scratchpad with an
APFS clone (Turbopack breaks on symlinked node_modules, so the real directory must be copied):
`cp -cR /Users/myltonvanbolderen/small-record <scratchpad>/build` then `npx next build` in that
clone. Assert `out/links/index.html` exists and `out/sitemap.xml` contains `/links/`. Never build
in the project directory (it would fight the running dev server).

If any assertion fails, fix the source in the project directory, let Turbopack hot-reload, and
re-run the script before moving on.

Once all checks pass, commit exactly these paths (nothing else — never `public/asset`,
`public/images/_w`, `.claude`, or the scratchpad):
`git add app/links/page.tsx components/magazine/LinkRow.tsx components/magazine/CopyLinkButton.tsx app/sitemap.ts public/images/mix-pool-party.jpg`
(drop `CopyLinkButton.tsx` from the list if the component was skipped). Message:

```
feat(links): own link-in-bio page at /links

Replaces a near-empty Linktree: wordmark header, Panic Room recap card,
7 tappable link rows (Instagram, both SoundClouds, YouTube, events, label,
booking) and the featured mix thumbnail. Added to the sitemap at 0.6.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
```

Run `git status --short` afterwards and confirm nothing unexpected was staged. Do NOT deploy
(`vercel --prod` is out of scope for this task).
  </action>
  <verify>
    <automated>cd /Users/myltonvanbolderen/small-record && node "$SCRATCH/links/check.mjs" && curl -s http://localhost:3000/sitemap.xml | grep -c 'small-records.com/links/' && git log -1 --stat</automated>
  </verify>
  <done>
All 6 Playwright assertions pass at 390×844 and 1440×900, screenshots are in `scratchpad/links/`,
the sitemap contains `/links/` at priority 0.6, the static export produced `out/links/index.html`
in the scratchpad clone, and one commit exists containing only the 4-5 intended paths.
  </done>
</task>

<task type="checkpoint:human-verify" gate="blocking">
  <name>Task 3: Human check of /links on phone and desktop</name>
  <action>Pause and hand over to the user: show the two screenshots and the measured mobile scroll height, then wait for the verdict on layout, wording and row order. Do not deploy.</action>
  <what-built>
`/links/` is live on the dev server: wordmark + "DJ crew & label · Paris" + genre line + copy-link
button, the Panic Room recap card, 7 link rows, and the pool-party mix thumbnail card. Sitemap
updated, `mix-pool-party.jpg` committed. Linktree links elsewhere on the site untouched.
  </what-built>
  <how-to-verify>
1. Open http://localhost:3000/links/ and shrink the window to phone width (or use device mode
   at 390px). Check it reads as one clean column and fits in roughly 1.5 screens — the measured
   scroll height is reported in the summary.
2. Tap/click each row: Instagram, SoundCloud Casæ, SoundCloud Letché, YouTube open in a new tab;
   "Events & recaps" and "The Label" stay on the site; "Booking" opens your mail client.
3. Click the recap card → it should land on `/events/` scrolled to the Panic Room section.
4. Click the mix card → the YouTube video opens in a new tab.
5. Click "Copy link", paste somewhere: you should get `https://small-records.com/links/`.
6. Open the two screenshots in the scratchpad (`links/iphone13.png`, `links/desktop.png`) and say
   whether the hierarchy and vertical rhythm feel right — this is the one call only you can make.
7. On a real iPhone later: the Instagram/SoundCloud/YouTube links should open the native apps
   (plain https links = universal links).

Not done here on purpose: no deploy, and the Linktree links in the header/footer are still there
(you said you're keeping Linktree alive for now).
  </how-to-verify>
  <resume-signal>Type "approved", or tell me what to adjust (spacing, wording, order of rows, card sizes).</resume-signal>
</task>

</tasks>

<verification>
- `npx tsc --noEmit` — clean
- `npm run lint` — 0 errors (ESLint also runs during `next build`, local and on Vercel)
- Playwright: exact hrefs, target/rel on externals, no broken images, tap targets ≥ 44px,
  no horizontal scroll, mobile scroll height reported
- `http://localhost:3000/sitemap.xml` contains `https://small-records.com/links/` at priority 0.6
- Static export in the scratchpad clone produces `out/links/index.html`
- `git log -1 --stat` shows only the intended paths
</verification>

<success_criteria>
- `/links/` renders the agreed content in the agreed order, phone-first, `max-w-md` centered,
  with the site Header and Footer intact
- All 9 links resolve to the exact agreed URLs; external ones are `target="_blank"` +
  `rel="noopener noreferrer"`; no custom URL schemes anywhere
- No YouTube iframe on the page (thumbnail card only)
- `mix-pool-party.jpg` is committed; `public/images/_w/` is not
- Nothing that mentions `linktr.ee` was modified
- One atomic commit ending with the `Co-Authored-By: Claude Opus 5` line; no deploy
</success_criteria>

<output>
After completion, create
`.planning/quick/260928-mqu-page-links-maison-pour-remplacer-linktre/260928-mqu-SUMMARY.md`
including: the measured mobile scroll height, whether `CopyLinkButton` shipped or was skipped,
and the screenshot paths.
</output>
