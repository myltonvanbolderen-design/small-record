'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import Image from 'next/image'

interface ParallaxImageProps {
  src: string
  alt: string
  className?: string
  speed?: number
  priority?: boolean
}

export function ParallaxImage({
  src,
  alt,
  className,
  speed = 0.15,
  priority = false,
}: ParallaxImageProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  const y = useTransform(scrollYProgress, [0, 1], [`-${speed * 100}%`, `${speed * 100}%`])

  return (
    <div ref={ref} className={`relative overflow-hidden ${className ?? ''}`}>
      <motion.div style={{ y }} className="absolute inset-[-15%]">
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          priority={priority}
          unoptimized
        />
      </motion.div>
    </div>
  )
}
