import type { LinkItem } from '@/lib/links-schema'

export interface AppTarget {
  /** Custom scheme for iOS in-app browsers. null = no verified scheme, keep https. */
  ios: string | null
  /** Android intent:// URL. Always carries S.browser_fallback_url, so the OS handles the fallback. */
  android: string
}

// Social in-app webviews. Everywhere else (Safari, Chrome, desktop) we do NOT touch the click:
// universal links / app links already open the app there, and forcing a custom scheme when the app
// is missing shows an ugly "address invalid" system alert. Only webviews need the manual escape.
const IN_APP_BROWSER =
  /Instagram|FBAN|FBAV|FB_IAB|FBIOS|Messenger|BytedanceWebview|TikTok|Snapchat|LinkedInApp|Twitter/i
const IOS = /iPhone|iPad|iPod/i
const ANDROID = /Android/i

export function getInAppPlatform(ua: string | null | undefined): 'ios' | 'android' | null {
  if (!ua || !IN_APP_BROWSER.test(ua)) return null
  if (ANDROID.test(ua)) return 'android'
  if (IOS.test(ua)) return 'ios'
  return null
}

export function buildIntent(path: string, scheme: string, pkg: string, fallback: string): string {
  return `intent://${path}#Intent;scheme=${scheme};package=${pkg};S.browser_fallback_url=${encodeURIComponent(fallback)};end`
}

/**
 * Keyed by the exact https href rendered on /links/.
 *
 * SoundCloud iOS: `soundcloud://users:<id>` is the format the app routes (verified on a real
 * iPhone — it opens the profile). It cannot be assigned to `location.href` (the id parses as a
 * port number and throws), so AppLink navigates schemes through an <a> click, which keeps the
 * raw string. Ids resolved via SoundCloud oEmbed: Casæ 363945971, Letché 91857449.
 */
export const APP_LINKS: Record<string, AppTarget> = {
  'https://www.instagram.com/smallmusics': {
    ios: 'instagram://user?username=smallmusics',
    android: buildIntent(
      'user?username=smallmusics',
      'instagram',
      'com.instagram.android',
      'https://www.instagram.com/smallmusics'
    ),
  },
  'https://soundcloud.com/casae': {
    ios: 'soundcloud://users:363945971',
    android: buildIntent(
      'soundcloud.com/casae',
      'https',
      'com.soundcloud.android',
      'https://soundcloud.com/casae'
    ),
  },
  'https://soundcloud.com/letchetony': {
    ios: 'soundcloud://users:91857449',
    android: buildIntent(
      'soundcloud.com/letchetony',
      'https',
      'com.soundcloud.android',
      'https://soundcloud.com/letchetony'
    ),
  },
  'https://www.youtube.com/@SmallRecords_Music': {
    ios: 'youtube://www.youtube.com/@SmallRecords_Music',
    android: buildIntent(
      'www.youtube.com/@SmallRecords_Music',
      'https',
      'com.google.android.youtube',
      'https://www.youtube.com/@SmallRecords_Music'
    ),
  },
  'https://youtu.be/X9rpsIVIVgk': {
    ios: 'youtube://X9rpsIVIVgk',
    android: buildIntent(
      'www.youtube.com/watch?v=X9rpsIVIVgk',
      'https',
      'com.google.android.youtube',
      'https://youtu.be/X9rpsIVIVgk'
    ),
  },
}

/**
 * Resolution order for the app deeplink of a stored link row:
 * 1. `appAndroid` present (row was derived, has a real target) -> use the stored fields.
 * 2. Both `appIos`/`appAndroid` are `undefined` (legacy row, never derived) -> fall back to the
 *    static APP_LINKS table (today's 5 shipped entries).
 * 3. Otherwise (derived, deliberately no target) -> undefined (plain link, no data-app-link).
 */
export function appTargetFor(
  item: Pick<LinkItem, 'href' | 'appIos' | 'appAndroid'>
): AppTarget | undefined {
  if (item.appAndroid) return { ios: item.appIos ?? null, android: item.appAndroid }
  if (item.appIos === undefined && item.appAndroid === undefined) return APP_LINKS[item.href]
  return undefined
}
