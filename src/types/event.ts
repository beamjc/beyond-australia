export type EventType = 'online' | 'offline' | 'hybrid'

export interface Event {
  id: string
  title_en: string
  title_th: string
  description_en: string | null
  description_th: string | null
  location_en: string | null
  location_th: string | null
  event_type: EventType
  event_date: string | null
  is_ongoing: boolean
  is_published: boolean
  published_at: string | null
  created_at: string
  updated_at: string
}
