'use server'

import { randomUUID } from 'node:crypto'
import { revalidatePath } from 'next/cache'
import {
  adminConfigured,
  checkPassword,
  clearLoginAttempts,
  clearSessionCookie,
  isAuthenticated,
  rateLimitLogin,
  setSessionCookie,
} from '@/lib/admin-auth'
import { deriveAppLink } from '@/lib/derive-app-link'
import type { LinkItem, LinkKind } from '@/lib/links-schema'
import { publishDraft, saveDraft } from '@/lib/links-store'
import { MAX_ROWS, normalizeHref, validateItems, type FieldError } from '@/lib/links-validate'

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

export type EditorState = {
  items: LinkItem[]
  errors: FieldError[]
  message: string | null
  tone: 'ok' | 'error' | 'info' | null
  notes: string[]
  confirm: { kind: 'delete'; id: string } | { kind: 'publish' } | null
  draftUpdatedAt: string
  publishedAt: string
}

export async function editorAction(prev: EditorState, formData: FormData): Promise<EditorState> {
  if (!(await isAuthenticated())) {
    return {
      ...prev,
      confirm: null,
      message: 'Session expirée — reconnecte-toi.',
      tone: 'error',
      notes: [],
    }
  }

  const intent = String(formData.get('intent') ?? 'save')
  const ids = String(formData.get('ids') ?? '')
    .split(',')
    .filter(Boolean)

  const prevById = new Map(prev.items.map((i) => [i.id, i]))

  let items: LinkItem[] = ids
    .filter((id) => prevById.has(id))
    .map((id, index) => {
      const previous = prevById.get(id)!
      const label = String(formData.get(`label__${id}`) ?? previous.label)
      const sublabelRaw = formData.get(`sublabel__${id}`)
      const sublabel = sublabelRaw === null ? previous.sublabel : String(sublabelRaw)
      const href = String(formData.get(`href__${id}`) ?? previous.href)
      const active = formData.get(`active__${id}`) != null
      return {
        id,
        label,
        sublabel,
        href,
        kind: previous.kind,
        active,
        order: index + 1,
        appIos: previous.appIos,
        appAndroid: previous.appAndroid,
      }
    })

  let confirm: EditorState['confirm'] = null
  let unsavedMessage: string | null = null
  let unsavedTone: EditorState['tone'] = null
  let skipWrite = false
  let doPublish = false

  if (intent === 'add') {
    if (items.length >= MAX_ROWS) {
      return {
        ...prev,
        items,
        confirm: null,
        errors: [{ id: '', field: 'form', message: `Maximum ${MAX_ROWS} liens.` }],
        message: 'Corrige les erreurs avant d’enregistrer.',
        tone: 'error',
        notes: [],
      }
    }
    const newId = 'row-' + randomUUID().slice(0, 8)
    items = [
      ...items,
      {
        id: newId,
        label: '',
        href: '',
        kind: 'internal' as LinkKind,
        active: true,
        order: items.length + 1,
        appIos: undefined,
        appAndroid: undefined,
      },
    ]
    skipWrite = true
    unsavedMessage = 'Nouvelle ligne — remplis label et URL, puis Enregistre.'
    unsavedTone = 'info'
  } else if (intent.startsWith('up:') || intent.startsWith('down:')) {
    const id = intent.split(':')[1]
    const idx = items.findIndex((i) => i.id === id)
    const swapWith = intent.startsWith('up:') ? idx - 1 : idx + 1
    if (idx >= 0 && swapWith >= 0 && swapWith < items.length) {
      const next = [...items]
      ;[next[idx], next[swapWith]] = [next[swapWith], next[idx]]
      items = next.map((item, i) => ({ ...item, order: i + 1 }))
    }
  } else if (intent.startsWith('toggle:')) {
    const id = intent.split(':')[1]
    items = items.map((i) => (i.id === id ? { ...i, active: !i.active } : i))
  } else if (intent.startsWith('delete:')) {
    const id = intent.split(':')[1]
    confirm = { kind: 'delete', id }
    skipWrite = true
  } else if (intent.startsWith('confirm-delete:')) {
    const id = intent.split(':')[1]
    items = items.filter((i) => i.id !== id).map((item, i) => ({ ...item, order: i + 1 }))
  } else if (intent === 'publish') {
    confirm = { kind: 'publish' }
    skipWrite = true
  } else if (intent === 'confirm-publish') {
    doPublish = true
  } else if (intent === 'cancel') {
    skipWrite = true
  }
  // intent === 'save' falls through to validate + save

  if (skipWrite) {
    return {
      items,
      errors: [],
      message: unsavedMessage,
      tone: unsavedTone,
      notes: [],
      confirm,
      draftUpdatedAt: prev.draftUpdatedAt,
      publishedAt: prev.publishedAt,
    }
  }

  const errors = validateItems(items)
  if (errors.length > 0) {
    return {
      items,
      errors,
      message: 'Corrige les erreurs avant d’enregistrer.',
      tone: 'error',
      notes: [],
      confirm: null,
      draftUpdatedAt: prev.draftUpdatedAt,
      publishedAt: prev.publishedAt,
    }
  }

  // Validation passed, so normalizeHref cannot fail here.
  const normalizedItems: LinkItem[] = items.map((item) => {
    const label = item.label.trim()
    const sublabel = item.sublabel?.trim()
    const normalized = normalizeHref(item.href)
    const hrefFields = 'href' in normalized ? normalized : { href: item.href, kind: item.kind }
    return {
      ...item,
      label,
      sublabel: sublabel || undefined,
      href: hrefFields.href,
      kind: hrefFields.kind,
    }
  })

  const notes: string[] = []

  try {
    // Defense-in-depth: re-verify immediately before the store write too, not just at entry —
    // protects against a future refactor introducing an early-return path around the top guard.
    if (!(await isAuthenticated())) {
      return {
        ...prev,
        confirm: null,
        message: 'Session expirée — reconnecte-toi.',
        tone: 'error',
        notes: [],
      }
    }

    for (const item of normalizedItems) {
      if (item.kind !== 'external') {
        item.appIos = null
        item.appAndroid = null
        continue
      }
      const previous = prevById.get(item.id)
      const unchanged =
        previous &&
        previous.href === item.href &&
        item.appIos !== undefined &&
        item.appAndroid !== undefined
      if (unchanged) continue
      const derived = await deriveAppLink(item.href)
      item.appIos = derived.ios
      item.appAndroid = derived.android
      if (derived.note) notes.push(derived.note)
    }

    const saved = await saveDraft({ items: normalizedItems, updatedAt: new Date().toISOString() })
    revalidatePath('/admin')

    let message = 'Enregistré'
    const tone: EditorState['tone'] = 'ok'
    let publishedAt = prev.publishedAt

    if (doPublish) {
      const pub = await publishDraft()
      revalidatePath('/admin')
      const time = new Date().toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Europe/Paris',
      })
      message = `Publié à ${time}`
      publishedAt = pub.updatedAt
    }

    return {
      items: saved.items,
      errors: [],
      message,
      tone,
      notes,
      confirm: null,
      draftUpdatedAt: saved.updatedAt,
      publishedAt,
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    return {
      items: normalizedItems,
      errors: [],
      message: `Échec de l’enregistrement : ${msg}`,
      tone: 'error',
      notes,
      confirm: null,
      draftUpdatedAt: prev.draftUpdatedAt,
      publishedAt: prev.publishedAt,
    }
  }
}
