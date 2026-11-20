import { z } from 'zod'
import { onlyDigits } from './format'

/**
 * Regras de validação reaproveitadas em todos os formulários (login, cadastro, checkout).
 * As mensagens já estão no tom da loja: dizem o que fazer, não só o que está errado.
 */
export const rules = {
  name: z
    .string()
    .trim()
    .min(3, { error: 'Informe seu nome completo.' })
    .refine((v) => v.split(/\s+/).length >= 2, { error: 'Informe nome e sobrenome.' }),
  email: z.string().trim().email({ error: 'Digite um e-mail válido, como voce@email.com.' }),
  phone: z.string().refine((v) => [10, 11].includes(onlyDigits(v).length), {
    error: 'Digite o telefone com DDD.',
  }),
  password: z
    .string()
    .min(8, { error: 'A senha precisa ter pelo menos 8 caracteres.' })
    .regex(/[A-Za-z]/, { error: 'Inclua pelo menos uma letra.' })
    .regex(/\d/, { error: 'Inclua pelo menos um número.' }),
  cep: z.string().refine((v) => onlyDigits(v).length === 8, { error: 'CEP deve ter 8 dígitos.' }),
  required: (label: string) =>
    z
      .string()
      .trim()
      .min(1, { error: `Informe ${label}.` }),
}
