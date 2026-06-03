import type { Metadata } from 'next'
import Image from 'next/image'
import { AnimatedSection } from '@/components/animation/AnimatedSection'
import { ParallaxImage } from '@/components/animation/ParallaxImage'
import { ScrollRevealText } from '@/components/animation/ScrollRevealText'
import { HorizontalRule } from '@/components/animation/HorizontalRule'
import { PageTransition } from '@/components/animation/PageTransition'
import { Marquee } from '@/components/magazine/Marquee'
import { YouTubeEmbed } from '@/components/magazine/YouTubeEmbed'
import { VideoLoop } from '@/components/magazine/VideoLoop'

export const metadata: Metadata = {
  title: 'Events',
  description:
    'Small Records live — club nights, festivals and B2B sets. Paris and beyond.',
}

export default function EventsPage() {
  return (
    <PageTransition>
      <main className="min-h-screen bg-noir text-blanc">
        {/* ═══════ COVER ═══════ */}
        <section className="relative min-h-[100svh] overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src="/images/early-reflection/packed-room.jpg"
              alt="Small Records live"
              fill
              className="object-cover"
              priority
              unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-b from-noir/70 via-noir/30 to-noir" />
          </div>

          <div className="absolute top-20 left-5 right-5 z-10 md:left-8 md:right-8">
            <AnimatedSection delay={0.3} direction="none" blur>
              <div className="flex items-start justify-between">
                <p className="font-condensed text-[0.55rem] uppercase tracking-[0.5em] text-blanc/40">
                  Live & Booking
                </p>
                <p className="font-condensed text-[0.55rem] uppercase tracking-[0.5em] text-blanc/40">
                  Paris · 2026
                </p>
              </div>
            </AnimatedSection>
          </div>

          <div className="relative z-10 flex min-h-[100svh] flex-col justify-end px-5 pb-20 md:px-8 md:pb-24">
            <AnimatedSection blur>
              <span className="font-condensed text-[0.65rem] uppercase tracking-[0.5em] text-terracotta">
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
            <span className="mt-8 block font-condensed text-[0.55rem] tracking-[0.3em] text-blanc/20">
              000
            </span>
          </div>
        </section>

        <Marquee
          items={['Live', 'Club', 'Festival', 'B2B', 'Vinyl', 'Late Nights', 'Paris']}
          speed={25}
        />

        {/* ═══════ 001 · FÊTE DE LA MUSIQUE ═══════ */}
        <section className="px-5 py-20 md:px-8 md:py-28">
          <div className="mx-auto max-w-6xl">
            <AnimatedSection blur>
              <div className="mb-3 flex items-end justify-between">
                <div>
                  <span className="font-condensed text-[0.55rem] uppercase tracking-[0.5em] text-terracotta">
                    Past · Festival
                  </span>
                  <h2 className="mt-2 font-display text-[clamp(1.8rem,4vw,3rem)] font-bold leading-[1.05]">
                    Fête de la Musique
                  </h2>
                  <p className="mt-2 font-body text-[0.95rem] text-blanc/40">
                    Sornettes · Paris · June 2025
                  </p>
                </div>
                <span className="hidden font-condensed text-[0.55rem] uppercase tracking-[0.3em] text-blanc/20 md:block">
                  001
                </span>
              </div>
            </AnimatedSection>

            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-12 md:gap-5">
              <div className="md:col-span-4">
                <div className="relative aspect-[9/16] w-full overflow-hidden bg-placeholder">
                  <VideoLoop
                    src="/videos/casae-sornettes.mp4"
                    poster="/images/fete-musique/casae.jpg"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-noir/90 to-transparent p-4">
                    <span className="font-condensed text-[0.55rem] uppercase tracking-[0.3em] text-terracotta">
                      Casae
                    </span>
                  </div>
                </div>
              </div>
              <div className="md:col-span-4">
                <div className="relative aspect-[9/16] w-full overflow-hidden">
                  <Image
                    src="/images/fete-musique/casae-live.jpg"
                    alt="Small Records at Sornettes"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-noir/90 to-transparent p-4">
                    <span className="font-condensed text-[0.55rem] uppercase tracking-[0.3em] text-terracotta">
                      The Crew
                    </span>
                  </div>
                </div>
              </div>
              <div className="md:col-span-4">
                <div className="relative aspect-[9/16] w-full overflow-hidden bg-placeholder">
                  <VideoLoop
                    src="/videos/letche-sornettes.mp4"
                    poster="/images/fete-musique/letche.jpg"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-noir/90 to-transparent p-4">
                    <span className="font-condensed text-[0.55rem] uppercase tracking-[0.3em] text-terracotta">
                      Letche
                    </span>
                  </div>
                </div>
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

        {/* ═══════ 002 · FEATURED MIX ═══════ */}
        <HorizontalRule color="bg-blanc/10" />
        <section className="px-5 py-20 md:px-8 md:py-24">
          <AnimatedSection scale>
            <div className="mx-auto max-w-5xl">
              <div className="mb-8 flex items-end justify-between">
                <div>
                  <span className="font-condensed text-[0.55rem] uppercase tracking-[0.5em] text-terracotta">
                    Featured Mix
                  </span>
                  <h2 className="mt-2 font-display text-[clamp(1.5rem,3vw,2.5rem)] font-bold">
                    House Mix · Pool Party
                  </h2>
                  <p className="mt-2 font-body text-[0.95rem] text-blanc/40">
                    Summer DJ Set · South of France
                  </p>
                </div>
                <span className="hidden font-condensed text-[0.55rem] uppercase tracking-[0.3em] text-blanc/20 md:block">
                  002
                </span>
              </div>
              <YouTubeEmbed videoId="X9rpsIVIVgk" />
            </div>
          </AnimatedSection>
        </section>

        {/* ═══════ 003 · EARLY REFLECTION × GAMBETTA ═══════ */}
        <HorizontalRule color="bg-blanc/10" />
        <section className="px-5 py-20 md:px-8 md:py-28">
          <div className="mx-auto max-w-6xl">
            <AnimatedSection blur>
              <div className="mb-3 flex items-end justify-between">
                <div>
                  <span className="font-condensed text-[0.55rem] uppercase tracking-[0.5em] text-terracotta">
                    Past · Club Night
                  </span>
                  <h2 className="mt-2 font-display text-[clamp(1.8rem,4vw,3rem)] font-bold leading-[1.05]">
                    Gambetta Club
                  </h2>
                  <p className="mt-2 font-body text-[0.95rem] text-blanc/40">
                    Early Reflections × Small Records · Paris · April 2026
                  </p>
                </div>
                <span className="hidden font-condensed text-[0.55rem] uppercase tracking-[0.3em] text-blanc/20 md:block">
                  003
                </span>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.1}>
              <p className="mb-10 font-display text-[clamp(1.2rem,3vw,1.9rem)] font-bold leading-[1.2] text-blanc/80 md:mb-12">
                First time in the club.
                <br />
                <span className="text-terracotta">First time together.</span>
              </p>
            </AnimatedSection>

            {/* Hero — packed room */}
            <div className="relative aspect-[16/10] w-full overflow-hidden md:aspect-[16/8]">
              <Image
                src="/images/early-reflection/packed-room.jpg"
                alt="Packed room at Gambetta Club"
                fill
                className="object-cover"
                unoptimized
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-noir/90 to-transparent p-5 md:p-6">
                <span className="font-condensed text-[0.55rem] uppercase tracking-[0.3em] text-terracotta">
                  A packed room · 22:00 — 06:00
                </span>
              </div>
            </div>

            {/* Mixed gallery — photos + live loops */}
            <div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-3">
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-placeholder">
                <VideoLoop
                  src="/videos/gambetta-duo.mp4"
                  poster="/images/early-reflection/poster-duo.jpg"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-noir/90 to-transparent p-4">
                  <span className="font-condensed text-[0.55rem] uppercase tracking-[0.3em] text-terracotta">
                    B2B · Letche × Casæ
                  </span>
                </div>
              </div>
              <div className="relative aspect-[3/4] w-full overflow-hidden">
                <Image
                  src="/images/early-reflection/attitude.jpg"
                  alt="Casae and Letche"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-placeholder">
                <VideoLoop
                  src="/videos/gambetta-casae.mp4"
                  poster="/images/early-reflection/poster-casae.jpg"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-noir/90 to-transparent p-4">
                  <span className="font-condensed text-[0.55rem] uppercase tracking-[0.3em] text-terracotta">
                    Casæ
                  </span>
                </div>
              </div>
              <div className="relative aspect-[3/4] w-full overflow-hidden">
                <Image
                  src="/images/early-reflection/b2b-decks.jpg"
                  alt="Letche and Casae B2B at the decks"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-placeholder">
                <VideoLoop
                  src="/videos/gambetta-silhouette.mp4"
                  poster="/images/early-reflection/poster-silhouette.jpg"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-noir/90 to-transparent p-4">
                  <span className="font-condensed text-[0.55rem] uppercase tracking-[0.3em] text-terracotta">
                    3615 Radio
                  </span>
                </div>
              </div>
              <div className="relative aspect-[3/4] w-full overflow-hidden">
                <Image
                  src="/images/early-reflection/gnome-trophy.jpg"
                  alt="Small Records gnome trophy"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
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
                    <span className="font-condensed text-[0.55rem] uppercase tracking-[0.4em] text-terracotta">
                      Line-up
                    </span>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {['Letche', 'Casæ', 'DDG', 'Zeko', 'Copac', 'Scott Civil', 'Momal'].map(
                        (name) => (
                          <span
                            key={name}
                            className="border border-blanc/15 px-3 py-1.5 font-condensed text-[0.65rem] uppercase tracking-[0.2em] text-blanc/60"
                          >
                            {name}
                          </span>
                        ),
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-6 border-t border-blanc/10 pt-6">
                    <div>
                      <span className="font-condensed text-[0.55rem] uppercase tracking-[0.4em] text-blanc/30">
                        Venue
                      </span>
                      <p className="mt-2 font-body text-[0.95rem] leading-[1.6] text-blanc/55">
                        Le Gambetta Club
                        <br />
                        104 rue de Bagnolet
                        <br />
                        Paris 20
                      </p>
                    </div>
                    <div>
                      <span className="font-condensed text-[0.55rem] uppercase tracking-[0.4em] text-blanc/30">
                        Date
                      </span>
                      <p className="mt-2 font-body text-[0.95rem] leading-[1.6] text-blanc/55">
                        Thursday
                        <br />
                        April 30, 2026
                        <br />
                        22:00 — 06:00
                      </p>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </section>

        {/* ═══════ COMING SOON ═══════ */}
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
                <div className="flex items-end justify-between">
                  <div>
                    <span className="font-condensed text-[0.55rem] uppercase tracking-[0.5em] text-terracotta">
                      What&apos;s next
                    </span>
                    <h2 className="mt-3 font-display text-[clamp(2.5rem,8vw,6rem)] font-bold leading-[0.9]">
                      Coming soon<span className="text-terracotta">.</span>
                    </h2>
                  </div>
                  <span className="hidden font-condensed text-[0.55rem] uppercase tracking-[0.3em] text-blanc/20 md:block">
                    004
                  </span>
                </div>
              </AnimatedSection>

              <AnimatedSection delay={0.15}>
                <p className="mt-6 max-w-xl font-body text-[1.05rem] leading-[1.8] text-blanc/55">
                  New dates are in the works. Follow us to know first — or bring us
                  to your floor.
                </p>
              </AnimatedSection>

              {/* Upcoming — compact timeline */}
              <div className="mt-10 border-t border-blanc/10">
                {[
                  { tag: 'Club', city: 'Paris', when: 'Summer 2026' },
                  { tag: 'Festival', city: 'To be announced', when: '2026' },
                  { tag: 'B2B', city: 'Somewhere loud', when: 'Soon' },
                ].map((slot, i) => (
                  <AnimatedSection key={slot.tag} delay={i * 0.08}>
                    <div className="group flex items-center justify-between gap-4 border-b border-blanc/10 py-4 transition-colors hover:bg-blanc/[0.02]">
                      <div className="flex items-baseline gap-4 md:gap-6">
                        <span className="font-condensed text-[0.55rem] tracking-[0.3em] text-terracotta/70">
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <span className="w-16 shrink-0 font-condensed text-[0.6rem] uppercase tracking-[0.3em] text-terracotta md:w-24">
                          {slot.tag}
                        </span>
                        <span className="font-display text-[1.1rem] font-bold leading-none text-blanc/70 md:text-[1.4rem]">
                          {slot.city}
                        </span>
                      </div>
                      <span className="shrink-0 font-condensed text-[0.6rem] uppercase tracking-[0.3em] text-blanc/35">
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
                    <p className="mt-4 font-body text-[0.95rem] text-blanc/45">
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
                        className="font-condensed text-[0.65rem] uppercase tracking-[0.3em] text-blanc/40 transition-colors hover:text-terracotta"
                      >
                        Instagram
                      </a>
                      <a
                        href="https://linktr.ee/smallrecords_music"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-condensed text-[0.65rem] uppercase tracking-[0.3em] text-blanc/40 transition-colors hover:text-terracotta"
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
