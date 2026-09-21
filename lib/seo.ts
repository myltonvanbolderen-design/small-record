import type { Metadata } from 'next'

export const SITE_URL = 'https://small-records.com'

type OgImage = { url: string; width: number; height: number; alt: string }

export function pageMetadata(opts: {
  title: string | { absolute: string }
  ogTitle: string
  description: string
  path: string
  image: OgImage
}): Metadata {
  const { title, ogTitle, description, path, image } = opts

  return {
    title,
    description,
    alternates: {
      canonical: path,
    },
    openGraph: {
      title: ogTitle,
      description,
      url: path,
      siteName: 'Small Records',
      locale: 'en_US',
      type: 'website',
      images: [image],
    },
    twitter: {
      card: 'summary_large_image',
      title: ogTitle,
      description,
      images: [image.url],
    },
  }
}
