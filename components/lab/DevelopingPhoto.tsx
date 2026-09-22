'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import type { FilmFrame } from './frames'

interface DevelopingPhotoProps {
  frame: FilmFrame
}

export function DevelopingPhoto({ frame }: DevelopingPhotoProps) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'center center'] })
  // `reduce` is read inside the transform callback (rather than swapping the
  // `style.filter` value between a MotionValue and a plain string across
  // renders) because motion binds a CSS property to a MotionValue once it's
  // used — passing a literal string for the same key on a later render does
  // not get applied to the DOM. Keeping it always MotionValue-driven avoids
  // that caching quirk.
  const filter = useTransform(scrollYProgress, (p) => {
    if (reduce || p >= 0.995) return 'none'
    const q = Math.max(0, p)
    return `grayscale(${(1 - q).toFixed(3)}) brightness(${(0.3 + 0.7 * q).toFixed(3)}) contrast(${(1.15 - 0.15 * q).toFixed(3)}) sepia(${(0.35 * (1 - q)).toFixed(3)})`
  })

  return (
    <figure className="mx-auto w-full max-w-4xl">
      <motion.div
        ref={ref}
        data-develop={frame.num}
        className="relative aspect-[3/2] w-full overflow-hidden bg-[#141210]"
        style={{ filter }}
      >
        <Image
          src={frame.src}
          alt={frame.caption}
          fill
          sizes="(min-width:1024px) 896px, 100vw"
          className="object-cover"
        />
      </motion.div>
      <figcaption className="mt-3 font-condensed text-[0.7rem] uppercase tracking-[0.3em] text-blanc/55">
        <span className="text-terracotta-light">Frame {frame.num}</span> — {frame.caption}
      </figcaption>
    </figure>
  )
}
