import type { Metadata } from 'next'
import { isAuthenticated } from '@/lib/admin-auth'
import { LoginForm } from '@/components/admin/LoginForm'
import { LinksEditor } from '@/components/admin/LinksEditor'
import { getDraftLinks, getPublishedLinks } from '@/lib/links-store'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Back-office',
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
}

export default async function AdminPage() {
  const authed = await isAuthenticated()

  if (!authed) {
    return (
      <main id="main-content" tabIndex={-1} className="min-h-screen bg-noir text-blanc outline-none">
        <LoginForm />
      </main>
    )
  }

  const [draft, published] = await Promise.all([getDraftLinks(), getPublishedLinks()])

  return (
    <main id="main-content" tabIndex={-1} className="min-h-screen bg-noir text-blanc outline-none">
      <LinksEditor items={draft.items} draftUpdatedAt={draft.updatedAt} publishedAt={published.updatedAt} />
    </main>
  )
}
