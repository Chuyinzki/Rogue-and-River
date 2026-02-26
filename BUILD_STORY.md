# Build Story: From Blank Folder to Production (Approx. 3 Hours)

Rogue and River was built from an empty directory to a live production deployment in roughly **three hours**, using a pair-programming workflow with an AI coding assistant (OpenAI Codex).

## Development Workflow

1. **Project bootstrap**
- Created the app from scratch with Next.js, TypeScript, and Tailwind.
- Set up core route structure (`/`, `/dashboard`, `/login`, `/signup`, `/profile`, `/hobby/[type]`).

2. **Backend and auth integration**
- Connected Supabase (Auth + Postgres).
- Defined schema and RLS policies for `hobby_logs` and `achievements`.
- Implemented signup/login/logout with secure route protection and auth callbacks.

3. **Core product features**
- Built hobby logging modules for:
  - swimming
  - hiking
  - workouts
  - reading
  - gaming
- Added data visualizations and summaries (including daily aggregation and streak logic).
- Implemented reading-specific completion tracking (`finished`).

4. **Gamification and quality-of-life**
- Added automatic badge/achievement awarding based on milestones.
- Added profile achievements view and dashboard badge indicators.
- Added log management flows:
  - create
  - edit
  - delete

5. **Polish + reliability**
- Improved dark mode contrast and button affordance states.
- Added test stack:
  - unit tests (Vitest)
  - component tests (React Testing Library)
  - e2e smoke tests (Playwright)
- Added local git hooks (Husky + lint-staged).
- Added CI pipeline (GitHub Actions) for lint, build, test, and e2e checks.
- Prepared deployment configuration and environment handling for Vercel.

## What AI Assisted With

The assistant accelerated implementation across:
- architecture and file scaffolding
- backend integration patterns
- auth/session handling
- CRUD feature implementation
- test and CI setup
- deployment hardening
- bug diagnosis and fast iteration

## Ownership and Decision-Making

All product decisions, scope tradeoffs, naming, acceptance criteria, and final quality bar were directed by me.
AI was used as a high-speed engineering collaborator, not as a replacement for product ownership.
