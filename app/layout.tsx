import type { Metadata } from 'next'
import { playfair, bebas, dmSans } from '@/lib/fonts'
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
      <body>{children}</body>
    </html>
  )
}
