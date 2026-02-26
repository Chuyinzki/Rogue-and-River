import Link from "next/link";

import { requireUser } from "@/lib/auth/guard";

type HobbyPageProps = {
  params: Promise<{ type: string }>;
};

export default async function HobbyTypePage({ params }: HobbyPageProps) {
  await requireUser();
  const { type } = await params;
  const heading = type.charAt(0).toUpperCase() + type.slice(1);

  return (
    <main className="mx-auto w-full max-w-4xl px-6 py-10 md:px-10">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">{heading}</h1>
          <p className="mt-2 text-slate-700 dark:text-slate-300">
            This page will include log form, activity list, chart, and photos.
          </p>
        </div>
        <Link
          href="/dashboard"
          className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
        >
          Back
        </Link>
      </div>

      <section className="bg-surface border-border mt-6 rounded-2xl border p-5">
        <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">New log</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <input
            type="date"
            className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
          />
          <input
            type="text"
            className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
            placeholder="Duration or key metric"
          />
        </div>
      </section>
    </main>
  );
}
