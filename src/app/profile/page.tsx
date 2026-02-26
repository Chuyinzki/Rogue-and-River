import { requireUser } from "@/lib/auth/guard";

const badges = ["5 swims logged", "100 pages read", "3-week hiking streak"];

export default async function ProfilePage() {
  await requireUser();

  return (
    <main className="mx-auto w-full max-w-4xl px-6 py-10 md:px-10">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Profile</h1>
      <p className="mt-2 text-slate-700 dark:text-slate-300">
        User settings and achievements will live here.
      </p>
      <section className="bg-surface border-border mt-6 rounded-2xl border p-5">
        <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Badges</h2>
        <ul className="mt-3 space-y-2 text-sm text-slate-700 dark:text-slate-200">
          {badges.map((badge) => (
            <li key={badge} className="rounded-md bg-slate-50 px-3 py-2 dark:bg-slate-800">
              {badge}
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
