const GITHUB_API = 'https://api.github.com';

interface FetchOptions {
  token?: string | null;
}

async function githubFetch<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github.v3+json',
  };

  if (options.token) {
    headers.Authorization = `Bearer ${options.token}`;
  }

  const response = await fetch(`${GITHUB_API}${endpoint}`, { headers });

  if (!response.ok) {
    if (response.status === 403) {
      const remaining = response.headers.get('X-RateLimit-Remaining');
      if (remaining === '0') {
        throw new Error('GitHub API rate limit exceeded. Sign in to increase your limit.');
      }
    }
    throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

/**
 * GitHub stats endpoints return 202 while computing.
 * We poll until we get a 200 with actual data.
 */
async function githubFetchWithRetry<T>(
  endpoint: string,
  options: FetchOptions = {},
  maxRetries = 5,
  delayMs = 1500
): Promise<T> {
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github.v3+json',
  };

  if (options.token) {
    headers.Authorization = `Bearer ${options.token}`;
  }

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    const response = await fetch(`${GITHUB_API}${endpoint}`, { headers });

    if (response.status === 200) {
      return response.json();
    }

    if (response.status === 202) {
      // Stats are being computed, wait and retry
      await new Promise((resolve) => setTimeout(resolve, delayMs));
      continue;
    }

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
    }
  }

  throw new Error('GitHub stats computation timed out. Please try again.');
}

// --- Types ---

export interface RepoInfo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  watchers_count: number;
  language: string | null;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  topics: string[];
  default_branch: string;
  owner: {
    login: string;
    avatar_url: string;
  };
}

export interface ContributorStats {
  author: {
    login: string;
    avatar_url: string;
  };
  total: number;
  weeks: { w: number; a: number; d: number; c: number }[];
}

export interface CommitActivity {
  days: number[];
  total: number;
  week: number;
}

export type PunchCard = [number, number, number][]; // [day, hour, commits]

export type LanguageBreakdown = Record<string, number>;

// --- API Functions ---

export async function fetchRepo(
  owner: string,
  repo: string,
  token?: string | null
): Promise<RepoInfo> {
  return githubFetch<RepoInfo>(`/repos/${owner}/${repo}`, { token });
}

export async function fetchLanguages(
  owner: string,
  repo: string,
  token?: string | null
): Promise<LanguageBreakdown> {
  return githubFetch<LanguageBreakdown>(`/repos/${owner}/${repo}/languages`, { token });
}

export async function fetchContributorStats(
  owner: string,
  repo: string,
  token?: string | null
): Promise<ContributorStats[]> {
  return githubFetchWithRetry<ContributorStats[]>(
    `/repos/${owner}/${repo}/stats/contributors`,
    { token }
  );
}

export async function fetchCommitActivity(
  owner: string,
  repo: string,
  token?: string | null
): Promise<CommitActivity[]> {
  return githubFetchWithRetry<CommitActivity[]>(
    `/repos/${owner}/${repo}/stats/commit_activity`,
    { token }
  );
}

export async function fetchPunchCard(
  owner: string,
  repo: string,
  token?: string | null
): Promise<PunchCard> {
  return githubFetchWithRetry<PunchCard>(
    `/repos/${owner}/${repo}/stats/punch_card`,
    { token }
  );
}

export async function fetchRateLimit(token?: string | null) {
  return githubFetch<{
    rate: { limit: number; remaining: number; reset: number };
  }>('/rate_limit', { token });
}
