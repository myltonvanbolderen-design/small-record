'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

interface FlipImageProps {
  images: string[]
  alt: string
  interval?: number
  className?: string
}

export function FlipImage({ images, alt, interval = 500, className }: FlipImageProps) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length)
    }, interval)
    return () => clearInterval(timer)
  }, [images.length, interval])

  return (
    <div className={`relative overflow-hidden ${className ?? ''}`}>
      {images.map((src, i) => (
        <Image
          key={src}
          src={src}
          alt={alt}
          fill
          className={`object-cover transition-opacity duration-100 ${i === index ? 'opacity-100' : 'opacity-0'}`}
          unoptimized
        />
      ))}
    </div>
  )
}
