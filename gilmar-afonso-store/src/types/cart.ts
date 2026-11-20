export interface CartItem {
  /** Chave única da linha: o mesmo produto em outra cor/tamanho vira outra linha. */
  key: string
  productId: string
  slug: string
  name: string
  image: string
  price: number
  color: string
  size: string
  quantity: number
  /** Estoque no momento da adição — limita o botão "+". */
  maxQuantity: number
}

export interface Coupon {
  code: string
  /** Percentual de 0 a 1 (0.1 = 10%). */
  percentOff: number
  description: string
}

export interface CartTotals {
  subtotal: number
  shipping: number
  couponDiscount: number
  paymentDiscount: number
  total: number
  itemCount: number
}
