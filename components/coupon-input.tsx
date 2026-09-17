"use client";

interface CouponInputProps {
  value: string;
  onChange: (value: string) => void;
  onCheck: () => void;
  loading: boolean;
  hasResults: boolean;
}

export default function CouponInput({
  value,
  onChange,
  onCheck,
  loading,
  hasResults,
}: CouponInputProps) {
  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
        Paste your coupon numbers below
      </h2>
      <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
        One coupon number per line. Empty lines and duplicates are ignored.
      </p>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={"048915618211\n047751629120\n053777634226"}
        spellCheck={false}
        autoCorrect="off"
        autoCapitalize="off"
        rows={8}
        aria-label="Coupon numbers"
        className="mt-4 w-full resize-y rounded-xl border border-zinc-300 bg-white p-4 font-mono text-sm text-zinc-900 outline-none transition-colors placeholder:text-zinc-400 focus:border-zinc-500 focus:ring-2 focus:ring-zinc-300 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100 dark:placeholder:text-zinc-600 dark:focus:border-zinc-500 dark:focus:ring-zinc-800"
      />
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={onCheck}
          disabled={loading || !value.trim()}
          className="rounded-xl bg-zinc-900 cursor-pointer px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
        >
          {loading ? "Checking..." : "Check Numbers"}
        </button>
        <button
          type="button"
          onClick={() => onChange("")}
          disabled={loading || !value}
          className="rounded-xl cursor-pointer border border-zinc-300 px-5 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
        >
          Clear
        </button>
        {hasResults && (
          <span className="text-xs text-zinc-500 dark:text-zinc-400">
            Results shown are for the current input. Paste new numbers and check
            again.
          </span>
        )}
      </div>
    </section>
  );
}
