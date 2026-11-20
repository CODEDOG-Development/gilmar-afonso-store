import { Search, X } from 'lucide-react'
import { useId, useState, type FormEvent, type KeyboardEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { ProductImage } from '@/components/common/ProductImage'
import { ROUTES } from '@/constants'
import { useDebounce } from '@/hooks/use-debounce'
import { useSearchSuggestions } from '@/hooks/use-products'
import { formatMoney } from '@/utils/format'

/**
 * Busca instantânea com sugestões automáticas.
 * Segue o padrão ARIA "combobox": setas ↑ ↓ navegam, Enter abre, Esc fecha.
 */
export function SearchBar({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(-1)
  const debounced = useDebounce(query.trim(), 250)
  const { data: suggestions = [], isFetching } = useSearchSuggestions(debounced)
  const navigate = useNavigate()
  const listId = useId()
  const showList = debounced.length >= 2

  function goToProduct(slug: string) {
    navigate(ROUTES.product(slug))
    onClose()
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    const selected = suggestions[activeIndex]
    if (selected) return goToProduct(selected.slug)
    if (!query.trim()) return
    navigate(`${ROUTES.products}?q=${encodeURIComponent(query.trim())}`)
    onClose()
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setActiveIndex((i) => Math.min(i + 1, suggestions.length - 1))
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      setActiveIndex((i) => Math.max(i - 1, -1))
    } else if (event.key === 'Escape') {
      onClose()
    }
  }

  return (
    <div className="absolute inset-x-0 top-full z-40 border-b border-border bg-background shadow-[0_12px_20px_#0000000a]">
      <form
        role="search"
        onSubmit={handleSubmit}
        className="container-store relative flex items-center gap-3 py-4"
      >
        <Search
          className="pointer-events-none absolute left-[calc(4.8%+14px)] size-4 text-muted-foreground"
          aria-hidden
        />
        <input
          autoFocus
          type="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setActiveIndex(-1)
          }}
          onKeyDown={handleKeyDown}
          placeholder="Buscar produtos…"
          aria-label="Buscar produtos"
          role="combobox"
          aria-expanded={showList}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={activeIndex >= 0 ? `${listId}-${activeIndex}` : undefined}
          className="h-12 min-w-0 flex-1 rounded-sm border border-[#e1dfd7] bg-[#f6f5f1] pr-4 pl-10 text-sm outline-none focus:border-ring"
        />
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar busca"
          className="rounded-sm p-1"
        >
          <X className="size-6" />
        </button>

        {showList && (
          <ul
            id={listId}
            role="listbox"
            aria-label="Sugestões"
            className="absolute inset-x-[4.8%] top-full -mt-2 max-h-[60vh] overflow-y-auto rounded-sm border border-border bg-background shadow-lg"
          >
            {suggestions.length === 0 && !isFetching && (
              <li className="px-4 py-3 text-sm text-muted-foreground">
                Nenhum produto para “{debounced}”.
              </li>
            )}
            {suggestions.map((product, index) => (
              <li
                key={product.id}
                id={`${listId}-${index}`}
                role="option"
                aria-selected={index === activeIndex}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => goToProduct(product.slug)}
                className="flex cursor-pointer items-center gap-3 px-4 py-2.5 hover:bg-muted aria-selected:bg-muted"
              >
                <span className="h-14 w-12 shrink-0 overflow-hidden rounded-sm">
                  <ProductImage
                    src={product.images[0] ?? ''}
                    alt=""
                    fallbackColor={product.colors[0]?.hex}
                  />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium">{product.name}</span>
                  <span className="block text-xs text-muted-foreground">{product.subtitle}</span>
                </span>
                <span className="text-sm font-semibold">{formatMoney(product.price)}</span>
              </li>
            ))}
            {suggestions.length > 0 && (
              <li className="border-t border-border">
                <button
                  type="submit"
                  className="w-full px-4 py-3 text-left text-xs font-semibold underline underline-offset-4"
                >
                  Ver todos os resultados para “{debounced}” →
                </button>
              </li>
            )}
          </ul>
        )}
      </form>
    </div>
  )
}
