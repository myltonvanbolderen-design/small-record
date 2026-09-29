/**
 * Pure, no side effects. Server-side validation for the admin editor form — the only writer of
 * `LinkItem.href`, so this is the href scheme allowlist chokepoint (never a blocklist).
 */
import type { LinkItem, LinkKind } from '@/lib/links-schema'

export const MAX_ROWS = 12
export const MAX_LABEL = 40
export const MAX_SUBLABEL = 60

export type FieldError = {
  id: string
  field: 'label' | 'sublabel' | 'href' | 'form'
  message: string
}

const INTERNAL_PATH_RE = /^\/[A-Za-z0-9\-._~!$&'()*+,;=:@%/?#]*$/
const MAILTO_RE = /^mailto:[^\s@]+@[^\s@]+\.[^\s@]+$/i

export function normalizeHref(raw: string): { href: string; kind: LinkKind } | { error: string } {
  const href = raw.trim()
  if (!href) return { error: 'URL requise.' }

  if (href.startsWith('/') && !href.startsWith('//')) {
    if (INTERNAL_PATH_RE.test(href)) return { href, kind: 'internal' }
    return { error: 'Chemin interne invalide.' }
  }

  if (/^mailto:/i.test(href)) {
    if (MAILTO_RE.test(href)) return { href, kind: 'mail' }
    return { error: 'Adresse mail invalide.' }
  }

  try {
    const url = new URL(href)
    if (url.protocol === 'https:') return { href, kind: 'external' }
  } catch {
    // unparseable — falls through to the generic error below
  }
  return { error: 'Utilise https://, un chemin interne /page/ ou mailto:' }
}

export function validateItems(items: LinkItem[]): FieldError[] {
  const errors: FieldError[] = []
  const seenIds = new Set<string>()

  for (const item of items) {
    if (seenIds.has(item.id)) {
      errors.push({ id: item.id, field: 'form', message: 'Identifiant en double.' })
    }
    seenIds.add(item.id)

    const label = item.label.trim()
    if (label.length < 1) {
      errors.push({ id: item.id, field: 'label', message: 'Label requis.' })
    } else if (label.length > MAX_LABEL) {
      errors.push({ id: item.id, field: 'label', message: `Label : ${MAX_LABEL} caractères max.` })
    }

    const sublabel = item.sublabel?.trim()
    if (sublabel && sublabel.length > MAX_SUBLABEL) {
      errors.push({
        id: item.id,
        field: 'sublabel',
        message: `Sous-titre : ${MAX_SUBLABEL} caractères max.`,
      })
    }

    const normalized = normalizeHref(item.href)
    if ('error' in normalized) {
      errors.push({ id: item.id, field: 'href', message: normalized.error })
    }
  }

  if (items.length > MAX_ROWS) {
    errors.push({ id: '', field: 'form', message: `Maximum ${MAX_ROWS} liens.` })
  }

  return errors
}
