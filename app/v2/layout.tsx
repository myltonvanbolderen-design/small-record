import { petitCochon, lazyDog } from '@/lib/fonts'

export default function V2Layout({ children }: { children: React.ReactNode }) {
  return <div className={`${petitCochon.variable} ${lazyDog.variable}`}>{children}</div>
}
