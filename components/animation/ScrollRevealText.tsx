'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'

interface ScrollRevealTextProps {
  children: React.ReactNode
  className?: string
}

export function ScrollRevealText({ children, className }: ScrollRevealTextProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.9', 'start 0.4'],
  })

  const opacity = useTransform(scrollYProgress, [0, 1], [0.2, 1])

  return (
    <motion.span
      ref={ref}
      style={{ opacity }}
      className={className}
    >
      {children}
    </motion.span>
  )
}
