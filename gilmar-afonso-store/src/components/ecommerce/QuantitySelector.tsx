import { Minus, Plus } from 'lucide-react'
import { cn } from '@/utils/cn'

interface QuantitySelectorProps {
  value: number
  max: number
  onChange: (value: number) => void
  /** Nome do produto, para o leitor de tela dizer "Diminuir quantidade de Polo..." */
  label: string
  size?: 'sm' | 'md'
}

export function QuantitySelector({
  value,
  max,
  onChange,
  label,
  size = 'sm',
}: QuantitySelectorProps) {
  const btn = cn(
    'grid place-items-center rounded-sm bg-muted transition-colors hover:bg-border disabled:opacity-40',
    size === 'sm' ? 'size-7' : 'size-10',
  )
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        className={btn}
        onClick={() => onChange(value - 1)}
        aria-label={`Diminuir quantidade de ${label}`}
      >
        <Minus className="size-3.5" />
      </button>
      <span className="min-w-6 text-center text-sm tabular-nums" aria-live="polite">
        {value}
      </span>
      <button
        type="button"
        className={btn}
        onClick={() => onChange(value + 1)}
        disabled={value >= max}
        aria-label={`Aumentar quantidade de ${label}`}
      >
        <Plus className="size-3.5" />
      </button>
    </div>
  )
}
