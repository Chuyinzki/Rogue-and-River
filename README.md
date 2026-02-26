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
