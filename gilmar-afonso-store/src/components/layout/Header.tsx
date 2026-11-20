import { Menu, Search, ShoppingBag, User } from 'lucide-react'
import { useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Logo } from '@/components/common/Logo'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet'
import { ROUTES } from '@/constants'
import { useAuthStore, useIsAuthenticated } from '@/stores/auth.store'
import { useCartCount, useCartStore } from '@/stores/cart.store'
import { cn } from '@/utils/cn'
import { SearchBar } from './SearchBar'

const NAV_LINKS = [
  { to: ROUTES.home, label: 'Início', end: true },
  { to: ROUTES.products, label: 'Produtos', end: false },
  { to: ROUTES.about, label: 'Sobre', end: true },
  { to: ROUTES.contact, label: 'Contato', end: true },
]

export function Header() {
  const [searchOpen, setSearchOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const cartCount = useCartCount()
  const openCart = useCartStore((s) => s.setDrawerOpen)
  const isAuthenticated = useIsAuthenticated()
  const userName = useAuthStore((s) => s.user?.name)
  const { hash } = useLocation()

  const linkClass = (isActive: boolean, to: string) =>
    cn(
      'transition-colors hover:text-accent-foreground',
      // "Contato" é âncora dentro de /sobre: só fica ativo quando a âncora está na URL
      isActive &&
        (to.includes('#') ? hash === '#contato' : !(to === ROUTES.about && hash)) &&
        'font-semibold',
    )

  return (
    <header className="sticky top-0 z-40 border-b border-[#efeee9] bg-background/95 backdrop-blur">
      <div className="container-store flex h-[66px] items-center justify-between gap-4 md:h-[76px]">
        <button
          type="button"
          className="md:hidden"
          onClick={() => setMenuOpen(true)}
          aria-label="Abrir menu"
        >
          <Menu className="size-6" />
        </button>

        <Logo className="mr-auto ml-2 md:mr-0 md:ml-0 md:min-w-[210px]" />

        <nav
          aria-label="Principal"
          className="hidden items-center gap-7 text-xs text-[#292824] md:flex"
        >
          {NAV_LINKS.map(({ to, label, end }) => (
            <NavLink
              key={label}
              to={to}
              end={end}
              className={({ isActive }) => linkClass(isActive, to)}
            >
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-1 sm:gap-3">
          <button
            type="button"
            onClick={() => setSearchOpen((open) => !open)}
            aria-label="Pesquisar"
            aria-expanded={searchOpen}
            className="grid size-10 place-items-center rounded-sm hover:bg-muted"
          >
            <Search className="size-5" />
          </button>
          <button
            type="button"
            onClick={() => openCart(true)}
            aria-label={`Abrir carrinho, ${cartCount} ${cartCount === 1 ? 'item' : 'itens'}`}
            className="relative grid size-10 place-items-center rounded-sm hover:bg-muted"
          >
            <ShoppingBag className="size-5" />
            {cartCount > 0 && (
              <span className="absolute top-1 right-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-foreground px-1 text-[9px] text-background">
                {cartCount}
              </span>
            )}
          </button>
          <Button asChild size="sm" className="ml-1 h-9 px-3 sm:px-4">
            <Link to={isAuthenticated ? ROUTES.account : ROUTES.login}>
              <User className="sm:hidden" aria-hidden />
              <span className="max-sm:sr-only">
                {isAuthenticated ? (userName?.split(' ')[0] ?? 'Minha conta') : 'Entrar'}
              </span>
            </Link>
          </Button>
        </div>
      </div>

      {searchOpen && <SearchBar onClose={() => setSearchOpen(false)} />}

      <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
        <SheetContent side="left" className="max-w-[320px]" aria-describedby={undefined}>
          <SheetTitle className="sr-only">Menu</SheetTitle>
          <Logo />
          <nav aria-label="Menu móvel" className="mt-10 flex flex-col gap-5 text-base">
            {NAV_LINKS.map(({ to, label, end }) => (
              <NavLink
                key={label}
                to={to}
                end={end}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) => linkClass(isActive, to)}
              >
                {label}
              </NavLink>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
    </header>
  )
}
