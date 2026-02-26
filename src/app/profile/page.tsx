import { requireUser } from "@/lib/auth/guard";
import { createClient } from "@/lib/supabase/server";

type AchievementRow = {
  id: string;
  hobby_type: string;
  title: string;
  description: string;
  earned_at: string;
};

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

export default async function ProfilePage() {
  const user = await requireUser();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("achievements")
    .select("id, hobby_type, title, description, earned_at")
    .eq("user_id", user.id)
    .order("earned_at", { ascending: false });

  const achievements = ((error ? [] : data) ?? []) as AchievementRow[];

  return (
    <main className="mx-auto w-full max-w-4xl px-6 py-10 md:px-10">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Profile</h1>
      <p className="mt-2 text-slate-700 dark:text-slate-300">
        Track your earned badges and milestones.
      </p>
      <section className="bg-surface border-border mt-6 rounded-2xl border p-5">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Badges</h2>
          <span className="text-sm text-slate-600 dark:text-slate-300">
            {achievements.length} earned
          </span>
        </div>
        {achievements.length === 0 ? (
          <p className="mt-4 rounded-md border border-dashed border-slate-300 p-4 text-sm text-slate-600 dark:border-slate-700 dark:text-slate-300">
            No badges yet. Keep logging activities to unlock achievements.
          </p>
        ) : (
          <ul className="mt-3 space-y-2 text-sm text-slate-700 dark:text-slate-200">
            {achievements.map((badge) => (
              <li
                key={badge.id}
                className="rounded-md bg-slate-50 px-3 py-3 dark:bg-slate-800"
              >
                <p className="font-semibold text-slate-900 dark:text-slate-100">{badge.title}</p>
                <p className="mt-1 text-slate-700 dark:text-slate-300">{badge.description}</p>
                <p className="mt-1 text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  {badge.hobby_type} • {formatDate(badge.earned_at)}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
