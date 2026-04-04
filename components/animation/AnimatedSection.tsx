'use client'

import { motion } from 'motion/react'

interface AnimatedSectionProps {
  children: React.ReactNode
  className?: string
  delay?: number
  direction?: 'up' | 'down' | 'left' | 'right' | 'none'
  scale?: boolean
  blur?: boolean
  duration?: number
}

export function AnimatedSection({
  children,
  className,
  delay = 0,
  direction = 'up',
  scale = false,
  blur = false,
  duration = 0.7,
}: AnimatedSectionProps) {
  const directionMap = {
    up: { y: 40, x: 0 },
    down: { y: -40, x: 0 },
    left: { x: 60, y: 0 },
    right: { x: -60, y: 0 },
    none: { x: 0, y: 0 },
  }

  const { x, y } = directionMap[direction]

  return (
    <motion.div
      initial={{
        opacity: 0,
        y,
        x,
        scale: scale ? 0.95 : 1,
        filter: blur ? 'blur(10px)' : 'blur(0px)',
      }}
      whileInView={{
        opacity: 1,
        y: 0,
        x: 0,
        scale: 1,
        filter: 'blur(0px)',
      }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{
        duration,
        ease: [0.25, 0.1, 0.25, 1],
        delay,
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
