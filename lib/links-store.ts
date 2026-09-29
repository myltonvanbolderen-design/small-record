/**
 * Server-only. Draft/published store for the `/links` link-in-bio rows.
 *
 * Backed by Vercel Blob when `BLOB_READ_WRITE_TOKEN` is set; falls back to `.links-store/*.json`
 * on disk otherwise (local dev only — this directory is gitignored and vercelignored).
 *
 * `getPublishedLinks()` is read through `unstable_cache`, tagged `links` (see `LINKS_TAG`).
 * Part 2 (the admin UI) only needs `getDraftLinks` / `saveDraft` / `publishDraft` — `publishDraft`
 * calls `revalidateTag(LINKS_TAG)` itself, so the admin never needs to touch caching directly.
 */
import { unstable_cache, revalidateTag } from 'next/cache'
import { get, put } from '@vercel/blob'
import fs from 'node:fs/promises'
import path from 'node:path'
import { parseLinksDoc, type LinksDoc } from '@/lib/links-schema'
import { seedDoc } from '@/lib/links-seed'

export const LINKS_TAG = 'links'
const PUBLISHED_KEY = 'links/published.json'
const DRAFT_KEY = 'links/draft.json'
const DEV_DIR = path.join(process.cwd(), '.links-store')

function blobEnabled(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN)
}

let warnedOnce = false
function warnFallbackOnce(): void {
  if (warnedOnce) return
  warnedOnce = true
  console.warn('[links-store] BLOB_READ_WRITE_TOKEN missing — using .links-store/ on disk (dev only)')
}

async function readRaw(key: string): Promise<unknown | null> {
  try {
    if (blobEnabled()) {
      const res = await get(key, { access: 'public', useCache: false })
      if (!res || !res.stream) return null
      return await new Response(res.stream).json()
    }
    warnFallbackOnce()
    const filePath = path.join(DEV_DIR, path.basename(key))
    try {
      const raw = await fs.readFile(filePath, 'utf8')
      return JSON.parse(raw)
    } catch (err) {
      if ((err as NodeJS.ErrnoException).code === 'ENOENT') return null
      throw err
    }
  } catch (err) {
    console.error('[links-store] read failed', err)
    return null
  }
}

async function writeRaw(key: string, doc: LinksDoc): Promise<void> {
  if (!blobEnabled() && process.env.VERCEL) {
    throw new Error(
      '[links-store] Vercel Blob is not configured (BLOB_READ_WRITE_TOKEN missing) — refusing to write to a read-only filesystem'
    )
  }
  if (blobEnabled()) {
    await put(key, JSON.stringify(doc, null, 2), {
      access: 'public',
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: 'application/json',
      cacheControlMaxAge: 60,
    })
    return
  }
  warnFallbackOnce()
  await fs.mkdir(DEV_DIR, { recursive: true })
  await fs.writeFile(path.join(DEV_DIR, path.basename(key)), JSON.stringify(doc, null, 2), 'utf8')
}

async function readDoc(key: string): Promise<LinksDoc | null> {
  const raw = await readRaw(key)
  if (raw === null) return null
  const parsed = parseLinksDoc(raw)
  if (!parsed) {
    console.error(`[links-store] corrupt document at ${key}, ignoring`)
    return null
  }
  return parsed
}

export async function getPublishedLinks(): Promise<LinksDoc> {
  return unstable_cache(
    async () => (await readDoc(PUBLISHED_KEY)) ?? seedDoc(),
    ['links:published'],
    { tags: [LINKS_TAG], revalidate: 3600 }
  )()
}

export async function getDraftLinks(): Promise<LinksDoc> {
  return (await readDoc(DRAFT_KEY)) ?? (await readDoc(PUBLISHED_KEY)) ?? seedDoc()
}

export async function saveDraft(doc: LinksDoc): Promise<LinksDoc> {
  const next = {
    items: [...doc.items]
      .sort((a, b) => a.order - b.order)
      .map((item, i) => ({ ...item, order: i + 1 })),
    updatedAt: new Date().toISOString(),
  }
  const parsed = parseLinksDoc(next)
  if (!parsed) throw new Error('[links-store] invalid document')
  await writeRaw(DRAFT_KEY, parsed)
  return parsed
}

export async function publishDraft(): Promise<LinksDoc> {
  const draft = await getDraftLinks()
  const next = { ...draft, updatedAt: new Date().toISOString() }
  await writeRaw(PUBLISHED_KEY, next)
  try {
    revalidateTag(LINKS_TAG)
  } catch {
    // called outside a request scope (script/test) — the hourly revalidate still covers it
  }
  return next
}
