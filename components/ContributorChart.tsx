'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { ContributorStats } from '@/lib/github';
import { formatNumber } from '@/lib/utils';

export default function ContributorChart({
  contributors,
}: {
  contributors: ContributorStats[];
}) {
  const data = [...contributors]
    .sort((a, b) => b.total - a.total)
    .slice(0, 15)
    .map((c) => ({
      name: c.author.login,
      commits: c.total,
      avatar: c.author.avatar_url,
    }));

  if (data.length === 0) {
    return (
      <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
          Top Contributors
        </h3>
        <p className="mt-4 text-sm text-zinc-500">No contributor data available.</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
      <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
        Top Contributors
      </h3>
      <p className="mt-1 text-sm text-zinc-500">
        {contributors.length} total contributors · {formatNumber(contributors.reduce((s, c) => s + c.total, 0))} commits
      </p>

      <div className="mt-4 h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ left: 80 }}>
            <XAxis type="number" tick={{ fontSize: 12 }} />
            <YAxis
              type="category"
              dataKey="name"
              tick={{ fontSize: 12 }}
              width={75}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(0,0,0,0.8)',
                border: 'none',
                borderRadius: '8px',
                color: 'white',
                fontSize: '12px',
              }}
              formatter={(value) => [`${value} commits`, 'Commits']}
            />
            <Bar dataKey="commits" fill="#3b82f6" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
