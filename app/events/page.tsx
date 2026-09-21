import Image from 'next/image'
import { AnimatedSection } from '@/components/animation/AnimatedSection'
import { ParallaxImage } from '@/components/animation/ParallaxImage'
import { ScrollRevealText } from '@/components/animation/ScrollRevealText'
import { HorizontalRule } from '@/components/animation/HorizontalRule'
import { PageTransition } from '@/components/animation/PageTransition'
import { Marquee } from '@/components/magazine/Marquee'
import { YouTubeEmbed } from '@/components/magazine/YouTubeEmbed'
import { SectionHeader } from '@/components/magazine/SectionHeader'
import { MediaTile } from '@/components/magazine/MediaTile'
import { EventFacts } from '@/components/magazine/EventFacts'
import { CountUp } from '@/components/animation/CountUp'
import { cn } from '@/lib/utils'
import { pageMetadata } from '@/lib/seo'
import { eventsJsonLd } from '@/lib/events-jsonld'

export const metadata = pageMetadata({
  title: 'Events',
  ogTitle: 'Events | Small Records',
  description:
    'Small Records live in Paris: Small Party at Panic Room, Gambetta Club with Early Reflections, Fête de la Musique. Club nights, recaps, videos and booking.',
  path: '/events/',
  image: {
    url: '/og/og-events.jpg',
    width: 1200,
    height: 630,
    alt: 'Letché, Casæ and Lessovik at Panic Room',
  },
})

const panicSetOrder = [
  { name: 'Lessovik', src: '/videos/panic-lessovik.mp4', poster: '/images/panic-room/poster-panic-lessovik.jpg' },
  { name: 'Casæ', src: '/videos/panic-casae.mp4', poster: '/images/panic-room/poster-panic-casae.jpg' },
  { name: 'Momal', src: '/videos/panic-momal.mp4', poster: '/images/panic-room/poster-panic-momal.jpg' },
  { name: 'Letché', src: '/videos/panic-letche.mp4', poster: '/images/panic-room/poster-panic-letche.jpg' },
]

const panicColSpan2 = 'relative col-span-2 aspect-[4/3] w-full overflow-hidden md:col-span-1 md:aspect-[3/2]'
const panicSquare = 'relative aspect-square w-full overflow-hidden md:aspect-[3/2]'
const panicSizesWide = '(min-width: 1200px) 384px, (min-width: 768px) 33vw, 100vw'
const panicSizesHalf = '(min-width: 1200px) 384px, (min-width: 768px) 33vw, 50vw'

const panicPhotoGrid = [
  { src: '/images/panic-room/casae-prime.jpg', alt: 'Casæ arms up at the decks with Lessovik', className: panicColSpan2, sizes: panicSizesWide },
  { src: '/images/panic-room/neon-sign.jpg', alt: 'Panic Room red neon sign', className: panicSquare, sizes: panicSizesHalf },
  { src: '/images/panic-room/letche-decks.jpg', alt: 'Letché at the decks, the crowd leaning in', className: panicSquare, sizes: panicSizesHalf, imgClassName: 'object-cover object-[65%_center] md:object-center' },
  { src: '/images/panic-room/decks-blue.jpg', alt: 'DJ under blue light at Panic Room', className: panicColSpan2, sizes: panicSizesWide },
  { src: '/images/panic-room/dream-crowd.jpg', alt: 'A crew of friends on the Panic Room floor', className: panicSquare, sizes: panicSizesHalf },
  { src: '/images/panic-room/turntable.jpg', alt: 'Panic Room slipmat on the turntable', className: panicSquare, sizes: panicSizesHalf },
]

const panicStats = [
  { value: '711', label: 'People' },
  { value: '7h', label: 'Of music' },
  { value: '4', label: 'DJs' },
  { value: '5', label: 'Sets' },
  { value: '7', label: 'Genres' },
]

const panicTimeTable = [
  { name: 'Lessovik', genre: 'House · Vinyl / CDJ' },
  { name: 'Letché b2b Casæ', genre: 'Tech House' },
  { name: 'Casæ', genre: 'UK Garage · Techno' },
  { name: 'Momal', genre: 'Trance' },
  { name: 'Letché', genre: 'Latin Tech · Bounce' },
]

const gambettaGallery = [
  { video: { src: '/videos/gambetta-duo.mp4', poster: '/images/early-reflection/poster-duo.jpg' }, caption: 'B2B · Letche × Casæ' },
  { image: { src: '/images/early-reflection/attitude.jpg', alt: 'Casae and Letche' } },
  { video: { src: '/videos/gambetta-casae.mp4', poster: '/images/early-reflection/poster-casae.jpg' }, caption: 'Casæ' },
  { image: { src: '/images/early-reflection/b2b-decks.jpg', alt: 'Letche and Casae B2B at the decks' } },
  { video: { src: '/videos/gambetta-silhouette.mp4', poster: '/images/early-reflection/poster-silhouette.jpg' }, caption: '3615 Radio' },
  { image: { src: '/images/early-reflection/gnome-trophy.jpg', alt: 'Small Records gnome trophy' } },
]

const gambettaLineup = ['Letche', 'Casæ', 'DDG', 'Zeko', 'Copac', 'Scott Civil', 'Momal']

const comingSoonSlots = [
  { tag: 'Club', city: 'Paris', when: 'TBA' },
  { tag: 'Festival', city: 'To be announced', when: '2026–27' },
  { tag: 'B2B', city: 'Somewhere loud', when: 'Soon' },
]

export default function EventsPage() {
  return (
    <PageTransition>
      <main id="main-content" tabIndex={-1} className="min-h-screen bg-noir text-blanc outline-none">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(eventsJsonLd) }}
        />
        {/* ═══════ COVER ═══════ */}
        <section className="relative min-h-[100svh] overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src="/images/panic-room/cover.jpg"
              alt="Casæ at the decks, Small Party at Panic Room"
              fill
              className="object-cover object-[58%_center] md:object-center"
              priority
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-noir/70 via-noir/30 to-noir" />
          </div>

          <div className="absolute top-20 left-5 right-5 z-10 md:left-8 md:right-8">
            <AnimatedSection delay={0.3} direction="none" blur>
              <div className="flex items-start justify-between">
                <p className="font-condensed text-[0.55rem] uppercase tracking-[0.5em] text-blanc/55">
                  Live & Booking
                </p>
                <p className="font-condensed text-[0.55rem] uppercase tracking-[0.5em] text-blanc/55">
                  Paris · 2026
                </p>
              </div>
            </AnimatedSection>
          </div>

          <div className="relative z-10 flex min-h-[100svh] flex-col justify-end px-5 pb-20 md:px-8 md:pb-24">
            <AnimatedSection blur>
              <span className="font-condensed text-[0.65rem] uppercase tracking-[0.5em] text-terracotta-light">
                Small Records · On Stage
              </span>
            </AnimatedSection>
            <AnimatedSection delay={0.15} blur>
              <h1 className="mt-4 font-display text-[clamp(3.5rem,16vw,13rem)] font-bold leading-[0.85] tracking-tight">
                Events<span className="text-terracotta">.</span>
              </h1>
            </AnimatedSection>
            <AnimatedSection delay={0.3} blur>
              <p className="mt-6 max-w-xl font-body text-[1.05rem] leading-[1.8] text-blanc/60">
                Club nights, festivals and back-to-back sets. This is what Small
                Records sounds like in the wild — and where we&apos;re headed next.
              </p>
            </AnimatedSection>
            <span aria-hidden="true" className="mt-8 block font-condensed text-[0.55rem] tracking-[0.3em] text-blanc/55">
              000
            </span>
          </div>
        </section>

        <Marquee
          items={['Live', 'Club', 'Festival', 'B2B', 'Vinyl', 'Late Nights', 'Paris']}
          speed={25}
        />

        {/* ═══════ 001 · SMALL PARTY × PANIC ROOM ═══════ */}
        <section className="px-5 py-20 md:px-8 md:py-28">
          <div className="mx-auto max-w-6xl">
            <AnimatedSection blur>
              <SectionHeader
                kicker="Past · Club Night"
                title="Small Party"
                meta="Small Records × Panic Room · Paris 11 · September 2026"
                folio="001"
              />
            </AnimatedSection>

            <AnimatedSection delay={0.1}>
              <p className="mb-10 font-display text-[clamp(1.2rem,3vw,1.9rem)] font-bold leading-[1.2] text-blanc/80 md:mb-12">
                Our night. Our name on the door.
                <br />
                <span className="text-terracotta">Five sets, one basement.</span>
              </p>
            </AnimatedSection>

            {/* Hero — behind the decks (full-bleed square on mobile) */}
            <MediaTile
              className="relative -mx-5 aspect-square overflow-hidden md:mx-0 md:aspect-[3/2]"
              image={{ src: '/images/panic-room/trio.jpg', alt: 'Letché, Casæ and Lessovik behind the decks at Panic Room', className: 'object-cover object-[40%_center] md:object-center', sizes: '(min-width: 1200px) 1152px, 100vw' }}
              caption="Behind the decks · around 1am"
              captionClassName="p-5 md:p-6"
            />

            {/* Set-order strip — one loop per DJ */}
            <div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-4">
              {panicSetOrder.map((dj) => (
                <MediaTile
                  key={dj.src}
                  className="relative aspect-[9/16] w-full overflow-hidden bg-placeholder"
                  video={{ src: dj.src, poster: dj.poster }}
                  caption={dj.name}
                />
              ))}
            </div>

            {/* Photo grid — mobile: full, pair, full, pair */}
            <div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-3">
              {panicPhotoGrid.map((photo) => (
                <MediaTile
                  key={photo.src}
                  className={photo.className}
                  image={{ src: photo.src, alt: photo.alt, sizes: photo.sizes, className: photo.imgClassName }}
                />
              ))}
            </div>

            {/* Wide closer — crowd */}
            <MediaTile
              className="relative -mx-5 mt-3 aspect-[4/3] overflow-hidden md:mx-0 md:aspect-[21/9]"
              image={{ src: '/images/panic-room/crowd.jpg', alt: 'The crowd smiling at the end of the night', sizes: '(min-width: 1200px) 1152px, 100vw' }}
              caption="The crowd, 4:45am"
              captionClassName="p-5 md:p-6"
            />

            {/* By the numbers — 711 leads full-width on mobile */}
            <div className="mt-12 grid grid-cols-2 gap-px border-y border-blanc/10 bg-blanc/10 md:grid-cols-5">
              {panicStats.map((stat, i) => (
                <div
                  key={stat.label}
                  className={cn(
                    'bg-noir px-4 py-5 md:px-6 md:py-8',
                    i === 0 && 'col-span-2 md:col-span-1',
                  )}
                >
                  <CountUp
                    value={stat.value}
                    delay={i * 0.12}
                    className={cn(
                      'block font-display font-bold leading-none',
                      i === 0
                        ? 'text-[4.5rem] text-terracotta md:text-[clamp(2.8rem,5vw,4.5rem)]'
                        : 'text-[3rem] text-blanc/90 md:text-[clamp(2.8rem,5vw,4.5rem)]',
                    )}
                  />
                  <span className="mt-3 block font-condensed text-[0.65rem] uppercase tracking-[0.3em] text-blanc/55">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-12 grid gap-10 md:grid-cols-2 md:gap-16">
              <AnimatedSection delay={0.1}>
                <p className="font-body text-[1.05rem] leading-[1.9] text-blanc/55">
                  Our first night under our own name. Panic Room opened its
                  basement to Small Party: free entry, 10pm to 5am, five sets
                  back to back. From Lessovik&apos;s vinyl house opening to
                  Letché&apos;s latin-tech closing, through a Letché × Casæ
                  tech-house B2B, Casæ&apos;s UK garage into techno and
                  Momal&apos;s trance, the room never emptied.
                </p>
                <p className="mt-6 font-display text-[1.2rem] font-bold leading-[1.4] text-blanc/80">
                  Thank you to everyone who came. We&apos;ll do it again soon.
                </p>
              </AnimatedSection>

              <AnimatedSection delay={0.2}>
                <div className="space-y-8">
                  <div>
                    <span className="font-condensed text-[0.55rem] uppercase tracking-[0.4em] text-terracotta-light">
                      Time table
                    </span>
                    <div className="mt-3 border-t border-blanc/10">
                      {panicTimeTable.map((slot, i) => (
                        <div
                          key={`${i}-${slot.name}`}
                          className="flex items-baseline justify-between gap-4 border-b border-blanc/10 py-3"
                        >
                          <div className="flex items-baseline gap-4">
                            <span className="font-condensed text-[0.55rem] tracking-[0.3em] text-terracotta-light">
                              {String(i + 1).padStart(2, '0')}
                            </span>
                            <span className="font-display text-[1rem] font-bold leading-none text-blanc/70 md:text-[1.15rem]">
                              {slot.name}
                            </span>
                          </div>
                          <span className="shrink-0 text-right font-condensed text-[0.7rem] uppercase tracking-[0.15em] text-blanc/55 md:text-[0.55rem] md:tracking-[0.25em] md:text-blanc/55">
                            {slot.genre}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <EventFacts
                    facts={[
                      { label: 'Venue', lines: ['Panic Room', '101 rue Amelot', 'Paris 11'] },
                      { label: 'Date', lines: ['Friday', 'September 11, 2026', '22:00 — 05:00'] },
                    ]}
                  />
                </div>
              </AnimatedSection>
            </div>
          </div>
        </section>

        {/* ═══════ 002 · EARLY REFLECTION × GAMBETTA ═══════ */}
        <HorizontalRule color="bg-blanc/10" />
        <section className="px-5 py-20 md:px-8 md:py-28">
          <div className="mx-auto max-w-6xl">
            <AnimatedSection blur>
              <SectionHeader
                kicker="Past · Club Night"
                title="Gambetta Club"
                meta="Early Reflections × Small Records · Paris · April 2026"
                folio="002"
              />
            </AnimatedSection>

            <AnimatedSection delay={0.1}>
              <p className="mb-10 font-display text-[clamp(1.2rem,3vw,1.9rem)] font-bold leading-[1.2] text-blanc/80 md:mb-12">
                First time in the club.
                <br />
                <span className="text-terracotta">First time together.</span>
              </p>
            </AnimatedSection>

            {/* Hero — packed room */}
            <MediaTile
              className="relative aspect-[16/10] w-full overflow-hidden md:aspect-[16/8]"
              image={{ src: '/images/early-reflection/packed-room.jpg', alt: 'Packed room at Gambetta Club', sizes: '(min-width: 1200px) 1152px, 100vw' }}
              caption="A packed room · 22:00 — 06:00"
              captionClassName="p-5 md:p-6"
            />

            {/* Mixed gallery — photos + live loops */}
            <div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-3">
              {gambettaGallery.map((tile) =>
                tile.video ? (
                  <MediaTile
                    key={tile.video.src}
                    className="relative aspect-[3/4] w-full overflow-hidden bg-placeholder"
                    video={tile.video}
                    caption={tile.caption}
                  />
                ) : (
                  <MediaTile
                    key={tile.image!.src}
                    className="relative aspect-[3/4] w-full overflow-hidden"
                    image={{ src: tile.image!.src, alt: tile.image!.alt, sizes: '(min-width: 1200px) 384px, (min-width: 768px) 33vw, 50vw' }}
                  />
                ),
              )}
            </div>

            <div className="mt-12 grid gap-10 md:grid-cols-2 md:gap-16">
              <AnimatedSection delay={0.1}>
                <p className="font-body text-[1.05rem] leading-[1.9] text-blanc/55">
                  Invited by{' '}
                  <a
                    href="https://www.instagram.com/early__reflections"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blanc/80 underline decoration-terracotta/40 underline-offset-4 transition-colors hover:text-terracotta"
                  >
                    Early Reflections
                  </a>{' '}
                  for our debut night, Small Records took over Gambetta Club with
                  its first B2B: Letche × Casæ. Graffitied walls, overheated
                  speakers, a packed room and a memorable welcome from start to
                  finish.
                </p>
                <p className="mt-6 font-display text-[1.2rem] font-bold leading-[1.4] text-blanc/80">
                  Thank you all for the energy. See you again very soon.
                </p>
              </AnimatedSection>

              <AnimatedSection delay={0.2}>
                <div className="space-y-8">
                  <div>
                    <span className="font-condensed text-[0.55rem] uppercase tracking-[0.4em] text-terracotta-light">
                      Line-up
                    </span>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {gambettaLineup.map((name) => (
                        <span
                          key={name}
                          className="border border-blanc/15 px-3 py-1.5 font-condensed text-[0.65rem] uppercase tracking-[0.2em] text-blanc/60"
                        >
                          {name}
                        </span>
                      ))}
                    </div>
                  </div>
                  <EventFacts
                    facts={[
                      { label: 'Venue', lines: ['Le Gambetta Club', '104 rue de Bagnolet', 'Paris 20'] },
                      { label: 'Date', lines: ['Thursday', 'April 30, 2026', '22:00 — 06:00'] },
                    ]}
                  />
                </div>
              </AnimatedSection>
            </div>
          </div>
        </section>

        {/* ═══════ 003 · FEATURED MIX ═══════ */}
        <HorizontalRule color="bg-blanc/10" />
        <section className="px-5 py-20 md:px-8 md:py-24">
          <AnimatedSection scale>
            <div className="mx-auto max-w-5xl">
              <SectionHeader
                kicker="Featured Mix"
                title="House Mix · Pool Party"
                meta="Summer DJ Set · South of France"
                folio="003"
                className="mb-8 flex items-end justify-between"
                titleClassName="mt-2 font-display text-[clamp(1.5rem,3vw,2.5rem)] font-bold"
              />
              <YouTubeEmbed videoId="X9rpsIVIVgk" />
            </div>
          </AnimatedSection>
        </section>

        {/* ═══════ 004 · FÊTE DE LA MUSIQUE ═══════ */}
        <HorizontalRule color="bg-blanc/10" />
        <section className="px-5 py-20 md:px-8 md:py-28">
          <div className="mx-auto max-w-6xl">
            <AnimatedSection blur>
              <SectionHeader
                kicker="Past · Festival"
                title="Fête de la Musique"
                meta="Sornettes · Paris · June 2025"
                folio="004"
              />
            </AnimatedSection>

            <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-12 md:gap-5">
              <div className="col-span-1 md:col-span-4">
                <MediaTile
                  className="relative aspect-[9/16] w-full overflow-hidden bg-placeholder"
                  video={{ src: '/videos/casae-sornettes.mp4', poster: '/images/fete-musique/casae.jpg' }}
                  caption="Casae"
                />
              </div>
              <div className="order-first col-span-2 md:order-none md:col-span-4">
                <MediaTile
                  className="relative aspect-[4/3] w-full overflow-hidden md:aspect-[9/16]"
                  image={{ src: '/images/fete-musique/casae-live.jpg', alt: 'Small Records at Sornettes', sizes: '(min-width: 1200px) 384px, (min-width: 768px) 33vw, 100vw' }}
                  caption="The Crew"
                />
              </div>
              <div className="col-span-1 md:col-span-4">
                <MediaTile
                  className="relative aspect-[9/16] w-full overflow-hidden bg-placeholder"
                  video={{ src: '/videos/letche-sornettes.mp4', poster: '/images/fete-musique/letche.jpg' }}
                  caption="Letche"
                />
              </div>
            </div>

            <AnimatedSection delay={0.2}>
              <p className="mt-10 font-body text-[1.05rem] leading-[1.9] text-blanc/50 md:w-3/4">
                Live at Sornettes for the Fête de la Musique. A warm June evening,
                the shopfront opened onto the street, music spilling out into
                Paris. The first time the label played out loud, in the wild.
              </p>
            </AnimatedSection>
          </div>
        </section>

        {/* ═══════ 005 · COMING SOON ═══════ */}
        <section className="relative overflow-hidden py-24 md:py-32">
          <ParallaxImage
            src="/images/duo/img_5597.jpg"
            alt=""
            className="absolute inset-0"
            speed={0.1}
          />
          <div className="absolute inset-0 bg-noir/70" />
          <div className="relative z-10 px-5 md:px-8">
            <div className="mx-auto max-w-6xl">
              <AnimatedSection blur>
                <SectionHeader
                  kicker="What's next"
                  title={<>Coming soon<span className="text-terracotta">.</span></>}
                  folio="005"
                  className="flex items-end justify-between"
                  titleClassName="mt-3 font-display text-[clamp(2.5rem,8vw,6rem)] font-bold leading-[0.9]"
                />
              </AnimatedSection>

              <AnimatedSection delay={0.15}>
                <p className="mt-6 max-w-xl font-body text-[1.05rem] leading-[1.8] text-blanc/55">
                  New dates are in the works. Follow us to know first — or bring us
                  to your floor.
                </p>
              </AnimatedSection>

              {/* Upcoming — compact timeline */}
              <div className="mt-10 border-t border-blanc/10">
                {comingSoonSlots.map((slot, i) => (
                  <AnimatedSection key={slot.tag} delay={i * 0.08}>
                    <div className="group flex items-center justify-between gap-4 border-b border-blanc/10 py-4 transition-colors hover:bg-blanc/[0.02]">
                      <div className="flex items-baseline gap-4 md:gap-6">
                        <span className="font-condensed text-[0.55rem] tracking-[0.3em] text-terracotta-light">
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <span className="w-16 shrink-0 font-condensed text-[0.6rem] uppercase tracking-[0.3em] text-terracotta-light md:w-24">
                          {slot.tag}
                        </span>
                        <span className="font-display text-[1.1rem] font-bold leading-none text-blanc/70 md:text-[1.4rem]">
                          {slot.city}
                        </span>
                      </div>
                      <span className="shrink-0 font-condensed text-[0.6rem] uppercase tracking-[0.3em] text-blanc/55">
                        {slot.when}
                      </span>
                    </div>
                  </AnimatedSection>
                ))}
              </div>

              {/* Booking CTA */}
              <AnimatedSection delay={0.3}>
                <div className="mt-16 flex flex-col items-start gap-6 border-t border-blanc/10 pt-12 md:flex-row md:items-end md:justify-between">
                  <div>
                    <ScrollRevealText>
                      <p className="font-display text-[clamp(1.5rem,4vw,2.6rem)] font-bold leading-[1.15]">
                        Want Small Records
                        <br />
                        at your event?
                      </p>
                    </ScrollRevealText>
                    <p className="mt-4 font-body text-[0.95rem] text-blanc/55">
                      Bookings, festivals, collaborations — let&apos;s talk.
                    </p>
                  </div>
                  <div className="flex flex-col gap-3">
                    <a
                      href="mailto:contact@small-records.com"
                      className="font-display text-[1.1rem] font-bold transition-colors hover:text-terracotta"
                    >
                      contact@small-records.com
                    </a>
                    <div className="flex gap-6">
                      <a
                        href="https://www.instagram.com/smallmusics"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-condensed text-[0.65rem] uppercase tracking-[0.3em] text-blanc/55 transition-colors hover:text-terracotta"
                      >
                        Instagram
                      </a>
                      <a
                        href="https://linktr.ee/smallrecords_music"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-condensed text-[0.65rem] uppercase tracking-[0.3em] text-blanc/55 transition-colors hover:text-terracotta"
                      >
                        Linktree
                      </a>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </section>
      </main>
    </PageTransition>
  )
}
