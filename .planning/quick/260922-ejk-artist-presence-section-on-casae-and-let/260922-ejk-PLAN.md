---
phase: quick-260922-ejk
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - lib/presence.ts
  - components/magazine/ArtistPresence.tsx
  - components/magazine/ArtistLive.tsx
  - app/casae/page.tsx
  - app/letche/page.tsx
  - app/events/page.tsx
  - public/images/panic-room/letche-lessovik.jpg
autonomous: true
requirements: [QUICK-260922-ejk]

must_haves:
  truths:
    - "/casae/ shows a compact 'Presence' section titled 'Where Casæ played' with 3 cards (Panic Room, Gambetta Club, Fête de la Musique), newest first, each showing a photo where Casæ's face is visible"
    - "/letche/ shows the same compact section titled 'Where Letché played' with 3 cards, each showing a photo where Letché's face is visible"
    - "The big Panic Room 'On stage' block (ArtistLive) no longer appears on either artist page"
    - "Clicking a card goes to /events/#<anchor> and the event heading is visible below the fixed header"
    - "No horizontal overflow and no broken images at iPhone 13 and 1440x900"
  artifacts:
    - path: "lib/presence.ts"
      provides: "EVENTS map + per-artist presence lists (single source of truth)"
      exports: ["EVENTS", "PRESENCE"]
    - path: "components/magazine/ArtistPresence.tsx"
      provides: "Compact Presence section (server component)"
      exports: ["ArtistPresence"]
    - path: "app/events/page.tsx"
      provides: "Anchors panic-room, gambetta-club, fete-de-la-musique"
      contains: "id=\"panic-room\""
  key_links:
    - from: "app/casae/page.tsx, app/letche/page.tsx"
      to: "components/magazine/ArtistPresence.tsx"
      via: "<ArtistPresence artist=... />"
      pattern: "<ArtistPresence"
    - from: "lib/presence.ts EVENTS[].href"
      to: "app/events/page.tsx section ids"
      via: "/events/#panic-room etc."
      pattern: "/events/#(panic-room|gambetta-club|fete-de-la-musique)"
---

<objective>
Replace the large Panic Room "On stage" block (`<ArtistLive>`) on /casae/ and /letche/ with a small magazine-style "Presence" section listing every live event the artist played (3 today), each card showing a photo of THAT artist at THAT event and linking to the event's anchor on /events/.

Purpose: bookers see at a glance where each DJ has played; the page gets lighter.
Output: lib/presence.ts, components/magazine/ArtistPresence.tsx, anchors on /events/, ArtistLive.tsx + letche-lessovik.jpg removed.
</objective>

<execution_context>
@$HOME/.claude/get-shit-done/workflows/execute-plan.md
@$HOME/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/STATE.md
@/Users/myltonvanbolderen/CLAUDE.md
@components/magazine/SectionHeader.tsx
@components/magazine/ArtistLive.tsx
@app/casae/page.tsx
@app/letche/page.tsx
@app/events/page.tsx

<constraints>
- Locked decisions (from orchestrator/user — do not reopen): section replaces ArtistLive on both pages (keep the `<HorizontalRule color="bg-blanc/10" />` before it); Featured Mix (YouTube pool party) is NOT listed; ArtistLive.tsx deleted; letche-lessovik.jpg `git rm`'d; casae-pro.jpg and letche-decks.jpg stay (used by Presence).
- next/image with `fill` + `sizes` (custom WebP loader lib/image-loader.ts, `trailingSlash: true`, `output: 'export'`). No native <img> (reserved for gnome/wordmarks).
- AnimatedSection ONLY around the header text, never around photos.
- No dark overlays on photos (no gradient needed here — text is below the thumbnail).
- Small red labels: `text-terracotta-light` (SectionHeader kicker already does this). Grey small text ≥ `text-blanc/55`.
- Tailwind v4 (`@import "tailwindcss"` in globals.css, automatic source detection) — object-position classes must be full string literals in a scanned file.
- Dev server on :3000 belongs to the user: NEVER kill/restart it. No `npm install`.
- Stage exact paths only; never stage public/asset, public/images/_w, .claude.
- No deploy.
</constraints>

<interfaces>
From components/magazine/SectionHeader.tsx:
```typescript
interface SectionHeaderProps {
  kicker: ReactNode; title: ReactNode; meta?: ReactNode; folio?: string; aside?: ReactNode;
  className?: string;       // default 'mb-3 flex items-end justify-between'
  titleClassName?: string;  // default 'mt-2 font-display text-[clamp(1.8rem,4vw,3rem)] font-bold leading-[1.05]'
}
export function SectionHeader(props: SectionHeaderProps): JSX.Element
```
AnimatedSection: `import { AnimatedSection } from '@/components/animation/AnimatedSection'` (prop `blur` used elsewhere).

Hover pattern used on /small-record teaser cards:
`className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"` inside a `group` parent with overflow-hidden.

Current ArtistLive usage to remove — app/casae/page.tsx ~lines 116-127 (comment `{/* ═══════ ON STAGE - Panic Room ═══════ */}` + `<ArtistLive .../>`, import line 9); app/letche/page.tsx ~lines 132-142 (same, import line 9). The panic-casae/panic-letche videos, casae-prime.jpg and cover.jpg remain used by app/events/page.tsx — do NOT delete them.

Event sections in app/events/page.tsx (each `<section className="px-5 py-20 md:px-8 md:py-28">`):
- line ~149 after comment `001 · SMALL PARTY × PANIC ROOM` → id="panic-room"
- line ~290 after comment `002 · EARLY REFLECTION × GAMBETTA` → id="gambetta-club"
- line ~408 after comment `004 · FÊTE DE LA MUSIQUE` → id="fete-de-la-musique"

Photo dimensions (sips, checked at planning time) — cards are aspect-[4/5] portrait, so landscape photos get cropped horizontally:
| file | WxH | orientation |
|---|---|---|
| /images/panic-room/casae-pro.jpg | 1920x1280 | landscape 3:2 |
| /images/early-reflection/mixing.jpg | 1060x1600 | portrait |
| /images/fete-musique/casae-live.jpg | 1920x1440 | landscape 4:3 (NOT portrait as noted in brief) |
| /images/panic-room/letche-decks.jpg | 1920x1272 | landscape (subject right of center) |
| /images/early-reflection/letche-portrait.jpg | 1600x1060 | landscape (Letché = LEFT person) |
| /images/fete-musique/duo-sornettes.jpg | 1920x1440 | landscape (Letché = left) |
</interfaces>
</context>

<tasks>

<task type="auto">
  <name>Task 1: Presence data + component, wire into artist pages, anchors on /events/, remove ArtistLive</name>
  <files>lib/presence.ts, components/magazine/ArtistPresence.tsx, app/casae/page.tsx, app/letche/page.tsx, app/events/page.tsx, components/magazine/ArtistLive.tsx, public/images/panic-room/letche-lessovik.jpg</files>
  <action>
1. Create `lib/presence.ts`:
```ts
export type EventId = 'panic-room' | 'gambetta-club' | 'fete-de-la-musique'
export interface PresenceEvent { id: EventId; name: string; date: string; venue: string; href: string }
export interface PresenceEntry { eventId: EventId; photo: { src: string; alt: string; position?: string } }
export const EVENTS: Record<EventId, PresenceEvent> = {
  'panic-room':         { id: 'panic-room', name: 'Small Party @ Panic Room', date: 'Sept 11, 2026', venue: 'Panic Room, Paris 11', href: '/events/#panic-room' },
  'gambetta-club':      { id: 'gambetta-club', name: 'Early Reflections × Small Records', date: 'Apr 30, 2026', venue: 'Gambetta Club, Paris 20', href: '/events/#gambetta-club' },
  'fete-de-la-musique': { id: 'fete-de-la-musique', name: 'Fête de la Musique', date: 'June 2025', venue: 'Sornettes, Paris', href: '/events/#fete-de-la-musique' },
}
export const PRESENCE: Record<'casae' | 'letche', PresenceEntry[]> = { casae: [...], letche: [...] } // newest first
```
   Entries (newest first, per locked decisions):
   - casae: panic-room → `/images/panic-room/casae-pro.jpg`, alt "Casæ at the decks at Panic Room", position start `object-[50%_center]`; gambetta-club → `/images/early-reflection/mixing.jpg`, alt "Casæ mixing at Gambetta Club", position `object-center` (portrait, minimal crop); fete-de-la-musique → `/images/fete-musique/casae-live.jpg`, alt "Casæ at the decks at Sornettes", position start `object-[50%_center]`.
   - letche: panic-room → `/images/panic-room/letche-decks.jpg`, alt "Letché at the decks at Panic Room", `object-[65%_center]`; gambetta-club → `/images/early-reflection/letche-portrait.jpg`, alt "Letché at Gambetta Club", `object-[30%_center]`; fete-de-la-musique → `/images/fete-musique/duo-sornettes.jpg`, alt "Letché and Casæ at Sornettes", `object-[35%_center]`.
   Every position must be a full literal string (e.g. `'object-[65%_center]'`) — never built by concatenation. Starting positions for Casae's landscape photos are guesses: open each image (Read tool on the JPG) to locate Casæ's face horizontally and set the % accordingly before screenshots; tune all 6 after Task 2 screenshots if a face is cut.
   Add a one-line comment: add a new event to EVENTS + an entry at the top of each artist's list; the target section on /events/ needs a matching `id`.

2. Create `components/magazine/ArtistPresence.tsx` (server component, no "use client"): props `{ artist: 'casae' | 'letche'; name: string }` (name = 'Casæ' / 'Letché'). Render:
   - `<section className="px-5 py-14 md:px-8 md:py-20">` → `<div className="mx-auto max-w-4xl">`
   - `<AnimatedSection blur><SectionHeader kicker="Presence" title={`Where ${name} played`} className="mb-6 md:mb-8" titleClassName="mt-2 font-display text-[clamp(1.4rem,3vw,2rem)] font-bold leading-[1.05]" /></AnimatedSection>` (no folio, no meta).
   - `<ul className="grid grid-cols-3 gap-2 md:gap-4">` mapping PRESENCE[artist]; each `<li>` contains `<Link href={event.href} className="group block">`:
     - thumbnail `<div className="relative aspect-[4/5] overflow-hidden bg-placeholder">` with `<Image src alt fill sizes="(min-width: 896px) 280px, 33vw" className={cn('object-cover transition-transform duration-700 group-hover:scale-[1.03]', photo.position ?? 'object-center')} />` (cn from `@/lib/utils`).
     - `<p className="mt-2 font-display text-[0.95rem] leading-tight md:mt-3 md:text-[1.1rem] transition-colors group-hover:text-terracotta-light">{event.name}</p>`
     - `<p className="mt-1 font-condensed text-[0.6rem] uppercase tracking-[0.2em] text-blanc/55">{event.date} · {event.venue}</p>` (tracking 0.2em, not wider — 3 columns on a 390px phone are ~120px each; text must wrap, never overflow; add `break-words`).
   - Links need a visible focus state: add `focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-terracotta` on the Link (consistent with lot D accessibility pass; if globals.css already provides a global :focus-visible style, skip).
   - No overlay/gradient on photos. No AnimatedSection around the grid.

3. app/casae/page.tsx: replace the import of ArtistLive with `import { ArtistPresence } from '@/components/magazine/ArtistPresence'`; replace the `{/* ON STAGE - Panic Room */}` comment + `<ArtistLive .../>` with `{/* ═══════ PRESENCE ═══════ */}` + `<ArtistPresence artist="casae" name="Casæ" />`, keeping the preceding `<HorizontalRule color="bg-blanc/10" />`. Same in app/letche/page.tsx with `artist="letche" name="Letché"`.

4. app/events/page.tsx: add `id="panic-room"`, `id="gambetta-club"`, `id="fete-de-la-musique"` + `scroll-mt-20` to the className of the three `<section>`s listed in interfaces (only those three; leave everything else untouched).

5. `git rm components/magazine/ArtistLive.tsx public/images/panic-room/letche-lessovik.jpg` after confirming `grep -rn "ArtistLive\|letche-lessovik" app components lib tools` returns nothing. Also remove any stale variants of letche-lessovik under public/images/_w only if they are git-tracked (they are gitignored — just leave them; the build regenerates).

6. Confirm Tailwind picks up the arbitrary classes from lib/presence.ts: Tailwind v4 auto-detection scans all non-gitignored project files, so it should; verification in Task 2 checks the computed `object-position` of each thumbnail. If any is `50% 50%` where a non-center value was set, move the literal class strings into ArtistPresence.tsx (e.g. a `POSITIONS` const map) and reference by key from lib/presence.ts.

7. Run `npx tsc --noEmit` and `npm run lint`. Commit (stage exact paths: lib/presence.ts components/magazine/ArtistPresence.tsx app/casae/page.tsx app/letche/page.tsx app/events/page.tsx + the two git rm'd paths):
   `feat(artists): compact Presence section (every event played) replaces On stage block` with trailer `Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>`.
  </action>
  <verify>
    <automated>cd /Users/myltonvanbolderen/small-record && npx tsc --noEmit && npm run lint && ! grep -rn "ArtistLive\|letche-lessovik" app components lib && grep -c 'id="panic-room"\|id="gambetta-club"\|id="fete-de-la-musique"' app/events/page.tsx</automated>
  </verify>
  <done>tsc + lint pass with 0 errors; no references to ArtistLive or letche-lessovik; 3 anchors present on /events/; both artist pages render ArtistPresence; commit created with exact paths.</done>
</task>

<task type="auto">
  <name>Task 2: Playwright visual + navigation verification, tune crops, update CLAUDE.md</name>
  <files>lib/presence.ts (only if crop tuning needed), /Users/myltonvanbolderen/CLAUDE.md (outside repo, not committed)</files>
  <action>
1. Use the already-running dev server at http://localhost:3000 (check with `curl -sI http://localhost:3000/casae/`). NEVER kill/restart it. If it is not responding, build in an APFS clone instead: `SP=/private/tmp/claude-501/-Users-myltonvanbolderen-small-record/54b5f0cd-5a66-4186-b337-6738006c59de/scratchpad; rsync`-free approach: `mkdir -p $SP/build && cd /Users/myltonvanbolderen/small-record && for f in $(ls -A | grep -vE '^(\.next|out|\.git|public)$'); do cp -cR "$f" $SP/build/; done; mkdir -p $SP/build/public && for f in $(ls -A public | grep -v '^asset$'); do cp -cR "public/$f" $SP/build/public/; done` (node_modules is a real clone copy, not a symlink), then `cd $SP/build && npx next build` and serve `out/` with `npx serve out -l 3100` in background (or python3 -m http.server), testing against :3100.

2. Write `$SP/presence/shoot.mjs` loading Playwright via `createRequire('/Users/myltonvanbolderen/Downloads/PANIC ROOM/_kit/node_modules/')` → `require('playwright')` (chromium already installed). For each of `/casae/` and `/letche/`, in two contexts (`devices['iPhone 13']` and viewport 1440x900):
   - goto, locate the section via `page.getByRole('heading', { name: /Where .* played/ })`, scrollIntoViewIfNeeded, wait for all `section img` inside it to have `complete && naturalWidth > 0` (fail if any broken), screenshot the section element to `$SP/presence/{page}-{mobile|desktop}.png`.
   - Log each thumbnail's `getComputedStyle(img).objectPosition` (confirms Tailwind generated the arbitrary classes from lib/presence.ts — see Task 1 step 6).
   - Assert no horizontal overflow: `document.documentElement.scrollWidth <= window.innerWidth`.
   - Also screenshot each single thumbnail at mobile size (`$SP/presence/{page}-card{1..3}-mobile.png`) for close face review.
   - Click the first card (Panic Room) on mobile and the Gambetta card on desktop; wait for URL to end with `/events/#panic-room` / `/events/#gambetta-club`; after ~800ms, assert the target section's heading `getBoundingClientRect().top` is ≥ the fixed header's bottom (header element `header`) and < viewport height; screenshot `$SP/presence/{anchor}-landing.png`. Also check `#fete-de-la-musique` by direct goto `/events/#fete-de-la-musique`.
3. Read each screenshot (Read tool). For each of the 6 thumbnails confirm the NAMED artist's face is inside the crop (Casae: curly dark hair, mustache — red NY cap at Panic Room, olive jacket at Gambetta, sunglasses + white tee at Fête; Letche: mullet, thin mustache — white cap + Diesel tee at Panic Room, red Adidas jacket + leopard cap at Gambetta (left person), tank top at Fête (left person)). If a face is cut, adjust that entry's `position` literal in lib/presence.ts and re-shoot. If tuning happened, commit `fix(artists): tune Presence thumbnail crops` (stage lib/presence.ts only) with the Co-Authored-By trailer; rerun tsc + lint first.
4. Update /Users/myltonvanbolderen/CLAUDE.md (outside repo, do not commit): in Architecture > components > magazine list, add `ArtistPresence` (if ArtistLive is mentioned anywhere, replace it with ArtistPresence); under lib/ add a line `presence.ts       # EVENTS + per-artist Presence lists (Casae/Letche pages) — add new events here + matching id on /events/ section`.
5. Leave screenshots in `$SP/presence/` and list their paths in the SUMMARY for orchestrator review.
  </action>
  <verify>
    <automated>node /private/tmp/claude-501/-Users-myltonvanbolderen-small-record/54b5f0cd-5a66-4186-b337-6738006c59de/scratchpad/presence/shoot.mjs && ls /private/tmp/claude-501/-Users-myltonvanbolderen-small-record/54b5f0cd-5a66-4186-b337-6738006c59de/scratchpad/presence/*.png && cd /Users/myltonvanbolderen/small-record && npx tsc --noEmit && npm run lint</automated>
  </verify>
  <done>Script exits 0: no broken images, no horizontal overflow, 3 anchors land with heading visible below the header; object-position values match lib/presence.ts; the correct artist's face is visible in all 6 thumbnails (screenshots saved for orchestrator review); CLAUDE.md updated; dev server untouched; nothing deployed.</done>
</task>

</tasks>

<threat_model>
## Trust Boundaries

| Boundary | Description |
|----------|-------------|
| none | Static SSG content, hardcoded data, internal links only — no user input, no external requests |

## STRIDE Threat Register

| Threat ID | Category | Component | Disposition | Mitigation Plan |
|-----------|----------|-----------|-------------|-----------------|
| T-ejk-01 | I | git staging | mitigate | Stage exact paths only; never public/asset (136MB originals), public/images/_w, .claude |
| T-ejk-02 | T | internal links | accept | Hrefs are hardcoded constants in lib/presence.ts pointing to same-origin /events/ anchors |
</threat_model>

<verification>
- `npx tsc --noEmit` and `npm run lint` pass with 0 errors.
- No remaining references to ArtistLive / letche-lessovik; files removed via git rm.
- Playwright screenshots at iPhone 13 + 1440x900 for /casae/ and /letche/ Presence section; the correct face in each of the 6 thumbnails; no broken images; no horizontal overflow.
- Card click lands on /events/#anchor with the section heading visible under the fixed header.
</verification>

<success_criteria>
- Both artist pages show a compact "Presence" section (3 cards, newest first) instead of the big Panic Room block.
- Each card links to its /events/ anchor.
- Adding a future event = one EVENTS entry + one entry per artist in lib/presence.ts + an id on the /events/ section.
- Atomic commits with Co-Authored-By trailer; no deploy; dev server untouched.
</success_criteria>

<output>
After completion, create `.planning/quick/260922-ejk-artist-presence-section-on-casae-and-let/260922-ejk-SUMMARY.md` (list screenshot paths for orchestrator review).
</output>
