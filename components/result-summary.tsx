"use client";

interface ResultSummaryProps {
  total: number;
  winners: number;
  notFound: number;
}

export default function ResultSummary({
  total,
  winners,
  notFound,
}: ResultSummaryProps) {
  const stats = [
    { label: "Total checked", value: total },
    { label: "Winners found", value: winners },
    { label: "Not found", value: notFound },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
        >
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            {stat.label}
          </p>
          <p className="mt-1 text-3xl font-semibold tabular-nums text-zinc-900 dark:text-zinc-100">
            {stat.value.toLocaleString()}
          </p>
        </div>
      ))}
    </div>
  );
}