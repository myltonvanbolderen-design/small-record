---
phase: quick-260922-naw
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - public/images/panic-room/film/*.jpg   # 22 optimized frames (committed)
  - public/asset/panic-room/film/*.jpg    # originals (gitignored, NOT committed)
  - components/lab/frames.ts
  - components/lab/ContactSheet.tsx
  - components/lab/FilmLightbox.tsx
  - components/lab/DevelopingPhoto.tsx
  - app/lab/layout.tsx
  - app/lab/page.tsx
  - .vercelignore
autonomous: true
requirements: [QUICK-260922-naw]

must_haves:
  truths:
    - "http://localhost:3000/lab/ shows a contact sheet of 22 Panic Room film frames laid out as film strips (6/row lg, 4/row md, horizontal-scrolling strips on mobile)"
    - "The 5 picks (08, 10, 14, 16, 25) carry a hand-drawn red felt-tip circle; the 5 fogged frames (05, 13, 18, 26, 29) carry a red X and are not focusable/clickable"
    - "Clicking (or Enter on) a pick/normal frame opens a lightbox; ←/→ and prev/next skip fogged frames; Esc/Close closes and focus returns to the clicked frame"
    - "In the Développement section each of the 5 picks goes from latent (grayscale/dark/sepia) to filter 'none' as it reaches viewport center; with reduced motion there is no filter at all"
    - "/lab never ships: .vercelignore lists app/lab, page is robots noindex/nofollow, sitemap unchanged"
    - "No horizontal page overflow on mobile (document.scrollWidth === innerWidth); only strips scroll internally"
  artifacts:
    - path: "public/images/panic-room/film/"
      provides: "22 JPEGs 04..29 (long edge 1600, q82, EXIF-stripped, landscape 3:2)"
    - path: "components/lab/frames.ts"
      provides: "FILM_FRAMES data (num, src, fogged, pick, caption)"
      exports: ["FILM_FRAMES", "FilmFrame"]
    - path: "components/lab/ContactSheet.tsx"
      provides: "Film-strip contact sheet with felt-tip marks, opens FilmLightbox"
    - path: "components/lab/FilmLightbox.tsx"
      provides: "Accessible modal lightbox (portal to body, #main inert, scroll lock)"
    - path: "components/lab/DevelopingPhoto.tsx"
      provides: "Scroll-driven filter develop effect"
    - path: "app/lab/page.tsx"
      provides: "Lab page, metadata title 'Lab', robots noindex"
      contains: "index: false"
    - path: "app/lab/layout.tsx"
      provides: "Scopes lazyDog font variable to /lab"
      contains: "lazyDog.variable"
  key_links:
    - from: "components/lab/ContactSheet.tsx"
      to: "components/lab/FilmLightbox.tsx"
      via: "openIndex state -> <FilmLightbox frames index onChange onClose>"
      pattern: "FilmLightbox"
    - from: "components/lab/FilmLightbox.tsx"
      to: "document.body"
      via: "createPortal (MUST be outside #main because #main becomes inert)"
      pattern: "createPortal"
    - from: "components/lab/DevelopingPhoto.tsx"
      to: "motion/react useScroll/useTransform"
      via: "scrollYProgress -> filter string on wrapper div"
      pattern: "useTransform"
    - from: ".vercelignore"
      to: "app/lab"
      via: "Experimental routes block"
      pattern: "^app/lab$"
---

<objective>
Build a local-only test page `/lab` presenting two ideas for the Panic Room film roll:
(A) a realistic contact sheet (planche contact) — film strips, sprocket holes, edge markings, frame numbers, red felt-tip marks on the best frames, click-to-enlarge lightbox;
(B) "Développement" — the 5 picks shown large, developing from latent image to true colors as they scroll in.

Purpose: let the crew pick which idea to bring to the real site. Output: route `app/lab`, 4 small modules under `components/lab/`, 22 optimized frames. NOT deployed.
</objective>

<execution_context>
@$HOME/.claude/get-shit-done/workflows/execute-plan.md
@$HOME/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/STATE.md
@/Users/myltonvanbolderen/CLAUDE.md
@app/v2/layout.tsx
@lib/fonts.ts
@app/globals.css
@.vercelignore
@app/carousel/page.tsx
@components/magazine/SectionHeader.tsx
@components/layout/Header.tsx

<hard_rules>
- Dev server on :3000 runs in the user's terminal: NEVER kill/restart it. NO `npm install`.
- next/image with `fill` + a `sizes` prop always (custom WebP loader: lib/image-loader.ts maps /images/**.jpg -> /images/_w/{640|1080|1280|1920}/**.webp). Parent of a `fill` image must be `relative` with explicit aspect.
- NO grain overlay, NO shimmer, NO opacity animation or dark overlay div on/over photos, NO animation targeting img[loading=lazy]. The develop effect animates ONLY `filter` on a wrapper div.
- `motion` from 'motion/react'; honor `useReducedMotion()`.
- Small red text = `text-terracotta-light`; grey small text >= `text-blanc/55`. Brand red for marks = #CC2936 (`terracotta`).
- No real film brand names/logos anywhere (no Kodak/Fuji/Ilford).
- Commits: stage exact paths only; NEVER stage public/asset, public/images/_w, .claude. Each commit message ends with `Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>`. No deploy.
</hard_rules>

<interfaces>
Existing, use as-is:

lib/fonts.ts: `export const lazyDog = localFont({ ..., variable: '--font-lazy-dog' })`
app/v2/layout.tsx pattern:
```tsx
import { petitCochon, lazyDog } from '@/lib/fonts'
export default function V2Layout({ children }: { children: React.ReactNode }) {
  return <div className={`${petitCochon.variable} ${lazyDog.variable}`}>{children}</div>
}
```
globals.css: `@theme inline { --font-dog: var(--font-lazy-dog); }` -> utility `font-dog` works only inside the wrapper div. Tokens: noir #0A0A0A, blanc #F5F0E8, terracotta #CC2936, terracotta-light #E0525E, fonts `font-display` (Playfair), `font-condensed` (Bebas), `font-body` (DM Sans).

components/magazine/SectionHeader.tsx: `SectionHeader({ kicker, title, meta?, folio?, aside?, className?, titleClassName? })` — renders kicker span + h2 + optional meta.

app/layout.tsx: page content lives inside `<div id="main">`; Header is outside it (fixed, z-50). Header.tsx inert pattern:
```ts
const main = document.getElementById('main'); if (main) main.inert = open
// Esc listener on document; focus first element in rAF; restore focus to trigger on close
```

Carousel metadata pattern:
```ts
export const metadata: Metadata = { title: 'Carousel · Instagram Export', robots: { index: false, follow: false } }
```
(root layout has a title template "%s | Small Records" -> just use title: 'Lab')

Source scans (verified during planning): all 23 files are 3090x2048 landscape (ratio 1.509 ≈ 3:2), EXIF orientation 1 — no portrait handling needed. Frame 10 exists in BOTH folders; use the root-folder copy.
</interfaces>

<contracts>
components/lab/frames.ts (create first, everything else builds on it):
```ts
export interface FilmFrame {
  num: string          // '04' .. '29'
  src: string          // `/images/panic-room/film/${num}.jpg`
  fogged: boolean      // 05 13 18 26 29
  pick: boolean        // 08 10 14 16 25
  caption: string      // pick captions below, others `Frame ${num}`, fogged 'Fogged frame'
}
export const FILM_FRAMES: FilmFrame[]  // ordered 04 05 07 08 09 10 12 13 14 15 16 17 18 19 22 23 24 25 26 27 28 29 (22 items)
export const FILM_PICKS: FilmFrame[]   // FILM_FRAMES.filter(f => f.pick)
```
Captions: 08 "The crowd, early", 10 "Casæ & Letché at the decks", 14 "Letché & Casæ", 16 "Faces in the crowd", 25 "The crew".

FilmLightbox props:
```ts
{ frames: FilmFrame[]; index: number | null; onIndexChange: (i: number) => void; onClose: () => void }
```
</contracts>
</context>

<tasks>

<task type="auto">
  <name>Task 1: Prepare film frames + frame data + /lab route shell (local-only)</name>
  <files>public/images/panic-room/film/*.jpg, public/asset/panic-room/film/*.jpg, components/lab/frames.ts, app/lab/layout.tsx, app/lab/page.tsx, .vercelignore</files>
  <action>
1. Media (Python/Pillow 12 is installed). Quote paths — the second folder is `"/Users/myltonvanbolderen/Downloads/PANIC ROOM/photo pour carrouselle /"` (trailing space). For each frame NN in 04 05 07 08 09 10 12 13 14 15 16 17 18 19 22 23 24 25 26 27 28 29: source = `.../PANIC ROOM/000016240NN.jpg` if it exists, else the carrouselle folder (08, 09, 14). Copy the original to `public/asset/panic-room/film/NN.jpg` (gitignored). Write `public/images/panic-room/film/NN.jpg`: `ImageOps.exif_transpose`, convert RGB, `thumbnail((1600,1600), LANCZOS)`, save JPEG quality=82, optimize=True, progressive=True, no EXIF. Print each output size and assert width>height and 1.45 < w/h < 1.56 (all are 3:2 landscape — if any fails, stop and report). Then run `npm run images` to generate WebP variants (public/images/_w, gitignored).
   Quick visual sanity: build a montage of the 22 outputs into the scratchpad (`/private/tmp/claude-501/-Users-myltonvanbolderen-small-record/54b5f0cd-5a66-4186-b337-6738006c59de/scratchpad/lab/montage.jpg`) with Pillow and look at it with Read to confirm 05/13/18/26/29 are the grey fogged frames and the picks match the captions. Do NOT rotate sideways subjects — a real contact sheet shows frames as shot.

2. `components/lab/frames.ts` exactly per `<contracts>` (no 'use client' needed — plain data module).

3. `app/lab/layout.tsx`: copy the v2 pattern but only `lazyDog.variable` (wrapper div `className={lazyDog.variable}`), so `font-dog` resolves inside /lab only.

4. `app/lab/page.tsx` (server component): `export const metadata: Metadata = { title: 'Lab', robots: { index: false, follow: false } }`. Layout: `<div className="mx-auto max-w-7xl px-4 pt-28 pb-32 md:px-8">`; header block: kicker span "Lab · test" (`font-condensed text-[0.6rem] uppercase tracking-[0.5em] text-terracotta-light`), `<h1 className="mt-2 font-display text-[clamp(2.4rem,7vw,5.5rem)] font-bold leading-[0.95]">Fin de pellicule</h1>`, meta p "Small Party @ Panic Room · 11.09.26 · 22 frames" (`text-blanc/55`), note p "Two ideas for the site — pick what you like." (`text-blanc/55 text-sm`). Then two `<section>`s with `SectionHeader` (h2): A id="contact-sheet" kicker "Idea 05" title "Planche contact" meta "Tap a frame to enlarge. Picks circled in red."; B id="develop" kicker "Idea 06" title "Développement" meta "The picks, developing as you scroll." Leave the section bodies empty for now; Tasks 2 and 3 wire their components in.
   NOT in sitemap (do not touch app/sitemap.ts).

5. `.vercelignore`: add a line `app/lab` in the "Experimental / internal routes" block (after `app/carousel`).

Commit: `feat(lab): film roll frames + local-only /lab route shell` staging exactly `public/images/panic-room/film/ components/lab/frames.ts app/lab/layout.tsx app/lab/page.tsx .vercelignore`.
  </action>
  <verify>
    <automated>cd /Users/myltonvanbolderen/small-record && ls public/images/panic-room/film/*.jpg | wc -l | grep -q 22 && ls public/images/_w/640/panic-room/film/*.webp | wc -l | grep -q 22 && grep -qx 'app/lab' .vercelignore && ! grep -q lab app/sitemap.ts && git diff --quiet HEAD -- app/sitemap.ts && npx tsc --noEmit && echo OK</automated>
  </verify>
  <done>22 optimized landscape JPEGs committed (originals in public/asset, WebP variants generated, neither committed); frames.ts exports FILM_FRAMES (22) and FILM_PICKS (5); /lab renders header with noindex metadata; .vercelignore excludes app/lab; tsc clean.</done>
</task>

<task type="auto">
  <name>Task 2: ContactSheet (film strips + felt-tip marks) and accessible FilmLightbox</name>
  <files>components/lab/ContactSheet.tsx, components/lab/FilmLightbox.tsx, app/lab/page.tsx</files>
  <action>
**ContactSheet.tsx** ('use client'): props `{ frames: FilmFrame[] }`. State `openIndex: number | null` (index into `frames`). Keep a `Map<number, HTMLButtonElement>` ref of frame buttons for focus return.

Strips: chunk `frames` into strips of 6 at lg+ and 4 below lg (each frame button rendered exactly once — never duplicate markup hidden by CSS). Get the chunk size from a small hook `useChunkSize()` built on `useSyncExternalStore` + `matchMedia('(min-width:1024px)')` (server snapshot 6). Each strip = `<div data-strip>`:
- Mobile (<md): strip is `overflow-x-auto snap-x snap-mandatory overscroll-x-contain` with frames `w-[70vw] shrink-0 snap-center`; md+: `grid grid-cols-4 lg:grid-cols-6`, no scroll. The strip container sits inside the page's padded column (`-mx-4 md:mx-0` allowed only if it doesn't widen the document — the scroll must stay inside the strip; the page must keep `document.scrollWidth === innerWidth`). Strips stacked with `space-y-6`, slight alternating tilt is NOT needed.
- Film base: `bg-[#141210]`, padding `px-2 py-7` (room for sprockets + markings), subtle 1px `ring-1 ring-black/60` edge.
- Sprocket holes: two absolutely-positioned bands (top and bottom, `h-[10px]`, inset-x-0, top-2 / bottom-2, pointer-events-none, aria-hidden) using an inline SVG data-URI pattern for crisp rounded rects: `backgroundImage: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='10'%3E%3Crect x='4' y='1' width='8' height='8' rx='1.5' fill='%23d9d2c3'/%3E%3C/svg%3E")`, `backgroundRepeat: 'repeat-x'`, `backgroundSize: '16px 10px'`. On mobile the band must span the full scroll width (put the bands inside the scrolling inner track, which is `relative w-max` on mobile / `w-full` on md+).
- Edge markings: a line just inside the top band, `font-mono text-[9px] uppercase tracking-[0.25em] text-[#E8A33D]` with `aria-hidden`, repeating "SMALL 400 · PANIC ROOM 11.09.26 ·" (repeat string 4× and `whitespace-nowrap overflow-hidden`). Under each frame, a per-frame marking "NN ▸ NNA" (e.g. "10 ▸ 10A") in the same mono orange, aria-hidden. No brand names.
- Frame cell: `relative aspect-[3/2]` with a thin negative edge (`ring-1 ring-inset ring-[#2a2622]` + `p-[3px] bg-[#0e0c0b]`), inner `relative h-full w-full overflow-hidden` holding `<Image src fill sizes="(min-width:1024px) 15vw, (min-width:768px) 22vw, 70vw" className="object-cover" alt=... />`. No opacity/transition on the image.
- Clickable frames (not fogged) = `<button type="button" data-frame={num} data-pick={pick||undefined} aria-label={`Open frame ${num} — ${caption}`} onClick={() => setOpenIndex(i)} className="... cursor-zoom-in focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blanc">`; image alt = caption. Hover: a 1px blanc/40 ring only (no image effect).
- Fogged frames = `<div data-frame={num} data-fogged aria-hidden="true">` (no tabindex, no handler), image alt="" — the grey scan itself is the fog look, no extra overlay.
- Felt-tip circle (picks), component `FeltCircle({ seed })`: absolutely positioned SVG `pointer-events-none absolute -inset-[8%] z-10 overflow-visible` with `aria-hidden`, viewBox 0 0 120 80, `preserveAspectRatio="none"`, a single hand-drawn irregular ellipse path that overshoots/doesn't close perfectly, e.g. `M18 44 C 14 20, 52 6, 84 10 C 110 14, 116 36, 108 54 C 98 72, 56 78, 30 70 C 14 64, 10 50, 22 38 L 26 34` (an open overlapping stroke), `fill="none" stroke="#CC2936" strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke"`; rotation varies per frame: `style={{ transform: `rotate(${ROT[seed % ROT.length]}deg)` }}` with `ROT = [-6, 4, -2, 7, -4]`. Add `data-mark="pick"` on the SVG. Next to it a small handwritten mark in `font-dog text-terracotta text-2xl` ("★" or "!" alternating by seed) positioned `absolute -top-3 -right-2 z-10 rotate-12 pointer-events-none`, aria-hidden. Frame cell must NOT clip these marks (overflow-hidden only on the inner image wrapper).
- Felt-tip X (fogged), `FeltCross`: same SVG setup, two slightly curved strokes corner to corner (`M12 10 C 40 30, 80 52, 110 72` and `M108 8 C 80 30, 42 50, 14 74`), same stroke style, `data-mark="fogged"`.
- Render `<FilmLightbox frames={frames} index={openIndex} onIndexChange={setOpenIndex} onClose={close} />` where `close` sets null and then (in an effect when openIndex goes from number to null) focuses `buttons.get(lastIndex)`.

**FilmLightbox.tsx** ('use client'): returns null when `index === null`; otherwise `createPortal(..., document.body)` — REQUIRED because #main gets `inert` and the page (and this component) lives inside #main. Guard SSR with a mounted flag (useSyncExternalStore or useEffect-set state) before portaling.
- Container: `<div role="dialog" aria-modal="true" aria-label={`Frame ${f.num} — ${f.caption}`} className="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-noir/95 px-4 py-6">` (backdrop is a modal backdrop, not an overlay on a photo — OK). Clicking the backdrop (target === currentTarget) closes.
- Image: `<div className="relative h-[min(90vh,calc(100vw*2/3))] w-full max-w-[min(92vw,135vh)]"><Image src fill sizes="100vw" className="object-contain" alt={f.caption} /></div>`; caption below: `<p className="font-display text-lg">{caption}</p>` + `<p className="font-condensed text-[0.6rem] uppercase tracking-[0.3em] text-blanc/55">Frame {num} / picks marked in red</p>` (if the frame is a pick, prefix a small red "● Pick" in `text-terracotta-light`).
- Buttons (`type="button"`, visible focus rings): Close (top-right, `aria-label="Close"`, text "Close"), Prev (`aria-label="Previous frame"`), Next (`aria-label="Next frame"`); add `data-lb="prev|next|close"`. Navigation skips fogged: helper `step(from, dir)` walks `frames` with wrap-around until `!fogged`.
- Effects while open: `main.inert = true`; `document.body.style.overflow = 'hidden'` (restore previous value on cleanup); keydown on document: Escape -> onClose, ArrowLeft/ArrowRight -> onIndexChange(step(...)); focus the Close button in rAF on open. Simple focus trap: on Tab keydown, cycle among the 3 buttons (query `[data-lb]`). Cleanup resets inert=false.
- Motion: optional fade of the backdrop with `motion.div` initial opacity 0 → 1 (backdrop only, never the img) and skip when `useReducedMotion()`; keep it or omit — no AnimatePresence complexity needed.

Wire into app/lab/page.tsx Section A: `<ContactSheet frames={FILM_FRAMES} />`.

Commit: `feat(lab): film contact sheet with felt-tip picks and lightbox` staging exactly the 3 files.
  </action>
  <verify>
    <automated>cd /Users/myltonvanbolderen/small-record && npx tsc --noEmit && npm run lint && curl -sf http://localhost:3000/lab/ | grep -c 'data-frame=' </automated>
  </verify>
  <done>Contact sheet renders 22 frames in strips (6/4/mobile-scroll), 5 picks circled, 5 fogged crossed and not focusable; lightbox portals to body, opens on click/Enter, prev/next and ←/→ skip fogged, Esc/Close/backdrop close, focus returns to the originating frame; tsc + lint 0 errors.</done>
</task>

<task type="auto">
  <name>Task 3: DevelopingPhoto section + full Playwright verification</name>
  <files>components/lab/DevelopingPhoto.tsx, app/lab/page.tsx</files>
  <action>
**DevelopingPhoto.tsx** ('use client'): props `{ frame: FilmFrame }`.
```tsx
const ref = useRef<HTMLDivElement>(null)
const reduce = useReducedMotion()
const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'center center'] })
const filter = useTransform(scrollYProgress, (p) => {
  if (p >= 0.999) return 'none'
  const q = Math.max(0, p)
  return `grayscale(${(1 - q).toFixed(3)}) brightness(${(0.3 + 0.7 * q).toFixed(3)}) contrast(${(1.15 - 0.15 * q).toFixed(3)}) sepia(${(0.35 * (1 - q)).toFixed(3)})`
})
```
Markup: `<figure className="mx-auto w-full max-w-4xl">` → `<motion.div ref={ref} data-develop={frame.num} className="relative aspect-[3/2] w-full overflow-hidden bg-[#141210]" style={reduce ? undefined : { filter }}>` → `<Image src={frame.src} fill sizes="(min-width:1024px) 896px, 100vw" className="object-cover" alt={frame.caption} />`. Only `filter` is animated, on the wrapper; no opacity, no overlay div, nothing targeting the img. Under reduced motion no `filter` style at all (computed 'none'). `figcaption` below: `<span className="text-terracotta-light">Frame {num}</span> — {caption}` in `mt-3 font-condensed text-[0.7rem] uppercase tracking-[0.3em] text-blanc/55`. Optional subtle readout "développement NN%" via a `useTransform` → `useMotionValueEvent` is NOT required; skip it (keep it clean).

Wire into app/lab/page.tsx Section B: `<div className="space-y-[30vh] md:space-y-[35vh]">{FILM_PICKS.map(f => <DevelopingPhoto key={f.num} frame={f} />)}</div>`, and end the page with enough bottom padding (`pb-[50vh]` on section B) so the LAST pick can reach viewport center (progress 1 → 'none').

**Verification** (script in scratchpad, NOT committed): write `/private/tmp/claude-501/-Users-myltonvanbolderen-small-record/54b5f0cd-5a66-4186-b337-6738006c59de/scratchpad/lab/verify.mjs` loading Playwright via `createRequire('/Users/myltonvanbolderen/Downloads/PANIC ROOM/_kit/node_modules/')('playwright')` (chromium already installed). Uses the running dev server at http://localhost:3000/lab/ (never start/kill it). Output dir `.../scratchpad/lab/`. Two contexts: desktop 1440×900 and `devices['iPhone 13']`. For each:
1. goto, wait networkidle; screenshot `{vp}-sheet-top.png`; scroll the strip containing frame 10 into view → `{vp}-sheet-picks.png`.
2. Assert `[data-frame]` count === 22; `[data-mark="pick"]` count === 5 and each is inside a `[data-pick]` button for 08/10/14/16/25; `[data-fogged]` count === 5, none is a button, none has tabindex, none contains focusable elements; `[data-mark="fogged"]` === 5.
3. Lightbox: click frame 04 → `[role=dialog]` visible, screenshot `{vp}-lightbox.png`; press ArrowRight → label contains "07" (05 skipped); from frame 12 ArrowRight → 14 (13 skipped); ArrowLeft back → 12; click `[data-lb=next]` works; press Escape → dialog gone and `document.activeElement` is the `[data-frame="04"]` button (open from 04 again for this check if index moved; focus returns to the originally clicked frame). Also check `#main` has `inert` while open and not after close, and body overflow restored.
4. Develop: for the first `[data-develop]`, scroll so its top is at viewport bottom − 10px (entering) → getComputedStyle(el).filter contains 'grayscale' → screenshot `{vp}-develop-entering.png`; scroll to halfway → screenshot `{vp}-develop-half.png`; scroll its center to viewport center (el.scrollIntoView({block:'center'}) + 2 rAF waits + 300ms) → filter === 'none' → `{vp}-develop-centered.png`. Repeat the centered check for the last `[data-develop]` (25).
5. Scroll whole page in steps to trigger lazy loading, then assert every `img` has `complete && naturalWidth > 0` (no broken images); assert `document.documentElement.scrollWidth === window.innerWidth`.
Third context `reducedMotion: 'reduce'` (desktop): every `[data-develop]` computed filter === 'none' even when just entering.
Print a PASS/FAIL table; fix and re-run until all PASS. Look at the screenshots (Read) to confirm the strip look (crisp sprockets, orange markings, irregular red circles overshooting the frame edges, red X on fogged, mobile strips scroll inside themselves).

Final checks: `npx tsc --noEmit`, `npm run lint` (0 errors), `grep -x app/lab .vercelignore`, `git diff HEAD~3 -- app/sitemap.ts` empty.

Commit: `feat(lab): developing-photo section for film picks` staging exactly `components/lab/DevelopingPhoto.tsx app/lab/page.tsx` (plus any Task 2 files fixed during verification, listed explicitly). Never stage public/asset, public/images/_w, .claude, scratchpad.
  </action>
  <verify>
    <automated>cd /Users/myltonvanbolderen/small-record && npx tsc --noEmit && npm run lint && node /private/tmp/claude-501/-Users-myltonvanbolderen-small-record/54b5f0cd-5a66-4186-b337-6738006c59de/scratchpad/lab/verify.mjs</automated>
  </verify>
  <done>All Playwright assertions PASS on desktop, iPhone 13 and reduced-motion; screenshots (sheet top, picks strip, lightbox, develop entering/half/centered × 2 viewports) saved in scratchpad/lab/; filter is exactly 'none' when centered and under reduced motion; no broken images; no horizontal page overflow; tsc + lint clean; 3 atomic commits.</done>
</task>

</tasks>

<threat_model>
## Trust Boundaries

| Boundary | Description |
|----------|-------------|
| local dev → production deploy | /lab is an unfinished internal page and must not reach small-records.com |
| repo → public | original full-res scans must not be committed |

## STRIDE Threat Register

| Threat ID | Category | Component | Disposition | Mitigation Plan |
|-----------|----------|-----------|-------------|-----------------|
| T-naw-01 | I (disclosure) | app/lab route | mitigate | `app/lab` added to .vercelignore; robots noindex/nofollow metadata; not added to app/sitemap.ts (verified by grep/diff) |
| T-naw-02 | I (disclosure) | film scan originals / EXIF | mitigate | originals only in gitignored public/asset; committed JPEGs re-saved by Pillow without EXIF metadata |
| T-naw-03 | D (usability) | lightbox focus/inert | mitigate | portal outside #main, inert + scroll lock reset in effect cleanup so the page can't stay locked |
| T-naw-04 | T | static content | accept | no user input, no network calls, static data only |
</threat_model>

<verification>
- `npx tsc --noEmit` and `npm run lint`: 0 errors.
- Playwright verify.mjs: all PASS (22 frames, 5 picks marked, 5 fogged non-focusable, lightbox open/skip-fogged nav/Esc/focus return, develop filter grayscale→'none', reduced motion 'none', no broken images, no horizontal overflow) at 1440×900 and iPhone 13.
- `.vercelignore` contains `app/lab`; app/sitemap.ts unchanged.
- git log shows 3 commits, none touching public/asset, public/images/_w or .claude.
</verification>

<success_criteria>
The crew can open http://localhost:3000/lab/ and compare a convincing film contact sheet (with red felt-tip picks and a working lightbox) against a clean scroll-develop presentation of the 5 picks — on desktop and phone — with zero risk of it shipping to prod.
</success_criteria>

<output>
After completion, create `.planning/quick/260922-naw-lab-test-page-film-contact-sheet-and-dev/260922-naw-SUMMARY.md`
</output>
