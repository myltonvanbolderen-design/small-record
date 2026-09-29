/**
 * Server-only. Derives {ios, android} deeplinks from a plain https href at save time, so `/links/`
 * never makes a network call at render. Does I/O (SoundCloud oEmbed) — never import from the client.
 */
import { buildIntent } from '@/lib/app-links'

export interface DerivedAppLink {
  ios: string | null
  android: string | null
  note?: string
}

function stripTrailingSlash(pathname: string): string {
  return pathname.length > 1 && pathname.endsWith('/') ? pathname.slice(0, -1) : pathname
}

export async function deriveAppLink(href: string): Promise<DerivedAppLink> {
  let url: URL
  try {
    url = new URL(href)
  } catch {
    return { ios: null, android: null }
  }
  if (url.protocol !== 'https:') return { ios: null, android: null }

  const hostname = url.hostname.replace(/^www\./, '')
  const pathname = stripTrailingSlash(url.pathname)

  if (hostname === 'instagram.com') {
    const match = pathname.match(/^\/([A-Za-z0-9._]+)$/)
    if (match) {
      const user = match[1]
      return {
        ios: `instagram://user?username=${user}`,
        android: buildIntent(`user?username=${user}`, 'instagram', 'com.instagram.android', href),
      }
    }
    return { ios: null, android: null }
  }

  if (hostname === 'youtu.be') {
    const match = pathname.match(/^\/([A-Za-z0-9_-]+)$/)
    if (match) {
      const id = match[1]
      return {
        ios: `youtube://${id}`,
        android: buildIntent(
          `www.youtube.com/watch?v=${id}`,
          'https',
          'com.google.android.youtube',
          href
        ),
      }
    }
    return { ios: null, android: null }
  }

  if (hostname === 'youtube.com') {
    if (pathname === '/watch') {
      const id = url.searchParams.get('v')
      if (id) {
        return {
          ios: `youtube://${id}`,
          android: buildIntent(
            `www.youtube.com/watch?v=${id}`,
            'https',
            'com.google.android.youtube',
            href
          ),
        }
      }
      return { ios: null, android: null }
    }
    if (
      pathname.startsWith('/@') ||
      pathname.startsWith('/channel/') ||
      pathname.startsWith('/c/') ||
      pathname.startsWith('/user/')
    ) {
      return {
        ios: `youtube://www.youtube.com${pathname}`,
        android: buildIntent(
          `www.youtube.com${pathname}`,
          'https',
          'com.google.android.youtube',
          href
        ),
      }
    }
    return { ios: null, android: null }
  }

  if (hostname === 'soundcloud.com') {
    const match = pathname.match(/^\/([A-Za-z0-9_-]+)$/)
    if (match) {
      const user = match[1]
      const android = buildIntent(
        `soundcloud.com/${user}`,
        'https',
        'com.soundcloud.android',
        href
      )
      const id = await resolveSoundCloudUserId(href)
      if (id) return { ios: `soundcloud://users:${id}`, android }
      return { ios: null, android, note: 'deeplink SoundCloud non résolu' }
    }
    return { ios: null, android: null }
  }

  return { ios: null, android: null }
}

export async function resolveSoundCloudUserId(profileUrl: string): Promise<string | null> {
  const base = process.env.SOUNDCLOUD_OEMBED_URL ?? 'https://soundcloud.com/oembed'
  try {
    const res = await fetch(`${base}?format=json&url=${encodeURIComponent(profileUrl)}`, {
      cache: 'no-store',
      signal: AbortSignal.timeout(5000),
    })
    if (!res.ok) return null
    const text = await res.text()
    const match = text.match(/users(?:%2F|\/)(\d+)/)
    return match ? match[1] : null
  } catch {
    return null
  }
}
