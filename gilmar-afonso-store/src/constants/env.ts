/** Variáveis de ambiente tipadas e com valores padrão (ver .env.example). */
export const env = {
  apiUrl: import.meta.env.VITE_API_URL || '/api',
  useMockApi: import.meta.env.VITE_USE_MOCK_API !== 'false',
  siteUrl: import.meta.env.VITE_SITE_URL || 'https://www.gilmarafonso.com.br',
  routerMode: import.meta.env.VITE_ROUTER_MODE ?? 'browser',
} as const
