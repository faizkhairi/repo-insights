'use client';

import { useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import useSWR from 'swr';
import { fetchRepo, fetchLanguages, fetchContributorStats } from '@/lib/github';
import RepoCard from '@/components/RepoCard';
import LanguageChart from '@/components/LanguageChart';
import ContributorChart from '@/components/ContributorChart';
import CompareForm from '@/components/CompareView';
import { formatNumber } from '@/lib/utils';
import { Suspense } from 'react';

function getToken(session: ReturnType<typeof useSession>['data']) {
  return (session as { accessToken?: string } | null)?.accessToken ?? null;
}

function CompareContent() {
  const searchParams = useSearchParams();
  const repo1Param = searchParams.get('repo1');
  const repo2Param = searchParams.get('repo2');
  const { data: session } = useSession();
  const token = getToken(session);

  const [owner1, name1] = repo1Param?.split('/') ?? [];
  const [owner2, name2] = repo2Param?.split('/') ?? [];
  const hasRepos = owner1 && name1 && owner2 && name2;

  const { data: repo1 } = useSWR(
    hasRepos ? ['repo', owner1, name1] : null,
    () => fetchRepo(owner1, name1, token),
    { revalidateOnFocus: false }
  );
  const { data: repo2 } = useSWR(
    hasRepos ? ['repo', owner2, name2] : null,
    () => fetchRepo(owner2, name2, token),
    { revalidateOnFocus: false }
  );
  const { data: lang1 } = useSWR(
    repo1 ? ['languages', owner1, name1] : null,
    () => fetchLanguages(owner1, name1, token),
    { revalidateOnFocus: false }
  );
  const { data: lang2 } = useSWR(
    repo2 ? ['languages', owner2, name2] : null,
    () => fetchLanguages(owner2, name2, token),
    { revalidateOnFocus: false }
  );
  const { data: contrib1 } = useSWR(
    repo1 ? ['contributors', owner1, name1] : null,
    () => fetchContributorStats(owner1, name1, token),
    { revalidateOnFocus: false }
  );
  const { data: contrib2 } = useSWR(
    repo2 ? ['contributors', owner2, name2] : null,
    () => fetchContributorStats(owner2, name2, token),
    { revalidateOnFocus: false }
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <div className="flex flex-col items-center text-center">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
          Compare Repositories
        </h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          Side-by-side comparison of two GitHub repos
        </p>
        <div className="mt-6">
          <CompareForm />
        </div>
      </div>

      {hasRepos && (
        <div className="mt-12">
          {/* Quick stats comparison */}
          {repo1 && repo2 && (
            <div className="mb-8 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-200 dark:border-zinc-800">
                    <th className="py-3 text-left font-medium text-zinc-500">Metric</th>
                    <th className="py-3 text-right font-medium text-zinc-900 dark:text-white">
                      {repo1.full_name}
                    </th>
                    <th className="py-3 text-right font-medium text-zinc-900 dark:text-white">
                      {repo2.full_name}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                  {[
                    ['Stars', repo1.stargazers_count, repo2.stargazers_count],
                    ['Forks', repo1.forks_count, repo2.forks_count],
                    ['Issues', repo1.open_issues_count, repo2.open_issues_count],
                    ['Watchers', repo1.watchers_count, repo2.watchers_count],
                  ].map(([label, v1, v2]) => (
                    <tr key={label as string}>
                      <td className="py-2 text-zinc-600 dark:text-zinc-400">
                        {label as string}
                      </td>
                      <td className="py-2 text-right font-mono text-zinc-900 dark:text-white">
                        {formatNumber(v1 as number)}
                      </td>
                      <td className="py-2 text-right font-mono text-zinc-900 dark:text-white">
                        {formatNumber(v2 as number)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Side-by-side detail */}
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-6">
              {repo1 && <RepoCard repo={repo1} />}
              {lang1 && <LanguageChart languages={lang1} />}
              {contrib1 && <ContributorChart contributors={contrib1} />}
            </div>
            <div className="space-y-6">
              {repo2 && <RepoCard repo={repo2} />}
              {lang2 && <LanguageChart languages={lang2} />}
              {contrib2 && <ContributorChart contributors={contrib2} />}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ComparePage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-6xl px-4 py-16 text-center">
          <div className="h-8 w-8 mx-auto animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-900" />
        </div>
      }
    >
      <CompareContent />
    </Suspense>
  );
}
