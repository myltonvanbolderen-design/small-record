# Roadmap: Small Records — rentrée 2026

## Overview

Le site est en ligne. Ce milestone le remet à jour avec la saison : d'abord le recap de la Small Party au Panic Room, ensuite les dates à venir, puis l'infra restante (emails, test mobile).

## Phases

- [x] **Phase 1: Panic Room recap** — Ajouter la Small Party du 11.09.26 sur `/events` et `/small-record`
- [ ] **Phase 2: Coming soon** — Remplacer les placeholders par les vraies prochaines dates
- [ ] **Phase 3: Infra & QA** — Redirections email du domaine et test sur vrai device
- [x] **Phase 4: Perf & sécu (audit lot A)** — /events léger sur mobile, Next patché
- [x] **Phase 5: SEO & partage (audit lot B)** — Aperçus de partage par page, sitemap, liens, emails cliquables
- [x] **Phase 6: Events & home (audit lot C)** — Events du plus récent au plus ancien, mobile, home qui montre le live
- [x] **Phase 7: Accessibilité (audit lot D)** — Contrastes AA, menu clavier, reduced-motion, focus
- [ ] **Phase 8: Images, cache & code (audit lot E)** — WebP responsive, cache long, composants partagés, code mort, lint

## Phase Details

### Phase 1: Panic Room recap
**Goal**: Un booker qui ouvre `/events` voit la Small Party au Panic Room comme l'event le plus récent, avec la même qualité magazine que Gambetta
**Depends on**: Nothing
**Requirements**: EVT-01, EVT-02, EVT-03, EVT-04
**UI hint**: yes
**Success Criteria**:
1. `/events` affiche la section Panic Room (004) avec vidéos, photos, affiche, texte
2. La time table et le bloc lieu/date sont lisibles sur mobile et desktop
3. La carte Panic Room apparaît dans le teaser de `/small-record`
4. `next build` passe sans erreur

### Phase 2: Coming soon
**Goal**: La timeline "What's next" montre de vraies dates
**Depends on**: Phase 1
**Requirements**: EVT-05
**Success Criteria**:
1. Aucun placeholder "TBA / Somewhere loud" restant
2. Chaque date a lieu, ville, mois

### Phase 3: Infra & QA
**Goal**: Les adresses email affichées sur le site fonctionnent et le site est validé sur téléphone
**Depends on**: Nothing
**Requirements**: INFRA-01, INFRA-02
**Success Criteria**:
1. Un mail envoyé à contact@small-records.com arrive dans une boîte du crew
2. Les pages publiques s'affichent et les vidéos se lancent sur un vrai iPhone

### Phase 4: Perf & sécu (audit lot A)
**Goal**: /events s'affiche vite sur mobile 4G; plus de faille connue
**Depends on**: Nothing
**Success Criteria**:
1. Aucune vidéo hors écran téléchargée au chargement de /events
2. Vidéos réencodées (Sornettes H.264 sans audio, autres ≤720p)
3. next@15.5.25, npm audit sans critique
4. Iframes YouTube/SoundCloud en lazy, polices v2 hors du layout racine, pages visibles sans JS

### Phase 5: SEO & partage (audit lot B)
**Goal**: Chaque page a son aperçu de partage et est découvrable
**Depends on**: Phase 4
**Success Criteria**:
1. og:title/url/description propres à chaque page + canonical
2. sitemap.xml et robots.txt en ligne
3. /small-record/ lié dans le footer; emails en mailto partout; lang="en"
4. JSON-LD MusicEvent pour Panic Room et Gambetta

### Phase 6: Events & home (audit lot C)
**Goal**: Le live le plus récent est ce qu'on voit en premier
**Depends on**: Phase 5
**Success Criteria**:
1. /events du plus récent au plus ancien, cover Panic Room
2. Fête de la Musique compacte sur mobile
3. Coming soon sans date périmée
4. La home montre le dernier event (711 people)
5. Plus de scroll horizontal sur /casae desktop

### Phase 7: Accessibilité (audit lot D)
**Goal**: Le site passe axe-core (WCAG 2.2 AA) sans échec de contraste et se pilote au clavier
**Depends on**: Phase 6
**Success Criteria**:
1. 0 violation color-contrast axe sur les 5 pages (desktop + mobile), petits labels en #E0525E, rouge #CC2936 gardé pour les grands éléments
2. Menu overlay : aria-expanded, Échap, focus géré, fond inert
3. prefers-reduced-motion respecté par motion, Marquee, FlipImage, CountUp, VideoLoop
4. focus-visible visible partout, skip link vers le vrai <main>

### Phase 8: Images, cache & code (audit lot E)
**Goal**: Pages 3-5× plus légères en images, assets cachés, code plus simple
**Depends on**: Phase 7
**Success Criteria**:
1. Images servies en WebP responsive (srcset) — /events et /small-record < 2 Mo d'images en mobile
2. Cache long sur /images, /videos, /og, /fonts
3. events/page.tsx refactoré (MediaTile, SectionHeader) sans régression visuelle
4. Code mort supprimé, ESLint en place sans erreur

## Progress

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Panic Room recap | quick 260921-ga2 | Complete | 2026-09-21 |
| 2. Coming soon | 0/1 | Not started | - |
| 3. Infra & QA | 0/1 | Not started | - |
| 4. Perf & sécu | quick 260921-odr | Complete | 2026-09-21 |
| 5. SEO & partage | quick 260921-on4 | Complete | 2026-09-21 |
| 6. Events & home | quick 260921-oti | Complete | 2026-09-21 |
| 7. Accessibilité | quick 260921-qp5 | Complete | 2026-09-21 |
| 8. Images, cache & code | 1/2 (quick 260921-rwt) | In progress | - |
