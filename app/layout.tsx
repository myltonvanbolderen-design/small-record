import type { Metadata } from 'next'
import { playfair, bebas, dmSans } from '@/lib/fonts'
import { Header } from '@/components/layout/Header'
import './globals.css'

export const metadata: Metadata = {
  title: 'Small Record',
  description: 'House, Techno, Baile Funk, Afrohouse. Paris.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="fr"
      className={`${playfair.variable} ${bebas.variable} ${dmSans.variable}`}
    >
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only fixed left-4 top-4 z-[100] rounded bg-terracotta px-4 py-2 font-condensed text-sm text-blanc focus:outline-none"
        >
          Skip to content
        </a>
        <Header />
        <div id="main">
          {children}
        </div>
      </body>
    </html>
  )
}
