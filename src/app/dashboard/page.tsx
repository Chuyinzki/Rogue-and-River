import Link from "next/link";

import { logout } from "@/app/auth/actions";
import { SummaryCard } from "@/components/summary-card";
import { requireUser } from "@/lib/auth/guard";
import {
  getCurrentStreakDays,
  getGamingDurationMinutes,
  getHikingDistanceKm,
  getReadingPages,
  getSwimmingDistanceMeters,
  getWorkoutDurationMinutes,
  type HobbyLog,
} from "@/lib/hobby-metrics";
import { hobbyTitles, supportedHobbyTypes } from "@/lib/hobby-config";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const user = await requireUser();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("hobby_logs")
    .select("hobby_type, date, details")
    .eq("user_id", user.id)
    .order("date", { ascending: false })
    .limit(1000);

  const logs = ((error ? [] : data) ?? []) as HobbyLog[];
  const { data: achievementsData, error: achievementsError } = await supabase
    .from("achievements")
    .select("id")
    .eq("user_id", user.id);
  const achievementsCount = ((achievementsError ? [] : achievementsData) ?? []).length;

  const hobbySummaries = supportedHobbyTypes.map((key) => {
    const title = hobbyTitles[key];
    const href = `/hobby/${key}`;
    const hobbyLogs = logs.filter((log) => log.hobby_type === key);
    const streak = getCurrentStreakDays(hobbyLogs.map((log) => log.date));

    if (hobbyLogs.length === 0) {
      return {
        title,
        metric: "No logs yet",
        streak: "Streak: 0 days",
        href,
      };
    }

    if (key === "swimming") {
      const totalMeters = hobbyLogs.reduce(
        (sum, log) => sum + getSwimmingDistanceMeters(log),
        0,
      );
      const bestMeters = hobbyLogs.reduce(
        (best, log) => Math.max(best, getSwimmingDistanceMeters(log)),
        0,
      );
      return {
        title,
        metric: `${(totalMeters / 1000).toFixed(2)} km total`,
        streak: `Streak: ${streak} days | Best: ${(bestMeters / 1000).toFixed(2)} km`,
        href,
      };
    }

    if (key === "hiking") {
      const totalKm = hobbyLogs.reduce((sum, log) => sum + getHikingDistanceKm(log), 0);
      return {
        title,
        metric: `${totalKm.toFixed(1)} km total`,
        streak: `Streak: ${streak} days`,
        href,
      };
    }

    if (key === "workout") {
      const totalMinutes = hobbyLogs.reduce(
        (sum, log) => sum + getWorkoutDurationMinutes(log),
        0,
      );
      return {
        title,
        metric: `${hobbyLogs.length} sessions (${totalMinutes} min)`,
        streak: `Streak: ${streak} days`,
        href,
      };
    }

    if (key === "reading") {
      const totalPages = hobbyLogs.reduce((sum, log) => sum + getReadingPages(log), 0);
      const finishedCount = hobbyLogs.filter(
        (log) => log.details?.finished === true,
      ).length;
      return {
        title,
        metric: `${totalPages} pages read`,
        streak: `Streak: ${streak} days | Finished: ${finishedCount}`,
        href,
      };
    }

    const totalHours =
      hobbyLogs.reduce((sum, log) => sum + getGamingDurationMinutes(log), 0) / 60;
    return {
      title,
      metric: `${totalHours.toFixed(1)} hours played`,
      streak: `Streak: ${streak} days`,
      href,
    };
  });

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
            Live summary values from your hobby logs in Supabase.
          </p>
          <Link
            href="/profile"
            className="mt-3 inline-flex rounded-md border border-slate-300 bg-white px-3 py-1 text-xs font-semibold tracking-wide text-slate-700 uppercase dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
          >
            Badges earned: {achievementsCount}
          </Link>
        </div>
        <form action={logout}>
          <button
            type="submit"
            className="cursor-pointer rounded-md border border-slate-400 bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-800 shadow-sm transition hover:bg-slate-200 active:translate-y-px dark:border-slate-500 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
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
          Jump into any module and add a new activity.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {supportedHobbyTypes.map((hobbyType) => (
            <Link
              key={hobbyType}
              href={`/hobby/${hobbyType}`}
              className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
            >
              + {hobbyTitles[hobbyType]}
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
