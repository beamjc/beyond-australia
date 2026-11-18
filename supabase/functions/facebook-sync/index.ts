// Pulls recent Page posts into public.articles.
//   - #BeyondBlog posts are published; other posts become drafts.
//   - Photos are copied into the article-images bucket (Facebook image URLs expire).
//   - Edited posts are updated; posts deleted on Facebook are hidden.
//
// Called by pg_cron with the x-sync-secret header, or by a signed-in admin
// ("Sync now"). POST { full?: boolean } — full re-reads older posts too.
import { db } from "../_shared/db.ts";
import { HttpError, json, originAllowed, preflight } from "../_shared/http.ts";
import {
  type FbPost, graphGet, importable, mediaOf, POST_FIELDS, postToArticle, publishState,
} from "../_shared/facebook.ts";

const BUCKET = "article-images";
const MAX_IMAGE_BYTES = 8 * 1024 * 1024;

async function authorise(req: Request): Promise<"cron" | "admin"> {
  const secret = Deno.env.get("FB_SYNC_SECRET");
  const given = req.headers.get("x-sync-secret");
  if (secret && given && given === secret) return "cron";
  const jwt = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (jwt && originAllowed(req)) {
    const { data } = await db.auth.getUser(jwt);
    if (data.user) return "admin"; // all accounts are admins on this site
  }
  throw new HttpError(401, "Not allowed");
}

async function fetchPosts(pageId: string, token: string, pages: number): Promise<FbPost[]> {
  const out: FbPost[] = [];
  let next: string | null = `${pageId}/posts`;
  let params: Record<string, string> = { fields: POST_FIELDS, limit: "25", access_token: token };
  for (let i = 0; i < pages && next; i++) {
    const res: { data: FbPost[]; paging?: { next?: string } } = await graphGet(next, params);
    out.push(...res.data);
    next = res.paging?.next ?? null;
    params = {}; // the "next" URL already carries every parameter
  }
  return out;
}

async function copyPhoto(postId: string, index: number, src: string): Promise<string | null> {
  try {
    const res = await fetch(src);
    if (!res.ok) return null;
    const type = res.headers.get("content-type") ?? "image/jpeg";
    if (!type.startsWith("image/")) return null;
    const bytes = new Uint8Array(await res.arrayBuffer());
    if (bytes.byteLength > MAX_IMAGE_BYTES) return null;
    const ext = type.includes("png") ? "png" : type.includes("webp") ? "webp" : "jpg";
    const path = `facebook/${postId}/${index}.${ext}`;
    const { error } = await db.storage.from(BUCKET).upload(path, bytes, { contentType: type, upsert: true });
    if (error) throw error;
    return db.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
  } catch (e) {
    console.error("photo copy failed", postId, index, e);
    return null;
  }
}

Deno.serve(async (req) => {
  const pre = preflight(req);
  if (pre) return pre;
  try {
    if (req.method !== "POST") throw new HttpError(405, "Method not allowed");
    await authorise(req);
    const body = await req.json().catch(() => ({}));

    const { data: conn, error: connErr } = await db.from("facebook_connection").select("*").eq("id", 1).maybeSingle();
    if (connErr) throw connErr;
    if (!conn) throw new HttpError(409, "No Facebook Page connected");

    let posts: FbPost[];
    try {
      posts = await fetchPosts(conn.page_id, conn.page_token, body?.full ? 8 : 2);
    } catch (e) {
      const code = (e as { code?: number }).code;
      const status = code === 190 ? "reconnect_needed" : "error";
      await db.from("facebook_connection").update({
        last_sync_at: new Date().toISOString(), last_sync_status: status, last_error: String((e as Error).message).slice(0, 500),
      }).eq("id", 1);
      throw new HttpError(502, status === "reconnect_needed" ? "Facebook access expired: reconnect the Page" : "Facebook request failed");
    }

    const ids = posts.map((p) => p.id);
    const [{ data: ignored }, { data: existingRows, error: exErr }] = await Promise.all([
      db.from("facebook_ignored_posts").select("fb_post_id").in("fb_post_id", ids.length ? ids : ["-"]),
      db.from("articles")
        .select("id, fb_post_id, is_published, admin_override, fb_updated_at, published_at, fb_removed_at")
        .in("fb_post_id", ids.length ? ids : ["-"]),
    ]);
    if (exErr) throw exErr;
    const skip = new Set((ignored ?? []).map((r) => r.fb_post_id));
    const existing = new Map((existingRows ?? []).map((r) => [r.fb_post_id as string, r]));

    let created = 0, updated = 0, unchanged = 0, skipped = 0;
    for (const post of posts) {
      if (skip.has(post.id) || !importable(post)) { skipped++; continue; }
      const ex = existing.get(post.id) ?? null;
      const sameVersion = ex && ex.fb_updated_at && new Date(ex.fb_updated_at).getTime() === new Date(post.updated_time ?? post.created_time).getTime();
      if (sameVersion && !ex.fb_removed_at) { unchanged++; continue; }

      const photos = mediaOf(post).filter((m) => m.type === "photo");
      const copied: string[] = [];
      for (let i = 0; i < photos.length; i++) {
        const url = await copyPhoto(post.id, i, (photos[i] as { src: string }).src);
        if (url) copied.push(url);
      }

      const a = postToArticle(post, copied);
      const row = {
        ...a,
        ...publishState(a, ex),
        source: "facebook",
        title_en: "",
        cover_image_url: copied[0] ?? null,
        fb_removed_at: null,
      };
      if (ex) {
        // Keep the slug stable so shared links keep working, and keep any
        // English title staff added by hand.
        const { slug: _slug, title_en: _en, ...rest } = row;
        const { error } = await db.from("articles").update(rest).eq("id", ex.id);
        if (error) throw error;
        updated++;
      } else {
        const { error } = await db.from("articles").insert(row);
        if (error) throw error;
        created++;
      }
    }

    // Posts deleted on Facebook: anything we imported inside the window we just
    // read that is no longer there.
    let removed = 0;
    if (posts.length) {
      const oldest = posts.reduce((m, p) => (p.created_time < m ? p.created_time : m), posts[0].created_time);
      const { data: gone, error } = await db.from("articles")
        .update({ is_published: false, fb_removed_at: new Date().toISOString() })
        .eq("source", "facebook").is("fb_removed_at", null).gte("fb_created_at", oldest)
        .not("fb_post_id", "in", `(${ids.map((id) => `"${id}"`).join(",")})`)
        .select("id");
      if (error) throw error;
      removed = gone?.length ?? 0;
    }

    const summary = { created, updated, unchanged, skipped, removed, read: posts.length };
    await db.from("facebook_connection").update({
      last_sync_at: new Date().toISOString(), last_sync_status: "ok", last_error: null,
    }).eq("id", 1);
    return json(req, { ok: true, ...summary });
  } catch (e) {
    if (e instanceof HttpError) return json(req, { error: e.message }, e.status);
    console.error(e);
    return json(req, { error: "Sync failed" }, 500);
  }
});
