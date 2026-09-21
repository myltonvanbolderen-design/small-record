---
phase: quick-260921-rwt
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - tools/image-variants.mjs
  - lib/image-loader.ts
  - next.config.ts
  - package.json
  - .gitignore
  - .vercelignore
  - vercel.json
  - public/images/logo/logo-white-96.png
  - components/animation/ParallaxImage.tsx
  - components/magazine/FlipImage.tsx
  - components/magazine/PhotoSlider.tsx
  - components/magazine/VideoLoop.tsx
  - components/layout/Header.tsx
  - components/layout/Footer.tsx
  - app/page.tsx
  - app/small-record/page.tsx
  - app/events/page.tsx
  - app/casae/page.tsx
  - app/letche/page.tsx
  - app/not-found.tsx
autonomous: true
requirements: [AUDIT-E1]
must_haves:
  truths:
    - "Every next/image <Image> on the public pages renders a srcset of /images/_w/{640|1080|1920}/….webp and never the original JPEG"
    - "On iPhone 13, full scroll of /events/ and /small-record/ transfers < 2 MB of images (was 9.1 / 9.2 MB)"
    - "No broken images after full scroll on /, /small-record/, /events/ (img.complete && naturalWidth > 0)"
    - "Photo colors look the same as before (sRGB WebP), gnome logo still inverted white in the Header"
    - "Responses under /images, /videos, /og, /fonts carry Cache-Control: public, max-age=604800, stale-while-revalidate=2592000 once deployed (vercel.json)"
    - "next build runs prebuild, which generates the WebP variants (Vercel generates them itself; _w is not in git)"
  artifacts:
    - path: "tools/image-variants.mjs"
      provides: "sharp-based incremental WebP generator, 640/1080/1920"
    - path: "lib/image-loader.ts"
      provides: "custom next/image loader + webpVariant() helper"
      contains: "export default"
    - path: "vercel.json"
      provides: "long cache headers for static media"
      contains: "stale-while-revalidate=2592000"
    - path: "public/images/logo/logo-white-96.png"
      provides: "96x96 gnome with alpha for Header"
  key_links:
    - from: "next.config.ts"
      to: "lib/image-loader.ts"
      via: "images.loaderFile"
      pattern: "loaderFile: './lib/image-loader.ts'"
    - from: "package.json"
      to: "tools/image-variants.mjs"
      via: "prebuild script"
      pattern: "\"prebuild\": \"node tools/image-variants.mjs\""
    - from: "app/**/page.tsx + components"
      to: "loader"
      via: "<Image> without unoptimized prop, with sizes"
      pattern: "sizes="
---

<objective>
Audit lot E1 (roadmap Phase 8, part 1): serve responsive WebP variants for all next/image photos (static export + custom loader + build-time sharp generation), right-size the Header gnome, stop preloading the footer wordmark, and add long cache headers for static media via vercel.json.

Purpose: mobile full-scroll image weight goes from 5–9 MB per page to < 2 MB; repeat visits stop revalidating every image.
Output: variant generator, loader, config, vercel.json, updated pages/components. No deploy.
</objective>

<execution_context>
@$HOME/.claude/get-shit-done/workflows/execute-plan.md
@$HOME/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/STATE.md
@/Users/myltonvanbolderen/CLAUDE.md
@next.config.ts
@package.json

Hard constraints (CLAUDE.md):
- Gnome logo stays a NATIVE `<img>` with `style={{ filter: 'invert(1)' }}` (never Tailwind `invert`, never next/image).
- No overlays / grain / shimmer added. Keep existing gradients and opacity classes (e.g. `opacity-20`, `opacity-10`, `opacity-30` on background photos) exactly as they are.
- `public/asset/` never staged. `public/images/_w/` never committed (generated). `.claude/` never staged.
- Dev server on :3000 belongs to the user: never kill/restart it, never `npm install`.
- `.vercelignore` excludes `scripts` → generator MUST live in `tools/`.

Current state (verified):
- next.config.ts: `output: 'export'`, `trailingSlash: true`, `images: { unoptimized: true }`. next 15.5.25. sharp 0.34.5 in node_modules (next's optional dep).
- package.json scripts: `dev: next dev --turbopack`, `build: next build --turbopack`, `start`. No vercel.json exists. Vercel project uses default Next preset (`npm run build` → npm runs `prebuild` automatically).
- 55 JPEGs under public/images (casae, duo, early-reflection, fete-musique, letech, panic-room), PNG logos in public/images/logo (logo-white.png 400×400 gnome, logo-wordmark-white.png 512×512).
- Every `<Image>` below currently has `unoptimized` and no `sizes`:

<interfaces>
components/animation/ParallaxImage.tsx — props { src, alt, className?, speed?, priority? }; renders <Image fill className="object-cover" priority unoptimized> inside motion.div `absolute inset-[-15%]` (image box is 130% of the container). All call sites are full-bleed sections (app/page.tsx:99, :290; app/small-record/page.tsx:124, :334; app/letche/page.tsx:75, :138; app/casae/page.tsx:74; app/events/page.tsx:739).
components/magazine/FlipImage.tsx — props { images: string[], alt, interval?, className? }; renders one <Image fill unoptimized> per src, visibility toggling. Call sites: app/page.tsx:140 (full width, `px-5 md:px-8` section, aspect-16/9), app/small-record/page.tsx:220 (grid-cols-12, col-span-12 md:col-span-3).
components/magazine/PhotoSlider.tsx — slides `w-[75vw] md:w-[40vw]`, <Image fill unoptimized>. Used in app/casae/page.tsx:109.
components/magazine/VideoLoop.tsx — props { src, poster?, className }; renders <video preload="none" poster={poster}>. Posters are JPEGs under /images (events page, 7 call sites).
components/layout/Header.tsx:60 — <img src="/images/logo/logo-white.png" className="h-full w-full object-contain" style={{ filter: 'invert(1)' }}> inside h-8 w-8 md:h-10 md:w-10 link. Also has an `import Image from 'next/image'` at line 5 (check if unused → remove).
components/layout/Footer.tsx:12 — native <img src="/images/logo/logo-wordmark-white.png"> in w-36 div.
app/small-record/page.tsx:49 — cover wordmark native <img> (DO NOT make lazy; it is above the fold). :468 booking wordmark native <img> (below fold → may get loading="lazy").
</interfaces>

sizes table for direct <Image> usages (derive from grid classes; containers `max-w-6xl` = 1152px, section padding px-5/md:px-8):
| File:line | Slot | sizes |
|---|---|---|
| app/page.tsx:37 cover, :341 DNA bg | full-bleed absolute inset-0 | `100vw` |
| app/page.tsx:173 Casae card | grid-cols-1 / md:col-span-7 of 12 | `(min-width: 768px) 58vw, 100vw` |
| app/page.tsx:198 Letche card | md:col-span-5 | `(min-width: 768px) 42vw, 100vw` |
| app/page.tsx:243 trio hero | -mx-5 full on mobile, content width desktop | `(min-width: 1200px) 1152px, 100vw` |
| app/small-record/page.tsx:34 cover, :70 story bg | full-bleed | `100vw` |
| app/small-record/page.tsx:210 | md:col-span-5 | `(min-width: 768px) 42vw, 100vw` |
| app/small-record/page.tsx:229 | md:col-span-4 | `(min-width: 768px) 33vw, 100vw` |
| app/small-record/page.tsx:292 event teaser cards | check parent grid classes around line 270 (probably md:grid-cols-3 or 2) | derive, e.g. `(min-width: 768px) 33vw, 100vw` |
| app/small-record/page.tsx:412, :436 artist cards | grid-cols-1 md:grid-cols-2 (check container max-w) | `(min-width: 768px) 50vw, 100vw` |
| app/casae/page.tsx:32, app/letche/page.tsx:31, app/events/page.tsx:107, app/not-found.tsx:9 | full-bleed covers/bg | `100vw` |
| app/letche/page.tsx:113 | md:col-span-4 | `(min-width: 768px) 33vw, 100vw` |
| app/letche/page.tsx:124 | md:col-span-8 | `(min-width: 768px) 67vw, 100vw` |
| app/events/page.tsx:191 trio hero, :317 crowd closer, :477 packed-room | content-width max-w-6xl | `(min-width: 1200px) 1152px, 100vw` |
| app/events/page.tsx:260 casae-prime, :287 decks-blue | col-span-2 on mobile, 1 of 3 desktop | `(min-width: 1200px) 384px, (min-width: 768px) 33vw, 100vw` |
| app/events/page.tsx:269, :278, :296, :305 | 1 of 2 mobile, 1 of 3 desktop | `(min-width: 1200px) 384px, (min-width: 768px) 33vw, 50vw` |
| app/events/page.tsx:506, :527, :548 (Gambetta mixed gallery grid-cols-2 md:grid-cols-3) | 1 of 2 / 1 of 3 | `(min-width: 1200px) 384px, (min-width: 768px) 33vw, 50vw` |
| app/events/page.tsx:697 casae-live | order-first col-span-2 mobile, md:col-span-4 of 12 | `(min-width: 1200px) 384px, (min-width: 768px) 33vw, 100vw` |
Line numbers are pre-edit; re-grep if they shift.
</context>

<tasks>

<task type="auto">
  <name>Task 1: Variant pipeline — generator, loader, config, cache headers, small gnome</name>
  <files>tools/image-variants.mjs, lib/image-loader.ts, next.config.ts, package.json, .gitignore, .vercelignore, vercel.json, public/images/logo/logo-white-96.png</files>
  <action>
1. **tools/image-variants.mjs** (ESM, node ≥18, no new deps). `import sharp from 'sharp'` inside try/catch: if sharp cannot be loaded, print a clear error and `process.exit(1)` (fail the build loudly — shipping pages whose srcset points at missing files is worse). `const WIDTHS = [640, 1080, 1920]` with a comment "keep in sync with lib/image-loader.ts and next.config.ts deviceSizes". Root = `path.join(process.cwd(), 'public/images')`, out root = `public/images/_w`. Recursively walk root, SKIP the `_w` directory, collect files matching `/\.jpe?g$/i`. For each file and each width: out path = `_w/<width>/<relative path with extension replaced by .webp>`; mkdir -p; skip if out exists and `mtimeMs >= input mtimeMs` (incremental); else `sharp(input).rotate().resize({ width, withoutEnlargement: true }).webp({ quality: 72 }).toFile(out)` (sharp's default output is sRGB — do not add `keepMetadata`/`withMetadata`). Run with modest concurrency (e.g. process files sequentially, widths in Promise.all) to stay fast. Print a summary: files, generated, skipped, total input MB vs total output MB per width. Also generate the gnome: if `public/images/logo/logo-white-96.png` is missing or older than logo-white.png, write `sharp('public/images/logo/logo-white.png').resize(96, 96, { fit: 'contain', background: { r:0,g:0,b:0,alpha:0 } }).png({ compressionLevel: 9 })` — this output IS committed (it is not under _w).

2. **lib/image-loader.ts**: `'use client'` at top (Next docs require it for loaderFile in App Router). Export `const IMAGE_WIDTHS = [640, 1080, 1920] as const`. Export `function pickWidth(w: number)` → smallest IMAGE_WIDTHS entry ≥ w, else the largest (always clamp to the generated set). Export `function webpVariant(src: string, width: number): string` → if `src` matches `/^\/images\/(?!_w\/)(.+)\.jpe?g$/i` return `/images/_w/${pickWidth(width)}/${match[1]}.webp`, else return `src` unchanged (PNG logos, external URLs). `export default function imageLoader({ src, width }: { src: string; width: number; quality?: number }) { return webpVariant(src, width) }`.

3. **next.config.ts**: replace `images: { unoptimized: true }` with `images: { loader: 'custom', loaderFile: './lib/image-loader.ts', deviceSizes: [640, 1080, 1920], imageSizes: [] }` (same sync comment). Keep `output: 'export'`, `trailingSlash: true`. If Next rejects empty `imageSizes` at build/dev start, use `imageSizes: [640]` — the loader clamps anyway.

4. **package.json** scripts: add `"images": "node tools/image-variants.mjs"` and `"prebuild": "node tools/image-variants.mjs"`. Do not touch dependencies (no npm install).

5. **.gitignore**: add `public/images/_w/`. **.vercelignore**: add `public/images/_w` under the raw media block (Vercel regenerates at build; avoids uploading stale local variants). Do NOT add `tools`.

6. **vercel.json** (new):
```json
{
  "headers": [
    { "source": "/images/(.*)", "headers": [{ "key": "Cache-Control", "value": "public, max-age=604800, stale-while-revalidate=2592000" }] },
    { "source": "/videos/(.*)", "headers": [{ "key": "Cache-Control", "value": "public, max-age=604800, stale-while-revalidate=2592000" }] },
    { "source": "/og/(.*)",     "headers": [{ "key": "Cache-Control", "value": "public, max-age=604800, stale-while-revalidate=2592000" }] },
    { "source": "/fonts/(.*)",  "headers": [{ "key": "Cache-Control", "value": "public, max-age=604800, stale-while-revalidate=2592000" }] }
  ]
}
```
Do not add anything for /_next (already immutable). No `headers()` in next.config (ignored with output export).

7. Run `npm run images` once locally (from the project root); check `public/images/_w/{640,1080,1920}` each hold 55 .webp files and logo-white-96.png exists (96×96, alpha kept — `sips -g pixelWidth -g hasAlpha`).

8. **CLAUDE.md** (/Users/myltonvanbolderen/CLAUDE.md, outside the repo — edit, never commit): in Conventions › Photos add 2–3 bullets: "Variantes WebP 640/1080/1920 generees par `tools/image-variants.mjs` (sharp) dans `public/images/_w/` (pas dans git, regenerees au `prebuild` sur Vercel). `npm run images` en local apres ajout de photos." / "`<Image>` passe par le loader custom `lib/image-loader.ts` : NE PAS remettre `unoptimized`, toujours donner `sizes` sur les `fill`." / "Cache 7j + SWR 30j sur /images /videos /og /fonts via `vercel.json` : renommer un fichier modifie plutot que l'ecraser." Also mention Header gnome now uses `logo-white-96.png` in the Logo section.

Commit (stage exact paths only): `git add tools/image-variants.mjs lib/image-loader.ts next.config.ts package.json .gitignore .vercelignore vercel.json public/images/logo/logo-white-96.png` → `perf(images): build-time WebP variants, custom loader, long cache headers` ending with `Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>`. Verify `git status` shows no `_w` files staged.
  </action>
  <verify>
    <automated>cd /Users/myltonvanbolderen/small-record && node tools/image-variants.mjs && for w in 640 1080 1920; do find public/images/_w/$w -name '*.webp' | wc -l; done && sips -g pixelWidth -g hasAlpha public/images/logo/logo-white-96.png && git check-ignore public/images/_w/640 && node -e "JSON.parse(require('fs').readFileSync('vercel.json','utf8'))" && npx tsc --noEmit</automated>
  </verify>
  <done>Three variant folders with 55 WebPs each; second run reports all skipped; gnome 96px PNG with alpha; _w ignored by git and vercel; vercel.json valid; tsc clean; commit made with exact paths.</done>
</task>

<task type="auto">
  <name>Task 2: Route every public &lt;Image&gt; through the loader with accurate sizes; gnome + wordmark + posters</name>
  <files>components/animation/ParallaxImage.tsx, components/magazine/FlipImage.tsx, components/magazine/PhotoSlider.tsx, components/magazine/VideoLoop.tsx, components/layout/Header.tsx, components/layout/Footer.tsx, app/page.tsx, app/small-record/page.tsx, app/events/page.tsx, app/casae/page.tsx, app/letche/page.tsx, app/not-found.tsx</files>
  <action>
1. Remove the `unoptimized` prop from EVERY `<Image>` in the files above (not in app/v2, app/carousel, components/v2 — leave those untouched). Keep `fill`, `priority`, `className`, `style`, alt as-is.
2. Add `sizes` to every `fill` Image per the sizes table in context (re-grep lines). Shared components:
   - ParallaxImage: add optional `sizes?: string` prop, default `'130vw'` (image box is inset-[-15%] = 130% of a full-bleed container). No call-site changes needed.
   - FlipImage: add optional `sizes?: string` prop, default `'100vw'`; at app/small-record/page.tsx FlipImage (col-span-12 md:col-span-3) pass `sizes="(min-width: 768px) 25vw, 100vw"`. Home FlipImage keeps the default.
   - PhotoSlider: `sizes="(min-width: 768px) 40vw, 75vw"`.
3. VideoLoop: `import { webpVariant } from '@/lib/image-loader'` and render `poster={poster ? webpVariant(poster, 1080) : undefined}` (all posters are /images JPEGs; non-JPEG passes through unchanged). Keep `preload="none"` and everything else.
4. Header.tsx: change gnome src to `/images/logo/logo-white-96.png`; keep native `<img>`, className and `style={{ filter: 'invert(1)' }}` exactly (CLAUDE.md). Add `width={96} height={96}` attributes only if they don't change layout (h-full w-full classes win — fine). Remove `import Image from 'next/image'` if it is unused.
5. Footer.tsx wordmark `<img>`: add `loading="lazy"` and `decoding="async"`. app/small-record/page.tsx:468 (booking wordmark, below the fold): add `loading="lazy"`. Do NOT add lazy to the /small-record cover wordmark (line ~49).
6. Leave OG images (public/og, og-image.jpg) as JPEG (social crawlers). Report in SUMMARY which non-Image usages remain JPEG/PNG: og images, wordmark PNGs, gnome PNG.

Commit exact paths: the 12 files above → `perf(images): responsive WebP srcset with sizes on all photos, small gnome, lazy footer wordmark` + `Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>`.
  </action>
  <verify>
    <automated>cd /Users/myltonvanbolderen/small-record && ! grep -rn "unoptimized" app components --include='*.tsx' | grep -v "app/v2\|app/carousel\|components/v2" && npx tsc --noEmit && grep -c "sizes=" app/events/page.tsx app/page.tsx app/small-record/page.tsx app/letche/page.tsx app/casae/page.tsx app/not-found.tsx</automated>
  </verify>
  <done>Zero `unoptimized` on public pages; every fill Image has sizes (count of sizes= equals count of <Image per file); gnome uses 96px PNG with invert filter still inline; footer wordmark lazy; tsc clean; commit made.</done>
</task>

<task type="auto">
  <name>Task 3: Isolated build + Playwright byte/breakage/visual verification</name>
  <files>(no repo files unless a fix is needed; scripts go to scratchpad)</files>
  <action>
SCRATCH=/private/tmp/claude-501/-Users-myltonvanbolderen-small-record/54b5f0cd-5a66-4186-b337-6738006c59de/scratchpad

1. Isolated build: `rsync -a --delete --exclude .next --exclude out --exclude public/asset --exclude node_modules --exclude public/images/_w /Users/myltonvanbolderen/small-record/ $SCRATCH/buildcheck/` (excluding _w proves prebuild regenerates), ensure `$SCRATCH/buildcheck/node_modules` is a symlink to the project's node_modules, then `cd $SCRATCH/buildcheck && npm run build`. Must: run prebuild (log shows generated count), succeed, and `out/images/_w/{640,1080,1920}/` exist. Check HTML: `grep -o 'srcset="[^"]*' out/events/index.html | head` shows `/images/_w/…webp 640w, … 1080w, … 1920w`; `grep -c '\.jpg' out/events/index.html` only for posters? (posters now webp too — only og meta tags should reference .jpg). Confirm no `<link rel="preload"` for logo-wordmark-white.png in out/index.html (if React/Next still emits one, note it and why).
2. Static server: write `$SCRATCH/lote1/serve.mjs` — tiny node http server on :3200 serving `$SCRATCH/buildcheck/out` (map `/x/` → `/x/index.html`, correct content-types incl. image/webp, video/mp4, support Range requests minimally or just 200 full body). Run in background.
3. Playwright: adapt `$SCRATCH/measure.mjs` (same createRequire from `~/Downloads/PANIC ROOM/_kit/package.json`, CDP byte counting) into `$SCRATCH/lote1/measure.mjs` with BASE=http://localhost:3200, routes `/`, `/small-record/`, `/events/`, profiles iPhone 13 and 1440×900 DPR1, cache disabled. Scroll to bottom in steps (e.g. 400px every 250ms), wait 1.5s, then: sum image bytes (mime image/*), list the 5 biggest image URLs, and evaluate `[...document.images].filter(i => !(i.complete && i.naturalWidth > 0)).map(i => i.currentSrc || i.src)` (must be empty; ignore `loading=lazy` imgs outside viewport only if they were never reached — after full scroll there should be none). Print a table. Targets: mobile /events/ and /small-record/ image bytes < 2 MB; / clearly below 5.2 MB. Also confirm every requested photo URL is under /images/_w/ (no /images/<dir>/*.jpg requests except none).
4. Screenshots: mobile iPhone 13 viewport-top + mid-page of `/` and `/events/` into `$SCRATCH/lote1/*.png`; Read them to check colors (no washed-out / purple cast from color profile), gnome visible white top-left.
5. Contingency if mobile targets are missed because DPR-3 phones pick the 1920 variant for 100vw slots (390×3 = 1170 > 1080): add 1280 to WIDTHS in tools/image-variants.mjs, IMAGE_WIDTHS in lib/image-loader.ts and deviceSizes in next.config.ts, rerun generator + build + measure, and commit those 3 files as `perf(images): add 1280w variant for 3x phones` (+ Co-Authored-By line). Any other fix: minimal, exact-path commits.
6. Dev server: do NOT restart :3000. Note in SUMMARY that the user's dev server must be restarted to pick up the next.config.ts loader change (until then `next dev` may still serve with the old image config). Optional sanity: `cd $SCRATCH/buildcheck && npx next dev --turbopack --port 3100` briefly, load /events/ once, then stop only that 3100 process.
7. Record in SUMMARY: before/after bytes table (mobile+desktop × 3 routes), variant output sizes, which usages remain non-WebP, and that vercel.json cache headers can only be verified after the next `vercel --prod` (`curl -sI https://small-records.com/images/duo/img_5717.jpg | grep -i cache-control`). No deploy.
  </action>
  <verify>
    <automated>node /private/tmp/claude-501/-Users-myltonvanbolderen-small-record/54b5f0cd-5a66-4186-b337-6738006c59de/scratchpad/lote1/measure.mjs (exit non-zero if any broken image or if mobile /events/ or /small-record/ image bytes >= 2 MB)</automated>
  </verify>
  <done>Isolated build green with prebuild-generated variants; srcset .webp in exported HTML; mobile /events/ and /small-record/ < 2 MB images; zero broken images on 3 routes × 2 profiles; screenshots confirm correct colors and gnome; SUMMARY lists results and the dev-server restart note.</done>
</task>

</tasks>

<threat_model>
## Trust Boundaries

| Boundary | Description |
|----------|-------------|
| build → CDN | Build-time generator writes only into public/images/_w from repo-controlled JPEGs |
| CDN → browser | Static media now cached 7 days + SWR 30 days |

## STRIDE Threat Register

| Threat ID | Category | Component | Disposition | Mitigation Plan |
|-----------|----------|-----------|-------------|-----------------|
| T-E1-01 | Tampering | tools/image-variants.mjs | accept | Inputs are committed repo files; output path is derived from a relative path under public/images and confined to public/images/_w (skip _w on walk) |
| T-E1-02 | Denial of service | Vercel build | mitigate | Generator exits 1 with a clear message if sharp is missing, instead of shipping srcsets pointing to non-existent files |
| T-E1-03 | Information disclosure | .vercelignore / .gitignore | mitigate | public/asset stays excluded; _w excluded from git and upload; commits stage exact paths only |
| T-E1-04 | Tampering (stale content) | vercel.json cache headers | accept | 7-day max-age on non-hashed files: documented in CLAUDE.md (rename modified files) |
</threat_model>

<verification>
- `npx tsc --noEmit` clean after tasks 1 and 2.
- Isolated `npm run build` in buildcheck runs prebuild and exports `out/images/_w/**`.
- Exported HTML srcsets point at `.webp` variants; no photo requests to original JPEGs.
- Playwright: mobile /events/ and /small-record/ image bytes < 2 MB, no broken images, screenshots look right.
- `git log -3 --stat` shows no public/asset, public/images/_w, .claude paths.
</verification>

<success_criteria>
- Mobile full-scroll image bytes: /events/ and /small-record/ < 2 MB (from ~9 MB), / well under 5.2 MB.
- All public `<Image>` usages responsive (no `unoptimized`, `sizes` on every fill).
- Header gnome served at 96px, still native img + inline invert filter.
- vercel.json cache headers in place (effective on next deploy).
- CLAUDE.md Photos convention updated (not committed).
</success_criteria>

<output>
After completion, create `.planning/quick/260921-rwt-audit-lot-e1-responsive-images-and-cache/260921-rwt-SUMMARY.md`
</output>
