create extension if not exists pgcrypto;

create type hobby_type as enum ('swimming', 'hiking', 'reading', 'workout', 'gaming');

create table if not exists public.hobby_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  hobby_type hobby_type not null,
  date date not null,
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.achievements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  hobby_type hobby_type not null,
  title text not null,
  description text not null,
  earned_at timestamptz not null default now()
);

create unique index if not exists achievements_user_hobby_title_uidx
  on public.achievements (user_id, hobby_type, title);

alter table public.hobby_logs enable row level security;
alter table public.achievements enable row level security;

drop policy if exists "users can view own hobby logs" on public.hobby_logs;
create policy "users can view own hobby logs"
on public.hobby_logs for select
using (auth.uid() = user_id);

drop policy if exists "users can insert own hobby logs" on public.hobby_logs;
create policy "users can insert own hobby logs"
on public.hobby_logs for insert
with check (auth.uid() = user_id);

drop policy if exists "users can update own hobby logs" on public.hobby_logs;
create policy "users can update own hobby logs"
on public.hobby_logs for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "users can delete own hobby logs" on public.hobby_logs;
create policy "users can delete own hobby logs"
on public.hobby_logs for delete
using (auth.uid() = user_id);

drop policy if exists "users can view own achievements" on public.achievements;
create policy "users can view own achievements"
on public.achievements for select
using (auth.uid() = user_id);

drop policy if exists "users can insert own achievements" on public.achievements;
create policy "users can insert own achievements"
on public.achievements for insert
with check (auth.uid() = user_id);
