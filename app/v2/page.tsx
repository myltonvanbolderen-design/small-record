import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { AnimatedSection } from '@/components/animation/AnimatedSection'
import { ScrollRevealText } from '@/components/animation/ScrollRevealText'
import { PageTransition } from '@/components/animation/PageTransition'
import { YouTubeEmbed } from '@/components/magazine/YouTubeEmbed'
import { Marquee } from '@/components/magazine/Marquee'
import { FlipImage } from '@/components/magazine/FlipImage'
import { Polaroid } from '@/components/v2/Polaroid'
import { ScribbleArrow } from '@/components/v2/ScribbleArrow'
import { MarkerHighlight } from '@/components/v2/MarkerHighlight'
import { SpeechBubble } from '@/components/v2/SpeechBubble'
import { Sticker } from '@/components/v2/Sticker'
import { WobbleHover } from '@/components/v2/WobbleHover'
import { PaperBackground } from '@/components/v2/PaperBackground'
import { DoodleCursor } from '@/components/v2/DoodleCursor'

export const metadata: Metadata = {
  title: 'Small Records · V2',
  description:
    'Independent music label. House, Techno, Baile Funk, Afrohouse. Paris.',
  robots: { index: false, follow: false },
}

const PAPER = '#FFF8E7'
const ENCRE = '#1a1a1a'
const ORANGE = '#FF8C42'
const ROSE = '#FFD6E0'
const CIEL = '#B5DCFF'
const JAUNE = '#FFE57C'

export default function HomePageV2() {
  return (
    <PageTransition>
      <DoodleCursor />

      <main
        className="relative min-h-screen"
        style={{ backgroundColor: PAPER, color: ENCRE }}
      >
        {/* V2 marker */}
        <div className="fixed left-4 top-20 z-[60] rounded-full border-2 border-[#1a1a1a] bg-[#FFE57C] px-3 py-1 font-condensed text-[0.6rem] uppercase tracking-[0.3em] text-[#1a1a1a] shadow-[2px_2px_0_0_rgba(0,0,0,0.2)]">
          V2 · TEST
        </div>

        {/* ═══════ 1 · COVER — cahier d'école chaotique ═══════ */}
        <section className="relative min-h-[110svh] overflow-hidden pb-24 pt-28 md:pt-32">
          <PaperBackground variant="cream" />

          {/* Issue meta — top left */}
          <div className="absolute left-5 top-24 z-10 md:left-10 md:top-28">
            <p
              className="font-pig text-[1.4rem] leading-none text-[#1a1a1a]/70"
              style={{ transform: 'rotate(-3deg)' }}
            >
              Issue N°01
            </p>
            <p
              className="mt-2 font-dog text-[1.1rem] text-[#1a1a1a]/60"
              style={{ transform: 'rotate(2deg)' }}
            >
              Paris · 2026
            </p>
          </div>

          {/* Sticker — read me */}
          <div className="absolute right-5 top-24 z-10 md:right-12 md:top-28">
            <Sticker bg={ORANGE} rotate={8} size="md" shape="round">
              Read me!
            </Sticker>
          </div>

          {/* Main polaroid + title — center */}
          <div className="relative z-10 mx-auto mt-12 max-w-6xl px-5 md:mt-16 md:px-10">
            <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-12">
              <div className="md:col-span-6">
                <WobbleHover amount={1.5}>
                  <Polaroid
                    src="/images/duo/img_5717.jpg"
                    alt="Casae & Letche"
                    caption="Casae & Letche · Paris"
                    rotate={-4}
                    tape="top"
                    tapeColor="rgba(255, 200, 100, 0.75)"
                    aspect="portrait"
                    className="w-full max-w-[460px]"
                    priority
                  />
                </WobbleHover>
              </div>

              <div className="relative md:col-span-6">
                <h1
                  className="pointer-events-none select-none font-pig leading-[0.85] text-[#1a1a1a]"
                  style={{
                    fontSize: 'clamp(4rem, 13vw, 11rem)',
                    transform: 'rotate(-3deg)',
                  }}
                >
                  <span className="block">Small</span>
                  <span className="block">
                    Records<span style={{ color: ORANGE }}>.</span>
                  </span>
                </h1>

                {/* Annotation arrow + text */}
                <div className="absolute -left-6 top-[60%] hidden items-center gap-2 md:flex">
                  <ScribbleArrow
                    variant="curve-up-left"
                    color={ENCRE}
                    width={120}
                    height={70}
                  />
                </div>

                <p
                  className="mt-8 max-w-md font-dog text-[1.55rem] leading-[1.5] text-[#1a1a1a]/85"
                  style={{ transform: 'rotate(-1deg)' }}
                >
                  We are diggers. We search.
                  <br />
                  We listen. We feel.
                </p>
              </div>
            </div>

            {/* Annotation pointing to polaroid */}
            <div
              className="absolute left-[28%] top-[12%] hidden md:block"
              style={{ transform: 'rotate(8deg)' }}
            >
              <p className="font-dog text-[1.2rem] text-[#FF8C42]">
                ← these guys
              </p>
            </div>
          </div>

          {/* Decorative scattered elements */}
          <div
            className="absolute bottom-12 left-8 hidden md:block"
            style={{ transform: 'rotate(-15deg)' }}
          >
            <p className="font-dog text-[2rem] text-[#FF8C42]">♪ ♫</p>
          </div>
          <div className="absolute bottom-8 right-8 hidden md:block">
            <ScribbleArrow variant="loop-down" color={ENCRE} width={80} height={70} />
          </div>
          <span
            className="absolute bottom-4 left-1/2 -translate-x-1/2 font-condensed text-[0.55rem] tracking-[0.3em] text-[#1a1a1a]/40"
          >
            001
          </span>
        </section>

        {/* ═══════ MARQUEE ═══════ */}
        <div style={{ background: ENCRE }}>
          <Marquee
            items={['House', 'Techno', 'Baile Funk', 'Afrohouse', 'Disco', 'Ambient', 'Grooves', 'Breaks']}
            speed={25}
          />
        </div>

        {/* ═══════ 2 · MANIFESTO — scrapbook spread ═══════ */}
        <section className="relative overflow-hidden py-24 md:py-32">
          <PaperBackground variant="lined" />

          <div className="relative z-10 mx-auto max-w-6xl px-5 md:px-10">
            <AnimatedSection>
              <Sticker bg={CIEL} rotate={-4} size="sm" shape="rect" className="mb-6">
                Manifesto
              </Sticker>
            </AnimatedSection>

            <div className="grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-10">
              <div className="md:col-span-7">
                <AnimatedSection delay={0.1}>
                  <h2
                    className="font-pig leading-[0.95]"
                    style={{ fontSize: 'clamp(2.4rem, 6.5vw, 5.5rem)' }}
                  >
                    Music is not
                    <br />
                    a product.
                    <br />
                    <span style={{ display: 'inline-block', transform: 'rotate(-2deg)' }}>
                      <ScrollRevealText>
                        It&apos;s a{' '}
                        <MarkerHighlight color={JAUNE} rotate={-2}>
                          link
                        </MarkerHighlight>{' '}
                        between{' '}
                        <MarkerHighlight color={ROSE} rotate={1}>
                          people
                        </MarkerHighlight>
                        .
                      </ScrollRevealText>
                    </span>
                  </h2>
                </AnimatedSection>

                <AnimatedSection delay={0.3}>
                  <div className="mt-10 flex items-center gap-4">
                    <ScribbleArrow
                      variant="wavy-right"
                      color={ORANGE}
                      width={90}
                      height={20}
                    />
                    <span className="font-dog text-[1.2rem] text-[#FF8C42]">
                      true story
                    </span>
                  </div>
                </AnimatedSection>

                <AnimatedSection delay={0.4}>
                  <p
                    className="mt-10 font-dog text-[1.5rem] leading-[1.55] text-[#1a1a1a]/85"
                    style={{ maxWidth: '52ch' }}
                  >
                    Small Records was born from friendship and passion. Not from
                    strategy. It started with conversations. Long nights. Vinyl
                    records. Shared discoveries. We don&apos;t belong to one
                    sound. House, disco, techno, ambient, grooves, breaks. If it
                    moves us, it lives with us.
                  </p>
                </AnimatedSection>
              </div>

              <div className="relative md:col-span-5">
                <AnimatedSection delay={0.2} direction="right">
                  <div className="absolute right-0 top-0">
                    <Polaroid
                      src="/images/duo/img_3148.jpg"
                      alt=""
                      rotate={5}
                      tape="corners"
                      tapeColor="rgba(181, 220, 255, 0.85)"
                      aspect="portrait"
                      className="w-[280px] md:w-[340px]"
                    />
                  </div>
                </AnimatedSection>
                <AnimatedSection delay={0.5} direction="right">
                  <div className="absolute -left-4 top-[55%] md:left-0">
                    <Polaroid
                      src="/images/duo/img_3171.jpg"
                      alt=""
                      caption="Sacré-Cœur"
                      rotate={-7}
                      tape="top"
                      tapeColor="rgba(255, 214, 224, 0.9)"
                      aspect="square"
                      className="w-[220px] md:w-[260px]"
                    />
                  </div>
                </AnimatedSection>
                {/* spacer to give vertical room for absolutely positioned polaroids */}
                <div className="h-[640px] md:h-[680px]" />
              </div>
            </div>
          </div>

          <span className="absolute bottom-6 right-6 font-condensed text-[0.55rem] tracking-[0.3em] text-[#1a1a1a]/30">
            002
          </span>
        </section>

        {/* ═══════ 3 · FLIP IMAGE as polaroid ═══════ */}
        <section className="relative py-12 md:py-16">
          <PaperBackground variant="cream" />
          <div className="relative z-10 mx-auto max-w-5xl px-5 md:px-10">
            <WobbleHover amount={1}>
              <div
                className="bg-white p-3 pb-12 shadow-[0_10px_30px_rgba(0,0,0,0.18)]"
                style={{ transform: 'rotate(-1.5deg)' }}
              >
                <FlipImage
                  images={['/images/duo/img_5564.jpg', '/images/duo/img_5568.jpg']}
                  alt="Small Records"
                  interval={500}
                  className="aspect-[16/9] w-full"
                />
                <p
                  className="mt-3 text-center font-dog text-[1.1rem] text-[#1a1a1a]/70"
                  style={{ transform: 'rotate(0.5deg)' }}
                >
                  les escaliers · between two takes
                </p>
              </div>
            </WobbleHover>
          </div>
        </section>

        {/* ═══════ 4 · CHOOSE YOUR FIGHTER ═══════ */}
        <section className="relative py-20 md:py-28">
          <PaperBackground variant="dots" />
          <div className="relative z-10 mx-auto max-w-6xl px-5 md:px-10">
            <AnimatedSection>
              <div className="mb-12 flex items-end justify-between md:mb-16">
                <div className="flex items-center gap-4">
                  <Sticker bg={ROSE} rotate={-5} size="sm" shape="rect">
                    The Crew
                  </Sticker>
                  <h2
                    className="font-pig leading-none"
                    style={{ fontSize: 'clamp(2rem, 5vw, 4rem)' }}
                  >
                    <span style={{ display: 'inline-block', transform: 'rotate(-1deg)' }}>
                      Choose your
                    </span>{' '}
                    <MarkerHighlight color={ORANGE} rotate={1}>
                      fighter
                    </MarkerHighlight>
                    <span style={{ color: ORANGE }}>.</span>
                  </h2>
                </div>
                <span className="hidden font-condensed text-[0.55rem] uppercase tracking-[0.3em] text-[#1a1a1a]/30 md:block">
                  003
                </span>
              </div>
            </AnimatedSection>

            <div className="grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-8">
              {/* CASAE CARD */}
              <AnimatedSection direction="left" delay={0.1}>
                <Link href="/casae" className="group block">
                  <WobbleHover amount={1.5}>
                    <article
                      className="relative overflow-hidden border-[3px] border-[#1a1a1a] bg-white p-6 shadow-[8px_8px_0_0_rgba(255,140,66,0.85)] transition-shadow group-hover:shadow-[12px_12px_0_0_rgba(255,140,66,0.85)]"
                      style={{ borderRadius: '24px 18px 26px 16px' }}
                    >
                      <div className="absolute -right-3 -top-3">
                        <Sticker bg={JAUNE} rotate={12} size="sm" shape="round">
                          01
                        </Sticker>
                      </div>

                      <div
                        className="relative mb-5 aspect-[4/5] w-full overflow-hidden border-[2.5px] border-[#1a1a1a]"
                        style={{ borderRadius: '16px 12px 18px 14px' }}
                      >
                        <Image
                          src="/images/casae/img_5547.jpg"
                          alt="DJ Casae"
                          fill
                          className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.04]"
                          unoptimized
                        />
                      </div>

                      <h3
                        className="font-pig leading-none"
                        style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)' }}
                      >
                        Casae<span style={{ color: ORANGE }}>.</span>
                      </h3>

                      <p className="mt-3 font-condensed text-[0.65rem] uppercase tracking-[0.3em] text-[#1a1a1a]/50">
                        Skills
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {['House', 'Disco', 'Grooves', 'Afrohouse'].map((g, i) => (
                          <span
                            key={g}
                            className="inline-block border-[2px] border-[#1a1a1a] bg-[#FFD6E0] px-3 py-1 font-dog text-[1rem] leading-none"
                            style={{
                              borderRadius: '12px 8px 14px 10px',
                              transform: `rotate(${i % 2 === 0 ? -2 : 2}deg)`,
                            }}
                          >
                            {g}
                          </span>
                        ))}
                      </div>

                      <div className="mt-6 flex items-center gap-3">
                        <span className="font-dog text-[1.1rem] text-[#FF8C42]">
                          tap to learn more
                        </span>
                        <ScribbleArrow
                          variant="wavy-right"
                          color={ORANGE}
                          width={50}
                          height={20}
                        />
                      </div>
                    </article>
                  </WobbleHover>
                </Link>
              </AnimatedSection>

              {/* LETCHE CARD */}
              <AnimatedSection direction="right" delay={0.2}>
                <Link href="/letche" className="group block">
                  <WobbleHover amount={1.5}>
                    <article
                      className="relative overflow-hidden border-[3px] border-[#1a1a1a] bg-white p-6 shadow-[8px_8px_0_0_rgba(181,220,255,0.95)] transition-shadow group-hover:shadow-[12px_12px_0_0_rgba(181,220,255,0.95)]"
                      style={{ borderRadius: '18px 24px 16px 26px' }}
                    >
                      <div className="absolute -left-3 -top-3">
                        <Sticker bg={CIEL} rotate={-12} size="sm" shape="round">
                          02
                        </Sticker>
                      </div>

                      <div
                        className="relative mb-5 aspect-[4/5] w-full overflow-hidden border-[2.5px] border-[#1a1a1a]"
                        style={{ borderRadius: '12px 16px 14px 18px' }}
                      >
                        <Image
                          src="/images/letech/img_5611.jpg"
                          alt="DJ Letche"
                          fill
                          className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.04]"
                          unoptimized
                        />
                      </div>

                      <h3
                        className="font-pig leading-none"
                        style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)' }}
                      >
                        Letche<span style={{ color: ORANGE }}>.</span>
                      </h3>

                      <p className="mt-3 font-condensed text-[0.65rem] uppercase tracking-[0.3em] text-[#1a1a1a]/50">
                        Skills
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {['Techno', 'Breaks', 'Ambient', 'Baile Funk'].map((g, i) => (
                          <span
                            key={g}
                            className="inline-block border-[2px] border-[#1a1a1a] bg-[#B5DCFF] px-3 py-1 font-dog text-[1rem] leading-none"
                            style={{
                              borderRadius: '8px 14px 10px 12px',
                              transform: `rotate(${i % 2 === 0 ? 2 : -2}deg)`,
                            }}
                          >
                            {g}
                          </span>
                        ))}
                      </div>

                      <div className="mt-6 flex items-center gap-3">
                        <span className="font-dog text-[1.1rem] text-[#FF8C42]">
                          tap to learn more
                        </span>
                        <ScribbleArrow
                          variant="wavy-right"
                          color={ORANGE}
                          width={50}
                          height={20}
                        />
                      </div>
                    </article>
                  </WobbleHover>
                </Link>
              </AnimatedSection>
            </div>
          </div>
        </section>

        {/* ═══════ 5 · PULL QUOTE — speech bubble ═══════ */}
        <section className="relative py-24 md:py-28">
          <PaperBackground variant="cream" />
          <div className="relative z-10 mx-auto max-w-5xl px-5 md:px-10">
            <div className="grid grid-cols-1 items-end gap-10 md:grid-cols-12">
              <div className="md:col-span-5">
                <AnimatedSection direction="left">
                  <Polaroid
                    src="/images/duo/img_5564.jpg"
                    alt="Small Records on the stairs"
                    caption="on the stairs"
                    rotate={-3}
                    tape="top"
                    tapeColor="rgba(255, 200, 100, 0.75)"
                    aspect="square"
                    className="w-full max-w-[380px]"
                  />
                </AnimatedSection>
              </div>

              <div className="relative md:col-span-7">
                <AnimatedSection delay={0.2} direction="right">
                  <SpeechBubble
                    tail="bottom-left"
                    fill="#FFFFFF"
                    stroke={ENCRE}
                    rotate={1.5}
                    className="w-full"
                  >
                    <p
                      className="font-pig leading-[1.05]"
                      style={{ fontSize: 'clamp(1.6rem, 3.6vw, 2.8rem)' }}
                    >
                      &ldquo;We don&apos;t chase trends.
                      <br />
                      We{' '}
                      <MarkerHighlight color={JAUNE} rotate={-1}>
                        document
                      </MarkerHighlight>{' '}
                      energy.&rdquo;
                    </p>
                  </SpeechBubble>
                </AnimatedSection>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════ MARQUEE 2 ═══════ */}
        <div style={{ background: ENCRE }}>
          <Marquee
            items={['Freedom', 'Passion', 'Eclecticism', 'Open-mindedness', 'Authenticity', 'Community']}
            speed={30}
          />
        </div>

        {/* ═══════ 6 · VIDEO FEATURE ═══════ */}
        <section className="relative py-20 md:py-28">
          <PaperBackground variant="cream" />
          <div className="relative z-10 mx-auto max-w-5xl px-5 md:px-10">
            <AnimatedSection>
              <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
                <div className="flex items-center gap-4">
                  <Sticker bg={ORANGE} rotate={-6} size="sm" shape="round">
                    Listen!
                  </Sticker>
                  <div>
                    <h2
                      className="font-pig leading-none"
                      style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)' }}
                    >
                      House Mix · Pool Party
                    </h2>
                    <p className="mt-2 font-dog text-[1.15rem] text-[#1a1a1a]/60">
                      Summer DJ Set · South of France
                    </p>
                  </div>
                </div>
                <span className="font-condensed text-[0.55rem] uppercase tracking-[0.3em] text-[#1a1a1a]/30">
                  004
                </span>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.2}>
              <div
                className="overflow-hidden border-[3px] border-[#1a1a1a] bg-white p-3 shadow-[10px_10px_0_0_rgba(255,229,124,0.95)]"
                style={{ borderRadius: '20px 16px 22px 18px' }}
              >
                <YouTubeEmbed videoId="X9rpsIVIVgk" />
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* ═══════ 7 · DNA — corkboard pinned cards ═══════ */}
        <section className="relative py-20 md:py-28">
          <PaperBackground variant="grid" />
          <div className="relative z-10 mx-auto max-w-6xl px-5 md:px-10">
            <AnimatedSection>
              <div className="mb-12 flex items-center gap-4">
                <Sticker bg={JAUNE} rotate={3} size="sm" shape="rect">
                  Our DNA
                </Sticker>
                <h2
                  className="font-pig leading-none"
                  style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.6rem)' }}
                >
                  what makes us tick
                </h2>
              </div>
            </AnimatedSection>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-10">
              {[
                {
                  title: 'Eclecticism',
                  text: "We don't belong to one sound. House, disco, techno, ambient, grooves, breaks. If it moves us, it lives with us.",
                  bg: ROSE,
                  rot: -2,
                },
                {
                  title: 'Freedom',
                  text: 'No creative constraints. No industry pressure. No algorithmic identity. Only artistic instinct.',
                  bg: CIEL,
                  rot: 2.5,
                },
                {
                  title: 'Passion',
                  text: 'We release what we love. We play what we believe in. We build slowly, honestly.',
                  bg: JAUNE,
                  rot: -1.5,
                },
                {
                  title: 'Open-mindedness',
                  text: 'We listen before we judge. We explore before we define. We collaborate before we compete.',
                  bg: '#C8F0C8',
                  rot: 3,
                },
              ].map((item, i) => (
                <AnimatedSection
                  key={item.title}
                  direction={i % 2 === 0 ? 'left' : 'right'}
                  delay={i * 0.08}
                >
                  <article
                    className="relative border-[3px] border-[#1a1a1a] p-7 shadow-[6px_6px_0_0_rgba(0,0,0,0.18)]"
                    style={{
                      background: item.bg,
                      borderRadius:
                        i % 2 === 0
                          ? '22px 16px 24px 18px'
                          : '16px 22px 18px 24px',
                      transform: `rotate(${item.rot}deg)`,
                    }}
                  >
                    {/* Pin */}
                    <div
                      aria-hidden
                      className="absolute -top-2 left-1/2 h-4 w-4 -translate-x-1/2 rounded-full border-[2px] border-[#1a1a1a] bg-[#FF4444] shadow-[1px_1px_0_0_rgba(0,0,0,0.3)]"
                    />
                    <span className="font-condensed text-[0.55rem] uppercase tracking-[0.3em] text-[#1a1a1a]/50">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <h3
                      className="mt-1 font-pig leading-none"
                      style={{ fontSize: 'clamp(1.6rem, 3vw, 2.4rem)' }}
                    >
                      {item.title}
                    </h3>
                    <p className="mt-4 font-dog text-[1.2rem] leading-[1.5] text-[#1a1a1a]/85">
                      {item.text}
                    </p>
                  </article>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════ 8 · CLOSING ═══════ */}
        <section className="relative py-28 md:py-36">
          <PaperBackground variant="cream" />
          <div className="relative z-10 mx-auto max-w-4xl px-5 text-center md:px-10">
            <AnimatedSection scale>
              <h2
                className="font-pig leading-[1.05]"
                style={{ fontSize: 'clamp(2rem, 5.5vw, 4.5rem)' }}
              >
                <MarkerHighlight color={ROSE} rotate={-2}>
                  Community
                </MarkerHighlight>{' '}
                over clout.
                <br />
                <ScrollRevealText>
                  <MarkerHighlight color={JAUNE} rotate={1}>
                    Depth
                  </MarkerHighlight>{' '}
                  over hype.
                </ScrollRevealText>
                <br />
                <ScrollRevealText>
                  <MarkerHighlight color={CIEL} rotate={-1}>
                    Authenticity
                  </MarkerHighlight>{' '}
                  over noise.
                </ScrollRevealText>
              </h2>
            </AnimatedSection>

            <AnimatedSection delay={0.4}>
              <div className="mt-12 flex flex-col items-center gap-3">
                <ScribbleArrow
                  variant="loop-down"
                  color={ORANGE}
                  width={70}
                  height={70}
                />
                <p
                  className="font-pig text-[2rem] text-[#1a1a1a]/70 md:text-[2.4rem]"
                  style={{ transform: 'rotate(-2deg)' }}
                >
                  Small in name.
                </p>
                <p
                  className="font-pig text-[2rem] text-[#FF8C42] md:text-[2.4rem]"
                  style={{ transform: 'rotate(1deg)' }}
                >
                  Limitless in spirit.
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.6}>
              <p
                className="mt-12 font-dog text-[1.1rem] text-[#1a1a1a]/50"
                style={{ transform: 'rotate(-1deg)' }}
              >
                made with ♥ in Paris · Casae & Letche
              </p>
            </AnimatedSection>
          </div>
        </section>
      </main>
    </PageTransition>
  )
}
