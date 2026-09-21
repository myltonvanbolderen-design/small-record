import Link from 'next/link'
import { AnimatedSection } from '@/components/animation/AnimatedSection'
import { MediaTile } from '@/components/magazine/MediaTile'
import { SectionHeader } from '@/components/magazine/SectionHeader'

interface LivePhoto {
  src: string
  alt: string
  /** object-position for the portrait (9:16) crop on mobile, e.g. 'object-[63%_center]' */
  mobilePosition?: string
}

interface ArtistLiveProps {
  title: string
  meta: string
  hero: LivePhoto
  video: { src: string; poster: string; caption: string }
  /** 1 or 2 extra photos */
  photos: LivePhoto[]
  recapHref?: string
}

/**
 * "On stage" block for an artist page: big photo + vertical loop, then 1–2 photos.
 * Mobile: hero 4:3 → loop + first photo side by side (9:16) → second photo 4:3.
 * Desktop: hero (8 cols) beside the loop (4 cols, same row height) → photos row.
 */
export function ArtistLive({ title, meta, hero, video, photos, recapHref = '/events/' }: ArtistLiveProps) {
  const [first, second] = photos
  const single = photos.length === 1

  return (
    <section className="px-5 py-20 md:px-8 md:py-28">
      <div className="mx-auto max-w-6xl">
        <AnimatedSection blur>
          <SectionHeader
            kicker="On stage"
            title={title}
            meta={meta}
            className="mb-10 flex items-end justify-between md:mb-12"
          />
        </AnimatedSection>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-12">
          <MediaTile
            className="relative col-span-2 aspect-[4/3] overflow-hidden md:col-span-8 md:aspect-auto"
            image={{
              src: hero.src,
              alt: hero.alt,
              sizes: '(min-width: 1200px) 768px, (min-width: 768px) 67vw, 100vw',
            }}
          />
          <MediaTile
            className="relative col-span-1 aspect-[9/16] overflow-hidden bg-placeholder md:col-span-4"
            video={{ src: video.src, poster: video.poster }}
            caption={video.caption}
          />
          {first && (
            <MediaTile
              className={
                single
                  ? 'relative col-span-1 aspect-[9/16] overflow-hidden md:col-span-12 md:aspect-[21/9]'
                  : 'relative col-span-1 aspect-[9/16] overflow-hidden md:col-span-6 md:aspect-[3/2]'
              }
              image={{
                src: first.src,
                alt: first.alt,
                sizes: single ? '(min-width: 768px) 100vw, 50vw' : '(min-width: 768px) 50vw, 50vw',
                className: `object-cover ${first.mobilePosition ?? ''} md:object-center`,
              }}
            />
          )}
          {second && (
            <MediaTile
              className="relative col-span-2 aspect-[4/3] overflow-hidden md:col-span-6 md:aspect-[3/2]"
              image={{
                src: second.src,
                alt: second.alt,
                sizes: '(min-width: 768px) 50vw, 100vw',
                className: `object-cover ${second.mobilePosition ?? ''} md:object-center`,
              }}
            />
          )}
        </div>

        <Link
          href={recapHref}
          className="group mt-10 inline-flex items-center gap-2 font-condensed text-[0.6rem] uppercase tracking-[0.3em] text-blanc/55 transition-colors hover:text-terracotta"
        >
          See the full recap
          <span className="transition-transform group-hover:translate-x-1">→</span>
        </Link>
      </div>
    </section>
  )
}
