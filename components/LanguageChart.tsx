'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { LanguageBreakdown } from '@/lib/github';
import { getLanguageColor, formatBytes } from '@/lib/utils';

export default function LanguageChart({ languages }: { languages: LanguageBreakdown }) {
  const total = Object.values(languages).reduce((sum, bytes) => sum + bytes, 0);

  const data = Object.entries(languages)
    .sort(([, a], [, b]) => b - a)
    .map(([name, bytes]) => ({
      name,
      value: bytes,
      percentage: ((bytes / total) * 100).toFixed(1),
      color: getLanguageColor(name),
    }));

  if (data.length === 0) {
    return (
      <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">Languages</h3>
        <p className="mt-4 text-sm text-zinc-500">No language data available.</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
      <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">Languages</h3>

      {/* Stacked bar */}
      <div className="mt-4 flex h-3 overflow-hidden rounded-full">
        {data.map((lang) => (
          <div
            key={lang.name}
            className="h-full transition-all"
            style={{
              width: `${lang.percentage}%`,
              backgroundColor: lang.color,
            }}
            title={`${lang.name}: ${lang.percentage}%`}
          />
        ))}
      </div>

      {/* Legend list */}
      <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm">
        {data.slice(0, 8).map((lang) => (
          <div key={lang.name} className="flex items-center gap-1.5">
            <span
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: lang.color }}
            />
            <span className="text-zinc-700 dark:text-zinc-300">{lang.name}</span>
            <span className="text-zinc-400">{lang.percentage}%</span>
          </div>
        ))}
        {data.length > 8 && (
          <span className="text-zinc-400">+{data.length - 8} more</span>
        )}
      </div>

      {/* Pie chart */}
      <div className="mt-4 h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={90}
              dataKey="value"
              nameKey="name"
            >
              {data.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => formatBytes(value as number)}
              contentStyle={{
                backgroundColor: 'rgba(0,0,0,0.8)',
                border: 'none',
                borderRadius: '8px',
                color: 'white',
                fontSize: '12px',
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
