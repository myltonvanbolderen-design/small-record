'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

export function CopyLinkButton({ className }: { className?: string }) {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!copied) return
    const timer = setTimeout(() => setCopied(false), 2000)
    return () => clearTimeout(timer)
  }, [copied])

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText('https://small-records.com/links/')
      setCopied(true)
    } catch {
      // Clipboard unavailable (e.g. insecure origin) — leave label unchanged
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label="Copy the link to this page"
      className={cn(
        'inline-flex min-h-11 items-center justify-center px-3 py-2 font-condensed text-[0.65rem] uppercase tracking-[0.25em] text-blanc/55 transition-colors hover:text-terracotta',
        className
      )}
    >
      {copied ? 'Copied' : 'Copy link'}
      <span aria-live="polite" className="sr-only">
        {copied ? 'Link copied' : ''}
      </span>
    </button>
  )
}
