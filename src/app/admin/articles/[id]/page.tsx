'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import RichTextEditor from '@/components/admin/RichTextEditor'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeft, Loader2, Save, Upload, X, CheckCircle } from 'lucide-react'

const slugify = (str: string) =>
  str.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim()

type FormState = {
  title_en: string; title_th: string; slug: string
  excerpt_en: string; excerpt_th: string
  content_en: string; content_th: string
  cover_image_url: string; tags: string; is_published: boolean
}

const defaultForm: FormState = {
  title_en: '', title_th: '', slug: '', excerpt_en: '', excerpt_th: '',
  content_en: '', content_th: '', cover_image_url: '', tags: '', is_published: false,
}

export default function AdminArticleEdit() {
  const params = useParams()
  const id = params.id as string
  const isNew = id === 'new'
  const router = useRouter()

  const [authChecked, setAuthChecked] = useState(false)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [activeTab, setActiveTab] = useState<'en' | 'th'>('en')
  const [form, setForm] = useState<FormState>(defaultForm)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) { router.push('/admin/login'); return }
      setAuthChecked(true)
      if (!isNew) {
        supabase.from('articles').select('*').eq('id', id).single().then(({ data }) => {
          if (data) setForm({
            title_en: data.title_en, title_th: data.title_th, slug: data.slug,
            excerpt_en: data.excerpt_en ?? '', excerpt_th: data.excerpt_th ?? '',
            content_en: data.content_en ?? '', content_th: data.content_th ?? '',
            cover_image_url: data.cover_image_url ?? '',
            tags: data.tags.join(', '), is_published: data.is_published,
          })
        })
      }
    })
  }, [id, isNew, router])

  const set = (key: keyof FormState) => (val: string | boolean) =>
    setForm((f) => ({ ...f, [key]: val }))

  const handleTitleEn = (val: string) =>
    setForm((f) => ({ ...f, title_en: val, slug: isNew ? slugify(val) : f.slug }))

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const path = `covers/${Date.now()}.${file.name.split('.').pop()}`
    const { error } = await supabase.storage.from('article-images').upload(path, file)
    if (!error) {
      const { data } = supabase.storage.from('article-images').getPublicUrl(path)
      set('cover_image_url')(data.publicUrl)
    }
    setUploading(false)
  }

  const handleSave = async (forcePublish?: boolean) => {
    setSaving(true)
    const isPublished = forcePublish !== undefined ? forcePublish : form.is_published
    const payload = {
      title_en: form.title_en, title_th: form.title_th,
      slug: form.slug || slugify(form.title_en),
      excerpt_en: form.excerpt_en || null, excerpt_th: form.excerpt_th || null,
      content_en: form.content_en || null, content_th: form.content_th || null,
      cover_image_url: form.cover_image_url || null,
      tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
      is_published: isPublished,
      ...(forcePublish && !form.is_published ? { published_at: new Date().toISOString() } : {}),
    }
    if (isNew) {
      const { data, error } = await supabase.from('articles').insert(payload).select().single()
      if (!error && data) router.replace(`/admin/articles/${data.id}`)
    } else {
      await supabase.from('articles').update(payload).eq('id', id)
    }
    setSaving(false)
    setForm((f) => ({ ...f, is_published: isPublished }))
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
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
          <div className="flex items-center gap-3 min-w-0">
            <Button variant="ghost" size="sm" asChild className="shrink-0">
              <Link href="/admin"><ArrowLeft className="w-4 h-4 mr-1" /> Articles</Link>
            </Button>
            <span className="text-muted-foreground hidden sm:block">|</span>
            <span className="font-medium text-sm truncate hidden sm:block">{isNew ? 'New Article' : (form.title_en || 'Edit Article')}</span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {saved && <span className="text-xs text-emerald-600 flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5" /> Saved</span>}
            <Button variant="outline" size="sm" onClick={() => handleSave()} disabled={saving}>
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4 mr-1.5" />}
              Save Draft
            </Button>
            <Button size="sm" onClick={() => handleSave(true)} disabled={saving}>
              {form.is_published ? 'Update' : 'Publish'}
            </Button>
          </div>
        </div>
      </header>
      <main className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="lg:col-span-2 space-y-6">
            <div className="flex gap-0 border-b border-border">
              {(['en', 'th'] as const).map((lang) => (
                <button key={lang} type="button" onClick={() => setActiveTab(lang)}
                  className={`px-5 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px ${activeTab === lang ? 'border-primary text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'}`}>
                  {lang === 'en' ? 'English' : 'Thai / ภาษาไทย'}
                </button>
              ))}
            </div>
            {activeTab === 'en' ? (
              <div className="space-y-5">
                <div className="space-y-1.5">
                  <Label>Title (English) <span className="text-destructive">*</span></Label>
                  <Input value={form.title_en} onChange={(e) => handleTitleEn(e.target.value)} placeholder="Article title in English" className="text-base" />
                </div>
                <div className="space-y-1.5">
                  <Label>Excerpt (English)</Label>
                  <Textarea value={form.excerpt_en} onChange={(e) => set('excerpt_en')(e.target.value)} placeholder="Short summary shown on listing page..." rows={3} />
                </div>
                <div className="space-y-1.5">
                  <Label>Content (English)</Label>
                  <RichTextEditor content={form.content_en} onChange={set('content_en') as (v: string) => void} placeholder="Write the article content in English..." />
                </div>
              </div>
            ) : (
              <div className="space-y-5">
                <div className="space-y-1.5">
                  <Label>หัวข้อ (ภาษาไทย) <span className="text-destructive">*</span></Label>
                  <Input value={form.title_th} onChange={(e) => set('title_th')(e.target.value)} placeholder="หัวข้อบทความภาษาไทย" className="text-base" />
                </div>
                <div className="space-y-1.5">
                  <Label>บทสรุป (ภาษาไทย)</Label>
                  <Textarea value={form.excerpt_th} onChange={(e) => set('excerpt_th')(e.target.value)} placeholder="สรุปสั้นๆ ที่แสดงบนหน้ารายการบทความ..." rows={3} />
                </div>
                <div className="space-y-1.5">
                  <Label>เนื้อหา (ภาษาไทย)</Label>
                  <RichTextEditor content={form.content_th} onChange={set('content_th') as (v: string) => void} placeholder="เขียนเนื้อหาบทความภาษาไทย..." />
                </div>
              </div>
            )}
          </div>
          <div className="space-y-5">
            <div className="rounded-xl border border-border p-5 space-y-4">
              <h3 className="font-medium text-sm">Settings</h3>
              <div className="space-y-1.5">
                <Label>URL Slug</Label>
                <Input value={form.slug} onChange={(e) => set('slug')(e.target.value)} placeholder="article-url-slug" className="font-mono text-sm" />
                <p className="text-xs text-muted-foreground">/articles/{form.slug || 'slug'}</p>
              </div>
              <div className="space-y-1.5">
                <Label>Tags <span className="text-muted-foreground font-normal">(comma separated)</span></Label>
                <Input value={form.tags} onChange={(e) => set('tags')(e.target.value)} placeholder="WHM, Student Visa, Events" />
              </div>
              <div className="flex items-center justify-between pt-1">
                <div>
                  <Label htmlFor="published" className="cursor-pointer">Published</Label>
                  <p className="text-xs text-muted-foreground">Visible to the public</p>
                </div>
                <Switch id="published" checked={form.is_published} onCheckedChange={(val) => set('is_published')(val)} />
              </div>
            </div>
            <div className="rounded-xl border border-border p-5 space-y-4">
              <h3 className="font-medium text-sm">Cover Image</h3>
              {form.cover_image_url ? (
                <div className="relative group">
                  <img src={form.cover_image_url} alt="Cover" className="w-full aspect-video object-cover rounded-lg" />
                  <button type="button" onClick={() => set('cover_image_url')('')}
                    className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center border-2 border-dashed border-border rounded-lg p-8 cursor-pointer hover:bg-muted/30 transition-colors">
                  {uploading ? <Loader2 className="w-6 h-6 animate-spin text-muted-foreground mb-2" /> : <Upload className="w-6 h-6 text-muted-foreground mb-2" />}
                  <span className="text-sm text-muted-foreground">{uploading ? 'Uploading...' : 'Click to upload'}</span>
                  <span className="text-xs text-muted-foreground mt-1">JPG, PNG, WebP</span>
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
                </label>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
