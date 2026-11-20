import type { ReactNode } from 'react'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { Rating } from '@/components/common/Rating'
import { useCategories, useProductFacets } from '@/hooks/use-products'
import type { ProductFilters } from '@/types'
import { cn } from '@/utils/cn'

interface ProductFiltersPanelProps {
  filters: ProductFilters
  onChange: (patch: Partial<ProductFilters>) => void
  onClear: () => void
}

/**
 * Barra de filtros. Não guarda estado próprio: lê e escreve direto na URL
 * (via onChange da página), então o filtro sobrevive ao F5 e pode ser compartilhado.
 */
export function ProductFiltersPanel({ filters, onChange, onClear }: ProductFiltersPanelProps) {
  const { data: categories } = useCategories()
  const { data: facets } = useProductFacets()

  const toggleBrand = (brand: string, checked: boolean) => {
    const current = filters.brands ?? []
    onChange({ brands: checked ? [...current, brand] : current.filter((b) => b !== brand) })
  }

  return (
    <div className="space-y-6">
      <FilterGroup title="Categoria">
        <ul className="space-y-1">
          {[{ slug: '', name: 'Todas' }, ...(categories ?? [])].map((category) => {
            const active = (filters.category ?? '') === category.slug
            return (
              <li key={category.slug || 'all'}>
                <button
                  type="button"
                  onClick={() => onChange({ category: category.slug || undefined })}
                  aria-pressed={active}
                  className={cn(
                    'w-full rounded-sm px-2 py-1.5 text-left text-sm transition-colors hover:bg-muted',
                    active && 'bg-muted font-semibold',
                  )}
                >
                  {category.name}
                </button>
              </li>
            )
          })}
        </ul>
      </FilterGroup>

      <Separator />

      <FilterGroup title="Faixa de preço">
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <Label htmlFor="minPrice">Mínimo (R$)</Label>
            <Input
              id="minPrice"
              type="number"
              inputMode="numeric"
              min={0}
              placeholder={String(facets?.priceRange.min ?? 0)}
              value={filters.minPrice ?? ''}
              onChange={(e) =>
                onChange({ minPrice: e.target.value ? Number(e.target.value) : undefined })
              }
              className="h-10"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="maxPrice">Máximo (R$)</Label>
            <Input
              id="maxPrice"
              type="number"
              inputMode="numeric"
              min={0}
              placeholder={String(facets?.priceRange.max ?? '')}
              value={filters.maxPrice ?? ''}
              onChange={(e) =>
                onChange({ maxPrice: e.target.value ? Number(e.target.value) : undefined })
              }
              className="h-10"
            />
          </div>
        </div>
      </FilterGroup>

      <Separator />

      <FilterGroup title="Marca">
        <div className="space-y-2.5">
          {facets?.brands.map((brand) => (
            <CheckRow
              key={brand}
              id={`brand-${brand}`}
              label={brand}
              checked={filters.brands?.includes(brand) ?? false}
              onChange={(checked) => toggleBrand(brand, checked)}
            />
          ))}
        </div>
      </FilterGroup>

      <Separator />

      <FilterGroup title="Avaliação">
        <div className="space-y-1">
          {[4.5, 4].map((rating) => {
            const active = filters.minRating === rating
            return (
              <button
                key={rating}
                type="button"
                aria-pressed={active}
                onClick={() => onChange({ minRating: active ? undefined : rating })}
                className={cn(
                  'flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-muted',
                  active && 'bg-muted font-semibold',
                )}
              >
                <Rating value={rating} /> {rating.toLocaleString('pt-BR')} ou mais
              </button>
            )
          })}
        </div>
      </FilterGroup>

      <Separator />

      <FilterGroup title="Disponibilidade">
        <div className="space-y-2.5">
          <CheckRow
            id="inStock"
            label="Somente em estoque"
            checked={Boolean(filters.inStock)}
            onChange={(c) => onChange({ inStock: c || undefined })}
          />
          <CheckRow
            id="onSale"
            label="Em promoção"
            checked={Boolean(filters.onSale)}
            onChange={(c) => onChange({ onSale: c || undefined })}
          />
        </div>
      </FilterGroup>

      <Button variant="outline" className="w-full" onClick={onClear}>
        LIMPAR FILTROS
      </Button>
    </div>
  )
}

function FilterGroup({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h3 className="mb-3 text-xs font-bold tracking-wide uppercase">{title}</h3>
      {children}
    </section>
  )
}

function CheckRow({
  id,
  label,
  checked,
  onChange,
}: {
  id: string
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
}) {
  return (
    <div className="flex items-center gap-2.5">
      <Checkbox id={id} checked={checked} onCheckedChange={(value) => onChange(value === true)} />
      <Label htmlFor={id} className="cursor-pointer text-sm font-normal">
        {label}
      </Label>
    </div>
  )
}
