'use client'

import { motion } from 'motion/react'

interface HorizontalRuleProps {
  className?: string
  delay?: number
  color?: string
}

export function HorizontalRule({
  className,
  delay = 0,
  color = 'bg-blanc/10',
}: HorizontalRuleProps) {
  return (
    <motion.div
      initial={{ scaleX: 0, originX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{
        duration: 1.2,
        ease: [0.25, 0.1, 0.25, 1],
        delay,
      }}
      className={`h-[1px] w-full ${color} ${className ?? ''}`}
    />
  )
}
