'use client'

import { useEffect, useRef } from 'react'

interface VideoLoopProps {
  src: string
  poster?: string
  className?: string
}

export function VideoLoop({ src, poster, className }: VideoLoopProps) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    video.muted = true

    if (typeof IntersectionObserver === 'undefined') {
      video.src = src
      video.play().catch(() => {})
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            if (!video.getAttribute('src')) {
              video.src = src
            }
            video.play().catch(() => {})
          } else {
            video.pause()
          }
        }
      },
      { rootMargin: '200px 0px' }
    )

    observer.observe(video)

    return () => {
      observer.disconnect()
    }
  }, [src])

  return (
    <video
      ref={videoRef}
      muted
      loop
      playsInline
      preload="none"
      poster={poster}
      aria-hidden="true"
      className={className ?? 'h-full w-full object-cover'}
    />
  )
}
