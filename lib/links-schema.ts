export const LINK_KINDS = ['internal', 'external', 'mail'] as const
export type LinkKind = (typeof LINK_KINDS)[number]

export interface LinkItem {
  id: string
  label: string
  sublabel?: string
  href: string
  kind: LinkKind
  active: boolean
  order: number
}

export interface LinksDoc {
  items: LinkItem[]
  updatedAt: string
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.length > 0
}

function parseLinkItem(raw: unknown): LinkItem | null {
  if (typeof raw !== 'object' || raw === null) return null
  const item = raw as Record<string, unknown>
  if (!isNonEmptyString(item.id)) return null
  if (!isNonEmptyString(item.label)) return null
  if (!isNonEmptyString(item.href)) return null
  if (typeof item.kind !== 'string' || !LINK_KINDS.includes(item.kind as LinkKind)) return null
  if (typeof item.active !== 'boolean') return null
  if (typeof item.order !== 'number' || !Number.isFinite(item.order)) return null
  if (item.sublabel !== undefined && typeof item.sublabel !== 'string') return null

  const parsed: LinkItem = {
    id: item.id,
    label: item.label,
    href: item.href,
    kind: item.kind as LinkKind,
    active: item.active,
    order: item.order,
  }
  if (typeof item.sublabel === 'string') parsed.sublabel = item.sublabel
  return parsed
}

/** Validate untrusted JSON coming out of the store. Returns null on anything unexpected. */
export function parseLinksDoc(raw: unknown): LinksDoc | null {
  if (typeof raw !== 'object' || raw === null) return null
  const doc = raw as Record<string, unknown>
  if (!Array.isArray(doc.items)) return null

  const items: LinkItem[] = []
  for (const rawItem of doc.items) {
    const item = parseLinkItem(rawItem)
    if (!item) return null
    items.push(item)
  }

  const updatedAt = typeof doc.updatedAt === 'string' ? doc.updatedAt : new Date(0).toISOString()

  return { items, updatedAt }
}
