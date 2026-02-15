'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { parseRepoInput } from '@/lib/utils';

export default function RepoSearch({ className = '' }: { className?: string }) {
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');

    const parsed = parseRepoInput(input);
    if (!parsed) {
      setError('Enter a valid format: owner/repo or a GitHub URL');
      return;
    }

    router.push(`/${parsed.owner}/${parsed.repo}`);
  }

  return (
    <form onSubmit={handleSubmit} className={`w-full max-w-xl ${className}`}>
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="owner/repo or GitHub URL"
          className="flex-1 rounded-lg border border-zinc-300 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:focus:border-zinc-400"
        />
        <button
          type="submit"
          className="rounded-lg bg-zinc-900 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          Analyze
        </button>
      </div>
      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
    </form>
  );
}
