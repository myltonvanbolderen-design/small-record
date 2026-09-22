'use client'

import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'

interface ParallaxLayerProps {
  children: React.ReactNode
  /** Fraction of the page scroll the layer lags behind (0 = scrolls normally) */
  lag?: number
  className?: string
}

/**
 * Moves its content down by lag·scroll so it scrolls slower than the page (depth effect).
 * Used for the home cover photo so it travels with the lagging ParallaxTitle
 * instead of sliding under it. Place inside an `overflow-hidden` section.
 */
export function ParallaxLayer({ children, lag = 0.45, className }: ParallaxLayerProps) {
  const reduce = useReducedMotion()
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, (v) => (reduce ? 0 : v * lag))

  return (
    <motion.div style={{ y }} className={className}>
      {children}
    </motion.div>
  )
}
