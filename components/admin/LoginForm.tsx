'use client'

import { useActionState } from 'react'
import { loginAction, type LoginState } from '@/app/admin/actions'

const initialState: LoginState = { error: null }

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(loginAction, initialState)

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <form action={formAction} className="w-full max-w-xs">
        <p className="text-center font-condensed text-xs uppercase tracking-[0.2em] text-blanc/70">
          Back-office
        </p>
        <div className="mt-6">
          <label
            htmlFor="password"
            className="block font-condensed text-[0.6rem] uppercase tracking-[0.25em] text-blanc/70"
          >
            Mot de passe
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            aria-invalid={state.error ? 'true' : undefined}
            aria-describedby={state.error ? 'password-error' : undefined}
            className="mt-2 min-h-11 w-full border border-blanc/20 bg-transparent px-3 font-body text-sm text-blanc outline-none focus-visible:border-terracotta"
          />
        </div>
        {state.error ? (
          <p id="password-error" role="alert" className="mt-3 font-body text-sm text-terracotta-light">
            {state.error}
          </p>
        ) : null}
        <button
          type="submit"
          disabled={isPending}
          className="mt-6 min-h-11 w-full border border-blanc/30 font-condensed text-xs uppercase tracking-[0.2em] text-blanc transition-colors hover:border-terracotta disabled:opacity-50"
        >
          {isPending ? '…' : 'Entrer'}
        </button>
      </form>
    </div>
  )
}
