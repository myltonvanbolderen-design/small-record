'use client'

import { useEffect, useRef, type MouseEvent, type ReactNode } from 'react'
import { getInAppPlatform, type AppTarget } from '@/lib/app-links'

const FALLBACK_DELAY_MS = 900

/**
 * Navigate to a custom scheme.
 * Prefer `location.href`: the page stays put, so the fallback timer can still fire when no app
 * answers. Some official schemes can't be assigned though — SoundCloud's `soundcloud://users:<id>`
 * throws because the id parses as a port number — so those go through an <a> click, which keeps
 * the raw string. Trade-off: an anchor click hands off to the OS and gives up the timer.
 */
function navigateToScheme(url: string): boolean {
  try {
    new URL(url)
    window.location.href = url
    return true
  } catch {
    // unparseable scheme (SoundCloud): anchor click keeps the string intact
  }
  try {
    const a = document.createElement('a')
    a.href = url
    a.style.display = 'none'
    document.body.appendChild(a)
    a.click()
    a.remove()
    return true
  } catch {
    return false
  }
}

export function AppLink({
  href,
  app,
  className,
  children,
}: {
  href: string
  app: AppTarget
  className?: string
  children: ReactNode
}) {
  const cleanupRef = useRef<(() => void) | null>(null)

  useEffect(() => {
    return () => cleanupRef.current?.()
  }, [])

  function handleClick(e: MouseEvent<HTMLAnchorElement>) {
    if (e.defaultPrevented) return
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return

    const platform = getInAppPlatform(navigator.userAgent)
    if (!platform) return

    const target = platform === 'ios' ? app.ios : app.android
    if (!target) return

    e.preventDefault()

    if (platform === 'android') {
      if (!navigateToScheme(target)) window.location.href = href
      return
    }

    // iOS: arm the fallback BEFORE navigating, then navigate.
    let timerId: number | null = null

    const cleanup = () => {
      if (timerId !== null) {
        window.clearTimeout(timerId)
        timerId = null
      }
      document.removeEventListener('visibilitychange', onVisibilityChange)
      window.removeEventListener('pagehide', cancel)
      window.removeEventListener('blur', cancel)
      cleanupRef.current = null
    }

    function cancel() {
      cleanup()
    }

    function onVisibilityChange() {
      if (document.visibilityState === 'hidden') cancel()
    }

    cleanupRef.current = cleanup

    timerId = window.setTimeout(() => {
      cleanup()
      window.location.href = href
    }, FALLBACK_DELAY_MS)

    document.addEventListener('visibilitychange', onVisibilityChange)
    window.addEventListener('pagehide', cancel)
    window.addEventListener('blur', cancel)

    if (!navigateToScheme(target)) {
      cleanup()
      window.location.href = href
    }
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      data-app-link=""
      onClick={handleClick}
    >
      {children}
    </a>
  )
}
