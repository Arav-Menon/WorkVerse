"use client";

import React from "react";
import { useRouter } from "next/navigation";

interface Space {
  id: string;
  name: string;
}

interface SpacesGridProps {
  spaces: Space[];
  orgId: string;
  workspaceId: string;
}

export default function SpacesGrid({ spaces, orgId, workspaceId }: SpacesGridProps) {
  const router = useRouter();

  if (spaces.length === 0) {
    return (
      <div className="border border-dashed border-zinc-800 rounded-2xl p-10 flex flex-col items-center justify-center text-center gap-3">
        <div className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500">
          <i className="ti ti-layout-grid"></i>
        </div>
        <p className="text-sm text-zinc-300 font-medium">No spaces yet</p>
        <p className="text-xs text-zinc-500 max-w-[260px]">
          Spaces will appear here once this workspace is fully set up.
        </p>
      </div>
    );
  }

  return (
    <section className="space-y-4" aria-labelledby="section-spaces">
      <div className="flex items-center justify-between">
        <h2 className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest" id="section-spaces">
          Spaces
        </h2>
        <span className="text-[10px] text-zinc-600 font-mono">{spaces.length} total</span>
      </div>

      <ul className="grid grid-cols-1 min-[480px]:grid-cols-2 lg:grid-cols-3 min-[1600px]:grid-cols-4 gap-4" role="list">
        {spaces.map((space) => (
          <li key={space.id} className="flex">
            <article className="bg-zinc-950/40 border border-zinc-900 hover:border-zinc-800 hover:bg-zinc-900/10 rounded-2xl flex flex-col justify-between overflow-hidden cursor-pointer select-none transition-all w-full relative group">
              {/* Accent stripe */}
              <div className="h-[3px] w-full bg-violet-500 opacity-70 group-hover:opacity-100 transition-opacity" />

              <div className="p-5 flex-grow flex flex-col justify-between gap-4">
                {/* Card head info */}
                <div className="space-y-3">
                  <header className="flex items-start justify-between">
                    <div className="w-9 h-9 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 text-base">
                      <i className="ti ti-world"></i>
                    </div>
                    <span className="w-2 h-2 rounded-full shrink-0 mt-1 bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                  </header>

                  <div className="space-y-1">
                    <h3 className="text-[13px] font-semibold text-white group-hover:text-zinc-200 transition-colors">
                      {space.name}
                    </h3>
                    <p className="text-[11px] text-zinc-500 font-mono">Virtual Space</p>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <footer className="border-t border-zinc-900/80 p-3 px-5 flex items-center justify-between bg-zinc-950/20">
                <button
                  className="flex items-center gap-1 text-[11px] font-semibold text-zinc-400 group-hover:text-white group-hover:translate-x-1 duration-200 transition-all cursor-pointer"
                  onClick={() => {
                    router.push(`/organization/${orgId}/workspace/${workspaceId}/space/${space.id}`);
                  }}
                >
                  Enter Space
                  <i className="ti ti-arrow-right text-[11px]"></i>
                </button>
              </footer>
            </article>
          </li>
        ))}
      </ul>
    </section>
  );
}
