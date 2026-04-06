import type { Metadata } from 'next'
import { playfair, bebas, dmSans } from '@/lib/fonts'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { ScrollToTop } from '@/components/layout/ScrollToTop'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'Small Records',
    template: '%s | Small Records',
  },
  description: 'Independent music label. House, Techno, Baile Funk, Afrohouse. Paris.',
  openGraph: {
    title: 'Small Records',
    description: 'Independent music label. House, Techno, Baile Funk, Afrohouse. Paris.',
    url: 'https://smallrecords.com',
    siteName: 'Small Records',
    images: [{ url: '/og-image.jpg', width: 1200, height: 800 }],
    locale: 'fr_FR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Small Records',
    description: 'Independent music label. House, Techno, Baile Funk, Afrohouse. Paris.',
    images: ['/og-image.jpg'],
  },
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'MusicGroup',
              name: 'Small Records',
              description: 'Independent music label. House, Techno, Baile Funk, Afrohouse.',
              url: 'https://smallrecords.com',
              genre: ['House', 'Techno', 'Baile Funk', 'Afrohouse', 'Disco', 'Ambient'],
              foundingLocation: { '@type': 'Place', name: 'Paris, France' },
              member: [
                { '@type': 'Person', name: 'Casae', url: 'https://soundcloud.com/casae' },
                { '@type': 'Person', name: 'Letche', url: 'https://soundcloud.com/letchetony' },
              ],
              sameAs: [
                'https://www.instagram.com/smallmusics',
                'https://soundcloud.com/casae',
                'https://soundcloud.com/letchetony',
                'https://linktr.ee/smallrecords_music',
              ],
            }),
          }}
        />
        <a
          href="#main"
          className="sr-only focus:not-sr-only fixed left-4 top-4 z-[100] rounded bg-terracotta px-4 py-2 font-condensed text-sm text-blanc focus:outline-none"
        >
          Skip to content
        </a>
        <ScrollToTop />
        <Header />
        <div id="main">
          {children}
          <Footer />
        </div>
      </body>
    </html>
  )
}
