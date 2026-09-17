Build a modern frontend web application that allows users to check a large list of Nepal IRD prize-draw coupon numbers against the official winner data API.

## 1. Goal

The application should solve this problem:

I have many coupon numbers and want to know whether any of them have won an IRD prize.

The official website provides winner data through this API:

<https://prize.ird.gov.np/api/v1/public/winners>

Instead of manually using Ctrl+F and searching each coupon number one at a time, I want to paste hundreds or thousands of coupon numbers into my application and check them all at once.

The application should fetch the winner data, extract all winning coupon numbers, and compare them against the user's input.

---

## 2. API

Use:

`https://prize.ird.gov.np/api/v1/public/winners`

The API returns JSON similar to:

```json
{
  "limit": 6,
  "offset": 0,
  "total_draws": 8,
  "has_more": true,
  "fiscal_years": [
    {
      "fiscal_year_code": "2083-84",
      "display_name": "FY 2083/84",
      "winner_count": 66
    }
  ],
  "categories": [
    {
      "category_id": "category_11e8ea6adb6542f9c46437ab3a2dc2fe",
      "title_en": "Bumper Prize",
      "title_ne": "बम्पर पुरस्कार"
    },
    {
      "category_id": "category_31dc50affd31e00387d6dadec4246796",
      "title_en": "Daily Prize",
      "title_ne": "दैनिक पुरस्कार"
    }
  ],
  "draws": [
    {
      "draw_id": "draw_11bcc60561d7ed6655454f1022ce0227",
      "category_title_en": "Bumper Prize",
      "category_title_ne": "बम्पर पुरस्कार",
      "draw_type": "GENERAL",
      "title_en": "Bumper Winner Consumer Selection for the period of Bhadra 16 to 31 (Sept 1 to 16)",
      "title_ne": "भाद्र १६ गते देखी ३१ गतेसम्मको बम्पर विजेता उपभोक्ता छनौट",
      "eligible_from": "2026-09-01",
      "eligible_to": "2026-09-16",
      "published_at": "2026-09-17T12:15:18.288225+05:45",
      "claim_deadline": "2026-10-02T12:15:18.288225+05:45",
      "claim_open": true,
      "winners": [
        {
          "winner_rank": 1,
          "prize_fiscal_year_code": "2083-84",
          "prize_coupon_number": "048915618211"
        }
      ]
    }
  ]
}
```

Important: the API response contains:

```text
draws
  └── winners
        └── prize_coupon_number
```

Those `prize_coupon_number` values are what we need to search.

---

## 3. Pagination

The API response contains:

```json
{
  "limit": 6,
  "offset": 0,
  "total_draws": 8,
  "has_more": true
}
```

The implementation must account for pagination.

Do NOT assume the first response contains every historical winner.

If `has_more` is true, fetch the next page using the appropriate `offset`/`limit` parameters and continue until all required draws have been retrieved.

The goal is to build a complete collection of available winning coupon numbers.

Avoid making unnecessary requests.

---

## 4. CORS / API architecture

First determine whether the external API can be called directly from the browser.

If direct browser requests work with CORS, the frontend may call the API directly.

However, preferably structure the application so that the external API request happens server-side if necessary.

For a Next.js application, a suitable architecture is:

```text
Frontend
   ↓
Next.js server/API route
   ↓
https://prize.ird.gov.np/api/v1/public/winners
```

Do not use a CORS proxy service.

If a server-side route is used, keep the external API URL in one clearly defined place.

---

## 5. Main functionality

The user should be able to paste many coupon numbers at once.

Example input:

```text
048915618211
047751629120
053777634226
123456789012
036447852378
026888979039
```

The application should:

1. Parse the input.
2. Accept one coupon number per line.
3. Ignore empty lines.
4. Trim whitespace.
5. Handle accidental spaces around numbers.
6. Preserve coupon numbers as strings, NOT JavaScript numbers.
7. Remove duplicate input numbers or clearly indicate duplicates.
8. Fetch winner data.
9. Extract all winning coupon numbers.
10. Compare the user's numbers against the winner collection.
11. Display which numbers won and which did not.

Coupon numbers must remain strings because they are identifiers and may contain leading zeroes.

---

## 6. Search performance

The application should NOT loop through every winner for every user input if that can be avoided.

Create a `Set` or `Map` of winning coupon numbers.

For example:

```ts
const winnerMap = new Map();
```

The map should associate each coupon number with useful information such as:

- coupon number
- prize category
- prize rank
- fiscal year
- draw title
- eligible period
- publication date
- claim deadline
- whether the claim is currently open

Then checking thousands of input numbers should be fast.

Conceptually:

```text
1000 user coupon numbers
        ↓
Map/Set lookup
        ↓
FOUND / NOT FOUND
```

---

## 7. Results UI

Display results clearly.

Example:

```text
Results

Total checked: 1000
Winners found: 3
Not found: 997
```

Then show a table:

| Coupon Number | Status    | Prize        | Rank | Draw Period  | Claim Status |
| ------------- | --------- | ------------ | ---- | ------------ | ------------ |
| 048915618211  | FOUND     | Bumper Prize | 1    | Bhadra 16–31 | Claim Open   |
| 047751629120  | FOUND     | Daily Prize  | 1    | Bhadra 16–31 | Claim Open   |
| 123456789012  | NOT FOUND | —            | —    | —            | —            |

For winning numbers, show all relevant information returned by the API.

For non-winning numbers, simply show `Not Found`.

---

## 8. Filters

Allow users to filter results by:

- All
- Winners
- Not Found
- Bumper Prize
- Daily Prize
- Fiscal Year

If the API contains more categories in the future, the UI should ideally handle them dynamically rather than hardcoding only two categories.

---

## 9. Search UX

Provide:

- Large textarea for bulk coupon input
- `Check Numbers` button
- Loading state while API data is being fetched
- Progress/loading indication if multiple API pages need to be fetched
- Clear error message if the API cannot be reached
- Clear button
- Results count
- Search results table

The interface should feel fast even when checking thousands of numbers.

Do not make one API request per coupon number.

Fetch the winner data once (or the minimum number of paginated requests necessary), then perform all comparisons locally.

---

## 10. Example user flow

User opens the application.

They see:

```text
IRD Prize Coupon Checker

Paste your coupon numbers below:

[ textarea ]

048915618211
047751629120
053777634226
123456789012
036447852378

[ Check Numbers ]
```

After clicking the button:

```text
Checking...

Fetching winner data...
```

Then:

```text
Results

5 numbers checked
3 winners found
2 not found
```

And the results table appears.

---

## 11. Error handling

Handle:

- API unavailable
- Network error
- Invalid API response
- Empty input
- Invalid coupon numbers
- Duplicate numbers
- Pagination failure
- Unexpected API structure

Do not crash the application if the API changes or returns malformed data.

Show user-friendly errors.

Do not expose unnecessary technical stack traces to the user.

---

## 12. Validation

The current coupon numbers appear to be 12-digit strings.

Validate input appropriately, but do not make the implementation unnecessarily rigid if the API may introduce a different format later.

At minimum:

- Remove whitespace
- Ignore blank lines
- Treat coupon numbers as strings
- Detect obviously invalid entries
- Clearly tell the user which input lines are invalid

---

## 13. Design

Create a clean, modern dashboard-style interface.

Prioritize usability over unnecessary animations.

The important information should be immediately visible:

- Number of coupons checked
- Number of winners
- Number of non-winners
- Winner details

Use responsive design so it works on desktop and mobile.

Use accessible colors and clear status indicators.

For example:

```text
✓ Winner
✕ Not Found
```

Do not rely only on color to communicate status.

---

## 14. Technology

Use:

- Next.js
- TypeScript
- React
- Tailwind CSS

Use the existing project's conventions if this prompt is being applied to an existing Next.js project.

Keep the code modular.

Suggested structure:

```text
app/
  page.tsx
  api/
    winners/
      route.ts

components/
  coupon-input.tsx
  results-table.tsx
  result-summary.tsx

lib/
  winners.ts
```

The exact structure can be changed if there is a cleaner approach.

---

## 15. Important implementation detail

Do not store the winner numbers as JavaScript numbers.

This is WRONG:

```ts
const coupon = 048915618211;
```

Use:

```ts
const coupon = "048915618211";
```

because leading zeroes are significant.

---

## 16. Do not over-engineer

This is initially a simple bulk-search tool.

Do not add:

- authentication
- database
- user accounts
- payments
- unnecessary backend infrastructure

unless required later.

The first version should simply:

```text
Fetch winner data
      ↓
Extract winners
      ↓
Build lookup Map/Set
      ↓
Accept bulk coupon input
      ↓
Compare locally
      ↓
Display results
```

Build the core functionality first.

---

## 17. Future-friendly design

Structure the code so we can later add:

- Search history

Do not implement these features unless necessary for the first version.

---

## Final requirement

Before writing the implementation, inspect the actual API response and determine its pagination behavior.

Then implement the smallest clean solution that reliably retrieves the available winner data and allows the user to bulk-check coupon numbers.

Do not fake API data.

Do not hardcode the winner numbers from the example response.

The application must use the live API:

`https://prize.ird.gov.np/api/v1/public/winners`
