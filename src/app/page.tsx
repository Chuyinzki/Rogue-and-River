import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-4xl flex-col items-start justify-center px-6 py-12 md:px-10">
      <p className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold tracking-wide text-blue-700 uppercase dark:bg-blue-950/60 dark:text-blue-200">
        Quantified Self
      </p>
      <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100 md:text-5xl">
        Rogue and River
      </h1>
      <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-700 dark:text-slate-300">
        Track swimming, hiking, workouts, reading, and gaming in one clean
        dashboard with streaks, charts, and achievements.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/dashboard"
          className="rounded-lg bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
        >
          Open dashboard
        </Link>
        <Link
          href="/signup"
          className="rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
        >
          Create account
        </Link>
      </div>
    </main>
  );
}

