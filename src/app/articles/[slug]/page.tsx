'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Article } from '@/types/article'
import Navbar from '@/components/shared/Navbar'
import Footer from '@/components/shared/Footer'
import { useLanguage } from '@/i18n/LanguageProvider'
import { Badge } from '@/components/ui/badge'
import { Calendar, ArrowLeft } from 'lucide-react'
import { format } from 'date-fns'

export default function ArticlePage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string
  const [article, setArticle] = useState<Article | null>(null)
  const [loading, setLoading] = useState(true)
  const { language } = useLanguage()

  useEffect(() => {
    supabase
      .from('articles')
      .select('*')
      .eq('slug', slug)
      .eq('is_published', true)
      .single()
      .then(({ data }) => {
        setArticle(data)
        setLoading(false)
      })
  }, [slug])

  if (loading) return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="container pt-28 pb-20 max-w-3xl mx-auto flex-1">
        <div className="h-8 bg-muted rounded animate-pulse mb-4 w-3/4" />
        <div className="space-y-3 mt-8">
          {[1, 2, 3, 4, 5].map((i) => <div key={i} className="h-4 bg-muted rounded animate-pulse" style={{ width: `${70 + i * 5}%` }} />)}
        </div>
      </main>
      <Footer />
    </div>
  )

  if (!article) return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="container pt-28 pb-20 text-center flex-1">
        <p className="text-muted-foreground text-lg mb-4">Article not found.</p>
        <button onClick={() => router.back()} className="text-primary hover:underline inline-flex items-center gap-1.5">
          <ArrowLeft className="w-4 h-4" /> Back to Articles
        </button>
      </main>
      <Footer />
    </div>
  )

  const title = language === 'th' ? article.title_th : article.title_en
  const content = language === 'th' ? article.content_th : article.content_en

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="container pt-28 pb-20 flex-1">
        <div className="max-w-3xl mx-auto">
          <button onClick={() => router.back()} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" />
            {language === 'th' ? 'กลับไปบทความ' : 'Back to Articles'}
          </button>
          {article.cover_image_url && (
            <div className="aspect-video overflow-hidden rounded-xl mb-8">
              <img src={article.cover_image_url} alt={title} className="w-full h-full object-cover" />
            </div>
          )}
          {article.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {article.tags.map((tag) => <Badge key={tag} variant="secondary">{tag}</Badge>)}
            </div>
          )}
          <h1 className="font-display font-bold text-3xl md:text-4xl leading-tight mb-4">{title}</h1>
          {article.published_at && (
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-10 pb-8 border-b border-border">
              <Calendar className="w-4 h-4" />
              {format(new Date(article.published_at), 'MMMM d, yyyy')}
            </div>
          )}
          <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: content ?? '' }} />
        </div>
      </main>
      <Footer />
    </div>
  )
}
