'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Article } from '@/types/article'
import ArticleCard from './ArticleCard'
import { useLanguage } from '@/i18n/LanguageProvider'
import { ArrowRight } from 'lucide-react'

export default function LatestArticlesSection() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const { language } = useLanguage()

  useEffect(() => {
    supabase
      .from('articles')
      .select('*')
      .eq('is_published', true)
      .order('published_at', { ascending: false })
      .limit(3)
      .then(({ data, error }) => {
        if (error) console.error('LatestArticlesSection fetch error:', error)
        setArticles(data ?? [])
        setLoading(false)
      })
  }, [])

  if (!loading && articles.length === 0) return null

  return (
    <section id="articles" className="py-20 bg-muted/30">
      <div className="container">
        <div className="max-w-2xl mx-auto mb-10 text-center">
          <h2 className="font-display font-bold text-3xl md:text-4xl mb-2">
            {language === 'th' ? 'บทความล่าสุด' : 'Latest Articles'}
          </h2>
          <p className="text-muted-foreground">
            {language === 'th'
              ? 'ข่าวสารและคำแนะนำเกี่ยวกับการไปออสเตรเลีย'
              : 'News and tips about going to Australia'}
          </p>
          <Link
            href="/articles"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline mt-3"
          >
            {language === 'th' ? 'ดูทั้งหมด' : 'Show All'}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-xl border border-border bg-card h-72 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
