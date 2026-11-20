import { ArrowRight } from 'lucide-react'
import { useState, type FormEvent, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Logo } from '@/components/common/Logo'
import { SocialIcons } from '@/components/common/SocialIcons'
import { ROUTES, STORE } from '@/constants'

const QUICK_LINKS = [
  { to: ROUTES.home, label: 'Início' },
  { to: ROUTES.products, label: 'Produtos' },
  { to: ROUTES.about, label: 'Sobre' },
  { to: ROUTES.faq, label: 'Trocas e Devoluções' },
  { to: ROUTES.contact, label: 'Contato' },
]

const CATEGORY_LINKS = [
  { slug: 'camisetas', label: 'Camisetas' },
  { slug: 'polos', label: 'Polos' },
  { slug: 'camisas-sociais', label: 'Camisas Sociais' },
  { slug: 'moletons', label: 'Moletons' },
]

export function Footer() {
  const [message, setMessage] = useState('')

  function handleNewsletter(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    // Fase 2: enviar para o serviço de e-mail marketing (ex.: POST /newsletter)
    setMessage('Pronto! Você vai receber nossas novidades.')
    event.currentTarget.reset()
  }

  return (
    <footer className="border-t border-[#e9e8e2] bg-background">
      <div className="container-store grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-[1.3fr_0.7fr_0.7fr_1.1fr] lg:gap-12">
        <div>
          <Logo />
          <p className="my-5 max-w-xs text-xs leading-[1.75] text-muted-foreground">
            Vestuário com identidade, qualidade e estilo para todas as ocasiões.
          </p>
          <SocialIcons />
        </div>

        <FooterColumn title="Links rápidos">
          {QUICK_LINKS.map((link) => (
            <Link key={link.label} to={link.to} className="hover:text-accent-foreground">
              {link.label}
            </Link>
          ))}
        </FooterColumn>

        <FooterColumn title="Categorias">
          {CATEGORY_LINKS.map((link) => (
            <Link
              key={link.slug}
              to={ROUTES.category(link.slug)}
              className="hover:text-accent-foreground"
            >
              {link.label}
            </Link>
          ))}
        </FooterColumn>

        <div>
          <h2 className="mb-4 text-xs font-bold">Receba novidades</h2>
          <p className="mb-3 text-xs leading-[1.75] text-muted-foreground">
            Cadastre seu e-mail e fique por dentro dos lançamentos e promoções.
          </p>
          <form
            onSubmit={handleNewsletter}
            className="flex rounded-sm border border-[#e3e1da] bg-[#f3f2ee] p-[3px]"
          >
            <input
              type="email"
              required
              placeholder="Seu melhor e-mail"
              aria-label="Seu e-mail"
              className="min-w-0 flex-1 bg-transparent px-3 py-2.5 text-xs outline-none placeholder:text-[#7a786f]"
            />
            <button
              type="submit"
              aria-label="Cadastrar e-mail"
              className="grid w-10 place-items-center rounded-[1px] bg-foreground text-background"
            >
              <ArrowRight className="size-4" />
            </button>
          </form>
          <p className="mt-2 min-h-4 text-xs text-success" role="status">
            {message}
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            <a href={`mailto:${STORE.email}`} className="hover:text-foreground">
              {STORE.email}
            </a>
          </p>
        </div>
      </div>
      <div className="border-t border-[#ecebe7] py-4 text-center text-[11px] text-muted-foreground">
        © {new Date().getFullYear()} {STORE.fullName}. Todos os direitos reservados.
      </div>
    </footer>
  )
}

function FooterColumn({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <h2 className="mb-4 text-xs font-bold">{title}</h2>
      <nav aria-label={title} className="flex flex-col gap-3 text-xs text-[#5f5d56]">
        {children}
      </nav>
    </div>
  )
}
