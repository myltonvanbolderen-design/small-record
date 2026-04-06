import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { AnimatedSection } from '@/components/animation/AnimatedSection'
import { ParallaxImage } from '@/components/animation/ParallaxImage'
import { HorizontalRule } from '@/components/animation/HorizontalRule'
import { PageTransition } from '@/components/animation/PageTransition'
import { Marquee } from '@/components/magazine/Marquee'
import { YouTubeEmbed } from '@/components/magazine/YouTubeEmbed'
import { ScrollRevealText } from '@/components/animation/ScrollRevealText'

export const metadata: Metadata = {
  title: 'Small Records | Independent Music Label',
  description:
    'We are diggers. We search. We listen. We feel. Independent music label founded by Casae & Letche. Paris.',
}

export default function HomePage() {
  return (
    <PageTransition>
      <main className="min-h-screen bg-noir text-blanc">
        {/* ═══════ COVER ═══════ */}
        <section className="relative min-h-[100svh] overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src="/images/duo/img_5717.jpg"
              alt="Casae & Letche"
              fill
              className="object-cover"
              priority
              unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-t from-noir via-noir/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-noir/50 to-transparent" />
          </div>

          <div className="relative z-10 flex min-h-[100svh] flex-col justify-between px-5 pb-8 pt-20 md:px-8">
            <AnimatedSection delay={0.3} direction="none" blur>
              <div className="flex items-start justify-between">
                <p className="font-condensed text-[0.55rem] uppercase tracking-[0.5em] text-blanc/40">
                  Issue N&deg;01
                </p>
                <p className="font-condensed text-[0.55rem] uppercase tracking-[0.5em] text-blanc/40">
                  Paris · 2025
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection duration={1} scale>
              <h1 className="pointer-events-none -mb-[3vw] select-none font-display text-[clamp(4rem,18vw,16rem)] font-bold leading-[0.85] tracking-[-0.02em]">
                <span className="block">Small</span>
                <span className="block">
                  Records<span className="text-terracotta">.</span>
                </span>
              </h1>
            </AnimatedSection>

            <AnimatedSection delay={0.4} blur className="mt-12">
              <p className="font-display text-[clamp(1.1rem,2.5vw,1.6rem)] font-bold leading-[1.4] text-blanc/70">
                We are diggers. We search.
                <br className="hidden md:block" />
                {' '}We listen. We feel.
              </p>
              <p className="mt-4 font-condensed text-[0.6rem] uppercase tracking-[0.3em] text-blanc/30">
                Casae & Letche · Paris
              </p>
            </AnimatedSection>
          </div>

          <span className="absolute bottom-8 left-5 z-10 font-condensed text-[0.55rem] tracking-[0.3em] text-blanc/20 md:left-8">
            001
          </span>
        </section>

        {/* ═══════ MARQUEE ═══════ */}
        <Marquee
          items={['House', 'Techno', 'Baile Funk', 'Afrohouse', 'Disco', 'Ambient', 'Grooves', 'Breaks']}
          speed={25}
        />

        {/* ═══════ MANIFESTO - Text overlaid on photo ═══════ */}
        <section className="relative min-h-[80svh] overflow-hidden">
          <ParallaxImage
            src="/images/duo/img_3148.jpg"
            alt="Small Records crew"
            className="absolute inset-0"
            speed={0.1}
          />
          <div className="absolute inset-0 bg-noir/60" />
          <div className="relative z-10 flex min-h-[80svh] flex-col justify-center px-5 py-20 md:px-8">
            <div className="mx-auto max-w-5xl">
              <AnimatedSection blur>
                <span className="font-condensed text-[0.55rem] uppercase tracking-[0.5em] text-terracotta">
                  The Manifesto
                </span>
              </AnimatedSection>
              <AnimatedSection delay={0.1}>
                <h2 className="mt-6 font-display text-[clamp(2.2rem,6vw,5rem)] font-bold leading-[1.05]">
                  Music is not a product.
                  <br />
                  <ScrollRevealText>
                    It&apos;s a link between people.
                  </ScrollRevealText>
                </h2>
              </AnimatedSection>
              <HorizontalRule color="bg-terracotta" className="mt-10 !w-16" delay={0.3} />
              <AnimatedSection delay={0.3}>
                <p className="drop-cap mt-10 font-body text-[1.1rem] leading-[2] text-blanc/60 md:w-2/3">
                  Small Records was born from friendship and passion. Not from
                  strategy. It started with conversations. Long nights. Vinyl
                  records. Shared discoveries. We don&apos;t belong to one sound.
                  House, disco, techno, ambient, grooves, breaks. If it moves us,
                  it lives with us.
                </p>
              </AnimatedSection>
            </div>
          </div>
          <span className="absolute bottom-6 right-5 z-10 font-condensed text-[0.55rem] tracking-[0.3em] text-blanc/15 md:right-8">
            002
          </span>
        </section>

        {/* ═══════ ARTIST SPREAD - Asymmetric ═══════ */}
        <HorizontalRule color="bg-blanc/10" />

        <section className="px-5 py-16 md:px-8 md:py-24">
          <AnimatedSection blur>
            <div className="mb-10 flex items-end justify-between md:mb-16">
              <div>
                <span className="font-condensed text-[0.55rem] uppercase tracking-[0.5em] text-terracotta">
                  The Artists
                </span>
                <h2 className="mt-2 font-display text-section font-bold">
                  Meet the crew
                </h2>
              </div>
              <span className="hidden font-condensed text-[0.55rem] uppercase tracking-[0.3em] text-blanc/20 md:block">
                003
              </span>
            </div>
          </AnimatedSection>

          {/* Asymmetric grid - Casae big left, Letche tall right */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-12 md:gap-5">
            <AnimatedSection direction="left" duration={0.9} className="md:col-span-7">
              <Link href="/casae" className="group relative block overflow-hidden">
                <div className="relative aspect-[4/5] w-full md:aspect-[3/4]">
                  <Image
                    src="/images/casae/img_5547.jpg"
                    alt="DJ Casae"
                    fill
                    className="object-cover object-top transition-transform duration-1000 group-hover:scale-[1.03]"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-noir/70 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-5 md:p-10">
                    <span className="font-condensed text-[0.55rem] uppercase tracking-[0.4em] text-terracotta">
                      03 · Artist
                    </span>
                    <h3 className="mt-2 font-display text-[clamp(3rem,8vw,5rem)] font-bold leading-[0.85]">
                      Casae
                    </h3>
                    <p className="mt-3 font-body text-[0.95rem] text-blanc/50">
                      House · Disco · Grooves · Afrohouse
                    </p>
                  </div>
                </div>
              </Link>
            </AnimatedSection>

            <AnimatedSection direction="right" delay={0.15} duration={0.9} className="md:col-span-5">
              <Link href="/letche" className="group relative block overflow-hidden">
                <div className="relative aspect-[4/5] w-full md:aspect-[2/3]">
                  <Image
                    src="/images/letech/img_5611.jpg"
                    alt="DJ Letche"
                    fill
                    className="object-cover object-top transition-transform duration-1000 group-hover:scale-[1.03]"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-noir/70 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-5 md:p-8">
                    <span className="font-condensed text-[0.55rem] uppercase tracking-[0.4em] text-terracotta">
                      04 · Artist
                    </span>
                    <h3 className="mt-2 font-display text-[clamp(3rem,8vw,5rem)] font-bold leading-[0.85]">
                      Letche
                    </h3>
                    <p className="mt-3 font-body text-[0.95rem] text-blanc/50">
                      Techno · Breaks · Ambient · Baile Funk
                    </p>
                  </div>
                </div>
              </Link>
            </AnimatedSection>
          </div>
        </section>

        {/* ═══════ FULL BLEED PHOTO + PULL QUOTE ═══════ */}
        <section className="relative h-[60svh] w-full md:h-[80vh]">
          <ParallaxImage
            src="/images/duo/img_5564.jpg"
            alt="Small Records on the stairs"
            className="absolute inset-0"
            speed={0.2}
          />
          <div className="absolute inset-0 bg-noir/30" />
          <div className="absolute inset-0 z-10 flex items-center justify-center px-5 text-center">
            <AnimatedSection scale blur>
              <p className="font-display text-[clamp(1.6rem,4vw,3.5rem)] font-bold leading-[1.2] drop-shadow-lg">
                &ldquo;We don&apos;t chase trends.
                <br />
                We document energy.&rdquo;
              </p>
            </AnimatedSection>
          </div>
        </section>

        {/* ═══════ MARQUEE 2 ═══════ */}
        <Marquee
          items={['Freedom', 'Passion', 'Eclecticism', 'Open-mindedness', 'Authenticity', 'Community']}
          speed={30}
        />

        {/* ═══════ VIDEO FEATURE ═══════ */}
        <section className="px-5 py-16 md:px-8 md:py-24">
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
                  004
                </span>
              </div>
              <YouTubeEmbed videoId="X9rpsIVIVgk" />
            </div>
          </AnimatedSection>
        </section>

        {/* ═══════ DNA - Over photo background ═══════ */}
        <section className="relative overflow-hidden py-20 md:py-28">
          <div className="absolute inset-0">
            <Image
              src="/images/duo/img_5551.jpg"
              alt=""
              fill
              className="object-cover opacity-20"
              unoptimized
            />
          </div>
          <div className="relative z-10 px-5 md:px-8">
            <div className="mx-auto max-w-5xl">
              <AnimatedSection blur>
                <span className="font-condensed text-[0.55rem] uppercase tracking-[0.5em] text-terracotta">
                  Our DNA
                </span>
              </AnimatedSection>
              <div className="mt-12 grid gap-x-12 gap-y-12 md:grid-cols-2">
                {[
                  {
                    title: 'Eclecticism',
                    text: "We don't belong to one sound. House, disco, techno, ambient, grooves, breaks. If it moves us, it lives with us.",
                  },
                  {
                    title: 'Freedom',
                    text: 'No creative constraints. No industry pressure. No algorithmic identity. Only artistic instinct.',
                  },
                  {
                    title: 'Passion',
                    text: 'We release what we love. We play what we believe in. We build slowly, honestly.',
                  },
                  {
                    title: 'Open-mindedness',
                    text: 'We listen before we judge. We explore before we define. We collaborate before we compete.',
                  },
                ].map((item, i) => (
                  <AnimatedSection
                    key={item.title}
                    direction={i % 2 === 0 ? 'left' : 'right'}
                    delay={i * 0.1}
                  >
                    <span className="font-condensed text-[0.5rem] uppercase tracking-[0.3em] text-terracotta/60">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <h3 className="mt-2 font-display text-[1.4rem] font-bold">
                      {item.title}
                    </h3>
                    <p className="mt-3 font-body text-[1rem] leading-[1.9] text-blanc/50">
                      {item.text}
                    </p>
                  </AnimatedSection>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ═══════ CLOSING VISION ═══════ */}
        <HorizontalRule color="bg-blanc/10" />
        <section className="px-5 py-24 md:px-8 md:py-32">
          <div className="mx-auto max-w-4xl text-center">
            <AnimatedSection scale blur duration={1}>
              <h2 className="font-display text-[clamp(2rem,5vw,4.5rem)] font-bold leading-[1.1]">
                Community over clout.
                <br />
                <ScrollRevealText>Depth over hype.</ScrollRevealText>
                <br />
                <ScrollRevealText>Authenticity over noise.</ScrollRevealText>
              </h2>
            </AnimatedSection>
            <HorizontalRule className="mx-auto mt-10 !w-16" color="bg-terracotta" delay={0.2} />
            <AnimatedSection delay={0.3} blur>
              <p className="mt-10 font-display text-[clamp(1.2rem,2.5vw,1.8rem)] font-bold text-blanc/40">
                Small in name. Limitless in spirit.
              </p>
            </AnimatedSection>
          </div>
        </section>

      </main>
    </PageTransition>
  )
}
