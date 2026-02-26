import Link from "next/link";
import { redirect } from "next/navigation";

import { deleteHobbyLog, updateHobbyLog } from "@/app/hobby/actions";
import { requireUser } from "@/lib/auth/guard";
import {
  isHobbyType,
  type HobbyType,
} from "@/lib/hobby-config";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type EditPageProps = {
  params: Promise<{ type: string; id: string }>;
  searchParams: Promise<{ error?: string }>;
};

type HobbyLogRow = {
  id: string;
  hobby_type: HobbyType;
  date: string;
  details: Record<string, unknown> | null;
};

function toNumber(value: unknown) {
  return Number(value ?? 0);
}

export default async function EditHobbyLogPage({ params, searchParams }: EditPageProps) {
  const user = await requireUser();
  const { type, id } = await params;
  const { error } = await searchParams;

  if (!isHobbyType(type)) {
    redirect("/dashboard");
  }

  const hobbyType: HobbyType = type;
  const supabase = await createClient();
  const { data, error: queryError } = await supabase
    .from("hobby_logs")
    .select("id, hobby_type, date, details")
    .eq("id", id)
    .eq("user_id", user.id)
    .eq("hobby_type", hobbyType)
    .maybeSingle();

  if (queryError || !data) {
    redirect(`/hobby/${hobbyType}?error=Log%20not%20found.`);
  }

  const log = data as HobbyLogRow;

  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-10 md:px-10">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          Edit {hobbyType} log
        </h1>
        <Link
          href={`/hobby/${hobbyType}`}
          className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
        >
          Back
        </Link>
      </div>

      <section className="bg-surface border-border mt-6 rounded-2xl border p-5">
        <form action={updateHobbyLog} className="grid gap-3 md:grid-cols-2">
          <input type="hidden" name="log_id" value={log.id} />
          <input type="hidden" name="hobby_type" value={hobbyType} />
          <input
            name="date"
            type="date"
            required
            defaultValue={log.date}
            className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
          />

          {hobbyType === "swimming" ? (
            <>
              <input
                name="distance_meters"
                type="number"
                min={1}
                required
                defaultValue={toNumber(log.details?.distance_meters)}
                className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
                placeholder="Distance (meters)"
              />
              <input
                name="duration_minutes"
                type="number"
                min={1}
                required
                defaultValue={toNumber(log.details?.duration_minutes)}
                className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
                placeholder="Duration (minutes)"
              />
              <input
                name="location"
                type="text"
                defaultValue={String(log.details?.location ?? "")}
                className="md:col-span-2 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
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
                defaultValue={toNumber(log.details?.distance_km)}
                className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
                placeholder="Distance (km)"
              />
              <input
                name="duration_minutes"
                type="number"
                min={1}
                required
                defaultValue={toNumber(log.details?.duration_minutes)}
                className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
                placeholder="Duration (minutes)"
              />
              <input
                name="trail"
                type="text"
                defaultValue={String(log.details?.trail ?? "")}
                className="md:col-span-2 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
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
                defaultValue={String(log.details?.workout_type ?? "")}
                className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
                placeholder="Workout type"
              />
              <input
                name="duration_minutes"
                type="number"
                min={1}
                required
                defaultValue={toNumber(log.details?.duration_minutes)}
                className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
                placeholder="Duration (minutes)"
              />
              <input
                name="reps"
                type="number"
                min={1}
                defaultValue={toNumber(log.details?.reps) || ""}
                className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
                placeholder="Reps (optional)"
              />
              <input
                name="weight_kg"
                type="number"
                min={1}
                step="0.5"
                defaultValue={toNumber(log.details?.weight_kg) || ""}
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
                defaultValue={String(log.details?.book_title ?? "")}
                className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
                placeholder="Book title"
              />
              <input
                name="pages_read"
                type="number"
                min={1}
                required
                defaultValue={toNumber(log.details?.pages_read)}
                className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
                placeholder="Pages read"
              />
              <input
                name="notes"
                type="text"
                defaultValue={String(log.details?.notes ?? "")}
                className="md:col-span-2 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
                placeholder="Notes (optional)"
              />
              <label className="md:col-span-2 inline-flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                <input
                  name="finished"
                  type="checkbox"
                  defaultChecked={log.details?.finished === true}
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
                defaultValue={String(log.details?.game_name ?? "")}
                className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
                placeholder="Game name"
              />
              <input
                name="duration_minutes"
                type="number"
                min={1}
                required
                defaultValue={toNumber(log.details?.duration_minutes)}
                className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
                placeholder="Duration (minutes)"
              />
              <input
                name="achievement"
                type="text"
                defaultValue={String(log.details?.achievement ?? "")}
                className="md:col-span-2 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
                placeholder="Achievement unlocked (optional)"
              />
            </>
          ) : null}

          <button
            type="submit"
            className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200 md:col-span-2"
          >
            Save changes
          </button>
          {error ? (
            <p className="text-sm text-red-700 md:col-span-2 dark:text-red-400">{error}</p>
          ) : null}
        </form>
      </section>

      <section className="mt-4">
        <form action={deleteHobbyLog}>
          <input type="hidden" name="log_id" value={log.id} />
          <input type="hidden" name="hobby_type" value={hobbyType} />
          <button
            type="submit"
            className="rounded-md border border-red-300 bg-white px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-50 dark:border-red-500 dark:bg-slate-900 dark:text-red-300 dark:hover:bg-red-950/40"
          >
            Delete log
          </button>
        </form>
      </section>
    </main>
  );
}
