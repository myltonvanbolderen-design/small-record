'use client'

import { useRef, useEffect, useState } from 'react'
import { motion, useInView } from 'motion/react'

interface CountUpProps {
  value: string
  className?: string
  delay?: number
}

export function CountUp({ value, className, delay = 0 }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.5 })
  const [displayed, setDisplayed] = useState(false)

  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => setDisplayed(true), delay * 1000)
      return () => clearTimeout(timer)
    }
  }, [isInView, delay])

  return (
    <motion.span
      ref={ref}
      initial={{ opacity: 0, y: 10 }}
      animate={displayed ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
      className={className}
    >
      {displayed ? value : '\u00A0'}
    </motion.span>
  )
}
