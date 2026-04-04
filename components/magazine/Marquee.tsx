'use client'

import { motion } from 'motion/react'

interface MarqueeProps {
  items: string[]
  speed?: number
  separator?: string
  className?: string
}

export function Marquee({
  items,
  speed = 20,
  separator = '·',
  className,
}: MarqueeProps) {
  const text = items.join(` ${separator} `) + ` ${separator} `
  const doubled = text + text

  return (
    <div
      className={`overflow-hidden whitespace-nowrap border-y border-blanc/10 py-4 ${className ?? ''}`}
    >
      <motion.div
        animate={{ x: [0, `-${50}%`] }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: 'loop',
            duration: speed,
            ease: 'linear',
          },
        }}
        className="inline-block font-condensed text-[clamp(0.7rem,1.5vw,0.9rem)] uppercase tracking-[0.3em] text-blanc/20"
      >
        {doubled}
      </motion.div>
    </div>
  )
}
