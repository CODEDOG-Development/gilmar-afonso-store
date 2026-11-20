import type { Address, Order, User } from '@/types'

/**
 * "Banco de dados" da simulação, salvo no localStorage do navegador.
 * Serve apenas para a demonstração funcionar sem backend.
 */
interface StoredUser extends User {
  passwordHash: string
}

interface MockDb {
  users: StoredUser[]
  orders: Order[]
  /** userId → endereços salvos */
  addresses: Record<string, Address[]>
  /** token de redefinição → e-mail */
  resetTokens: Record<string, { email: string; expiresAt: number }>
}

const KEY = 'ga_mock_db_v1'

function load(): MockDb {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return { addresses: {}, ...JSON.parse(raw) } as MockDb
  } catch {
    /* localStorage indisponível ou corrompido: começa do zero */
  }
  return { users: [], orders: [], addresses: {}, resetTokens: {} }
}

let db = load()

export const mockDb = {
  get: () => db,
  save(mutator: (draft: MockDb) => void) {
    mutator(db)
    try {
      localStorage.setItem(KEY, JSON.stringify(db))
    } catch {
      /* ignora: a simulação continua em memória */
    }
  },
  reset() {
    db = { users: [], orders: [], addresses: {}, resetTokens: {} }
    localStorage.removeItem(KEY)
  },
}

export type { StoredUser }

/** SHA-256 em hexadecimal. No backend real use bcrypt/argon2 — nunca SHA puro. */
export async function hashPassword(password: string) {
  const bytes = new TextEncoder().encode(`ga-mock-salt:${password}`)
  const digest = await crypto.subtle.digest('SHA-256', bytes)
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('')
}

const base64Url = (value: object) =>
  btoa(String.fromCharCode(...new TextEncoder().encode(JSON.stringify(value))))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')

/** Cria um token no formato JWT (header.payload.assinatura). A assinatura é falsa. */
export function createMockJwt(user: User, ttlSeconds = 60 * 60 * 2) {
  const header = base64Url({ alg: 'HS256', typ: 'JWT' })
  const payload = base64Url({
    sub: user.id,
    email: user.email,
    role: user.role,
    exp: Math.floor(Date.now() / 1000) + ttlSeconds,
  })
  return `${header}.${payload}.mock-signature`
}

export const toPublicUser = ({ passwordHash: _passwordHash, ...user }: StoredUser): User => user
