import { describe, it, expect, vi, beforeEach } from 'vitest';
import { parseRepoInput, getLanguageColor, formatNumber, formatDate } from '@/lib/utils';

describe('parseRepoInput', () => {
  it('parses owner/repo format', () => {
    expect(parseRepoInput('facebook/react')).toEqual({
      owner: 'facebook',
      repo: 'react',
    });
  });

  it('parses full GitHub URL', () => {
    expect(parseRepoInput('https://github.com/vercel/next.js')).toEqual({
      owner: 'vercel',
      repo: 'next.js',
    });
  });

  it('parses URL with .git suffix', () => {
    expect(parseRepoInput('https://github.com/vuejs/core.git')).toEqual({
      owner: 'vuejs',
      repo: 'core',
    });
  });

  it('parses URL with trailing path', () => {
    expect(
      parseRepoInput('https://github.com/microsoft/vscode/tree/main')
    ).toEqual({
      owner: 'microsoft',
      repo: 'vscode',
    });
  });

  it('returns null for invalid input', () => {
    expect(parseRepoInput('invalid')).toBeNull();
    expect(parseRepoInput('')).toBeNull();
    expect(parseRepoInput('a/b/c')).toBeNull();
  });

  it('trims whitespace', () => {
    expect(parseRepoInput('  facebook/react  ')).toEqual({
      owner: 'facebook',
      repo: 'react',
    });
  });
});

describe('getLanguageColor', () => {
  it('returns known language color', () => {
    expect(getLanguageColor('TypeScript')).toBe('#3178c6');
    expect(getLanguageColor('JavaScript')).toBe('#f1e05a');
    expect(getLanguageColor('Python')).toBe('#3572A5');
  });

  it('returns fallback color for unknown language', () => {
    expect(getLanguageColor('BrainFudge')).toBe('#8b8b8b');
  });
});

describe('formatNumber', () => {
  it('formats small numbers as-is', () => {
    expect(formatNumber(42)).toBe('42');
    expect(formatNumber(999)).toBe('999');
  });

  it('formats thousands with K suffix', () => {
    expect(formatNumber(1500)).toBe('1.5K');
    expect(formatNumber(10000)).toBe('10.0K');
  });

  it('formats millions with M suffix', () => {
    expect(formatNumber(1500000)).toBe('1.5M');
  });
});

describe('formatDate', () => {
  it('formats ISO date string', () => {
    const result = formatDate('2024-06-15T10:00:00Z');
    expect(result).toContain('Jun');
    expect(result).toContain('15');
    expect(result).toContain('2024');
  });
});

describe('GitHub API fetch', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('fetchRepo calls correct endpoint', async () => {
    const mockRepo = {
      id: 1,
      name: 'react',
      full_name: 'facebook/react',
      description: 'A library for building UIs',
      html_url: 'https://github.com/facebook/react',
      stargazers_count: 200000,
      forks_count: 40000,
      open_issues_count: 1000,
      watchers_count: 6000,
      language: 'JavaScript',
      created_at: '2013-05-24T16:15:54Z',
      updated_at: '2024-01-01T00:00:00Z',
      pushed_at: '2024-01-01T00:00:00Z',
      topics: ['react', 'javascript'],
      default_branch: 'main',
      owner: { login: 'facebook', avatar_url: 'https://avatars.githubusercontent.com/u/69631' },
    };

    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      new Response(JSON.stringify(mockRepo), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    );

    const { fetchRepo } = await import('@/lib/github');
    const result = await fetchRepo('facebook', 'react');
    expect(result.full_name).toBe('facebook/react');
    expect(result.stargazers_count).toBe(200000);
  });

  it('throws on rate limit exceeded', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      new Response('Rate limit exceeded', {
        status: 403,
        headers: { 'X-RateLimit-Remaining': '0' },
      })
    );

    const { fetchRepo } = await import('@/lib/github');
    await expect(fetchRepo('facebook', 'react')).rejects.toThrow('rate limit');
  });

  it('throws on 404', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      new Response('Not Found', { status: 404, statusText: 'Not Found' })
    );

    const { fetchRepo } = await import('@/lib/github');
    await expect(fetchRepo('nonexist', 'repo')).rejects.toThrow('404');
  });
});
