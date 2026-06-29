"use client";

import React from "react";

interface Org {
  name: string;
  slug: string;
  desc: string;
  members: number;
  workspaces: number;
  avatar: string;
  color: "purple" | "teal" | "coral" | "blue";
  createdAt: string;
}

interface OrgsSectionProps {
  orgs: Org[];
  onWorkspaceChange: (ws: string) => void;
  onCreateClick: () => void;
  onViewAllClick: () => void;
}

export default function OrgsSection({
  orgs,
  onWorkspaceChange,
  onCreateClick,
  onViewAllClick,
}: OrgsSectionProps) {
  const colorMap = {
    purple: "bg-purple-950/60 border border-purple-800/50 text-purple-300",
    teal: "bg-emerald-950/60 border border-emerald-800/50 text-emerald-300",
    coral: "bg-orange-950/60 border border-orange-800/50 text-orange-300",
    blue: "bg-blue-950/60 border border-blue-800/50 text-blue-300",
  };

  return (
    <section className="mb-8" aria-labelledby="orgs-heading">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest select-none" id="orgs-heading">Your organizations</h2>
        <button 
          className="flex items-center gap-1 text-[11px] text-zinc-400 hover:text-white transition-colors cursor-pointer" 
          onClick={onViewAllClick} 
          aria-label="View all organizations"
        >
          View all
          <i className="ti ti-arrow-right text-[11px]" aria-hidden="true"></i>
        </button>
      </div>

      <ul className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-3" role="list" aria-label="Organization list">
        {orgs.map((org) => (
          <li key={org.name}>
            <article 
              className="bg-zinc-950/40 border border-zinc-900 rounded-xl p-5 hover:border-zinc-700 hover:bg-zinc-900/30 transition-all flex flex-col h-full cursor-pointer group" 
              role="button" 
              tabIndex={0} 
              onClick={() => onWorkspaceChange(org.name)}
              aria-label={`${org.name} — Enter organization`}
            >
              <header className="flex items-center gap-3 mb-3">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-xs font-semibold flex-shrink-0 ${colorMap[org.color] || colorMap.purple}`} aria-hidden="true">
                  {org.avatar}
                </div>
                <div className="min-w-0">
                  <h3 className="text-[13px] font-semibold text-white leading-tight truncate">{org.name}</h3>
                  <p className="text-[11px] text-zinc-500 mt-0.5 truncate">{org.desc}</p>
                </div>
              </header>
              
              <div className="flex flex-wrap gap-1 mb-2.5" aria-label="Organization details">
                <span className="flex items-center gap-1 text-[10px] text-zinc-400 bg-zinc-900 border border-zinc-800/60 rounded-md px-2 py-0.5 select-none">
                  <i className="ti ti-users text-[10px]" aria-hidden="true"></i>
                  {org.members} members
                </span>
                <span className="flex items-center gap-1 text-[10px] text-zinc-400 bg-zinc-900 border border-zinc-800/60 rounded-md px-2 py-0.5 select-none">
                  <i className="ti ti-layout-grid text-[10px]" aria-hidden="true"></i>
                  {org.workspaces} workspaces
                </span>
              </div>
              
              <footer className="mt-auto flex items-center justify-between pt-2.5 border-t border-zinc-900 select-none">
                <time className="text-[10px] text-zinc-500">Created {org.createdAt}</time>
                <span className="flex items-center gap-1 text-[11px] font-semibold text-zinc-400 group-hover:text-white group-hover:gap-1.5 transition-all animate-fade-in" aria-hidden="true">
                  Enter
                  <i className="ti ti-arrow-right text-[11px]" aria-hidden="true"></i>
                </span>
              </footer>
            </article>
          </li>
        ))}

        <li>
          <article 
            className="border border-dashed border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/20 rounded-xl min-h-[160px] flex flex-col items-center justify-center p-5 text-center gap-2 cursor-pointer transition-all h-full" 
            role="button" 
            tabIndex={0} 
            onClick={onCreateClick}
            aria-label="Create a new organization"
          >
            <div className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-sm text-zinc-400" aria-hidden="true">
              <i className="ti ti-plus"></i>
            </div>
            <h3 className="text-[13px] font-semibold text-zinc-200">Create organization</h3>
            <p className="text-[11px] text-zinc-500 leading-normal max-w-[140px]">Launch a new collaborative workspace for your team</p>
          </article>
        </li>
      </ul>
    </section>
  );
}
