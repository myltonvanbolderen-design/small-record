import { cn } from '@/lib/utils'

type Props = {
  children: React.ReactNode
  tail?: 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right'
  className?: string
  fill?: string
  stroke?: string
  rotate?: number
}

export function SpeechBubble({
  children,
  tail = 'bottom-left',
  className,
  fill = '#FFFFFF',
  stroke = '#1a1a1a',
  rotate = -1,
}: Props) {
  // Tail position via absolute SVG triangle on the bubble
  const tailPos = {
    'bottom-left': 'bottom-[-22px] left-12',
    'bottom-right': 'bottom-[-22px] right-12',
    'top-left': 'top-[-22px] left-12 rotate-180',
    'top-right': 'top-[-22px] right-12 rotate-180',
  }[tail]

  return (
    <div
      className={cn('relative inline-block', className)}
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      <div
        className="relative px-8 py-7"
        style={{
          background: fill,
          border: `3px solid ${stroke}`,
          borderRadius: '36px 28px 32px 30px / 30px 36px 26px 32px',
          boxShadow: '6px 6px 0 0 rgba(0,0,0,0.12)',
        }}
      >
        {children}
      </div>

      {/* Tail */}
      <svg
        aria-hidden
        viewBox="0 0 40 30"
        width={40}
        height={30}
        className={cn('absolute', tailPos)}
        style={{ overflow: 'visible' }}
      >
        <path
          d="M 4 0 L 36 0 L 14 28 Z"
          fill={fill}
          stroke={stroke}
          strokeWidth={3}
          strokeLinejoin="round"
        />
        {/* mask the top edge of triangle so it merges with bubble */}
        <line x1="4" y1="0" x2="36" y2="0" stroke={fill} strokeWidth={4} />
      </svg>
    </div>
  )
}
