-- ============================================================
-- Beyond Australia — Articles schema
-- Run this in your Supabase project: SQL Editor → New query
-- ============================================================

-- 1. Articles table
create table if not exists public.articles (
  id              uuid        default gen_random_uuid() primary key,
  slug            text        unique not null,
  title_en        text        not null default '',
  title_th        text        not null default '',
  content_en      text,
  content_th      text,
  excerpt_en      text,
  excerpt_th      text,
  cover_image_url text,
  tags            text[]      default '{}',
  is_published    boolean     default false,
  published_at    timestamptz,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

-- 2. Auto-update updated_at on every save
create or replace function public.update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_articles_updated_at
  before update on public.articles
  for each row execute function public.update_updated_at_column();

-- 3. Row Level Security
alter table public.articles enable row level security;

-- Public visitors can only read published articles
create policy "Public read published articles"
  on public.articles for select
  using (is_published = true);

-- Authenticated admins have full access
create policy "Authenticated users full access"
  on public.articles for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- 4. Storage bucket for cover images
insert into storage.buckets (id, name, public)
values ('article-images', 'article-images', true)
on conflict (id) do nothing;

create policy "Public read article images"
  on storage.objects for select
  using (bucket_id = 'article-images');

create policy "Auth users upload article images"
  on storage.objects for insert
  with check (bucket_id = 'article-images' and auth.role() = 'authenticated');

create policy "Auth users delete article images"
  on storage.objects for delete
  using (bucket_id = 'article-images' and auth.role() = 'authenticated');

-- ============================================================
-- Events schema
-- ============================================================

-- 5. Events table
create table if not exists public.events (
  id              uuid        default gen_random_uuid() primary key,
  title_en        text        not null default '',
  title_th        text        not null default '',
  description_en  text,
  description_th  text,
  location_en     text,
  location_th     text,
  event_type      text        not null default 'offline' check (event_type in ('online', 'offline', 'hybrid')),
  event_date      timestamptz,
  is_ongoing      boolean     default false,
  is_published    boolean     default false,
  published_at    timestamptz,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

-- 6. Auto-update updated_at on every save
create trigger update_events_updated_at
  before update on public.events
  for each row execute function public.update_updated_at_column();

-- 7. Row Level Security
alter table public.events enable row level security;

-- Public visitors can only read published events
create policy "Public read published events"
  on public.events for select
  using (is_published = true);

-- Authenticated admins have full access
create policy "Authenticated users full access"
  on public.events for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');
