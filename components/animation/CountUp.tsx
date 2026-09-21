'use client'

import { useRef, useEffect, useState } from 'react'
import { animate, useInView } from 'motion/react'

interface CountUpProps {
  /** Final value, e.g. "711" or "7h" — the leading number counts up, the rest stays */
  value: string
  className?: string
  delay?: number
  duration?: number
}

export function CountUp({ value, className, delay = 0, duration = 1.6 }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.5 })
  const match = value.match(/^(\D*)(\d+)(.*)$/)
  const [prefix, digits, suffix] = match ? [match[1], match[2], match[3]] : ['', '', '']
  const target = Number(digits)
  const counts = match !== null
  // SSR renders the final value (no-JS, crawlers); the client resets to 0 until in view
  const [current, setCurrent] = useState(target)

  useEffect(() => {
    if (!counts) return
    if (!isInView) {
      setCurrent(0)
      return
    }
    const controls = animate(0, target, {
      duration,
      delay,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setCurrent(Math.round(v)),
    })
    return () => controls.stop()
  }, [isInView, target, delay, duration, counts])

  if (!counts) return <span className={className}>{value}</span>

  return (
    <span ref={ref} className={className} style={{ fontVariantNumeric: 'tabular-nums' }}>
      {prefix}
      {current}
      {suffix}
    </span>
  )
}
