'use server'

import { revalidatePath } from 'next/cache'
import {
  adminConfigured,
  checkPassword,
  clearLoginAttempts,
  clearSessionCookie,
  rateLimitLogin,
  setSessionCookie,
} from '@/lib/admin-auth'

export type LoginState = { error: string | null }

export async function loginAction(prev: LoginState, formData: FormData): Promise<LoginState> {
  const limit = await rateLimitLogin()
  if (!limit.ok) {
    return { error: `Trop de tentatives. Réessaie dans ${limit.minutes} minutes.` }
  }
  if (!adminConfigured()) {
    return { error: 'Back-office non configuré.' }
  }
  const pw = String(formData.get('password') ?? '')
  if (!checkPassword(pw)) {
    return { error: 'Mot de passe incorrect.' }
  }
  await clearLoginAttempts()
  await setSessionCookie()
  revalidatePath('/admin')
  return { error: null }
}

export async function logoutAction(): Promise<void> {
  await clearSessionCookie()
  revalidatePath('/admin')
}
