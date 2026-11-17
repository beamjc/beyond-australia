'use client'

import { useEffect, useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { LanguageProvider } from '@/i18n/LanguageProvider'
import ErrorBoundary from '@/components/ErrorBoundary'
import { rememberLeadSource } from '@/lib/leadDraft'
import { installLineLeadInterceptor } from '@/lib/lineLeadInterceptor'

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient())
  // LINE lead form: keep the visit's UTM/referrer (this tab only), and send tool
  // answers to the LIFF form from any @beyondstudy LINE link when LIFF is configured.
  useEffect(() => {
    rememberLeadSource()
    return installLineLeadInterceptor()
  }, [])
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <ErrorBoundary>
            {children}
          </ErrorBoundary>
        </TooltipProvider>
      </LanguageProvider>
    </QueryClientProvider>
  )
}
