import Link from "next/link";

import {
  createGamingLog,
  createHikingLog,
  createReadingLog,
  createSwimmingLog,
  createWorkoutLog,
} from "@/app/hobby/actions";
import { SwimmingWeeklyChart } from "@/components/swimming-weekly-chart";
import { requireUser } from "@/lib/auth/guard";
import {
  getGamingDurationMinutes,
  getHikingDistanceKm,
  getReadingPages,
  getSwimmingDistanceMeters,
  getWorkoutDurationMinutes,
  sortByDateDesc,
  type HobbyLog,
  type HobbyType,
} from "@/lib/hobby-metrics";
import { createClient } from "@/lib/supabase/server";

type HobbyPageProps = {
  params: Promise<{ type: string }>;
  searchParams: Promise<{ error?: string; message?: string }>;
};

type HobbyLogRow = HobbyLog & { id: string };

const supportedTypes: HobbyType[] = [
  "swimming",
  "hiking",
  "workout",
  "reading",
  "gaming",
];

const titles: Record<HobbyType, string> = {
  swimming: "Swimming",
  hiking: "Hiking",
  workout: "Workout",
  reading: "Reading",
  gaming: "Gaming",
};

const descriptions: Record<HobbyType, string> = {
  swimming: "Log sessions, track distance trends, and monitor your best swims.",
  hiking: "Track trails, distance, and hike duration over time.",
  workout: "Capture workout type, effort, and progress session by session.",
  reading: "Track books and pages read to keep your reading momentum visible.",
  gaming: "Log game sessions, playtime, and unlocked achievements.",
};

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

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

  if (!supportedTypes.includes(type as HobbyType)) {
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

  const hobbyType = type as HobbyType;
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
        : hobbyType === "swimming"
          ? logs.reduce(
              (sum, log) => sum + toNumber(log.details?.duration_minutes),
              0,
            )
          : hobbyType === "hiking"
            ? logs.reduce(
                (sum, log) => sum + toNumber(log.details?.duration_minutes),
                0,
              )
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
            {titles[hobbyType]}
          </h1>
          <p className="mt-2 text-slate-700 dark:text-slate-300">
            {descriptions[hobbyType]}
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

      <section className="bg-surface border-border mt-6 rounded-2xl border p-5">
        <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
          New {titles[hobbyType].toLowerCase()} log
        </h2>
        <form action={formAction} className="mt-3 grid gap-3 md:grid-cols-2">
          <input
            name="date"
            type="date"
            required
            className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
          />

          {hobbyType === "swimming" ? (
            <>
              <input
                name="distance_meters"
                type="number"
                min={1}
                required
                className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
                placeholder="Distance (meters)"
              />
              <input
                name="duration_minutes"
                type="number"
                min={1}
                required
                className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
                placeholder="Duration (minutes)"
              />
              <input
                name="location"
                type="text"
                className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
                placeholder="Location (optional)"
              />
            </>
          ) : null}

          {hobbyType === "hiking" ? (
            <>
              <input
                name="distance_km"
                type="number"
                min={0.1}
                step="0.1"
                required
                className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
                placeholder="Distance (km)"
              />
              <input
                name="duration_minutes"
                type="number"
                min={1}
                required
                className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
                placeholder="Duration (minutes)"
              />
              <input
                name="trail"
                type="text"
                className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
                placeholder="Trail name (optional)"
              />
            </>
          ) : null}

          {hobbyType === "workout" ? (
            <>
              <input
                name="workout_type"
                type="text"
                required
                className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
                placeholder="Workout type (e.g. Push day)"
              />
              <input
                name="duration_minutes"
                type="number"
                min={1}
                required
                className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
                placeholder="Duration (minutes)"
              />
              <input
                name="reps"
                type="number"
                min={1}
                className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
                placeholder="Reps (optional)"
              />
              <input
                name="weight_kg"
                type="number"
                min={1}
                step="0.5"
                className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
                placeholder="Weight kg (optional)"
              />
            </>
          ) : null}

          {hobbyType === "reading" ? (
            <>
              <input
                name="book_title"
                type="text"
                required
                className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
                placeholder="Book title"
              />
              <input
                name="pages_read"
                type="number"
                min={1}
                required
                className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
                placeholder="Pages read"
              />
              <input
                name="notes"
                type="text"
                className="md:col-span-2 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
                placeholder="Notes (optional)"
              />
              <label className="md:col-span-2 inline-flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                <input
                  name="finished"
                  type="checkbox"
                  className="h-4 w-4 rounded border-slate-300 text-slate-900 dark:border-slate-600"
                />
                Mark as finished
              </label>
            </>
          ) : null}

          {hobbyType === "gaming" ? (
            <>
              <input
                name="game_name"
                type="text"
                required
                className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
                placeholder="Game name"
              />
              <input
                name="duration_minutes"
                type="number"
                min={1}
                required
                className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
                placeholder="Duration (minutes)"
              />
              <input
                name="achievement"
                type="text"
                className="md:col-span-2 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
                placeholder="Achievement unlocked (optional)"
              />
            </>
          ) : null}

          <button
            type="submit"
            className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200 md:col-span-2"
          >
            Save log
          </button>
          {error ? (
            <p className="text-sm text-red-700 md:col-span-2 dark:text-red-400">{error}</p>
          ) : null}
          {message ? (
            <p className="text-sm text-emerald-700 md:col-span-2 dark:text-emerald-400">
              {message}
            </p>
          ) : null}
        </form>
      </section>

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

      <section className="bg-surface border-border mt-6 rounded-2xl border p-5">
        <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
          Recent sessions
        </h2>
        {logs.length === 0 ? (
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
            No logs yet.
          </p>
        ) : (
          <ul className="mt-3 space-y-2">
            {logs.map((log) => (
              <li
                key={log.id}
                className="rounded-md border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800"
              >
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  {formatDate(log.date)}
                </p>
                {hobbyType === "swimming" ? (
                  <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">
                    {(toNumber(log.details?.distance_meters) / 1000).toFixed(2)} km in{" "}
                    {toNumber(log.details?.duration_minutes)} min
                  </p>
                ) : null}
                {hobbyType === "hiking" ? (
                  <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">
                    {toNumber(log.details?.distance_km).toFixed(1)} km in{" "}
                    {toNumber(log.details?.duration_minutes)} min
                    {log.details?.trail ? ` • ${String(log.details.trail)}` : ""}
                  </p>
                ) : null}
                {hobbyType === "workout" ? (
                  <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">
                    {String(log.details?.workout_type ?? "Workout")} •{" "}
                    {toNumber(log.details?.duration_minutes)} min
                    {log.details?.reps ? ` • ${toNumber(log.details.reps)} reps` : ""}
                    {log.details?.weight_kg
                      ? ` • ${toNumber(log.details.weight_kg)} kg`
                      : ""}
                  </p>
                ) : null}
                {hobbyType === "reading" ? (
                  <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">
                    {String(log.details?.book_title ?? "Book")} •{" "}
                    {toNumber(log.details?.pages_read)} pages
                    {log.details?.notes ? ` • ${String(log.details.notes)}` : ""}
                    {log.details?.finished === true ? " • Finished" : ""}
                  </p>
                ) : null}
                {hobbyType === "gaming" ? (
                  <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">
                    {String(log.details?.game_name ?? "Game")} •{" "}
                    {toNumber(log.details?.duration_minutes)} min
                    {log.details?.achievement
                      ? ` • ${String(log.details.achievement)}`
                      : ""}
                  </p>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}

