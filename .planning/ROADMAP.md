# Roadmap: Small Records — rentrée 2026

## Overview

Le site est en ligne. Ce milestone le remet à jour avec la saison : d'abord le recap de la Small Party au Panic Room, ensuite les dates à venir, puis l'infra restante (emails, test mobile).

## Phases

- [ ] **Phase 1: Panic Room recap** — Ajouter la Small Party du 11.09.26 sur `/events` et `/small-record`
- [ ] **Phase 2: Coming soon** — Remplacer les placeholders par les vraies prochaines dates
- [ ] **Phase 3: Infra & QA** — Redirections email du domaine et test sur vrai device

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

## Progress

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Panic Room recap | 0/1 | Not started | - |
| 2. Coming soon | 0/1 | Not started | - |
| 3. Infra & QA | 0/1 | Not started | - |
