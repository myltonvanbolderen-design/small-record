import type { Metadata } from 'next'
import { isAuthenticated } from '@/lib/admin-auth'
import { LoginForm } from '@/components/admin/LoginForm'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Back-office',
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
}

export default async function AdminPage() {
  const authed = await isAuthenticated()

  return (
    <main id="main-content" tabIndex={-1} className="min-h-screen bg-noir text-blanc outline-none">
      {authed ? <p>Éditeur à venir.</p> : <LoginForm />}
    </main>
  )
}
