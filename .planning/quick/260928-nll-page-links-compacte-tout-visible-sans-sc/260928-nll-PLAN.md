---
phase: quick/260928-nll
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - lib/utils.ts
  - components/layout/Header.tsx
  - components/layout/Footer.tsx
  - app/links/page.tsx
  - components/magazine/LinkRow.tsx
  - components/magazine/CopyLinkButton.tsx
autonomous: true
requirements: [LINKS-05, LINKS-06, LINKS-07]

must_haves:
  truths:
    - "At 390x844 (iPhone 13) the whole /links/ content fits above 700 css px: document.documentElement.scrollHeight <= 700 AND the last interactive element's getBoundingClientRect().bottom <= 700"
    - "At 375x667 (iPhone SE) the /links/ content still fits in the viewport without scrolling (scrollHeight <= 667)"
    - "/links/ renders no site <header> and no site footer; /, /events/, /casae/, /letche/, /small-record/ still render both"
    - "All 9 destinations are unchanged and in the same order (recap card -> Instagram -> SoundCloud Casae -> SoundCloud Letche -> YouTube -> Events & recaps -> The Label -> Booking -> YouTube mix); external links keep target=_blank + rel=noopener noreferrer, the mailto has neither"
    - "Every tap target on /links/ is at least 44px tall, there is no horizontal overflow, and no image fails to load"
    - "The Copy link button is still present and still copies https://small-records.com/links/"
  artifacts:
    - path: "lib/utils.ts"
      provides: "isChromelessRoute() helper (trailing-slash tolerant route match)"
      exports: ["cn", "isChromelessRoute"]
    - path: "components/layout/Header.tsx"
      provides: "Site header that returns null on chromeless routes"
      contains: "isChromelessRoute"
    - path: "components/layout/Footer.tsx"
      provides: "Site footer that returns null on chromeless routes (markup unchanged elsewhere)"
      contains: "isChromelessRoute"
    - path: "app/links/page.tsx"
      provides: "Compact single-screen link-in-bio layout"
      contains: "max-w-md"
    - path: "components/magazine/LinkRow.tsx"
      provides: "Single-line 44px row with optional inline sublabel, optional thumbnail and glyph"
      exports: ["LinkRow"]
  key_links:
    - from: "components/layout/Header.tsx"
      to: "lib/utils.ts"
      via: "isChromelessRoute(usePathname())"
      pattern: "isChromelessRoute"
    - from: "components/layout/Footer.tsx"
      to: "lib/utils.ts"
      via: "isChromelessRoute(usePathname())"
      pattern: "isChromelessRoute"
    - from: "app/links/page.tsx"
      to: "components/magazine/LinkRow.tsx"
      via: "8 LinkRow instances (7 links + the mix row)"
      pattern: "LinkRow"
    - from: "app/links/page.tsx"
      to: "/events/#panic-room"
      via: "next/link on the compact recap card"
      pattern: "/events/#panic-room"
---

<objective>
Make `/links/` fit entirely on one phone screen at load. It is the link-in-bio, opened almost
exclusively from Instagram on a phone, where the in-app browser chrome eats ~120-150px.

Today the page is ~1996px tall at 390x844 (about 3 screens): it carries the fixed site Header, a
16/10 recap photo card, 7 rows of 56-67px, a 16/9 mix card and the full site Footer (which
duplicates the very links this page exists for, and still points at Linktree).

Purpose: a visitor arriving from the Instagram bio sees every destination without scrolling.
Output: chromeless `/links/` route + compacted layout, verified by Playwright at 390x844 and
375x667, with screenshots.
</objective>

<execution_context>
@$HOME/.claude/get-shit-done/workflows/execute-plan.md
@$HOME/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@CLAUDE.md
@.planning/quick/260928-mqu-page-links-maison-pour-remplacer-linktre/260928-mqu-SUMMARY.md
@app/links/page.tsx
@components/magazine/LinkRow.tsx
@components/magazine/CopyLinkButton.tsx
@components/layout/Header.tsx
@components/layout/Footer.tsx
@app/layout.tsx
@lib/utils.ts

<interfaces>
<!-- Contracts the executor needs. No codebase exploration required. -->

lib/utils.ts (current):
```ts
export function cn(...inputs: ClassValue[]): string
```

components/magazine/LinkRow.tsx (current):
```ts
interface LinkRowProps {
  href: string
  label: string
  sublabel?: string
  kind?: 'internal' | 'external' | 'mail'
}
export function LinkRow(props: LinkRowProps): JSX.Element
```
Internally: one shared `rowClass` string used by all three branches
(`min-h-14` + `px-4 py-3` + `flex-col gap-1` sublabel below the label).

app/layout.tsx renders (do not restructure):
```tsx
<Providers>
  <ScrollToTop />
  <Header />
  <div id="main">{children}<Footer /></div>
</Providers>
```
`Header` is already `'use client'` and already calls `usePathname()`.
`Footer` is currently a server component (plain markup + `next/link` + `<img>` + `HorizontalRule`,
which is itself `'use client'`) — nothing server-only, so adding `'use client'` is safe.

next.config.ts: `output: 'export'`, `trailingSlash: true` -> `usePathname()` returns `/links/`
in the browser; treat `/links` and `/links/` as the same route.

app/globals.css:
- `html { background-color: var(--color-noir) }` -> the page does NOT need `min-h-screen` to stay
  black. Removing it is what makes `scrollHeight` equal the real content height.
- `.page-enter` animates `opacity 0 -> 1, translateY(20px) -> 0` over 0.5s (disabled under
  `prefers-reduced-motion: reduce`).

Wordmark geometry (measured): `public/images/logo/logo-wordmark-white.png` is a 512x512 canvas
whose visible artwork is only 453x306 -> there is a fully transparent band of 20.1% of the box
height above and below the letters. Rendered at `w-32` (128px) the box is 128px tall but the
letters are only ~76px tall, with ~26px of dead space top and bottom.
</interfaces>
</context>

<tasks>

<task type="auto">
  <name>Task 1: Hide the site Header and Footer on /links only</name>
  <files>lib/utils.ts, components/layout/Header.tsx, components/layout/Footer.tsx</files>
  <action>
Add a chromeless-route escape hatch so `/links/` renders without the site Header and Footer
(locked decision 1 — the footer duplicates the page's own links and still points at Linktree).

1. `lib/utils.ts` — add next to `cn()`:
```ts
const CHROMELESS_ROUTES = new Set(['/links'])

/** True for routes that render without the site Header/Footer (link-in-bio). */
export function isChromelessRoute(pathname: string | null | undefined): boolean {
  if (!pathname) return false
  const normalized = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname
  return CHROMELESS_ROUTES.has(normalized)
}
```
The normalization is required because `trailingSlash: true` makes `usePathname()` return
`/links/`. Keep `cn()` exactly as it is.

2. `components/layout/Header.tsx` — it already has `'use client'` and
`const pathname = usePathname()`. Add, immediately after the existing hooks (AFTER the
`useEffect`, never before a hook — early-returning above a hook breaks the rules of hooks):
```ts
if (isChromelessRoute(pathname)) return null
```
Import `isChromelessRoute` from `@/lib/utils` (the file already imports `cn` from there — extend
that import). Do not touch the overlay menu markup.

3. `components/layout/Footer.tsx` — add `'use client'` as the first line, import
`usePathname` from `next/navigation` and `isChromelessRoute` from `@/lib/utils`, then:
```ts
export function Footer() {
  const pathname = usePathname()
  if (isChromelessRoute(pathname)) return null
  return ( /* existing markup, byte-for-byte unchanged */ )
}
```
This is the simpler of the two options in the decision (a separate client wrapper would add a
file and an indirection for the same result). Keep the footer markup untouched — same wordmark,
same nav, same Instagram/SoundCloud/Linktree strip — so the other 5 pages are unaffected.
Do NOT change the Linktree href here or anywhere else on the site.

Note: the returned `null` still leaves the layout's `<div id="main">` wrapper and the skip link
in place; `/links/` keeps `id="main-content"` on its `<main>`, so "Skip to content" still works.
  </action>
  <verify>
    <automated>cd /Users/myltonvanbolderen/small-record && npx tsc --noEmit && npm run lint</automated>
    <automated>curl -s http://localhost:3000/links/ | grep -c "<header" | grep -qx 0 && curl -s http://localhost:3000/events/ | grep -qc "<header" && echo CHROME_OK</automated>
  </verify>
  <done>
`isChromelessRoute` exists in `lib/utils.ts`; Header and Footer both early-return `null` for
`/links` and `/links/`; `tsc --noEmit` and `npm run lint` are clean; `/links/` serves no
`<header>` while `/events/` still does.
Commit (stage these exact paths only):
`git add lib/utils.ts components/layout/Header.tsx components/layout/Footer.tsx`
`feat(links): render /links without site header and footer`
ending with `Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>`.
  </done>
</task>

<task type="auto">
  <name>Task 2: Compact /links to a one-screen layout and verify it with Playwright</name>
  <files>app/links/page.tsx, components/magazine/LinkRow.tsx, components/magazine/CopyLinkButton.tsx</files>
  <action>
Rebuild the `/links/` layout to the height budget below. Keep all 9 destinations, their exact
hrefs and their current order (locked decision 2): recap card -> Instagram -> SoundCloud Casae ->
SoundCloud Letche -> YouTube -> Events & recaps -> The Label -> Booking -> featured mix.

**Height budget at 390x844 (target ~645px, hard ceiling 700px):**

| Block | mobile px |
|---|---|
| top padding `pt-4` | 16 |
| wordmark (occupied height) | ~68 |
| tagline `mt-2` + line | 21 |
| genre line `mt-1` + line | 18 |
| recap card `mt-3` + `h-[88px]` | 100 |
| 7 rows: `mt-3` + 7 x 44 + 6 gaps x 6 | 356 |
| mix row: gap 6 + 44 | 50 |
| bottom padding `pb-4` | 16 |
| **total** | **~645** |

Treat the table as the contract, not the exact class names: if measurement shows you are over,
take it out of the recap card height and the gaps first, never out of the 44px tap targets.

**a. `components/magazine/LinkRow.tsx`** — make rows single-line and 44px:
- Change `rowClass` from `min-h-14 ... px-4 py-3` to `min-h-11 ... px-3 py-2 md:min-h-12 md:px-4`
  (`min-h-11` = 44px, the accessibility floor — never go below).
- `RowContent`: drop the `flex-col` stack. Render the label on the left and, when `sublabel` is
  set, render it inline on the RIGHT of the row (before the glyph) with
  `hidden xs:inline`-style truncation guards: `truncate font-body text-[0.7rem] text-blanc/55`
  inside a `flex min-w-0 items-baseline gap-3` row, label `shrink-0`, sublabel `truncate`.
  Contrast floor stays `text-blanc/55`.
- Add two optional props:
  - `thumb?: { src: string; alt: string }` — when present, render before the label a
    `relative h-8 w-14 shrink-0 overflow-hidden` box with `next/image` `fill`
    `className="object-cover"` and `sizes="56px"` (a `sizes` value is mandatory on every
    `<Image fill>` per CLAUDE.md).
  - `glyph?: string` (default `'→'`) — so the mix row can use `'▶'`.
- Keep the three `kind` branches (`internal` -> `next/link`, `external` -> `<a target="_blank"
  rel="noopener noreferrer">`, `mail` -> bare `<a>` with no target/rel) exactly as they are.
- LinkRow stays a server component.

**b. `components/magazine/CopyLinkButton.tsx`** — keep the button and its behaviour
(`navigator.clipboard.writeText('https://small-records.com/links/')`, 2s reset, `aria-live`
sr-only status). Only relax the sizing so it can sit as a corner control:
keep `min-h-11` (44px tap target) but allow the caller to pass `className` merged with `cn()`.

**c. `app/links/page.tsx`** — recompose:
- Remove `min-h-screen` from `<main>` (html is already `bg-noir`; keeping it would pin
  `scrollHeight` to 844 and make the measurement meaningless). Keep
  `id="main-content" tabIndex={-1}` and `bg-noir text-blanc outline-none`.
- Remove the `AnimatedSection` wrapper and its import — its `whileInView` enter (opacity 0,
  y:40) is pointless on a page that must be fully visible at load, and it perturbs measurement.
  `PageTransition` stays (it is the only entrance animation left).
- Container: `mx-auto w-full max-w-md px-4 pt-4 pb-4 md:px-5 md:pt-8 md:pb-8`
  (16px side gutters kept).
- Header block: wrap in `relative text-center`.
  - Wordmark: the PNG has ~20.1% dead transparent band top and bottom, so cancel it with a
    negative vertical margin rather than shrinking the letters into illegibility:
    `className="mx-auto -my-6 h-auto w-32 object-contain md:-my-8 md:w-40"` on the existing
    native `<img>` (keep the eslint-disable comment and `alt="Small Records"`). Net occupied
    height ~= 128 - 48 = 80px on mobile; trim toward `w-28 -my-[22px]` if the budget is tight.
  - Keep the `sr-only` `<h1>`.
  - Tagline `mt-2 font-condensed text-[0.6rem] uppercase tracking-[0.3em] text-blanc/70` and
    genre line `mt-1 font-body text-[0.68rem] text-blanc/55` — both must stay on ONE line at
    375px wide (shorten the genre list to `House · Techno · Baile Funk · Afrohouse` if it wraps;
    never let it wrap into two lines).
  - `CopyLinkButton`: move it out of the vertical flow into the header block's top-right corner
    (`absolute right-0 top-0` inside the `relative` header block, or `-mt-1` floated right) so it
    costs 0px of column height while keeping its 44px tap target. It must not overlap the
    wordmark letters at 375px — verify visually in the screenshots.
- Recap card (the hook — keep exactly ONE photo): same `Link href="/events/#panic-room"`, but
  `mt-3` + `relative h-[88px] w-full overflow-hidden` instead of `aspect-[16/10]`. Keep
  `next/image` `fill priority object-cover` and `sizes="(min-width: 448px) 448px, 100vw"`.
  Keep the bottom gradient (`bg-gradient-to-t from-noir/90 via-noir/30 to-transparent`) — no
  full-bleed dark overlay on the photo (CLAUDE.md). Inside the bottom band, compact type:
  kicker `text-[0.5rem] tracking-[0.35em] text-terracotta-light` "Latest · Live", title
  `font-display text-[1.05rem] font-bold leading-none` "Small Party @ Panic Room", meta inline
  `text-[0.65rem] text-blanc/55` "Sept 11, 2026 · 711 people" — padding `p-2.5`.
- `<nav aria-label="Small Records links" className="mt-3 flex flex-col gap-1.5">` with the 7
  existing `LinkRow`s (unchanged `LINKS` array, unchanged hrefs/kinds; keep the `@smallmusics`
  and `contact@small-records.com` sublabels, drop none), then the mix as an 8th `LinkRow`
  INSIDE the same nav so it shares the gap rhythm:
```tsx
<LinkRow
  href="https://youtu.be/X9rpsIVIVgk"
  kind="external"
  label="House Mix · Pool Party"
  sublabel="Summer set"
  glyph="▶"
  thumb={{ src: '/images/mix-pool-party.jpg', alt: 'House mix, pool party set in the South of France' }}
/>
```
  Delete the old 16/9 mix card block entirely.
- Desktop (`md:`) may breathe: bigger wordmark, `md:min-h-12` rows, `md:gap-2` — it stays one
  centered `max-w-md` column.
- Do not touch metadata, the sitemap, or any `linktr.ee` href anywhere.

**d. Verification script** — write `<scratchpad>/links2/check.mjs` (scratchpad =
`/private/tmp/claude-501/-Users-myltonvanbolderen-small-record/54b5f0cd-5a66-4186-b337-6738006c59de/scratchpad`).
Never kill or restart the user's dev server on :3000, never run `npm install`.
Load Playwright from the existing kit:
```js
import { createRequire } from 'node:module'
const require = createRequire('/Users/myltonvanbolderen/Downloads/PANIC ROOM/_kit/x.js')
const { chromium } = require('playwright')
```
Create each context with `reducedMotion: 'reduce'` so `.page-enter` and motion are inert and the
measurements are stable, `isMobile: true, hasTouch: true`, and `waitUntil: 'networkidle'`.

Checks:
1. **iPhone 13, 390x844, dsf 3** on `http://localhost:3000/links/` — report
   `document.documentElement.scrollHeight`, `document.body.scrollHeight`, the
   `getBoundingClientRect().bottom` of the LAST link row and of the MIX row, and the bottom of
   the deepest element in `main`. **Hard pass: all of those <= 700.**
2. **iPhone SE, 375x667, dsf 2** — same numbers. Report them; if anything exceeds ~640px, state
   explicitly by how many px it is over instead of silently passing or failing.
3. **Hrefs**: collect `main a` in DOM order and assert exactly these 9, in this order:
   `/events/#panic-room`, `https://www.instagram.com/smallmusics`, `https://soundcloud.com/casae`,
   `https://soundcloud.com/letchetony`, `https://www.youtube.com/@SmallRecords_Music`, `/events/`,
   `/small-record/`, `mailto:contact@small-records.com`, `https://youtu.be/X9rpsIVIVgk`.
   Every `https://` one must have `target="_blank"` and `rel` containing both `noopener` and
   `noreferrer`; the `mailto:` one must have NO `target`.
4. **Tap targets**: every `main a` and every `main button` has
   `getBoundingClientRect().height >= 44`.
5. **Images**: every `img` in `main` has `naturalWidth > 0`.
6. **No horizontal overflow**: `document.documentElement.scrollWidth <= viewport.width` at both
   mobile sizes.
7. **Chrome**: on `/links/`, `document.querySelectorAll('header').length === 0` and there is no
   element matching `footer`. On `/`, `/events/`, `/casae/`, `/letche/`, `/small-record/`:
   both a `header` and a `footer` are present.
8. **Screenshots** (`fullPage: true`) into `<scratchpad>/links2/`:
   `iphone13.png`, `iphonese.png`, `desktop-1440x900.png`.

Print a single PASS/FAIL summary table with the measured numbers. If a check fails, fix the page
(shrink the recap card, then the gaps, then the wordmark — never the 44px tap targets) and re-run
until green.

If a production build is needed to confirm the static export, do it in an APFS clone under the
scratchpad (`cp -c -R` with a real `node_modules` copy — Turbopack breaks on symlinked
`node_modules`), never in the working tree.
  </action>
  <verify>
    <automated>cd /Users/myltonvanbolderen/small-record && npx tsc --noEmit && npm run lint</automated>
    <automated>node "/private/tmp/claude-501/-Users-myltonvanbolderen-small-record/54b5f0cd-5a66-4186-b337-6738006c59de/scratchpad/links2/check.mjs"</automated>
  </verify>
  <done>
`tsc --noEmit` and `npm run lint` report 0 errors. The Playwright script prints PASS for every
check: at 390x844 `scrollHeight` and the last interactive element's bottom are both <= 700; the
iPhone SE numbers are reported (and any overage quantified); the 9 hrefs, their target/rel, the
44px tap targets, image loading, no-horizontal-overflow and the header/footer presence matrix all
pass; the 3 screenshots exist in `<scratchpad>/links2/`.
Commit (stage these exact paths only):
`git add app/links/page.tsx components/magazine/LinkRow.tsx components/magazine/CopyLinkButton.tsx`
`feat(links): compact /links to one phone screen`
ending with `Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>`.
Do NOT deploy.
  </done>
</task>

</tasks>

<threat_model>
## Trust Boundaries

| Boundary | Description |
|----------|-------------|
| visitor browser -> static page | Only outbound links and a clipboard write; no user input is accepted, stored or rendered |
| page -> third-party sites (Instagram, SoundCloud, YouTube) | User-initiated navigation to external origins |

## STRIDE Threat Register

| Threat ID | Category | Component | Disposition | Mitigation Plan |
|-----------|----------|-----------|-------------|-----------------|
| T-nll-01 | Tampering | External `<a>` rows in `LinkRow` | mitigate | Keep `rel="noopener noreferrer"` on every `target="_blank"` link (reverse-tabnabbing); asserted by check 3 of the Playwright script |
| T-nll-02 | Information disclosure | `mailto:contact@small-records.com` row | accept | The booking address is intentionally public and already published on the site |
| T-nll-03 | Elevation of privilege | `CopyLinkButton` clipboard write | accept | Writes a hardcoded literal string, no user or URL-derived input; already wrapped in try/catch |
| T-nll-04 | Denial of service | Static export on Vercel CDN | transfer | No server-side code path on this route; handled by the CDN |
</threat_model>

<verification>
- `npx tsc --noEmit` -> 0 errors
- `npm run lint` -> 0 errors (required before any future deploy; ESLint runs during `next build`)
- Playwright script green at 390x844 and reported at 375x667 and 1440x900
- `git diff` touches only the 6 files in `files_modified`; no `linktr.ee` href changed anywhere
  (`git diff | grep linktr.ee` returns nothing)
- No deploy, no metadata/sitemap change
</verification>

<success_criteria>
- At 390x844, `document.documentElement.scrollHeight <= 700` and the mix row's
  `getBoundingClientRect().bottom <= 700`
- At 375x667, the content fits the viewport without scrolling (number reported; any overage
  stated in px)
- `/links/` renders no site header and no site footer; `/`, `/events/`, `/casae/`, `/letche/`,
  `/small-record/` still render both
- The 9 destinations, their order, their `target`/`rel` and the Copy link button are unchanged
- Every tap target >= 44px, no horizontal overflow, no broken image, small red text stays
  `text-terracotta-light` and grey text stays >= `text-blanc/55`
- 2 atomic commits, exact paths staged, each ending with the Co-Authored-By line
</success_criteria>

<output>
After completion, create
`.planning/quick/260928-nll-page-links-compacte-tout-visible-sans-sc/260928-nll-SUMMARY.md`
</output>
