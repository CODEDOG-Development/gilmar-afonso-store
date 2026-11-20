import { Heart, LogOut, MapPin, Package, Star } from 'lucide-react'
import { Seo } from '@/components/common/Seo'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useAddresses } from '@/hooks/use-addresses'
import { useLogout } from '@/hooks/use-auth'
import { useAuthStore } from '@/stores/auth.store'
import { formatDate, maskCep } from '@/utils/format'

/** Rota privada. Painel completo do cliente (pedidos, favoritos, avaliações) vem na Fase 2. */
const NEXT = [
  { icon: Package, title: 'Meus pedidos', text: 'Histórico e status de entrega' },
  { icon: Heart, title: 'Favoritos', text: 'Peças que você salvou' },
  { icon: Star, title: 'Avaliações', text: 'O que você achou das compras' },
]

export default function ProfilePage() {
  const user = useAuthStore((s) => s.user)
  const logout = useLogout()
  const { data: addresses = [] } = useAddresses()
  if (!user) return null

  return (
    <div className="container-store py-10">
      <Seo title="Minha conta" noIndex />
      <p className="eyebrow">ÁREA DO CLIENTE</p>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <h1 className="text-[clamp(28px,3.2vw,39px)] font-medium tracking-[-1.5px]">
          Olá, {user.name.split(' ')[0]}
        </h1>
        <Button variant="outline" size="sm" onClick={logout}>
          <LogOut /> SAIR
        </Button>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-sm border border-border p-6">
          <h2 className="mb-4 text-sm font-bold">Dados pessoais</h2>
          <dl className="grid grid-cols-[100px_1fr] gap-y-2 text-sm">
            <dt className="text-muted-foreground">Nome</dt>
            <dd>{user.name}</dd>
            <dt className="text-muted-foreground">E-mail</dt>
            <dd className="break-all">{user.email}</dd>
            <dt className="text-muted-foreground">Celular</dt>
            <dd>{user.phone}</dd>
            <dt className="text-muted-foreground">Cliente desde</dt>
            <dd>{formatDate(user.createdAt)}</dd>
          </dl>
        </section>

        <section className="rounded-sm border border-border p-6">
          <h2 className="mb-4 flex items-center gap-2 text-sm font-bold">
            <MapPin className="size-4" aria-hidden /> Endereços salvos
          </h2>
          {addresses.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Seus endereços aparecem aqui depois da primeira compra.
            </p>
          ) : (
            <ul className="space-y-3 text-sm">
              {addresses.map((a) => (
                <li key={a.id} className="rounded-sm bg-soft p-3">
                  {a.street}, {a.number} — {a.district}, {a.city}/{a.state} · {maskCep(a.cep)}
                  {a.isDefault && (
                    <Badge variant="outline" className="ml-2">
                      Principal
                    </Badge>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        {NEXT.map(({ icon: Icon, title, text }) => (
          <div key={title} className="rounded-sm border border-dashed border-border p-6">
            <Icon className="mb-3 size-5 text-muted-foreground" aria-hidden />
            <h2 className="text-sm font-semibold">{title}</h2>
            <p className="text-xs text-muted-foreground">{text}</p>
            <Badge variant="muted" className="mt-3">
              Em breve
            </Badge>
          </div>
        ))}
      </div>
    </div>
  )
}
