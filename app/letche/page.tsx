import type { Metadata } from 'next'
import Image from 'next/image'
import { AnimatedSection } from '@/components/animation/AnimatedSection'
import { ParallaxImage } from '@/components/animation/ParallaxImage'
import { HorizontalRule } from '@/components/animation/HorizontalRule'
import { PageTransition } from '@/components/animation/PageTransition'
import { Marquee } from '@/components/magazine/Marquee'
import { SoundCloudEmbed } from '@/components/magazine/SoundCloudEmbed'

export const metadata: Metadata = {
  title: 'Letche | Small Records',
  description:
    'Techno, Breaks, Ambient, Baile Funk. Co-founder of Small Records. Paris.',
}

export default function LetchePage() {
  return (
    <PageTransition>
      <main className="min-h-screen bg-noir text-blanc">
        {/* ═══════ COVER - Different from Casae: title at top ═══════ */}
        <section className="relative min-h-[100svh] overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src="/images/letech/img_5611.jpg"
              alt="DJ Letche"
              fill
              className="object-cover object-top"
              priority
              unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-b from-noir/60 via-transparent to-noir/40" />
          </div>

          <div className="relative z-10 flex min-h-[100svh] flex-col justify-between px-5 pb-10 pt-20 md:px-8">
            <div>
              <AnimatedSection delay={0.2} direction="none" blur>
                <p className="font-condensed text-[0.55rem] uppercase tracking-[0.5em] text-blanc/40">
                  Artist Profile · 04
                </p>
              </AnimatedSection>
              <AnimatedSection duration={1} scale>
                <h1 className="mt-4 font-display text-[clamp(5rem,20vw,16rem)] font-bold leading-[0.8] tracking-tight">
                  Letche
                </h1>
              </AnimatedSection>
            </div>

            {/* Genre tags - vertical on desktop, horizontal on mobile */}
            <AnimatedSection delay={0.3} direction="right">
              <div className="flex flex-wrap gap-3 md:flex-col md:items-end md:gap-2">
                {['Techno', 'Breaks', 'Ambient', 'Baile Funk'].map((tag) => (
                  <span
                    key={tag}
                    className="border border-blanc/20 px-4 py-2 font-condensed text-[0.65rem] uppercase tracking-[0.2em] text-blanc/60"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </AnimatedSection>
          </div>
        </section>

        <Marquee items={['Techno', 'Breaks', 'Ambient', 'Baile Funk', 'Curiosity', 'Energy']} speed={20} />

        {/* ═══════ BIO - Over photo background ═══════ */}
        <section className="relative overflow-hidden py-20 md:py-28">
          <ParallaxImage
            src="/images/letech/img_5659.jpg"
            alt="Letche portrait"
            className="absolute inset-0"
            speed={0.1}
          />
          <div className="absolute inset-0 bg-noir/70" />
          <div className="relative z-10 px-5 md:px-8">
            <div className="mx-auto max-w-5xl">
            <AnimatedSection>
              <span className="font-condensed text-[0.55rem] uppercase tracking-[0.5em] text-terracotta">
                Bio
              </span>
              <HorizontalRule color="bg-blanc/20" className="mt-4 !w-10" />
            </AnimatedSection>
            <AnimatedSection delay={0.1}>
              <div className="mt-10 grid gap-8 md:grid-cols-2 md:gap-12">
                <p className="drop-cap font-body text-[1.1rem] leading-[2] text-blanc/65">
                  Co-founder of Small Records, Letche explores the darker, more
                  textured side of electronic music. His selections weave between
                  techno, breaks, ambient, and baile funk. Always searching for
                  the unexpected.
                </p>
                <p className="font-body text-[1.1rem] leading-[2] text-blanc/65">
                  A true digger at heart, he listens before he judges, explores
                  before he defines. His sets are journeys, built on curiosity,
                  not convention.
                </p>
              </div>
            </AnimatedSection>
            </div>
          </div>
        </section>

        {/* ═══════ PHOTO STRIP ═══════ */}
        <section className="px-5 py-4 md:px-8">
          <div className="grid grid-cols-12 gap-3">
            <AnimatedSection className="col-span-6 md:col-span-7">
              <div className="relative aspect-[4/3] w-full overflow-hidden">
                <Image
                  src="/images/letech/img_5615.jpg"
                  alt="Letche"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            </AnimatedSection>
            <AnimatedSection className="col-span-6 md:col-span-5" delay={0.1}>
              <div className="relative aspect-[4/3] w-full overflow-hidden">
                <Image
                  src="/images/letech/img_5604.jpg"
                  alt="Letche"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* ═══════ SOUNDCLOUD ═══════ */}
        <HorizontalRule color="bg-blanc/10" />
        <section className="px-5 py-20 md:px-8">
          <AnimatedSection>
            <div className="mx-auto max-w-4xl">
              <div className="mb-8 flex items-end justify-between">
                <div>
                  <span className="font-condensed text-[0.55rem] uppercase tracking-[0.5em] text-terracotta">
                    Listen
                  </span>
                  <h2 className="mt-2 font-display text-section font-bold">
                    Selected Mixes
                  </h2>
                </div>
                <span className="hidden font-condensed text-[0.55rem] uppercase tracking-[0.3em] text-blanc/20 md:block">
                  006
                </span>
              </div>
              <SoundCloudEmbed url="https://soundcloud.com/letchetony" height={300} />
            </div>
          </AnimatedSection>
        </section>

        {/* ═══════ BOOKING ═══════ */}
        <HorizontalRule color="bg-blanc/10" />
        <AnimatedSection>
          <section className="px-5 py-16 md:px-8">
            <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 text-center">
              <span className="font-condensed text-[0.55rem] uppercase tracking-[0.5em] text-terracotta">
                Booking & Contact
              </span>
              <p className="font-display text-[clamp(1.2rem,3vw,2rem)] font-bold">
                letche@smallrecords.com
              </p>
              <div className="flex gap-8">
                <a
                  href="https://www.instagram.com/smallmusics"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-condensed text-[0.65rem] uppercase tracking-[0.3em] text-blanc/40 transition-colors hover:text-terracotta"
                >
                  Instagram
                </a>
                <a
                  href="https://soundcloud.com/letchetony"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-condensed text-[0.65rem] uppercase tracking-[0.3em] text-blanc/40 transition-colors hover:text-terracotta"
                >
                  SoundCloud
                </a>
              </div>
            </div>
          </section>
        </AnimatedSection>
      </main>
    </PageTransition>
  )
}
