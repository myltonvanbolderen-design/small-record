import { cn } from '@/lib/utils'

type Props = {
  variant?: 'curve-down-right' | 'curve-up-left' | 'wavy-right' | 'loop-down'
  color?: string
  className?: string
  width?: number
  height?: number
  strokeWidth?: number
}

export function ScribbleArrow({
  variant = 'curve-down-right',
  color = '#1a1a1a',
  className,
  width = 120,
  height = 80,
  strokeWidth = 2.5,
}: Props) {
  const paths: Record<string, { d: string; head: string }> = {
    'curve-down-right': {
      d: 'M 8 12 C 18 8, 50 6, 70 30 S 95 70, 110 65',
      head: 'M 110 65 L 100 60 M 110 65 L 105 75',
    },
    'curve-up-left': {
      d: 'M 110 70 C 95 78, 60 72, 45 50 S 25 14, 10 16',
      head: 'M 10 16 L 18 11 M 10 16 L 16 22',
    },
    'wavy-right': {
      d: 'M 6 40 Q 25 25, 40 40 T 75 40 T 110 40',
      head: 'M 110 40 L 100 33 M 110 40 L 100 47',
    },
    'loop-down': {
      d: 'M 30 8 C 60 8, 80 30, 60 45 S 30 50, 50 65 S 90 70, 95 80',
      head: 'M 95 80 L 88 75 M 95 80 L 88 84',
    },
  }

  const path = paths[variant]

  return (
    <svg
      className={cn('pointer-events-none select-none', className)}
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d={path.d} style={{ filter: 'url(#wobble)' }} />
      <path d={path.head} />
    </svg>
  )
}
