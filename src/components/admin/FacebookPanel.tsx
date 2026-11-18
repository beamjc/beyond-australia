'use client'

// Admin: connect the Facebook Page and sync posts into Articles.
// Posts with #BeyondBlog are published automatically; others arrive as drafts.
// Admin UI is English only, like the rest of /admin.

import { useCallback, useEffect, useState } from 'react'
import Script from 'next/script'
import { format } from 'date-fns'
import { Facebook, Loader2, RefreshCw, Unplug } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'

const APP_ID = process.env.NEXT_PUBLIC_FACEBOOK_APP_ID ?? ''
// Facebook Login for Business uses a configuration ID instead of scopes.
const LOGIN_CONFIG_ID = process.env.NEXT_PUBLIC_FACEBOOK_LOGIN_CONFIG_ID ?? ''
const GRAPH_VERSION = process.env.NEXT_PUBLIC_FACEBOOK_GRAPH_VERSION ?? 'v24.0'
const SCOPES = 'pages_show_list,pages_read_engagement'

type Status = {
  connected: boolean
  page_name?: string
  last_sync_at?: string | null
  last_sync_status?: string | null
  last_error?: string | null
}

interface FacebookSdk {
  init(o: { appId: string; version: string; xfbml?: boolean; cookie?: boolean }): void
  login(cb: (r: { authResponse?: { accessToken: string } | null }) => void, o: Record<string, unknown>): void
}
declare global { interface Window { FB?: FacebookSdk; fbAsyncInit?: () => void } }

async function call<T>(fn: string, body: Record<string, unknown>): Promise<T> {
  const { data, error } = await supabase.functions.invoke(fn, { body })
  if (error) {
    // supabase-js wraps the function's JSON error in error.context
    const ctx = (error as { context?: Response }).context
    const msg = ctx ? (await ctx.json().catch(() => null))?.error : null
    throw new Error(msg || error.message)
  }
  return data as T
}

export default function FacebookPanel({ onSynced }: { onSynced: () => void }) {
  const [status, setStatus] = useState<Status | null>(null)
  const [busy, setBusy] = useState<'' | 'connect' | 'sync' | 'disconnect'>('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [pages, setPages] = useState<{ id: string; name: string }[] | null>(null)
  const [pendingToken, setPendingToken] = useState('')
  const [sdkReady, setSdkReady] = useState(false)

  const refresh = useCallback(() => {
    call<Status>('facebook-connect', { action: 'status' })
      .then(setStatus)
      .catch((e) => { setStatus({ connected: false }); setError(String(e.message ?? e)) })
  }, [])
  useEffect(refresh, [refresh])

  const onSdk = () => {
    if (!window.FB || !APP_ID) return
    window.FB.init({ appId: APP_ID, version: GRAPH_VERSION, xfbml: false, cookie: false })
    setSdkReady(true)
  }

  const finishConnect = async (userAccessToken: string, pageId?: string) => {
    const res = await call<{ connected?: boolean; needsPage?: boolean; pages?: { id: string; name: string }[]; page_name?: string }>(
      'facebook-connect', { action: 'connect', userAccessToken, pageId },
    )
    if (res.needsPage && res.pages) { setPages(res.pages); setPendingToken(userAccessToken); return }
    setPages(null); setPendingToken('')
    setMessage(`Connected to ${res.page_name}. Importing posts…`)
    refresh()
    await sync(true)
  }

  const connect = () => {
    setError(''); setMessage('')
    if (!window.FB) { setError('Facebook did not load. Check that this domain is allowed in the Facebook app.'); return }
    setBusy('connect')
    window.FB.login((r) => {
      const token = r.authResponse?.accessToken
      if (!token) { setBusy(''); setError('Facebook login was cancelled.'); return }
      finishConnect(token)
        .catch((e) => setError(String(e.message ?? e)))
        .finally(() => setBusy(''))
    }, LOGIN_CONFIG_ID ? { config_id: LOGIN_CONFIG_ID } : { scope: SCOPES, return_scopes: true })
  }

  const sync = async (full = false) => {
    setError(''); setBusy('sync')
    try {
      const r = await call<{ created: number; updated: number; removed: number; read: number }>('facebook-sync', { full })
      setMessage(`Read ${r.read} posts: ${r.created} new, ${r.updated} updated, ${r.removed} hidden (deleted on Facebook).`)
      onSynced()
    } catch (e) {
      setError(String((e as Error).message ?? e))
    } finally {
      setBusy(''); refresh()
    }
  }

  const disconnect = async () => {
    if (!confirm('Disconnect the Facebook Page? Imported articles stay; new posts stop coming in.')) return
    setBusy('disconnect')
    try { await call('facebook-connect', { action: 'disconnect' }); setMessage('Disconnected.'); refresh() }
    catch (e) { setError(String((e as Error).message ?? e)) }
    finally { setBusy('') }
  }

  if (!APP_ID) return null // feature not configured on this deployment

  return (
    <section className="mb-8 rounded-xl border border-border p-5" aria-labelledby="fb-panel-title">
      <Script src="https://connect.facebook.net/en_US/sdk.js" strategy="afterInteractive" onLoad={onSdk} />
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 id="fb-panel-title" className="flex items-center gap-2 font-semibold">
            <Facebook className="h-4 w-4 text-[#1877F2]" aria-hidden /> Facebook posts
          </h2>
          {status === null ? (
            <p className="mt-1 text-sm text-muted-foreground">Checking…</p>
          ) : status.connected ? (
            <p className="mt-1 text-sm text-muted-foreground">
              Connected to <strong className="text-foreground">{status.page_name}</strong>
              {status.last_sync_at && <> · last sync {format(new Date(status.last_sync_at), 'MMM d, HH:mm')}</>}
              {status.last_sync_status === 'reconnect_needed' && <span className="text-destructive"> · access expired, connect again</span>}
            </p>
          ) : (
            <p className="mt-1 text-sm text-muted-foreground">Not connected. A Page admin connects once; posts then sync every 30 minutes.</p>
          )}
          <p className="mt-1 text-xs text-muted-foreground">
            Posts with <code>#BeyondBlog</code> are published automatically. Other posts arrive as drafts below.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {status?.connected && (
            <Button variant="outline" size="sm" onClick={() => sync(false)} disabled={busy !== ''}>
              {busy === 'sync' ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-1.5 h-4 w-4" />} Sync now
            </Button>
          )}
          <Button size="sm" onClick={connect} disabled={busy !== '' || !sdkReady}
            variant={status?.connected && status.last_sync_status !== 'reconnect_needed' ? 'outline' : 'default'}>
            {busy === 'connect' && <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />}
            {status?.connected ? 'Reconnect' : 'Connect Facebook Page'}
          </Button>
          {status?.connected && (
            <Button variant="ghost" size="sm" onClick={disconnect} disabled={busy !== ''} aria-label="Disconnect Facebook Page">
              <Unplug className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {pages && (
        <div className="mt-4 rounded-lg bg-muted/40 p-3 text-sm">
          <p className="mb-2 font-medium">Which Page should feed the articles?</p>
          <div className="flex flex-wrap gap-2">
            {pages.map((p) => (
              <Button key={p.id} size="sm" variant="outline" disabled={busy !== ''}
                onClick={() => { setBusy('connect'); finishConnect(pendingToken, p.id).catch((e) => setError(String(e.message ?? e))).finally(() => setBusy('')) }}>
                {p.name}
              </Button>
            ))}
          </div>
        </div>
      )}
      {message && <p className="mt-3 text-sm text-foreground" role="status">{message}</p>}
      {error && <p className="mt-3 text-sm text-destructive" role="alert">{error}</p>}
      {status?.last_error && !error && <p className="mt-3 text-xs text-destructive">Last sync error: {status.last_error}</p>}
    </section>
  )
}
