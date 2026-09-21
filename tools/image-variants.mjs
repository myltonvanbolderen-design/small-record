#!/usr/bin/env node
// Build-time WebP variant generator for public/images/*.jpg -> public/images/_w/{width}/*.webp
// Incremental: skips a variant if it already exists and is newer than the source file.
// Also (re)generates the small 96x96 gnome PNG used by the Header.

import path from 'node:path'
import fs from 'node:fs/promises'

let sharp
try {
  const mod = await import('sharp')
  sharp = mod.default
} catch (err) {
  console.error('[image-variants] sharp could not be loaded — aborting build.')
  console.error('[image-variants] Original error:', err?.message ?? err)
  process.exit(1)
}

// keep in sync with lib/image-loader.ts IMAGE_WIDTHS and next.config.ts deviceSizes
const WIDTHS = [640, 1080, 1920]

const ROOT = path.join(process.cwd(), 'public/images')
const OUT_ROOT = path.join(ROOT, '_w')

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true })
  const files = []
  for (const entry of entries) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      if (full === OUT_ROOT) continue
      files.push(...(await walk(full)))
    } else if (/\.jpe?g$/i.test(entry.name)) {
      files.push(full)
    }
  }
  return files
}

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true })
}

async function generateVariants() {
  const files = await walk(ROOT)

  let generated = 0
  let skipped = 0
  const inputBytesByWidth = Object.fromEntries(WIDTHS.map((w) => [w, 0]))
  const outputBytesByWidth = Object.fromEntries(WIDTHS.map((w) => [w, 0]))
  let totalInputBytes = 0

  for (const file of files) {
    const relative = path.relative(ROOT, file)
    const inputStat = await fs.stat(file)
    totalInputBytes += inputStat.size

    await Promise.all(
      WIDTHS.map(async (width) => {
        const outRelative = relative.replace(/\.jpe?g$/i, '.webp')
        const outPath = path.join(OUT_ROOT, String(width), outRelative)

        let needsGenerate = true
        try {
          const outStat = await fs.stat(outPath)
          if (outStat.mtimeMs >= inputStat.mtimeMs) {
            needsGenerate = false
          }
        } catch {
          // out file doesn't exist yet
        }

        if (!needsGenerate) {
          skipped++
          const outStat = await fs.stat(outPath)
          outputBytesByWidth[width] += outStat.size
          inputBytesByWidth[width] += inputStat.size
          return
        }

        await ensureDir(path.dirname(outPath))
        await sharp(file)
          .rotate()
          .resize({ width, withoutEnlargement: true })
          .webp({ quality: 72 })
          .toFile(outPath)

        generated++
        const outStat = await fs.stat(outPath)
        outputBytesByWidth[width] += outStat.size
        inputBytesByWidth[width] += inputStat.size
      }),
    )
  }

  console.log(`[image-variants] files: ${files.length}, generated: ${generated}, skipped: ${skipped}`)
  console.log(`[image-variants] total input: ${(totalInputBytes / 1024 / 1024).toFixed(2)} MB`)
  for (const width of WIDTHS) {
    console.log(
      `[image-variants]   ${width}w output: ${(outputBytesByWidth[width] / 1024 / 1024).toFixed(2)} MB`,
    )
  }
}

async function generateGnome() {
  const src = path.join(ROOT, 'logo/logo-white.png')
  const out = path.join(ROOT, 'logo/logo-white-96.png')

  let needsGenerate = true
  try {
    const [srcStat, outStat] = await Promise.all([fs.stat(src), fs.stat(out)])
    if (outStat.mtimeMs >= srcStat.mtimeMs) {
      needsGenerate = false
    }
  } catch {
    // out file doesn't exist yet, or src missing (handled below)
  }

  if (!needsGenerate) {
    console.log('[image-variants] gnome 96x96: up to date, skipped')
    return
  }

  await sharp(src)
    .resize(96, 96, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png({ compressionLevel: 9 })
    .toFile(out)

  console.log('[image-variants] gnome 96x96: generated')
}

await generateVariants()
await generateGnome()
