import Link from "next/link";

import type { HobbyType } from "@/lib/hobby-config";

type HobbyLogRow = {
  id: string;
  date: string;
  details: Record<string, unknown> | null;
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

export function HobbyRecentSessions({
  hobbyType,
  logs,
}: {
  hobbyType: HobbyType;
  logs: HobbyLogRow[];
}) {
  return (
    <section className="bg-surface border-border mt-6 rounded-2xl border p-5">
      <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
        Recent sessions
      </h2>
      {logs.length === 0 ? (
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">No logs yet.</p>
      ) : (
        <ul className="mt-3 space-y-2">
          {logs.map((log) => (
            <li
              key={log.id}
              className="rounded-md border border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800"
            >
              <Link
                href={`/hobby/${hobbyType}/${log.id}/edit`}
                className="block p-3 hover:bg-slate-100 dark:hover:bg-slate-700/50"
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
                    {log.details?.trail ? ` | ${String(log.details.trail)}` : ""}
                  </p>
                ) : null}
                {hobbyType === "workout" ? (
                  <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">
                    {String(log.details?.workout_type ?? "Workout")} |{" "}
                    {toNumber(log.details?.duration_minutes)} min
                    {log.details?.reps ? ` | ${toNumber(log.details.reps)} reps` : ""}
                    {log.details?.weight_kg ? ` | ${toNumber(log.details.weight_kg)} kg` : ""}
                  </p>
                ) : null}
                {hobbyType === "reading" ? (
                  <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">
                    {String(log.details?.book_title ?? "Book")} |{" "}
                    {toNumber(log.details?.pages_read)} pages
                    {log.details?.notes ? ` | ${String(log.details.notes)}` : ""}
                    {log.details?.finished === true ? " | Finished" : ""}
                  </p>
                ) : null}
                {hobbyType === "gaming" ? (
                  <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">
                    {String(log.details?.game_name ?? "Game")} |{" "}
                    {toNumber(log.details?.duration_minutes)} min
                    {log.details?.achievement ? ` | ${String(log.details.achievement)}` : ""}
                  </p>
                ) : null}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
