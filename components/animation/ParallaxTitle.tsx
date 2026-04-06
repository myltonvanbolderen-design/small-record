'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'

interface ParallaxTitleProps {
  children: React.ReactNode
  className?: string
  speed?: number
}

export function ParallaxTitle({ children, className, speed = 0.3 }: ParallaxTitleProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })

  const y = useTransform(scrollYProgress, [0, 1], ['0%', `${speed * 100}%`])
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.95])

  return (
    <motion.div
      ref={ref}
      style={{ y, opacity, scale }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
