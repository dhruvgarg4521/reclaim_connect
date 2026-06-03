-- ═══════════════════════════════════════════════════════════════════
-- Reclaim – Supabase DB migration
-- Paste this entire file into Supabase Dashboard → SQL Editor → Run
-- ═══════════════════════════════════════════════════════════════════

-- ── 1. profiles ──────────────────────────────────────────────────────
create table if not exists public.profiles (
  id            uuid primary key,           -- matches auth.users.id (or Firebase UID)
  full_name     text,
  email         text,
  avatar_url    text,
  onboarding_complete boolean not null default false,
  created_at    timestamptz not null default now()
);

-- ── 2. subscriptions ─────────────────────────────────────────────────
create table if not exists public.subscriptions (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references public.profiles(id) on delete cascade,
  plan          text not null,              -- 'free' | 'monthly' | 'yearly' | 'lifetime'
  status        text not null default 'active', -- 'active' | 'cancelled' | 'expired'
  price_paid    numeric(10,2),              -- amount in INR
  started_at    timestamptz not null default now(),
  expires_at    timestamptz                 -- null = lifetime
);

-- ── 3. records ───────────────────────────────────────────────────────
create table if not exists public.records (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references public.profiles(id) on delete cascade,
  type          text not null,              -- 'checkin' | 'relapse' | 'milestone'
  note          text,
  streak_day    integer not null default 0,
  recorded_at   timestamptz not null default now()
);

-- Indexes for fast per-user queries
create index if not exists idx_subscriptions_user on public.subscriptions(user_id);
create index if not exists idx_records_user_time  on public.records(user_id, recorded_at desc);

-- ── 4. Row Level Security ─────────────────────────────────────────────
-- Disable RLS for now (API routes use the service role key which bypasses RLS).
-- Enable and add policies later when you migrate auth fully to Supabase.

alter table public.profiles      disable row level security;
alter table public.subscriptions disable row level security;
alter table public.records       disable row level security;

-- ── Optional: enable RLS + policies for Supabase-auth users only ─────
-- Uncomment these lines once all users sign in via Supabase Auth:
--
-- alter table public.profiles      enable row level security;
-- alter table public.subscriptions enable row level security;
-- alter table public.records       enable row level security;
--
-- create policy "profiles: own row" on public.profiles
--   for all using (auth.uid() = id);
--
-- create policy "subscriptions: own rows" on public.subscriptions
--   for all using (auth.uid() = user_id);
--
-- create policy "records: own rows" on public.records
--   for all using (auth.uid() = user_id);
