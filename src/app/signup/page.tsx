import Link from "next/link";

export default function SignupPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-6">
      <h1 className="text-3xl font-bold text-slate-900">Create account</h1>
      <p className="mt-2 text-slate-600">
        Start your dashboard with email and password.
      </p>
      <form className="bg-surface border-border mt-6 space-y-4 rounded-2xl border p-5">
        <label className="block">
          <span className="text-sm text-slate-700">Email</span>
          <input
            type="email"
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
            placeholder="you@example.com"
          />
        </label>
        <label className="block">
          <span className="text-sm text-slate-700">Password</span>
          <input
            type="password"
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
            placeholder="Minimum 8 characters"
          />
        </label>
        <button
          type="button"
          className="w-full rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
        >
          Sign up
        </button>
      </form>
      <p className="mt-4 text-sm text-slate-600">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-blue-700">
          Log in
        </Link>
      </p>
    </main>
  );
}
