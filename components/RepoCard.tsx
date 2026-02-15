'use client';

import Image from 'next/image';
import { RepoInfo } from '@/lib/github';
import { formatNumber, formatDate } from '@/lib/utils';

export default function RepoCard({ repo }: { repo: RepoInfo }) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-start gap-4">
        <Image
          src={repo.owner.avatar_url}
          alt={repo.owner.login}
          width={48}
          height={48}
          className="rounded-full"
        />
        <div className="flex-1 min-w-0">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">
            <a
              href={repo.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              {repo.full_name}
            </a>
          </h2>
          {repo.description && (
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400 truncate">
              {repo.description}
            </p>
          )}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-4 text-sm text-zinc-600 dark:text-zinc-400">
        <span className="flex items-center gap-1">
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 16 16">
            <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.75.75 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z" />
          </svg>
          {formatNumber(repo.stargazers_count)}
        </span>
        <span className="flex items-center gap-1">
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 16 16">
            <path d="M5 5.372v.878c0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75v-.878a2.25 2.25 0 1 1 1.5 0v.878a2.25 2.25 0 0 1-2.25 2.25h-1.5v2.128a2.251 2.251 0 1 1-1.5 0V8.5h-1.5A2.25 2.25 0 0 1 3.5 6.25v-.878a2.25 2.25 0 1 1 1.5 0ZM5 3.25a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Zm6.75.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm-3 8.75a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Z" />
          </svg>
          {formatNumber(repo.forks_count)}
        </span>
        <span className="flex items-center gap-1">
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 16 16">
            <path d="M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" />
            <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0Z" />
          </svg>
          {formatNumber(repo.open_issues_count)}
        </span>
        {repo.language && (
          <span className="flex items-center gap-1">
            <span className="h-3 w-3 rounded-full" style={{ backgroundColor: '#8b8b8b' }} />
            {repo.language}
          </span>
        )}
      </div>

      <div className="mt-3 flex flex-wrap gap-2 text-xs text-zinc-500 dark:text-zinc-500">
        <span>Created {formatDate(repo.created_at)}</span>
        <span>·</span>
        <span>Updated {formatDate(repo.updated_at)}</span>
      </div>

      {repo.topics.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {repo.topics.map((topic) => (
            <span
              key={topic}
              className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
            >
              {topic}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
