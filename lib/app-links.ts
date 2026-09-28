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

function intent(path: string, scheme: string, pkg: string, fallback: string): string {
  return `intent://${path}#Intent;scheme=${scheme};package=${pkg};S.browser_fallback_url=${encodeURIComponent(fallback)};end`
}

/**
 * Keyed by the exact https href rendered on /links/.
 *
 * SoundCloud iOS note (locked): `soundcloud://users:363945971` / `soundcloud://users:91857449`
 * cannot be navigated to from a web page — for a non-special scheme, `//users:363945971` parses
 * `users` as host and `363945971` as port, and a port > 65535 is a parse error, so assigning it to
 * `location.href` throws synchronously. No substitute scheme form is verified to be routed by the
 * SoundCloud iOS app, and a guessed form that the app registers but does not route would dump the
 * user on the app's home screen — strictly worse than the current behaviour (webview showing the
 * right profile). So `ios: null` for both SoundCloud rows: on iOS in-app they keep the plain https
 * navigation, on Android they get the intent (which is safe because the OS itself falls back).
 */
export const APP_LINKS: Record<string, AppTarget> = {
  'https://www.instagram.com/smallmusics': {
    ios: 'instagram://user?username=smallmusics',
    android: intent(
      'user?username=smallmusics',
      'instagram',
      'com.instagram.android',
      'https://www.instagram.com/smallmusics'
    ),
  },
  'https://soundcloud.com/casae': {
    ios: null,
    android: intent(
      'soundcloud.com/casae',
      'https',
      'com.soundcloud.android',
      'https://soundcloud.com/casae'
    ),
  },
  'https://soundcloud.com/letchetony': {
    ios: null,
    android: intent(
      'soundcloud.com/letchetony',
      'https',
      'com.soundcloud.android',
      'https://soundcloud.com/letchetony'
    ),
  },
  'https://www.youtube.com/@SmallRecords_Music': {
    ios: 'youtube://www.youtube.com/@SmallRecords_Music',
    android: intent(
      'www.youtube.com/@SmallRecords_Music',
      'https',
      'com.google.android.youtube',
      'https://www.youtube.com/@SmallRecords_Music'
    ),
  },
  'https://youtu.be/X9rpsIVIVgk': {
    ios: 'youtube://X9rpsIVIVgk',
    android: intent(
      'www.youtube.com/watch?v=X9rpsIVIVgk',
      'https',
      'com.google.android.youtube',
      'https://youtu.be/X9rpsIVIVgk'
    ),
  },
}
