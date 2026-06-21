"use client";

import React from "react";
import type { UserProfile } from "@/lib/api/profile.api";

interface WorkspaceStatsProps {
  profile: UserProfile;
}

const stats = [
  {
    key: "organizations" as const,
    label: "Organizations",
    icon: "ti-building",
  },
  {
    key: "workspaces" as const,
    label: "Workspaces",
    icon: "ti-layout-grid",
  },
  {
    key: "spaces" as const,
    label: "Spaces",
    icon: "ti-world",
  },
];

export default function WorkspaceStats({ profile }: WorkspaceStatsProps) {
  return (
    <section aria-labelledby="workspace-stats-heading">
      <h2
        id="workspace-stats-heading"
        className="text-[11px] font-semibold text-zinc-500 uppercase tracking-widest mb-4"
      >
        Overview
      </h2>

      <div className="grid grid-cols-3 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.key}
            className="border border-zinc-800/60 rounded-xl px-5 py-5 hover:border-zinc-700/60 transition-colors"
          >
            <div className="flex items-center gap-2 mb-2">
              <i className={`ti ${stat.icon} text-zinc-500 text-sm`} />
            </div>
            <div className="text-2xl font-semibold text-white leading-none mb-1">
              {profile.counts?.[stat.key] ?? 0}
            </div>
            <div className="text-[11px] text-zinc-500">{stat.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
