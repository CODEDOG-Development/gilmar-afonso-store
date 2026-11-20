export interface ProductColor {
  name: string
  /** Cor em hexadecimal, usada na bolinha de seleção (swatch). */
  hex: string
}

export interface ProductSpec {
  label: string
  value: string
}

export interface Product {
  id: string
  /** Identificador amigável usado na URL: /produto/polo-classica-bordo */
  slug: string
  name: string
  subtitle: string
  description: string
  price: number
  /** Preço "de" (riscado). Quando existe, o produto está em promoção. */
  compareAtPrice?: number
  categorySlug: string
  brand: string
  images: string[]
  colors: ProductColor[]
  sizes: string[]
  specs: ProductSpec[]
  rating: number
  reviewCount: number
  stock: number
  soldCount: number
  isFeatured: boolean
  createdAt: string
}

export interface Category {
  id: string
  slug: string
  name: string
  description: string
  image: string
}

export interface Review {
  id: string
  productId: string
  author: string
  rating: number
  title: string
  comment: string
  createdAt: string
  verifiedPurchase: boolean
}

export interface Testimonial {
  id: string
  author: string
  city: string
  text: string
  rating: number
}

export type ProductSort =
  'relevance' | 'best-sellers' | 'price-asc' | 'price-desc' | 'newest' | 'rating'

/** Filtros da listagem. Todos opcionais: o que não vier, não filtra. */
export interface ProductFilters {
  q?: string
  category?: string
  brands?: string[]
  minPrice?: number
  maxPrice?: number
  minRating?: number
  inStock?: boolean
  onSale?: boolean
  sort?: ProductSort
  page?: number
  perPage?: number
}

export interface Paginated<T> {
  data: T[]
  page: number
  perPage: number
  total: number
  totalPages: number
}

/** Valores disponíveis para montar a barra de filtros. */
export interface ProductFacets {
  brands: string[]
  priceRange: { min: number; max: number }
}
