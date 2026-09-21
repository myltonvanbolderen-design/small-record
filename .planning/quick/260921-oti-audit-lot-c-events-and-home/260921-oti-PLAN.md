---
phase: quick-260921-oti
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - public/images/panic-room/cover.jpg
  - app/events/page.tsx
  - app/page.tsx
  - components/magazine/PhotoSlider.tsx
autonomous: true
requirements: [PHASE-6-AUDIT-C]

must_haves:
  truths:
    - "/events lists events newest to oldest: Panic Room, Gambetta, Featured Mix, Fête de la Musique, then Coming soon"
    - "Visible folios on /events read 001, 002, 003, 004, 005 top to bottom"
    - "/events cover shows Casæ in a red cap at the decks (Panic Room), with his face visible on a 390px portrait viewport"
    - "On mobile the Fête de la Musique block shows the crew photo full width (4:3), then the two videos side by side; desktop is unchanged (3 equal 9:16 columns video/photo/video)"
    - "Coming soon has no past dates: TBA / 2026–27 / Soon"
    - "Home shows a 'Latest · Live' Panic Room section (photo, 711/7h/4 stats, link to /events/) between the artists and the pull quote"
    - "/casae has no horizontal scroll: scrollWidth === innerWidth at 390 and 1440"
  artifacts:
    - path: "public/images/panic-room/cover.jpg"
      provides: "Events cover photo, <=1920px JPEG 80%"
    - path: "app/events/page.tsx"
      provides: "Reordered events page"
      contains: "/images/panic-room/cover.jpg"
    - path: "app/page.tsx"
      provides: "Latest live section"
      contains: "LATEST LIVE - Panic Room"
    - path: "components/magazine/PhotoSlider.tsx"
      provides: "Slider without negative margins"
  key_links:
    - from: "app/page.tsx"
      to: "/events/"
      via: "next/link"
      pattern: "href=\"/events/\""
    - from: "app/page.tsx"
      to: "components/animation/CountUp.tsx"
      via: "import { CountUp }"
      pattern: "CountUp"
---

<objective>
Audit lot C (roadmap Phase 6 "Events & home"): /events reads newest → oldest with a Panic Room cover, a compact Fête de la Musique block on mobile and no stale "Coming soon" dates; the home page shows the latest live event; /casae stops overflowing horizontally.

Purpose: a booker landing on the site sees what the crew did last (Sept 2026) first, on every page that matters.
Output: 1 new image, edits to app/events/page.tsx, app/page.tsx, components/magazine/PhotoSlider.tsx. 3 atomic commits. No deploy.
</objective>

<execution_context>
@$HOME/.claude/get-shit-done/workflows/execute-plan.md
@$HOME/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@/Users/myltonvanbolderen/CLAUDE.md
@.planning/STATE.md
@app/events/page.tsx
@app/page.tsx
@components/magazine/PhotoSlider.tsx

Project rules that apply (CLAUDE.md): `AnimatedSection` only around text, never around photos/videos/stats; no full dark overlay on photos, only bottom gradients; `next/image` with `fill` + `unoptimized`; motion imports from `motion/react`. Stage exact paths only — never `public/asset/` or `.claude/`. Dev server is already running on :3000 in the user's terminal — do NOT kill/restart it, no `npm install`.

<interfaces>
Current /events structure (app/events/page.tsx, 848 lines):
- L28-94 `eventsJsonLd` (leave untouched)
- L104 `{/* ═══════ COVER ═══════ */}` — Image src `/images/early-reflection/packed-room.jpg`, alt "Small Records live", `fill className="object-cover" priority unoptimized`, then `<div className="absolute inset-0 bg-gradient-to-b from-noir/70 via-noir/30 to-noir" />`
- L154 `<Marquee … />`
- L159 `{/* ═══════ 001 · FÊTE DE LA MUSIQUE ═══════ */}` (no HorizontalRule) … folio span `001` at L176 … ends `</section>` L236
- L238 `{/* ═══════ 002 · FEATURED MIX ═══════ */}` + L239 `<HorizontalRule color="bg-blanc/10" />` … folio `002` L256 … ends L262
- L264 `{/* ═══════ 003 · EARLY REFLECTION × GAMBETTA ═══════ */}` + HR … folio `003` L282 … ends ~L449
- L451 `{/* ═══════ 004 · SMALL PARTY × PANIC ROOM ═══════ */}` + HR … folio `004` L468 … ends ~L735
- L737 `{/* ═══════ COMING SOON ═══════ */}` (no HR, starts with ParallaxImage) — folio `005` already (~L759); timeline array ~L774-776:
  `{ tag: 'Club', city: 'Paris', when: 'Summer 2026' }`, `{ tag: 'Festival', city: 'To be announced', when: '2026' }`, `{ tag: 'B2B', city: 'Somewhere loud', when: 'Soon' }`

Fête grid today (L181): `<div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-12 md:gap-5">` with three children `<div className="md:col-span-4">` each wrapping `<div className="relative aspect-[9/16] w-full overflow-hidden …">` — order: Casae video, crew photo (`/images/fete-musique/casae-live.jpg`), Letche video.

Panic Room numbers band (events ~L624) — style to reuse on home:
```tsx
<div className="mt-12 grid grid-cols-2 gap-px border-y border-blanc/10 bg-blanc/10 md:grid-cols-5">
  … <div className={cn('bg-noir px-4 py-5 md:px-6 md:py-8', i === 0 && 'col-span-2 md:col-span-1')}>
      <CountUp value={stat.value} delay={i * 0.12} className={cn('block font-display font-bold leading-none',
        i === 0 ? 'text-[4.5rem] text-terracotta md:text-[clamp(2.8rem,5vw,4.5rem)]'
                : 'text-[3rem] text-blanc/90 md:text-[clamp(2.8rem,5vw,4.5rem)]')} />
      <span className="mt-3 block font-condensed text-[0.65rem] uppercase tracking-[0.3em] text-blanc/45">{stat.label}</span>
```
Panic Room hero on events (reuse classes on home): `<div className="relative -mx-5 aspect-square overflow-hidden md:mx-0 md:aspect-[3/2]">` + Image `/images/panic-room/trio.jpg` `className="object-cover object-[40%_center] md:object-center"` + gradient caption `absolute inset-x-0 bottom-0 bg-gradient-to-t from-noir/90 to-transparent p-5 md:p-6` / span `font-condensed text-[0.55rem] uppercase tracking-[0.3em] text-terracotta`.

CountUp (components/animation/CountUp.tsx, client): `CountUp({ value: string; className?: string; delay?: number; duration?: number })` — value like "711" / "7h".

"All events →" link style (app/small-record/page.tsx ~L257):
```tsx
<Link href="/events" className="group hidden items-center gap-2 font-condensed text-[0.6rem] uppercase tracking-[0.3em] text-blanc/40 transition-colors hover:text-terracotta md:flex">
  All events
  <span className="transition-transform group-hover:translate-x-1">→</span>
</Link>
```

Home (app/page.tsx, 353 lines): imports Image, Link, AnimatedSection, ParallaxImage, HorizontalRule, … — NOT CountUp, NOT cn. ARTIST SPREAD = `<HorizontalRule color="bg-blanc/10" />` + `<section className="px-5 py-16 md:px-8 md:py-24">` ending ~L218; next is `{/* ═══════ FULL BLEED PHOTO + PULL QUOTE ═══════ */}` at L220. Home folios used: 001 (cover), 002 (manifesto), 003 (artists), 004 (video feature) — the new section gets NO folio (avoids renumbering the rest).

PhotoSlider (components/magazine/PhotoSlider.tsx): root `className={`-mx-5 overflow-x-auto scrollbar-hide md:-mx-8 ${className ?? ''}`}`, inner `motion.div className="flex gap-3 px-5 md:px-8"`. Only caller: app/casae/page.tsx L109, inside `<section className="py-8">` (no horizontal padding) — verified by grep.
</interfaces>
</context>

<tasks>

<task type="auto">
  <name>Task 1: /events — Panic Room cover, reverse-chronological order, compact Fête on mobile, Coming soon dates</name>
  <files>public/images/panic-room/cover.jpg, app/events/page.tsx</files>
  <action>
**A. Cover image (task 2 of brief).** Source has a trailing space in the folder name — quote it:
```bash
SRC="/Users/myltonvanbolderen/Downloads/PANIC ROOM/photo pour carrouselle /case concentré.jpg"
mkdir -p public/asset/panic-room
cp "$SRC" public/asset/panic-room/          # gitignored original, never staged
sips -s format jpeg -s formatOptions 80 -Z 1920 "$SRC" --out public/images/panic-room/cover.jpg
```
Source is 3090×2048 landscape → expect ~1920×1273. In the COVER section change the Image to `src="/images/panic-room/cover.jpg"` and `alt="Casæ at the decks, Small Party at Panic Room"`; keep `fill`, `priority`, `unoptimized` and the gradient div exactly. Add an object-position so the portrait mobile crop keeps his face (subject is center-left): start with `className="object-cover object-[35%_center] md:object-center"`; adjust the percentage after the 390px screenshot in Task 3 if the face is cut. Do not add any overlay.

**B. Reorder sections newest → oldest (task 1).** Use a small Node script in the scratchpad (not a manual retype) that operates on the four blocks between the markers: each block runs from its `{/* ═══════ 00N · … ═══════ */}` comment line up to (not including) the next marker line; the last block (Panic Room) ends at the line before `{/* ═══════ COMING SOON ═══════ */}`. For each block, drop a `<HorizontalRule color="bg-blanc/10" />` line directly after the comment if present, trim trailing blank lines. Re-emit in order Panic Room, Gambetta, Featured Mix, Fête, separated by one blank line, inserting `        <HorizontalRule color="bg-blanc/10" />` right after the comment of every block except the first (same pattern as today: first section after the Marquee has no rule). Keep a blank line before the COMING SOON comment. Coming soon keeps no HR (unchanged).
Then renumber — comments and visible folio spans:
- `004 · SMALL PARTY × PANIC ROOM` → `001 · SMALL PARTY × PANIC ROOM`, folio `004` → `001`
- `003 · EARLY REFLECTION × GAMBETTA` stays → `002 …`, folio `002`
- `002 · FEATURED MIX` → `003 · FEATURED MIX`, folio `003`
- `001 · FÊTE DE LA MUSIQUE` → `004 · FÊTE DE LA MUSIQUE`, folio `004`
- `COMING SOON` comment → `005 · COMING SOON` (folio already `005`).
Do the folio edits with Edit on the unique surrounding context (each folio span sits right after its section's h2/sub) — never global sed on `00N` (the cover has `000`). Block contents otherwise move verbatim.

**C. Fête de la Musique compact on mobile (task 3).** In the Fête grid:
- container: `mt-6 grid grid-cols-2 gap-3 md:grid-cols-12 md:gap-5`
- Casae video wrapper: `col-span-1 md:col-span-4` (inner stays `aspect-[9/16]`)
- crew photo wrapper: `order-first col-span-2 md:order-none md:col-span-4`; its inner div `relative aspect-[4/3] w-full overflow-hidden md:aspect-[9/16]`
- Letche video wrapper: `col-span-1 md:col-span-4`
DOM order stays video/photo/video so desktop is exactly as today. Gradient captions untouched.

**D. Coming soon (task 4).** Timeline `when` values: Club/Paris → `'TBA'`; Festival/To be announced → `'2026–27'` (en dash); B2B/Somewhere loud → `'Soon'` (unchanged). Don't touch tags/cities, don't invent venues.

Leave `eventsJsonLd`, metadata and everything else untouched.

Commit: `git add public/images/panic-room/cover.jpg app/events/page.tsx` then `git commit -m "feat(events): newest-first order, Panic Room cover, compact Fête on mobile" -m "Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"` (after Task 3's /events checks pass, or amend-free: run the tsc + diff checks below first).
  </action>
  <verify>
    <automated>cd /Users/myltonvanbolderen/small-record && npx tsc --noEmit && sips -g pixelWidth public/images/panic-room/cover.jpg && grep -n "═══════ 00" app/events/page.tsx && grep -c 'HorizontalRule color="bg-blanc/10"' app/events/page.tsx && diff <(git show HEAD:app/events/page.tsx | sort) <(sort app/events/page.tsx); git status --short public/asset</automated>
  </verify>
  <done>tsc clean; cover.jpg ≤1920px wide; markers appear in order 001 PANIC, 002 GAMBETTA, 003 MIX, 004 FÊTE, 005 COMING SOON; HorizontalRule count equals the HEAD count; sorted-lines diff only shows the intended lines (cover src/alt/className, comment/folio numbers, Fête classes, two `when` values) — proving blocks moved verbatim; public/asset shows nothing staged/tracked.</done>
</task>

<task type="auto">
  <name>Task 2: Home "Latest · Live" Panic Room section + /casae overflow fix</name>
  <files>app/page.tsx, components/magazine/PhotoSlider.tsx</files>
  <action>
**A. Home latest event (task 5).** In app/page.tsx add `import { CountUp } from '@/components/animation/CountUp'` (and `import { cn } from '@/lib/utils'` if you use it). Insert between the end of ARTIST SPREAD `</section>` and `{/* ═══════ FULL BLEED PHOTO + PULL QUOTE ═══════ */}`:
```tsx
{/* ═══════ LATEST LIVE - Panic Room ═══════ */}
<HorizontalRule color="bg-blanc/10" />
<section className="px-5 py-20 md:px-8 md:py-28">
  <div className="mx-auto max-w-6xl">
    <AnimatedSection blur>
      <div className="mb-10 flex items-end justify-between md:mb-12">
        <div>
          <span className="font-condensed text-[0.55rem] uppercase tracking-[0.5em] text-terracotta">Latest · Live</span>
          <h2 className="mt-2 font-display text-[clamp(1.8rem,4vw,3rem)] font-bold leading-[1.05]">Small Party @ Panic Room</h2>
          <p className="mt-2 font-body text-[0.95rem] text-blanc/40">Paris 11 · September 11, 2026</p>
        </div>
      </div>
    </AnimatedSection>
    {/* photo: NOT wrapped in AnimatedSection */}
    <div className="relative -mx-5 aspect-square overflow-hidden md:mx-0 md:aspect-[3/2]">
      <Image src="/images/panic-room/trio.jpg" alt="Letché, Casæ and Lessovik behind the decks at Panic Room" fill
        className="object-cover object-[40%_center] md:object-center" unoptimized />
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-noir/90 to-transparent p-5 md:p-6">
        <span className="font-condensed text-[0.55rem] uppercase tracking-[0.3em] text-terracotta">Behind the decks · around 1am</span>
      </div>
    </div>
    {/* numbers band — same style as /events, 3 cells */}
    <div className="mt-12 grid grid-cols-3 gap-px border-y border-blanc/10 bg-blanc/10">
      {[{ value: '711', label: 'People' }, { value: '7h', label: 'Of music' }, { value: '4', label: 'DJs' }].map((stat, i) => (
        <div key={stat.label} className="bg-noir px-4 py-5 md:px-6 md:py-8">
          <CountUp value={stat.value} delay={i * 0.12}
            className={cn('block font-display font-bold leading-none text-[clamp(2.4rem,11vw,4.5rem)] md:text-[clamp(2.8rem,5vw,4.5rem)]',
              i === 0 ? 'text-terracotta' : 'text-blanc/90')} />
          <span className="mt-3 block font-condensed text-[0.65rem] uppercase tracking-[0.3em] text-blanc/45">{stat.label}</span>
        </div>
      ))}
    </div>
    <Link href="/events/" className="group mt-10 inline-flex items-center gap-2 font-condensed text-[0.6rem] uppercase tracking-[0.3em] text-blanc/40 transition-colors hover:text-terracotta">
      See the full recap
      <span className="transition-transform group-hover:translate-x-1">→</span>
    </Link>
  </div>
</section>
```
(Link reuses the "All events →" style but visible on all breakpoints — `inline-flex` instead of `hidden … md:flex`, since it is the section's only CTA.) Ensure the 3-cell row fits at 390px without overflow (11vw ≈ 43px per number; "711" fits in ~125px cells). No folio on this section (keeps home 001–004 intact). If ARTIST SPREAD already ends right before FULL BLEED with no rule, keep FULL BLEED as-is (it has no HR today — don't add one after the new section).

**B. /casae overflow (task 6).** Grep confirmed PhotoSlider's only caller is app/casae/page.tsx, whose parent `<section className="py-8">` has no horizontal padding, so `-mx-5 md:-mx-8` pushes 32px past the viewport at ≥768px. In components/magazine/PhotoSlider.tsx change the root className to `` `overflow-x-auto scrollbar-hide ${className ?? ''}` `` (remove both negative margins). Keep inner `px-5 md:px-8` so the first photo still aligns with page text. Do not touch app/casae/page.tsx.

Commits (two, exact paths):
1. `git add app/page.tsx && git commit -m "feat(home): show latest live event (Panic Room)" -m "Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"`
2. `git add components/magazine/PhotoSlider.tsx && git commit -m "fix(casae): remove PhotoSlider negative margins causing horizontal overflow" -m "Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"`
  </action>
  <verify>
    <automated>cd /Users/myltonvanbolderen/small-record && npx tsc --noEmit && grep -n "LATEST LIVE - Panic Room\|href=\"/events/\"\|CountUp" app/page.tsx && ! grep -n "\-mx-" components/magazine/PhotoSlider.tsx</automated>
  </verify>
  <done>tsc clean; home contains the LATEST LIVE section between ARTIST SPREAD and FULL BLEED with CountUp stats and /events/ link; AnimatedSection wraps only the header; PhotoSlider has no negative margins.</done>
</task>

<task type="auto">
  <name>Task 3: Browser verification (Playwright screenshots + overflow) and isolated next build</name>
  <files>(scratchpad only — no repo files)</files>
  <action>
SCR=/private/tmp/claude-501/-Users-myltonvanbolderen-small-record/54b5f0cd-5a66-4186-b337-6738006c59de/scratchpad. Dev server is already on http://localhost:3000 — check with `curl -sI http://localhost:3000/ | head -1`; do NOT start/kill/restart it. If it's down, report it rather than restarting.

Write `$SCR/lotc-shots.mjs`:
```js
import { createRequire } from 'node:module'
const require = createRequire('/Users/myltonvanbolderen/Downloads/PANIC ROOM/_kit/package.json')
const { chromium, devices } = require('playwright')
const OUT = process.argv[2]
const b = await chromium.launch()
const ctxs = { m: { ...devices['iPhone 13'] }, d: { viewport: { width: 1440, height: 900 } } }
async function scrollAll(p) { await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 300) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 60)) } window.scrollTo(0, 0) }) }
for (const [k, opt] of Object.entries(ctxs)) {
  const c = await b.newContext(opt); const p = await c.newPage()
  // /events: cover + first two sections + Fête block
  await p.goto('http://localhost:3000/events/', { waitUntil: 'load' }); await scrollAll(p); await p.waitForTimeout(800)
  await p.screenshot({ path: `${OUT}/events-cover-${k}.png` })
  console.log(k, 'events folios', await p.$$eval('span', s => s.map(x => x.textContent.trim()).filter(t => /^00[0-5]$/.test(t)).join(',')))
  console.log(k, 'events h2', await p.$$eval('h2', s => s.map(x => x.textContent.trim()).join(' | ')))
  const h = await p.evaluate(() => innerHeight)
  for (let i = 1; i <= 3; i++) { await p.evaluate(y => window.scrollTo(0, y), h * i); await p.waitForTimeout(400); await p.screenshot({ path: `${OUT}/events-${i}-${k}.png` }) }
  const fete = p.locator('h2', { hasText: 'Fête de la Musique' }); await fete.scrollIntoViewIfNeeded(); await p.waitForTimeout(600)
  await p.screenshot({ path: `${OUT}/events-fete-${k}.png`, fullPage: false })
  console.log(k, 'events overflow', await p.evaluate(() => [document.documentElement.scrollWidth, innerWidth]))
  // home latest live
  await p.goto('http://localhost:3000/', { waitUntil: 'load' }); await scrollAll(p)
  const ll = p.locator('h2', { hasText: 'Small Party @ Panic Room' }); await ll.scrollIntoViewIfNeeded(); await p.waitForTimeout(1800)
  await p.screenshot({ path: `${OUT}/home-latest-${k}.png` })
  await p.evaluate(() => window.scrollBy(0, innerHeight * 0.8)); await p.waitForTimeout(1800)
  await p.screenshot({ path: `${OUT}/home-latest2-${k}.png` })
  console.log(k, 'home overflow', await p.evaluate(() => [document.documentElement.scrollWidth, innerWidth]))
  // casae overflow
  await p.goto('http://localhost:3000/casae/', { waitUntil: 'load' }); await scrollAll(p)
  console.log(k, 'casae overflow', await p.evaluate(() => [document.documentElement.scrollWidth, innerWidth]))
  await c.close()
}
await b.close()
```
Run `node $SCR/lotc-shots.mjs $SCR/shots` (mkdir first). Also run it with viewport width 390 implicitly via iPhone 13 (390×664). Then Read the PNGs and check:
- events-cover-m: Casæ's face visible in the portrait crop. If cut, adjust `object-[35%_center]` (e.g. 25–45%) in app/events/page.tsx, re-run, and fold the fix into Task 1's commit (commit Task 1 only after this check if not yet committed; otherwise a follow-up `fix(events): adjust cover crop` commit).
- events h2 order: Small Party, Gambetta Club, House Mix · Pool Party, Fête de la Musique, Coming soon; folios 000,001,002,003,004,005 (desktop only — folio spans are `hidden md:block`, so on mobile only 000 may show).
- events-fete-m: crew photo full width 4:3 on top, two 9:16 videos side by side; events-fete-d: three equal 9:16 columns video/photo/video.
- home-latest-m/d: header, full-bleed square photo (mobile) / 3:2 (desktop) with bottom gradient caption, stats 711 (terracotta) / 7h / 4 counted up, "See the full recap →" link.
- All overflow pairs equal (scrollWidth === innerWidth) at 390 and 1440, especially casae.

Then isolated production build (never in the repo — dev server uses .next):
```bash
BC=$SCR/buildcheck
rsync -a --delete --exclude .next --exclude out --exclude public/asset --exclude node_modules --exclude .git /Users/myltonvanbolderen/small-record/ $BC/
ln -sfn /Users/myltonvanbolderen/small-record/node_modules $BC/node_modules
cd $BC && npx next build
```
  </action>
  <verify>
    <automated>node /private/tmp/claude-501/-Users-myltonvanbolderen-small-record/54b5f0cd-5a66-4186-b337-6738006c59de/scratchpad/lotc-shots.mjs /private/tmp/claude-501/-Users-myltonvanbolderen-small-record/54b5f0cd-5a66-4186-b337-6738006c59de/scratchpad/shots && cd /private/tmp/claude-501/-Users-myltonvanbolderen-small-record/54b5f0cd-5a66-4186-b337-6738006c59de/scratchpad/buildcheck && npx next build</automated>
  </verify>
  <done>Screenshots reviewed and match the truths above; all overflow checks equal; `next build` in the isolated copy succeeds with /, /events, /casae exported; git log shows 3 commits (events, home, casae fix) staging only the 4 listed paths; nothing under public/asset or .claude staged; no deploy.</done>
</task>

</tasks>

<threat_model>
## Trust Boundaries

| Boundary | Description |
|----------|-------------|
| none new | Static SSG content edits only; no user input, no new endpoints, no new dependencies |

## STRIDE Threat Register

| Threat ID | Category | Component | Disposition | Mitigation Plan |
|-----------|----------|-----------|-------------|-----------------|
| T-oti-01 | I | public/asset/panic-room original photo | mitigate | public/asset is gitignored + .vercelignore'd; stage exact paths only, check `git status --short public/asset` is empty of staged files |
| T-oti-02 | T | eventsJsonLd in app/events/page.tsx | accept | Not modified by the reorder script (script only touches lines between the 00N markers and COMING SOON); sorted-lines diff proves it |
| T-oti-03 | D | dev server on :3000 | mitigate | Never kill/restart; production build runs in isolated scratchpad copy so .next of the dev server is untouched |
</threat_model>

<verification>
- `npx tsc --noEmit` clean
- Sorted-lines diff of app/events/page.tsx vs HEAD shows only intended changes
- Playwright (iPhone 13 + 1440×900): /events order + cover crop + Fête mobile/desktop layout; home Latest Live section; overflow scrollWidth === innerWidth on /events, /, /casae
- Isolated `next build` passes
</verification>

<success_criteria>
- /events: Panic Room (001) → Gambetta (002) → Featured Mix (003) → Fête (004) → Coming soon (005), HR between consecutive sections, none after the Marquee
- Cover = panic-room/cover.jpg, face visible on 390px
- Fête mobile: photo 4:3 full width then 2 videos side by side; desktop unchanged
- Coming soon `when`: TBA / 2026–27 / Soon
- Home Latest Live section with photo, 3 CountUp stats, link to /events/
- /casae no horizontal overflow at 390 and 1440
- 3 atomic commits with Co-Authored-By trailer, no deploy
</success_criteria>

<output>
After completion, create `.planning/quick/260921-oti-audit-lot-c-events-and-home/260921-oti-SUMMARY.md`
</output>
