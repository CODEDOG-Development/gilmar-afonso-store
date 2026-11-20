import { STORE } from '@/constants'
import { env } from '@/constants/env'

interface SeoProps {
  title?: string
  description?: string
  /** Caminho da página (ex.: "/produtos"). Gera a URL canônica e o og:url. */
  path?: string
  image?: string
  type?: 'website' | 'product'
  noIndex?: boolean
  /** Dados estruturados (schema.org) para o Google mostrar preço e estrelas. */
  jsonLd?: object
}

const DEFAULT_DESCRIPTION =
  'Gilmar Afonso Company Store — vestuário premium com identidade e estilo.'

/**
 * Meta tags por página. O React 19 move <title>, <meta> e <link> para o <head>
 * automaticamente, então não precisamos de biblioteca extra (react-helmet).
 */
export function Seo({
  title,
  description = DEFAULT_DESCRIPTION,
  path = '',
  image,
  type = 'website',
  noIndex,
  jsonLd,
}: SeoProps) {
  const fullTitle = title ? `${title} | ${STORE.name}` : `${STORE.name} | Company Store`
  const url = `${env.siteUrl}${path}`
  const ogImage = image ? new URL(image, env.siteUrl).href : `${env.siteUrl}/images/og-cover.jpg`

  return (
    <>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      {noIndex && <meta name="robots" content="noindex, nofollow" />}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta property="og:image" content={ogImage} />
      {jsonLd && <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>}
    </>
  )
}
