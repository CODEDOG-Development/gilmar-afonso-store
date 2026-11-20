interface JwtPayload {
  sub: string
  email: string
  role: string
  /** Expiração em segundos desde 1970 (padrão JWT). */
  exp: number
}

/**
 * Lê o conteúdo (payload) de um JWT SEM validar a assinatura.
 * Validar assinatura é papel do backend; o front só precisa saber quando o token expira.
 */
export function decodeJwt(token: string): JwtPayload | null {
  try {
    const payload = token.split('.')[1]
    if (!payload) return null
    // base64url → base64 → bytes → texto UTF-8 → objeto
    const binary = atob(payload.replace(/-/g, '+').replace(/_/g, '/'))
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0))
    return JSON.parse(new TextDecoder().decode(bytes)) as JwtPayload
  } catch {
    return null
  }
}

/** true se o token não existe, é inválido ou já venceu (com 30 s de margem). */
export function isTokenExpired(token: string | null | undefined) {
  if (!token) return true
  const payload = decodeJwt(token)
  return !payload || payload.exp * 1000 < Date.now() + 30_000
}
