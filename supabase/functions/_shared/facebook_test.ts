// deno test supabase/functions/_shared --allow-env
import { assert, assertEquals, assertStringIncludes } from "jsr:@std/assert@1";
import { type FbPost, hasBlogTag, hashtags, importable, mediaOf, postToArticle, publishState } from "./facebook.ts";

const post = (over: Partial<FbPost> = {}): FbPost => ({
  id: "1234_5678",
  created_time: "2026-11-01T02:00:00+0000",
  updated_time: "2026-11-01T02:00:00+0000",
  permalink_url: "https://www.facebook.com/beyondstudy/posts/5678",
  message: "เตรียมตัวไป WHM ปี 2027 #BeyondBlog\n\nย่อหน้าแรก\nบรรทัดสอง\n\nอ่านต่อ https://immi.homeaffairs.gov.au/visas. #วีซ่า #WHM",
  ...over,
});

Deno.test("blog tag: exact hashtag, any case, not longer tags", () => {
  assert(hasBlogTag("hello #BeyondBlog"));
  assert(hasBlogTag("#beyondblog\nข่าว"));
  assert(hasBlogTag("ข่าววันนี้#BeyondBlog."));
  assert(!hasBlogTag("#BeyondBlogs"));
  assert(!hasBlogTag("#BeyondBlogวีซ่า"));
  assert(!hasBlogTag("BeyondBlog without hash"));
  assert(!hasBlogTag(undefined));
});

Deno.test("other hashtags become tags, without the blog tag or duplicates", () => {
  assertEquals(hashtags("#BeyondBlog #วีซ่า #WHM #whm #Study"), ["วีซ่า", "WHM", "Study"]);
});

Deno.test("shares and empty posts are not imported", () => {
  assert(importable(post()));
  assert(!importable(post({ status_type: "shared_story" })));
  assert(!importable(post({ message: "   " })));
  assert(!importable(post({ message: undefined })));
});

Deno.test("title is the first line without hashtags; body keeps paragraphs, line breaks and safe links", () => {
  const a = postToArticle(post());
  assertEquals(a.title_th, "เตรียมตัวไป WHM ปี 2027");
  assertEquals(a.slug, "fb-5678");
  assert(a.fb_tagged);
  assertEquals(a.tags, ["วีซ่า", "WHM"]);
  assertStringIncludes(a.content_th, "<p>ย่อหน้าแรก<br>บรรทัดสอง</p>");
  // trailing full stop is not part of the link
  assertStringIncludes(a.content_th, '<a href="https://immi.homeaffairs.gov.au/visas" target="_blank" rel="noopener noreferrer nofollow">');
  assert(!a.content_th.includes("BeyondBlog"));
});

Deno.test("post text can never inject HTML", () => {
  const a = postToArticle(post({ message: "Title\n<script>alert(1)</script> <img src=x onerror=alert(1)> \"q\"" }));
  assert(!a.content_th.includes("<script"));
  assert(!a.content_th.includes("<img src=x"));
  assertStringIncludes(a.content_th, "&lt;script&gt;");
  const b = postToArticle(post({ message: 'T\njavascript:alert(1) https://x.example/"onmouseover="a' }));
  assert(!b.content_th.includes('"onmouseover'));
  assert(!b.content_th.includes('href="javascript'));
});

Deno.test("a one-line post keeps its text as the body when the title had to be shortened", () => {
  const long = "ก".repeat(200);
  const a = postToArticle(post({ message: long }));
  assertEquals(a.title_th.length, 121); // 120 + "…"
  assertStringIncludes(a.content_th, long);
});

Deno.test("photos: album photos in order, the first is the cover; videos are embedded", () => {
  const p = post({
    full_picture: "https://scontent/full.jpg",
    attachments: { data: [{ media_type: "album", subattachments: { data: [
      { media_type: "photo", media: { image: { src: "https://scontent/1.jpg" } } },
      { media_type: "photo", media: { image: { src: "https://scontent/2.jpg" } } },
    ] } }] },
  });
  assertEquals(mediaOf(p), [{ type: "photo", src: "https://scontent/1.jpg" }, { type: "photo", src: "https://scontent/2.jpg" }]);
  const a = postToArticle(p, ["https://store/1.jpg", "https://store/2.jpg"]);
  assert(!a.content_th.includes("store/1.jpg")); // cover, not repeated in the body
  assertStringIncludes(a.content_th, '<img src="https://store/2.jpg"');

  const v = post({ attachments: { data: [{ media_type: "video", url: "https://www.facebook.com/beyondstudy/videos/99/" }] } });
  assertEquals(mediaOf(v), [{ type: "video", href: "https://www.facebook.com/beyondstudy/videos/99/" }]);
  assertStringIncludes(postToArticle(v).content_th, "plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2Fbeyondstudy%2Fvideos%2F99%2F");
});

Deno.test("full_picture is used when there are no attachments", () => {
  assertEquals(mediaOf(post({ full_picture: "https://scontent/f.jpg" })), [{ type: "photo", src: "https://scontent/f.jpg" }]);
});

Deno.test("publish rule: tag publishes, no tag = draft, staff choice wins", () => {
  const tagged = postToArticle(post());
  const untagged = postToArticle(post({ message: "Just news" }));
  assertEquals(publishState(tagged, null), { is_published: true, published_at: tagged.fb_created_at });
  assertEquals(publishState(untagged, null), { is_published: false, published_at: null });

  const ex = { id: "a", is_published: true, admin_override: false, fb_updated_at: null, published_at: "2026-11-02T00:00:00Z" };
  // tag removed on Facebook -> back to draft
  assertEquals(publishState(untagged, ex).is_published, false);
  // keeps the original publish date
  assertEquals(publishState(tagged, ex).published_at, "2026-11-02T00:00:00Z");
  // staff published an untagged post by hand -> stays published
  assertEquals(publishState(untagged, { ...ex, admin_override: true }).is_published, true);
  // staff hid a tagged post -> stays hidden
  assertEquals(publishState(tagged, { ...ex, is_published: false, admin_override: true }).is_published, false);
});
