# Rogue and River

A personal quantified-self dashboard for tracking hobbies and progress over time.

## What It Is
Rogue and River helps you log and visualize:
- Swimming
- Hiking
- Workouts
- Reading
- Gaming

It focuses on simple daily logging, streaks, personal stats, and achievement-style progress.

## Live App
https://rogue-and-river.vercel.app/dashboard

## App Preview
![Rogue and River dashboard preview](./docs/images/rogue-and-river-dashboard.webp)

## Build Story
- Built from a blank folder to production in approximately 3 hours.
- Developed through iterative pair-programming with an AI coding assistant (OpenAI Codex).
- Includes auth, Supabase-backed CRUD, analytics/charts, achievements, edit/delete flows, testing, CI, and deployment hardening.
- Full details: [`BUILD_STORY.md`](./BUILD_STORY.md)

## Tech Stack
- Next.js (App Router)
- React + TypeScript
- Tailwind CSS
- Supabase (Auth + Postgres)

## Run Locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Notes
- Public docs stay concise here.
- Detailed implementation log and next steps live in [`STEP_BY_STEP.md`](./STEP_BY_STEP.md).

## Deployment
Designed for deployment on Vercel with Supabase as backend services.

Required environment variables:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_SITE_URL` (recommended in production)

This repo includes CI checks (`lint` + `build`) via GitHub Actions.

## Testing and Seeding
Core scripts:
- `npm run test` for unit/component tests (Vitest)
- `npm run test:e2e` for all local Playwright E2E tests (including seed spec)
- `npm run test:e2e:ci` for GitHub CI smoke tests only (excludes seeding)
- `npm run seed:e2e` for local-only test-user seeding through the UI
- `npm run test:e2e:seeded` to run seeding, then smoke checks

Seeder env vars:
- `TEST_USER_EMAIL`
- `TEST_USER_PASSWORD`
- `PLAYWRIGHT_BASE_URL` (optional; defaults to `http://127.0.0.1:3000`)

The seeder is UI-driven (no service-role DB writes) and uses a marker (`[seed-v1]`) in optional text fields for easy identification.
