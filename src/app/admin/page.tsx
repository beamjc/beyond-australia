'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Article } from '@/types/article'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Plus, Pencil, Trash2, LogOut, Globe, Loader2, ExternalLink } from 'lucide-react'
import { format } from 'date-fns'

export default function AdminDashboard() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [authChecked, setAuthChecked] = useState(false)
  const router = useRouter()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) { router.push('/admin/login'); return }
      setAuthChecked(true)
      supabase.from('articles').select('*').order('created_at', { ascending: false })
        .then(({ data }) => { setArticles(data ?? []); setLoading(false) })
    })
  }, [router])

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return
    await supabase.from('articles').delete().eq('id', id)
    setArticles((prev) => prev.filter((a) => a.id !== id))
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  if (!authChecked) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <Loader2 className="w-6 h-6 animate-spin text-primary" />
    </div>
  )

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-background/80 backdrop-blur-lg sticky top-0 z-40">
        <div className="container h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 font-display font-bold text-base">
              <Globe className="w-5 h-5 text-primary" />
              Beyond Australia — Admin
            </div>
            <nav className="flex items-center gap-1">
              <Link href="/admin" className="px-3 py-1.5 rounded-md text-sm font-medium bg-muted text-foreground">
                Articles
              </Link>
              <Link href="/admin/events" className="px-3 py-1.5 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors">
                Events
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <a href="/" target="_blank" className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5">
              View site <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-1.5" /> Sign out
            </Button>
          </div>
        </div>
      </header>
      <main className="container py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display font-bold text-3xl">Articles</h1>
            <p className="text-sm text-muted-foreground mt-1">{articles.length} total</p>
          </div>
          <Button asChild>
            <Link href="/admin/articles/new"><Plus className="w-4 h-4 mr-1.5" /> New Article</Link>
          </Button>
        </div>
        {loading ? (
          <div className="space-y-3">{[1, 2, 3].map((i) => <div key={i} className="h-16 bg-muted rounded-lg animate-pulse" />)}</div>
        ) : articles.length === 0 ? (
          <div className="text-center py-24 border border-dashed border-border rounded-xl text-muted-foreground">
            <p className="mb-4">No articles yet.</p>
            <Button asChild variant="outline">
              <Link href="/admin/articles/new"><Plus className="w-4 h-4 mr-1.5" /> Create your first article</Link>
            </Button>
          </div>
        ) : (
          <div className="rounded-xl border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30 text-muted-foreground">
                  <th className="text-left px-4 py-3 font-medium">Title</th>
                  <th className="text-left px-4 py-3 font-medium hidden md:table-cell">Tags</th>
                  <th className="text-left px-4 py-3 font-medium hidden sm:table-cell">Status</th>
                  <th className="text-left px-4 py-3 font-medium hidden lg:table-cell">Created</th>
                  <th className="px-4 py-3 w-24" />
                </tr>
              </thead>
              <tbody>
                {articles.map((article) => (
                  <tr key={article.id} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-medium leading-snug">{article.title_en}</div>
                      {article.title_th && <div className="text-xs text-muted-foreground mt-0.5">{article.title_th}</div>}
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <div className="flex gap-1 flex-wrap">
                        {article.tags.slice(0, 2).map((tag) => <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>)}
                        {article.tags.length > 2 && <span className="text-xs text-muted-foreground">+{article.tags.length - 2}</span>}
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <Badge variant={article.is_published ? 'default' : 'outline'}>
                        {article.is_published ? 'Published' : 'Draft'}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground hidden lg:table-cell">
                      {format(new Date(article.created_at), 'MMM d, yyyy')}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/admin/articles/${article.id}`}><Pencil className="w-4 h-4" /></Link>
                        </Button>
                        <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => handleDelete(article.id, article.title_en)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  )
}
