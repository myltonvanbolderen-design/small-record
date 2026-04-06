import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-noir px-5 text-center text-blanc">
      <span className="font-condensed text-[0.55rem] uppercase tracking-[0.5em] text-terracotta">
        404
      </span>
      <h1 className="mt-4 font-display text-[clamp(3rem,10vw,8rem)] font-bold leading-[0.85]">
        Lost in
        <br />
        the mix<span className="text-terracotta">.</span>
      </h1>
      <p className="mt-6 font-body text-[1rem] text-blanc/50">
        This page doesn&apos;t exist. The music is elsewhere.
      </p>
      <Link
        href="/"
        className="mt-10 border border-blanc/20 px-6 py-3 font-condensed text-[0.7rem] uppercase tracking-[0.2em] text-blanc/70 transition-colors hover:border-terracotta hover:text-blanc"
      >
        Back to home
      </Link>
    </main>
  )
}
