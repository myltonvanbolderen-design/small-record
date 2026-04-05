'use client'

interface VideoLoopProps {
  src: string
  poster?: string
  className?: string
}

export function VideoLoop({ src, poster, className }: VideoLoopProps) {
  return (
    <video
      autoPlay
      loop
      muted
      playsInline
      poster={poster}
      className={className ?? 'h-full w-full object-cover'}
    >
      <source src={src} type="video/mp4" />
    </video>
  )
}
