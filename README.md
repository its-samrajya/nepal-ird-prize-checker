# IRD Prize Coupon Checker

Bulk-check Nepal IRD prize-draw coupon numbers against the public winner data. Instead of searching each coupon number manually, paste hundreds or thousands at once and quickly see which ones won.

## Features

- **Bulk input** — paste one coupon number per line; empty lines, whitespace, and duplicates are handled automatically
- **Live official data** — fetches the full winner list, handling all pagination
- **Fast lookups** — winner coupon numbers are loaded into an in-memory `Map`; comparisons happen locally, never one request per coupon
- **Results table** — for each winning number shows prize category, rank, fiscal year, draw period, and claim status
- **Filters** — view All, Winners, Not Found, or filter by prize category and fiscal year (categories/fiscal years are derived from the data, not hardcoded)
- **Input feedback** — clearly reports ignored invalid lines and how many duplicates were removed
- **String-safe** — coupon numbers are kept as strings so leading zeros are never lost
- **Dark mode** — responsive UI that follows the system color scheme
- **Client-side caching** — winner data is fetched once and reused for subsequent checks in the same session

## Tech stack

- Next.js
- TypeScript
- Tailwind CSS
- Bun

## Getting started

The project uses Bun as its package manager (see `packageManager` in `package.json`).

```bash
# Install dependencies
bun install

# Start the development server
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

### Available scripts

| Command         | Description               |
| --------------- | ------------------------- |
| `bun run dev`   | Start the dev server      |
| `bun run build` | Create a production build |
| `bun run start` | Run the production build  |
| `bun run lint`  | Run ESLint                |

## Usage

1. Paste coupon numbers into the textarea, one per line (e.g. `048915618211`).
2. Click **Check Numbers**.
3. Review the summary (total checked / winners found / not found) and the results table.
4. Use the filter buttons to narrow the results, or **Clear results and input** to start over.

Use **Load sample numbers** to quickly try the tool with example input.

## License

[MIT](LICENSE) © 2026 Samrajya Bhari
