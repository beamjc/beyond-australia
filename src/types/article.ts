export interface Article {
  id: string
  slug: string
  title_en: string
  title_th: string
  content_en: string | null
  content_th: string | null
  excerpt_en: string | null
  excerpt_th: string | null
  cover_image_url: string | null
  tags: string[]
  is_published: boolean
  published_at: string | null
  created_at: string
  updated_at: string
}
