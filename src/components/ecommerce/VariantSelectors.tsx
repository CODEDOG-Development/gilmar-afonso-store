import type { ProductColor } from '@/types'
import { cn } from '@/utils/cn'

interface ColorSelectorProps {
  colors: ProductColor[]
  value: string
  onChange: (name: string) => void
}

/** Seletor de cor. É um radiogroup: setas do teclado funcionam como esperado. */
export function ColorSelector({ colors, value, onChange }: ColorSelectorProps) {
  return (
    <fieldset>
      <legend className="mb-3 text-xs">
        Cor: <strong>{value}</strong>
      </legend>
      <div className="flex gap-2.5">
        {colors.map((color) => (
          <label key={color.name} className="relative cursor-pointer" title={color.name}>
            <input
              type="radio"
              name="color"
              value={color.name}
              checked={value === color.name}
              onChange={() => onChange(color.name)}
              className="peer sr-only"
            />
            <span
              className="block size-8 rounded-full border border-[#bcbab3] ring-offset-2 peer-checked:ring-2 peer-checked:ring-foreground peer-focus-visible:ring-2 peer-focus-visible:ring-ring"
              style={{ background: color.hex }}
            />
            <span className="sr-only">{color.name}</span>
          </label>
        ))}
      </div>
    </fieldset>
  )
}

interface SizeSelectorProps {
  sizes: string[]
  value: string | null
  onChange: (size: string) => void
  error?: boolean
}

export function SizeSelector({ sizes, value, onChange, error }: SizeSelectorProps) {
  return (
    <fieldset aria-invalid={error}>
      <legend className="mb-3 text-xs">
        Tamanho: <strong>{value ?? 'selecione'}</strong>
      </legend>
      <div className="flex flex-wrap gap-2">
        {sizes.map((size) => (
          <label key={size} className="cursor-pointer">
            <input
              type="radio"
              name="size"
              value={size}
              checked={value === size}
              onChange={() => onChange(size)}
              className="peer sr-only"
            />
            <span
              className={cn(
                'grid h-11 min-w-12 place-items-center rounded-sm border px-3 text-sm transition-colors peer-checked:border-foreground peer-checked:bg-foreground peer-checked:text-background peer-focus-visible:ring-2 peer-focus-visible:ring-ring hover:border-foreground',
                error ? 'border-destructive' : 'border-input',
              )}
            >
              {size}
            </span>
          </label>
        ))}
      </div>
      {error && (
        <p role="alert" className="mt-2 text-xs text-destructive">
          Escolha um tamanho para continuar.
        </p>
      )}
    </fieldset>
  )
}
