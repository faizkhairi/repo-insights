'use client';

import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import useSWR from 'swr';
import {
  fetchRepo,
  fetchLanguages,
  fetchContributorStats,
  fetchCommitActivity,
  fetchPunchCard,
} from '@/lib/github';
import RepoCard from '@/components/RepoCard';
import LanguageChart from '@/components/LanguageChart';
import ContributorChart from '@/components/ContributorChart';
import { CommitActivityChart, PunchCardChart } from '@/components/CommitHeatmap';
import Link from 'next/link';

function getToken(session: ReturnType<typeof useSession>['data']) {
  return (session as { accessToken?: string } | null)?.accessToken ?? null;
}

export default function RepoDashboard() {
  const params = useParams();
  const owner = params.owner as string;
  const repo = params.repo as string;
  const { data: session } = useSession();
  const token = getToken(session);

  const { data: repoInfo, error: repoError, isLoading: repoLoading } = useSWR(
    ['repo', owner, repo],
    () => fetchRepo(owner, repo, token),
    { revalidateOnFocus: false }
  );

  const { data: languages } = useSWR(
    repoInfo ? ['languages', owner, repo] : null,
    () => fetchLanguages(owner, repo, token),
    { revalidateOnFocus: false }
  );

  const { data: contributors } = useSWR(
    repoInfo ? ['contributors', owner, repo] : null,
    () => fetchContributorStats(owner, repo, token),
    { revalidateOnFocus: false }
  );

  const { data: commitActivity } = useSWR(
    repoInfo ? ['commitActivity', owner, repo] : null,
    () => fetchCommitActivity(owner, repo, token),
    { revalidateOnFocus: false }
  );

  const { data: punchCard } = useSWR(
    repoInfo ? ['punchCard', owner, repo] : null,
    () => fetchPunchCard(owner, repo, token),
    { revalidateOnFocus: false }
  );

  if (repoLoading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-900 dark:border-zinc-700 dark:border-t-white" />
          <p className="text-sm text-zinc-500">Loading repository data...</p>
        </div>
      </div>
    );
  }

  if (repoError) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16">
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center dark:border-red-900 dark:bg-red-950">
          <h2 className="text-lg font-semibold text-red-800 dark:text-red-200">
            Failed to load repository
          </h2>
          <p className="mt-2 text-sm text-red-600 dark:text-red-400">
            {repoError.message}
          </p>
          <Link
            href="/"
            className="mt-4 inline-block rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white dark:bg-white dark:text-zinc-900"
          >
            Back to Search
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm text-zinc-500">
        <Link href="/" className="hover:text-zinc-900 dark:hover:text-white">
          Home
        </Link>
        <span className="mx-2">/</span>
        <span className="text-zinc-900 dark:text-white">
          {owner}/{repo}
        </span>
      </nav>

      {/* Repo info card */}
      {repoInfo && <RepoCard repo={repoInfo} />}

      {/* Charts grid */}
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {/* Commit Activity */}
        {commitActivity ? (
          <CommitActivityChart activity={commitActivity} />
        ) : (
          <LoadingCard title="Commit Activity" />
        )}

        {/* Languages */}
        {languages ? (
          <LanguageChart languages={languages} />
        ) : (
          <LoadingCard title="Languages" />
        )}

        {/* Punch Card */}
        {punchCard ? (
          <PunchCardChart punchCard={punchCard} />
        ) : (
          <LoadingCard title="Commit Patterns" />
        )}

        {/* Contributors */}
        {contributors ? (
          <ContributorChart contributors={contributors} />
        ) : (
          <LoadingCard title="Top Contributors" />
        )}
      </div>
    </div>
  );
}

function LoadingCard({ title }: { title: string }) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
      <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
        {title}
      </h3>
      <div className="mt-4 flex items-center gap-3">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-600" />
        <p className="text-sm text-zinc-500">Loading...</p>
      </div>
    </div>
  );
}
