import { useFormContext } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { FormField } from '@/components/common/FormField'
import { ROUTES } from '@/constants'
import { useIsAuthenticated } from '@/stores/auth.store'
import { maskPhone } from '@/utils/format'
import type { CheckoutFormValues } from '../checkout-schema'
import { StepTitle } from './StepTitle'

export function ContactSection() {
  const { register, setValue, formState } = useFormContext<CheckoutFormValues>()
  const { errors } = formState
  const isAuthenticated = useIsAuthenticated()

  return (
    <section className="rounded-sm bg-background p-6">
      <StepTitle step={1} title="Dados de contato" />
      {!isAuthenticated && (
        <p className="mb-4 text-xs text-muted-foreground">
          Já tem conta?{' '}
          <Link
            to={ROUTES.login}
            state={{ from: ROUTES.checkout }}
            className="font-semibold text-foreground underline underline-offset-4"
          >
            Entre
          </Link>{' '}
          para usar seus endereços salvos.
        </p>
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField
          label="Nome completo"
          autoComplete="name"
          error={errors.name?.message}
          className="sm:col-span-2"
          {...register('name')}
        />
        <FormField
          label="E-mail"
          type="email"
          autoComplete="email"
          error={errors.email?.message}
          {...register('email')}
        />
        <FormField
          label="Celular"
          type="tel"
          autoComplete="tel"
          placeholder="(31) 99999-0000"
          error={errors.phone?.message}
          {...register('phone', { onChange: (e) => setValue('phone', maskPhone(e.target.value)) })}
        />
      </div>
    </section>
  )
}
