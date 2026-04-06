'use client'

import { motion } from 'motion/react'

interface FadingOverlayProps {
  className?: string
}

export function FadingOverlay({ className }: FadingOverlayProps) {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      whileInView={{ opacity: 0.3 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
      className={className}
    />
  )
}
