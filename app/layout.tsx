import type { Metadata } from 'next'
import { playfair, bebas, dmSans } from '@/lib/fonts'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { ScrollToTop } from '@/components/layout/ScrollToTop'
import { Providers } from './providers'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://small-records.com'),
  title: {
    default: 'Small Records',
    template: '%s | Small Records',
  },
  description: 'Independent music label. House, Techno, Baile Funk, Afrohouse. Paris.',
  openGraph: {
    title: 'Small Records',
    description:
      'Small Records is a Paris DJ crew and independent label: DJ Casae & DJ Letche. House, techno, baile funk, afrohouse, disco. Open for club and festival booking.',
    url: '/',
    siteName: 'Small Records',
    images: [{ url: '/og-image.jpg', width: 1200, height: 800 }],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Small Records',
    description:
      'Small Records is a Paris DJ crew and independent label: DJ Casae & DJ Letche. House, techno, baile funk, afrohouse, disco. Open for club and festival booking.',
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
      lang="en"
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
              url: 'https://small-records.com/',
              logo: 'https://small-records.com/images/logo/logo-wordmark-black.png',
              image: 'https://small-records.com/og-image.jpg',
              email: 'contact@small-records.com',
              genre: ['House', 'Techno', 'Baile Funk', 'Afrohouse', 'Disco', 'Ambient'],
              foundingLocation: { '@type': 'Place', name: 'Paris, France' },
              member: [
                {
                  '@type': 'Person',
                  name: 'Casae',
                  url: 'https://small-records.com/casae/',
                  sameAs: ['https://soundcloud.com/casae'],
                },
                {
                  '@type': 'Person',
                  name: 'Letche',
                  url: 'https://small-records.com/letche/',
                  sameAs: ['https://soundcloud.com/letchetony'],
                },
              ],
              sameAs: [
                'https://www.instagram.com/smallmusics',
                'https://soundcloud.com/casae',
                'https://soundcloud.com/letchetony',
                'https://linktr.ee/smallrecords_music',
                'https://www.youtube.com/@SmallRecords_Music',
              ],
            }),
          }}
        />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] rounded bg-terracotta px-4 py-2 font-condensed text-sm text-blanc"
        >
          Skip to content
        </a>
        <Providers>
          <ScrollToTop />
          <Header />
          <div id="main">
            {children}
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  )
}
