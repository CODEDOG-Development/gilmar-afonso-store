/**
 * Gera public/sitemap.xml a partir do catálogo.
 * Roda sozinho antes do build (script "prebuild" no package.json).
 * Quando o catálogo vier do backend, troque a leitura abaixo por um fetch na API.
 */
import { writeFileSync } from 'node:fs'
import { createServer } from 'vite'

const SITE_URL = process.env.VITE_SITE_URL ?? 'https://www.gilmarafonso.com.br'

// O Vite carrega o arquivo TypeScript (com os aliases "@/") como se fosse o app
const vite = await createServer({
  server: { middlewareMode: true },
  appType: 'custom',
  logLevel: 'silent',
})
const { products, categories } = await vite.ssrLoadModule('/src/services/mock/data/catalog.ts')
await vite.close()

const today = new Date().toISOString().slice(0, 10)
const urls = [
  { loc: '/', priority: '1.0' },
  { loc: '/produtos', priority: '0.9' },
  { loc: '/sobre', priority: '0.5' },
  ...categories.map((c) => ({ loc: `/produtos?categoria=${c.slug}`, priority: '0.8' })),
  ...products.map((p) => ({ loc: `/produto/${p.slug}`, priority: '0.7' })),
]

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) =>
      `  <url><loc>${SITE_URL}${u.loc.replace(/&/g, '&amp;')}</loc><lastmod>${today}</lastmod><priority>${u.priority}</priority></url>`,
  )
  .join('\n')}
</urlset>
`
writeFileSync(new URL('../public/sitemap.xml', import.meta.url), xml)
console.log(`sitemap.xml gerado com ${urls.length} URLs`)
