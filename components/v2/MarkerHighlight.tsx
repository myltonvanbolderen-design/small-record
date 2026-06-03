import { cn } from '@/lib/utils'

type Props = {
  children: React.ReactNode
  color?: string
  className?: string
  rotate?: number
}

export function MarkerHighlight({
  children,
  color = '#FFE57C',
  className,
  rotate = -1,
}: Props) {
  return (
    <span
      className={cn('relative inline-block', className)}
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      <span
        aria-hidden
        className="absolute inset-x-[-0.15em] inset-y-[0.15em] -z-0"
        style={{
          background: color,
          borderRadius: '6px 18px 4px 16px',
          filter: 'blur(0.3px)',
          mixBlendMode: 'multiply',
        }}
      />
      <span className="relative z-10">{children}</span>
    </span>
  )
}
