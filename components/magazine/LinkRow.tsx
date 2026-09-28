import Link from 'next/link'

interface LinkRowProps {
  href: string
  label: string
  sublabel?: string
  kind?: 'internal' | 'external' | 'mail'
}

const rowClass =
  'group flex min-h-14 w-full items-center justify-between gap-4 border border-blanc/15 px-4 py-3 transition-colors hover:border-terracotta hover:bg-blanc/5'

function RowContent({ label, sublabel }: { label: string; sublabel?: string }) {
  return (
    <>
      <span className="flex flex-col gap-1">
        <span className="font-condensed text-[0.8rem] uppercase tracking-[0.2em] text-blanc">
          {label}
        </span>
        {sublabel ? (
          <span className="font-body text-[0.75rem] text-blanc/55">{sublabel}</span>
        ) : null}
      </span>
      <span
        aria-hidden="true"
        className="font-condensed text-blanc/40 transition-transform group-hover:translate-x-1"
      >
        →
      </span>
    </>
  )
}

export function LinkRow({ href, label, sublabel, kind = 'internal' }: LinkRowProps) {
  if (kind === 'external') {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={rowClass}>
        <RowContent label={label} sublabel={sublabel} />
      </a>
    )
  }

  if (kind === 'mail') {
    return (
      <a href={href} className={rowClass}>
        <RowContent label={label} sublabel={sublabel} />
      </a>
    )
  }

  return (
    <Link href={href} className={rowClass}>
      <RowContent label={label} sublabel={sublabel} />
    </Link>
  )
}
