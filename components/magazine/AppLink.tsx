'use client'

import { useEffect, useRef, type MouseEvent, type ReactNode } from 'react'
import { getInAppPlatform, type AppTarget } from '@/lib/app-links'

const FALLBACK_DELAY_MS = 900

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
      try {
        window.location.href = target
      } catch {
        window.location.href = href
      }
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

    try {
      window.location.href = target
    } catch {
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
