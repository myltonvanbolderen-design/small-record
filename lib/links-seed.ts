import type { LinkItem, LinksDoc } from '@/lib/links-schema'

/** The 7 rows as shipped on 2026-09-28. Initial store content AND emergency fallback. */
export const SEED_LINKS: LinkItem[] = [
  {
    id: 'instagram',
    label: 'Instagram',
    sublabel: '@smallmusics',
    href: 'https://www.instagram.com/smallmusics',
    kind: 'external',
    active: true,
    order: 1,
  },
  {
    id: 'soundcloud-casae',
    label: 'SoundCloud — Casæ',
    href: 'https://soundcloud.com/casae',
    kind: 'external',
    active: true,
    order: 2,
  },
  {
    id: 'soundcloud-letche',
    label: 'SoundCloud — Letché',
    href: 'https://soundcloud.com/letchetony',
    kind: 'external',
    active: true,
    order: 3,
  },
  {
    id: 'youtube',
    label: 'YouTube',
    href: 'https://www.youtube.com/@SmallRecords_Music',
    kind: 'external',
    active: true,
    order: 4,
  },
  {
    id: 'events',
    label: 'Events & recaps',
    href: '/events/',
    kind: 'internal',
    active: true,
    order: 5,
  },
  {
    id: 'label',
    label: 'The Label',
    href: '/small-record/',
    kind: 'internal',
    active: true,
    order: 6,
  },
  {
    id: 'booking',
    label: 'Booking',
    sublabel: 'contact@small-records.com',
    href: 'mailto:contact@small-records.com',
    kind: 'mail',
    active: true,
    order: 7,
  },
]

export function seedDoc(): LinksDoc {
  return { items: SEED_LINKS.map((i) => ({ ...i })), updatedAt: new Date(0).toISOString() }
}

/**
 * NOT part of the store document. The featured mix row is not a plain link (thumbnail + custom
 * glyph), so it stays hardcoded in app/links/page.tsx. The admin UI (part 2) must not surface it.
 */
export const FEATURED_MIX = {
  href: 'https://youtu.be/X9rpsIVIVgk',
  label: 'House Mix · Pool Party',
  sublabel: 'Summer set',
  glyph: '▶',
  thumb: {
    src: '/images/mix-pool-party.jpg',
    alt: 'House mix, pool party set in the South of France',
  },
} as const
