import type { Metadata } from 'next'
import { SectionHeader } from '@/components/magazine/SectionHeader'
import { ContactSheet } from '@/components/lab/ContactSheet'
import { FILM_FRAMES } from '@/components/lab/frames'

export const metadata: Metadata = {
  title: 'Lab',
  robots: { index: false, follow: false },
}

export default function LabPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 pt-28 pb-32 md:px-8">
      <header>
        <span className="font-condensed text-[0.6rem] uppercase tracking-[0.5em] text-terracotta-light">
          Lab · test
        </span>
        <h1 className="mt-2 font-display text-[clamp(2.4rem,7vw,5.5rem)] font-bold leading-[0.95]">
          Fin de pellicule
        </h1>
        <p className="mt-3 text-blanc/55">
          Small Party @ Panic Room · 11.09.26 · 22 frames
        </p>
        <p className="mt-1 text-sm text-blanc/55">
          Two ideas for the site — pick what you like.
        </p>
      </header>

      <section id="contact-sheet" className="mt-20">
        <SectionHeader
          kicker="Idea 05"
          title="Planche contact"
          meta="Tap a frame to enlarge. Picks circled in red."
        />
        <ContactSheet frames={FILM_FRAMES} />
      </section>

      <section id="develop" className="mt-32 pb-[50vh]">
        <SectionHeader
          kicker="Idea 06"
          title="Développement"
          meta="The picks, developing as you scroll."
        />
      </section>
    </div>
  )
}
