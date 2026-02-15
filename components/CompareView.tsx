'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { parseRepoInput } from '@/lib/utils';

export default function CompareForm() {
  const [repo1, setRepo1] = useState('');
  const [repo2, setRepo2] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');

    const parsed1 = parseRepoInput(repo1);
    const parsed2 = parseRepoInput(repo2);

    if (!parsed1 || !parsed2) {
      setError('Both fields require valid owner/repo format.');
      return;
    }

    const params = new URLSearchParams({
      repo1: `${parsed1.owner}/${parsed1.repo}`,
      repo2: `${parsed2.owner}/${parsed2.repo}`,
    });
    router.push(`/compare?${params.toString()}`);
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-xl">
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          type="text"
          value={repo1}
          onChange={(e) => setRepo1(e.target.value)}
          placeholder="owner/repo (first)"
          className="flex-1 rounded-lg border border-zinc-300 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:focus:border-zinc-400"
        />
        <span className="self-center text-sm text-zinc-400">vs</span>
        <input
          type="text"
          value={repo2}
          onChange={(e) => setRepo2(e.target.value)}
          placeholder="owner/repo (second)"
          className="flex-1 rounded-lg border border-zinc-300 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:focus:border-zinc-400"
        />
        <button
          type="submit"
          className="rounded-lg bg-zinc-900 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          Compare
        </button>
      </div>
      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
    </form>
  );
}
