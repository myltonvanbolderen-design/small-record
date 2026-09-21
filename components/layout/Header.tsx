'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'motion/react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/', label: 'Home', num: '01' },
  { href: '/small-record', label: 'The Label', num: '02' },
  { href: '/casae', label: 'Casae', num: '03' },
  { href: '/letche', label: 'Letche', num: '04' },
  { href: '/events', label: 'Events', num: '05' },
]

export function Header() {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)
  const toggleRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLElement>(null)
  const wasOpen = useRef(false)

  useEffect(() => {
    const main = document.getElementById('main')
    if (main) main.inert = menuOpen

    if (menuOpen) {
      wasOpen.current = true
      const onKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') setMenuOpen(false)
      }
      document.addEventListener('keydown', onKeyDown)
      const raf = requestAnimationFrame(() => {
        menuRef.current?.querySelector<HTMLElement>('a')?.focus()
      })
      return () => {
        document.removeEventListener('keydown', onKeyDown)
        cancelAnimationFrame(raf)
        if (main) main.inert = false
      }
    } else if (wasOpen.current) {
      wasOpen.current = false
      toggleRef.current?.focus()
    }

    return () => {
      if (main) main.inert = false
    }
  }, [menuOpen])

  return (
    <>
      {/* Masthead - thin magazine bar */}
      <header className="fixed top-0 left-0 right-0 z-50">
        <div className="flex items-center justify-between px-5 py-4 md:px-8">
          {/* Logo */}
          <Link href="/" className="relative z-50 block h-8 w-8 shrink-0 md:h-10 md:w-10">
            <img
              src="/images/logo/logo-white.png"
              alt="Small Records"
              className="h-full w-full object-contain"
              style={{ filter: 'invert(1)' }}
            />
          </Link>

          {/* Center - Issue/brand mark (desktop) */}
          <div className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 md:block">
            <span aria-hidden="true" className="font-condensed text-[0.6rem] uppercase tracking-[0.4em] text-blanc/30">
              Small Records · Paris
            </span>
          </div>

          {/* Menu toggle */}
          <button
            ref={toggleRef}
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="relative z-50 font-condensed text-[0.7rem] uppercase tracking-[0.25em] text-blanc/70 transition-colors hover:text-blanc"
            aria-expanded={menuOpen}
            aria-controls="site-menu"
          >
            {menuOpen ? 'Close' : 'Menu'}
          </button>
        </div>
      </header>

      {/* Full-screen magazine overlay menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            id="site-menu"
            className="fixed inset-0 z-40 flex items-center justify-center bg-noir/98 backdrop-blur-md"
            onClick={() => setMenuOpen(false)}
          >
            <nav ref={menuRef} aria-label="Main" className="flex flex-col items-center gap-2" onClick={(e) => e.stopPropagation()}>
              {/* Sommaire title */}
              <span className="mb-8 font-condensed text-[0.6rem] uppercase tracking-[0.4em] text-terracotta-light">
                Sommaire
              </span>

              {navItems.map((item, i) => {
                const isActive = pathname === item.href || pathname === item.href + '/'
                return (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + i * 0.05, duration: 0.4 }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setMenuOpen(false)}
                      className={cn(
                        'group flex items-baseline gap-4 py-3 transition-colors',
                        isActive
                          ? 'text-blanc'
                          : 'text-blanc/40 hover:text-blanc'
                      )}
                    >
                      <span className="font-condensed text-[0.7rem] tracking-[0.2em] text-terracotta-light">
                        {item.num}
                      </span>
                      <span className="font-display text-[clamp(2rem,6vw,4.5rem)] font-bold leading-none tracking-tight">
                        {item.label}
                      </span>
                    </Link>
                  </motion.div>
                )
              })}

              {/* Social strip at bottom */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.4 }}
                className="mt-12 flex gap-8"
              >
                <a
                  href="https://www.instagram.com/smallmusics"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-condensed text-[0.6rem] uppercase tracking-[0.3em] text-blanc/55 transition-colors hover:text-terracotta"
                >
                  Instagram
                </a>
                <a
                  href="https://soundcloud.com/casae"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-condensed text-[0.6rem] uppercase tracking-[0.3em] text-blanc/55 transition-colors hover:text-terracotta"
                >
                  SoundCloud
                </a>
                <a
                  href="https://linktr.ee/smallrecords_music"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-condensed text-[0.6rem] uppercase tracking-[0.3em] text-blanc/55 transition-colors hover:text-terracotta"
                >
                  Linktree
                </a>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
