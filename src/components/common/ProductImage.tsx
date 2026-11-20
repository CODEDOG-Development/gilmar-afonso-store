import { useState, type ComponentProps } from 'react'
import { cn } from '@/utils/cn'
import { productPlaceholder } from '@/utils/placeholder'

interface ProductImageProps extends Omit<ComponentProps<'img'>, 'src'> {
  src: string
  /** Cor da silhueta provisória, caso a foto não exista. */
  fallbackColor?: string
  /** "contain" preserva a foto inteira (padrão do projeto original, sem cortar o rosto). */
  fit?: 'contain' | 'cover'
}

/**
 * Imagem de produto com:
 * - lazy loading nativo (só baixa quando chega perto da tela)
 * - decodificação assíncrona (não trava a rolagem)
 * - fallback automático para uma silhueta se o arquivo não existir
 */
/**
 * Caminhos começando com "/" recebem o prefixo do site (BASE_URL).
 * No GitHub Pages o site fica em /gilmar-afonso-store/, então
 * "/images/x.jpeg" precisa virar "/gilmar-afonso-store/images/x.jpeg".
 */
const withBase = (src: string) =>
  src.startsWith('/') ? `${import.meta.env.BASE_URL}${src.slice(1)}` : src

export function ProductImage({
  src,
  alt,
  fallbackColor,
  fit = 'contain',
  className,
  loading = 'lazy',
  ...props
}: ProductImageProps) {
  const [failed, setFailed] = useState(false)
  return (
    <img
      src={failed ? productPlaceholder(fallbackColor) : withBase(src)}
      alt={alt}
      loading={loading}
      decoding="async"
      onError={() => setFailed(true)}
      className={cn(
        'h-full w-full bg-image object-top',
        fit === 'contain' ? 'object-contain mix-blend-multiply' : 'object-cover',
        className,
      )}
      {...props}
    />
  )
}
