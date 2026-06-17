import React from "react";

interface ConnectionsHeaderProps {
  workspaceName: string;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export default function ConnectionsHeader({ workspaceName, searchQuery, onSearchChange }: ConnectionsHeaderProps) {
  return (
    <div className="mb-10 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
      <div>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-center shadow-lg">
            <i className="ti ti-plug-connected text-zinc-300 text-lg"></i>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Connections</h1>
            <p className="text-[13px] text-zinc-500 font-medium mt-0.5">
              {workspaceName}
            </p>
          </div>
        </div>
        <p className="text-[14px] text-zinc-400 max-w-lg leading-relaxed">
          Connect tools and services that WorkVerse can access on your behalf. Connected accounts are available to AI, automations, and MCP executions.
        </p>
      </div>

      <div className="relative shrink-0 w-full sm:w-64">
        <i className="ti ti-search absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600 text-sm"></i>
        <input
          type="text"
          placeholder="Search integrations..."
          value={searchQuery}
          onChange={e => onSearchChange(e.target.value)}
          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-9 pr-4 py-2.5 text-[13px] text-zinc-300 placeholder:text-zinc-600 outline-none focus:border-zinc-600 transition-colors"
        />
      </div>
    </div>
  );
}
