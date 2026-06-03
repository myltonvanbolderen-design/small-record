import type { Metadata } from 'next'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'Carousel · Instagram Export',
  robots: { index: false, follow: false },
}

const SLIDE_W = 1080
const SLIDE_H = 1350

function SlideFrame({
  index,
  total,
  children,
}: {
  index: number
  total: number
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex w-full max-w-[1080px] items-center justify-between px-2 font-condensed text-[0.6rem] uppercase tracking-[0.3em] text-blanc/40">
        <span>
          Slide {index} / {total}
        </span>
        <span>
          {SLIDE_W} × {SLIDE_H}
        </span>
      </div>
      <div
        data-slide={index}
        className="relative overflow-hidden bg-noir text-blanc shadow-2xl"
        style={{ width: SLIDE_W, height: SLIDE_H }}
      >
        {children}
      </div>
    </div>
  )
}

export default function CarouselPage() {
  const total = 7

  return (
    <main className="min-h-screen bg-[#1a1a1a] pb-32 pt-24 text-blanc">
      <header className="mx-auto mb-16 max-w-[1080px] px-5">
        <p className="font-condensed text-[0.6rem] uppercase tracking-[0.5em] text-terracotta">
          Export Tool
        </p>
        <h1 className="mt-3 font-display text-4xl font-bold leading-tight">
          Instagram Carousel · Meet the Crew
        </h1>
        <p className="mt-4 max-w-xl font-body text-sm leading-[1.8] text-blanc/60">
          7 slides at 1080 × 1350 (Instagram portrait 4:5). Screenshot each slide
          with Chrome DevTools: right-click the slide → Inspect → right-click the
          element → <em>Capture node screenshot</em>. Order preserves the carousel
          sequence.
        </p>
      </header>

      <div className="flex flex-col items-center gap-24">
        {/* ═══════ 1 · COVER ═══════ */}
        <SlideFrame index={1} total={total}>
          <Image
            src="/images/duo/img_3171.jpg"
            alt=""
            fill
            className="object-cover object-center"
            priority
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-b from-noir/70 via-noir/30 to-noir/90" />

          <div className="relative z-10 flex h-full flex-col justify-between p-16">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-condensed text-[0.7rem] uppercase tracking-[0.5em] text-blanc/60">
                  Issue · 01
                </p>
                <p className="mt-2 font-condensed text-[0.7rem] uppercase tracking-[0.5em] text-terracotta">
                  Paris · 2026
                </p>
              </div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/logo/logo-white.png"
                alt="Small Records"
                className="h-16 w-16"
                style={{ filter: 'invert(1)' }}
              />
            </div>

            <div>
              <p className="font-condensed text-[0.8rem] uppercase tracking-[0.5em] text-blanc/70">
                Meet the crew
              </p>
              <h2
                className="mt-6 font-display font-bold leading-[0.85] tracking-tight"
                style={{ fontSize: '170px' }}
              >
                Small
                <br />
                Records.
              </h2>
              <div className="mt-10 h-px w-24 bg-terracotta" />
              <p className="mt-6 max-w-md font-body text-[1.1rem] leading-[1.6] text-blanc/80">
                An independent label built on vinyl, curiosity, and the sounds
                that move the floor without asking permission.
              </p>
            </div>

            <div className="flex items-end justify-between">
              <p className="font-condensed text-[0.65rem] uppercase tracking-[0.4em] text-blanc/50">
                House · Techno · Disco · Baile Funk · Ambient
              </p>
              <p className="font-condensed text-[0.65rem] uppercase tracking-[0.4em] text-blanc/50">
                Swipe →
              </p>
            </div>
          </div>
        </SlideFrame>

        {/* ═══════ 2 · CASAE PORTRAIT ═══════ */}
        <SlideFrame index={2} total={total}>
          <Image
            src="/images/casae/img_5547.jpg"
            alt=""
            fill
            className="object-cover object-center"
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-t from-noir via-noir/20 to-transparent" />

          <div className="relative z-10 flex h-full flex-col justify-between p-16">
            <p className="font-condensed text-[0.7rem] uppercase tracking-[0.5em] text-blanc/60">
              Artist Profile · 01
            </p>

            <div>
              <div className="mb-6 h-px w-24 bg-terracotta" />
              <h2
                className="font-display font-bold leading-[0.8] tracking-tight"
                style={{ fontSize: '240px' }}
              >
                Casae.
              </h2>
              <p className="mt-8 font-condensed text-[1rem] uppercase tracking-[0.4em] text-blanc/70">
                Co-founder · Small Records
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                {['House', 'Disco', 'Grooves', 'Afrohouse'].map((tag) => (
                  <span
                    key={tag}
                    className="border border-blanc/30 px-5 py-2 font-condensed text-[0.75rem] uppercase tracking-[0.3em] text-blanc/80"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </SlideFrame>

        {/* ═══════ 3 · CASAE BIO ═══════ */}
        <SlideFrame index={3} total={total}>
          <Image
            src="/images/casae/img_5694.jpg"
            alt=""
            fill
            className="object-cover object-center"
            unoptimized
          />
          <div className="absolute inset-0 bg-noir/75" />

          <div className="relative z-10 flex h-full flex-col justify-between p-16">
            <div className="flex items-start justify-between">
              <p className="font-condensed text-[0.7rem] uppercase tracking-[0.5em] text-terracotta">
                On · Casae
              </p>
              <p className="font-condensed text-[0.7rem] uppercase tracking-[0.5em] text-blanc/40">
                02 / 07
              </p>
            </div>

            <div className="max-w-[820px]">
              <p
                className="font-display font-bold leading-[1.1]"
                style={{ fontSize: '62px' }}
              >
                &ldquo;Music as instinct.
                <br />
                <span className="text-terracotta">Not calculation.</span>&rdquo;
              </p>
              <div className="mt-10 h-px w-24 bg-blanc/40" />
              <p className="mt-8 font-body text-[1.3rem] leading-[1.7] text-blanc/85">
                Driven by a deep love for vinyl digging and warm, groove-heavy
                sounds. His sets move between house, disco, and afrohouse —
                always with a focus on rhythm and emotion over formula.
              </p>
            </div>

            <div className="flex items-end justify-between">
              <p className="font-condensed text-[0.75rem] uppercase tracking-[0.3em] text-blanc/60">
                soundcloud.com/casae
              </p>
              <p className="font-condensed text-[0.65rem] uppercase tracking-[0.4em] text-blanc/40">
                Swipe →
              </p>
            </div>
          </div>
        </SlideFrame>

        {/* ═══════ 4 · LETCHE PORTRAIT ═══════ */}
        <SlideFrame index={4} total={total}>
          <Image
            src="/images/letech/img_5611.jpg"
            alt=""
            fill
            className="object-cover object-center"
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-b from-noir via-noir/20 to-noir/60" />

          <div className="relative z-10 flex h-full flex-col justify-between p-16">
            <div className="flex items-start justify-between">
              <p className="font-condensed text-[0.7rem] uppercase tracking-[0.5em] text-blanc/60">
                Artist Profile · 02
              </p>
              <p className="font-condensed text-[0.7rem] uppercase tracking-[0.5em] text-terracotta">
                04 / 07
              </p>
            </div>

            <div className="text-right">
              <h2
                className="font-display font-bold leading-[0.8] tracking-tight"
                style={{ fontSize: '240px' }}
              >
                Letche.
              </h2>
              <div className="ml-auto mt-6 h-px w-24 bg-terracotta" />
              <p className="mt-6 font-condensed text-[1rem] uppercase tracking-[0.4em] text-blanc/70">
                Co-founder · Small Records
              </p>
              <div className="mt-8 flex flex-wrap justify-end gap-3">
                {['Techno', 'Breaks', 'Ambient', 'Baile Funk'].map((tag) => (
                  <span
                    key={tag}
                    className="border border-blanc/30 px-5 py-2 font-condensed text-[0.75rem] uppercase tracking-[0.3em] text-blanc/80"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </SlideFrame>

        {/* ═══════ 5 · LETCHE BIO ═══════ */}
        <SlideFrame index={5} total={total}>
          <Image
            src="/images/letech/img_5659.jpg"
            alt=""
            fill
            className="object-cover object-center"
            unoptimized
          />
          <div className="absolute inset-0 bg-noir/75" />

          <div className="relative z-10 flex h-full flex-col justify-between p-16">
            <div className="flex items-start justify-between">
              <p className="font-condensed text-[0.7rem] uppercase tracking-[0.5em] text-terracotta">
                On · Letche
              </p>
              <p className="font-condensed text-[0.7rem] uppercase tracking-[0.5em] text-blanc/40">
                05 / 07
              </p>
            </div>

            <div className="max-w-[820px]">
              <p
                className="font-display font-bold leading-[1.1]"
                style={{ fontSize: '62px' }}
              >
                &ldquo;Listens before he judges.
                <br />
                <span className="text-terracotta">
                  Explores before he defines.
                </span>
                &rdquo;
              </p>
              <div className="mt-10 h-px w-24 bg-blanc/40" />
              <p className="mt-8 font-body text-[1.3rem] leading-[1.7] text-blanc/85">
                A true digger at heart. Letche explores the darker, more
                textured side of electronic — weaving between techno, breaks,
                ambient, and baile funk. His sets are journeys, built on
                curiosity, not convention.
              </p>
            </div>

            <div className="flex items-end justify-between">
              <p className="font-condensed text-[0.75rem] uppercase tracking-[0.3em] text-blanc/60">
                soundcloud.com/letchetony
              </p>
              <p className="font-condensed text-[0.65rem] uppercase tracking-[0.4em] text-blanc/40">
                Swipe →
              </p>
            </div>
          </div>
        </SlideFrame>

        {/* ═══════ 6 · PULL QUOTE (DUO) ═══════ */}
        <SlideFrame index={6} total={total}>
          <Image
            src="/images/duo/img_5597.jpg"
            alt=""
            fill
            className="object-cover object-center"
            unoptimized
          />
          <div className="absolute inset-0 bg-noir/60" />

          <div className="relative z-10 flex h-full flex-col justify-between p-16">
            <p className="font-condensed text-[0.7rem] uppercase tracking-[0.5em] text-blanc/60">
              Manifesto
            </p>

            <div className="text-center">
              <p
                className="font-display font-bold leading-[1.1] drop-shadow-2xl"
                style={{ fontSize: '96px' }}
              >
                &ldquo;We listen
                <br />
                before we judge.
                <br />
                <span className="text-terracotta">We explore</span>
                <br />
                before we define.&rdquo;
              </p>
              <div className="mx-auto mt-12 h-px w-24 bg-blanc/50" />
              <p className="mt-6 font-condensed text-[0.9rem] uppercase tracking-[0.5em] text-blanc/70">
                — Small Records
              </p>
            </div>

            <p className="text-center font-condensed text-[0.65rem] uppercase tracking-[0.4em] text-blanc/40">
              Swipe for booking →
            </p>
          </div>
        </SlideFrame>

        {/* ═══════ 7 · CTA ═══════ */}
        <SlideFrame index={7} total={total}>
          <div className="absolute inset-0 bg-noir" />
          <div className="absolute inset-0 opacity-30">
            <Image
              src="/images/duo/img_5717.jpg"
              alt=""
              fill
              className="object-cover object-center"
              unoptimized
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-noir/70 via-noir/80 to-noir" />

          <div className="relative z-10 flex h-full flex-col justify-between p-16">
            <div className="flex items-start justify-between">
              <p className="font-condensed text-[0.7rem] uppercase tracking-[0.5em] text-terracotta">
                Stay close
              </p>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/logo/logo-white.png"
                alt="Small Records"
                className="h-14 w-14"
                style={{ filter: 'invert(1)' }}
              />
            </div>

            <div>
              <p className="font-condensed text-[0.85rem] uppercase tracking-[0.5em] text-blanc/60">
                Follow · Listen · Book
              </p>
              <h2
                className="mt-6 font-display font-bold leading-[0.9] tracking-tight"
                style={{ fontSize: '130px' }}
              >
                @smallmusics
              </h2>
              <div className="mt-10 h-px w-24 bg-terracotta" />
              <div className="mt-10 grid grid-cols-1 gap-6 font-body text-[1.3rem] text-blanc/85">
                <div>
                  <p className="font-condensed text-[0.65rem] uppercase tracking-[0.4em] text-blanc/40">
                    Mixes
                  </p>
                  <p className="mt-2">soundcloud.com/casae</p>
                  <p>soundcloud.com/letchetony</p>
                </div>
                <div>
                  <p className="font-condensed text-[0.65rem] uppercase tracking-[0.4em] text-blanc/40">
                    Booking
                  </p>
                  <p className="mt-2">casae@smallrecords.com</p>
                  <p>letche@smallrecords.com</p>
                </div>
                <div>
                  <p className="font-condensed text-[0.65rem] uppercase tracking-[0.4em] text-blanc/40">
                    All links
                  </p>
                  <p className="mt-2">linktr.ee/smallrecords_music</p>
                </div>
              </div>
            </div>

            <p className="text-center font-condensed text-[0.65rem] uppercase tracking-[0.5em] text-blanc/40">
              Small Records · Paris · 2026
            </p>
          </div>
        </SlideFrame>
      </div>
    </main>
  )
}
