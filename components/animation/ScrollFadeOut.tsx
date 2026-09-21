'use client'

import { motion, useScroll, useTransform } from 'motion/react'

interface ScrollFadeOutProps {
  children: React.ReactNode
  /** Page scroll (px) over which the content fades from 1 to 0 */
  distance?: number
  className?: string
  id?: string
}

/** Fades content out as the page starts scrolling (e.g. a cover tagline the title would otherwise slide onto). */
export function ScrollFadeOut({ children, distance = 120, className, id }: ScrollFadeOutProps) {
  const { scrollY } = useScroll()
  const opacity = useTransform(scrollY, [0, distance], [1, 0])

  return (
    <motion.div id={id} style={{ opacity }} className={className}>
      {children}
    </motion.div>
  )
}
