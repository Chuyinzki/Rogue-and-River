import Link from "next/link";

import { login } from "@/app/auth/actions";

type LoginPageProps = {
  searchParams: Promise<{ error?: string; message?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { error, message } = await searchParams;

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-6">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Log in</h1>
      <p className="mt-2 text-slate-700 dark:text-slate-300">Welcome back to Rogue and River.</p>
      <form
        action={login}
        className="bg-surface border-border mt-6 space-y-4 rounded-2xl border p-5"
      >
        <label className="block">
          <span className="text-sm text-slate-700 dark:text-slate-200">Email</span>
          <input
            name="email"
            type="email"
            required
            className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
            placeholder="you@example.com"
          />
        </label>
        <label className="block">
          <span className="text-sm text-slate-700 dark:text-slate-200">Password</span>
          <input
            name="password"
            type="password"
            required
            className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
            placeholder="********"
          />
        </label>
        <button
          type="submit"
          className="w-full rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
        >
          Log in
        </button>
        {error ? <p className="text-sm text-red-700">{error}</p> : null}
        {message ? <p className="text-sm text-emerald-700">{message}</p> : null}
      </form>
      <p className="mt-4 text-sm text-slate-700 dark:text-slate-300">
        Need an account?{" "}
        <Link href="/signup" className="font-semibold text-blue-700 dark:text-blue-300">
          Sign up
        </Link>
      </p>
    </main>
  );
}
