"use client";

import { useCallback, useRef, useState } from "react";
import CouponInput from "@/components/coupon-input";
import ResultSummary from "@/components/result-summary";
import ResultsTable from "@/components/results-table";
import {
  buildWinnerMap,
  checkCoupons,
  parseCouponInput,
  type CouponResult,
  type WinnersData,
} from "@/lib/winners";
import { FaGithub } from "react-icons/fa";
import Image from "next/image";

const EMPTY_SAMPLE =
  "048915618211\n047751629120\n053777634226\n123456789012\n036447852378\n026888979039";

export default function Home() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<CouponResult[] | null>(null);
  const [invalidLines, setInvalidLines] = useState<string[]>([]);
  const [duplicatesRemoved, setDuplicatesRemoved] = useState(0);
  const winnerDataRef = useRef<WinnersData | null>(null);

  const checkNumbers = useCallback(async () => {
    setError(null);

    const parsed = parseCouponInput(input);
    if (parsed.numbers.length === 0) {
      setError(
        "Enter at least one valid coupon number. Coupon numbers should contain only digits.",
      );
      return;
    }

    setInvalidLines(parsed.invalid);
    setDuplicatesRemoved(parsed.duplicatesRemoved);
    setLoading(true);
    try {
      if (!winnerDataRef.current) {
        const res = await fetch("/api/winners");
        const payload = await res.json().catch(() => null);
        if (!res.ok || payload === null || !Array.isArray(payload.draws)) {
          throw new Error(
            payload?.error ?? "Unable to fetch winner data. Please try again.",
          );
        }
        winnerDataRef.current = payload as WinnersData;
      }

      const winnerMap = buildWinnerMap(winnerDataRef.current.draws);
      const checked = checkCoupons(parsed.numbers, winnerMap);
      setResults(checked);
    } catch (err) {
      setResults(null);
      setError(
        err instanceof Error
          ? err.message
          : "Unable to fetch winner data. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }, [input]);

  const clearResults = useCallback(() => {
    setResults(null);
    setInvalidLines([]);
    setDuplicatesRemoved(0);
    setError(null);
    setInput("");
  }, []);

  const foundCount = results ? results.filter((r) => r.winner).length : 0;

  return (
    <main className="w-full flex-1">
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <header className="mb-8">
          <h1 className="flex gap-4 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            IRD Prize Coupon Checker
            <Image
              src="/nepali-flag.gif"
              alt="Waving Nepal flag"
              width={30}
              height={30}
            />
          </h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            Bulk-check coupon numbers against the official Nepal IRD prize-draw
            winner data.
          </p>
          <button
            type="button"
            onClick={() => setInput(EMPTY_SAMPLE)}
            className="mt-2 text-sm cursor-pointer font-medium text-zinc-500 underline underline-offset-2 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
          >
            Load sample numbers
          </button>
        </header>

        <div className="flex flex-col gap-6">
          <CouponInput
            value={input}
            onChange={setInput}
            onCheck={checkNumbers}
            loading={loading}
            hasResults={results !== null}
          />

          <button
            type="button"
            onClick={clearResults}
            className={`self-start text-sm font-medium cursor-pointer text-zinc-500 underline underline-offset-2 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 ${
              results ? "" : "invisible"
            }`}
          >
            Clear results and input
          </button>

          {loading && (
            <div
              role="status"
              aria-live="polite"
              className="rounded-2xl border border-zinc-200 bg-white p-6 text-center shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
            >
              <p className="text-sm text-zinc-600 dark:text-zinc-300">
                Fetching winner data...
              </p>
            </div>
          )}

          {error && (
            <div
              role="alert"
              className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300"
            >
              {error}
            </div>
          )}

          {!loading && invalidLines.length > 0 && (
            <div
              role="alert"
              className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-200"
            >
              <p className="font-medium">
                {invalidLines.length} invalid input line
                {invalidLines.length === 1 ? "" : "s"} ignored:
              </p>
              <ul className="mt-1 list-inside list-disc font-mono">
                {invalidLines.slice(0, 10).map((line) => (
                  <li key={line}>&quot;{line}&quot;</li>
                ))}
              </ul>
            </div>
          )}

          {!loading && duplicatesRemoved > 0 && (
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              {duplicatesRemoved.toLocaleString()} duplicate
              {duplicatesRemoved === 1 ? "" : "s"} removed from input.
            </p>
          )}

          {!loading && results && (
            <>
              <ResultSummary
                total={results.length}
                winners={foundCount}
                notFound={results.length - foundCount}
              />
              <ResultsTable results={results} />
            </>
          )}
        </div>
        <footer className="mt-5 flex flex-col items-center gap-3 text-center">
          <a
            href="https://github.com/its-samrajya/nepal-ird-prize-checker"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="View project on GitHub"
          >
            <FaGithub className="size-6" />
          </a>

          <p>Vibe Coded with ❤️ by Samrajya</p>
        </footer>
      </div>
    </main>
  );
}
