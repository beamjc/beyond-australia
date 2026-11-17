import type { Metadata } from 'next'
import LiffLeadForm from '@/components/line/LiffLeadForm'

// LIFF endpoint: set this page's URL (https://<site>/line) as the LIFF app's
// endpoint URL in LINE Developers. Opened inside LINE, not linked from the site.
export const metadata: Metadata = {
  title: 'Beyond Study Center — LINE',
  robots: { index: false, follow: false },
}

export default function LinePage() {
  return <LiffLeadForm />
}
