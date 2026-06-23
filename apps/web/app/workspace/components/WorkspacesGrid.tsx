"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

interface WorkspaceCard {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  type: "Workspace";
  desc: string;
  icon: string;
  stripeColor: string;
  spaceCount: number;
  activity: string;
  activityColor: string;
  active: boolean;
}

interface ApiWorkspace {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  organizationId: string;
  createdAt: string;
  spaceCount: number;
}

interface WorkspacesGridProps {
  onEnterWorkspace: (name: string) => void;
  onCreateWorkspace: () => void;
  workspaces?: ApiWorkspace[];
  orgId?: string;
}

const mapApiWorkspaceToCard = (ws: ApiWorkspace): WorkspaceCard => ({
  id: ws.id,
  name: ws.name,
  slug: ws.slug,
  description: ws.description,
  type: "Workspace",
  desc: ws.description || `${ws.spaceCount} spaces configured`,
  icon: "ti-layout-grid",
  stripeColor: "bg-emerald-500",
  spaceCount: ws.spaceCount,
  activity: `Created ${new Date(ws.createdAt).toLocaleDateString()}`,
  activityColor: "bg-zinc-500",
  active: true,
});

export default function WorkspacesGrid({
  onCreateWorkspace,
  workspaces,
  orgId,
}: WorkspacesGridProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [layoutView, setLayoutView] = useState<"grid" | "list">("grid");

  const cards: WorkspaceCard[] = workspaces
    ? workspaces.map(mapApiWorkspaceToCard)
    : [];

  const filteredCards = cards.filter((card) => {
    const matchesSearch =
      card.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.desc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <section className="space-y-6 select-none" aria-labelledby="section-workspaces">
      {/* Search Toolbar */}
      <div className="flex flex-col gap-3 min-[540px]:flex-row min-[540px]:items-center justify-between flex-wrap gap-y-4">
        {/* Search Input */}
        <div className="flex items-center gap-2.5 bg-zinc-950 border border-zinc-900 focus-within:border-zinc-800 rounded-xl px-3 py-1.5 w-full min-[540px]:max-w-[260px]">
          <i className="ti ti-search text-zinc-500 text-xs"></i>
          <input
            type="search"
            placeholder="Filter workspaces..."
            className="bg-transparent border-none outline-none text-xs text-white placeholder:text-zinc-600 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Spacer */}
        <div className="hidden min-[960px]:block flex-grow" />

        {/* Layout selector */}
        <div className="flex items-center gap-1 bg-zinc-950 border border-zinc-900 rounded-lg p-1 shrink-0 self-start min-[540px]:self-center">
          <button
            className={`w-7 h-6 rounded flex items-center justify-center text-xs transition-colors cursor-pointer ${
              layoutView === "grid" ? "bg-zinc-900 text-white" : "text-zinc-600 hover:text-zinc-400"
            }`}
            onClick={() => setLayoutView("grid")}
            aria-label="Grid layout"
          >
            <i className="ti ti-layout-grid"></i>
          </button>
          <button
            className={`w-7 h-6 rounded flex items-center justify-center text-xs transition-colors cursor-pointer ${
              layoutView === "list" ? "bg-zinc-900 text-white" : "text-zinc-600 hover:text-zinc-400"
            }`}
            onClick={() => setLayoutView("list")}
            aria-label="List layout"
          >
            <i className="ti ti-list"></i>
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest" id="section-workspaces">All Workspaces</h2>
        <span className="text-[10px] text-zinc-600 font-mono">{filteredCards.length} total matched</span>
      </div>

      {/* Empty state */}
      {filteredCards.length === 0 && (
        <div className="border border-dashed border-zinc-800 rounded-2xl p-10 flex flex-col items-center justify-center text-center gap-3">
          <div className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500">
            <i className="ti ti-layout-grid"></i>
          </div>
          <p className="text-sm text-zinc-300 font-medium">
            {workspaces?.length === 0 ? "No workspaces yet" : "No workspaces match your search"}
          </p>
          <p className="text-xs text-zinc-500 max-w-[260px]">
            {workspaces?.length === 0
              ? "Create your first workspace to start collaborating with your team."
              : "Try a different search term."}
          </p>
          {workspaces?.length === 0 && (
            <button
              onClick={onCreateWorkspace}
              className="mt-2 p-2 px-4 text-xs font-bold rounded-lg text-black bg-white hover:bg-zinc-200 transition-all cursor-pointer"
            >
              Create Workspace
            </button>
          )}
        </div>
      )}

      {/* Grid listing */}
      {filteredCards.length > 0 && layoutView === "grid" ? (
        <ul className="grid grid-cols-1 min-[480px]:grid-cols-2 lg:grid-cols-3 min-[1600px]:grid-cols-4 gap-4" role="list">
          {filteredCards.map((card) => (
            <li key={card.id} className="flex">
              <article className="bg-zinc-950/40 border border-zinc-900 hover:border-zinc-800 hover:bg-zinc-900/10 rounded-2xl flex flex-col justify-between overflow-hidden cursor-pointer select-none transition-all w-full relative group">
                {/* Accent stripe */}
                <div className={`h-[3px] w-full ${card.stripeColor} opacity-70 group-hover:opacity-100 transition-opacity`} />

                <div className="p-5 flex-grow flex flex-col justify-between gap-4">
                  {/* Card head info */}
                  <div className="space-y-3">
                    <header className="flex items-start justify-between">
                      <div className="w-9 h-9 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 text-base">
                        <i className={`ti ${card.icon}`}></i>
                      </div>
                      <span className={`w-2 h-2 rounded-full shrink-0 mt-1 ${
                        card.active ? "bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "bg-zinc-700"
                      }`} />
                    </header>

                    <div className="space-y-1">
                      <h3 className="text-[13px] font-semibold text-white group-hover:text-zinc-200 transition-colors">{card.name}</h3>
                      <p className="text-[11px] text-zinc-500 font-mono">{card.slug}</p>
                    </div>

                    <p className="text-[11px] text-zinc-500 leading-relaxed truncate-2-lines">{card.desc}</p>
                  </div>

                  {/* Core indicators */}
                  <div className="space-y-3 pt-3 border-t border-zinc-900/60">
                    <div className="flex items-center justify-between text-[10px] text-zinc-500">
                      <span>{card.spaceCount} spaces</span>
                    </div>

                    {/* Latest Activity message */}
                    <div className="flex items-center gap-1.5 text-[10px] text-zinc-600 bg-zinc-950/80 rounded px-2 py-1.5">
                      <span className={`w-1 h-1 rounded-full shrink-0 ${card.activityColor}`} />
                      <span className="truncate flex-1 font-mono text-[9px]">{card.activity}</span>
                    </div>
                  </div>
                </div>

                {/* Footer details links */}
                <footer className="border-t border-zinc-900/80 p-3 px-5 flex items-center justify-between bg-zinc-950/20">
                  <button
                    className="flex items-center gap-1 text-[11px] font-semibold text-zinc-400 group-hover:text-white group-hover:translate-x-1 duration-200 transition-all cursor-pointer"
                    onClick={() => {
                      if (orgId && card.id) {
                        router.push(`/workspace/${orgId}/${card.id}`);
                      }
                    }}
                  >
                    Enter
                    <i className="ti ti-arrow-right text-[11px]"></i>
                  </button>
                </footer>
              </article>
            </li>
          ))}

          {/* Create workspace triggers */}
          <li className="flex">
            <button
              className="bg-transparent border border-dashed border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/10 rounded-2xl p-6 min-h-[220px] flex-grow flex flex-col items-center justify-center text-center gap-2 transition-all cursor-pointer"
              onClick={onCreateWorkspace}
            >
              <div className="w-8 h-8 rounded-lg bg-zinc-950 border border-zinc-900 flex items-center justify-center text-zinc-500">
                <i className="ti ti-plus text-base"></i>
              </div>
              <h3 className="text-[12px] font-semibold text-zinc-300">Create workspace</h3>
              <p className="text-[10px] text-zinc-500 max-w-[180px] leading-relaxed">Launch a new custom automation and workflow sandbox for your team.</p>
            </button>
          </li>
        </ul>
      ) : filteredCards.length > 0 ? (
        /* List layout mode */
        <ul className="space-y-2" role="list">
          {filteredCards.map((card) => (
            <li key={card.id}>
              <article className="bg-zinc-950/40 border border-zinc-900 hover:border-zinc-800 hover:bg-zinc-900/10 rounded-xl p-3 px-4 flex flex-col min-[600px]:flex-row min-[600px]:items-center justify-between gap-4 cursor-pointer select-none transition-all group">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 text-base shrink-0">
                    <i className={`ti ${card.icon}`}></i>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-[13px] font-semibold text-white group-hover:text-zinc-200 transition-colors truncate">{card.name}</h3>
                      <span className="text-[9px] font-mono bg-zinc-900 border border-zinc-800 rounded px-1.5 py-0.2 text-zinc-500 shrink-0">
                        {card.slug}
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-500 truncate mt-0.5">{card.desc}</p>
                  </div>
                </div>

                <div className="flex items-center gap-6 self-start min-[600px]:self-center shrink-0">
                  <span className="text-[10px] text-zinc-500 font-mono hidden sm:inline-block">{card.spaceCount} spaces</span>
                  <span className="text-[10px] text-zinc-600 font-mono truncate max-w-[160px]">{card.activity}</span>
                  <button
                    className="flex items-center gap-1 text-[11px] font-semibold text-zinc-400 group-hover:text-white group-hover:translate-x-1 duration-200 transition-all cursor-pointer"
                    onClick={() => {
                      if (orgId && card.id) {
                        router.push(`/workspace/${orgId}/${card.id}`);
                      }
                    }}
                  >
                    Enter
                    <i className="ti ti-arrow-right text-[11px]"></i>
                  </button>
                </div>
              </article>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
