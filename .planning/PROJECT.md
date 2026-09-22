# Small Records

## What This Is

Site portfolio/book du crew musical **Small Records** (DJ Casae & DJ Letche), pensé comme un magazine digital immersif. Vitrine pour bookers/promoteurs et présence publique du label. Univers : House, Techno, Baile Funk, Afrohouse, Disco, Ambient. En ligne sur https://small-records.com.

## Core Value

Chaque page frappe comme une couverture de magazine — et le site reste à jour avec ce que le crew fait vraiment en live.

## Requirements

### Validated

- ✓ Home : cover magazine, manifesto, artistes, vidéo, DNA — existing
- ✓ Page label `/small-record` avec teaser compact des events → `/events` — existing
- ✓ Pages artistes `/casae` et `/letche` (SoundCloud embeds) — existing
- ✓ Page `/events` : Fête de la Musique (Sornettes), mix YouTube, Gambetta Club (Early Reflections), timeline "Coming soon" — existing
- ✓ Logos gnome (header) + wordmark (partout ailleurs) — existing
- ✓ Déployé sur Vercel, domaine small-records.com (avec tiret), export statique — existing
- ✓ Recap Small Party × Panic Room (11.09.26) sur `/events`, teaser `/small-record`, bloc « Latest · Live » sur la home — v1 (Phase 1)
- ✓ Perf (vidéos différées, WebP responsive, cache), SEO (OG par page, sitemap, JSON-LD), accessibilité AA, refacto composants — audit lots A→E (Phases 4-8)
- ✓ Section « Presence » sur les pages artistes (tous les events joués) — 22/09/2026
- ✓ Parallaxes réparées (photos de fond, titre de la home) — 22/09/2026

### Active

- [ ] Timeline "Coming soon" de `/events` remplie avec de vraies dates (placeholders TBA aujourd'hui)
- [ ] Redirections email sur le domaine : contact@, casae@, letche@small-records.com
- [ ] Test mobile sur vrai device

### Out of Scope

- Blog / CMS / MDX — contenu codé en dur, site vitrine statique
- Routes `/v2` et `/carousel` en prod — outils internes, exclus via `.vercelignore`
- Grain overlay, shimmer sur images lazy, voiles sombres plein écran sur photos — causaient des bugs visuels

## Context

- Stack : Next.js 15 App Router, `output: 'export'`, Tailwind v4, `motion` (pas framer-motion), next/font (Playfair Display, Bebas Neue, DM Sans)
- Palette : noir #0A0A0A, blanc cassé #F5F0E8, rouge #CC2936
- Photos : originaux dans `public/asset/` (non commités, exclus du deploy), versions optimisées dans `public/images/` (1920px max, JPEG 80%)
- Vidéos : `VideoLoop` autoplay/loop/muted, MP4 H.264 ~576px de large pour les portraits
- Composants animation : `AnimatedSection` (texte uniquement), `ParallaxImage` (citations courtes), `ParallaxTitle` + `ParallaxLayer` (cover home), `ScrollFadeOut`, `ScrollRevealText`, `CountUp`, `HorizontalRule`, `FlipImage`
- Composants magazine partagés : `SectionHeader`, `MediaTile`, `EventFacts`, `ArtistPresence` (données `lib/presence.ts`)
- Images : variantes WebP générées au build (`tools/image-variants.mjs`) + loader `lib/image-loader.ts`
- Chaque event sur `/events` = section numérotée (001 = le plus récent) avec ancre, tag, titre, meta, galerie photo/vidéo, texte, line-up, venue/date
- Matière Panic Room : `~/Downloads/PANIC ROOM/` (scans argentiques, rushes, kit de production avec copy du recap et time table), `~/Downloads/wetransfer_panic-room_2026-09-18_1533/` (photos pro du lieu)

## Constraints

- **Tech stack** : Next.js 15 + Tailwind v4 + motion — établi, ne pas migrer
- **Déploiement** : site statique, `vercel --prod` — le projet est déjà lié
- **Logo** : gnome uniquement dans le Header, `<img>` natif + `style={{ filter: 'invert(1)' }}`
- **Dev server** : `npx next dev --turbopack --port 3000` (Webpack casse le hot reload)

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Export statique sur Vercel | Site vitrine sans backend | ✓ Good |
| Pas d'overlay sombre sur les photos | Rendait les photos ternes | ✓ Good |
| Events du plus récent au plus ancien sur /events | Le dernier live doit se voir en premier (audit lot C) | ✓ Good |
| Photos de fond en parallaxe seulement derrière des citations courtes | Illisible derrière des paragraphes longs | ✓ Good |
| Présence des artistes par identification visuelle des photos | Montrer tous les events joués sur chaque page artiste | — Pending |
| GSD initialisé en brownfield sans codebase map | CLAUDE.md documente déjà stack et conventions | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-09-22 after audit lots A–E, Presence, parallax fixes*
