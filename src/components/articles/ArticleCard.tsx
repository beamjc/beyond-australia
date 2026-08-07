'use client'

import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Calendar } from 'lucide-react'
import { format } from 'date-fns'
import { Article } from '@/types/article'
import { useLanguage } from '@/i18n/LanguageProvider'

const ArticleCard = ({ article }: { article: Article }) => {
  const { language } = useLanguage()
  const title = language === 'th' ? article.title_th : article.title_en
  const excerpt = language === 'th' ? article.excerpt_th : article.excerpt_en

  return (
    <Link href={`/articles/${article.slug}`} className="group block h-full">
      <div className="h-full rounded-xl overflow-hidden border border-border bg-card hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5">
        {article.cover_image_url && (
          <div className="aspect-video overflow-hidden">
            <img src={article.cover_image_url} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
          </div>
        )}
        <div className="p-5">
          {article.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {article.tags.slice(0, 3).map((tag) => <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>)}
            </div>
          )}
          <h3 className="font-display font-semibold text-lg leading-snug mb-2 line-clamp-2 group-hover:text-primary transition-colors">{title}</h3>
          {excerpt && <p className="text-sm text-muted-foreground line-clamp-3 mb-4">{excerpt}</p>}
          {article.published_at && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Calendar className="w-3.5 h-3.5" />
              {format(new Date(article.published_at), 'MMM d, yyyy')}
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}

export default ArticleCard
