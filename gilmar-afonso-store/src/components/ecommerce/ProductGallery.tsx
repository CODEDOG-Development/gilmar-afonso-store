import { Expand } from 'lucide-react'
import { useState, type MouseEvent } from 'react'
import { ProductImage } from '@/components/common/ProductImage'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { cn } from '@/utils/cn'

interface ProductGalleryProps {
  images: string[]
  name: string
  fallbackColor?: string
}

/**
 * Galeria com miniaturas, zoom ao passar o mouse (desktop) e tela cheia ao clicar.
 * O zoom move o "transform-origin" para o ponto do cursor e amplia 2x.
 */
export function ProductGallery({ images, name, fallbackColor }: ProductGalleryProps) {
  const [active, setActive] = useState(0)
  const [zoom, setZoom] = useState<{ x: number; y: number } | null>(null)
  const [lightbox, setLightbox] = useState(false)
  const current = images[active] ?? ''

  function handleMove(event: MouseEvent<HTMLButtonElement>) {
    const rect = event.currentTarget.getBoundingClientRect()
    setZoom({
      x: ((event.clientX - rect.left) / rect.width) * 100,
      y: ((event.clientY - rect.top) / rect.height) * 100,
    })
  }

  return (
    <div className="flex flex-col-reverse gap-3 md:flex-row">
      {images.length > 1 && (
        <ul className="flex gap-2 md:flex-col" aria-label="Fotos do produto">
          {images.map((src, index) => (
            <li key={src}>
              <button
                type="button"
                onClick={() => setActive(index)}
                aria-label={`Ver foto ${index + 1} de ${images.length}`}
                aria-current={index === active}
                className={cn(
                  'block h-24 w-20 overflow-hidden rounded-sm border-2 transition-colors',
                  index === active ? 'border-foreground' : 'border-transparent hover:border-border',
                )}
              >
                <ProductImage src={src} alt="" fallbackColor={fallbackColor} />
              </button>
            </li>
          ))}
        </ul>
      )}

      <button
        type="button"
        className="group relative aspect-[4/5] flex-1 cursor-zoom-in overflow-hidden bg-image"
        onMouseMove={handleMove}
        onMouseLeave={() => setZoom(null)}
        onClick={() => setLightbox(true)}
        aria-label="Ampliar foto"
      >
        <ProductImage
          src={current}
          alt={`${name} — foto ${active + 1}`}
          fallbackColor={fallbackColor}
          loading="eager"
          fetchPriority="high"
          className="transition-transform duration-200 ease-out"
          style={
            zoom ? { transform: 'scale(2)', transformOrigin: `${zoom.x}% ${zoom.y}%` } : undefined
          }
        />
        <span className="absolute right-3 bottom-3 grid size-9 place-items-center rounded-full bg-background/90 opacity-0 shadow transition-opacity group-hover:opacity-100 max-md:opacity-100">
          <Expand className="size-4" aria-hidden />
        </span>
      </button>

      <Dialog open={lightbox} onOpenChange={setLightbox}>
        <DialogContent
          className="h-[90dvh] w-[min(900px,calc(100%-24px))] p-0"
          aria-describedby={undefined}
        >
          <DialogTitle className="sr-only">{name}</DialogTitle>
          <ProductImage
            src={current}
            alt={name}
            fallbackColor={fallbackColor}
            className="rounded-md"
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
