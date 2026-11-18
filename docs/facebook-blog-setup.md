# Facebook Page posts as articles (#BeyondBlog)

Branch: `feat/facebook-blog`. Nothing is deployed. The admin panel stays hidden until `NEXT_PUBLIC_FACEBOOK_APP_ID` is set, and no posts arrive until a Page is connected.

## How it works

- **Connect once.** A Page admin signs in to `/admin` and clicks **Connect Facebook Page**. They log in with Facebook and approve **read-only** access (`pages_show_list`, `pages_read_engagement`). The site stores a Page token that doesn't expire. Nobody else needs the Page login.
- **Sync every 30 minutes** (plus a **Sync now** button). The `facebook-sync` Edge Function reads the latest ~50 posts, or ~200 on the first import.
  - Posts with **#BeyondBlog** (any letter case, as a whole hashtag) are **published**.
  - Other posts are imported as **drafts**. Staff can publish one with the eye button in `/admin`.
  - Staff choices stick. Once someone publishes or hides an imported post by hand, adding or removing the hashtag on Facebook no longer changes it.
  - **Edited on Facebook** → the article's Thai title, text and photos are updated. An English title or body added in `/admin` is kept.
  - **Deleted on Facebook** → hidden from the site, marked "Deleted on Facebook".
  - **Deleted in /admin** → never imported again.
  - **Skipped:** shares of other people's posts, and posts with no text.
- **How a post becomes an article:**
  - Title = the first line, without hashtags.
  - Body = the rest. Paragraphs and line breaks are kept, and web links become clickable. All other text is escaped, so a post can't inject HTML.
  - Cover = the first photo. The other photos form a gallery. Videos use Facebook's embedded player.
  - Other hashtags become article tags.
  - A "View the original post on Facebook" link is added.
- **Photos are copied** into the existing `article-images` bucket, because Facebook's image links expire after a while.
- **Language:** posts are Thai. In English mode, a post with no English shows the Thai text with a **Thai only** label. Staff can add an English title and body in `/admin` if they want a proper English version.

## Files

| Path | What |
|---|---|
| `supabase/facebook_blog.sql` | New `articles` columns; triggers (staff choice wins, deleted posts aren't re-imported); `facebook_connection` (RLS on, no policies: the token is readable only by Edge Functions); the cron snippet. |
| `supabase/functions/facebook-connect` | Admin-only: status / connect (exchanges the login for a Page token) / disconnect. Never returns the token. |
| `supabase/functions/facebook-sync` | Cron (secret header) or signed-in admin. Imports posts, copies photos, publishes or drafts them, hides deleted posts. |
| `supabase/functions/_shared/facebook.ts` | Post → article conversion (tested in `facebook_test.ts`). |
| `src/components/admin/FacebookPanel.tsx` | Connect / Sync now / status on `/admin`. |
| `src/lib/articleText.ts` | Language fallback + "Thai only" flag for cards and article pages. |

## Setup

### 1. Meta app (you)

1. developers.facebook.com → **Create app**. Pick the use case for managing a Page (in some setups: app type **Business**).
2. Add **Facebook Login for Business**, or **Facebook Login** if that's what the app type offers.
   - **Login for Business:** create a *configuration* with token type **User access token** and permissions `pages_show_list` + `pages_read_engagement`. Copy the **configuration ID**.
   - **Allowed Domains for the JavaScript SDK:** the site's URL (and `http://localhost:3000` for testing). Turn on **Login with the JavaScript SDK**.
3. App settings → Basic:
   - Add the site domain to **App Domains**.
   - Copy the **App ID** and **App Secret**. The secret goes only into Supabase secrets.
4. Keep the app in **Development** mode. That works for people who have a role on the app, which is all we need, so no App Review is required.
5. App roles → add the Page admin as a **Tester** (or Admin). They accept the invite from their Facebook developer account.

### 2. Supabase

1. SQL Editor → run `supabase/facebook_blog.sql`. It's safe to run twice.
2. Secrets:
   ```
   supabase secrets set \
     FACEBOOK_APP_ID=<app id> FACEBOOK_APP_SECRET=<app secret> \
     FB_SYNC_SECRET=$(openssl rand -hex 24) \
     ALLOWED_ORIGINS=https://beyond-australia.jirachaiphat-c.workers.dev
   # optional: FACEBOOK_PAGE_ID=<page id> (refuses any other Page), FB_BLOG_HASHTAG=BeyondBlog
   ```
3. Deploy: `supabase functions deploy facebook-connect facebook-sync --no-verify-jwt --project-ref <ref>`. Each function checks the caller itself.
4. Database → Extensions: enable **pg_cron** and **pg_net**. Then run the `cron.schedule` snippet at the bottom of `facebook_blog.sql`, with your project ref and `FB_SYNC_SECRET`.

### 3. Website

Set these where `npm run deploy` runs:
```
NEXT_PUBLIC_FACEBOOK_APP_ID=<app id>
NEXT_PUBLIC_FACEBOOK_LOGIN_CONFIG_ID=<configuration id>   # only with Facebook Login for Business
```

### 4. Connect and check

- [ ] The Page admin opens `/admin` → **Connect Facebook Page** → picks the Beyond Study Page → the first import runs.
- [ ] Post on Facebook with `#BeyondBlog` → it appears on `/articles` within 30 minutes, or right away with **Sync now**.
- [ ] Post without the tag → it shows as a draft in `/admin`. The eye button publishes it.
- [ ] Edit a tagged post on Facebook → the article updates. Delete it → it disappears from the site.
- [ ] Album post (several photos) and a video post render correctly on phone and desktop.
- [ ] A `select` on `facebook_connection` through the REST API with the anon key returns nothing.

## Things to know

- **First import:** the ~200 most recent untagged posts arrive as drafts. Staff can ignore them; drafts never show on the site.
- **Formatting:** Facebook posts are plain text, so there's no bold or headings.
- **If the token stops working** (the admin changes their password, loses the Page role, or removes the app in Facebook settings), the panel shows "access expired, connect again" and the sync pauses until someone reconnects.
- **Not instant:** new posts show up within the 30-minute schedule. Instant updates would need Facebook webhooks, which need extra permissions and App Review.

## Tests

- `deno test supabase/functions/_shared --allow-env` → hashtag matching, title/body conversion, HTML escaping, photos/videos, publish rule.
- `npm test` → `tests/unit/articleText.test.ts` (language fallback).
- `npx playwright test tests/e2e/facebook-articles.spec.ts` → public pages with **mocked** imported rows.
- The SQL triggers were run against a local Postgres.

None of this proves the live Facebook connection or sync works. That needs the checklist above.
