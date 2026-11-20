/** Regras comerciais centralizadas: mude aqui e vale para o site inteiro. */
export const STORE = {
  name: 'Gilmar Afonso',
  fullName: 'Gilmar Afonso Company Store',
  email: 'contato@gilmarafonso.com.br',
  phone: '(31) 99999-0000',
  whatsapp: '5531999990000',
  address: 'Belo Horizonte, MG',
  instagram: 'https://instagram.com/',
  facebook: 'https://facebook.com/',
  tiktok: 'https://tiktok.com/',
} as const

export const PIX_DISCOUNT = 0.05
export const FREE_SHIPPING_THRESHOLD = 299
export const MAX_INSTALLMENTS = 12
export const PRODUCTS_PER_PAGE = 12

export const ROUTES = {
  home: '/',
  products: '/produtos',
  category: (slug: string) => `/produtos?categoria=${slug}`,
  product: (slug: string) => `/produto/${slug}`,
  cart: '/carrinho',
  checkout: '/checkout',
  orderSuccess: (id: string) => `/pedido/${id}/sucesso`,
  login: '/entrar',
  register: '/cadastro',
  forgotPassword: '/recuperar-senha',
  resetPassword: '/redefinir-senha',
  account: '/conta',
  about: '/sobre',
  contact: '/sobre#contato',
  faq: '/sobre#faq',
} as const

/** Chaves do React Query. Centralizar evita erro de digitação ao invalidar o cache. */
export const QUERY_KEYS = {
  products: (filters: object) => ['products', filters] as const,
  product: (slug: string) => ['product', slug] as const,
  related: (slug: string) => ['product', slug, 'related'] as const,
  reviews: (productId: string) => ['reviews', productId] as const,
  categories: ['categories'] as const,
  facets: ['products', 'facets'] as const,
  suggestions: (q: string) => ['products', 'suggestions', q] as const,
  testimonials: ['testimonials'] as const,
  order: (id: string) => ['order', id] as const,
} as const

export const BRAZIL_STATES = [
  'AC',
  'AL',
  'AP',
  'AM',
  'BA',
  'CE',
  'DF',
  'ES',
  'GO',
  'MA',
  'MT',
  'MS',
  'MG',
  'PA',
  'PB',
  'PR',
  'PE',
  'PI',
  'RJ',
  'RN',
  'RS',
  'RO',
  'RR',
  'SC',
  'SP',
  'SE',
  'TO',
] as const
