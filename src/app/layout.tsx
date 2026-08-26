import type { Metadata } from 'next'
import './globals.css'
import Providers from './providers'
import { anuphan } from '@/lib/fonts'

export const metadata: Metadata = {
  title: 'Beyond Australia — Working Holiday & Study Visa Guide',
  description: 'Thailand\'s trusted guide for Australian Working Holiday (WHM) and Student visas. Tools, checklists, and expert guidance for Thai nationals.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={anuphan.variable}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
