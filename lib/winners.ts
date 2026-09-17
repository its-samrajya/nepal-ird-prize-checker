export const IRD_WINNERS_API = "https://prize.ird.gov.np/api/v1/public/winners";

export const WINNERS_PAGE_SIZE = 25;

const MAX_PAGES = 1000;

export interface ApiWinner {
  winner_rank?: number | string;
  prize_fiscal_year_code?: string;
  prize_coupon_number?: string;
}

export interface ApiDraw {
  draw_id?: string;
  category_title_en?: string;
  category_title_ne?: string;
  draw_type?: string;
  title_en?: string;
  title_ne?: string;
  eligible_from?: string;
  eligible_to?: string;
  published_at?: string;
  claim_deadline?: string;
  claim_open?: boolean;
  winners?: ApiWinner[];
}

export interface FiscalYear {
  fiscal_year_code: string;
  display_name: string;
  winner_count: number;
}

export interface Category {
  category_id: string;
  title_en: string;
  title_ne?: string;
}

export interface ApiWinnersResponse {
  limit: number;
  offset: number;
  total_draws: number;
  has_more: boolean;
  fiscal_years: FiscalYear[];
  categories: Category[];
  draws: ApiDraw[];
}

export interface WinnersData {
  draws: ApiDraw[];
  fiscalYears: FiscalYear[];
  categories: Category[];
}

export interface WinnerRecord {
  couponNumber: string;
  rank: string;
  fiscalYear: string;
  category: string;
  drawTitle: string;
  eligibleFrom: string;
  eligibleTo: string;
  publishedAt: string;
  claimDeadline: string;
  claimOpen: boolean;
}

const CACHE_BUSTING_HEADERS = {
  "Cache-Control": "no-cache",
  Pragma: "no-cache",
};

export async function fetchAllWinners(): Promise<WinnersData> {
  let draws: ApiDraw[] = [];
  let fiscalYears: FiscalYear[] = [];
  let categories: Category[] = [];
  let offset = 0;
  let pagesFetched = 0;

  while (pagesFetched < MAX_PAGES) {
    const url = `${IRD_WINNERS_API}?limit=${WINNERS_PAGE_SIZE}&offset=${offset}`;
    const res = await fetch(url, { headers: CACHE_BUSTING_HEADERS });

    if (!res.ok) {
      throw new Error(
        `Winner API request failed (HTTP ${res.status})`,
      );
    }

    let page: ApiWinnersResponse;
    try {
      page = (await res.json()) as ApiWinnersResponse;
    } catch {
      throw new Error("Winner API returned an invalid response");
    }

    if (!page || typeof page !== "object" || !Array.isArray(page.draws)) {
      throw new Error("Winner API returned an unexpected structure");
    }

    draws = draws.concat(page.draws);
    if (Array.isArray(page.fiscal_years)) fiscalYears = page.fiscal_years;
    if (Array.isArray(page.categories)) categories = page.categories;

    pagesFetched += 1;

    if (!page.has_more) break;

    const nextOffset = page.limit > 0 ? page.offset + page.limit : offset + WINNERS_PAGE_SIZE;
    if (nextOffset <= offset) break;
    offset = nextOffset;
  }

  if (draws.length === 0) {
    throw new Error("Winner API returned no draws");
  }

  return { draws, fiscalYears, categories };
}

export function buildWinnerMap(draws: ApiDraw[]): Map<string, WinnerRecord> {
  const map = new Map<string, WinnerRecord>();

  for (const draw of draws) {
    if (!draw || !Array.isArray(draw.winners)) continue;

    for (const winner of draw.winners) {
      const couponNumber = String(winner?.prize_coupon_number ?? "").trim();
      if (!couponNumber || map.has(couponNumber)) continue;

      map.set(couponNumber, {
        couponNumber,
        rank: String(winner.winner_rank ?? ""),
        fiscalYear: String(winner.prize_fiscal_year_code ?? ""),
        category: draw.category_title_en ?? "",
        drawTitle: draw.title_en ?? "",
        eligibleFrom: draw.eligible_from ?? "",
        eligibleTo: draw.eligible_to ?? "",
        publishedAt: draw.published_at ?? "",
        claimDeadline: draw.claim_deadline ?? "",
        claimOpen: draw.claim_open ?? false,
      });
    }
  }

  return map;
}

export interface ParsedCoupons {
  numbers: string[];
  invalid: string[];
  duplicatesRemoved: number;
}

export function parseCouponInput(raw: string): ParsedCoupons {
  const seen = new Set<string>();
  const numbers: string[] = [];
  const invalid: string[] = [];
  let duplicatesRemoved = 0;

  for (const rawLine of raw.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line) continue;

    if (/^\d+$/.test(line)) {
      if (seen.has(line)) {
        duplicatesRemoved += 1;
      } else {
        seen.add(line);
        numbers.push(line);
      }
    } else {
      invalid.push(line);
    }
  }

  return { numbers, invalid, duplicatesRemoved };
}

export interface CouponResult {
  couponNumber: string;
  winner: WinnerRecord | null;
}

export function checkCoupons(numbers: string[], winnerMap: Map<string, WinnerRecord>): CouponResult[] {
  return numbers.map((number) => ({
    couponNumber: number,
    winner: winnerMap.get(number) ?? null,
  }));
}

export function uniqueCategories(results: CouponResult[]): string[] {
  return [...new Set(results.filter((r) => r.winner).map((r) => r.winner!.category))];
}

export function uniqueFiscalYears(results: CouponResult[]): string[] {
  const years = new Set<string>();
  for (const r of results) {
    if (r.winner && r.winner.fiscalYear) years.add(r.winner.fiscalYear);
  }
  return [...years];
}