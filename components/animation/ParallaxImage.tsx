'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import Image from 'next/image'
import { cn } from '@/lib/utils'

interface ParallaxImageProps {
  src: string
  alt: string
  className?: string
  speed?: number
  priority?: boolean
  sizes?: string
}

export function ParallaxImage({
  src,
  alt,
  className,
  speed = 0.15,
  priority = false,
  sizes = '100vw',
}: ParallaxImageProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  const y = useTransform(scrollYProgress, [0, 1], [`-${speed * 100}%`, `${speed * 100}%`])

  // The image moves by ±speed of its own height, so it must overhang the frame
  // by at least that much on top and bottom or a gap shows at the edges:
  // overhang ≥ speed · (1 + 2·overhang)  →  overhang = speed / (1 − 2·speed)
  const overhang = `${((speed / (1 - 2 * speed)) * 100).toFixed(2)}%`

  return (
    // cn() so a caller's `absolute inset-0` replaces `relative` — with both
    // classes present `relative` wins in Tailwind v4 and the frame collapses to 0px
    <div ref={ref} className={cn('relative overflow-hidden', className)}>
      <motion.div
        style={{ y, top: `-${overhang}`, bottom: `-${overhang}` }}
        className="absolute inset-x-0"
      >
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          priority={priority}
          sizes={sizes}
        />
      </motion.div>
    </div>
  )
}
