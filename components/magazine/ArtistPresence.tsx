import Image from 'next/image'
import Link from 'next/link'
import { AnimatedSection } from '@/components/animation/AnimatedSection'
import { SectionHeader } from '@/components/magazine/SectionHeader'
import { EVENTS, PRESENCE } from '@/lib/presence'
import { cn } from '@/lib/utils'

interface ArtistPresenceProps {
  artist: 'casae' | 'letche'
  name: string
}

/**
 * Compact "Presence" section for an artist page: every live event the artist
 * played, newest first, each card a photo linking to the event's anchor on /events/.
 */
export function ArtistPresence({ artist, name }: ArtistPresenceProps) {
  const entries = PRESENCE[artist]

  return (
    <section className="px-5 py-14 md:px-8 md:py-20">
      <div className="mx-auto max-w-4xl">
        <AnimatedSection blur>
          <SectionHeader
            kicker="Presence · with Small Records"
            title={`Where ${name} played`}
            className="mb-6 md:mb-8"
            titleClassName="mt-2 font-display text-[clamp(1.4rem,3vw,2rem)] font-bold leading-[1.05]"
          />
        </AnimatedSection>

        <ul className="grid grid-cols-3 gap-2 md:gap-4">
          {entries.map(({ eventId, photo }) => {
            const event = EVENTS[eventId]
            return (
              <li key={eventId}>
                <Link href={event.href} className="group block">
                  <div className="relative aspect-[4/5] overflow-hidden bg-placeholder">
                    <Image
                      src={photo.src}
                      alt={photo.alt}
                      fill
                      sizes="(min-width: 896px) 280px, 33vw"
                      className={cn(
                        'object-cover transition-transform duration-700 group-hover:scale-[1.03]',
                        photo.position ?? 'object-center',
                      )}
                    />
                  </div>
                  <p className="mt-2 font-display text-[0.95rem] leading-tight transition-colors group-hover:text-terracotta-light md:mt-3 md:text-[1.1rem]">
                    {event.name}
                  </p>
                  <p className="mt-1 break-words font-condensed text-[0.6rem] uppercase tracking-[0.2em] text-blanc/55">
                    {event.date} · {event.venue}
                  </p>
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
