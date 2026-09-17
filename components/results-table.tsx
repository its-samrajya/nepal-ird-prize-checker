"use client";

import { useMemo, useState } from "react";
import type { CouponResult } from "@/lib/winners";
import { uniqueCategories, uniqueFiscalYears } from "@/lib/winners";

export type ResultFilter =
  | { type: "all" }
  | { type: "found" }
  | { type: "notfound" }
  | { type: "category"; value: string }
  | { type: "fiscalyear"; value: string };

interface ResultsTableProps {
  results: CouponResult[];
}

function formatDate(iso?: string): string {
  if (!iso) return "—";
  return iso.slice(0, 10);
}

function matchesFilter(result: CouponResult, filter: ResultFilter): boolean {
  switch (filter.type) {
    case "all":
      return true;
    case "found":
      return result.winner !== null;
    case "notfound":
      return result.winner === null;
    case "category":
      return result.winner?.category === filter.value;
    case "fiscalyear":
      return result.winner?.fiscalYear === filter.value;
    default:
      return true;
  }
}

export default function ResultsTable({ results }: ResultsTableProps) {
  const [filter, setFilter] = useState<ResultFilter>({ type: "all" });

  const categories = useMemo(() => uniqueCategories(results), [results]);
  const fiscalYears = useMemo(() => uniqueFiscalYears(results), [results]);

  const filtered: CouponResult[] = useMemo(
    () => results.filter((r) => matchesFilter(r, filter)),
    [results, filter],
  );

  const foundCount = useMemo(
    () => results.filter((r) => r.winner).length,
    [results],
  );

  const filterButton = (label: string, active: boolean) =>
    `rounded-lg px-3 py-1.5 text-sm cursor-pointer font-medium transition-colors ${
      active
        ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
        : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
    }`;

  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
          Results
        </h2>
        <span className="text-xs text-zinc-500 dark:text-zinc-400">
          Showing {filtered.length.toLocaleString()} of{" "}
          {results.length.toLocaleString()} checked
        </span>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setFilter({ type: "all" })}
          className={filterButton("all", filter.type === "all")}
        >
          All
        </button>
        <button
          type="button"
          onClick={() => setFilter({ type: "found" })}
          className={filterButton("found", filter.type === "found")}
        >
          Winners ({foundCount})
        </button>
        <button
          type="button"
          onClick={() => setFilter({ type: "notfound" })}
          className={filterButton("notfound", filter.type === "notfound")}
        >
          Not Found
        </button>
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => setFilter({ type: "category", value: category })}
            className={filterButton(
              category,
              filter.type === "category" && filter.value === category,
            )}
          >
            {category}
          </button>
        ))}
        {fiscalYears.map((year) => (
          <button
            key={year}
            type="button"
            onClick={() => setFilter({ type: "fiscalyear", value: year })}
            className={filterButton(
              year,
              filter.type === "fiscalyear" && filter.value === year,
            )}
          >
            FY {year}
          </button>
        ))}
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-zinc-200 text-xs uppercase tracking-wide text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
              <th className="py-2 pr-4 font-medium">Coupon Number</th>
              <th className="py-2 pr-4 font-medium">Status</th>
              <th className="py-2 pr-4 font-medium">Prize</th>
              <th className="py-2 pr-4 font-medium">Rank</th>
              <th className="py-2 pr-4 font-medium">Fiscal Year</th>
              <th className="py-2 pr-4 font-medium">Draw Period</th>
              <th className="py-2 font-medium">Claim Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((result) => {
              const { couponNumber, winner } = result;
              return (
                <tr
                  key={couponNumber}
                  className="border-b border-zinc-100 last:border-0 dark:border-zinc-800/50"
                >
                  <td className="py-2.5 pr-4 font-mono tabular-nums text-zinc-900 dark:text-zinc-100">
                    {couponNumber}
                  </td>
                  <td className="py-2.5 pr-4">
                    {winner ? (
                      <span className="inline-flex items-center gap-1.5 font-medium text-green-700 dark:text-green-400">
                        <span aria-hidden="true">✓</span> FOUND
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 font-medium text-zinc-500 dark:text-zinc-400">
                        <span aria-hidden="true">✕</span> NOT FOUND
                      </span>
                    )}
                  </td>
                  <td className="py-2.5 pr-4 text-zinc-600 dark:text-zinc-300">
                    {winner?.category ?? "—"}
                  </td>
                  <td className="py-2.5 pr-4 tabular-nums text-zinc-600 dark:text-zinc-300">
                    {winner?.rank || "—"}
                  </td>
                  <td className="py-2.5 pr-4 text-zinc-600 dark:text-zinc-300">
                    {winner?.fiscalYear || "—"}
                  </td>
                  <td className="py-2.5 pr-4 text-zinc-600 dark:text-zinc-300">
                    {winner
                      ? `${formatDate(winner.eligibleFrom)} – ${formatDate(winner.eligibleTo)}`
                      : "—"}
                  </td>
                  <td className="py-2.5">
                    {winner ? (
                      winner.claimOpen ? (
                        <span className="inline-flex items-center gap-1.5 font-medium text-green-700 dark:text-green-400">
                          <span aria-hidden="true">•</span> Claim Open
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 font-medium text-zinc-500 dark:text-zinc-400">
                          <span aria-hidden="true">•</span> Claim Closed
                        </span>
                      )
                    ) : (
                      "—"
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <p className="py-8 text-center text-sm text-zinc-500 dark:text-zinc-400">
            No results match the selected filter.
          </p>
        )}
      </div>
    </section>
  );
}
