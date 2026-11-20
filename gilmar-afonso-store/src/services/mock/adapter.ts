import { AxiosError, AxiosHeaders, type AxiosAdapter, type AxiosResponse } from 'axios'
import { MockHttpError } from './http'
import { routes } from './routes'

const LATENCY_MS = 350

/** Converte "/products/:slug" em uma expressão regular com grupos nomeados. */
const compiled = routes.map(([method, path, handler]) => ({
  method,
  regex: new RegExp(`^${path.replace(/:(\w+)/g, '(?<$1>[^/]+)')}$`),
  handler,
}))

/**
 * Adaptador do Axios que responde no próprio navegador.
 * O resto do app não sabe que é simulação: usa api.get('/products') normalmente.
 * Ao desligar VITE_USE_MOCK_API, as mesmas chamadas vão para o backend real.
 */
export const mockAdapter: AxiosAdapter = async (config) => {
  await new Promise((resolve) => setTimeout(resolve, LATENCY_MS))

  const url = new URL(config.url ?? '/', 'http://mock.local')
  const method = (config.method ?? 'get').toUpperCase()
  // Remove o prefixo da baseURL, se houver (ex.: /api)
  const pathname = url.pathname.replace(/^\/api/, '')
  const query = new URLSearchParams(url.search)
  Object.entries(config.params ?? {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') query.set(key, String(value))
  })

  const headers = Object.fromEntries(
    Object.entries(AxiosHeaders.from(config.headers).toJSON()).map(([k, v]) => [
      k.toLowerCase(),
      String(v),
    ]),
  )
  const body =
    typeof config.data === 'string' && config.data ? JSON.parse(config.data) : (config.data ?? {})

  const respond = (status: number, data: unknown): AxiosResponse => ({
    data,
    status,
    statusText: String(status),
    headers: {},
    config,
  })

  for (const route of compiled) {
    const match = route.method === method && route.regex.exec(pathname)
    if (!match) continue
    try {
      const data = await route.handler({
        params: { ...match.groups },
        query,
        body: body as never,
        headers,
      })
      if (import.meta.env.DEV) console.debug(`[mock] ${method} ${pathname}`, data)
      return respond(200, data)
    } catch (error) {
      const status = error instanceof MockHttpError ? error.status : 500
      const message = error instanceof Error ? error.message : 'Erro inesperado.'
      throw new AxiosError(message, String(status), config, null, respond(status, { message }))
    }
  }

  throw new AxiosError(
    'Rota não encontrada',
    '404',
    config,
    null,
    respond(404, { message: 'Rota não encontrada.' }),
  )
}
