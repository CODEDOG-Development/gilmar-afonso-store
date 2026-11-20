import type {
  Category,
  Paginated,
  Product,
  ProductFacets,
  ProductFilters,
  Review,
  Testimonial,
} from '@/types'
import { api } from './api'

/** Converte os filtros em query string (arrays viram "a,b,c"). */
const toParams = ({ brands, ...rest }: ProductFilters) => ({
  ...rest,
  brands: brands?.length ? brands.join(',') : undefined,
})

export const productService = {
  list: async (filters: ProductFilters) =>
    (await api.get<Paginated<Product>>('/products', { params: toParams(filters) })).data,

  facets: async () => (await api.get<ProductFacets>('/products/facets')).data,

  suggestions: async (q: string) =>
    (await api.get<Product[]>('/products/suggestions', { params: { q } })).data,

  getBySlug: async (slug: string) => (await api.get<Product>(`/products/${slug}`)).data,

  related: async (slug: string) => (await api.get<Product[]>(`/products/${slug}/related`)).data,

  reviews: async (slug: string) => (await api.get<Review[]>(`/products/${slug}/reviews`)).data,

  categories: async () => (await api.get<Category[]>('/categories')).data,

  testimonials: async () => (await api.get<Testimonial[]>('/testimonials')).data,
}
