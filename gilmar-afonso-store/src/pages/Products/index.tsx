import { SlidersHorizontal, X } from 'lucide-react'
import { useRef, useState } from 'react'
import { Pagination } from '@/components/common/Pagination'
import { Seo } from '@/components/common/Seo'
import { ProductFiltersPanel } from '@/components/ecommerce/ProductFiltersPanel'
import { ProductGrid } from '@/components/ecommerce/ProductGrid'
import { Button } from '@/components/ui/button'
import { NativeSelect } from '@/components/ui/native-select'
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet'
import { ROUTES } from '@/constants'
import { useCategories, useProducts } from '@/hooks/use-products'
import type { ProductSort } from '@/types'
import { useUrlFilters } from './use-url-filters'

const SORT_OPTIONS: { value: ProductSort; label: string }[] = [
  { value: 'relevance', label: 'Relevância' },
  { value: 'best-sellers', label: 'Mais vendidos' },
  { value: 'newest', label: 'Lançamentos' },
  { value: 'price-asc', label: 'Menor preço' },
  { value: 'price-desc', label: 'Maior preço' },
  { value: 'rating', label: 'Melhor avaliados' },
]

export default function ProductsPage() {
  const { filters, updateFilters, clearFilters, activeCount } = useUrlFilters()
  const { data, isLoading, isFetching } = useProducts(filters)
  const { data: categories } = useCategories()
  const [filtersOpen, setFiltersOpen] = useState(false)
  const topRef = useRef<HTMLDivElement>(null)

  const category = categories?.find((c) => c.slug === filters.category)
  const title = filters.q
    ? `Resultados para “${filters.q}”`
    : (category?.name ?? 'Todos os produtos')

  function changePage(page: number) {
    updateFilters({ page })
    topRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const panel = (
    <ProductFiltersPanel filters={filters} onChange={updateFilters} onClear={clearFilters} />
  )

  return (
    <div className="container-store py-10" ref={topRef}>
      <Seo
        title={category?.name ?? 'Produtos'}
        description={
          category?.description ?? 'Camisetas, polos, camisas sociais e moletons premium.'
        }
        path={filters.category ? ROUTES.category(filters.category) : ROUTES.products}
      />

      <div className="mb-8">
        <p className="eyebrow">COLEÇÃO</p>
        <h1 className="text-[clamp(28px,3.2vw,39px)] font-medium tracking-[-1.5px]">{title}</h1>
        {filters.q && (
          <button
            type="button"
            onClick={() => updateFilters({ q: undefined })}
            className="mt-2 inline-flex items-center gap-1 text-xs underline underline-offset-4"
          >
            <X className="size-3" /> Limpar busca
          </button>
        )}
      </div>

      <div className="grid gap-10 lg:grid-cols-[240px_1fr]">
        <aside className="hidden lg:block" aria-label="Filtros">
          {panel}
        </aside>

        <section aria-label="Lista de produtos">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground" aria-live="polite">
              {data ? `${data.total} ${data.total === 1 ? 'produto' : 'produtos'}` : 'Carregando…'}
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="lg:hidden"
                onClick={() => setFiltersOpen(true)}
              >
                <SlidersHorizontal /> FILTROS {activeCount > 0 && `(${activeCount})`}
              </Button>
              <label className="sr-only" htmlFor="sort">
                Ordenar por
              </label>
              <NativeSelect
                id="sort"
                value={filters.sort}
                onChange={(e) => updateFilters({ sort: e.target.value as ProductSort })}
                className="w-48"
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </NativeSelect>
            </div>
          </div>

          <div
            className={
              isFetching && !isLoading ? 'opacity-60 transition-opacity' : 'transition-opacity'
            }
          >
            <ProductGrid
              products={data?.data}
              isLoading={isLoading}
              skeletonCount={6}
              className="lg:grid-cols-3"
            />
          </div>
          {data && (
            <Pagination page={data.page} totalPages={data.totalPages} onChange={changePage} />
          )}
        </section>
      </div>

      <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
        <SheetContent
          side="left"
          className="max-w-[340px] overflow-y-auto"
          aria-describedby={undefined}
        >
          <SheetTitle className="mb-6 text-2xl">Filtros</SheetTitle>
          {panel}
          <Button className="mt-4 w-full" onClick={() => setFiltersOpen(false)}>
            VER {data?.total ?? ''} PRODUTOS
          </Button>
        </SheetContent>
      </Sheet>
    </div>
  )
}
