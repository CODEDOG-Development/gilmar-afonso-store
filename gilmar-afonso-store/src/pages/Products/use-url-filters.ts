import { useCallback, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { PRODUCTS_PER_PAGE } from '@/constants'
import type { ProductFilters, ProductSort } from '@/types'

/**
 * Os filtros moram na URL (/produtos?categoria=polos&ordem=price-asc&pagina=2).
 * Vantagens: F5 não perde o filtro, o botão "voltar" funciona e o link pode ser compartilhado.
 * Os nomes ficam em português na URL (amigável), e em inglês no código.
 */
const PARAM = {
  q: 'q',
  category: 'categoria',
  brands: 'marcas',
  minPrice: 'min',
  maxPrice: 'max',
  minRating: 'nota',
  inStock: 'estoque',
  onSale: 'promocao',
  sort: 'ordem',
  page: 'pagina',
} as const

const toNumber = (value: string | null) => (value ? Number(value) : undefined)

export function useUrlFilters() {
  const [params, setParams] = useSearchParams()

  const filters = useMemo<ProductFilters>(
    () => ({
      q: params.get(PARAM.q) ?? undefined,
      category: params.get(PARAM.category) ?? undefined,
      brands: params.get(PARAM.brands)?.split(',').filter(Boolean),
      minPrice: toNumber(params.get(PARAM.minPrice)),
      maxPrice: toNumber(params.get(PARAM.maxPrice)),
      minRating: toNumber(params.get(PARAM.minRating)),
      inStock: params.get(PARAM.inStock) === '1' || undefined,
      onSale: params.get(PARAM.onSale) === '1' || undefined,
      sort: (params.get(PARAM.sort) as ProductSort | null) ?? 'relevance',
      page: toNumber(params.get(PARAM.page)) ?? 1,
      perPage: PRODUCTS_PER_PAGE,
    }),
    [params],
  )

  /** Altera um ou mais filtros. Qualquer mudança (exceto de página) volta para a página 1. */
  const updateFilters = useCallback(
    (patch: Partial<ProductFilters>) => {
      setParams(
        (current) => {
          const next = new URLSearchParams(current)
          Object.entries(patch).forEach(([key, value]) => {
            const name = PARAM[key as keyof typeof PARAM]
            if (!name) return
            const serialized = Array.isArray(value)
              ? value.join(',')
              : typeof value === 'boolean'
                ? value
                  ? '1'
                  : ''
                : value
            if (serialized === undefined || serialized === '' || serialized === null)
              next.delete(name)
            else next.set(name, String(serialized))
          })
          if (!('page' in patch)) next.delete(PARAM.page)
          return next
        },
        { replace: !('page' in patch) },
      )
    },
    [setParams],
  )

  const clearFilters = useCallback(() => setParams({}), [setParams])

  const activeCount = [
    filters.category,
    filters.brands?.length,
    filters.minPrice,
    filters.maxPrice,
    filters.minRating,
    filters.inStock,
    filters.onSale,
  ].filter(Boolean).length

  return { filters, updateFilters, clearFilters, activeCount }
}
