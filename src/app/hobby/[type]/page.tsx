import Link from "next/link";

import {
  createGamingLog,
  createHikingLog,
  createReadingLog,
  createSwimmingLog,
  createWorkoutLog,
} from "@/app/hobby/actions";
import { HobbyLogForm } from "@/components/hobby/hobby-log-form";
import { HobbyRecentSessions } from "@/components/hobby/hobby-recent-sessions";
import { SwimmingWeeklyChart } from "@/components/swimming-weekly-chart";
import { requireUser } from "@/lib/auth/guard";
import {
  hobbyDescriptions,
  hobbyTitles,
  isHobbyType,
  type HobbyType,
} from "@/lib/hobby-config";
import {
  getGamingDurationMinutes,
  getHikingDistanceKm,
  getReadingPages,
  getSwimmingDistanceMeters,
  getWorkoutDurationMinutes,
  sortByDateDesc,
  type HobbyLog,
} from "@/lib/hobby-metrics";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type HobbyPageProps = {
  params: Promise<{ type: string }>;
  searchParams: Promise<{ error?: string; message?: string }>;
};

type HobbyLogRow = HobbyLog & { id: string };

function toNumber(value: unknown) {
  return Number(value ?? 0);
}

export default async function HobbyTypePage({
  params,
  searchParams,
}: HobbyPageProps) {
  const user = await requireUser();
  const { type } = await params;
  const { error, message } = await searchParams;

  if (!isHobbyType(type)) {
    return (
      <main className="mx-auto w-full max-w-4xl px-6 py-10 md:px-10">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
          Unknown hobby type
        </h1>
        <p className="mt-2 text-slate-700 dark:text-slate-300">
          This route is not supported yet.
        </p>
      </main>
    );
  }

  const hobbyType: HobbyType = type;
  const supabase = await createClient();
  const { data, error: queryError } = await supabase
    .from("hobby_logs")
    .select("id, hobby_type, date, details")
    .eq("user_id", user.id)
    .eq("hobby_type", hobbyType)
    .order("date", { ascending: false })
    .limit(100);

  const logs = sortByDateDesc(((queryError ? [] : data) ?? []) as HobbyLogRow[]);

  const formAction =
    hobbyType === "swimming"
      ? createSwimmingLog
      : hobbyType === "hiking"
        ? createHikingLog
        : hobbyType === "workout"
          ? createWorkoutLog
          : hobbyType === "reading"
            ? createReadingLog
            : createGamingLog;

  const totalSessions = logs.length;
  const totalDistanceKm =
    hobbyType === "swimming"
      ? logs.reduce((sum, log) => sum + getSwimmingDistanceMeters(log), 0) / 1000
      : hobbyType === "hiking"
        ? logs.reduce((sum, log) => sum + getHikingDistanceKm(log), 0)
        : 0;

  const totalMinutes =
    hobbyType === "workout"
      ? logs.reduce((sum, log) => sum + getWorkoutDurationMinutes(log), 0)
      : hobbyType === "gaming"
        ? logs.reduce((sum, log) => sum + getGamingDurationMinutes(log), 0)
        : hobbyType === "swimming" || hobbyType === "hiking"
          ? logs.reduce((sum, log) => sum + toNumber(log.details?.duration_minutes), 0)
          : 0;

  const totalPages =
    hobbyType === "reading"
      ? logs.reduce((sum, log) => sum + getReadingPages(log), 0)
      : 0;
  const readingFinishedCount =
    hobbyType === "reading"
      ? logs.filter((log) => log.details?.finished === true).length
      : 0;

  const swimmingByDate =
    hobbyType === "swimming"
      ? logs.reduce<Record<string, number>>((acc, log) => {
          const distance = getSwimmingDistanceMeters(log);
          acc[log.date] = (acc[log.date] ?? 0) + distance;
          return acc;
        }, {})
      : {};

  const swimmingChartData = Object.entries(swimmingByDate)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, distanceMeters]) => ({
      label: new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
      }).format(new Date(date)),
      distanceKm: Number((distanceMeters / 1000).toFixed(2)),
    }));

  const swimmingBestKm =
    hobbyType === "swimming"
      ? Math.max(...logs.map((log) => getSwimmingDistanceMeters(log)), 0) / 1000
      : 0;

  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-10 md:px-10">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
            {hobbyTitles[hobbyType]}
          </h1>
          <p className="mt-2 text-slate-700 dark:text-slate-300">
            {hobbyDescriptions[hobbyType]}
          </p>
        </div>
        <Link
          href="/dashboard"
          className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
        >
          Back
        </Link>
      </div>

      <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <article className="bg-surface border-border rounded-2xl border p-5">
          <p className="text-sm text-slate-600 dark:text-slate-300">Sessions</p>
          <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100">
            {totalSessions}
          </p>
        </article>
        <article className="bg-surface border-border rounded-2xl border p-5">
          <p className="text-sm text-slate-600 dark:text-slate-300">
            {hobbyType === "reading"
              ? "Pages read"
              : hobbyType === "swimming" || hobbyType === "hiking"
                ? "Distance"
                : "Duration"}
          </p>
          <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100">
            {hobbyType === "reading"
              ? `${totalPages} pages`
              : hobbyType === "swimming" || hobbyType === "hiking"
                ? `${totalDistanceKm.toFixed(2)} km`
                : `${totalMinutes} min`}
          </p>
        </article>
        <article className="bg-surface border-border rounded-2xl border p-5">
          <p className="text-sm text-slate-600 dark:text-slate-300">Highlight</p>
          <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100">
            {hobbyType === "swimming"
              ? `${swimmingBestKm.toFixed(2)} km best`
              : hobbyType === "gaming"
                ? `${(totalMinutes / 60).toFixed(1)} hours`
                : hobbyType === "reading"
                  ? `Books finished: ${readingFinishedCount}`
                  : "On track"}
          </p>
        </article>
      </section>

      <HobbyLogForm
        hobbyType={hobbyType}
        action={formAction}
        error={error}
        message={message}
      />

      {hobbyType === "swimming" ? (
        <section className="bg-surface border-border mt-6 rounded-2xl border p-5">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
            Distance trend
          </h2>
          <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">
            One point per day (aggregated distance).
          </p>
          {swimmingChartData.length > 0 ? (
            <div className="mt-4">
              <SwimmingWeeklyChart data={swimmingChartData} />
            </div>
          ) : (
            <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">
              No data yet. Add your first swim log above.
            </p>
          )}
        </section>
      ) : null}

      <HobbyRecentSessions hobbyType={hobbyType} logs={logs} />
    </main>
  );
}
