import Image from 'next/image'
import Link from 'next/link'
import { AnimatedSection } from '@/components/animation/AnimatedSection'
import { PageTransition } from '@/components/animation/PageTransition'
import { LinkRow } from '@/components/magazine/LinkRow'
import { CopyLinkButton } from '@/components/magazine/CopyLinkButton'
import { pageMetadata } from '@/lib/seo'

export const metadata = pageMetadata({
  title: 'Links',
  ogTitle: 'Small Records — all our links',
  description:
    'All Small Records links in one place: Instagram, SoundCloud (Casae & Letche), YouTube mixes, live recaps and booking. Paris DJ crew and label.',
  path: '/links/',
  image: {
    url: '/og/og-label.jpg',
    width: 1200,
    height: 630,
    alt: 'Casae and Letche, Small Records',
  },
})

const LINKS: {
  label: string
  sublabel?: string
  href: string
  kind: 'internal' | 'external' | 'mail'
}[] = [
  {
    label: 'Instagram',
    sublabel: '@smallmusics',
    href: 'https://www.instagram.com/smallmusics',
    kind: 'external',
  },
  {
    label: 'SoundCloud — Casæ',
    href: 'https://soundcloud.com/casae',
    kind: 'external',
  },
  {
    label: 'SoundCloud — Letché',
    href: 'https://soundcloud.com/letchetony',
    kind: 'external',
  },
  {
    label: 'YouTube',
    href: 'https://www.youtube.com/@SmallRecords_Music',
    kind: 'external',
  },
  {
    label: 'Events & recaps',
    href: '/events/',
    kind: 'internal',
  },
  {
    label: 'The Label',
    href: '/small-record/',
    kind: 'internal',
  },
  {
    label: 'Booking',
    sublabel: 'contact@small-records.com',
    href: 'mailto:contact@small-records.com',
    kind: 'mail',
  },
]

export default function LinksPage() {
  return (
    <PageTransition>
      <main id="main-content" tabIndex={-1} className="min-h-screen bg-noir text-blanc outline-none">
        <div className="mx-auto w-full max-w-md px-5 pt-28 pb-20 md:pt-32">
          <AnimatedSection className="text-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/logo/logo-wordmark-white.png"
              alt="Small Records"
              className="mx-auto h-auto w-56 object-contain"
            />
            <h1 className="sr-only">Small Records — links</h1>
            <p className="mt-4 font-condensed text-[0.7rem] uppercase tracking-[0.4em] text-blanc/70">
              DJ crew &amp; label · Paris
            </p>
            <p className="mt-2 font-body text-[0.75rem] text-blanc/55">
              House · Techno · Baile Funk · Afrohouse · Disco
            </p>
            <div className="mt-4">
              <CopyLinkButton />
            </div>
          </AnimatedSection>

          <Link
            href="/events/#panic-room"
            className="group relative mt-10 block overflow-hidden"
          >
            <div className="relative aspect-[16/10] w-full overflow-hidden">
              <Image
                src="/images/panic-room/trio.jpg"
                alt="Casae, Letche and Lessovik at Panic Room"
                fill
                priority
                className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                sizes="(min-width: 448px) 448px, 100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-noir/90 via-noir/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4">
                <span className="font-condensed text-[0.55rem] uppercase tracking-[0.4em] text-terracotta-light">
                  Latest · Live
                </span>
                <h2 className="mt-1 font-display text-[1.4rem] font-bold leading-none">
                  Small Party @ Panic Room
                </h2>
                <p className="mt-2 font-body text-[0.8rem] text-blanc/55">
                  Sept 11, 2026 · 711 people
                </p>
              </div>
            </div>
          </Link>

          <nav aria-label="Small Records links" className="mt-10 flex flex-col gap-3">
            {LINKS.map((link) => (
              <LinkRow
                key={link.label}
                href={link.href}
                label={link.label}
                sublabel={link.sublabel}
                kind={link.kind}
              />
            ))}
          </nav>

          <a
            href="https://youtu.be/X9rpsIVIVgk"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative mt-10 block overflow-hidden"
          >
            <div className="relative aspect-video w-full overflow-hidden">
              <Image
                src="/images/mix-pool-party.jpg"
                alt="House mix, pool party set in the South of France"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                sizes="(min-width: 448px) 448px, 100vw"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <span
                  aria-hidden="true"
                  className="flex h-14 w-14 items-center justify-center rounded-full border border-blanc/70 bg-noir/50 backdrop-blur-sm"
                >
                  ▶
                </span>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-noir/90 via-noir/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4">
                <span className="font-condensed text-[0.55rem] uppercase tracking-[0.4em] text-terracotta-light">
                  Featured Mix
                </span>
                <h2 className="mt-1 font-display text-[1.4rem] font-bold leading-none">
                  House Mix · Pool Party
                </h2>
                <p className="mt-2 font-body text-[0.8rem] text-blanc/55">
                  Summer DJ set · South of France
                </p>
              </div>
            </div>
          </a>
        </div>
      </main>
    </PageTransition>
  )
}
