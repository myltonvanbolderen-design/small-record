---
phase: quick-260921-odr
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - public/videos/casae-sornettes.mp4
  - public/videos/letche-sornettes.mp4
  - public/videos/gambetta-casae.mp4
  - public/videos/gambetta-duo.mp4
  - public/videos/gambetta-silhouette.mp4
  - public/videos/panic-casae.mp4
  - public/videos/panic-lessovik.mp4
  - public/videos/panic-letche.mp4
  - public/videos/panic-momal.mp4
  - components/magazine/VideoLoop.tsx
  - components/magazine/YouTubeEmbed.tsx
  - components/magazine/SoundCloudEmbed.tsx
  - components/animation/PageTransition.tsx
  - app/globals.css
  - app/layout.tsx
  - app/v2/layout.tsx
  - package.json
  - package-lock.json
autonomous: true
requirements: [PHASE4-SC1, PHASE4-SC2, PHASE4-SC3, PHASE4-SC4]

must_haves:
  truths:
    - "Loading /events downloads no video that is off-screen; videos fetch only when within ~200px of the viewport and pause when they leave"
    - "All 9 files in public/videos are H.264 (yuv420p), width 576, portrait, no audio stream, faststart; Sornettes clips are upright"
    - "package.json pins next 15.5.25 and `npm audit --omit=dev` reports no critical advisory"
    - "YouTube and SoundCloud iframes carry loading=\"lazy\" and a descriptive title"
    - "Server HTML of every page has no inline opacity:0 on the page wrapper; entrance is a CSS animation disabled under prefers-reduced-motion"
    - "Root layout no longer applies petit-cochon / lazy-dog variables; /v2 still renders with them"
  artifacts:
    - path: "components/magazine/VideoLoop.tsx"
      provides: "Viewport-gated looping video (same props: src, poster, className)"
      contains: "IntersectionObserver"
    - path: "components/animation/PageTransition.tsx"
      provides: "Server-compatible CSS entrance wrapper"
      contains: "page-enter"
    - path: "app/v2/layout.tsx"
      provides: "Scoped v2 font variables"
      contains: "petitCochon.variable"
  key_links:
    - from: "components/animation/PageTransition.tsx"
      to: "app/globals.css"
      via: ".page-enter class + @keyframes page-enter"
      pattern: "page-enter"
    - from: "app/globals.css @theme"
      to: "app/v2/layout.tsx wrapper variables"
      via: "@theme inline for --font-pig/--font-dog so the var resolves at the element, not :root"
      pattern: "@theme inline"
---

<objective>
Audit lot A (roadmap Phase 4): make /events light on mobile 4G and remove known Next.js vulnerabilities.

Purpose: /events currently pulls 18 MB of video in the first 4 s (LCP 37 s on throttled 4G); next@15.5.14 has 1 critical + 3 high advisories; every page ships `opacity:0` until JS hydrates.
Output: re-encoded videos, viewport-gated VideoLoop, lazy iframes, CSS page entrance, v2-scoped fonts, next@15.5.25.
</objective>

<execution_context>
@$HOME/.claude/get-shit-done/workflows/execute-plan.md
@$HOME/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/STATE.md
@.planning/ROADMAP.md
@/Users/myltonvanbolderen/CLAUDE.md

Project root: /Users/myltonvanbolderen/small-record (use absolute paths).

HARD CONSTRAINTS
- The user's dev server is running on port 3000 (`next dev --turbopack`). NEVER kill it. Do all curl verification against it BEFORE Task 3's `npm install` and `next build` (both can disturb the running dev server). Tell the orchestrator at the end that the dev server should be restarted.
- Respect CLAUDE.md: no overlays, no grain, no shimmer on lazy images, AnimatedSection only on text.
- Stage exact paths only. NEVER stage public/asset/ or .claude/. One atomic commit per task; every message ends with:
  `Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>`
- No deploy.
- public/asset/ is in .gitignore (line 7) and .vercelignore (line 12) — safe for backups.

<interfaces>
Current components (keep props/exports identical so callers need no change):

components/magazine/VideoLoop.tsx ('use client'):
  interface VideoLoopProps { src: string; poster?: string; className?: string }
  export function VideoLoop(...)  // default className 'h-full w-full object-cover'
  Used 9x in app/events/page.tsx (lines ~104,134,234,255,276,421,433,445,457).

components/magazine/YouTubeEmbed.tsx: interface { videoId: string } — used in app/page.tsx:257, app/v2/page.tsx:553 (and /small-record, /events). Current title="YouTube Video".
components/magazine/SoundCloudEmbed.tsx: interface { url: string; height?: number = 166 } — used in app/casae, app/letche (height={300}). Current title="SoundCloud Player".

components/animation/PageTransition.tsx ('use client', motion.div initial {opacity:0,y:20} animate {opacity:1,y:0} duration 0.5 ease [0.25,0.1,0.25,1]).
  export function PageTransition({ children }: { children: React.ReactNode })
  Used by app/page.tsx, casae, letche, small-record, events, v2.

lib/fonts.ts exports: playfair, bebas, dmSans, petitCochon (--font-petit-cochon), lazyDog (--font-lazy-dog).
app/layout.tsx <html className={`${playfair.variable} ${bebas.variable} ${dmSans.variable} ${petitCochon.variable} ${lazyDog.variable}`}>
app/globals.css @theme (lines 3-26) contains:
  --font-pig: var(--font-petit-cochon);
  --font-dog: var(--font-lazy-dog);
app/globals.css ~line 80: existing global `@media (prefers-reduced-motion: reduce)` block.
app/v2/ currently has only page.tsx (no layout.tsx).
</interfaces>
</context>

<tasks>

<task type="auto">
  <name>Task 1: Re-encode all 9 looping videos in place (H.264, 576w, no audio, faststart)</name>
  <files>public/videos/casae-sornettes.mp4, public/videos/letche-sornettes.mp4, public/videos/gambetta-casae.mp4, public/videos/gambetta-duo.mp4, public/videos/gambetta-silhouette.mp4, public/videos/panic-casae.mp4, public/videos/panic-lessovik.mp4, public/videos/panic-letche.mp4, public/videos/panic-momal.mp4</files>
  <action>
1. Backup: `mkdir -p public/asset/videos-backup && cp -n public/videos/*.mp4 public/asset/videos-backup/` (public/asset is gitignored + vercelignored). Record `ls -l` sizes before.
2. For each of the 9 files, encode from the BACKUP copy into a temp file in the scratchpad (/private/tmp/claude-501/-Users-myltonvanbolderen-small-record/54b5f0cd-5a66-4186-b337-6738006c59de/scratchpad/enc/), then move over the original (same filename → no code references change):
   `ffmpeg -y -i public/asset/videos-backup/NAME.mp4 -vf "scale=576:-2" -c:v libx264 -profile:v high -pix_fmt yuv420p -crf 26 -preset slow -an -movflags +faststart OUT.mp4`
   - Sornettes files are HEVC 1920x1080 with a -90° rotation tag: ffmpeg autorotates by default, so the scale filter receives the portrait frame and outputs 576x1024. Do NOT add transpose, do NOT pass -noautorotate.
   - Posters (public/images/fete-musique/casae.jpg, letche.jpg and others) are left untouched.
3. Verify every output: `ffprobe -v error -show_entries stream=codec_type,codec_name,width,height,pix_fmt:stream_side_data=rotation -of compact public/videos/NAME.mp4` → exactly one stream, video, h264, yuv420p, width 576, height > width, no rotation side data, no audio stream. Check faststart: moov before mdat (e.g. `ffprobe -v trace NAME.mp4 2>&1 | grep -m2 -E "type:'(moov|mdat)'"` shows moov first).
4. Eyeball orientation: extract one frame of casae-sornettes.mp4 (`ffmpeg -ss 1 -i ... -frames:v 1 scratchpad/check.jpg`) and view it with the Read tool — the person must be upright. If sideways, re-encode Sornettes with the rotation fix and re-check.
5. Report before/after sizes (expected: Sornettes ~5 MB → <0.5 MB each; gambetta-casae ~7.8 → ~4.2 MB; panic-casae ~2.2 → ~1 MB). If any output is LARGER than its original, keep the original only if it is already H.264 ≤576 wide with no audio; otherwise keep the re-encode.
6. Commit: `git add public/videos/*.mp4` (exact 9 paths) → `perf(videos): re-encode loops to H.264 576w, no audio, faststart`.
  </action>
  <verify>
    <automated>cd /Users/myltonvanbolderen/small-record && for f in public/videos/*.mp4; do echo "$f $(ffprobe -v error -show_entries stream=codec_type,codec_name,width,height -of csv=p=0 "$f" | tr '\n' ' ')"; done && du -ch public/videos/*.mp4 | tail -1</automated>
  </verify>
  <done>Each file prints a single `h264,video,576,<h>` line with h > 576 and no audio line; total public/videos markedly below the original ~35 MB; Sornettes frame visually upright; originals backed up in public/asset/videos-backup/; commit created with only public/videos paths.</done>
</task>

<task type="auto">
  <name>Task 2: Viewport-gated VideoLoop, lazy titled iframes, CSS-only PageTransition</name>
  <files>components/magazine/VideoLoop.tsx, components/magazine/YouTubeEmbed.tsx, components/magazine/SoundCloudEmbed.tsx, components/animation/PageTransition.tsx, app/globals.css</files>
  <action>
A. components/magazine/VideoLoop.tsx (keep 'use client', same props and default className, no motion):
   - Render `<video ref muted loop playsInline preload="none" poster={poster} aria-hidden="true" className=...>` with NO src, NO <source>, NO autoPlay.
   - useEffect: grab the element; if `typeof IntersectionObserver === 'undefined'` → set `video.src = src` and attempt play. Otherwise create `new IntersectionObserver(cb, { rootMargin: '200px 0px' })`. In cb: when `entry.isIntersecting` → if not yet loaded (`!video.getAttribute('src')`), set `video.src = src` (this is the "attach on first approach"), then `video.play().catch(() => {})`; when not intersecting → `video.pause()`. Disconnect observer on unmount. Include `src` in deps; muted must also be set as a property (`video.muted = true`) before play for iOS/React muted-attribute quirk.
   - Note: a 200px rootMargin means "intersecting" also fires slightly before visibility — that is acceptable (play just before it scrolls in).
B. components/magazine/YouTubeEmbed.tsx: add optional `title?: string` prop (default `'Small Records — YouTube mix'`), set `title={title}` and `loading="lazy"` on the iframe. Nothing else changes; callers keep working.
C. components/magazine/SoundCloudEmbed.tsx: add optional `title?: string` (default `'SoundCloud player'`), `loading="lazy"`. Keep url/height API.
D. components/animation/PageTransition.tsx: remove 'use client' and the motion import. `export function PageTransition({ children }: PageTransitionProps) { return <div className="page-enter">{children}</div> }`. Keep export name and props interface.
E. app/globals.css: add (outside @theme, near the existing reduced-motion block):
   ```css
   @keyframes page-enter {
     from { opacity: 0; transform: translateY(20px); }
     to { opacity: 1; transform: translateY(0); }
   }
   .page-enter {
     animation: page-enter 0.5s cubic-bezier(0.25, 0.1, 0.25, 1) both;
   }
   @media (prefers-reduced-motion: reduce) {
     .page-enter { animation: none; }
   }
   ```
   Caveat to be aware of: the final `transform: translateY(0)` from fill-mode both creates a containing block for `position: fixed` descendants. Check whether any page content inside PageTransition uses `fixed` (grep `fixed` in app/*/page.tsx and components used inside pages; Header/Footer/ScrollToTop live in layout.tsx OUTSIDE PageTransition so they're fine). If something fixed exists inside, use `to { opacity: 1; transform: none; }` instead of translateY(0) — `transform: none` avoids the containing block. Prefer `transform: none` in the `to` keyframe regardless.
F. Verify on the RUNNING dev server (do not restart it): `npx tsc --noEmit`, then curl http://localhost:3000/events/ (follow redirects with -L) and check:
   - `grep -c 'preload="none"'` = 9
   - `grep -io '<video[^>]*autoplay'` returns nothing
   - `grep -c 'opacity:0;transform:translateY(20px)'` = 0 and `class="page-enter"` present
   - curl / and /casae/: iframes contain `loading="lazy"`.
G. Commit exact 5 paths → `perf: lazy-load event videos and embeds, CSS page entrance (no JS-gated opacity)`.
  </action>
  <verify>
    <automated>cd /Users/myltonvanbolderen/small-record && npx tsc --noEmit && H=$(curl -sL http://localhost:3000/events/) && echo "preload-none: $(echo "$H" | grep -o 'preload="none"' | wc -l)" && echo "autoplay: $(echo "$H" | grep -io '<video[^>]*autoplay' | wc -l)" && echo "opacity0: $(echo "$H" | grep -o 'opacity:0;transform:translateY(20px)' | wc -l)" && echo "page-enter: $(echo "$H" | grep -o 'page-enter' | wc -l)" && echo "lazy iframes /: $(curl -sL http://localhost:3000/ | grep -o '<iframe[^>]*loading="lazy"' | wc -l)" && echo "lazy iframes /casae: $(curl -sL http://localhost:3000/casae/ | grep -o '<iframe[^>]*loading="lazy"' | wc -l)"</automated>
  </verify>
  <done>tsc clean; /events HTML: 9 preload="none", 0 autoplay, 0 inline opacity:0 wrapper, page-enter present; iframes on / and /casae lazy; VideoLoop/YouTubeEmbed/SoundCloudEmbed/PageTransition callers unchanged; commit created.</done>
</task>

<task type="auto">
  <name>Task 3: Scope v2 fonts to /v2, upgrade next to 15.5.25, final build</name>
  <files>app/layout.tsx, app/v2/layout.tsx, app/globals.css, package.json, package-lock.json</files>
  <action>
A. app/layout.tsx: remove `petitCochon, lazyDog` from the import and from the <html> className (keep playfair, bebas, dmSans).
B. Create app/v2/layout.tsx (server component):
   ```tsx
   import { petitCochon, lazyDog } from '@/lib/fonts'
   export default function V2Layout({ children }: { children: React.ReactNode }) {
     return <div className={`${petitCochon.variable} ${lazyDog.variable}`}>{children}</div>
   }
   ```
C. app/globals.css — REQUIRED companion fix: `--font-pig: var(--font-petit-cochon)` inside the regular `@theme` is emitted on :root, where --font-petit-cochon will no longer be defined → the custom property resolves invalid at :root and inherits invalid, so `font-pig`/`font-dog` would silently fall back. Move those two lines out of `@theme { ... }` into a separate `@theme inline { --font-pig: var(--font-petit-cochon); --font-dog: var(--font-lazy-dog); }` block so the utilities emit `font-family: var(--font-petit-cochon)` directly and resolve at the element inside the v2 wrapper. Leave the other font tokens as they are (their variables are on <html>, so they still work).
D. Verify fonts on the running dev server BEFORE upgrading next: curl http://localhost:3000/v2/ → contains `__variable` class wrapper div; curl / → the petit-cochon/lazy-dog font preload links (`.otf`/`.ttf` or their hashed woff names — compare against /v2) are absent from /. Also check the served CSS for `.font-pig` → `font-family: var(--font-petit-cochon)`.
E. Commit A–C (exact paths app/layout.tsx app/v2/layout.tsx app/globals.css) → `perf(fonts): load v2 doodle fonts only on /v2`.
F. Next upgrade: `npm install next@15.5.25 --save-exact` (package.json currently pins "next": "15.5.14" exact — keep exact). Do NOT add eslint-config-next. Then `npm audit --omit=dev` — capture output; require 0 critical (report any remaining high/moderate with package names).
G. Final `npx next build` (static export). NOTE: this writes .next and can break the running dev server's cache — that's accepted; report to the orchestrator that the user must restart `npx next dev --turbopack --port 3000`. Build must succeed including /v2 and /carousel routes.
H. Commit package.json + package-lock.json → `fix(deps): bump next to 15.5.25 (security advisories)`.
  </action>
  <verify>
    <automated>cd /Users/myltonvanbolderen/small-record && grep '"next"' package.json && npm audit --omit=dev; npx next build 2>&1 | tail -30 && ! grep -q "petitCochon" app/layout.tsx && grep -q "@theme inline" app/globals.css && echo OK</automated>
  </verify>
  <done>Root layout has no v2 fonts; /v2 wrapper applies them and font-pig/font-dog resolve (verified in CSS); next pinned 15.5.25; npm audit --omit=dev shows 0 critical; `next build` succeeds; two commits created (fonts, deps); orchestrator told to restart dev server.</done>
</task>

</tasks>

<threat_model>
## Trust Boundaries

| Boundary | Description |
|----------|-------------|
| npm registry → build | Third-party framework code executed at build and in the browser |
| third-party iframes (YouTube, SoundCloud) → page | Cross-origin embeds loaded into public pages |

## STRIDE Threat Register

| Threat ID | Category | Component | Disposition | Mitigation Plan |
|-----------|----------|-----------|-------------|-----------------|
| T-odr-01 | E/T | next@15.5.14 (1 critical, 3 high advisories) | mitigate | Pin next@15.5.25 exact, confirm with `npm audit --omit=dev` (Task 3) |
| T-odr-02 | D | /events video payload (18 MB on load) | mitigate | Re-encode (Task 1) + IntersectionObserver-gated src, preload="none" (Task 2) |
| T-odr-03 | I | Third-party iframes | accept | Static export, no user data or cookies of ours exposed; lazy loading reduces third-party loads further |
| T-odr-04 | T | Backups of original videos | accept | Kept in gitignored/vercelignored public/asset/videos-backup; never staged |
</threat_model>

<verification>
- ffprobe: 9 files h264 576w portrait, no audio, faststart
- /events server HTML: preload="none" x9, no autoplay, no inline opacity:0
- iframes lazy on / and /casae
- /v2 fonts still resolve; root pages no longer preload them
- next 15.5.25, npm audit 0 critical, `next build` passes
</verification>

<success_criteria>
Roadmap Phase 4 criteria 1–4 all met: no off-screen video downloaded on /events load; videos re-encoded (Sornettes H.264 no audio, others ≤720p); next@15.5.25 with no critical advisory; lazy iframes, v2 fonts out of root layout, pages visible without JS. Four atomic commits (videos, runtime components, fonts, deps).
</success_criteria>

<output>
After completion, create `.planning/quick/260921-odr-audit-lot-a-perf-and-security/260921-odr-SUMMARY.md`
</output>
