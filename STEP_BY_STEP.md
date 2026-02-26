# Rogue and River - Step by Step

## Step 1 (Completed)
- Scaffolded `Next.js + TypeScript + Tailwind`.
- Added core routes:
  - `/`
  - `/dashboard`
  - `/login`
  - `/signup`
  - `/profile`
  - `/hobby/[type]`
- Added starter dashboard UI and reusable summary card component.

## Step 2 - Connect Supabase
1. Create a Supabase project.
2. In Supabase SQL editor, create initial schema:
```sql
create type hobby_type as enum ('swimming','hiking','reading','workout','gaming');

create table public.hobby_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  hobby_type hobby_type not null,
  date date not null,
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table public.achievements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  hobby_type hobby_type not null,
  title text not null,
  description text not null,
  earned_at timestamptz not null default now()
);
```
3. Turn on RLS and add policies:
```sql
alter table public.hobby_logs enable row level security;
alter table public.achievements enable row level security;

create policy "users can view own hobby logs"
on public.hobby_logs for select using (auth.uid() = user_id);

create policy "users can insert own hobby logs"
on public.hobby_logs for insert with check (auth.uid() = user_id);

create policy "users can update own hobby logs"
on public.hobby_logs for update using (auth.uid() = user_id);

create policy "users can view own achievements"
on public.achievements for select using (auth.uid() = user_id);
```
4. Install SDK:
```bash
npm install @supabase/supabase-js @supabase/ssr
```
5. Create env vars in `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

## Step 3 - Auth
- Implement sign up and log in actions in `/signup` and `/login`.
- Add middleware to protect `/dashboard`, `/profile`, and `/hobby/*`.

## Step 4 - First Real Feature (Swimming)
- Build swimming log form.
- Save records into `hobby_logs`.
- Render list of swim sessions.
- Add first chart (weekly distance trend).

## Step 5 - Expand Hobbies + Dashboard Summary
- Add hiking, workouts, reading, gaming input variants.
- Render summary cards from real queries.
- Add streak + personal best calculations.

## Step 6 - Achievements + Polish
- Add badge rules and earned badge creation.
- Improve responsive UI and empty states.

## Step 7 - Deploy
- Push to GitHub.
- Connect repo to Vercel.
- Add Vercel env vars.
- Deploy and test production auth flow.
