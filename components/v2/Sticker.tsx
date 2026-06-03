import { cn } from '@/lib/utils'

type Props = {
  children: React.ReactNode
  bg?: string
  color?: string
  rotate?: number
  className?: string
  size?: 'sm' | 'md' | 'lg'
  shape?: 'round' | 'rect' | 'wavy'
}

export function Sticker({
  children,
  bg = '#FF8C42',
  color = '#1a1a1a',
  rotate = -3,
  className,
  size = 'md',
  shape = 'round',
}: Props) {
  const dims = {
    sm: 'h-16 w-16 text-[0.7rem]',
    md: 'h-24 w-24 text-[0.85rem]',
    lg: 'h-32 w-32 text-[1rem]',
  }[size]

  const shapeStyles =
    shape === 'round'
      ? { borderRadius: '50%' }
      : shape === 'wavy'
        ? { borderRadius: '40% 60% 55% 45% / 55% 40% 60% 45%' }
        : { borderRadius: '14px 18px 12px 20px' }

  return (
    <div
      className={cn(
        'inline-flex items-center justify-center text-center font-condensed font-bold uppercase leading-tight tracking-[0.1em] shadow-[3px_3px_0_0_rgba(0,0,0,0.15)]',
        dims,
        className,
      )}
      style={{
        background: bg,
        color,
        transform: `rotate(${rotate}deg)`,
        border: `2.5px solid ${color}`,
        ...shapeStyles,
      }}
    >
      <span className="px-2">{children}</span>
    </div>
  )
}
