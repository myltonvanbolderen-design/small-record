import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/seo'

export const dynamic = 'force-static'

const PATHS = ['/', '/small-record/', '/casae/', '/letche/', '/events/']

export default function sitemap(): MetadataRoute.Sitemap {
  return PATHS.map((path) => ({
    url: SITE_URL + path,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: path === '/' ? 1 : 0.8,
  }))
}
