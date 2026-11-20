import path from 'node:path'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    // "@/" aponta para "src/" — evita imports como "../../../components"
    alias: { '@': path.resolve(import.meta.dirname, './src') },
  },
  build: {
    rollupOptions: {
      output: {
        // Separa as bibliotecas grandes em arquivos próprios para melhor cache
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined
          if (/react-dom|react-router|[\\/]react[\\/]|scheduler/.test(id)) return 'react'
          if (id.includes('framer-motion') || id.includes('motion-')) return 'motion'
          if (id.includes('@tanstack') || id.includes('axios') || id.includes('zustand'))
            return 'data'
          return undefined
        },
      },
    },
  },
})
