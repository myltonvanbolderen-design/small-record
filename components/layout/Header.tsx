import Link from 'next/link'

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex h-[56px] items-center justify-between bg-noir/95 px-6 backdrop-blur-sm">
      <Link
        href="/"
        className="font-display text-section font-bold text-blanc"
      >
        SR
      </Link>
      <nav className="flex gap-6">
        <Link
          href="/small-record"
          className="font-condensed text-label uppercase tracking-[0.1em] text-blanc/80 transition-colors hover:text-blanc"
        >
          Small Record
        </Link>
        <Link
          href="/casae"
          className="font-condensed text-label uppercase tracking-[0.1em] text-blanc/80 transition-colors hover:text-blanc"
        >
          Casae
        </Link>
        <Link
          href="/letche"
          className="font-condensed text-label uppercase tracking-[0.1em] text-blanc/80 transition-colors hover:text-blanc"
        >
          Letche
        </Link>
      </nav>
    </header>
  )
}
