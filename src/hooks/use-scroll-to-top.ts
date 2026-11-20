import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/** Volta ao topo a cada troca de página (sem isso o SPA mantém a rolagem anterior). */
export function useScrollToTop() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) {
      document.getElementById(hash.slice(1))?.scrollIntoView()
      return
    }
    window.scrollTo({ top: 0 })
  }, [pathname, hash])
}
