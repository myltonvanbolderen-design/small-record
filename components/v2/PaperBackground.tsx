import { cn } from '@/lib/utils'

type Props = {
  className?: string
  variant?: 'cream' | 'lined' | 'grid' | 'dots'
}

export function PaperBackground({ className, variant = 'cream' }: Props) {
  const patterns: Record<string, React.CSSProperties> = {
    cream: {
      backgroundColor: '#FFF8E7',
      backgroundImage:
        "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180' viewBox='0 0 180 180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.8  0 0 0 0 0.7  0 0 0 0 0.5  0 0 0 0.06 0'/></filter><rect width='180' height='180' filter='url(%23n)'/></svg>\")",
    },
    lined: {
      backgroundColor: '#FFF8E7',
      backgroundImage:
        'repeating-linear-gradient(to bottom, transparent 0 31px, rgba(120, 150, 200, 0.18) 31px 32px)',
    },
    grid: {
      backgroundColor: '#FFF8E7',
      backgroundImage:
        'linear-gradient(rgba(120,140,180,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(120,140,180,0.12) 1px, transparent 1px)',
      backgroundSize: '28px 28px',
    },
    dots: {
      backgroundColor: '#FFF8E7',
      backgroundImage:
        'radial-gradient(rgba(80,60,30,0.16) 1.5px, transparent 1.5px)',
      backgroundSize: '24px 24px',
    },
  }

  return (
    <div
      aria-hidden
      className={cn('absolute inset-0 -z-10', className)}
      style={patterns[variant]}
    />
  )
}
