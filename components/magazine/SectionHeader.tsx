import type { ReactNode } from 'react'

interface SectionHeaderProps {
  kicker: ReactNode
  title: ReactNode
  meta?: ReactNode
  folio?: string
  aside?: ReactNode
  className?: string
  titleClassName?: string
}

export function SectionHeader({
  kicker,
  title,
  meta,
  folio,
  aside,
  className = 'mb-3 flex items-end justify-between',
  titleClassName = 'mt-2 font-display text-[clamp(1.8rem,4vw,3rem)] font-bold leading-[1.05]',
}: SectionHeaderProps) {
  return (
    <div className={className}>
      <div>
        <span className="font-condensed text-[0.55rem] uppercase tracking-[0.5em] text-terracotta-light">
          {kicker}
        </span>
        <h2 className={titleClassName}>{title}</h2>
        {meta && (
          <p className="mt-2 font-body text-[0.95rem] text-blanc/55">{meta}</p>
        )}
      </div>
      {folio && (
        <span aria-hidden="true" className="hidden font-condensed text-[0.55rem] uppercase tracking-[0.3em] text-blanc/55 md:block">
          {folio}
        </span>
      )}
      {aside}
    </div>
  )
}
