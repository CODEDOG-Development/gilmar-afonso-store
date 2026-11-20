import {
  Award,
  Gem,
  HeartHandshake,
  Leaf,
  Mail,
  MapPin,
  Phone,
  Ruler,
  ShieldCheck,
  Truck,
} from 'lucide-react'
import { ProductImage } from '@/components/common/ProductImage'
import { Reveal } from '@/components/common/Reveal'
import { SectionHeading } from '@/components/common/SectionHeading'
import { Seo } from '@/components/common/Seo'
import { SocialIcons } from '@/components/common/SocialIcons'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { FREE_SHIPPING_THRESHOLD, ROUTES, STORE } from '@/constants'
import { formatMoney } from '@/utils/format'

/*
 * Textos institucionais de exemplo — revise com o cliente antes de publicar.
 */
const PILLARS = [
  {
    eyebrow: 'MISSÃO',
    title: 'Vestir bem, todos os dias',
    text: 'Oferecer peças de qualidade superior, com conforto e acabamento premium, a um preço justo para quem quer se vestir bem sem complicação.',
  },
  {
    eyebrow: 'VISÃO',
    title: 'Referência em vestuário premium',
    text: 'Ser reconhecida em todo o Brasil como a marca que une design atemporal, durabilidade e atendimento próximo.',
  },
  {
    eyebrow: 'VALORES',
    title: 'O que guia cada peça',
    text: 'Qualidade sem atalhos, respeito a quem produz e a quem veste, transparência nas relações e melhoria contínua.',
  },
]

const DIFFERENTIALS = [
  {
    icon: Gem,
    title: 'Matéria-prima selecionada',
    text: 'Algodão penteado e tecidos que mantêm cor e forma.',
  },
  { icon: Ruler, title: 'Modelagem pensada', text: 'Caimento testado em diferentes biotipos.' },
  { icon: ShieldCheck, title: 'Troca fácil', text: 'Primeira troca grátis em até 30 dias.' },
  {
    icon: Truck,
    title: 'Envio para todo o Brasil',
    text: `Frete grátis acima de ${formatMoney(FREE_SHIPPING_THRESHOLD)}.`,
  },
  {
    icon: HeartHandshake,
    title: 'Atendimento humano',
    text: 'Fale com uma pessoa de verdade pelo WhatsApp.',
  },
  { icon: Leaf, title: 'Produção responsável', text: 'Parceiros nacionais e menos desperdício.' },
]

const FAQ = [
  {
    q: 'Qual o prazo de entrega?',
    a: 'Depende do CEP e da modalidade: PAC de 4 a 10 dias úteis e SEDEX de 1 a 4 dias úteis após a confirmação do pagamento. Você calcula o prazo exato na página do produto.',
  },
  {
    q: 'Como funciona a troca?',
    a: 'Você tem até 30 dias após o recebimento para trocar. A primeira troca é gratuita: basta falar com o nosso atendimento e enviaremos a etiqueta de postagem.',
  },
  {
    q: 'Posso devolver e receber o dinheiro de volta?',
    a: 'Sim. Pelo Código de Defesa do Consumidor, compras online podem ser devolvidas em até 7 dias após o recebimento, com reembolso integral.',
  },
  {
    q: 'Quais formas de pagamento vocês aceitam?',
    a: 'Pix (com 5% de desconto), cartão de crédito em até 12x sem juros e boleto bancário.',
  },
  {
    q: 'Como escolho o tamanho certo?',
    a: 'Cada produto traz as medidas na aba Especificações. Se ficar entre dois tamanhos, escolha o maior para um caimento mais solto.',
  },
  {
    q: 'Vocês fazem pedidos para empresas e uniformes?',
    a: 'Sim! Atendemos pedidos corporativos com personalização. Fale com a gente pelo e-mail ou WhatsApp.',
  },
]

export default function AboutPage() {
  return (
    <>
      <Seo
        title="Sobre a marca"
        description="Conheça a história, a missão e os valores da Gilmar Afonso Company Store."
        path={ROUTES.about}
      />

      {/* Nossa história */}
      <section className="grid bg-image md:grid-cols-2">
        <div className="self-center px-[6%] py-14 md:px-[10%]">
          <p className="eyebrow">NOSSA HISTÓRIA</p>
          <h1 className="mb-5 text-[clamp(32px,4vw,52px)] leading-[1.05] font-medium tracking-[-1.8px]">
            Feita para quem
            <br />
            valoriza os detalhes
          </h1>
          <p className="max-w-md text-sm leading-[1.8] text-[#5e5c55]">
            A Gilmar Afonso nasceu da vontade de criar roupas que acompanham a rotina com elegância.
            Começamos com poucas peças essenciais e um compromisso: nenhuma costura sai sem passar
            pelo nosso controle de qualidade. Hoje atendemos clientes em todo o Brasil, mantendo o
            mesmo cuidado do primeiro dia.
          </p>
        </div>
        <div className="h-[380px] md:h-[520px]">
          <ProductImage
            src="/images/products/polo-bordo.jpeg"
            alt="Polo bordô Gilmar Afonso"
            loading="eager"
            fallbackColor="#6b1f2a"
          />
        </div>
      </section>

      {/* Missão, visão e valores */}
      <section className="container-store py-14">
        <div className="grid gap-4 md:grid-cols-3">
          {PILLARS.map((pillar, index) => (
            <Reveal key={pillar.eyebrow} delay={index * 0.08} className="rounded-sm bg-soft p-8">
              <p className="eyebrow">{pillar.eyebrow}</p>
              <h2 className="mb-3 text-xl font-medium tracking-tight">{pillar.title}</h2>
              <p className="text-sm leading-relaxed text-muted-foreground">{pillar.text}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Diferenciais */}
      <section className="bg-foreground py-14 text-background">
        <div className="container-store">
          <p className="mb-3 text-[11px] tracking-eyebrow text-accent">DIFERENCIAIS</p>
          <h2 className="mb-10 text-[clamp(28px,3.2vw,39px)] font-medium tracking-[-1.5px]">
            Por que escolher a Gilmar Afonso
          </h2>
          <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {DIFFERENTIALS.map(({ icon: Icon, title, text }) => (
              <li key={title} className="flex gap-4">
                <Icon className="size-6 shrink-0 text-accent" strokeWidth={1.5} aria-hidden />
                <div>
                  <h3 className="text-sm font-semibold">{title}</h3>
                  <p className="mt-1 text-sm text-[#c9c7bf]">{text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Cultura */}
      <section className="container-store py-14 text-center">
        <Award className="mx-auto mb-4 size-7 text-accent" aria-hidden />
        <p className="mx-auto max-w-2xl font-display text-[clamp(22px,2.6vw,32px)] leading-snug italic">
          “Uma peça bem feita não precisa chamar atenção. Ela simplesmente faz você se sentir bem.”
        </p>
        <p className="mt-4 text-xs tracking-eyebrow text-muted-foreground">
          GILMAR AFONSO, FUNDADOR
        </p>
      </section>

      {/* FAQ */}
      <section id="faq" className="bg-soft py-14">
        <div className="container-store grid gap-10 lg:grid-cols-[1fr_1.6fr]">
          <SectionHeading eyebrow="FAQ" title="Perguntas frequentes" className="items-start" />
          <Accordion type="single" collapsible className="border-t border-border">
            {FAQ.map((item) => (
              <AccordionItem key={item.q} value={item.q}>
                <AccordionTrigger>{item.q}</AccordionTrigger>
                <AccordionContent>{item.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Contato */}
      <section id="contato" className="container-store py-14">
        <SectionHeading eyebrow="CONTATO" title="Fale com a gente" />
        <div className="grid gap-4 md:grid-cols-4">
          <ContactCard
            icon={Phone}
            label="Telefone / WhatsApp"
            value={STORE.phone}
            href={`https://wa.me/${STORE.whatsapp}`}
          />
          <ContactCard
            icon={Mail}
            label="E-mail"
            value={STORE.email}
            href={`mailto:${STORE.email}`}
          />
          <ContactCard icon={MapPin} label="Endereço" value={STORE.address} />
          <div className="rounded-sm border border-border p-6">
            <p className="mb-3 text-xs text-muted-foreground">Redes sociais</p>
            <SocialIcons />
          </div>
        </div>
      </section>
    </>
  )
}

function ContactCard({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: typeof Phone
  label: string
  value: string
  href?: string
}) {
  const content = (
    <>
      <Icon className="mb-3 size-5 text-accent-foreground" aria-hidden />
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm font-semibold break-all">{value}</p>
    </>
  )
  return href ? (
    <a
      href={href}
      target={href.startsWith('http') ? '_blank' : undefined}
      rel="noopener noreferrer"
      className="rounded-sm border border-border p-6 transition-colors hover:border-foreground"
    >
      {content}
    </a>
  ) : (
    <div className="rounded-sm border border-border p-6">{content}</div>
  )
}
