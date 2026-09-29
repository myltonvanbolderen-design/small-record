import Image from 'next/image'
import Link from 'next/link'
import { PageTransition } from '@/components/animation/PageTransition'
import { LinkRow } from '@/components/magazine/LinkRow'
import { CopyLinkButton } from '@/components/magazine/CopyLinkButton'
import { pageMetadata } from '@/lib/seo'
import { APP_LINKS } from '@/lib/app-links'
import { getPublishedLinks } from '@/lib/links-store'
import { FEATURED_MIX } from '@/lib/links-seed'

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

// ISR safety net; the real invalidation is revalidateTag('links') from publishDraft().
export const revalidate = 3600

export default async function LinksPage() {
  const { items } = await getPublishedLinks()
  const links = items.filter((i) => i.active).sort((a, b) => a.order - b.order)
  return (
    <PageTransition>
      <main id="main-content" tabIndex={-1} className="bg-noir text-blanc outline-none">
        <div className="mx-auto w-full max-w-md px-4 pt-4 pb-4 md:px-5 md:pt-8 md:pb-8">
          <div className="relative text-center">
            <div className="absolute right-0 top-0">
              <CopyLinkButton />
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/logo/logo-wordmark-white.png"
              alt="Small Records"
              className="mx-auto -my-6 h-auto w-32 object-contain md:-my-8 md:w-40"
            />
            <h1 className="sr-only">Small Records — links</h1>
            <p className="mt-2 font-condensed text-[0.6rem] uppercase tracking-[0.3em] text-blanc/70">
              DJ crew &amp; label · Paris
            </p>
            <p className="mt-1 font-body text-[0.68rem] text-blanc/55">
              House · Techno · Baile Funk · Afrohouse
            </p>
          </div>

          <Link
            href="/events/#panic-room"
            className="group relative mt-3 block overflow-hidden"
          >
            <div className="relative h-[88px] w-full overflow-hidden">
              <Image
                src="/images/panic-room/trio.jpg"
                alt="Casae, Letche and Lessovik at Panic Room"
                fill
                priority
                className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                sizes="(min-width: 448px) 448px, 100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-noir/90 via-noir/30 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-2.5">
                <span className="font-condensed text-[0.5rem] uppercase tracking-[0.35em] text-terracotta-light">
                  Latest · Live
                </span>
                <h2 className="font-display text-[1.05rem] font-bold leading-none">
                  Small Party @ Panic Room
                </h2>
                <p className="font-body text-[0.65rem] text-blanc/55">
                  Sept 11, 2026 · 711 people
                </p>
              </div>
            </div>
          </Link>

          <nav aria-label="Small Records links" className="mt-3 flex flex-col gap-1.5 md:gap-2">
            {links.map((link) => (
              <LinkRow
                key={link.id}
                href={link.href}
                label={link.label}
                sublabel={link.sublabel}
                kind={link.kind}
                app={APP_LINKS[link.href]}
              />
            ))}
            <LinkRow
              href={FEATURED_MIX.href}
              kind="external"
              label={FEATURED_MIX.label}
              sublabel={FEATURED_MIX.sublabel}
              glyph={FEATURED_MIX.glyph}
              thumb={FEATURED_MIX.thumb}
              app={APP_LINKS[FEATURED_MIX.href]}
            />
          </nav>
        </div>
      </main>
    </PageTransition>
  )
}
