'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

export function ScrollToTop() {
  const pathname = usePathname()

  useEffect(() => {
    // Don't override the browser/Next.js hash-anchor scroll (e.g. /events/#panic-room)
    if (window.location.hash) return
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}
