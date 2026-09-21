'use client'

import { useLayoutEffect, useRef, useState } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'

interface ParallaxTitleProps {
  children: React.ReactNode
  className?: string
  speed?: number
  /** Height of the fixed header the title must be gone before reaching (px) */
  headerOffset?: number
}

export function ParallaxTitle({
  children,
  className,
  speed = 0.3,
  headerOffset = 80,
}: ParallaxTitleProps) {
  const ref = useRef<HTMLDivElement>(null)
  // Page scroll distance after which the title's top edge would touch the header.
  // Measured on mount/resize so the fade ends before any overlap, whatever the viewport.
  const [fadeEnd, setFadeEnd] = useState(300)

  useLayoutEffect(() => {
    const measure = () => {
      const el = ref.current
      if (!el) return
      // offsetTop chain ignores the transform this component applies itself
      let top = 0
      for (let n: HTMLElement | null = el; n; n = n.offsetParent as HTMLElement | null) top += n.offsetTop
      // the title also drifts up, so it reaches the header sooner than plain scroll
      setFadeEnd(Math.max(80, (top - headerOffset) / (1 + speed)))
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [headerOffset, speed])

  const reduce = useReducedMotion()
  const { scrollY } = useScroll()
  // Drift upward as the user scrolls so the title floats out of frame
  // instead of descending onto the content below it.
  const y = useTransform(scrollY, [0, fadeEnd], [0, reduce ? 0 : -fadeEnd * speed], { clamp: false })
  const opacity = useTransform(scrollY, [0, fadeEnd * 0.85], [1, 0])
  const scale = useTransform(scrollY, [0, fadeEnd], [1, reduce ? 1 : 0.97])

  return (
    <motion.div ref={ref} style={{ y, opacity, scale }} className={className}>
      {children}
    </motion.div>
  )
}
