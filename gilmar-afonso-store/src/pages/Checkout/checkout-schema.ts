import { z } from 'zod'
import { onlyDigits } from '@/utils/format'
import { rules } from '@/utils/validation'

export const checkoutSchema = z
  .object({
    name: rules.name,
    email: rules.email,
    phone: rules.phone,
    cep: rules.cep,
    street: rules.required('a rua'),
    number: rules.required('o número'),
    complement: z.string().optional(),
    district: rules.required('o bairro'),
    city: rules.required('a cidade'),
    state: z.string().length(2, { error: 'Selecione o estado.' }),
    saveAddress: z.boolean(),
    shippingOptionId: z.string().min(1, { error: 'Escolha uma opção de frete.' }),
    paymentMethod: z.enum(['pix', 'card', 'boleto']),
    installments: z.string(),
    cardName: z.string(),
    cardNumber: z.string(),
    cardExpiry: z.string(),
    cardCvv: z.string(),
  })
  // Os campos do cartão só são obrigatórios quando o pagamento é "card"
  .superRefine((data, ctx) => {
    if (data.paymentMethod !== 'card') return
    if (data.cardName.trim().length < 3)
      ctx.addIssue({
        code: 'custom',
        path: ['cardName'],
        message: 'Informe o nome como está no cartão.',
      })
    if (onlyDigits(data.cardNumber).length < 13)
      ctx.addIssue({
        code: 'custom',
        path: ['cardNumber'],
        message: 'Número do cartão incompleto.',
      })
    const [month, year] = data.cardExpiry.split('/').map(Number)
    const expiry = month && year ? new Date(2000 + year, month) : null
    if (!expiry || month! > 12 || expiry < new Date())
      ctx.addIssue({ code: 'custom', path: ['cardExpiry'], message: 'Validade inválida (MM/AA).' })
    if (!/^\d{3,4}$/.test(data.cardCvv))
      ctx.addIssue({ code: 'custom', path: ['cardCvv'], message: 'CVV deve ter 3 ou 4 dígitos.' })
  })

export type CheckoutFormValues = z.infer<typeof checkoutSchema>

export const checkoutDefaults: CheckoutFormValues = {
  name: '',
  email: '',
  phone: '',
  cep: '',
  street: '',
  number: '',
  complement: '',
  district: '',
  city: '',
  state: '',
  saveAddress: true,
  shippingOptionId: '',
  paymentMethod: 'pix',
  installments: '1',
  cardName: '',
  cardNumber: '',
  cardExpiry: '',
  cardCvv: '',
}
