import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const CHROMELESS_ROUTES = new Set(['/links', '/admin'])

/** True for routes that render without the site Header/Footer (link-in-bio + back-office). */
export function isChromelessRoute(pathname: string | null | undefined): boolean {
  if (!pathname) return false
  const normalized = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname
  return CHROMELESS_ROUTES.has(normalized)
}
