'use client'

import { motion } from 'motion/react'

interface TextRevealProps {
  children: string
  className?: string
  delay?: number
}

export function TextReveal({
  children,
  className,
  delay = 0,
}: TextRevealProps) {
  return (
    <motion.p
      initial={{ opacity: 0, filter: 'blur(6px)' }}
      whileInView={{ opacity: 1, filter: 'blur(0px)' }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{
        duration: 0.8,
        ease: [0.25, 0.1, 0.25, 1],
        delay,
      }}
      className={className}
    >
      {children}
    </motion.p>
  )
}
