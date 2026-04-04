import type { Metadata } from 'next'
import Image from 'next/image'
import { AnimatedSection } from '@/components/animation/AnimatedSection'
import { ParallaxImage } from '@/components/animation/ParallaxImage'
import { HorizontalRule } from '@/components/animation/HorizontalRule'
import { PageTransition } from '@/components/animation/PageTransition'
import { PhotoSlider } from '@/components/magazine/PhotoSlider'
import { Marquee } from '@/components/magazine/Marquee'
import { SoundCloudEmbed } from '@/components/magazine/SoundCloudEmbed'

export const metadata: Metadata = {
  title: 'Casae — Small Record',
  description:
    'House, Disco, Grooves, Afrohouse. Co-founder of Small Record. Paris.',
}

export default function CasaePage() {
  return (
    <PageTransition>
      <main className="min-h-screen bg-noir text-blanc">
        {/* ═══════ COVER ═══════ */}
        <section className="relative min-h-[100svh] overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src="/images/casae/img_5547.jpg"
              alt="DJ Casae"
              fill
              className="object-cover object-top"
              priority
              unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-t from-noir via-noir/30 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-noir/50 to-transparent" />
          </div>

          <div className="relative z-10 flex min-h-[100svh] flex-col justify-between px-5 pb-10 pt-20 md:px-8">
            <AnimatedSection delay={0.2} direction="none" blur>
              <p className="font-condensed text-[0.55rem] uppercase tracking-[0.5em] text-blanc/40">
                Artist Profile — 03
              </p>
            </AnimatedSection>

            <AnimatedSection duration={1} scale>
              <h1 className="font-display text-[clamp(5rem,20vw,16rem)] font-bold leading-[0.8] tracking-tight">
                Casae
              </h1>
            </AnimatedSection>

            <AnimatedSection delay={0.3} blur>
              <div className="flex flex-wrap gap-3">
                {['House', 'Disco', 'Grooves', 'Afrohouse'].map((tag) => (
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

        <Marquee items={['House', 'Disco', 'Grooves', 'Afrohouse', 'Vinyl', 'Emotion']} speed={20} />

        {/* ═══════ BIO — Text left, photo right ═══════ */}
        <section className="grid grid-cols-1 md:grid-cols-12">
          <div className="order-2 flex flex-col justify-center px-5 py-16 md:order-1 md:col-span-5 md:px-10 md:py-24">
            <AnimatedSection direction="left">
              <span className="font-condensed text-[0.55rem] uppercase tracking-[0.5em] text-terracotta">
                Bio
              </span>
              <HorizontalRule color="bg-blanc/20" className="mt-4 !w-10" />
              <p className="drop-cap mt-8 font-body text-[1.05rem] leading-[2] text-blanc/65">
                Co-founder of Small Record, Casae is driven by a deep love for
                vinyl digging and warm, groove-heavy sounds. His sets move
                between house, disco, and afrohouse — always with a focus on
                rhythm and emotion over formula.
              </p>
              <p className="mt-5 font-body text-[1.05rem] leading-[2] text-blanc/65">
                Whether behind the decks or in the studio, he searches for the
                sounds that make people move without thinking. Music as instinct,
                not calculation.
              </p>
            </AnimatedSection>
          </div>
          <div className="relative order-1 min-h-[60svh] md:order-2 md:col-span-7 md:min-h-0">
            <ParallaxImage
              src="/images/casae/img_5694.jpg"
              alt="Casae portrait"
              className="absolute inset-0"
              speed={0.1}
            />
          </div>
        </section>

        {/* ═══════ PHOTO SLIDER ═══════ */}
        <section className="py-8">
          <PhotoSlider
            photos={[
              { src: '/images/casae/img_5542.jpg', alt: 'Casae' },
              { src: '/images/casae/img_5625.jpg', alt: 'Casae' },
              { src: '/images/casae/img_5600.jpg', alt: 'Casae' },
              { src: '/images/casae/img_5649.jpg', alt: 'Casae' },
              { src: '/images/casae/img_5545.jpg', alt: 'Casae' },
            ]}
          />
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
                  005
                </span>
              </div>
              <SoundCloudEmbed url="https://soundcloud.com/casae" height={300} />
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
                casae@smallrecord.com
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
                  href="https://soundcloud.com/casae"
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
