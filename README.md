# Small Records

Site du crew **Small Records** — DJ Casæ & DJ Letché, Paris. Un magazine digital : vitrine pour les bookers, et trace de chaque soirée jouée.

**En ligne : https://small-records.com**

House · Techno · Baile Funk · Afrohouse · Disco · Ambient

## Pages

| Route | Contenu |
|---|---|
| `/` | Cover magazine, manifesto, artistes, dernier live (Small Party @ Panic Room) |
| `/small-record/` | The Label — histoire, manifesto, events |
| `/casae/`, `/letche/` | Pages artistes — bio, photos, **Presence** (tous les events joués), mixes SoundCloud, booking |
| `/events/` | Tous les lives, du plus récent au plus ancien : Panic Room, Gambetta Club, mix YouTube, Fête de la Musique |

## Stack

- Next.js 15 (App Router) en export statique (`output: 'export'`), déployé sur Vercel
- Tailwind CSS v4, `motion` pour les animations
- Images : JPEG sources dans `public/images/`, variantes WebP générées au build (`tools/image-variants.mjs`) et servies via un loader custom (`lib/image-loader.ts`)

## Développer

```bash
npm install
npm run images     # génère les variantes WebP (aussi lancé automatiquement avant chaque build)
npx next dev --turbopack --port 3000
```

## Avant de déployer

```bash
npm run lint       # 0 erreur requise (ESLint tourne aussi pendant le build)
npx tsc --noEmit
npm run build
```

## Déployer

```bash
vercel --prod
```

Le push sur GitHub ne déclenche pas de déploiement : la prod passe par le CLI Vercel.

## Ajouter un event

1. Photos optimisées dans `public/images/<event>/`, vidéos (H.264, sans audio) dans `public/videos/`
2. Nouvelle section en haut de `app/events/page.tsx` (avec un `id` d'ancre), renuméroter les folios
3. Une ligne par artiste présent dans `lib/presence.ts` → la carte apparaît dans « Presence » sur sa page
4. Données Google : `lib/events-jsonld.ts`

## Structure

```
app/            pages (home, small-record, casae, letche, events), sitemap, robots
components/
  animation/    AnimatedSection, ParallaxImage, ParallaxTitle, ParallaxLayer, ScrollFadeOut, CountUp…
  layout/       Header (menu), Footer (nav), ScrollToTop
  magazine/     SectionHeader, MediaTile, EventFacts, ArtistPresence, VideoLoop, Marquee…
lib/            seo, presence, events-jsonld, image-loader, fonts
tools/          image-variants.mjs
public/         images, videos, og, fonts
```

Les routes `/v2` et `/carousel` sont des outils internes, exclus du déploiement (`.vercelignore`).
