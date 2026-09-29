import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/seo'

export const dynamic = 'force-static'

// /admin is intentionally absent — back-office, noindex + Disallow in robots.ts
const ROUTES: { path: string; priority: number }[] = [
  { path: '/', priority: 1 },
  { path: '/small-record/', priority: 0.8 },
  { path: '/casae/', priority: 0.8 },
  { path: '/letche/', priority: 0.8 },
  { path: '/events/', priority: 0.8 },
  { path: '/links/', priority: 0.6 },
]

export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.map(({ path, priority }) => ({
    url: SITE_URL + path,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority,
  }))
}
