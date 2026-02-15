import RepoSearch from '@/components/RepoSearch';

const POPULAR_REPOS = [
  'facebook/react',
  'vercel/next.js',
  'microsoft/vscode',
  'denoland/deno',
  'tailwindlabs/tailwindcss',
  'vuejs/core',
];

export default function HomePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <div className="flex flex-col items-center text-center">
        <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-5xl">
          GitHub Repo Insights
        </h1>
        <p className="mt-4 max-w-lg text-lg text-zinc-600 dark:text-zinc-400">
          Visualize commit patterns, language breakdown, and contributor stats
          for any public GitHub repository.
        </p>

        <RepoSearch className="mt-8" />

        <div className="mt-12">
          <p className="text-sm font-medium text-zinc-500">Try a popular repo</p>
          <div className="mt-3 flex flex-wrap justify-center gap-2">
            {POPULAR_REPOS.map((repo) => (
              <a
                key={repo}
                href={`/${repo}`}
                className="rounded-full border border-zinc-200 px-3 py-1.5 text-sm text-zinc-700 transition-colors hover:border-zinc-400 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-zinc-500 dark:hover:bg-zinc-800"
              >
                {repo}
              </a>
            ))}
          </div>
        </div>

        <div className="mt-16 grid gap-6 text-left sm:grid-cols-3">
          <div className="rounded-xl border border-zinc-200 p-6 dark:border-zinc-800">
            <div className="text-2xl">📊</div>
            <h3 className="mt-3 font-semibold text-zinc-900 dark:text-white">
              Commit Activity
            </h3>
            <p className="mt-1 text-sm text-zinc-500">
              Weekly commit trends and day-by-hour heatmaps.
            </p>
          </div>
          <div className="rounded-xl border border-zinc-200 p-6 dark:border-zinc-800">
            <div className="text-2xl">🎨</div>
            <h3 className="mt-3 font-semibold text-zinc-900 dark:text-white">
              Language Breakdown
            </h3>
            <p className="mt-1 text-sm text-zinc-500">
              See the tech stack with an interactive pie chart.
            </p>
          </div>
          <div className="rounded-xl border border-zinc-200 p-6 dark:border-zinc-800">
            <div className="text-2xl">👥</div>
            <h3 className="mt-3 font-semibold text-zinc-900 dark:text-white">
              Contributors
            </h3>
            <p className="mt-1 text-sm text-zinc-500">
              Top contributors ranked by total commits.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
