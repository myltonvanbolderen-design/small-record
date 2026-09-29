/**
 * Server-only. Password check, signed session cookie, and login rate limit for `/admin`.
 *
 * Never import this from a `'use client'` file — `ADMIN_PASSWORD` / `ADMIN_SESSION_SECRET` must
 * never reach a client bundle.
 */
import { createHash, createHmac, timingSafeEqual } from 'node:crypto'
import { cookies, headers } from 'next/headers'

export const ADMIN_COOKIE = 'sr_admin'
const MAX_AGE_S = 30 * 24 * 60 * 60
const RATE_LIMIT_MAX_ATTEMPTS = 10
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000
const RATE_LIMIT_MAX_KEYS = 500

function sha256(s: string): Buffer {
  return createHash('sha256').update(s, 'utf8').digest()
}

function safeEqual(a: string, b: string): boolean {
  return timingSafeEqual(sha256(a), sha256(b))
}

export function adminConfigured(): boolean {
  return typeof process.env.ADMIN_PASSWORD === 'string' && process.env.ADMIN_PASSWORD.length > 0
}

function sessionSecret(): Buffer {
  const explicit = process.env.ADMIN_SESSION_SECRET
  if (typeof explicit === 'string' && explicit.length > 0) return Buffer.from(explicit, 'utf8')
  return sha256('sr-admin-session:v1:' + process.env.ADMIN_PASSWORD)
}

export function checkPassword(input: string): boolean {
  return adminConfigured() && safeEqual(input, process.env.ADMIN_PASSWORD!)
}

export function createSessionValue(now: number = Date.now()): string {
  const expiry = now + MAX_AGE_S * 1000
  const hmac = createHmac('sha256', sessionSecret()).update(String(expiry)).digest('hex')
  return `${expiry}.${hmac}`
}

export function verifySessionValue(value: string | undefined): boolean {
  if (!adminConfigured()) return false
  if (!value) return false
  const i = value.indexOf('.')
  if (i <= 0 || i === value.length - 1) return false
  const part0 = value.slice(0, i)
  const part1 = value.slice(i + 1)
  if (!part0 || !part1) return false
  const expiry = Number(part0)
  if (!Number.isSafeInteger(expiry) || expiry <= Date.now()) return false
  const expectedHmacHex = createHmac('sha256', sessionSecret()).update(part0).digest('hex')
  return safeEqual(part1, expectedHmacHex)
}

export async function isAuthenticated(): Promise<boolean> {
  const jar = await cookies()
  return verifySessionValue(jar.get(ADMIN_COOKIE)?.value)
}

const COOKIE_ATTRS = {
  httpOnly: true as const,
  sameSite: 'lax' as const,
  path: '/admin',
  secure: process.env.NODE_ENV === 'production',
}

export async function setSessionCookie(): Promise<void> {
  const jar = await cookies()
  jar.set(ADMIN_COOKIE, createSessionValue(), { ...COOKIE_ATTRS, maxAge: MAX_AGE_S })
}

export async function clearSessionCookie(): Promise<void> {
  const jar = await cookies()
  jar.delete({ name: ADMIN_COOKIE, path: COOKIE_ATTRS.path })
}

interface RateLimitEntry {
  count: number
  resetAt: number
}

const attempts = new Map<string, RateLimitEntry>()

async function clientIp(): Promise<string> {
  const h = await headers()
  return h.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
}

function pruneExpired(now: number): void {
  for (const [key, entry] of attempts) {
    if (entry.resetAt < now) attempts.delete(key)
  }
  if (attempts.size > RATE_LIMIT_MAX_KEYS) {
    let oldestKey: string | null = null
    let oldestResetAt = Infinity
    for (const [key, entry] of attempts) {
      if (entry.resetAt < oldestResetAt) {
        oldestResetAt = entry.resetAt
        oldestKey = key
      }
    }
    if (oldestKey !== null) attempts.delete(oldestKey)
  }
}

export async function rateLimitLogin(): Promise<{ ok: true } | { ok: false; minutes: number }> {
  const ip = await clientIp()
  const now = Date.now()
  pruneExpired(now)

  const entry = attempts.get(ip)
  if (!entry || entry.resetAt < now) {
    attempts.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS })
    return { ok: true }
  }

  if (entry.count >= RATE_LIMIT_MAX_ATTEMPTS) {
    return { ok: false, minutes: Math.max(1, Math.ceil((entry.resetAt - now) / 60000)) }
  }

  entry.count += 1
  return { ok: true }
}

export async function clearLoginAttempts(): Promise<void> {
  const ip = await clientIp()
  attempts.delete(ip)
}
