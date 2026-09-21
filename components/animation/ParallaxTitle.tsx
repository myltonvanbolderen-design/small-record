'use client'

import { useLayoutEffect, useRef, useState } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'

interface ParallaxTitleProps {
  children: React.ReactNode
  className?: string
  /**
   * How much the title lags behind the page scroll (0 = scrolls normally, 0.5 = half speed).
   * Lagging keeps the cover title on screen longer before it reaches the header.
   */
  lag?: number
  /** Height of the fixed header the title must be gone before reaching (px) */
  headerOffset?: number
  /**
   * Element below the title that fades out on scroll (e.g. the cover tagline).
   * The lag is reduced so the title can't reach it before it has faded away.
   */
  avoid?: { id: string; fadeDistance: number }
}

export function ParallaxTitle({
  children,
  className,
  lag = 0.45,
  headerOffset = 80,
  avoid,
}: ParallaxTitleProps) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const [k, setK] = useState(reduce ? 0 : lag)
  // Page scroll distance at which the title's top edge would touch the header.
  // Measured on mount/resize so the fade ends before any overlap, whatever the viewport.
  const [reachHeader, setReachHeader] = useState(400)

  useLayoutEffect(() => {
    const measure = () => {
      const el = ref.current
      if (!el) return
      // offsetTop chain ignores the transform this component applies itself
      let top = 0
      for (let n: HTMLElement | null = el; n; n = n.offsetParent as HTMLElement | null) top += n.offsetTop
      // Lagging closes the gap to the element below at k px per px scrolled:
      // keep k low enough that it has faded out before the gap is used up
      let kk = reduce ? 0 : lag
      const below = avoid ? document.getElementById(avoid.id) : null
      if (below && kk > 0) {
        const gap = below.getBoundingClientRect().top - el.getBoundingClientRect().bottom
        kk = Math.min(kk, Math.max(0, gap) / avoid!.fadeDistance)
      }
      setK(kk)
      // the title moves up at (1 − k) px per px scrolled
      setReachHeader(Math.max(80, (top - headerOffset) / (1 - kk)))
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [headerOffset, lag, reduce, avoid])

  const { scrollY } = useScroll()
  // Push the title down by k·scroll so it lags the page (depth effect); stop once it's gone
  const y = useTransform(scrollY, [0, reachHeader], [0, reachHeader * k])
  // Fully readable for the first ~40% of the way, then dissolve — transparent before the header
  const opacity = useTransform(scrollY, [reachHeader * 0.4, reachHeader * 0.95], [1, 0])
  const scale = useTransform(scrollY, [0, reachHeader], [1, reduce ? 1 : 0.96])

  return (
    <motion.div ref={ref} style={{ y, opacity, scale }} className={className}>
      {children}
    </motion.div>
  )
}
