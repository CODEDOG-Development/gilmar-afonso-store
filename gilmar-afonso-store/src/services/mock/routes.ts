import { FREE_SHIPPING_THRESHOLD, PRODUCTS_PER_PAGE } from '@/constants'
import type {
  Address,
  CreateOrderPayload,
  LoginPayload,
  Order,
  Product,
  ProductSort,
  RegisterPayload,
  ResetPasswordPayload,
  ShippingOption,
  User,
} from '@/types'
import { decodeJwt, isTokenExpired } from '@/utils/jwt'
import { calculateTotals } from '@/utils/pricing'
import { categories, coupons, products, reviews, testimonials } from './data/catalog'
import { createMockJwt, hashPassword, mockDb, toPublicUser } from './db'
import { MockHttpError, type MockRequest } from './http'

const normalize = (text: string) => text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()

const findProduct = (slug: string) => {
  const product = products.find((p) => p.slug === slug)
  if (!product) throw new MockHttpError(404, 'Produto não encontrado.')
  return product
}

const sorters: Record<ProductSort, (a: Product, b: Product) => number> = {
  relevance: (a, b) => Number(b.isFeatured) - Number(a.isFeatured) || b.soldCount - a.soldCount,
  'best-sellers': (a, b) => b.soldCount - a.soldCount,
  'price-asc': (a, b) => a.price - b.price,
  'price-desc': (a, b) => b.price - a.price,
  newest: (a, b) => b.createdAt.localeCompare(a.createdAt),
  rating: (a, b) => b.rating - a.rating,
}

/** Lê o usuário a partir do header Authorization. Lança 401 se `required`. */
function currentUser(req: MockRequest, required = true): User | null {
  const token = req.headers.authorization?.replace('Bearer ', '')
  if (!token || isTokenExpired(token)) {
    if (required) throw new MockHttpError(401, 'Sessão expirada. Entre novamente.')
    return null
  }
  const payload = decodeJwt(token)
  const user = mockDb.get().users.find((u) => u.id === payload?.sub)
  if (!user) {
    if (required) throw new MockHttpError(401, 'Usuário não encontrado.')
    return null
  }
  return toPublicUser(user)
}

/** Simula a cotação dos Correios pela região do CEP (primeiro dígito). */
function quoteShipping(cep: string, subtotal: number): ShippingOption[] {
  const digits = cep.replace(/\D/g, '')
  if (digits.length !== 8) throw new MockHttpError(422, 'CEP inválido.')
  const region = Number(digits[0])
  const distance = [2, 2, 1, 0, 2, 2, 3, 2, 1, 1][region] ?? 2 // MG (3) é a base da loja
  const pacPrice = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 14.9 + distance * 5
  return [
    { id: 'pac', name: 'PAC', price: Math.round(pacPrice * 100) / 100, days: 4 + distance * 2 },
    {
      id: 'sedex',
      name: 'SEDEX',
      price: Math.round((24.9 + distance * 8) * 100) / 100,
      days: 1 + distance,
    },
  ]
}

type Route = [method: string, path: string, handler: (req: MockRequest<never>) => unknown]

export const routes: Route[] = [
  // ---------- Catálogo ----------
  [
    'GET',
    '/products',
    ({ query }) => {
      const q = normalize(query.get('q') ?? '')
      const category = query.get('category')
      const brands = query.get('brands')?.split(',').filter(Boolean) ?? []
      const minPrice = Number(query.get('minPrice') ?? 0)
      const maxPrice = Number(query.get('maxPrice') ?? Infinity)
      const minRating = Number(query.get('minRating') ?? 0)
      const inStock = query.get('inStock') === 'true'
      const onSale = query.get('onSale') === 'true'
      const sort = (query.get('sort') as ProductSort | null) ?? 'relevance'
      const page = Math.max(1, Number(query.get('page') ?? 1))
      const perPage = Number(query.get('perPage') ?? PRODUCTS_PER_PAGE)

      const filtered = products
        .filter(
          (p) =>
            !q || normalize(`${p.name} ${p.subtitle} ${p.brand} ${p.categorySlug}`).includes(q),
        )
        .filter((p) => !category || p.categorySlug === category)
        .filter((p) => !brands.length || brands.includes(p.brand))
        .filter((p) => p.price >= minPrice && p.price <= maxPrice)
        .filter((p) => p.rating >= minRating)
        .filter((p) => !inStock || p.stock > 0)
        .filter((p) => !onSale || Boolean(p.compareAtPrice))
        .sort(sorters[sort] ?? sorters.relevance)

      const totalPages = Math.max(1, Math.ceil(filtered.length / perPage))
      return {
        data: filtered.slice((page - 1) * perPage, page * perPage),
        page,
        perPage,
        total: filtered.length,
        totalPages,
      }
    },
  ],
  [
    'GET',
    '/products/facets',
    () => ({
      brands: [...new Set(products.map((p) => p.brand))].sort(),
      priceRange: {
        min: Math.floor(Math.min(...products.map((p) => p.price))),
        max: Math.ceil(Math.max(...products.map((p) => p.price))),
      },
    }),
  ],
  [
    'GET',
    '/products/suggestions',
    ({ query }) => {
      const q = normalize(query.get('q') ?? '')
      if (q.length < 2) return []
      return products.filter((p) => normalize(`${p.name} ${p.subtitle}`).includes(q)).slice(0, 5)
    },
  ],
  ['GET', '/products/:slug', ({ params }) => findProduct(params.slug ?? '')],
  [
    'GET',
    '/products/:slug/related',
    ({ params }) => {
      const product = findProduct(params.slug ?? '')
      return products
        .filter((p) => p.id !== product.id && p.categorySlug === product.categorySlug)
        .concat(products.filter((p) => p.categorySlug !== product.categorySlug && p.isFeatured))
        .slice(0, 4)
    },
  ],
  [
    'GET',
    '/products/:slug/reviews',
    ({ params }) => {
      const product = findProduct(params.slug ?? '')
      return reviews.filter((r) => r.productId === product.id)
    },
  ],
  ['GET', '/categories', () => categories],
  ['GET', '/testimonials', () => testimonials],

  // ---------- Carrinho / Checkout ----------
  [
    'POST',
    '/coupons/validate',
    ({ body }: MockRequest<{ code: string }>) => {
      const coupon = coupons.find((c) => c.code === body.code.trim().toUpperCase())
      if (!coupon) throw new MockHttpError(404, 'Cupom inválido ou expirado.')
      return coupon
    },
  ],
  [
    'POST',
    '/shipping/quote',
    ({ body }: MockRequest<{ cep: string; subtotal: number }>) =>
      quoteShipping(body.cep, body.subtotal),
  ],
  [
    'POST',
    '/orders',
    (req: MockRequest<CreateOrderPayload>) => {
      const { body } = req
      const user = currentUser(req, false)

      // O servidor recalcula tudo a partir do catálogo: nunca confie em preço vindo do navegador.
      const items = body.items.map((line) => {
        const product = products.find((p) => p.id === line.productId)
        if (!product) throw new MockHttpError(422, 'Produto indisponível.')
        if (product.stock < line.quantity)
          throw new MockHttpError(409, `Estoque insuficiente: ${product.name}.`)
        return {
          key: `${product.id}-${line.color}-${line.size}`,
          productId: product.id,
          slug: product.slug,
          name: product.name,
          image: product.images[0] ?? '',
          price: product.price,
          color: line.color,
          size: line.size,
          quantity: line.quantity,
          maxQuantity: product.stock,
        }
      })
      const coupon = coupons.find((c) => c.code === body.couponCode?.toUpperCase()) ?? null
      const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0)
      const shipping = quoteShipping(body.address.cep, subtotal).find(
        (o) => o.id === body.shippingOptionId,
      )
      if (!shipping) throw new MockHttpError(422, 'Opção de frete inválida.')

      const totals = calculateTotals({
        items,
        shipping: shipping.price,
        coupon,
        paymentMethod: body.paymentMethod,
      })
      const id = crypto.randomUUID()
      const order: Order = {
        id,
        number: `GA${Date.now().toString().slice(-8)}`,
        userId: user?.id ?? null,
        customer: body.customer,
        items,
        address: body.address,
        shipping,
        paymentMethod: body.paymentMethod,
        paymentProvider: 'mercadopago',
        couponCode: coupon?.code,
        totals,
        status: body.paymentMethod === 'card' ? 'paid' : 'pending_payment',
        payment: {
          pixCode:
            body.paymentMethod === 'pix'
              ? `00020126580014BR.GOV.BCB.PIX0136${id}5204000053039865802BR`
              : undefined,
          boletoLine:
            body.paymentMethod === 'boleto'
              ? '23793.38128 60000.000003 00000.000405 1 99990000000000'
              : undefined,
          installments: body.installments,
        },
        createdAt: new Date().toISOString(),
      }
      mockDb.save((db) => db.orders.push(order))
      return order
    },
  ],
  [
    'GET',
    '/orders/:id',
    ({ params }) => {
      const order = mockDb.get().orders.find((o) => o.id === params.id)
      if (!order) throw new MockHttpError(404, 'Pedido não encontrado.')
      return order
    },
  ],

  // ---------- Endereços do cliente (rota privada) ----------
  ['GET', '/me/addresses', (req) => mockDb.get().addresses[currentUser(req)!.id] ?? []],
  [
    'POST',
    '/me/addresses',
    (req: MockRequest<Omit<Address, 'id'>>) => {
      const user = currentUser(req)!
      const address: Address = { ...req.body, id: crypto.randomUUID() }
      mockDb.save((db) => {
        const list = db.addresses[user.id] ?? []
        // Endereço igual (mesmo CEP e número) não é duplicado
        const filtered = list.filter((a) => !(a.cep === address.cep && a.number === address.number))
        db.addresses[user.id] = [
          ...filtered.map((a) => ({ ...a, isDefault: address.isDefault ? false : a.isDefault })),
          address,
        ]
      })
      return address
    },
  ],

  // ---------- Autenticação ----------
  [
    'POST',
    '/auth/register',
    async ({ body }: MockRequest<RegisterPayload>) => {
      const email = body.email.trim().toLowerCase()
      if (mockDb.get().users.some((u) => u.email === email)) {
        throw new MockHttpError(409, 'Já existe uma conta com este e-mail.')
      }
      const user = {
        id: crypto.randomUUID(),
        name: body.name.trim(),
        email,
        phone: body.phone,
        role: 'customer' as const,
        createdAt: new Date().toISOString(),
        passwordHash: await hashPassword(body.password),
      }
      mockDb.save((db) => db.users.push(user))
      const publicUser = toPublicUser(user)
      return { user: publicUser, accessToken: createMockJwt(publicUser) }
    },
  ],
  [
    'POST',
    '/auth/login',
    async ({ body }: MockRequest<LoginPayload>) => {
      const email = body.email.trim().toLowerCase()
      const hash = await hashPassword(body.password)
      const user = mockDb.get().users.find((u) => u.email === email && u.passwordHash === hash)
      // Mensagem genérica de propósito: não revela se o e-mail existe.
      if (!user) throw new MockHttpError(401, 'E-mail ou senha incorretos.')
      const publicUser = toPublicUser(user)
      return { user: publicUser, accessToken: createMockJwt(publicUser) }
    },
  ],
  ['GET', '/auth/me', (req) => currentUser(req)],
  [
    'POST',
    '/auth/forgot-password',
    ({ body }: MockRequest<{ email: string }>) => {
      const email = body.email.trim().toLowerCase()
      const exists = mockDb.get().users.some((u) => u.email === email)
      let devResetToken: string | undefined
      if (exists) {
        devResetToken = crypto.randomUUID()
        mockDb.save((db) => {
          db.resetTokens[devResetToken as string] = { email, expiresAt: Date.now() + 30 * 60_000 }
        })
      }
      // Resposta sempre igual (exista ou não o e-mail). O token só volta aqui porque é simulação:
      // o backend real envia o link por e-mail.
      return { message: 'Se o e-mail estiver cadastrado, você receberá um link.', devResetToken }
    },
  ],
  [
    'POST',
    '/auth/reset-password',
    async ({ body }: MockRequest<ResetPasswordPayload>) => {
      const entry = mockDb.get().resetTokens[body.token]
      if (!entry || entry.expiresAt < Date.now())
        throw new MockHttpError(400, 'Link inválido ou expirado.')
      const passwordHash = await hashPassword(body.password)
      mockDb.save((db) => {
        const user = db.users.find((u) => u.email === entry.email)
        if (user) user.passwordHash = passwordHash
        delete db.resetTokens[body.token]
      })
      return { message: 'Senha redefinida.' }
    },
  ],
]
