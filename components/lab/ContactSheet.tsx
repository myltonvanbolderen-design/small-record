'use client'

import { useEffect, useRef, useState, useSyncExternalStore, type CSSProperties } from 'react'
import Image from 'next/image'
import { FilmLightbox } from './FilmLightbox'
import type { FilmFrame } from './frames'

const EDGE_TEXT = 'SMALL 400 · PANIC ROOM 11.09.26 · '.repeat(4)

const SPROCKET_STYLE: CSSProperties = {
  backgroundImage:
    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='10'%3E%3Crect x='4' y='1' width='8' height='8' rx='1.5' fill='%23d9d2c3'/%3E%3C/svg%3E\")",
  backgroundRepeat: 'repeat-x',
  backgroundSize: '16px 10px',
}

const ROT = [-6, 4, -2, 7, -4]

function subscribeChunk(callback: () => void) {
  const mql = window.matchMedia('(min-width:1024px)')
  mql.addEventListener('change', callback)
  return () => mql.removeEventListener('change', callback)
}

function useChunkSize(): number {
  return useSyncExternalStore(
    subscribeChunk,
    () => (window.matchMedia('(min-width:1024px)').matches ? 6 : 4),
    () => 6
  )
}

function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = []
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size))
  return out
}

function FeltCircle({ seed }: { seed: number }) {
  const rotation = ROT[seed % ROT.length]
  const mark = seed % 2 === 0 ? '★' : '!'
  return (
    <>
      <svg
        aria-hidden="true"
        data-mark="pick"
        viewBox="0 0 120 80"
        preserveAspectRatio="none"
        className="pointer-events-none absolute -inset-[8%] z-10 overflow-visible"
        style={{ transform: `rotate(${rotation}deg)` }}
      >
        <path
          d="M18 44 C 14 20, 52 6, 84 10 C 110 14, 116 36, 108 54 C 98 72, 56 78, 30 70 C 14 64, 10 50, 22 38 L 26 34"
          fill="none"
          stroke="#CC2936"
          strokeWidth={3.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -top-3 -right-2 z-10 rotate-12 font-dog text-2xl text-terracotta"
      >
        {mark}
      </span>
    </>
  )
}

function FeltCross({ seed }: { seed: number }) {
  const rotation = ROT[seed % ROT.length]
  return (
    <svg
      aria-hidden="true"
      data-mark="fogged"
      viewBox="0 0 120 80"
      preserveAspectRatio="none"
      className="pointer-events-none absolute -inset-[8%] z-10 overflow-visible"
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      <path
        d="M12 10 C 40 30, 80 52, 110 72"
        fill="none"
        stroke="#CC2936"
        strokeWidth={3.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
      <path
        d="M108 8 C 80 30, 42 50, 14 74"
        fill="none"
        stroke="#CC2936"
        strokeWidth={3.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  )
}

const FRAME_SIZES = '(min-width:1024px) 15vw, (min-width:768px) 22vw, 70vw'

function FrameCell({
  frame,
  seed,
  onOpen,
  registerRef,
}: {
  frame: FilmFrame
  seed: number
  onOpen: () => void
  registerRef: (el: HTMLButtonElement | null) => void
}) {
  const num = frame.num

  if (frame.fogged) {
    return (
      <div
        data-frame={num}
        data-fogged
        aria-hidden="true"
        className="relative w-[70vw] shrink-0 snap-center md:w-auto md:shrink md:snap-none"
      >
        <div className="relative aspect-[3/2] w-full bg-[#0e0c0b] p-[3px] ring-1 ring-inset ring-[#2a2622]">
          <div className="relative h-full w-full overflow-hidden">
            <Image src={frame.src} alt="" fill sizes={FRAME_SIZES} className="object-cover" />
          </div>
          <FeltCross seed={seed} />
        </div>
        <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.25em] text-[#E8A33D]">
          {num} ▸ {num}A
        </p>
      </div>
    )
  }

  return (
    <button
      ref={registerRef}
      type="button"
      data-frame={num}
      data-pick={frame.pick || undefined}
      aria-label={`Open frame ${num} — ${frame.caption}`}
      onClick={onOpen}
      className="group relative w-[70vw] shrink-0 snap-center text-left cursor-zoom-in focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blanc md:w-auto md:shrink md:snap-none"
    >
      <span className="relative block aspect-[3/2] w-full bg-[#0e0c0b] p-[3px] ring-1 ring-inset ring-[#2a2622] group-hover:ring-blanc/40">
        <span className="relative block h-full w-full overflow-hidden">
          <Image src={frame.src} alt={frame.caption} fill sizes={FRAME_SIZES} className="object-cover" />
        </span>
        {frame.pick && <FeltCircle seed={seed} />}
      </span>
      <span
        aria-hidden="true"
        className="mt-1 block font-mono text-[9px] uppercase tracking-[0.25em] text-[#E8A33D]"
      >
        {num} ▸ {num}A
      </span>
    </button>
  )
}

interface ContactSheetProps {
  frames: FilmFrame[]
}

export function ContactSheet({ frames }: ContactSheetProps) {
  const chunkSize = useChunkSize()
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const buttonRefs = useRef(new Map<number, HTMLButtonElement>())
  const lastOpenIndex = useRef<number | null>(null)

  useEffect(() => {
    if (openIndex !== null) {
      lastOpenIndex.current = openIndex
    } else if (lastOpenIndex.current !== null) {
      buttonRefs.current.get(lastOpenIndex.current)?.focus()
      lastOpenIndex.current = null
    }
  }, [openIndex])

  const indexed = frames.map((frame, i) => ({ frame, i }))
  const strips = chunk(indexed, chunkSize)

  return (
    <div className="space-y-6">
      {strips.map((strip, stripIdx) => (
        <div
          key={stripIdx}
          data-strip
          className="overflow-x-auto scroll-smooth overscroll-x-contain scrollbar-hide snap-x snap-mandatory md:overflow-visible md:snap-none"
        >
          <div className="relative w-max bg-[#141210] px-2 py-7 ring-1 ring-black/60 md:w-full">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 top-2 h-[10px]"
              style={SPROCKET_STYLE}
            />
            <div
              aria-hidden="true"
              className="absolute inset-x-0 top-5 overflow-hidden whitespace-nowrap px-3 font-mono text-[9px] uppercase tracking-[0.25em] text-[#E8A33D]"
            >
              {EDGE_TEXT}
            </div>

            <div className="mt-3 flex gap-3 md:grid md:grid-cols-4 md:gap-4 lg:grid-cols-6">
              {strip.map(({ frame, i }) => (
                <FrameCell
                  key={frame.num}
                  frame={frame}
                  seed={i}
                  onOpen={() => setOpenIndex(i)}
                  registerRef={(el) => {
                    if (el) buttonRefs.current.set(i, el)
                    else buttonRefs.current.delete(i)
                  }}
                />
              ))}
            </div>

            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 bottom-2 h-[10px]"
              style={SPROCKET_STYLE}
            />
          </div>
        </div>
      ))}

      <FilmLightbox
        frames={frames}
        index={openIndex}
        onIndexChange={setOpenIndex}
        onClose={() => setOpenIndex(null)}
      />
    </div>
  )
}
