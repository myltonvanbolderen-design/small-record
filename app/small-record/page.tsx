import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { AnimatedSection } from '@/components/animation/AnimatedSection'
import { ParallaxImage } from '@/components/animation/ParallaxImage'
import { ScrollRevealText } from '@/components/animation/ScrollRevealText'
import { HorizontalRule } from '@/components/animation/HorizontalRule'
import { PageTransition } from '@/components/animation/PageTransition'
import { Marquee } from '@/components/magazine/Marquee'
import { YouTubeEmbed } from '@/components/magazine/YouTubeEmbed'
import { VideoLoop } from '@/components/magazine/VideoLoop'
import { FlipImage } from '@/components/magazine/FlipImage'

export const metadata: Metadata = {
  title: 'Small Records | The Label',
  description:
    'Independent music label founded by Letche & Casae. Paris.',
}

export default function SmallRecordPage() {
  return (
    <PageTransition>
      <main className="min-h-screen bg-noir text-blanc">
        {/* ═══════ COVER - Logo-centered, different from home ═══════ */}
        <section className="relative min-h-[100svh] overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src="/images/duo/img_3179.jpg"
              alt="Small Records crew"
              fill
              className="object-cover"
              priority
              unoptimized
            />
          </div>

          <div className="relative z-10 flex min-h-[100svh] flex-col items-center justify-center px-5 text-center md:px-8">
            {/* Big gnome logo as cover centerpiece */}
            <AnimatedSection scale blur duration={1.2}>
              <div className="mx-auto h-32 w-32 md:h-48 md:w-48">
                <img
                  src="/images/logo/logo-white.png"
                  alt="Small Records"
                  className="h-full w-full object-contain"
                  style={{ filter: 'invert(1)' }}
                />
              </div>
            </AnimatedSection>
            <AnimatedSection delay={0.3} blur>
              <h1 className="mt-8 font-display text-[clamp(2.5rem,8vw,6rem)] font-bold leading-[0.9] tracking-tight">
                Small Records<span className="text-terracotta">.</span>
              </h1>
              <p className="mt-4 font-condensed text-[0.65rem] uppercase tracking-[0.5em] text-blanc/40">
                Independent Music Label · Paris
              </p>
            </AnimatedSection>
          </div>
        </section>

        <Marquee items={['Independent', 'Passionate', 'Curious', 'Free', 'Authentic', 'United']} speed={25} />

        {/* ═══════ THE STORY - Origin + manifesto fused ═══════ */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src="/images/duo/img_5551.jpg"
              alt=""
              fill
              className="object-cover opacity-10"
              unoptimized
            />
          </div>
          <div className="relative z-10 px-5 py-24 md:px-8 md:py-32">
            <div className="mx-auto max-w-5xl">
              <AnimatedSection>
                <span className="font-condensed text-[0.55rem] uppercase tracking-[0.5em] text-terracotta">
                  The Story
                </span>
                <h2 className="mt-6 font-display text-[clamp(2.2rem,5vw,4.5rem)] font-bold leading-[1.05]">
                  It started with conversations.
                  <br />
                  <ScrollRevealText>
                    It grew into a label.
                  </ScrollRevealText>
                </h2>
              </AnimatedSection>

              <HorizontalRule color="bg-terracotta" className="mt-10 !w-16" delay={0.2} />

              <AnimatedSection delay={0.2}>
                <div className="mt-12 grid gap-10 md:grid-cols-2">
                  <div>
                    <p className="drop-cap font-body text-[1.1rem] leading-[2] text-blanc/60">
                      Small Records is an independent music label founded by two
                      friends:{' '}
                      <strong className="text-blanc">Letche & Casae</strong>.
                      Long nights. Vinyl records. Shared discoveries. We are
                      diggers. We search. We listen. We feel.
                    </p>
                  </div>
                  <div className="space-y-6">
                    <p className="font-body text-[1.1rem] leading-[2] text-blanc/60">
                      We select music not by genre, but by emotion. We don&apos;t
                      belong to one sound. House, disco, techno, ambient, grooves,
                      breaks. If it moves us, it lives with us.
                    </p>
                    <p className="font-display text-[1.3rem] font-bold leading-[1.4] text-blanc/80">
                      Born from friendship and passion. Never from strategy.
                    </p>
                  </div>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </section>

        {/* ═══════ FULL BLEED PHOTO + pull quote ═══════ */}
        <section className="relative h-[50svh] w-full md:h-[70vh]">
          <ParallaxImage
            src="/images/duo/img_3277.jpg"
            alt="Casae & Letche"
            className="absolute inset-0"
            speed={0.15}
          />
          <div className="absolute inset-0 z-10 flex items-end px-5 pb-8 md:px-8 md:pb-12">
            <AnimatedSection blur>
              <p className="font-display text-[clamp(1.3rem,3vw,2.2rem)] font-bold leading-[1.3] drop-shadow-lg">
                &ldquo;We don&apos;t chase trends.
                <br />
                We document energy.&rdquo;
              </p>
            </AnimatedSection>
          </div>
          <span className="absolute bottom-6 right-5 z-10 font-condensed text-[0.55rem] tracking-[0.3em] text-blanc/15 md:right-8">
            003
          </span>
        </section>

        <Marquee items={['House', 'Techno', 'Disco', 'Ambient', 'Baile Funk', 'Grooves', 'Breaks']} speed={20} />

        {/* ═══════ WHAT WE DO ═══════ */}
        <section className="px-5 py-20 md:px-8 md:py-28">
          <div className="mx-auto max-w-5xl">
            <AnimatedSection blur>
              <div className="flex items-end justify-between">
                <span className="font-condensed text-[0.55rem] uppercase tracking-[0.5em] text-terracotta">
                  What We Do
                </span>
                <span className="hidden font-condensed text-[0.55rem] uppercase tracking-[0.3em] text-blanc/20 md:block">
                  004
                </span>
              </div>
            </AnimatedSection>

            <div className="mt-12 grid gap-8 md:grid-cols-2 md:gap-12">
              {[
                {
                  title: 'An independent label',
                  desc: 'No major label, no compromises. Every release is a choice we believe in, not a contract we signed.',
                },
                {
                  title: 'A collective of artists',
                  desc: 'Curated by instinct, not algorithm. We bring together people who share the same obsession for digging.',
                },
                {
                  title: 'A platform for original content',
                  desc: 'Music that deserves to be heard. We highlight sounds from the underground that move bodies and minds.',
                },
                {
                  title: 'A space for creative experiments',
                  desc: 'Where ideas become records. No format, no formula. Just the freedom to try something new.',
                },
              ].map((item, i) => (
                <AnimatedSection key={item.title} delay={i * 0.1} direction={i % 2 === 0 ? 'left' : 'right'}>
                  <div className="border-l-2 border-terracotta/30 py-3 pl-6">
                    <span className="font-condensed text-[0.5rem] tracking-[0.2em] text-terracotta/50">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <h3 className="mt-1 font-display text-[1.4rem] font-bold">
                      {item.title}
                    </h3>
                    <p className="mt-3 font-body text-[1rem] leading-[1.8] text-blanc/50">
                      {item.desc}
                    </p>
                  </div>
                </AnimatedSection>
              ))}
            </div>

            <AnimatedSection delay={0.4}>
              <p className="mt-16 font-body text-[1.05rem] leading-[2] text-blanc/45 md:w-2/3">
                We create and curate original music beyond borders. We share
                everything that came before us. Music is transmission.
                We don&apos;t chase trends. We document energy.
              </p>
            </AnimatedSection>
          </div>
        </section>

        {/* ═══════ PHOTO EDITORIAL - Bigger, 7/5 split ═══════ */}
        <section className="px-5 py-4 md:px-8">
          <div className="grid grid-cols-12 gap-3">
            <div className="col-span-12 md:col-span-7">
              <div className="relative aspect-[4/3] w-full overflow-hidden">
                <Image
                  src="/images/duo/img_5568.jpg"
                  alt="Small Records"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            </div>
            <div className="col-span-12 md:col-span-5">
              <div className="relative aspect-[4/3] w-full overflow-hidden">
                <Image
                  src="/images/duo/img_5537.jpg"
                  alt="Small Records"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            </div>
          </div>
        </section>

        {/* ═══════ FLIP IMAGE ═══════ */}
        <section className="px-5 py-4 md:px-8">
          <FlipImage
            images={['/images/duo/img_3234.jpg', '/images/duo/img_3235.jpg']}
            alt="Small Records"
            interval={500}
            className="aspect-[3/4] w-full"
          />
        </section>

        {/* ═══════ LIVE - Fete de la Musique at Sornettes ═══════ */}
        <HorizontalRule color="bg-blanc/10" />
        <section className="px-5 py-20 md:px-8 md:py-28">
          <div className="mx-auto max-w-6xl">
            <AnimatedSection blur>
              <div className="mb-10 flex items-end justify-between md:mb-12">
                <div>
                  <span className="font-condensed text-[0.55rem] uppercase tracking-[0.5em] text-terracotta">
                    Live
                  </span>
                  <h2 className="mt-2 font-display text-[clamp(1.8rem,4vw,3rem)] font-bold leading-[1.05]">
                    Fete de la Musique
                  </h2>
                  <p className="mt-2 font-body text-[0.95rem] text-blanc/40">
                    Sornettes · Paris · June 2025
                  </p>
                </div>
                <span className="hidden font-condensed text-[0.55rem] uppercase tracking-[0.3em] text-blanc/20 md:block">
                  006
                </span>
              </div>
            </AnimatedSection>

            {/* Asymmetric grid: 2 vertical videos + 1 photo */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-12 md:gap-5">
              {/* Casae video */}
              <div className="md:col-span-4">
                <div className="relative aspect-[9/16] w-full overflow-hidden bg-placeholder">
                  <VideoLoop
                    src="/videos/casae-sornettes.mp4"
                    poster="/images/fete-musique/casae.jpg"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-noir/90 to-transparent p-4">
                    <span className="font-condensed text-[0.55rem] uppercase tracking-[0.3em] text-terracotta">
                      Casae
                    </span>
                  </div>
                </div>
              </div>

              {/* Center duo photo */}
              <div className="md:col-span-4">
                <div className="relative aspect-[9/16] w-full overflow-hidden">
                  <Image
                    src="/images/fete-musique/casae-live.jpg"
                    alt="Casae mixing at Sornettes"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-noir/90 to-transparent p-4">
                    <span className="font-condensed text-[0.55rem] uppercase tracking-[0.3em] text-terracotta">
                      The Crew
                    </span>
                  </div>
                </div>
              </div>

              {/* Letche video */}
              <div className="md:col-span-4">
                <div className="relative aspect-[9/16] w-full overflow-hidden bg-placeholder">
                  <VideoLoop
                    src="/videos/letche-sornettes.mp4"
                    poster="/images/fete-musique/letche.jpg"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-noir/90 to-transparent p-4">
                    <span className="font-condensed text-[0.55rem] uppercase tracking-[0.3em] text-terracotta">
                      Letche
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <AnimatedSection delay={0.3}>
              <p className="mt-10 font-body text-[1.05rem] leading-[1.9] text-blanc/50 md:w-3/4">
                Live at Sornettes for the Fete de la Musique. A warm June evening,
                the shopfront opened onto the street, music spilling out into
                Paris. This is what Small Records sounds like in the wild.
              </p>
            </AnimatedSection>
          </div>
        </section>

        {/* ═══════ MANIFESTO - Full width over photo ═══════ */}
        <section className="relative overflow-hidden py-24 md:py-32">
          <ParallaxImage
            src="/images/duo/img_5597.jpg"
            alt=""
            className="absolute inset-0"
            speed={0.1}
          />
          <div className="relative z-10 px-5 md:px-8">
            <div className="mx-auto max-w-5xl">
              <AnimatedSection blur>
                <span className="font-condensed text-[0.55rem] uppercase tracking-[0.5em] text-terracotta">
                  Manifesto
                </span>
              </AnimatedSection>
              <div className="mt-10 grid gap-12 md:grid-cols-2">
                <div className="space-y-4 font-display text-[clamp(1.4rem,3vw,2.2rem)] font-bold leading-[1.3]">
                  <AnimatedSection><p>We are two friends.</p></AnimatedSection>
                  <AnimatedSection delay={0.05}><p>We are independent.</p></AnimatedSection>
                  <AnimatedSection delay={0.1}><p>We are curious.</p></AnimatedSection>
                  <AnimatedSection delay={0.15}><p>We are diggers.</p></AnimatedSection>
                </div>
                <div className="flex flex-col justify-between">
                  <div className="space-y-4 font-display text-[clamp(1.4rem,3vw,2.2rem)] font-bold leading-[1.3]">
                    <ScrollRevealText><p>We don&apos;t fit into boxes.</p></ScrollRevealText>
                    <ScrollRevealText><p>We don&apos;t need permission.</p></ScrollRevealText>
                    <ScrollRevealText><p>We don&apos;t follow rules we didn&apos;t choose.</p></ScrollRevealText>
                  </div>
                  <AnimatedSection delay={0.3}>
                    <p className="mt-10 font-display text-[clamp(1.6rem,4vw,3rem)] font-bold leading-tight text-terracotta">
                      Small in name.
                      <br />
                      Limitless in spirit.
                    </p>
                  </AnimatedSection>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════ VIDEO MIX ═══════ */}
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
                  005
                </span>
              </div>
              <YouTubeEmbed videoId="X9rpsIVIVgk" />
            </div>
          </AnimatedSection>
        </section>

        {/* ═══════ ARTIST TEASE - Portrait ratio ═══════ */}
        <HorizontalRule color="bg-blanc/10" />
        <section className="px-5 py-20 md:px-8">
          <div className="mx-auto max-w-5xl">
            <AnimatedSection blur>
              <span className="font-condensed text-[0.55rem] uppercase tracking-[0.5em] text-terracotta">
                The Artists
              </span>
            </AnimatedSection>
            <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <Link href="/casae" className="group relative block overflow-hidden">
                  <div className="relative aspect-[3/4] w-full">
                    <Image
                      src="/images/casae/img_5649.jpg"
                      alt="Casae"
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                      unoptimized
                    />
                    <div className="absolute bottom-6 left-6">
                      <span className="font-condensed text-[0.5rem] uppercase tracking-[0.3em] text-terracotta">
                        03
                      </span>
                      <p className="font-display text-[clamp(2rem,5vw,3rem)] font-bold leading-none">
                        Casae
                      </p>
                      <p className="mt-2 font-body text-[0.85rem] text-blanc/40">
                        House · Disco · Grooves
                      </p>
                    </div>
                  </div>
                </Link>
              </div>
              <div>
                <Link href="/letche" className="group relative block overflow-hidden">
                  <div className="relative aspect-[3/4] w-full">
                    <Image
                      src="/images/letech/img_5615.jpg"
                      alt="Letche"
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                      unoptimized
                    />
                    <div className="absolute bottom-6 left-6">
                      <span className="font-condensed text-[0.5rem] uppercase tracking-[0.3em] text-terracotta">
                        04
                      </span>
                      <p className="font-display text-[clamp(2rem,5vw,3rem)] font-bold leading-none">
                        Letche
                      </p>
                      <p className="mt-2 font-body text-[0.85rem] text-blanc/40">
                        Techno · Breaks · Ambient
                      </p>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════ BOOKING ═══════ */}
        <HorizontalRule color="bg-blanc/10" />
        <AnimatedSection>
          <section className="px-5 py-16 md:px-8">
            <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 text-center">
              <div className="h-12 w-12">
                <img
                  src="/images/logo/logo-white.png"
                  alt="Small Records"
                  className="h-full w-full object-contain"
                  style={{ filter: 'invert(1)' }}
                />
              </div>
              <span className="font-condensed text-[0.55rem] uppercase tracking-[0.5em] text-terracotta">
                Booking & Contact
              </span>
              <p className="font-display text-[clamp(1.2rem,3vw,2rem)] font-bold">
                contact@smallrecords.com
              </p>
              <p className="font-body text-[0.95rem] text-blanc/40">
                For bookings, collaborations, and press inquiries.
              </p>
              <div className="flex gap-8">
                <a
                  href="https://www.instagram.com/smallmusics"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-condensed text-[0.65rem] uppercase tracking-[0.3em] text-blanc/30 transition-colors hover:text-terracotta"
                >
                  Instagram
                </a>
                <a
                  href="https://linktr.ee/smallrecords_music"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-condensed text-[0.65rem] uppercase tracking-[0.3em] text-blanc/30 transition-colors hover:text-terracotta"
                >
                  Linktree
                </a>
              </div>
            </div>
          </section>
        </AnimatedSection>
      </main>
    </PageTransition>
  )
}
