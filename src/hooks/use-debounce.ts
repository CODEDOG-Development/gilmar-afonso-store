import { useEffect, useState } from 'react'

/** Devolve o valor só depois que ele para de mudar por `delay` ms (evita uma busca por tecla). */
export function useDebounce<T>(value: T, delay = 300) {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])
  return debounced
}
