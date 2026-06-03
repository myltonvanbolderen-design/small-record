import Image from 'next/image'
import { cn } from '@/lib/utils'

type Props = {
  src: string
  alt: string
  caption?: string
  rotate?: number
  tape?: 'top' | 'corners' | 'none'
  tapeColor?: string
  className?: string
  aspect?: 'square' | 'portrait' | 'landscape'
  unoptimized?: boolean
  priority?: boolean
}

export function Polaroid({
  src,
  alt,
  caption,
  rotate = -2,
  tape = 'top',
  tapeColor = 'rgba(255, 220, 130, 0.7)',
  className,
  aspect = 'portrait',
  unoptimized = true,
  priority = false,
}: Props) {
  const aspectClass =
    aspect === 'square'
      ? 'aspect-square'
      : aspect === 'landscape'
        ? 'aspect-[4/3]'
        : 'aspect-[3/4]'

  return (
    <div
      className={cn('relative', className)}
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      <div className="relative bg-white p-3 pb-12 shadow-[0_8px_24px_rgba(0,0,0,0.18),0_2px_6px_rgba(0,0,0,0.1)]">
        <div className={cn('relative w-full overflow-hidden bg-[#1a1a1a]', aspectClass)}>
          <Image
            src={src}
            alt={alt}
            fill
            className="object-cover"
            unoptimized={unoptimized}
            priority={priority}
          />
        </div>
        {caption && (
          <p
            className="absolute bottom-3 left-0 right-0 text-center font-dog text-[1.15rem] leading-none text-[#2a2a2a]"
            style={{ transform: 'rotate(-1deg)' }}
          >
            {caption}
          </p>
        )}
      </div>

      {/* Washi tape — top center */}
      {tape === 'top' && (
        <div
          aria-hidden
          className="absolute -top-3 left-1/2 h-7 w-24 -translate-x-1/2 -rotate-6 shadow-sm"
          style={{
            background: tapeColor,
            backgroundImage:
              'repeating-linear-gradient(45deg, transparent 0 6px, rgba(0,0,0,0.05) 6px 8px)',
            opacity: 0.85,
          }}
        />
      )}

      {/* Washi tape — both corners */}
      {tape === 'corners' && (
        <>
          <div
            aria-hidden
            className="absolute -top-2 -left-3 h-6 w-20 -rotate-[35deg] shadow-sm"
            style={{ background: tapeColor, opacity: 0.85 }}
          />
          <div
            aria-hidden
            className="absolute -top-2 -right-3 h-6 w-20 rotate-[35deg] shadow-sm"
            style={{ background: tapeColor, opacity: 0.85 }}
          />
        </>
      )}
    </div>
  )
}
