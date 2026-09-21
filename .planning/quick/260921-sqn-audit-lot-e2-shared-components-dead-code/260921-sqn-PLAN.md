---
phase: quick-260921-sqn
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - components/animation/FadingOverlay.tsx        # deleted
  - components/animation/TextReveal.tsx           # deleted
  - components/magazine/PhotoPlaceholder.tsx      # deleted
  - components/magazine/SectionHeader.tsx         # new
  - components/magazine/MediaTile.tsx             # new
  - components/magazine/EventFacts.tsx            # new
  - lib/events-jsonld.ts                          # new
  - app/events/page.tsx
  - app/page.tsx
  - app/small-record/page.tsx
  - app/casae/page.tsx
  - app/letche/page.tsx
  - components/layout/Header.tsx                  # only if a lint fix/disable comment is needed
  - eslint.config.mjs                             # new
  - package.json
  - package-lock.json
autonomous: true
requirements: [AUDIT-E2]
must_haves:
  truths:
    - "The 5 public pages (/, /small-record, /casae, /letche, /events) export the same DOM markup as before (normalized HTML diff is empty)"
    - "app/events/page.tsx is substantially shorter (target <= ~550 lines, hard ceiling 600) and uses shared components"
    - "No dead component files remain (FadingOverlay, TextReveal, PhotoPlaceholder deleted, zero imports anywhere)"
    - "`npm run lint` runs ESLint 9 with next/core-web-vitals + next/typescript and reports 0 errors"
    - "`npx tsc --noEmit` passes and `next build` (which now also lints) succeeds"
    - "The user's dev server on :3000 was never killed and still answers 200"
  artifacts:
    - path: "components/magazine/SectionHeader.tsx"
      provides: "Kicker + h2 + meta + folio section header, byte-identical markup"
      exports: ["SectionHeader"]
    - path: "components/magazine/MediaTile.tsx"
      provides: "Aspect wrapper + next/image OR VideoLoop + bottom gradient caption"
      exports: ["MediaTile"]
    - path: "components/magazine/EventFacts.tsx"
      provides: "Venue/Date two-column facts block used twice on /events"
      exports: ["EventFacts"]
    - path: "lib/events-jsonld.ts"
      provides: "MusicEvent JSON-LD data moved verbatim out of the page"
      exports: ["eventsJsonLd"]
    - path: "eslint.config.mjs"
      provides: "ESLint 9 flat config (FlatCompat) with ignores for internal tools"
      contains: "next/core-web-vitals"
  key_links:
    - from: "app/events/page.tsx"
      to: "components/magazine/MediaTile.tsx"
      via: "import { MediaTile }"
      pattern: "<MediaTile"
    - from: "app/events/page.tsx"
      to: "components/magazine/SectionHeader.tsx"
      via: "import { SectionHeader }"
      pattern: "<SectionHeader"
    - from: "package.json"
      to: "eslint.config.mjs"
      via: "\"lint\": \"eslint .\""
      pattern: "\"lint\""
---

<objective>
Audit lot E2 (roadmap Phase 8, part 2): remove dead components, extract shared magazine
components (SectionHeader, MediaTile, EventFacts) to shrink the 848-line `app/events/page.tsx`,
and install/configure ESLint so `npm run lint` works with 0 errors.

Purpose: maintainability of the public site with ZERO visual change — proven by a
normalized diff of the static-export HTML before vs after.
Output: 3 atomic commits (dead code, refactor, lint) + before/after proof in the SUMMARY.
</objective>

<execution_context>
@$HOME/.claude/get-shit-done/workflows/execute-plan.md
@$HOME/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/STATE.md
@.planning/ROADMAP.md
@/Users/myltonvanbolderen/CLAUDE.md
@app/events/page.tsx
@app/page.tsx
@app/small-record/page.tsx
@app/casae/page.tsx
@app/letche/page.tsx
@components/magazine/VideoLoop.tsx
@components/animation/AnimatedSection.tsx

<constants>
PROJECT=/Users/myltonvanbolderen/small-record
SP=/private/tmp/claude-501/-Users-myltonvanbolderen-small-record/54b5f0cd-5a66-4186-b337-6738006c59de/scratchpad
Dev server: user's own terminal on http://localhost:3000 (currently 200). NEVER kill/restart it,
NEVER run `next build` / `npm run build` inside $PROJECT (it would clobber .next used by the
dev server). All builds happen in APFS clones under $SP.
Staging: `git add <exact paths>` only — never `git add -A/.`, never public/asset,
public/images/_w, .claude, out, .next. No deploy (`vercel` must not be run).
Commit trailer: `Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>`
CLAUDE.md lives outside the repo and must NOT be edited; if it references deleted
components (it lists FadingOverlay/TextReveal/PhotoPlaceholder), just mention it in SUMMARY.
</constants>

<interfaces>
From components/magazine/VideoLoop.tsx ('use client'):
```ts
interface VideoLoopProps { src: string; poster?: string; className?: string }
export function VideoLoop(props: VideoLoopProps): JSX.Element
```
From components/animation/AnimatedSection.tsx ('use client'):
```ts
interface AnimatedSectionProps {
  children: React.ReactNode; className?: string; delay?: number
  direction?: 'up'|'down'|'left'|'right'|'none'; scale?: boolean; blur?: boolean; duration?: number
}
```
lib/utils.ts exports cn() (clsx + tailwind-merge) — DO NOT use cn() inside the new
components for class strings (twMerge could reorder/drop classes and break byte identity);
pass full verbatim class strings instead.

Current repeated markup in app/events/page.tsx (verbatim, to be reproduced exactly):

Section header (events L162-179 and 4 other occurrences):
```tsx
<div className="mb-3 flex items-end justify-between">
  <div>
    <span className="font-condensed text-[0.55rem] uppercase tracking-[0.5em] text-terracotta-light">Past · Club Night</span>
    <h2 className="mt-2 font-display text-[clamp(1.8rem,4vw,3rem)] font-bold leading-[1.05]">Small Party</h2>
    <p className="mt-2 font-body text-[0.95rem] text-blanc/55">Small Records × Panic Room · Paris 11 · September 2026</p>
  </div>
  <span aria-hidden="true" className="hidden font-condensed text-[0.55rem] uppercase tracking-[0.3em] text-blanc/55 md:block">001</span>
</div>
```
Media tile (13 occurrences, image or video, caption optional, caption padding `p-4` or `p-5 md:p-6`):
```tsx
<div className="relative -mx-5 aspect-square overflow-hidden md:mx-0 md:aspect-[3/2]">
  <Image src="..." alt="..." fill className="object-cover object-[40%_center] md:object-center" sizes="(min-width: 1200px) 1152px, 100vw" />
  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-noir/90 to-transparent p-5 md:p-6">
    <span className="font-condensed text-[0.55rem] uppercase tracking-[0.3em] text-terracotta-light">Behind the decks · around 1am</span>
  </div>
</div>
<div className="relative aspect-[9/16] w-full overflow-hidden bg-placeholder">
  <VideoLoop src="/videos/panic-lessovik.mp4" poster="/images/panic-room/poster-panic-lessovik.jpg" className="h-full w-full object-cover" />
  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-noir/90 to-transparent p-4">...caption span...</div>
</div>
```
Venue/Date facts (events L412-437 and L599-624):
```tsx
<div className="grid grid-cols-2 gap-6 border-t border-blanc/10 pt-6">
  <div>
    <span className="font-condensed text-[0.55rem] uppercase tracking-[0.4em] text-blanc/55">Venue</span>
    <p className="mt-2 font-body text-[0.95rem] leading-[1.6] text-blanc/55">Panic Room<br />101 rue Amelot<br />Paris 11</p>
  </div>
  <div>...Date...</div>
</div>
```
</interfaces>
</context>

<tasks>

<task type="auto">
  <name>Task 1: Baseline static export (before) + normalizer, then delete dead components</name>
  <files>components/animation/FadingOverlay.tsx, components/animation/TextReveal.tsx, components/magazine/PhotoPlaceholder.tsx (deleted); $SP/e2-before/ (scratch, not committed); $SP/normalize.mjs (scratch)</files>
  <action>
**A. Baseline BEFORE any code change.**
1. `cd $PROJECT && git status --porcelain` — must show nothing tracked-modified (only `?? .claude/`, possibly the untracked/committed plan dir). If tracked files are modified, STOP and report.
2. `curl -s -o /dev/null -w '%{http_code}' http://localhost:3000/` → record (expect 200).
3. Build an APFS clone (real copies via `cp -c`, NOT symlinks — Turbopack breaks on symlinked node_modules):
```bash
SP=/private/tmp/claude-501/-Users-myltonvanbolderen-small-record/54b5f0cd-5a66-4186-b337-6738006c59de/scratchpad
DST=$SP/e2-before; rm -rf "$DST"; mkdir -p "$DST/public"
cd /Users/myltonvanbolderen/small-record
for e in $(ls -A); do case "$e" in .next|out|.git|public|.claude|.planning) ;; *) cp -cR "$e" "$DST/";; esac; done
for e in $(ls -A public); do [ "$e" = asset ] || cp -cR "public/$e" "$DST/public/"; done
cd "$DST" && npm run build   # prebuild regenerates/validates public/images/_w
```
Keep `$DST/out` and `$DST/.next/BUILD_ID`. (Run the build with a generous timeout, e.g. 600000 ms.)

4. Write `$SP/normalize.mjs` (node, no deps). Usage: `node normalize.mjs <cloneDir> <outDir>`. For each page in
`['index.html','small-record/index.html','casae/index.html','letche/index.html','events/index.html']` under `<cloneDir>/out/`:
   - read BUILD_ID from `<cloneDir>/.next/BUILD_ID`; replace every occurrence with `__BUILD_ID__`;
   - remove every `<script>self.__next_f.push(...)</script>` (regex `/<script>self\.__next_f\.push\([\s\S]*?\)<\/script>/g`);
   - replace `/_next/static/[^"'\s)]+` with `/_next/static/__HASH__`;
   - then remove `<script src="/_next/static/__HASH__"[^>]*></script>` tags and `<link rel="preload" as="script"[^>]*>` / `<link rel="modulepreload"[^>]*>` tags pointing at `/_next/static/__HASH__` (chunk count/order is build noise); keep CSS `<link rel="stylesheet">` (normalized) and keep `application/ld+json` scripts (they are content);
   - split on `><` → `>\n<` for line-oriented diffing; write to `<outDir>/<page with / replaced by _>`.
   Also concatenate `<cloneDir>/out/_next/static/css/*.css` (sorted by name), split on `}` → `}\n`, write `<outDir>/styles.css`.
   Nothing else is normalized (no sorting, no whitespace collapsing).
5. `node $SP/normalize.mjs $SP/e2-before $SP/e2-before-norm` and sanity-check the files are non-empty and contain real markup (e.g. grep "Small Party" in events).

**B. Delete dead components.**
Re-grep first, across EVERYTHING including internal tools:
`grep -rn "FadingOverlay\|TextReveal\|PhotoPlaceholder" app components lib scripts tools` (exclude the definition files themselves). Expected: zero importers. If any file (even app/v2, app/carousel, components/v2) imports one, KEEP that component and note it in SUMMARY. Otherwise `git rm` the three files.
`npx tsc --noEmit` must pass.

Commit: `git commit -m "chore(cleanup): remove unused FadingOverlay, TextReveal, PhotoPlaceholder" -m "Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"` (only the 3 deleted paths staged).

Note for the final comparison: Tailwind v4 scans all source files, so deleting these components may remove CSS rules that only they used — that is the ONLY acceptable CSS diff (must be rule removals, list them in SUMMARY).
  </action>
  <verify>
    <automated>ls $SP/e2-before/out/events/index.html $SP/e2-before-norm/events_index.html && cd /Users/myltonvanbolderen/small-record && ! grep -rqn "FadingOverlay\|TextReveal\|PhotoPlaceholder" app components lib && npx tsc --noEmit && git log -1 --stat</automated>
  </verify>
  <done>Baseline export + normalized snapshots exist in scratchpad; 3 dead files removed in one commit; tsc passes; dev server untouched.</done>
</task>

<task type="auto">
  <name>Task 2: Extract SectionHeader, MediaTile, EventFacts; refactor /events and apply SectionHeader to other pages</name>
  <files>components/magazine/SectionHeader.tsx, components/magazine/MediaTile.tsx, components/magazine/EventFacts.tsx, lib/events-jsonld.ts, app/events/page.tsx, app/page.tsx, app/small-record/page.tsx, app/casae/page.tsx, app/letche/page.tsx</files>
  <action>
All three components are SERVER components (no `'use client'`) — they only compose next/image and the existing client `VideoLoop`, so no new client chunks. Class strings are passed/stored VERBATIM (plain strings or `${a} ${b}` template joins in the exact current order) — never through cn()/twMerge. All default class strings must appear as literals in the component files (Tailwind v4 scanning).

**1. `components/magazine/SectionHeader.tsx`**
```tsx
import type { ReactNode } from 'react'
interface SectionHeaderProps {
  kicker: ReactNode
  title: ReactNode
  meta?: ReactNode          // renders <p className="mt-2 font-body text-[0.95rem] text-blanc/55">
  folio?: string            // renders the aria-hidden folio span
  aside?: ReactNode         // alternative right-side element (e.g. small-record "On the floor" Link); rendered where folio would be
  className?: string        // full container class, default 'mb-3 flex items-end justify-between'
  titleClassName?: string   // full h2 class, default 'mt-2 font-display text-[clamp(1.8rem,4vw,3rem)] font-bold leading-[1.05]'
}
```
Renders exactly: `<div className={className}><div><span className="font-condensed text-[0.55rem] uppercase tracking-[0.5em] text-terracotta-light">{kicker}</span><h2 className={titleClassName}>{title}</h2>{meta && <p …>{meta}</p>}</div>{folio && <span aria-hidden="true" className="hidden font-condensed text-[0.55rem] uppercase tracking-[0.3em] text-blanc/55 md:block">{folio}</span>}{aside}</div>`.
It does NOT include the AnimatedSection wrapper: call sites differ (some `blur` around the header only, some `scale` wrapping header + embed), so the caller keeps its existing wrapper untouched. `titleClassName`/`className` overrides reproduce the existing h2/container variants verbatim (no markup change — proven by the HTML diff), which is how we dedupe variants without "forcing" them.

**2. `components/magazine/MediaTile.tsx`**
```tsx
type MediaTileProps = {
  className: string          // full wrapper class, verbatim (e.g. 'relative -mx-5 aspect-square overflow-hidden md:mx-0 md:aspect-[3/2]')
  caption?: ReactNode
  captionClassName?: string  // padding only, default 'p-4' (hero/closer tiles pass 'p-5 md:p-6')
} & (
  | { image: { src: string; alt: string; sizes: string; className?: string /* default 'object-cover' */; priority?: boolean }; video?: never }
  | { video: { src: string; poster: string }; image?: never }
)
```
Renders `<div className={className}>` + either `<Image src alt fill className={image.className ?? 'object-cover'} sizes priority={image.priority} />` or `<VideoLoop src poster className="h-full w-full object-cover" />`, then if caption: `<div className={\`absolute inset-x-0 bottom-0 bg-gradient-to-t from-noir/90 to-transparent ${captionClassName}\`}><span className="font-condensed text-[0.55rem] uppercase tracking-[0.3em] text-terracotta-light">{caption}</span></div>`. Keep prop order on <Image> as today (src, alt, fill, className, sizes).

**3. `components/magazine/EventFacts.tsx`**
`EventFacts({ facts }: { facts: { label: string; lines: string[] }[] })` renders the Venue/Date grid verbatim (container `grid grid-cols-2 gap-6 border-t border-blanc/10 pt-6`, label span `font-condensed text-[0.55rem] uppercase tracking-[0.4em] text-blanc/55`, p `mt-2 font-body text-[0.95rem] leading-[1.6] text-blanc/55`), lines joined with `<br />` via `lines.map((l, i) => <Fragment key={i}>{i > 0 && <br />}{l}</Fragment>)`. Key on label.

**4. `lib/events-jsonld.ts`** — move the `eventsJsonLd` array out of app/events/page.tsx VERBATIM (same key order, same values) as `export const eventsJsonLd = [...]`; page imports it. The `<script type="application/ld+json">` output must stay byte-identical (it is part of the diff).

**5. Refactor `app/events/page.tsx`:**
- 5 section headers → `<SectionHeader>` inside the SAME existing wrappers:
  - 001 Small Party & 002 Gambetta & 004 Fête: defaults, with kicker/title/meta/folio.
  - 003 Featured Mix (inside `AnimatedSection scale` + max-w-5xl div): `className="mb-8 flex items-end justify-between"`, `titleClassName="mt-2 font-display text-[clamp(1.5rem,3vw,2.5rem)] font-bold"`.
  - 005 Coming soon: `className="flex items-end justify-between"`, `titleClassName="mt-3 font-display text-[clamp(2.5rem,8vw,6rem)] font-bold leading-[0.9]"`, `title={<>Coming soon<span className="text-terracotta">.</span></>}`, kicker `"What's next"`, no meta.
- All 13 media tiles → `<MediaTile>` keeping every class verbatim (incl. `-mx-5 md:mx-0`, `col-span-2 … md:col-span-1`, `bg-placeholder` on video tiles, object-position classes, exact `sizes`). The Panic set-order strip (4 videos) and Panic photo grid (6 photos) / Gambetta gallery may be driven by local const arrays + `.map` (key = src) to cut lines — output must stay identical and in the same order. The Fête tiles keep their outer `col-span`/`order-first` wrapper divs inline, only the inner tile becomes MediaTile.
- Both Venue/Date blocks → `<EventFacts facts={[{ label: 'Venue', lines: ['Panic Room', '101 rue Amelot', 'Paris 11'] }, { label: 'Date', lines: ['Friday', 'September 11, 2026', '22:00 — 05:00'] }]} />` (and the Gambetta equivalent).
- Remove now-unused imports (Image stays only for the cover). Do NOT touch cover, marquee, stats, time table, line-up, coming-soon timeline, booking CTA markup.
- Target ≤ ~550 lines (hard ceiling 600; if above 550 explain in SUMMARY). Report `wc -l` before/after.

**6. Apply SectionHeader elsewhere, only where the header is the kicker+h2(+meta)(+folio|aside) structure** (overrides verbatim):
- app/page.tsx L153 ("The Artists", `className="mb-10 flex items-end justify-between md:mb-16"`, `titleClassName="mt-2 font-display text-section font-bold"`, folio 003); L227 ("Latest · Live", `mb-10 flex items-end justify-between md:mb-12`, default title class, meta, no folio); L317 (Featured Mix, same overrides as events 003, folio 004).
- app/casae/page.tsx L126 and app/letche/page.tsx L160 ("Listen" / "Selected Mixes", `mb-8 flex items-end justify-between`, `mt-2 font-display text-section font-bold`, folios 005 / 006).
- app/small-record/page.tsx L247 ("Live" / "On the floor", `mb-10 … md:mb-12`, meta, `aside={<Link …>…</Link>}` moved verbatim) — only if the Link is the sole right-side sibling; L379 (Featured Mix, folio 005).
- LEAVE INLINE: app/small-record/page.tsx L150 "What We Do" (no h2/inner div — different structure), and any header whose structure differs.
- Line numbers are from HEAD; re-locate by content.

Run `npx tsc --noEmit` (must pass). Do NOT build in $PROJECT.

Commit (stage exactly the 9 paths above): `refactor(events): extract SectionHeader, MediaTile, EventFacts shared components` + blank line + `Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>`.
  </action>
  <verify>
    <automated>cd /Users/myltonvanbolderen/small-record && npx tsc --noEmit && wc -l app/events/page.tsx && grep -c "<MediaTile" app/events/page.tsx && grep -c "<SectionHeader" app/events/page.tsx app/page.tsx app/casae/page.tsx app/letche/page.tsx app/small-record/page.tsx</automated>
  </verify>
  <done>New components exist as server components with verbatim class defaults; events/page.tsx ≤ ~550 lines (≤ 600 hard) using MediaTile/SectionHeader/EventFacts; SectionHeader applied on other pages only where structurally identical; tsc passes; one refactor commit.</done>
</task>

<task type="auto">
  <name>Task 3: ESLint 9 flat config + lint fixes, then after-export and zero-visual-change proof</name>
  <files>package.json, package-lock.json, eslint.config.mjs, (lint fixes only if needed: components/layout/Header.tsx or other public-site files — never app/v2, app/carousel, components/v2); $SP/e2-after/ (scratch)</files>
  <action>
**A. Install ESLint** (only adds devDeps; `next` untouched):
1. `curl` :3000 → record code. 2. `cd $PROJECT && npm install -D eslint@9 eslint-config-next@15.5.25 @eslint/eslintrc`. 3. `curl` :3000 again → must be 200; record both in SUMMARY. Never restart the server; if it stopped answering, report it (do not fix by restarting). `git diff package.json` must show only the three devDependencies + the lint script.
4. Create `eslint.config.mjs`:
```js
import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { FlatCompat } from '@eslint/eslintrc'

const __dirname = dirname(fileURLToPath(import.meta.url))
const compat = new FlatCompat({ baseDirectory: __dirname })

const eslintConfig = [
  {
    ignores: [
      '.next/**', 'out/**', 'public/**', 'node_modules/**', 'next-env.d.ts',
      'app/v2/**', 'app/carousel/**', 'components/v2/**',
      'tools/**', 'scripts/**', '.planning/**', '.claude/**',
    ],
  },
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
]

export default eslintConfig
```
5. package.json scripts: add `"lint": "eslint ."` (flat config; `next lint` is deprecated in 15.5 and removed in 16 — `eslint .` is the forward-compatible choice).
6. `npm run lint`. Fix ALL errors in public-site code with markup-neutral changes only (unused vars/imports, types, etc.). For `@next/next/no-img-element` on the native gnome `<img>` in components/layout/Header.tsx: it is intentional per CLAUDE.md (native img + inline invert filter) → add `{/* eslint-disable-next-line @next/next/no-img-element */}` exactly like Footer/small-record already do (JSX comments don't render). Warnings may remain: list each (file:line rule) in SUMMARY. Never edit app/v2, app/carousel, components/v2.
IMPORTANT: once ESLint is installed, `next build` (local AND Vercel) runs lint and fails on errors — 0 errors is mandatory, otherwise the next deploy breaks. Verify the ignores keep v2/carousel out.
7. `npx tsc --noEmit` passes.

Commit: stage `package.json package-lock.json eslint.config.mjs` + any exact fixed files → `chore(lint): add ESLint 9 flat config (next/core-web-vitals, next/typescript)` + blank line + `Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>`.

**B. After export + proof** (from the final committed state):
1. Same clone recipe into `$SP/e2-after` (fresh `rm -rf` first; node_modules now includes eslint; copy with `cp -cR`), `npm run build` there — this build also exercises lint-in-build; it must succeed.
2. `node $SP/normalize.mjs $SP/e2-after $SP/e2-after-norm`
3. `diff -ru $SP/e2-before-norm $SP/e2-after-norm` restricted to the 5 page files → MUST be empty. If not empty: inspect, fix the component/call site to restore identical markup (prop order, missing class, `<!-- -->` text-node comments from JSX, etc.), commit the fix as `fix(refactor): restore identical markup for …` (+ trailer), rebuild e2-after, re-diff until empty. Any remaining diff must be justified line by line in SUMMARY (expected: none).
4. `diff $SP/e2-before-norm/styles.css $SP/e2-after-norm/styles.css` → only removals of rules used exclusively by the deleted dead components are acceptable; list them. Any added/changed rule = investigate.
5. Final: `cd $PROJECT && npm run lint` (0 errors), `npx tsc --noEmit`, `wc -l app/events/page.tsx`, `curl` :3000 → 200, `git status --porcelain` shows no stray tracked changes (only `?? .claude/`).

SUMMARY must include: line counts before/after for events page, list of deleted files, where SectionHeader was/wasn't applied (and why), dev-server status codes before/after npm install, lint warnings list, HTML diff result (empty), CSS diff result, and the note that /Users/myltonvanbolderen/CLAUDE.md still lists the deleted animation/magazine components (left untouched on purpose).
  </action>
  <verify>
    <automated>cd /Users/myltonvanbolderen/small-record && npm run lint && npx tsc --noEmit && SP=/private/tmp/claude-501/-Users-myltonvanbolderen-small-record/54b5f0cd-5a66-4186-b337-6738006c59de/scratchpad && for f in index.html small-record_index.html casae_index.html letche_index.html events_index.html; do diff -q "$SP/e2-before-norm/$f" "$SP/e2-after-norm/$f" || exit 1; done && curl -s -o /dev/null -w '%{http_code}\n' http://localhost:3000/</automated>
  </verify>
  <done>`npm run lint` → 0 errors (warnings listed); after-build succeeded in scratchpad clone with lint-in-build; normalized HTML of all 5 public pages identical before/after; CSS diff limited to dead-component rule removals; dev server still 200; lint commit (and any fix commit) made with exact-path staging.</done>
</task>

</tasks>

<threat_model>
## Trust Boundaries

| Boundary | Description |
|----------|-------------|
| npm registry → devDependencies | New third-party packages (eslint, eslint-config-next, @eslint/eslintrc) enter the toolchain |
| repo → Vercel build | Next build now runs ESLint; a lint error would fail production deploys |

## STRIDE Threat Register

| Threat ID | Category | Component | Disposition | Mitigation Plan |
|-----------|----------|-----------|-------------|-----------------|
| T-E2-01 | T (Tampering / supply chain) | eslint + eslint-config-next devDeps | mitigate | Pin eslint-config-next to 15.5.25 (matches next), eslint@9 major; run `npm audit --omit=dev` + `npm audit` after install and report any new critical/high in SUMMARY; devDeps are not shipped in the static export |
| T-E2-02 | D (Denial of service of deploys) | next build lint step | mitigate | 0 lint errors required; ignores for app/v2, app/carousel, components/v2, tools, scripts; after-build in scratch clone proves `npm run build` passes with lint enabled |
| T-E2-03 | I (Information disclosure) | git staging | mitigate | Exact-path `git add`; never stage public/asset, public/images/_w, .claude, out, .next |
| T-E2-04 | T (Integrity of rendered pages) | Refactor could alter markup / JSON-LD | mitigate | Normalized before/after HTML diff of the 5 public pages (including ld+json scripts) must be empty |
</threat_model>

<verification>
- Normalized HTML of /, /small-record, /casae, /letche, /events identical before vs after (scratchpad clones, static export).
- CSS diff only dead-component rule removals.
- `npx tsc --noEmit` passes; `npm run lint` 0 errors; scratch `npm run build` (with lint) passes.
- `app/events/page.tsx` ≤ ~550 lines (hard ≤ 600).
- 3 dead files gone, zero references.
- Dev server :3000 answered 200 before and after; never restarted; no build ran in $PROJECT; no deploy.
</verification>

<success_criteria>
- 3 atomic commits (cleanup, refactor, lint) + optional markup-fix commit, all with the Co-Authored-By trailer and exact-path staging.
- Zero visual change proven by empty normalized HTML diff.
- ESLint operational with 0 errors on public-site code.
</success_criteria>

<output>
After completion, create `.planning/quick/260921-sqn-audit-lot-e2-shared-components-dead-code/260921-sqn-SUMMARY.md`
</output>
