"use client";

import React from "react";

interface StatsSectionProps {
  orgCount: number;
  userName: string;
}

export default function StatsSection({ orgCount, userName }: StatsSectionProps) {
  return (
    <header className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between mb-8 select-none">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight mb-1">
          Welcome back, <span className="text-zinc-400">{userName}</span>
        </h1>
        <p className="text-xs text-zinc-500">Your teams are active. Continue where you left off.</p>
        
        <div className="flex items-center gap-2 mt-3.5 flex-wrap" role="status" aria-label="Current activity status">
          <div className="flex items-center gap-1.5 bg-zinc-900/40 border border-zinc-900 rounded-full p-1 px-3 text-[10px] font-medium text-emerald-500">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0 animate-pulse" aria-hidden="true"></span>
            24 online
          </div>
          <div className="flex items-center gap-1.5 bg-zinc-900/40 border border-zinc-900 rounded-full p-1 px-3 text-[10px] font-medium text-zinc-300">
            <i className="ti ti-cpu text-xs text-zinc-400" aria-hidden="true"></i>
            3 AI agents running
          </div>
          <div className="flex items-center gap-1.5 bg-zinc-900/40 border border-zinc-900 rounded-full p-1 px-3 text-[10px] font-medium text-zinc-500">
            <i className="ti ti-clock text-xs" aria-hidden="true"></i>
            Last active 2m ago
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 min-[480px]:grid-cols-4 gap-2 w-full sm:w-auto" aria-label="Dashboard statistics">
        <div className="bg-zinc-950/40 border border-zinc-900 rounded-xl p-3 text-center sm:min-w-[95px] backdrop-blur-sm">
          <div className="text-xl font-bold text-white mb-0.5">{orgCount}</div>
          <div className="text-[9px] uppercase tracking-wider text-zinc-500 font-semibold select-none">Orgs</div>
        </div>
        <div className="bg-zinc-950/40 border border-zinc-900 rounded-xl p-3 text-center sm:min-w-[95px] backdrop-blur-sm">
          <div className="text-xl font-bold text-white mb-0.5">18</div>
          <div className="text-[9px] uppercase tracking-wider text-zinc-500 font-semibold select-none">Workspaces</div>
        </div>
        <div className="bg-zinc-950/40 border border-zinc-900 rounded-xl p-3 text-center sm:min-w-[95px] backdrop-blur-sm">
          <div className="text-xl font-bold text-white mb-0.5">94</div>
          <div className="text-[9px] uppercase tracking-wider text-zinc-500 font-semibold select-none">Members</div>
        </div>
        <div className="bg-zinc-950/40 border border-zinc-900 rounded-xl p-3 text-center sm:min-w-[95px] backdrop-blur-sm">
          <div className="text-xl font-bold text-emerald-500 mb-0.5">12</div>
          <div className="text-[9px] uppercase tracking-wider text-zinc-500 font-semibold select-none">Tasks done</div>
        </div>
      </div>
    </header>
  );
}
