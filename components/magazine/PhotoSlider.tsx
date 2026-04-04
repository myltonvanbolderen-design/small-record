'use client'

import { useRef } from 'react'
import { motion } from 'motion/react'
import Image from 'next/image'

interface PhotoSliderProps {
  photos: { src: string; alt: string }[]
  className?: string
}

export function PhotoSlider({ photos, className }: PhotoSliderProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  return (
    <div
      ref={containerRef}
      className={`-mx-5 overflow-x-auto scrollbar-hide md:-mx-8 ${className ?? ''}`}
    >
      <motion.div
        className="flex gap-3 px-5 md:px-8"
        drag="x"
        dragConstraints={containerRef}
      >
        {photos.map((photo, i) => (
          <motion.div
            key={photo.src}
            className="relative h-[60vh] w-[75vw] shrink-0 overflow-hidden md:h-[70vh] md:w-[40vw]"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ delay: i * 0.1, duration: 0.6 }}
          >
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              className="object-cover"
              unoptimized
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}
