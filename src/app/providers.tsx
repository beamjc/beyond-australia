'use client'

import { useEffect, useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { LanguageProvider } from '@/i18n/LanguageProvider'
import ErrorBoundary from '@/components/ErrorBoundary'
import { rememberLeadSource } from '@/lib/leadDraft'

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient())
  // Keeps the visit's UTM/referrer for the LINE lead form (stays in this tab only).
  useEffect(() => { rememberLeadSource() }, [])
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
