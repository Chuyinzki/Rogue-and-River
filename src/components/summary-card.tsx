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
      className="bg-surface border-border hover:border-blue-300 block rounded-2xl border p-5 transition-colors"
    >
      <p className="text-sm font-medium text-slate-500">{title}</p>
      <p className="mt-2 text-2xl font-bold text-slate-800">{metric}</p>
      <p className="mt-1 text-sm text-slate-600">{streak}</p>
    </Link>
  );
}
