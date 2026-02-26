import { SummaryCard } from "@/components/summary-card";
import { logout } from "@/app/auth/actions";
import { requireUser } from "@/lib/auth/guard";

const hobbySummaries = [
  {
    title: "Swimming",
    metric: "4.8 km this week",
    streak: "Streak: 3 days",
    href: "/hobby/swimming",
  },
  {
    title: "Hiking",
    metric: "12.4 mi this month",
    streak: "Streak: 2 weeks",
    href: "/hobby/hiking",
  },
  {
    title: "Workouts",
    metric: "5 sessions this week",
    streak: "Streak: 6 days",
    href: "/hobby/workout",
  },
  {
    title: "Reading",
    metric: "220 pages this week",
    streak: "Streak: 9 days",
    href: "/hobby/reading",
  },
  {
    title: "Gaming",
    metric: "7.5 hours this week",
    streak: "Streak: 4 days",
    href: "/hobby/gaming",
  },
];

export default async function DashboardPage() {
  await requireUser();

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-10 md:px-10">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-xs font-semibold tracking-wider text-blue-700 uppercase dark:text-blue-300">
            Dashboard
          </p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900 dark:text-slate-100">
            Your quantified self overview
          </h1>
          <p className="mt-2 text-slate-700 dark:text-slate-300">
            Starter layout with mock stats. Next step: wire real data from
            Supabase.
          </p>
        </div>
        <form action={logout}>
          <button
            type="submit"
            className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
          >
            Log out
          </button>
        </form>
      </div>

      <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {hobbySummaries.map((item) => (
          <SummaryCard key={item.title} {...item} />
        ))}
      </section>

      <section className="bg-surface border-border mt-8 rounded-2xl border p-5">
        <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Quick add</h2>
        <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">
          These buttons will open log forms in the next step.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {["Swim", "Hike", "Workout", "Reading", "Gaming"].map((name) => (
            <button
              key={name}
              type="button"
              className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
            >
              + {name}
            </button>
          ))}
        </div>
      </section>
    </main>
  );
}
