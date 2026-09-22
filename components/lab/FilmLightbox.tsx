'use client'

import { useEffect, useRef, useSyncExternalStore } from 'react'
import { createPortal } from 'react-dom'
import { motion, useReducedMotion } from 'motion/react'
import Image from 'next/image'
import type { FilmFrame } from './frames'

interface FilmLightboxProps {
  frames: FilmFrame[]
  index: number | null
  onIndexChange: (i: number) => void
  onClose: () => void
}

function step(frames: FilmFrame[], from: number, dir: 1 | -1): number {
  const len = frames.length
  let i = from
  for (let n = 0; n < len; n++) {
    i = (i + dir + len) % len
    if (!frames[i].fogged) return i
  }
  return from
}

function subscribeNoop() {
  return () => {}
}

export function FilmLightbox({ frames, index, onIndexChange, onClose }: FilmLightboxProps) {
  const mounted = useSyncExternalStore(
    subscribeNoop,
    () => true,
    () => false
  )
  const reduce = useReducedMotion()
  const closeRef = useRef<HTMLButtonElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const isOpen = index !== null

  // Mount/unmount side effects — run once per open session, not on every
  // index change, so navigating with arrows doesn't re-steal focus.
  useEffect(() => {
    if (!isOpen) return

    const main = document.getElementById('main')
    if (main) main.inert = true
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const raf = requestAnimationFrame(() => {
      closeRef.current?.focus()
    })

    return () => {
      cancelAnimationFrame(raf)
      if (main) main.inert = false
      document.body.style.overflow = prevOverflow
    }
  }, [isOpen])

  // Keyboard handling — re-subscribes on index change to capture the
  // current frame for prev/next navigation, without touching focus/inert.
  useEffect(() => {
    if (index === null) return

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      } else if (e.key === 'ArrowLeft') {
        onIndexChange(step(frames, index, -1))
      } else if (e.key === 'ArrowRight') {
        onIndexChange(step(frames, index, 1))
      } else if (e.key === 'Tab') {
        const focusables = containerRef.current?.querySelectorAll<HTMLElement>('[data-lb]')
        if (!focusables || focusables.length === 0) return
        const list = Array.from(focusables)
        const current = document.activeElement
        const currentIdx = list.indexOf(current as HTMLElement)
        e.preventDefault()
        let nextIdx: number
        if (e.shiftKey) {
          nextIdx = currentIdx <= 0 ? list.length - 1 : currentIdx - 1
        } else {
          nextIdx = currentIdx === -1 || currentIdx === list.length - 1 ? 0 : currentIdx + 1
        }
        list[nextIdx]?.focus()
      }
    }
    document.addEventListener('keydown', onKeyDown)

    return () => {
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [index, frames, onClose, onIndexChange])

  if (!mounted || index === null) return null

  const f = frames[index]

  return createPortal(
    <div
      ref={containerRef}
      role="dialog"
      aria-modal="true"
      aria-label={`Frame ${f.num} — ${f.caption}`}
      className="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-noir/95 px-4 py-6"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <motion.div
        initial={reduce ? undefined : { opacity: 0 }}
        animate={reduce ? undefined : { opacity: 1 }}
        transition={{ duration: 0.25 }}
        className="pointer-events-none absolute inset-0 -z-10"
        aria-hidden="true"
      />

      <button
        ref={closeRef}
        type="button"
        data-lb="close"
        aria-label="Close"
        onClick={onClose}
        className="absolute right-4 top-4 z-10 font-condensed text-[0.7rem] uppercase tracking-[0.25em] text-blanc/70 transition-colors hover:text-blanc focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blanc"
      >
        Close
      </button>

      <div className="relative h-[min(90vh,calc(100vw*2/3))] w-full max-w-[min(92vw,135vh)]">
        <Image src={f.src} alt={f.caption} fill sizes="100vw" className="object-contain" />
      </div>

      <div className="mt-4 flex w-full max-w-[min(92vw,135vh)] items-center justify-between gap-4">
        <button
          type="button"
          data-lb="prev"
          aria-label="Previous frame"
          onClick={() => onIndexChange(step(frames, index, -1))}
          className="font-condensed text-[0.7rem] uppercase tracking-[0.25em] text-blanc/70 transition-colors hover:text-blanc focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blanc"
        >
          ← Prev
        </button>

        <div className="text-center">
          <p className="font-display text-lg">
            {f.pick && <span className="mr-2 text-terracotta-light">● Pick</span>}
            {f.caption}
          </p>
          <p className="mt-1 font-condensed text-[0.6rem] uppercase tracking-[0.3em] text-blanc/55">
            Frame {f.num} / picks marked in red
          </p>
        </div>

        <button
          type="button"
          data-lb="next"
          aria-label="Next frame"
          onClick={() => onIndexChange(step(frames, index, 1))}
          className="font-condensed text-[0.7rem] uppercase tracking-[0.25em] text-blanc/70 transition-colors hover:text-blanc focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blanc"
        >
          Next →
        </button>
      </div>
    </div>,
    document.body
  )
}
