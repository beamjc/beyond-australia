-- ============================================================
-- Beyond Australia — LINE (LIFF) lead capture
-- Run in Supabase: SQL Editor → New query (after schema.sql).
-- Tables are locked down with RLS and no policies: only the Edge
-- Functions in supabase/functions (service role) can read or write.
-- ============================================================

create extension if not exists pgcrypto;

-- 1. Drafts: answers from website tools, saved before the visitor opens LINE.
--    The id is a random, unguessable token passed in the LIFF URL.
--    Drafts should hold tool answers only, not contact details.
create table public.lead_drafts (
  id          text primary key,
  tool        text not null,                       -- e.g. 'eligibility-checker'
  answers     jsonb not null default '{}'::jsonb,  -- tool inputs and results
  source      jsonb not null default '{}'::jsonb,  -- utm_*, referrer, landing page
  created_at  timestamptz not null default now(),
  expires_at  timestamptz not null default now() + interval '2 days',
  used_at     timestamptz,
  used_by_lead uuid
);

create index lead_drafts_expires_idx on public.lead_drafts (expires_at);

-- 2. Leads: one row per LINE user.
create table public.leads (
  id               uuid primary key default gen_random_uuid(),
  line_user_id     text not null unique,
  line_display_name text,
  line_picture_url text,
  line_email       text,                 -- only if the email scope is approved
  is_friend        boolean not null default false,

  full_name        text,
  nickname         text,
  phone            text,
  email            text,
  current_level    text,                 -- current education level
  program_interest text,
  intake           text,
  message          text,

  latest_answers   jsonb not null default '{}'::jsonb,  -- from the most recent tool
  first_source     jsonb not null default '{}'::jsonb,  -- first-touch attribution
  latest_source    jsonb not null default '{}'::jsonb,  -- last-touch attribution

  consent_privacy_at   timestamptz,      -- required to submit
  consent_marketing_at timestamptz,      -- optional; null = no marketing messages
  consent_version      text,

  status       text not null default 'new'
               check (status in ('new','contacted','consulting','applied','enrolled','lost')),
  assigned_to  text,
  staff_notes  text,

  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index leads_status_idx on public.leads (status, created_at desc);

-- 3. Submissions: every form submit, kept as history (a lead may submit
--    several times, e.g. after using different tools).
create table public.lead_submissions (
  id          uuid primary key default gen_random_uuid(),
  lead_id     uuid not null references public.leads(id) on delete cascade,
  draft_id    text references public.lead_drafts(id) on delete set null,
  tool        text,
  answers     jsonb not null default '{}'::jsonb,
  form        jsonb not null default '{}'::jsonb,
  source      jsonb not null default '{}'::jsonb,
  created_at  timestamptz not null default now()
);

create index lead_submissions_lead_idx on public.lead_submissions (lead_id, created_at desc);

-- 4. LINE groups the bot has joined (used to find the staff group ID).
create table public.line_groups (
  group_id   text primary key,
  joined_at  timestamptz not null default now(),
  left_at    timestamptz
);

-- updated_at trigger
create or replace function public.set_updated_at() returns trigger
language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end $$;

create trigger leads_set_updated_at
before update on public.leads
for each row execute function public.set_updated_at();

-- Lock everything down: RLS on, no policies => anon/authenticated get nothing.
alter table public.lead_drafts      enable row level security;
alter table public.leads            enable row level security;
alter table public.lead_submissions enable row level security;
alter table public.line_groups      enable row level security;

-- Housekeeping: delete expired, unused drafts (run daily with pg_cron if enabled):
--   select cron.schedule('purge-lead-drafts', '15 3 * * *',
--     $$delete from public.lead_drafts where expires_at < now() - interval '7 days'$$);
