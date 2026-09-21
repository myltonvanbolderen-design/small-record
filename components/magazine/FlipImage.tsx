'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useReducedMotion } from 'motion/react'

interface FlipImageProps {
  images: string[]
  alt: string
  interval?: number
  className?: string
  sizes?: string
}

export function FlipImage({ images, alt, interval = 500, className, sizes = '100vw' }: FlipImageProps) {
  const [index, setIndex] = useState(0)
  const reduce = useReducedMotion()

  useEffect(() => {
    if (reduce) {
      setIndex(0)
      return
    }
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length)
    }, interval)
    return () => clearInterval(timer)
  }, [images.length, interval, reduce])

  return (
    <div className={`relative overflow-hidden ${className ?? ''}`}>
      {images.map((src, i) => (
        <Image
          key={src}
          src={src}
          alt={alt}
          fill
          className="object-cover"
          style={{ visibility: i === index ? 'visible' : 'hidden' }}
          sizes={sizes}
        />
      ))}
    </div>
  )
}
