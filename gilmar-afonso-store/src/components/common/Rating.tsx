import { Star } from 'lucide-react'
import { cn } from '@/utils/cn'

interface RatingProps {
  value: number
  count?: number
  size?: 'sm' | 'md'
  className?: string
}

/** Estrelas de avaliação. O leitor de tela ouve "Avaliação 4,8 de 5". */
export function Rating({ value, count, size = 'sm', className }: RatingProps) {
  const iconSize = size === 'sm' ? 'size-3.5' : 'size-5'
  return (
    <div className={cn('flex items-center gap-1.5', className)}>
      <div
        className="flex"
        role="img"
        aria-label={`Avaliação ${value.toLocaleString('pt-BR')} de 5`}
      >
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            aria-hidden
            className={cn(
              iconSize,
              star <= Math.round(value) ? 'fill-accent text-accent' : 'fill-muted text-muted',
            )}
          />
        ))}
      </div>
      {count !== undefined && <span className="text-xs text-muted-foreground">({count})</span>}
    </div>
  )
}
