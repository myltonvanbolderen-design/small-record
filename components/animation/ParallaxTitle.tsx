'use client'

import { useLayoutEffect, useRef, useState } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'

interface ParallaxTitleProps {
  children: React.ReactNode
  className?: string
  id?: string
  /**
   * How much the title lags behind the page scroll (0 = scrolls normally, 0.5 = half speed).
   * Keep it equal to the cover photo's ParallaxLayer lag so the title stays put on the photo.
   */
  lag?: number
  /** Height of the fixed header the title must be gone before reaching (px) */
  headerOffset?: number
}

export function ParallaxTitle({
  children,
  className,
  id,
  lag = 0.45,
  headerOffset = 80,
}: ParallaxTitleProps) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const k = reduce ? 0 : lag
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
      // the title moves up at (1 − k) px per px scrolled
      setReachHeader(Math.max(80, (top - headerOffset) / (1 - k)))
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [headerOffset, k])

  const { scrollY } = useScroll()
  // Lag the page by k·scroll (depth effect, same rate as the cover photo layer)
  const y = useTransform(scrollY, (v) => v * k)
  // Fully readable for the first ~40% of the way, then dissolve — transparent before the header
  const opacity = useTransform(scrollY, [reachHeader * 0.4, reachHeader * 0.95], [1, 0])
  const scale = useTransform(scrollY, [0, reachHeader], [1, reduce ? 1 : 0.96])

  return (
    <motion.div ref={ref} id={id} style={{ y, opacity, scale }} className={className}>
      {children}
    </motion.div>
  )
}
