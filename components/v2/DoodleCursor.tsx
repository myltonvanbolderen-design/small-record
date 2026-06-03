'use client'

import { useEffect, useRef, useState } from 'react'

type Trail = { id: number; x: number; y: number; rot: number; symbol: string }

const SYMBOLS = ['♪', '♫', '✦', '✿', '★']

export function DoodleCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 })
  const [trail, setTrail] = useState<Trail[]>([])
  const [enabled, setEnabled] = useState(false)
  const lastEmit = useRef(0)
  const idRef = useRef(0)

  useEffect(() => {
    const isCoarse = window.matchMedia('(pointer: coarse)').matches
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (isCoarse || reduced) return
    setEnabled(true)

    const onMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY })
      const now = performance.now()
      if (now - lastEmit.current > 90) {
        lastEmit.current = now
        const id = ++idRef.current
        const symbol = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]
        const rot = Math.random() * 60 - 30
        setTrail((t) => [
          ...t.slice(-12),
          { id, x: e.clientX, y: e.clientY, rot, symbol },
        ])
        setTimeout(() => {
          setTrail((t) => t.filter((p) => p.id !== id))
        }, 1200)
      }
    }

    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  if (!enabled) return null

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999]" aria-hidden>
      {/* Trail */}
      {trail.map((p) => (
        <span
          key={p.id}
          className="absolute font-dog text-2xl text-[#FF8C42]"
          style={{
            left: p.x,
            top: p.y,
            transform: `translate(-50%, -50%) rotate(${p.rot}deg)`,
            animation: 'doodleFade 1.2s ease-out forwards',
          }}
        >
          {p.symbol}
        </span>
      ))}

      {/* Custom cursor — gnome dot */}
      <div
        className="absolute h-6 w-6 rounded-full border-[2.5px] border-[#1a1a1a] bg-[#FF8C42]"
        style={{
          left: pos.x,
          top: pos.y,
          transform: 'translate(-50%, -50%)',
          transition: 'transform 0.05s linear',
        }}
      />

      <style jsx>{`
        @keyframes doodleFade {
          0% {
            opacity: 0.95;
            transform: translate(-50%, -50%) rotate(var(--rot, 0deg)) scale(0.6);
          }
          25% {
            opacity: 1;
            transform: translate(-50%, calc(-50% - 16px)) scale(1);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, calc(-50% - 60px)) scale(0.4);
          }
        }
      `}</style>
    </div>
  )
}
