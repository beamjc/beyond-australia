'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Article } from '@/types/article'
import Navbar from '@/components/shared/Navbar'
import Footer from '@/components/shared/Footer'
import ArticleCard from '@/components/articles/ArticleCard'
import { useLanguage } from '@/i18n/LanguageProvider'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Search } from 'lucide-react'

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [activeTag, setActiveTag] = useState<string | null>(null)
  const { language } = useLanguage()

  useEffect(() => {
    supabase
      .from('articles')
      .select('*')
      .eq('is_published', true)
      .order('published_at', { ascending: false })
      .then(({ data }) => {
        setArticles(data ?? [])
        setLoading(false)
      })
  }, [])

  const allTags = Array.from(new Set(articles.flatMap((a) => a.tags)))

  const filtered = articles.filter((a) => {
    const title = language === 'th' ? a.title_th : a.title_en
    const matchSearch = title.toLowerCase().includes(search.toLowerCase())
    const matchTag = !activeTag || a.tags.includes(activeTag)
    return matchSearch && matchTag
  })

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="container pt-28 pb-20 flex-1">
        <div className="max-w-2xl mx-auto mb-12 text-center">
          <h1 className="font-display font-bold text-4xl md:text-5xl mb-4">
            {language === 'th' ? 'บทความ' : 'Articles'}
          </h1>
          <p className="text-muted-foreground text-lg">
            {language === 'th'
              ? 'ข่าวสาร คำแนะนำ และข้อมูลเกี่ยวกับการไปออสเตรเลีย'
              : 'News, tips, and insights about going to Australia'}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-8 max-w-2xl mx-auto sm:max-w-none">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder={language === 'th' ? 'ค้นหาบทความ...' : 'Search articles...'}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          {allTags.length > 0 && (
            <div className="flex flex-wrap gap-2 items-center">
              <Badge variant={!activeTag ? 'default' : 'outline'} className="cursor-pointer select-none" onClick={() => setActiveTag(null)}>
                {language === 'th' ? 'ทั้งหมด' : 'All'}
              </Badge>
              {allTags.map((tag) => (
                <Badge key={tag} variant={activeTag === tag ? 'default' : 'outline'} className="cursor-pointer select-none" onClick={() => setActiveTag(activeTag === tag ? null : tag)}>
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => <div key={i} className="rounded-xl border border-border bg-card h-72 animate-pulse" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24 text-muted-foreground">
            {language === 'th' ? 'ไม่พบบทความ' : 'No articles found'}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((article) => <ArticleCard key={article.id} article={article} />)}
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}
