import type { PaymentMethod, PaymentProvider } from '@/types'

/**
 * Contrato comum a todos os gateways. Cada provedor implementa a mesma interface,
 * então o checkout não muda quando você troca Mercado Pago por Stripe (princípio SOLID "D").
 */
export interface PaymentGateway {
  id: PaymentProvider
  label: string
  /** Métodos que o gateway oferece no Brasil. */
  methods: PaymentMethod[]
  /**
   * Transforma os dados do cartão num token, NO NAVEGADOR, com o SDK oficial.
   * O número do cartão nunca passa pelo nosso servidor (exigência PCI-DSS).
   */
  tokenizeCard: (card: CardInput) => Promise<string>
}

export interface CardInput {
  holderName: string
  number: string
  expiry: string
  cvv: string
  installments: number
}

const simulatedToken = async (provider: string) => {
  await new Promise((resolve) => setTimeout(resolve, 400))
  return `${provider}_tok_${crypto.randomUUID()}`
}

export const gateways: Record<PaymentProvider, PaymentGateway> = {
  mercadopago: {
    id: 'mercadopago',
    label: 'Mercado Pago',
    methods: ['pix', 'card', 'boleto'],
    // Produção: carregar https://sdk.mercadopago.com/js/v2 e usar mp.createCardToken(...) ou o Card Payment Brick
    tokenizeCard: () => simulatedToken('mp'),
  },
  stripe: {
    id: 'stripe',
    label: 'Stripe',
    methods: ['card', 'boleto', 'pix'],
    // Produção: @stripe/stripe-js → stripe.createPaymentMethod({ type: 'card', card: elements.getElement(CardElement) })
    tokenizeCard: () => simulatedToken('stripe'),
  },
  paypal: {
    id: 'paypal',
    label: 'PayPal',
    methods: ['card'],
    // Produção: @paypal/react-paypal-js → <PayPalButtons createOrder={...} onApprove={...} />
    tokenizeCard: () => simulatedToken('paypal'),
  },
}

/** Gateway ativo da loja. Trocar aqui (ou ler de variável de ambiente). */
export const activeGateway = gateways.mercadopago
