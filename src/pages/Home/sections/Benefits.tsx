import { CreditCard, Headset, ShieldCheck, Truck } from 'lucide-react'

const BENEFITS = [
  { icon: Truck, text: 'Entrega para todo o Brasil' },
  { icon: ShieldCheck, text: 'Compra segura e garantida' },
  { icon: CreditCard, text: 'Parcelamento em até 12x' },
  { icon: Headset, text: 'Atendimento especializado' },
]

export function Benefits() {
  return (
    <section aria-label="Benefícios" className="border-b border-[#ecebe7] bg-background">
      <ul className="grid grid-cols-2 gap-x-3 gap-y-5 px-[5%] py-5 md:grid-cols-4 md:px-[7%]">
        {BENEFITS.map(({ icon: Icon, text }) => (
          <li key={text} className="flex items-center gap-2.5 md:justify-center">
            <Icon className="size-5 shrink-0 text-[#77736a]" strokeWidth={1.5} aria-hidden />
            <p className="max-w-[120px] text-[11px] leading-[1.45] text-[#484741]">{text}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}
