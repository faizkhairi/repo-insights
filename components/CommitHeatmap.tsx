'use client';

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { CommitActivity, PunchCard } from '@/lib/github';
import { dayName } from '@/lib/utils';

export function CommitActivityChart({
  activity,
}: {
  activity: CommitActivity[];
}) {
  const data = activity.map((week) => ({
    week: new Date(week.week * 1000).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    }),
    commits: week.total,
  }));

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
      <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
        Commit Activity
      </h3>
      <p className="mt-1 text-sm text-zinc-500">
        Last {activity.length} weeks · {activity.reduce((s, w) => s + w.total, 0)} total commits
      </p>

      <div className="mt-4 h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <XAxis
              dataKey="week"
              tick={{ fontSize: 11 }}
              interval={Math.floor(data.length / 6)}
            />
            <YAxis tick={{ fontSize: 11 }} width={40} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(0,0,0,0.8)',
                border: 'none',
                borderRadius: '8px',
                color: 'white',
                fontSize: '12px',
              }}
            />
            <Area
              type="monotone"
              dataKey="commits"
              stroke="#10b981"
              fill="#10b981"
              fillOpacity={0.15}
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function PunchCardChart({ punchCard }: { punchCard: PunchCard }) {
  // Build heatmap grid: 7 days x 24 hours
  const maxCommits = Math.max(...punchCard.map(([, , c]) => c), 1);

  // Group by day
  const grid: number[][] = Array.from({ length: 7 }, () =>
    Array.from({ length: 24 }, () => 0)
  );
  for (const [day, hour, commits] of punchCard) {
    grid[day][hour] = commits;
  }

  const hours = Array.from({ length: 24 }, (_, i) => i);

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
      <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
        Commit Patterns
      </h3>
      <p className="mt-1 text-sm text-zinc-500">When commits happen (day × hour)</p>

      <div className="mt-4 overflow-x-auto">
        <div className="inline-block min-w-[600px]">
          {/* Hour labels */}
          <div className="flex pl-10">
            {hours.map((h) => (
              <div
                key={h}
                className="flex-1 text-center text-[10px] text-zinc-400"
              >
                {h % 3 === 0 ? `${h}` : ''}
              </div>
            ))}
          </div>

          {/* Grid */}
          {grid.map((row, dayIdx) => (
            <div key={dayIdx} className="flex items-center gap-1">
              <span className="w-9 text-right text-xs text-zinc-500">
                {dayName(dayIdx)}
              </span>
              <div className="flex flex-1 gap-0.5">
                {row.map((commits, hourIdx) => {
                  const intensity = commits / maxCommits;
                  return (
                    <div
                      key={hourIdx}
                      className="aspect-square flex-1 rounded-sm"
                      style={{
                        backgroundColor:
                          commits === 0
                            ? 'rgba(128,128,128,0.1)'
                            : `rgba(16,185,129,${0.15 + intensity * 0.85})`,
                      }}
                      title={`${dayName(dayIdx)} ${hourIdx}:00 — ${commits} commits`}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
