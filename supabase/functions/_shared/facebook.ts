// Facebook Page post -> article. Pure functions (tested in facebook_test.ts)
// plus thin Graph API helpers.

export const BLOG_TAG = (Deno.env.get("FB_BLOG_HASHTAG") ?? "BeyondBlog").replace(/^#/, "");
export const GRAPH = `https://graph.facebook.com/${Deno.env.get("FACEBOOK_GRAPH_VERSION") ?? "v24.0"}`;

export type FbAttachment = {
  media_type?: string; // "photo" | "video" | "album" | "link" | ...
  type?: string;
  url?: string;
  media?: { image?: { src?: string; width?: number; height?: number }; source?: string };
  subattachments?: { data?: FbAttachment[] };
};

export type FbPost = {
  id: string;
  message?: string;
  created_time: string;
  updated_time?: string;
  permalink_url?: string;
  full_picture?: string;
  status_type?: string; // "shared_story" for shares of someone else's post
  attachments?: { data?: FbAttachment[] };
};

export type Media = { type: "photo"; src: string } | { type: "video"; href: string };

/** A hashtag match that doesn't run into more letters (#BeyondBlogs, #BeyondBlogวีซ่า are other tags). */
const tagRe = (tag: string) =>
  new RegExp(`#${tag.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?![\\p{L}\\p{M}\\p{N}_])`, "giu");

export const hasBlogTag = (message: string | undefined, tag = BLOG_TAG) =>
  Boolean(message && tagRe(tag).test(message));

/** Posts we never import: shares of other people's posts, and posts with no text. */
export const importable = (p: FbPost) => p.status_type !== "shared_story" && Boolean(p.message?.trim());

/** Other hashtags in the post become article tags (max 5). */
export function hashtags(message: string, tag = BLOG_TAG): string[] {
  const out: string[] = [];
  for (const m of message.matchAll(/#([\p{L}\p{M}\p{N}_]+)/gu)) {
    const t = m[1];
    if (t.toLowerCase() === tag.toLowerCase()) continue;
    if (!out.some((o) => o.toLowerCase() === t.toLowerCase())) out.push(t);
    if (out.length === 5) break;
  }
  return out;
}

/** Photos (incl. album photos) and videos attached to the post, in order. */
export function mediaOf(p: FbPost): Media[] {
  const out: Media[] = [];
  const add = (a: FbAttachment) => {
    const kind = a.media_type ?? a.type ?? "";
    if (kind.includes("video") && a.url) out.push({ type: "video", href: a.url });
    else if (a.media?.image?.src && (kind.includes("photo") || kind === "album" || kind === "")) {
      out.push({ type: "photo", src: a.media.image.src });
    }
  };
  for (const a of p.attachments?.data ?? []) {
    const subs = a.subattachments?.data ?? [];
    if (subs.length) subs.forEach(add);
    else add(a);
  }
  if (!out.some((m) => m.type === "photo") && p.full_picture && !out.some((m) => m.type === "video")) {
    out.push({ type: "photo", src: p.full_picture });
  }
  return out.slice(0, 20);
}

const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");

/** Escaped text with http(s) links made clickable. Nothing else from the post becomes HTML. */
function linkify(line: string): string {
  const parts: string[] = [];
  let last = 0;
  for (const m of line.matchAll(/https?:\/\/[^\s<>"']+[^\s<>"'.,;:!?)\]]/g)) {
    parts.push(escapeHtml(line.slice(last, m.index)));
    const url = escapeHtml(m[0]);
    parts.push(`<a href="${url}" target="_blank" rel="noopener noreferrer nofollow">${url}</a>`);
    last = m.index! + m[0].length;
  }
  parts.push(escapeHtml(line.slice(last)));
  return parts.join("");
}

const stripTag = (s: string, tag = BLOG_TAG) => s.replace(tagRe(tag), "").replace(/[ \t]{2,}/g, " ").trim();

/** Cut at the last space before `max` if there is one (Thai has no spaces, so it may cut mid-sentence). */
function clip(s: string, max: number): string {
  if (s.length <= max) return s;
  const cut = s.slice(0, max);
  const space = cut.lastIndexOf(" ");
  return (space > max * 0.6 ? cut.slice(0, space) : cut).trimEnd() + "…";
}

export type ArticleFields = {
  slug: string;
  title_th: string;
  content_th: string;
  excerpt_th: string;
  tags: string[];
  fb_post_id: string;
  fb_permalink: string | null;
  fb_created_at: string;
  fb_updated_at: string;
  fb_tagged: boolean;
};

/**
 * Title = first non-empty line (without the blog tag), body = the rest.
 * `photoUrls` are the copies in our storage, in the same order as mediaOf(p).
 */
export function postToArticle(p: FbPost, photoUrls: string[] = [], tag = BLOG_TAG): ArticleFields {
  const text = stripTag(p.message ?? "", tag).replace(/\r\n/g, "\n");
  const lines = text.split("\n");
  const firstIdx = lines.findIndex((l) => l.trim());
  const firstLine = (lines[firstIdx] ?? "").trim();
  const rest = lines.slice(firstIdx + 1).join("\n").trim();
  const title = clip(firstLine.replace(/#[\p{L}\p{M}\p{N}_]+/gu, "").trim() || firstLine, 120);
  // A one-line post keeps its text as the body too, so the article isn't empty.
  const bodyText = rest || (firstLine.length > title.length ? firstLine : "");

  const paragraphs = bodyText
    .split(/\n\s*\n/)
    .map((para) => para.split("\n").map((l) => linkify(l.trim())).join("<br>"))
    .filter(Boolean)
    .map((h) => `<p>${h}</p>`);

  const media = mediaOf(p);
  // The first photo is the cover image, so the gallery shows the rest.
  const gallery = photoUrls.slice(1).map((src) => `<figure><img src="${escapeHtml(src)}" alt="" loading="lazy"></figure>`);
  const videos = media
    .filter((m): m is Extract<Media, { type: "video" }> => m.type === "video")
    .map((v) =>
      `<div class="fb-video"><iframe src="https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(v.href)}&show_text=false" ` +
      `title="Facebook video" loading="lazy" allow="encrypted-media; picture-in-picture; web-share" allowfullscreen></iframe></div>`
    );

  const plain = bodyText.replace(/\s+/g, " ").trim();
  return {
    slug: `fb-${p.id.split("_").pop()}`,
    title_th: title || clip(plain, 80) || "Facebook post",
    content_th: [...paragraphs, ...videos, ...gallery].join("\n"),
    excerpt_th: clip(plain || title, 160),
    tags: hashtags(p.message ?? "", tag),
    fb_post_id: p.id,
    fb_permalink: p.permalink_url ?? null,
    fb_created_at: p.created_time,
    fb_updated_at: p.updated_time ?? p.created_time,
    fb_tagged: hasBlogTag(p.message, tag),
  };
}

export type Existing = {
  id: string;
  is_published: boolean;
  admin_override: boolean;
  fb_updated_at: string | null;
  published_at: string | null;
};

/**
 * Publish rule: tagged => published, untagged => draft. Once staff publish or
 * hide a post by hand (admin_override), their choice wins.
 */
export function publishState(a: ArticleFields, existing: Existing | null) {
  if (existing?.admin_override) {
    return { is_published: existing.is_published, published_at: existing.published_at };
  }
  return {
    is_published: a.fb_tagged,
    published_at: a.fb_tagged ? (existing?.published_at ?? a.fb_created_at) : existing?.published_at ?? null,
  };
}

/** Graph API GET. Errors keep Facebook's message but never the token. */
export async function graphGet<T>(path: string, params: Record<string, string>): Promise<T> {
  const url = new URL(path.startsWith("http") ? path : `${GRAPH}/${path.replace(/^\//, "")}`);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  const res = await fetch(url);
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = body?.error?.message ?? `HTTP ${res.status}`;
    const err = new Error(`Facebook: ${msg}`) as Error & { code?: number };
    err.code = body?.error?.code;
    throw err;
  }
  return body as T;
}

export const POST_FIELDS = [
  "id", "message", "created_time", "updated_time", "permalink_url", "full_picture", "status_type",
  "attachments{media_type,type,url,media,subattachments.limit(20){media_type,type,url,media}}",
].join(",");
