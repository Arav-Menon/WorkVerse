import React from "react";
import type { HealthStat } from "./data";

interface ConnectionsStatsProps {
  stats: HealthStat[];
}

export default function ConnectionsStats({ stats }: ConnectionsStatsProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
      {stats.map(stat => (
        <div key={stat.label} className={`flex items-center gap-3 border rounded-xl px-4 py-3.5 ${stat.bg}`}>
          <span className={`w-2 h-2 rounded-full shrink-0 ${stat.dot}`} />
          <div>
            <p className={`text-lg font-bold leading-none mb-1 ${stat.color}`}>{stat.count}</p>
            <p className="text-[11px] text-zinc-500 font-medium uppercase tracking-wider">{stat.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
