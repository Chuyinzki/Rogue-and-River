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

## Step 2 - Connect Supabase (In Progress)
Completed in code:
- Installed `@supabase/supabase-js` and `@supabase/ssr`.
- Added reusable Supabase clients:
  - `src/lib/supabase/client.ts`
  - `src/lib/supabase/server.ts`
  - `src/lib/supabase/middleware.ts`
- Added root `middleware.ts` for Supabase session refresh.
- Added `.env.example`.
- Added `supabase/schema.sql` with schema + RLS policies.

Still required from you:
1. Create a Supabase project.
2. In Supabase SQL editor, run `supabase/schema.sql`.
3. Create env vars in `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

Reference SQL (already saved in `supabase/schema.sql`):
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

## Step 3 - Auth (In Progress)
Completed in code:
- Implemented server actions for:
  - sign up
  - log in
  - log out
  - file: `src/app/auth/actions.ts`
- Added auth callback route:
  - `src/app/auth/callback/route.ts`
- Connected forms:
  - `src/app/login/page.tsx`
  - `src/app/signup/page.tsx`
- Added logout action button on dashboard:
  - `src/app/dashboard/page.tsx`
- Updated middleware route protection and redirects:
  - redirects unauthenticated users from `/dashboard`, `/profile`, `/hobby/*` to `/login`
  - redirects authenticated users away from `/login` and `/signup` to `/dashboard`
  - file: `src/lib/supabase/middleware.ts`

Still required from you:
1. In Supabase Auth settings, confirm Email provider is enabled.
2. In Supabase URL configuration, add redirect URLs for local and production:
   - `http://localhost:3000/auth/callback`
   - `https://<your-production-domain>/auth/callback`
3. Manually test:
   - sign up flow
   - email confirmation redirect
   - login
   - logout
   - protected route redirect behavior

## Step 4 - First Real Feature (Swimming) (In Progress)
Completed in code:
- Added server action to create swim logs:
  - `src/app/hobby/actions.ts`
- Implemented real swimming module on `/hobby/swimming`:
  - save form (date, distance, duration, location)
  - stats cards (total distance, personal best, sessions count)
  - recent sessions list
  - file: `src/app/hobby/[type]/page.tsx`
- Added chart component for swim distance trend:
  - `src/components/swimming-weekly-chart.tsx`
- Installed chart dependency:
  - `recharts`

Still required from you:
1. Test creating swim logs through the UI.
2. Confirm records appear in Supabase table `public.hobby_logs`.
3. Verify chart and summary values match your inserted logs.

## Step 5 - Expand Hobbies + Dashboard Summary
Completed in code:
- Expanded hobby log actions:
  - hiking, workout, reading, gaming
  - file: `src/app/hobby/actions.ts`
- Reading logs now support a manual `finished` marker.
- Reading UI now shows finished status in recent sessions and finished counts in summaries.
- Upgraded `/hobby/[type]` to support all 5 hobby modules with:
  - type-specific forms
  - persisted Supabase writes
  - recent logs rendering per hobby
  - retained swimming trend chart
- Replaced dashboard mock cards with live Supabase summaries:
  - total metrics per hobby
  - per-hobby streak calculation
  - swimming personal-best summary
  - file: `src/app/dashboard/page.tsx`
- Added shared metrics helper:
  - `src/lib/hobby-metrics.ts`

Still required from you:
1. Add at least one log for each hobby and verify each form saves correctly.
2. Confirm dashboard cards update after each new entry.
3. Spot-check streak numbers for expected behavior.

## Step 6 - Achievements + Polish
Completed in code:
- Added automatic achievement awarding on log creation:
  - `src/lib/achievements.ts`
  - integrated in `src/app/hobby/actions.ts`
- Implemented badge rules:
  - `First book finished`
  - `5 swims logged`
  - `100 pages read`
  - `3-week hiking streak`
  - `10 workouts logged`
  - `20 gaming hours`
- Replaced profile placeholder badges with live Supabase achievements list:
  - `src/app/profile/page.tsx`
- Added dashboard badge count callout linking to profile:
  - `src/app/dashboard/page.tsx`
- Improved empty states for achievements in profile.
- Added log management:
  - delete from recent sessions
  - edit via `/hobby/[type]/[id]/edit`
  - files: `src/app/hobby/actions.ts`, `src/app/hobby/[type]/page.tsx`, `src/app/hobby/[type]/[id]/edit/page.tsx`

Still required from you:
1. Add enough logs to trigger at least one achievement.
2. Verify new badges appear on `/profile`.
3. Confirm dashboard badge count updates after milestones.

## Step 7 - Deploy
- Push to GitHub.
- Connect repo to Vercel.
- Add Vercel env vars.
- Deploy and test production auth flow.
