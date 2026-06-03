import { Playfair_Display, Bebas_Neue, DM_Sans } from 'next/font/google'
import localFont from 'next/font/local'

export const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

export const bebas = Bebas_Neue({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-bebas',
  display: 'swap',
})

export const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
})

export const petitCochon = localFont({
  src: '../public/fonts/petit-cochon.otf',
  variable: '--font-petit-cochon',
  display: 'swap',
})

export const lazyDog = localFont({
  src: '../public/fonts/lazy-dog.ttf',
  variable: '--font-lazy-dog',
  display: 'swap',
})
