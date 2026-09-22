import { lazyDog } from '@/lib/fonts'

export default function LabLayout({ children }: { children: React.ReactNode }) {
  return <div className={lazyDog.variable}>{children}</div>
}
