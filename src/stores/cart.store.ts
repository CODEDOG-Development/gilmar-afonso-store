import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartItem, Coupon, Product } from '@/types'

interface AddItemInput {
  product: Product
  color: string
  size: string
  quantity?: number
}

interface CartState {
  items: CartItem[]
  coupon: Coupon | null
  /** Controla o carrinho lateral (não é salvo no localStorage). */
  isDrawerOpen: boolean
  addItem: (input: AddItemInput) => void
  updateQuantity: (key: string, quantity: number) => void
  removeItem: (key: string) => void
  applyCoupon: (coupon: Coupon | null) => void
  clear: () => void
  setDrawerOpen: (open: boolean) => void
}

const lineKey = (productId: string, color: string, size: string) => `${productId}-${color}-${size}`

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      coupon: null,
      isDrawerOpen: false,

      addItem: ({ product, color, size, quantity = 1 }) =>
        set((state) => {
          const key = lineKey(product.id, color, size)
          const existing = state.items.find((item) => item.key === key)
          if (existing) {
            // Mesmo produto/cor/tamanho: só soma a quantidade, respeitando o estoque
            return {
              items: state.items.map((item) =>
                item.key === key
                  ? { ...item, quantity: Math.min(item.quantity + quantity, item.maxQuantity) }
                  : item,
              ),
            }
          }
          const newItem: CartItem = {
            key,
            productId: product.id,
            slug: product.slug,
            name: product.name,
            image: product.images[0] ?? '',
            price: product.price,
            color,
            size,
            quantity: Math.min(quantity, product.stock),
            maxQuantity: product.stock,
          }
          return { items: [...state.items, newItem] }
        }),

      updateQuantity: (key, quantity) =>
        set((state) => ({
          items:
            quantity <= 0
              ? state.items.filter((item) => item.key !== key)
              : state.items.map((item) =>
                  item.key === key
                    ? { ...item, quantity: Math.min(quantity, item.maxQuantity) }
                    : item,
                ),
        })),

      removeItem: (key) =>
        set((state) => ({ items: state.items.filter((item) => item.key !== key) })),
      applyCoupon: (coupon) => set({ coupon }),
      clear: () => set({ items: [], coupon: null }),
      setDrawerOpen: (isDrawerOpen) => set({ isDrawerOpen }),
    }),
    {
      name: 'ga-cart',
      // Salva só os dados do carrinho; o estado "aberto/fechado" não deve persistir
      partialize: ({ items, coupon }) => ({ items, coupon }),
    },
  ),
)

/** Quantidade total de peças (para o contador do ícone). */
export const useCartCount = () =>
  useCartStore((state) => state.items.reduce((sum, item) => sum + item.quantity, 0))
