'use client'

import { useLayoutEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'

interface ScrollFadeOutProps {
  children: React.ReactNode
  /** Page scroll (px) over which the content fades from 1 to 0 (upper bound when `clearOf` is set) */
  distance?: number
  /**
   * A lagging element above this one (e.g. the cover title, lagging by `lag`) that closes the
   * gap at `lag` px per px scrolled: the fade is shortened so it's done before they touch.
   */
  clearOf?: { id: string; lag: number }
  className?: string
  id?: string
}

/** Fades content out as the page starts scrolling (e.g. a cover tagline the title would otherwise slide onto). */
export function ScrollFadeOut({ children, distance = 120, clearOf, className, id }: ScrollFadeOutProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [fadeEnd, setFadeEnd] = useState(distance)

  useLayoutEffect(() => {
    if (!clearOf) return
    const measure = () => {
      const el = ref.current
      const above = document.getElementById(clearOf.id)
      if (!el || !above || clearOf.lag <= 0) return
      // measured at the current scroll; both positions shift, so work from the gap at scroll 0
      const gapNow = el.getBoundingClientRect().top - above.getBoundingClientRect().bottom
      const gap0 = gapNow + window.scrollY * clearOf.lag
      setFadeEnd(Math.min(distance, Math.max(24, gap0 / clearOf.lag)))
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [clearOf, distance])

  const { scrollY } = useScroll()
  const opacity = useTransform(scrollY, [0, fadeEnd], [1, 0])

  return (
    <motion.div ref={ref} id={id} style={{ opacity }} className={className}>
      {children}
    </motion.div>
  )
}
