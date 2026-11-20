import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/constants'
import { productService } from '@/services/product.service'
import type { ProductFilters } from '@/types'

/** Listagem paginada. keepPreviousData mantém a grade na tela enquanto a próxima página carrega. */
export const useProducts = (filters: ProductFilters) =>
  useQuery({
    queryKey: QUERY_KEYS.products(filters),
    queryFn: () => productService.list(filters),
    placeholderData: keepPreviousData,
  })

export const useProduct = (slug: string) =>
  useQuery({ queryKey: QUERY_KEYS.product(slug), queryFn: () => productService.getBySlug(slug) })

export const useRelatedProducts = (slug: string) =>
  useQuery({ queryKey: QUERY_KEYS.related(slug), queryFn: () => productService.related(slug) })

export const useProductReviews = (slug: string) =>
  useQuery({ queryKey: QUERY_KEYS.reviews(slug), queryFn: () => productService.reviews(slug) })

/** Categorias e filtros mudam pouco: ficam 30 min em cache. */
export const useCategories = () =>
  useQuery({
    queryKey: QUERY_KEYS.categories,
    queryFn: productService.categories,
    staleTime: 30 * 60_000,
  })

export const useProductFacets = () =>
  useQuery({ queryKey: QUERY_KEYS.facets, queryFn: productService.facets, staleTime: 30 * 60_000 })

export const useTestimonials = () =>
  useQuery({
    queryKey: QUERY_KEYS.testimonials,
    queryFn: productService.testimonials,
    staleTime: 30 * 60_000,
  })

/** Sugestões da busca instantânea. Só dispara com 2+ letras. */
export const useSearchSuggestions = (q: string) =>
  useQuery({
    queryKey: QUERY_KEYS.suggestions(q),
    queryFn: () => productService.suggestions(q),
    enabled: q.trim().length >= 2,
    staleTime: 5 * 60_000,
  })
