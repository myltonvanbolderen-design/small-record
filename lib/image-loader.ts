'use client'

// keep in sync with tools/image-variants.mjs WIDTHS and next.config.ts deviceSizes
export const IMAGE_WIDTHS = [640, 1080, 1280, 1920] as const

export function pickWidth(w: number): number {
  for (const width of IMAGE_WIDTHS) {
    if (width >= w) return width
  }
  return IMAGE_WIDTHS[IMAGE_WIDTHS.length - 1]
}

export function webpVariant(src: string, width: number): string {
  const match = src.match(/^\/images\/(?!_w\/)(.+)\.jpe?g$/i)
  if (!match) return src
  return `/images/_w/${pickWidth(width)}/${match[1]}.webp`
}

export default function imageLoader({
  src,
  width,
}: {
  src: string
  width: number
  quality?: number
}): string {
  return webpVariant(src, width)
}
