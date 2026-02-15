# Repo Insights

<p align="center">
  <img src="./docs/dashboard.png" alt="Repository Dashboard" width="800">
</p>

> **📸 Screenshot placeholder** — See [docs/CAPTURE_INSTRUCTIONS.md](./docs/CAPTURE_INSTRUCTIONS.md) for capture instructions

Visualize commit patterns, language breakdown, and contributor stats for any public GitHub repository.

## Features

- **Repo Search** — Enter `owner/repo` or a full GitHub URL to analyze any public repo
- **Commit Activity** — Weekly commit trends displayed as an area chart
- **Commit Patterns** — Day-by-hour heatmap showing when commits happen
- **Language Breakdown** — Interactive pie chart with stacked bar of languages by bytes
- **Top Contributors** — Horizontal bar chart ranking contributors by total commits
- **Compare Mode** — Side-by-side comparison of two repositories
- **GitHub OAuth** — Optional sign-in to increase API rate limits from 60 to 5,000 requests/hour

## Tech Stack

| Technology | Purpose |
|-----------|---------|
| [Next.js 16](https://nextjs.org/) | React framework with App Router |
| [Auth.js v5](https://authjs.dev/) | GitHub OAuth for API rate limits |
| [SWR](https://swr.vercel.app/) | Client-side data fetching & caching |
| [Recharts](https://recharts.org/) | Data visualization (bar, area, pie charts) |
| [Tailwind CSS v4](https://tailwindcss.com/) | Utility-first styling |
| [TypeScript](https://www.typescriptlang.org/) | Type safety |
| [Vitest](https://vitest.dev/) | Unit testing |

## Getting Started

### Prerequisites

- Node.js 20+
- npm

### Installation

```bash
git clone https://github.com/faizkhairi/repo-insights.git
cd repo-insights
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### GitHub OAuth (Optional)

To increase API rate limits from 60 to 5,000 requests/hour:

1. Create a GitHub OAuth App at [github.com/settings/developers](https://github.com/settings/developers)
2. Set callback URL to `http://localhost:3000/api/auth/callback/github`
3. Copy the Client ID and Secret to `.env.local`:

```bash
cp .env.example .env.local
# Edit .env.local with your GitHub OAuth credentials
```

### Testing

```bash
npm test           # Run tests once
npm run test:watch # Watch mode
```

### Build

```bash
npm run build
npm start
```

## Project Structure

```
repo-insights/
├── app/
│   ├── page.tsx                    # Search page with popular repos
│   ├── layout.tsx                  # Root layout with nav + auth
│   ├── [owner]/[repo]/page.tsx     # Repo dashboard with charts
│   ├── compare/page.tsx            # Side-by-side comparison
│   └── api/auth/[...nextauth]/     # Auth.js API route
├── components/
│   ├── RepoSearch.tsx              # Search input (owner/repo or URL)
│   ├── CommitHeatmap.tsx           # Activity chart + punch card heatmap
│   ├── LanguageChart.tsx           # Pie chart + stacked bar
│   ├── ContributorChart.tsx        # Horizontal bar chart
│   ├── RepoCard.tsx                # Summary card (stars, forks, issues)
│   ├── CompareView.tsx             # Comparison form
│   ├── AuthButton.tsx              # Sign in/out button
│   └── SessionProvider.tsx         # NextAuth session wrapper
├── lib/
│   ├── github.ts                   # GitHub API client with 202-retry
│   ├── auth.ts                     # Auth.js configuration
│   └── utils.ts                    # Formatting, colors, parsing
└── tests/
    └── github.test.ts              # 15 unit tests
```

## GitHub API Notes

GitHub's stats endpoints (`/stats/contributors`, `/stats/commit_activity`, `/stats/punch_card`) return **HTTP 202** on first request while they compute the data. This app automatically polls with retry logic until a **200** response with actual data is returned.

## License

MIT
