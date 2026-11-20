/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_USE_MOCK_API: string
  readonly VITE_SITE_URL: string
  readonly VITE_ROUTER_MODE?: 'browser' | 'hash'
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
