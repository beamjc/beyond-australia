'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { EventType } from '@/types/event'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ArrowLeft, Loader2, Save, CheckCircle } from 'lucide-react'

type FormState = {
  title_en: string; title_th: string
  description_en: string; description_th: string
  location_en: string; location_th: string
  event_type: EventType
  event_date: string
  is_ongoing: boolean
  is_published: boolean
}

const defaultForm: FormState = {
  title_en: '', title_th: '', description_en: '', description_th: '',
  location_en: '', location_th: '', event_type: 'offline',
  event_date: '', is_ongoing: false, is_published: false,
}

export default function AdminEventEdit() {
  const params = useParams()
  const id = params.id as string
  const isNew = id === 'new'
  const router = useRouter()

  const [authChecked, setAuthChecked] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [activeTab, setActiveTab] = useState<'en' | 'th'>('en')
  const [form, setForm] = useState<FormState>(defaultForm)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) { router.push('/admin/login'); return }
      setAuthChecked(true)
      if (!isNew) {
        supabase.from('events').select('*').eq('id', id).single().then(({ data }) => {
          if (data) setForm({
            title_en: data.title_en, title_th: data.title_th,
            description_en: data.description_en ?? '', description_th: data.description_th ?? '',
            location_en: data.location_en ?? '', location_th: data.location_th ?? '',
            event_type: data.event_type,
            event_date: data.event_date ? data.event_date.slice(0, 16) : '',
            is_ongoing: data.is_ongoing, is_published: data.is_published,
          })
        })
      }
    })
  }, [id, isNew, router])

  const set = (key: keyof FormState) => (val: string | boolean) =>
    setForm((f) => ({ ...f, [key]: val }))

  const handleSave = async (forcePublish?: boolean) => {
    setSaving(true)
    const isPublished = forcePublish !== undefined ? forcePublish : form.is_published
    const payload = {
      title_en: form.title_en, title_th: form.title_th,
      description_en: form.description_en || null, description_th: form.description_th || null,
      location_en: form.location_en || null, location_th: form.location_th || null,
      event_type: form.event_type,
      event_date: form.is_ongoing || !form.event_date ? null : new Date(form.event_date).toISOString(),
      is_ongoing: form.is_ongoing,
      is_published: isPublished,
      ...(forcePublish && !form.is_published ? { published_at: new Date().toISOString() } : {}),
    }
    if (isNew) {
      const { data, error } = await supabase.from('events').insert(payload).select().single()
      if (!error && data) router.replace(`/admin/events/${data.id}`)
    } else {
      await supabase.from('events').update(payload).eq('id', id)
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
              <Link href="/admin/events"><ArrowLeft className="w-4 h-4 mr-1" /> Events</Link>
            </Button>
            <span className="text-muted-foreground hidden sm:block">|</span>
            <span className="font-medium text-sm truncate hidden sm:block">{isNew ? 'New Event' : (form.title_en || 'Edit Event')}</span>
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
                  <Input value={form.title_en} onChange={(e) => set('title_en')(e.target.value)} placeholder="Event title in English" className="text-base" />
                </div>
                <div className="space-y-1.5">
                  <Label>Description (English)</Label>
                  <Textarea value={form.description_en} onChange={(e) => set('description_en')(e.target.value)} placeholder="Short description shown on the events page..." rows={4} />
                </div>
                <div className="space-y-1.5">
                  <Label>Location (English)</Label>
                  <Input value={form.location_en} onChange={(e) => set('location_en')(e.target.value)} placeholder="e.g. Online (Zoom), Bangkok, Thailand" />
                </div>
              </div>
            ) : (
              <div className="space-y-5">
                <div className="space-y-1.5">
                  <Label>หัวข้อ (ภาษาไทย) <span className="text-destructive">*</span></Label>
                  <Input value={form.title_th} onChange={(e) => set('title_th')(e.target.value)} placeholder="หัวข้อกิจกรรมภาษาไทย" className="text-base" />
                </div>
                <div className="space-y-1.5">
                  <Label>รายละเอียด (ภาษาไทย)</Label>
                  <Textarea value={form.description_th} onChange={(e) => set('description_th')(e.target.value)} placeholder="รายละเอียดสั้นๆ ที่แสดงบนหน้ากิจกรรม..." rows={4} />
                </div>
                <div className="space-y-1.5">
                  <Label>สถานที่ (ภาษาไทย)</Label>
                  <Input value={form.location_th} onChange={(e) => set('location_th')(e.target.value)} placeholder="เช่น ออนไลน์ (Zoom), กรุงเทพฯ" />
                </div>
              </div>
            )}
          </div>
          <div className="space-y-5">
            <div className="rounded-xl border border-border p-5 space-y-4">
              <h3 className="font-medium text-sm">Settings</h3>
              <div className="space-y-1.5">
                <Label>Event Type</Label>
                <Select value={form.event_type} onValueChange={(v) => set('event_type')(v as EventType)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="online">Online</SelectItem>
                    <SelectItem value="offline">In Person</SelectItem>
                    <SelectItem value="hybrid">Hybrid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between pt-1">
                <div>
                  <Label htmlFor="ongoing" className="cursor-pointer">Ongoing</Label>
                  <p className="text-xs text-muted-foreground">Show "Ongoing" instead of a fixed date</p>
                </div>
                <Switch id="ongoing" checked={form.is_ongoing} onCheckedChange={(val) => set('is_ongoing')(val)} />
              </div>
              {!form.is_ongoing && (
                <div className="space-y-1.5">
                  <Label>Date &amp; Time</Label>
                  <Input type="datetime-local" value={form.event_date} onChange={(e) => set('event_date')(e.target.value)} />
                </div>
              )}
              <div className="flex items-center justify-between pt-1">
                <div>
                  <Label htmlFor="published" className="cursor-pointer">Published</Label>
                  <p className="text-xs text-muted-foreground">Visible to the public</p>
                </div>
                <Switch id="published" checked={form.is_published} onCheckedChange={(val) => set('is_published')(val)} />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
