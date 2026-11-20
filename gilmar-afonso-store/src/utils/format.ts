const currency = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

/** 119.9 → "R$ 119,90" */
export const formatMoney = (value: number) => currency.format(value)

/** Data ISO → "19/11/2026" */
export const formatDate = (iso: string) =>
  new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short' }).format(new Date(iso))

/** Mantém só os dígitos: "30.130-000" → "30130000" */
export const onlyDigits = (value: string) => value.replace(/\D/g, '')

/** Máscara de CEP enquanto o usuário digita: "30130000" → "30130-000" */
export function maskCep(value: string) {
  const digits = onlyDigits(value).slice(0, 8)
  return digits.length > 5 ? `${digits.slice(0, 5)}-${digits.slice(5)}` : digits
}

/** Máscara de telefone: "31999990000" → "(31) 99999-0000" */
export function maskPhone(value: string) {
  const d = onlyDigits(value).slice(0, 11)
  if (d.length <= 2) return d.length ? `(${d}` : ''
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`
}

/** Máscara de cartão: "4111111111111111" → "4111 1111 1111 1111" */
export const maskCardNumber = (value: string) =>
  onlyDigits(value)
    .slice(0, 16)
    .replace(/(\d{4})(?=\d)/g, '$1 ')

/** Máscara de validade: "1228" → "12/28" */
export function maskExpiry(value: string) {
  const d = onlyDigits(value).slice(0, 4)
  return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d
}

/** "Polo Clássica Bordô" → "polo-classica-bordo" */
export const slugify = (text: string) =>
  text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

/** Percentual de desconto entre o preço "de" e o "por". */
export const discountPercent = (price: number, compareAt?: number) =>
  compareAt && compareAt > price ? Math.round((1 - price / compareAt) * 100) : 0
