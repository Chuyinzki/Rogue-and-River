import type { HobbyType } from "@/lib/hobby-config";
import { hobbyTitles } from "@/lib/hobby-config";

type HobbyLogFormProps = {
  hobbyType: HobbyType;
  action: (formData: FormData) => void | Promise<void>;
  error?: string;
  message?: string;
};

export function HobbyLogForm({ hobbyType, action, error, message }: HobbyLogFormProps) {
  return (
    <section className="bg-surface border-border mt-6 rounded-2xl border p-5">
      <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
        New {hobbyTitles[hobbyType].toLowerCase()} log
      </h2>
      <form action={action} className="mt-3 grid gap-3 md:grid-cols-2">
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
        {error ? <p className="text-sm text-red-700 md:col-span-2 dark:text-red-400">{error}</p> : null}
        {message ? (
          <p className="text-sm text-emerald-700 md:col-span-2 dark:text-emerald-400">
            {message}
          </p>
        ) : null}
      </form>
    </section>
  );
}
