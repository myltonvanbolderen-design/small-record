---
phase: quick/260928-pzz
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - lib/app-links.ts
  - components/magazine/AppLink.tsx
  - components/magazine/LinkRow.tsx
  - app/links/page.tsx
autonomous: true
requirements: [DEEPLINK-01, DEEPLINK-02, DEEPLINK-03, DEEPLINK-04, DEEPLINK-05, DEEPLINK-06]

must_haves:
  truths:
    - "Inside an in-app browser on iOS (UA contains Instagram/FBAN/FBAV/FB_IAB/FBIOS/Messenger/BytedanceWebview/TikTok/Snapchat/LinkedInApp/Twitter AND iPhone|iPad|iPod), clicking a deeplinked row attempts the app scheme (e.g. instagram://user?username=smallmusics) and falls back to the https URL ~900ms later if the app never takes over"
    - "Inside an in-app browser on Android, clicking a deeplinked row navigates to an intent:// URL carrying S.browser_fallback_url — no timer, the OS owns the fallback"
    - "In Safari, Chrome and on desktop (no in-app UA marker), clicking a row behaves exactly as today: plain https navigation in a new tab, no custom scheme attempted"
    - "A modified click (meta/ctrl/shift/alt or non-left button) is never hijacked: default anchor behaviour, no preventDefault"
    - "Every row is still a real <a href=\"https…\" target=\"_blank\" rel=\"noopener noreferrer\">, so no-JS, right-click/copy-link and crawlers get the plain URL"
    - "Internal rows (/events/, /small-record/, /events/#panic-room) and the mailto row have no deeplink handler at all; the mailto anchor still has no target"
    - "The rendered /links/ page is visually identical: same 9 destinations in the same order, same labels, same classes, one-screen budget still holds at 390x844 (deepest bottom <= 700px) with no horizontal overflow"
  artifacts:
    - path: "lib/app-links.ts"
      provides: "Pure, dependency-free deeplink data + in-app browser detection"
      exports: ["AppTarget", "getInAppPlatform", "APP_LINKS"]
      contains: "S.browser_fallback_url"
    - path: "components/magazine/AppLink.tsx"
      provides: "Client anchor that attempts the app scheme only inside in-app browsers"
      contains: "'use client'"
    - path: "components/magazine/LinkRow.tsx"
      provides: "Same markup as today, plus an optional app prop that swaps the <a> for <AppLink>"
      exports: ["LinkRow"]
    - path: "app/links/page.tsx"
      provides: "Rows wired to APP_LINKS by href (5 external rows), order/labels/hrefs unchanged"
      contains: "APP_LINKS"
  key_links:
    - from: "app/links/page.tsx"
      to: "lib/app-links.ts"
      via: "APP_LINKS[href] passed as the app prop of each external LinkRow"
      pattern: "APP_LINKS\\["
    - from: "components/magazine/LinkRow.tsx"
      to: "components/magazine/AppLink.tsx"
      via: "renders <AppLink className={rowClass}>{<RowContent/>}</AppLink> when app is provided"
      pattern: "AppLink"
    - from: "components/magazine/AppLink.tsx"
      to: "lib/app-links.ts"
      via: "getInAppPlatform(navigator.userAgent) inside the click handler"
      pattern: "getInAppPlatform"
---

<objective>
Make the `/links/` rows open the **native apps** (Taplink/Linktree-style deeplinks) when the page is
opened from an in-app browser — which is the only way `/links/` is ever opened in practice (Instagram
bio, on a phone). Today every row is a plain `https://` universal link: that opens the app from Safari
and Chrome, but inside Instagram's webview it stays in the webview.

Purpose: a tap on "Instagram" lands in the Instagram app on the profile, not in a webview.
Output: a pure `lib/app-links.ts`, a small `AppLink` client component, `LinkRow` extended with an
optional `app` prop, and the 5 external rows wired — with zero visual change and zero behaviour change
outside in-app browsers.
</objective>

<execution_context>
@$HOME/.claude/get-shit-done/workflows/execute-plan.md
@$HOME/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@CLAUDE.md
@.planning/quick/260928-nll-page-links-compacte-tout-visible-sans-sc/260928-nll-SUMMARY.md
@app/links/page.tsx
@components/magazine/LinkRow.tsx
@components/magazine/CopyLinkButton.tsx
@lib/utils.ts

<interfaces>
<!-- Contracts the executor needs. No codebase exploration required. -->

components/magazine/LinkRow.tsx (current, server component):
```ts
interface LinkRowProps {
  href: string
  label: string
  sublabel?: string
  kind?: 'internal' | 'external' | 'mail'
  thumb?: { src: string; alt: string }
  glyph?: string
}
export function LinkRow(props: LinkRowProps): JSX.Element
```
Internals: one shared `const rowClass = 'group flex min-h-11 w-full items-center justify-between gap-3
border border-blanc/15 px-3 py-2 transition-colors hover:border-terracotta hover:bg-blanc/5
md:min-h-12 md:px-4'` and a local `RowContent` component (thumb + label + sublabel + glyph).
Three branches: `external` -> `<a target="_blank" rel="noopener noreferrer">`, `mail` -> bare `<a>`,
default -> `next/link`.

app/links/page.tsx (current): a `LINKS` array of 7 rows (Instagram, SoundCloud Casae, SoundCloud
Letche, YouTube, Events & recaps, The Label, Booking) mapped to `LinkRow`, plus an 8th standalone
`LinkRow` for the featured mix (`https://youtu.be/X9rpsIVIVgk`), plus the recap card linking to
`/events/#panic-room`. 9 anchors in `main` total.

components/magazine/CopyLinkButton.tsx: the existing `'use client'` pattern to follow (directive on
line 1, hooks, `cn()` for className merging).

lib/utils.ts: `export function cn(...inputs: ClassValue[]): string`.

next.config.ts: `output: 'export'`, `trailingSlash: true`. Everything on /links/ is static HTML, so all
deeplink logic must live in the click handler (client), never in render (hydration mismatch).
</interfaces>

<measured_facts>
<!-- Probed with Playwright 1.63 (chromium) against the running dev server. Do NOT re-derive. -->

1. **`soundcloud://users:363945971` is not a valid URL and THROWS.** Assigning it to
   `window.location.href` raises `TypeError: Failed to set the 'href' property on 'Location':
   'soundcloud://users:363945971' is not a valid URL.` Reason: for a non-special scheme,
   `//users:363945971` parses `users` as host and `363945971` as port, and a port > 65535 is a parse
   error. The same applies to `intent://users:363945971#Intent;…`. **Both SoundCloud targets given in
   the task description are therefore unusable from a web page** — see the URL table below for the
   substitutes that were verified to parse.
2. Verified to parse in Chromium (`new URL()` + `location.href` assignment): `instagram://user?…`,
   `youtube://www.youtube.com/@SmallRecords_Music`, `youtube://X9rpsIVIVgk`,
   `intent://user?username=smallmusics#Intent;…;end`, `intent://soundcloud.com/casae#Intent;…;end`,
   `intent://www.youtube.com/@SmallRecords_Music#Intent;…;end`,
   `intent://www.youtube.com/watch?v=X9rpsIVIVgk#Intent;…;end`.
3. **Chromium emits an observable signal for unhandled schemes.** After `location.href =
   'instagram://user?username=smallmusics'`, Playwright fires
   `page.on('requestfailed')` with `request.url() === 'instagram://user?username=smallmusics'` and
   `failure().errorText === 'net::ERR_ABORTED'`, and `page.url()` stays on `/links/`. No console
   message, no pageerror. This is the primary browser-level assertion for the tests.
4. **Fragments are stripped from request URLs**, so the `intent://` requestfailed event reports only
   `intent://user?username=smallmusics` — the `#Intent;…S.browser_fallback_url=…;end` part is NOT
   observable in the browser. The exact intent string is therefore asserted by a Node unit harness
   over the compiled `lib/app-links.ts` (see Task 2), not from the DOM.
5. Playwright device descriptors available in the kit: `iPhone 13`, `Pixel 7`, `Desktop Chrome`.
   `devices['iPhone 13'].userAgent` = `Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X)
   AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.6 Mobile/15E148 Safari/604.1`.
   Spreading an iPhone (webkit) descriptor into a `chromium` context is supported and is what the
   tests use.
</measured_facts>

<url_table>
<!-- FINAL target table — hardcode exactly this, do not resolve anything. -->

| Row (href = anchor, unchanged) | ios | android (intent://) |
|---|---|---|
| `https://www.instagram.com/smallmusics` | `instagram://user?username=smallmusics` | path `user?username=smallmusics`, scheme `instagram`, package `com.instagram.android` |
| `https://soundcloud.com/casae` | `null` (see note) | path `soundcloud.com/casae`, scheme `https`, package `com.soundcloud.android` |
| `https://soundcloud.com/letchetony` | `null` (see note) | path `soundcloud.com/letchetony`, scheme `https`, package `com.soundcloud.android` |
| `https://www.youtube.com/@SmallRecords_Music` | `youtube://www.youtube.com/@SmallRecords_Music` | path `www.youtube.com/@SmallRecords_Music`, scheme `https`, package `com.google.android.youtube` |
| `https://youtu.be/X9rpsIVIVgk` | `youtube://X9rpsIVIVgk` | path `www.youtube.com/watch?v=X9rpsIVIVgk`, scheme `https`, package `com.google.android.youtube` |

Every intent URL is built as
`intent://{path}#Intent;scheme={scheme};package={pkg};S.browser_fallback_url={encodeURIComponent(https)};end`.

**SoundCloud iOS note (locked):** `soundcloud://users:363945971` / `soundcloud://users:91857449`
cannot be navigated to from a web page (measured fact 1). No substitute scheme form is verified to be
routed by the SoundCloud iOS app, and a guessed form that the app registers but does not route would
dump the user on the app's home screen — strictly worse than the current behaviour (webview showing
the right profile). So `ios: null` for both SoundCloud rows: on iOS in-app they keep the plain https
navigation, on Android they get the intent (which is safe because the OS itself falls back).
Leave a short comment in `lib/app-links.ts` saying exactly this.

Internal rows (`/events/`, `/small-record/`, `/events/#panic-room`) and `mailto:` get NO app entry.
</url_table>
</context>

<tasks>

<task type="auto">
  <name>Task 1: Deeplink module, AppLink client anchor, LinkRow app prop, wire the 5 external rows</name>
  <files>lib/app-links.ts, components/magazine/AppLink.tsx, components/magazine/LinkRow.tsx, app/links/page.tsx</files>
  <action>
No new dependency. No change to any other page. No deploy.

**a. `lib/app-links.ts` (new, pure, no React import, no `'use client'`)**

```ts
export interface AppTarget {
  /** Custom scheme for iOS in-app browsers. null = no verified scheme, keep https. */
  ios: string | null
  /** Android intent:// URL. Always carries S.browser_fallback_url, so the OS handles the fallback. */
  android: string
}
```

Detection (exported, pure, takes the UA as an argument so it is unit-testable):

```ts
// Social in-app webviews. Everywhere else (Safari, Chrome, desktop) we do NOT touch the click:
// universal links / app links already open the app there, and forcing a custom scheme when the app
// is missing shows an ugly "address invalid" system alert. Only webviews need the manual escape.
const IN_APP_BROWSER = /Instagram|FBAN|FBAV|FB_IAB|FBIOS|Messenger|BytedanceWebview|TikTok|Snapchat|LinkedInApp|Twitter/i
const IOS = /iPhone|iPad|iPod/i
const ANDROID = /Android/i

export function getInAppPlatform(ua: string | null | undefined): 'ios' | 'android' | null {
  if (!ua || !IN_APP_BROWSER.test(ua)) return null
  if (ANDROID.test(ua)) return 'android'
  if (IOS.test(ua)) return 'ios'
  return null
}
```
(Test Android before iOS: some Android webview UAs also carry `like Mac OS X` strings.)

Intent builder (module-private) + the table:

```ts
function intent(path: string, scheme: string, pkg: string, fallback: string): string {
  return `intent://${path}#Intent;scheme=${scheme};package=${pkg};S.browser_fallback_url=${encodeURIComponent(fallback)};end`
}

/** Keyed by the exact https href rendered on /links/. */
export const APP_LINKS: Record<string, AppTarget> = { … }
```

Fill it with the five entries of the `<url_table>` above, verbatim. Keep the SoundCloud comment.

**b. `components/magazine/AppLink.tsx` (new, `'use client'`)**

```tsx
'use client'
import { useEffect, useRef, type MouseEvent, type ReactNode } from 'react'
import { getInAppPlatform, type AppTarget } from '@/lib/app-links'

const FALLBACK_DELAY_MS = 900

export function AppLink({ href, app, className, children }: {
  href: string
  app: AppTarget
  className?: string
  children: ReactNode
}) { … }
```

Rules (all locked):
- Render a REAL anchor, identical to the external branch of `LinkRow`:
  `<a href={href} target="_blank" rel="noopener noreferrer" className={className} data-app-link="" onClick={handleClick}>{children}</a>`.
  `data-app-link=""` is a non-visual marker used by the tests to prove which rows carry a handler.
  `children` comes from the server component — do NOT re-implement the row markup here.
- `handleClick(e)`:
  1. `if (e.defaultPrevented) return`
  2. `if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return` — never hijack a
     modified click / middle click, the user wants a background tab.
  3. `const platform = getInAppPlatform(navigator.userAgent)` — read the UA INSIDE the handler, never
     during render and never in `useState`: the page is statically exported, any UA-dependent render
     would be a hydration mismatch.
  4. `if (!platform) return` — Safari / Chrome / desktop keep the plain https navigation.
  5. `const target = platform === 'ios' ? app.ios : app.android; if (!target) return` (SoundCloud iOS).
  6. `e.preventDefault()`.
  7. **Android**: `try { window.location.href = target } catch { window.location.href = href }` and
     return. No timer — `S.browser_fallback_url` makes the OS do the fallback itself.
  8. **iOS**: arm the fallback BEFORE navigating, then navigate:
     - `timerRef.current = window.setTimeout(() => { cleanup(); window.location.href = href }, FALLBACK_DELAY_MS)`
     - register `cancel` on `document.addEventListener('visibilitychange', …)` (only when
       `document.visibilityState === 'hidden'`), `window.addEventListener('pagehide', …)` and
       `window.addEventListener('blur', …)` — these fire when the app actually takes over, and the
       fallback must NOT run then (otherwise the user comes back to a webview on instagram.com).
     - then `try { window.location.href = target } catch { cleanup(); window.location.href = href }`
       (the try/catch is mandatory: an unparseable scheme throws synchronously — see measured fact 1).
- `cleanup()` clears the timer and removes the three listeners, and is idempotent.
- `useEffect(() => () => cleanupRef.current?.(), [])` so an unmount/navigation cancels a pending
  fallback.
- No `cn()` needed (className is passed through as-is), no motion, no new dependency.

**c. `components/magazine/LinkRow.tsx` (edit)**
- Add `app?: AppTarget` to `LinkRowProps` (import the type from `@/lib/app-links`).
- In the `external` branch only: when `app` is provided, render
  ```tsx
  <AppLink href={href} app={app} className={rowClass}>
    <RowContent label={label} sublabel={sublabel} thumb={thumb} glyph={glyph} />
  </AppLink>
  ```
  The children pattern keeps `RowContent` server-rendered and guarantees byte-identical markup.
  When `app` is absent, the current `<a>` branch is used unchanged.
- `rowClass` and `RowContent` stay exactly as they are — same classes, same structure, no visual
  change of any kind. `LinkRow` itself stays a server component.
- `mail` and `internal` branches: untouched. Never pass `app` to them.

**d. `app/links/page.tsx` (edit)**
- `import { APP_LINKS } from '@/lib/app-links'`.
- Pass `app={APP_LINKS[link.href]}` in the `LINKS.map(...)` (undefined for the internal + mailto rows,
  which is exactly what we want) and `app={APP_LINKS['https://youtu.be/X9rpsIVIVgk']}` on the mix row.
- Do NOT change the `LINKS` array contents: same order, same labels, same sublabels, same hrefs, same
  kinds. Do not touch metadata, the recap card, the CopyLinkButton or any class.
  </action>
  <verify>
    <automated>cd /Users/myltonvanbolderen/small-record && npx tsc --noEmit && npm run lint</automated>
    <automated>cd /Users/myltonvanbolderen/small-record && curl -s http://localhost:3000/links/ | grep -c 'data-app-link' | grep -qx 5 && curl -s http://localhost:3000/links/ | grep -c 'mailto:contact@small-records.com' | grep -qvx 0 && echo ROWS_OK</automated>
  </verify>
  <done>
`lib/app-links.ts`, `components/magazine/AppLink.tsx` exist; `LinkRow` accepts `app` and delegates to
`AppLink` only for external rows that have one; `/links/` serves exactly 5 `data-app-link` anchors and
still serves the 9 hrefs in the same order with `target="_blank" rel="noopener noreferrer"` on the
https ones and nothing on the mailto. `npx tsc --noEmit` and `npm run lint` both report 0 errors.
Commit (stage these exact paths only):
`git add lib/app-links.ts components/magazine/AppLink.tsx components/magazine/LinkRow.tsx app/links/page.tsx`
`feat(links): open native apps from in-app browsers on /links`
ending with `Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>`.
  </done>
</task>

<task type="auto">
  <name>Task 2: Prove the behaviour with a Node unit harness + Playwright across 4 user agents</name>
  <files>scratchpad only (no source file unless a check fails)</files>
  <action>
Scratchpad = `/private/tmp/claude-501/-Users-myltonvanbolderen-small-record/54b5f0cd-5a66-4186-b337-6738006c59de/scratchpad`.
Work in `<scratchpad>/links3/`. **Never kill or restart the dev server on :3000. Never run
`npm install`.** The dev server is already running and serving `/links/` (HTTP 200).

**A. Unit harness — `<scratchpad>/links3/unit.mjs`**
The `S.browser_fallback_url` fragment is NOT observable in the browser (measured fact 4), so assert the
strings here. Compile the pure module first (typescript is already a devDependency, no install):
```
cd /Users/myltonvanbolderen/small-record && npx tsc lib/app-links.ts --outDir <scratchpad>/links3/build --module es2022 --target es2022 --moduleResolution bundler --skipLibCheck
```
Then import `build/app-links.js` and assert:
1. `getInAppPlatform` matrix — `null` for: iPhone 13 Safari UA, Pixel 7 Chrome UA, Desktop Chrome UA,
   `undefined`. `'ios'` for: iPhone UA + ` Instagram 300.0.0.0`, iPhone UA + ` [FBAN/FBIOS;FBAV/…]`,
   iPhone UA + ` LinkedInApp`. `'android'` for: Pixel 7 UA + ` Instagram 300.0.0.0`, Pixel 7 UA +
   ` BytedanceWebview/d8a21c6`.
2. `Object.keys(APP_LINKS)` is exactly the 5 https URLs of the `<url_table>`.
3. For every entry: `new URL(value.android)` does not throw, it starts with `intent://`, contains
   `;package=com.`, contains `;S.browser_fallback_url=` + `encodeURIComponent(key)`, ends with `;end`.
4. For every entry with a non-null `ios`: `new URL(value.ios)` does not throw, and the scheme is one of
   `instagram:`, `youtube:`. Both SoundCloud entries have `ios === null` (regression guard for
   measured fact 1).
Print PASS/FAIL per assertion and exit non-zero on any failure.

**B. Browser checks — `<scratchpad>/links3/check.mjs`**
```js
import { createRequire } from 'node:module'
const require = createRequire('/Users/myltonvanbolderen/Downloads/PANIC ROOM/_kit/package.json')
const { chromium, devices } = require('playwright')
```
Every context: `{ ...devices['iPhone 13'] /* or Pixel 7 */, userAgent: <override>, reducedMotion:
'reduce' }`. **Stub the outside world** so the tests are offline-deterministic and never hit the real
Instagram/SoundCloud/YouTube: `context.route(/^https:\/\/(?!localhost)/, r => r.fulfill({ status: 200,
contentType: 'text/html', body: '<html><body>stub</body></html>' }))` (it intercepts top-level
navigations and popups too). On every page and popup, record `page.on('requestfailed')`,
`page.on('console')` and `page.on('pageerror')`; `requestfailed` is the signal that proves a custom
scheme was attempted (measured fact 3).

Checks — print one PASS/FAIL line each with the captured evidence:

a. **Normal mobile UA** (iPhone 13 descriptor, UA untouched). Click the Instagram row.
   PASS if: a popup opens on `https://www.instagram.com/smallmusics` (`page.waitForEvent('popup')`),
   `page.url()` is still `/links/`, and NO `requestfailed` URL starts with `instagram://`.
   -> proves the handler bails out outside in-app browsers.

b. **Instagram in-app on iOS** (iPhone 13 UA + ` Instagram 300.0.0.0`). Click the Instagram row.
   PASS if BOTH:
   - a `requestfailed` fires with url exactly `instagram://user?username=smallmusics`
     (the direct proof the app scheme was attempted — Chromium aborts unknown schemes, measured
     fact 3), AND
   - `page.url()` is still `/links/` at t=300ms and becomes `https://www.instagram.com/smallmusics`
     by t<=2500ms (the ~900ms timer fallback fired — proves `preventDefault` ran and the fallback
     path works).
   No popup must open. State in the output why these two signals are sufficient: in Chromium the
   `instagram://` navigation is aborted without any page navigation, so the only way the page can end
   up on the https URL ~900ms later is the deeplink handler's own fallback timer.
   Also run the same check on the YouTube row (`youtube://www.youtube.com/@SmallRecords_Music`) and on
   the mix row (`youtube://X9rpsIVIVgk`), and assert the two SoundCloud rows behave like case (a)
   instead (`ios: null` -> plain https popup, no custom scheme requestfailed).

c. **Instagram in-app on Android** (Pixel 7 UA + ` Instagram 300.0.0.0`). Click the Instagram row.
   PASS if: a `requestfailed` fires with a url starting `intent://` (Chromium strips the fragment, so
   assert the prefix `intent://user?username=smallmusics`), `page.url()` is still `/links/` after
   1500ms (no timer, no https fallback — the OS would have done it on a real device), no popup, and no
   `pageerror`. The `S.browser_fallback_url` payload is covered by unit assertion A.3 — say so in the
   output. Repeat for one SoundCloud row: requestfailed url starts with
   `intent://soundcloud.com/casae`.

d. **Modified click** (iPhone 13 UA + ` Instagram 300.0.0.0`, `page.click(selector, { modifiers:
   ['Meta'] })`). PASS if no `requestfailed` with a custom scheme AND `page.url()` is unchanged after
   1500ms (no fallback timer was armed -> `preventDefault` did not run). A popup may or may not open
   in headless chromium; report it, do not assert on it.

e. **Untouched rows**: in the in-app iOS context, assert `main a[data-app-link]` has exactly 5 entries
   and their hrefs are the 5 of the `<url_table>`; assert the anchors for `/events/`, `/small-record/`,
   `/events/#panic-room` and `mailto:contact@small-records.com` have NO `data-app-link`; assert the
   mailto anchor has no `target` attribute. Then assert the full 9-href DOM order is still
   `/events/#panic-room`, instagram, soundcloud/casae, soundcloud/letchetony, youtube channel,
   `/events/`, `/small-record/`, `mailto:contact@small-records.com`, `https://youtu.be/X9rpsIVIVgk`,
   with `target="_blank"` + `rel` containing `noopener` and `noreferrer` on every https one.

f. **Layout unchanged** (iPhone 13, 390x844, plain UA, reducedMotion reduce): report
   `document.documentElement.scrollHeight`, the bottom of the deepest element in `main` and the bottom
   of the last row — **hard pass: all <= 700**. Assert `document.documentElement.scrollWidth <=
   viewport.width` (no horizontal overflow) and that every tap target in `main` is >= 44px tall.
   Screenshots `fullPage: true` into `<scratchpad>/links3/`: `iphone13.png`, `iphone13-instagram-ua.png`,
   `pixel7-instagram-ua.png`.

Print a final PASS/FAIL summary table and exit non-zero on any failure. If something fails, fix the
source (Task 1 files only) and re-run both scripts until green.
  </action>
  <verify>
    <automated>cd /Users/myltonvanbolderen/small-record && npx tsc --noEmit && npm run lint</automated>
    <automated>node "/private/tmp/claude-501/-Users-myltonvanbolderen-small-record/54b5f0cd-5a66-4186-b337-6738006c59de/scratchpad/links3/unit.mjs"</automated>
    <automated>node "/private/tmp/claude-501/-Users-myltonvanbolderen-small-record/54b5f0cd-5a66-4186-b337-6738006c59de/scratchpad/links3/check.mjs"</automated>
  </verify>
  <done>
Both scripts exit 0 with every check PASS: UA matrix, URL shapes and `S.browser_fallback_url` payloads
(unit), and in the browser — normal UA keeps plain https, iOS in-app attempts `instagram://` /
`youtube://` then falls back after ~900ms, Android in-app attempts `intent://`, modified click is not
hijacked, internal + mailto rows carry no handler, 9 hrefs in unchanged order with correct
`target`/`rel`, one-screen budget (<= 700px) and no horizontal overflow still hold. The 3 screenshots
exist in `<scratchpad>/links3/`.
`git status` shows no unexpected file: only the 4 Task 1 files (already committed) may differ. If a
fix was needed, commit it separately with `git add` on the exact paths and a
`fix(links): …` message ending with `Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>`.
If no fix was needed there is no second commit — that is the expected outcome.
Do NOT deploy.
  </done>
</task>

</tasks>

<threat_model>
## Trust Boundaries

| Boundary | Description |
|----------|-------------|
| visitor browser -> static page | No user input is accepted, stored or rendered; the page is fully static HTML |
| page -> OS app launcher (custom scheme / intent://) | The page asks the OS to hand the navigation to a native app |
| page -> third-party origins (Instagram, SoundCloud, YouTube) | User-initiated navigation to external origins |
| in-app webview UA string -> code path selection | An attacker-controlled-ish value (the UA) chooses which branch runs |

## STRIDE Threat Register

| Threat ID | Category | Component | Disposition | Mitigation Plan |
|-----------|----------|-----------|-------------|-----------------|
| T-pzz-01 | Tampering | `AppLink` navigation target | mitigate | Targets come only from the frozen `APP_LINKS` table in `lib/app-links.ts`; nothing is built from `location`, query params or any runtime input, so no open-redirect / scheme-injection surface. Unit assertion A.2/A.3 pins the exact set of URLs |
| T-pzz-02 | Tampering | `S.browser_fallback_url` payload | mitigate | Built with `encodeURIComponent(httpsHref)` inside a single `intent()` helper, so the `;`-delimited intent grammar can never be broken out of by the value; asserted byte-for-byte by unit check A.3 |
| T-pzz-03 | Tampering | External `<a target="_blank">` rows | mitigate | `rel="noopener noreferrer"` kept on every external anchor including the new `AppLink` (reverse tabnabbing); asserted by browser check (e) |
| T-pzz-04 | Spoofing | UA-based branch selection | accept | The UA is controlled by the visitor's own browser; the worst outcome is that the visitor's own device tries to open an app. No server trust is placed on it |
| T-pzz-05 | Denial of service | iOS fallback timer | mitigate | Single 900ms `setTimeout`, cleared on `visibilitychange`/`pagehide`/`blur` and on unmount; a failed `location.href` assignment is caught and falls straight through to the https URL, so a row can never become a dead click |
| T-pzz-06 | Information disclosure | `data-app-link` marker + deeplink strings | accept | Only public profile identifiers are involved, already visible in the https URLs on the same page |
</threat_model>

<verification>
- `npx tsc --noEmit` -> 0 errors
- `npm run lint` -> 0 errors (ESLint also runs during `next build`)
- `node <scratchpad>/links3/unit.mjs` -> all PASS, exit 0
- `node <scratchpad>/links3/check.mjs` -> all PASS, exit 0, 3 screenshots written
- `git diff --stat` touches only the 4 files in `files_modified`; no other page, no dependency added
  (`git diff package.json` empty), no `linktr.ee` href changed
- No deploy (`vercel --prod` is NOT run)
</verification>

<success_criteria>
- Inside an iOS in-app browser, clicking Instagram / YouTube / the mix attempts the app scheme and
  falls back to the https URL ~900ms later; the fallback is cancelled when the app takes over
- Inside an Android in-app browser, clicking a deeplinked row navigates to an `intent://` URL carrying
  `S.browser_fallback_url` — no timer
- Outside in-app browsers (Safari, Chrome, desktop) and on any modified click, behaviour is
  byte-identical to today: plain https in a new tab
- Internal rows and the mailto row are untouched; every row is still a real `<a href="https…">` with
  `target="_blank" rel="noopener noreferrer"` (mailto: neither)
- Zero visual change: same 9 destinations in the same order, one-screen budget (<= 700px at 390x844)
  and no horizontal overflow still hold
- Both SoundCloud rows keep `ios: null` (documented: `soundcloud://users:ID` is not a parseable URL)
</success_criteria>

<output>
After completion, create
`.planning/quick/260928-pzz-deeplinks-vers-les-apps-sur-la-page-link/260928-pzz-SUMMARY.md`
</output>
