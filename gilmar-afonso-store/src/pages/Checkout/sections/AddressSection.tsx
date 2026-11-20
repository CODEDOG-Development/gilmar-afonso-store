import { useEffect, useRef, useState, type ReactNode } from 'react'
import { useFormContext, useWatch } from 'react-hook-form'
import { FormField } from '@/components/common/FormField'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { NativeSelect } from '@/components/ui/native-select'
import { BRAZIL_STATES } from '@/constants'
import { useAddresses } from '@/hooks/use-addresses'
import { useCepLookup } from '@/hooks/use-checkout'
import { useIsAuthenticated } from '@/stores/auth.store'
import type { Address } from '@/types'
import { cn } from '@/utils/cn'
import { maskCep } from '@/utils/format'
import type { CheckoutFormValues } from '../checkout-schema'
import { StepTitle } from './StepTitle'

const ADDRESS_FIELDS = [
  'cep',
  'street',
  'number',
  'complement',
  'district',
  'city',
  'state',
] as const

export function AddressSection() {
  const { register, setValue, setFocus, control, formState } = useFormContext<CheckoutFormValues>()
  const { errors } = formState
  const isAuthenticated = useIsAuthenticated()
  const { data: savedAddresses = [] } = useAddresses()
  const [selectedId, setSelectedId] = useState<string>('new')
  const cep = useWatch({ control, name: 'cep' })
  const saveAddress = useWatch({ control, name: 'saveAddress' })
  const { data: cepData, isFetching: cepLoading } = useCepLookup(selectedId === 'new' ? cep : '')

  // CEP encontrado na ViaCEP → preenche rua, bairro, cidade e UF e leva o cursor ao número
  useEffect(() => {
    if (!cepData) return
    setValue('street', cepData.street, { shouldValidate: true })
    setValue('district', cepData.district, { shouldValidate: true })
    setValue('city', cepData.city, { shouldValidate: true })
    setValue('state', cepData.state, { shouldValidate: true })
    setFocus('number')
  }, [cepData, setValue, setFocus])

  // Ao carregar os endereços salvos, já seleciona o principal (uma única vez)
  const autoSelected = useRef(false)
  useEffect(() => {
    if (autoSelected.current || savedAddresses.length === 0) return
    autoSelected.current = true
    selectAddress(savedAddresses.find((a) => a.isDefault) ?? savedAddresses[0] ?? null)
    // eslint-disable-next-line react-hooks/exhaustive-deps -- selectAddress só usa setters estáveis
  }, [savedAddresses])

  function selectAddress(address: Address | null) {
    setSelectedId(address?.id ?? 'new')
    ADDRESS_FIELDS.forEach((field) =>
      setValue(field, address?.[field] ?? '', { shouldValidate: Boolean(address) }),
    )
    setValue('saveAddress', !address)
  }

  return (
    <section className="rounded-sm bg-background p-6">
      <StepTitle step={2} title="Endereço de entrega" />

      {savedAddresses.length > 0 && (
        <fieldset className="mb-5 grid gap-2">
          <legend className="mb-2 text-xs font-medium">Seus endereços</legend>
          {savedAddresses.map((address) => (
            <AddressOption
              key={address.id}
              checked={selectedId === address.id}
              onSelect={() => selectAddress(address)}
            >
              <strong className="block text-sm">
                {address.recipient}
                {address.isDefault && (
                  <span className="ml-2 text-xs font-normal text-muted-foreground">
                    (principal)
                  </span>
                )}
              </strong>
              <span className="text-xs text-muted-foreground">
                {address.street}, {address.number}
                {address.complement && ` — ${address.complement}`} · {address.district},{' '}
                {address.city}/{address.state} · {maskCep(address.cep)}
              </span>
            </AddressOption>
          ))}
          <AddressOption checked={selectedId === 'new'} onSelect={() => selectAddress(null)}>
            <strong className="text-sm">+ Novo endereço</strong>
          </AddressOption>
        </fieldset>
      )}

      <div className={cn('grid gap-4 sm:grid-cols-6', selectedId !== 'new' && 'hidden')}>
        <FormField
          label="CEP"
          inputMode="numeric"
          autoComplete="postal-code"
          placeholder="00000-000"
          className="sm:col-span-2"
          error={errors.cep?.message}
          hint={cepLoading ? 'Buscando endereço…' : 'Preenchemos o endereço para você.'}
          {...register('cep', { onChange: (e) => setValue('cep', maskCep(e.target.value)) })}
        />
        <a
          href="https://buscacepinter.correios.com.br/"
          target="_blank"
          rel="noopener noreferrer"
          className="self-center text-xs underline underline-offset-4 sm:col-span-4 sm:pt-5"
        >
          Não sei meu CEP
        </a>
        <FormField
          label="Rua / Avenida"
          autoComplete="address-line1"
          className="sm:col-span-4"
          error={errors.street?.message}
          {...register('street')}
        />
        <FormField
          label="Número"
          className="sm:col-span-2"
          error={errors.number?.message}
          {...register('number')}
        />
        <FormField
          label="Complemento (opcional)"
          autoComplete="address-line2"
          className="sm:col-span-3"
          {...register('complement')}
        />
        <FormField
          label="Bairro"
          className="sm:col-span-3"
          error={errors.district?.message}
          {...register('district')}
        />
        <FormField
          label="Cidade"
          autoComplete="address-level2"
          className="sm:col-span-4"
          error={errors.city?.message}
          {...register('city')}
        />
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="state">Estado</Label>
          <NativeSelect
            id="state"
            className="h-11"
            aria-invalid={Boolean(errors.state)}
            {...register('state')}
          >
            <option value="">UF</option>
            {BRAZIL_STATES.map((uf) => (
              <option key={uf} value={uf}>
                {uf}
              </option>
            ))}
          </NativeSelect>
          {errors.state && <p className="text-xs text-destructive">{errors.state.message}</p>}
        </div>
        {isAuthenticated && (
          <div className="flex items-center gap-2 sm:col-span-6">
            <Checkbox
              id="saveAddress"
              checked={saveAddress}
              onCheckedChange={(checked) => setValue('saveAddress', checked === true)}
            />
            <Label htmlFor="saveAddress" className="cursor-pointer font-normal">
              Salvar este endereço na minha conta
            </Label>
          </div>
        )}
      </div>
    </section>
  )
}

function AddressOption({
  checked,
  onSelect,
  children,
}: {
  checked: boolean
  onSelect: () => void
  children: ReactNode
}) {
  return (
    <label
      className={cn(
        'flex cursor-pointer items-start gap-3 rounded-sm border p-3 transition-colors',
        checked ? 'border-foreground' : 'border-input hover:border-ring',
      )}
    >
      <input
        type="radio"
        name="savedAddress"
        checked={checked}
        onChange={onSelect}
        className="mt-1 accent-foreground"
      />
      <span>{children}</span>
    </label>
  )
}
