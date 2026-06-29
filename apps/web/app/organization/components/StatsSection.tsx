"use client";

import React from "react";

interface StatsSectionProps {
  orgCount: number;
  totalWorkspaces: number;
  totalMembers: number;
  userName: string;
}

export default function StatsSection({ orgCount, totalWorkspaces, totalMembers, userName }: StatsSectionProps) {
  return (
    <header className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between mb-8 select-none">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight mb-1">
          Welcome back, <span className="text-zinc-400">{userName}</span>
        </h1>
        <p className="text-xs text-zinc-500">Manage your organizations and collaborate with your teams.</p>
      </div>

      <div className="grid grid-cols-3 gap-2 w-full sm:w-auto" aria-label="Dashboard statistics">
        <div className="bg-zinc-950/40 border border-zinc-900 rounded-xl p-3 text-center sm:min-w-[95px] backdrop-blur-sm">
          <div className="text-xl font-bold text-white mb-0.5">{orgCount}</div>
          <div className="text-[9px] uppercase tracking-wider text-zinc-500 font-semibold select-none">Orgs</div>
        </div>
        <div className="bg-zinc-950/40 border border-zinc-900 rounded-xl p-3 text-center sm:min-w-[95px] backdrop-blur-sm">
          <div className="text-xl font-bold text-white mb-0.5">{totalWorkspaces}</div>
          <div className="text-[9px] uppercase tracking-wider text-zinc-500 font-semibold select-none">Workspaces</div>
        </div>
        <div className="bg-zinc-950/40 border border-zinc-900 rounded-xl p-3 text-center sm:min-w-[95px] backdrop-blur-sm">
          <div className="text-xl font-bold text-white mb-0.5">{totalMembers}</div>
          <div className="text-[9px] uppercase tracking-wider text-zinc-500 font-semibold select-none">Members</div>
        </div>
      </div>
    </header>
  );
}
