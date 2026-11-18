-- ============================================================
-- Beyond Australia — Facebook Page posts as articles
-- Run in Supabase: SQL Editor → New query (after schema.sql).
--
-- Posts with #BeyondBlog are published automatically; other posts are
-- imported as drafts that staff can publish from /admin.
-- See docs/facebook-blog-setup.md.
-- ============================================================

-- 1. Extra article columns for imported posts.
alter table public.articles
  add column if not exists source         text not null default 'manual'
                                          check (source in ('manual', 'facebook')),
  add column if not exists fb_post_id     text unique,
  add column if not exists fb_permalink   text,
  add column if not exists fb_created_at  timestamptz,
  add column if not exists fb_updated_at  timestamptz,
  add column if not exists fb_tagged      boolean not null default false,  -- post has #BeyondBlog
  add column if not exists fb_removed_at  timestamptz,                     -- post gone from Facebook
  -- Set when staff publish/hide a Facebook article by hand; the sync then
  -- stops changing is_published for that post.
  add column if not exists admin_override boolean not null default false;

create index if not exists articles_source_idx on public.articles (source, is_published);

-- Staff changing is_published on a Facebook article => the sync keeps their choice.
-- The sync itself runs as service_role and is not affected.
create or replace function public.articles_fb_override() returns trigger
language plpgsql as $$
begin
  if new.source = 'facebook'
     and new.is_published is distinct from old.is_published
     and coalesce(auth.role(), '') <> 'service_role' then
    new.admin_override := true;
  end if;
  return new;
end $$;

drop trigger if exists articles_fb_override on public.articles;
create trigger articles_fb_override
  before update on public.articles
  for each row execute function public.articles_fb_override();

-- 2. Posts staff deleted from the site: never re-import them.
create table if not exists public.facebook_ignored_posts (
  fb_post_id  text primary key,
  ignored_at  timestamptz not null default now()
);

create or replace function public.articles_fb_ignore_on_delete() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if old.fb_post_id is not null then
    insert into public.facebook_ignored_posts (fb_post_id) values (old.fb_post_id)
    on conflict do nothing;
  end if;
  return old;
end $$;

drop trigger if exists articles_fb_ignore_on_delete on public.articles;
create trigger articles_fb_ignore_on_delete
  after delete on public.articles
  for each row execute function public.articles_fb_ignore_on_delete();

-- 3. The connected Page. Holds the Page access token, so: RLS on, no policies.
--    Only the Edge Functions (service role) can read it; the admin UI asks
--    facebook-connect for a status that never includes the token.
create table if not exists public.facebook_connection (
  id               int primary key default 1 check (id = 1),  -- one Page
  page_id          text not null,
  page_name        text,
  page_token       text not null,
  connected_by     uuid,
  connected_at     timestamptz not null default now(),
  last_sync_at     timestamptz,
  last_sync_status text,
  last_error       text
);

alter table public.facebook_ignored_posts enable row level security;
alter table public.facebook_connection    enable row level security;

-- 4. Schedule (run once, after deploying the facebook-sync function).
--    Needs the pg_cron and pg_net extensions (Database → Extensions), and the
--    same FB_SYNC_SECRET you set as an Edge Function secret.
--
-- select cron.schedule('facebook-sync', '*/30 * * * *', $$
--   select net.http_post(
--     url     := 'https://<project-ref>.supabase.co/functions/v1/facebook-sync',
--     headers := jsonb_build_object('Content-Type', 'application/json',
--                                   'x-sync-secret', '<FB_SYNC_SECRET>'),
--     body    := '{}'::jsonb
--   );
-- $$);
