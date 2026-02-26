import Link from "next/link";

import { createSwimmingLog } from "@/app/hobby/actions";
import { SwimmingWeeklyChart } from "@/components/swimming-weekly-chart";
import { requireUser } from "@/lib/auth/guard";
import { createClient } from "@/lib/supabase/server";

type HobbyPageProps = {
  params: Promise<{ type: string }>;
  searchParams: Promise<{ error?: string; message?: string }>;
};

type SwimmingLogRow = {
  id: string;
  date: string;
  details: {
    distance_meters?: number;
    duration_minutes?: number;
    location?: string;
  };
};

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

export default async function HobbyTypePage({
  params,
  searchParams,
}: HobbyPageProps) {
  const user = await requireUser();
  const { type } = await params;
  const { error, message } = await searchParams;
  const heading = type.charAt(0).toUpperCase() + type.slice(1);

  if (type !== "swimming") {
    return (
      <main className="mx-auto w-full max-w-4xl px-6 py-10 md:px-10">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
              {heading}
            </h1>
            <p className="mt-2 text-slate-700 dark:text-slate-300">
              This module is planned for Step 5. Swimming is the first fully
              implemented hobby.
            </p>
          </div>
          <Link
            href="/dashboard"
            className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
          >
            Back
          </Link>
        </div>
      </main>
    );
  }

  const supabase = await createClient();
  const { data, error: queryError } = await supabase
    .from("hobby_logs")
    .select("id, date, details")
    .eq("user_id", user.id)
    .eq("hobby_type", "swimming")
    .order("date", { ascending: false })
    .limit(30);

  const logs = ((queryError ? [] : data) ?? []) as SwimmingLogRow[];

  const totalDistanceMeters = logs.reduce(
    (sum, log) => sum + Number(log.details?.distance_meters ?? 0),
    0,
  );
  const personalBestMeters = logs.reduce(
    (best, log) => Math.max(best, Number(log.details?.distance_meters ?? 0)),
    0,
  );

  const distanceByDate = logs.reduce<Record<string, number>>((acc, log) => {
    const distance = Number(log.details?.distance_meters ?? 0);
    acc[log.date] = (acc[log.date] ?? 0) + distance;
    return acc;
  }, {});

  const chartData = Object.entries(distanceByDate)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, distanceMeters]) => ({
      label: new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
      }).format(new Date(date)),
      distanceKm: Number((distanceMeters / 1000).toFixed(2)),
    }));

  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-10 md:px-10">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
            Swimming
          </h1>
          <p className="mt-2 text-slate-700 dark:text-slate-300">
            Log sessions, track distance trends, and monitor your best swims.
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
          <p className="text-sm text-slate-600 dark:text-slate-300">Total distance</p>
          <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100">
            {(totalDistanceMeters / 1000).toFixed(2)} km
          </p>
        </article>
        <article className="bg-surface border-border rounded-2xl border p-5">
          <p className="text-sm text-slate-600 dark:text-slate-300">Personal best</p>
          <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100">
            {(personalBestMeters / 1000).toFixed(2)} km
          </p>
        </article>
        <article className="bg-surface border-border rounded-2xl border p-5">
          <p className="text-sm text-slate-600 dark:text-slate-300">Sessions logged</p>
          <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100">
            {logs.length}
          </p>
        </article>
      </section>

      <section className="bg-surface border-border mt-6 rounded-2xl border p-5">
        <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">New swim log</h2>
        <form action={createSwimmingLog} className="mt-3 grid gap-3 md:grid-cols-2">
          <input
            name="date"
            type="date"
            required
            className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
          />
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
          <button
            type="submit"
            className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200 md:col-span-2"
          >
            Save swim
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

      <section className="bg-surface border-border mt-6 rounded-2xl border p-5">
        <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
          Distance trend
        </h2>
        <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">
          Last {logs.length} swimming sessions.
        </p>
        {chartData.length > 0 ? (
          <div className="mt-4">
            <SwimmingWeeklyChart data={chartData} />
          </div>
        ) : (
          <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">
            No data yet. Add your first swim log above.
          </p>
        )}
      </section>

      <section className="bg-surface border-border mt-6 rounded-2xl border p-5">
        <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
          Recent sessions
        </h2>
        {logs.length === 0 ? (
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
            No swims logged yet.
          </p>
        ) : (
          <ul className="mt-3 space-y-2">
            {logs.map((log) => {
              const distanceMeters = Number(log.details?.distance_meters ?? 0);
              const durationMinutes = Number(log.details?.duration_minutes ?? 0);
              const pace = durationMinutes > 0 ? durationMinutes / (distanceMeters / 1000) : 0;

              return (
                <li
                  key={log.id}
                  className="rounded-md border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800"
                >
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    {formatDate(log.date)}
                  </p>
                  <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">
                    {(distanceMeters / 1000).toFixed(2)} km in {durationMinutes} min
                    {Number.isFinite(pace) && pace > 0
                      ? ` (${pace.toFixed(1)} min/km)`
                      : ""}
                  </p>
                  {log.details?.location ? (
                    <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                      {log.details.location}
                    </p>
                  ) : null}
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </main>
  );
}
