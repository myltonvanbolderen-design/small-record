import { cn } from '@/lib/utils'

type AspectRatio = '3/4' | '4/3' | '16/9' | '1/1' | '2/3'

interface PhotoPlaceholderProps {
  ratio?: AspectRatio
  label?: string
  className?: string
}

export function PhotoPlaceholder({
  ratio = '3/4',
  label = 'Photo',
  className,
}: PhotoPlaceholderProps) {
  return (
    <div
      className={cn(
        'relative w-full overflow-hidden bg-placeholder',
        className
      )}
      style={{ aspectRatio: ratio }}
    >
      <span className="absolute inset-0 flex items-center justify-center font-condensed text-label uppercase tracking-widest text-blanc/40">
        {label}
      </span>
    </div>
  )
}
