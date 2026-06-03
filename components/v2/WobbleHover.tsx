'use client'

import { motion } from 'motion/react'
import { cn } from '@/lib/utils'

type Props = {
  children: React.ReactNode
  className?: string
  amount?: number
  scale?: number
}

export function WobbleHover({
  children,
  className,
  amount = 2,
  scale = 1.03,
}: Props) {
  return (
    <motion.div
      className={cn(className)}
      whileHover={{
        rotate: [0, -amount, amount, -amount, 0],
        scale,
        transition: { duration: 0.5, ease: 'easeInOut' },
      }}
    >
      {children}
    </motion.div>
  )
}
