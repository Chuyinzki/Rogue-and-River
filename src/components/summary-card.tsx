import Link from "next/link";

type SummaryCardProps = {
  title: string;
  metric: string;
  streak: string;
  href: string;
};

export function SummaryCard({ title, metric, streak, href }: SummaryCardProps) {
  return (
    <Link
      href={href}
      className="bg-surface border-border hover:border-blue-400 dark:hover:border-blue-500 block rounded-2xl border p-5 transition-colors"
    >
      <p className="text-sm font-medium text-slate-600 dark:text-slate-300">{title}</p>
      <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100">{metric}</p>
      <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">{streak}</p>
    </Link>
  );
}
