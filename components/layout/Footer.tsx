import Image from 'next/image'
import { HorizontalRule } from '@/components/animation/HorizontalRule'

export function Footer() {
  return (
    <>
      <HorizontalRule color="bg-blanc/10" />
      <footer className="px-5 py-12 md:px-8">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-8">
          <div className="h-12 w-12">
            <img
              src="/images/logo/logo-white.png"
              alt="Small Records"
              className="h-full w-full object-contain"
              style={{ filter: 'invert(1)' }}
            />
          </div>
          <p className="font-condensed text-[0.6rem] uppercase tracking-[0.4em] text-blanc/25">
            Small Records · Paris · 2025
          </p>
          <div className="flex gap-8">
            <a
              href="https://www.instagram.com/smallmusics"
              target="_blank"
              rel="noopener noreferrer"
              className="font-condensed text-[0.6rem] uppercase tracking-[0.3em] text-blanc/30 transition-colors hover:text-terracotta"
            >
              Instagram
            </a>
            <a
              href="https://soundcloud.com/casae"
              target="_blank"
              rel="noopener noreferrer"
              className="font-condensed text-[0.6rem] uppercase tracking-[0.3em] text-blanc/30 transition-colors hover:text-terracotta"
            >
              SoundCloud
            </a>
            <a
              href="https://linktr.ee/smallrecords_music"
              target="_blank"
              rel="noopener noreferrer"
              className="font-condensed text-[0.6rem] uppercase tracking-[0.3em] text-blanc/30 transition-colors hover:text-terracotta"
            >
              Linktree
            </a>
          </div>
        </div>
      </footer>
    </>
  )
}
