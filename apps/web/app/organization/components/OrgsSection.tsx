"use client";

import React from "react";

interface Org {
  id: string;
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
  onOrgClick: (orgId: string) => void;
  onCreateClick: () => void;
}

function timeAgo(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diffMs = now - then;
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 30) return `${diffDays}d ago`;
  const diffMonths = Math.floor(diffDays / 30);
  return `${diffMonths}mo ago`;
}

export default function OrgsSection({
  orgs,
  onOrgClick,
  onCreateClick,
}: OrgsSectionProps) {
  const colorMap = {
    purple: "bg-purple-950/60 border border-purple-800/50 text-purple-300",
    teal: "bg-emerald-950/60 border border-emerald-800/50 text-emerald-300",
    coral: "bg-orange-950/60 border border-orange-800/50 text-orange-300",
    blue: "bg-blue-950/60 border border-blue-800/50 text-blue-300",
  };

  return (
    <section className="mb-8" aria-labelledby="orgs-heading">
      <div className="flex items-center gap-2.5 mb-4">
        <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest select-none" id="orgs-heading">Your organizations</span>
      </div>

      <ul className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-3" role="list" aria-label="Organization list">
        {orgs.map((org) => (
          <li key={org.id}>
            <article
              className="bg-zinc-950/40 border border-zinc-900 rounded-xl p-5 hover:border-zinc-700 hover:bg-zinc-900/30 transition-all flex flex-col h-full cursor-pointer group"
              role="button"
              tabIndex={0}
              onClick={() => onOrgClick(org.id)}
              aria-label={`${org.name} — Enter organization`}
            >
              <header className="flex items-center gap-3 mb-3">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-xs font-semibold flex-shrink-0 ${colorMap[org.color] || colorMap.purple}`} aria-hidden="true">
                  {org.avatar}
                </div>
                <div className="min-w-0">
                  <h3 className="text-[13px] font-semibold text-white leading-tight truncate">{org.name}</h3>
                  <p className="text-[11px] text-zinc-500 mt-0.5 truncate">{org.slug}</p>
                </div>
              </header>

              {org.desc && (
                <p className="text-[11px] text-zinc-400 mb-3 line-clamp-2 leading-relaxed">{org.desc}</p>
              )}

              <div className="flex flex-wrap gap-1 mb-3" aria-label="Organization details">
                <span className="flex items-center gap-1 text-[10px] text-zinc-400 bg-zinc-900 border border-zinc-800/60 rounded-md px-2 py-0.5 select-none">
                  <i className="ti ti-users text-[10px]" aria-hidden="true"></i>
                  {org.members} {org.members === 1 ? "member" : "members"}
                </span>
                <span className="flex items-center gap-1 text-[10px] text-zinc-400 bg-zinc-900 border border-zinc-800/60 rounded-md px-2 py-0.5 select-none">
                  <i className="ti ti-layout-grid text-[10px]" aria-hidden="true"></i>
                  {org.workspaces} {org.workspaces === 1 ? "workspace" : "workspaces"}
                </span>
              </div>

              <footer className="mt-auto flex items-center justify-between pt-2.5 border-t border-zinc-900 select-none">
                <time className="text-[10px] text-zinc-500" dateTime={org.createdAt}>Created {timeAgo(org.createdAt)}</time>
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
