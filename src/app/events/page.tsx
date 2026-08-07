'use client'

import { useEffect, useState } from 'react'
import Navbar from '@/components/shared/Navbar'
import Footer from '@/components/shared/Footer'
import { useLanguage } from '@/i18n/LanguageProvider'
import { supabase } from '@/lib/supabase'
import { Event } from '@/types/event'
import { Calendar, MapPin, Monitor, Users } from 'lucide-react'
import { format } from 'date-fns'

const typeStyles = {
  online: { icon: Monitor, className: 'bg-accent/10 text-accent' },
  offline: { icon: MapPin, className: 'bg-primary/10 text-primary' },
  hybrid: { icon: Users, className: 'bg-secondary text-secondary-foreground' },
}

export default function EventsPage() {
  const { t, language } = useLanguage()
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('events')
      .select('*')
      .eq('is_published', true)
      .order('event_date', { ascending: true, nullsFirst: false })
      .then(({ data }) => {
        setEvents(data ?? [])
        setLoading(false)
      })
  }, [])

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="container pt-28 pb-20 flex-1">
        <div className="max-w-2xl mx-auto mb-12 text-center">
          <span className="text-sm font-semibold uppercase tracking-widest text-primary mb-2 block">
            {t('events.eyebrow')}
          </span>
          <h1 className="font-display font-bold text-4xl md:text-5xl mb-4">
            {t('events.title')}
          </h1>
          <p className="text-muted-foreground text-lg">
            {t('events.subtitle')}
          </p>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[1, 2, 3].map((i) => <div key={i} className="rounded-2xl border border-border bg-card h-48 animate-pulse" />)}
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-24 text-muted-foreground">
            {language === 'th' ? 'ยังไม่มีกิจกรรม' : 'No events yet'}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {events.map((event) => {
              const typeInfo = typeStyles[event.event_type]
              const title = language === 'th' ? event.title_th : event.title_en
              const location = (language === 'th' ? event.location_th : event.location_en) ?? ''
              const description = (language === 'th' ? event.description_th : event.description_en) ?? ''
              const typeLabel = t(`events.typeLabels.${event.event_type}` as const)
              const date = event.is_ongoing
                ? (language === 'th' ? 'ต่อเนื่อง' : 'Ongoing')
                : event.event_date
                  ? format(new Date(event.event_date), 'MMM d, yyyy')
                  : ''
              return (
                <div
                  key={event.id}
                  className="rounded-2xl border border-border bg-card p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      {date}
                    </div>
                    <span className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${typeInfo.className}`}>
                      <typeInfo.icon className="w-3 h-3" />
                      {typeLabel}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-2">{title}</h3>
                  {description && <p className="text-sm text-muted-foreground leading-relaxed mb-3">{description}</p>}
                  {location && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="w-3 h-3" />
                      {location}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}
