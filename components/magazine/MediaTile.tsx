import type { ReactNode } from 'react'
import Image from 'next/image'
import { VideoLoop } from '@/components/magazine/VideoLoop'

type MediaTileProps = {
  className: string
  caption?: ReactNode
  captionClassName?: string
} & (
  | {
      image: {
        src: string
        alt: string
        sizes: string
        className?: string
        priority?: boolean
      }
      video?: never
    }
  | {
      video: { src: string; poster: string }
      image?: never
    }
)

export function MediaTile({
  className,
  caption,
  captionClassName = 'p-4',
  image,
  video,
}: MediaTileProps) {
  return (
    <div className={className}>
      {image && (
        <Image
          src={image.src}
          alt={image.alt}
          fill
          className={image.className ?? 'object-cover'}
          sizes={image.sizes}
          priority={image.priority}
        />
      )}
      {video && (
        <VideoLoop src={video.src} poster={video.poster} className="h-full w-full object-cover" />
      )}
      {caption && (
        <div className={`absolute inset-x-0 bottom-0 bg-gradient-to-t from-noir/90 to-transparent ${captionClassName}`}>
          <span className="font-condensed text-[0.55rem] uppercase tracking-[0.3em] text-terracotta-light">
            {caption}
          </span>
        </div>
      )}
    </div>
  )
}
