import Image from 'next/image'
import Link from 'next/link'
import { AppLink } from '@/components/magazine/AppLink'
import type { AppTarget } from '@/lib/app-links'

interface LinkRowProps {
  href: string
  label: string
  sublabel?: string
  kind?: 'internal' | 'external' | 'mail'
  thumb?: { src: string; alt: string }
  glyph?: string
  app?: AppTarget
}

const rowClass =
  'group flex min-h-11 w-full items-center justify-between gap-3 border border-blanc/15 px-3 py-2 transition-colors hover:border-terracotta hover:bg-blanc/5 md:min-h-12 md:px-4'

function RowContent({
  label,
  sublabel,
  thumb,
  glyph = '→',
}: {
  label: string
  sublabel?: string
  thumb?: { src: string; alt: string }
  glyph?: string
}) {
  return (
    <>
      {thumb ? (
        <span className="relative h-8 w-14 shrink-0 overflow-hidden">
          <Image src={thumb.src} alt={thumb.alt} fill className="object-cover" sizes="56px" />
        </span>
      ) : null}
      <span className="flex min-w-0 flex-1 items-baseline gap-3">
        <span className="shrink-0 font-condensed text-[0.8rem] uppercase tracking-[0.2em] text-blanc">
          {label}
        </span>
        {sublabel ? (
          <span className="truncate font-body text-[0.7rem] text-blanc/55">{sublabel}</span>
        ) : null}
      </span>
      <span
        aria-hidden="true"
        className="shrink-0 font-condensed text-blanc/40 transition-transform group-hover:translate-x-1"
      >
        {glyph}
      </span>
    </>
  )
}

export function LinkRow({
  href,
  label,
  sublabel,
  kind = 'internal',
  thumb,
  glyph,
  app,
}: LinkRowProps) {
  if (kind === 'external') {
    if (app) {
      return (
        <AppLink href={href} app={app} className={rowClass}>
          <RowContent label={label} sublabel={sublabel} thumb={thumb} glyph={glyph} />
        </AppLink>
      )
    }
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={rowClass}>
        <RowContent label={label} sublabel={sublabel} thumb={thumb} glyph={glyph} />
      </a>
    )
  }

  if (kind === 'mail') {
    return (
      <a href={href} className={rowClass}>
        <RowContent label={label} sublabel={sublabel} thumb={thumb} glyph={glyph} />
      </a>
    )
  }

  return (
    <Link href={href} className={rowClass}>
      <RowContent label={label} sublabel={sublabel} thumb={thumb} glyph={glyph} />
    </Link>
  )
}
