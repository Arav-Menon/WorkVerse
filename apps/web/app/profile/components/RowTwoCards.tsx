"use client";

import React from "react";

export default function RowTwoCards() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
      
      {/* Organizations */}
      <section className="bg-zinc-950/20 border border-zinc-900 rounded-2xl p-6 transition-colors hover:border-zinc-800" aria-labelledby="orgs-h">
        <div className="flex items-center justify-between mb-5">
          <h2 className="flex items-center gap-2 text-[11px] font-semibold text-zinc-500 uppercase tracking-widest" id="orgs-h">
            <i className="ti ti-building text-white text-[13px]"></i> Organizations
          </h2>
          <button className="text-xs text-zinc-400 hover:text-white transition-colors cursor-pointer">View all</button>
        </div>
        
        <ul className="flex flex-col gap-2">
          <li>
            <article className="flex items-center gap-3 bg-zinc-900/40 hover:bg-zinc-900 border border-zinc-800/50 hover:border-zinc-700 rounded-xl p-3 cursor-pointer transition-all group">
              <div className="w-10 h-10 rounded-lg bg-white text-black flex items-center justify-center text-sm font-semibold flex-shrink-0">
                CS
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-[13px] font-semibold text-white truncate">ClevenStudios</h3>
                <p className="text-[11px] text-zinc-500 truncate">12 members · Product design &amp; dev</p>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-zinc-300 whitespace-nowrap">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse shadow-[0_0_8px_rgba(255,255,255,0.6)]"></span> 8 online
              </div>
              <span className="hidden sm:flex items-center gap-1 text-[11px] font-semibold text-zinc-400 group-hover:text-white transition-colors ml-2">
                Open <i className="ti ti-arrow-right"></i>
              </span>
            </article>
          </li>
          <li>
            <article className="flex items-center gap-3 bg-zinc-900/40 hover:bg-zinc-900 border border-zinc-800/50 hover:border-zinc-700 rounded-xl p-3 cursor-pointer transition-all group">
              <div className="w-10 h-10 rounded-lg bg-zinc-800 text-white flex items-center justify-center text-sm font-semibold flex-shrink-0">
                NX
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-[13px] font-semibold text-white truncate">NexaLabs</h3>
                <p className="text-[11px] text-zinc-500 truncate">31 members · AI research &amp; infra</p>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-zinc-300 whitespace-nowrap">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse shadow-[0_0_8px_rgba(255,255,255,0.6)]"></span> 14 online
              </div>
              <span className="hidden sm:flex items-center gap-1 text-[11px] font-semibold text-zinc-400 group-hover:text-white transition-colors ml-2">
                Open <i className="ti ti-arrow-right"></i>
              </span>
            </article>
          </li>
          <li>
            <article className="flex items-center gap-3 bg-zinc-900/40 hover:bg-zinc-900 border border-zinc-800/50 hover:border-zinc-700 rounded-xl p-3 cursor-pointer transition-all group">
              <div className="w-10 h-10 rounded-lg bg-zinc-800 text-white flex items-center justify-center text-sm font-semibold flex-shrink-0">
                SK
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-[13px] font-semibold text-white truncate">SkyForge</h3>
                <p className="text-[11px] text-zinc-500 truncate">9 members · Cloud infrastructure</p>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-zinc-300 whitespace-nowrap">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse shadow-[0_0_8px_rgba(255,255,255,0.6)]"></span> 2 online
              </div>
              <span className="hidden sm:flex items-center gap-1 text-[11px] font-semibold text-zinc-400 group-hover:text-white transition-colors ml-2">
                Open <i className="ti ti-arrow-right"></i>
              </span>
            </article>
          </li>
          <li>
            <article className="flex items-center gap-3 bg-zinc-900/40 hover:bg-zinc-900 border border-zinc-800/50 hover:border-zinc-700 rounded-xl p-3 cursor-pointer transition-all group">
              <div className="w-10 h-10 rounded-lg bg-zinc-800 text-white flex items-center justify-center text-sm font-semibold flex-shrink-0">
                AX
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-[13px] font-semibold text-white truncate">Axiom</h3>
                <p className="text-[11px] text-zinc-500 truncate">17 members · Developer tooling</p>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-zinc-300 whitespace-nowrap">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse shadow-[0_0_8px_rgba(255,255,255,0.6)]"></span> 5 online
              </div>
              <span className="hidden sm:flex items-center gap-1 text-[11px] font-semibold text-zinc-400 group-hover:text-white transition-colors ml-2">
                Open <i className="ti ti-arrow-right"></i>
              </span>
            </article>
          </li>
        </ul>
      </section>

      {/* Recent Workspaces */}
      <section className="bg-zinc-950/20 border border-zinc-900 rounded-2xl p-6 transition-colors hover:border-zinc-800" aria-labelledby="ws-h">
        <div className="flex items-center justify-between mb-5">
          <h2 className="flex items-center gap-2 text-[11px] font-semibold text-zinc-500 uppercase tracking-widest" id="ws-h">
            <i className="ti ti-layout-grid text-white text-[13px]"></i> Continue working
          </h2>
          <button className="text-xs text-zinc-400 hover:text-white transition-colors cursor-pointer">All recents</button>
        </div>
        
        <ul className="flex flex-col gap-2">
          <li>
            <article className="flex items-center gap-3 bg-zinc-900/40 hover:bg-zinc-900 border border-zinc-800/50 hover:border-zinc-700 rounded-xl p-3 cursor-pointer transition-all">
              <div className="w-9 h-9 rounded-lg bg-white text-black flex items-center justify-center text-base flex-shrink-0">
                <i className="ti ti-code"></i>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-[13px] font-semibold text-white truncate">Engineering Hub</h3>
                <p className="text-[11px] text-zinc-500 truncate">ClevenStudios · 7 online · 12m ago</p>
              </div>
              <span className="text-[10px] font-semibold bg-white text-black px-2 py-0.5 rounded-md">Active</span>
            </article>
          </li>
          <li>
            <article className="flex items-center gap-3 bg-zinc-900/40 hover:bg-zinc-900 border border-zinc-800/50 hover:border-zinc-700 rounded-xl p-3 cursor-pointer transition-all">
              <div className="w-9 h-9 rounded-lg bg-zinc-800 text-white flex items-center justify-center text-base flex-shrink-0">
                <i className="ti ti-robot"></i>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-[13px] font-semibold text-white truncate">AI Research Lab</h3>
                <p className="text-[11px] text-zinc-500 truncate">NexaLabs · 3 agents running · now</p>
              </div>
              <span className="text-[10px] font-semibold bg-zinc-800 text-white px-2 py-0.5 rounded-md">AI running</span>
            </article>
          </li>
          <li>
            <article className="flex items-center gap-3 bg-zinc-900/40 hover:bg-zinc-900 border border-zinc-800/50 hover:border-zinc-700 rounded-xl p-3 cursor-pointer transition-all">
              <div className="w-9 h-9 rounded-lg bg-zinc-800 text-white flex items-center justify-center text-base flex-shrink-0">
                <i className="ti ti-box"></i>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-[13px] font-semibold text-white truncate">Product Strategy</h3>
                <p className="text-[11px] text-zinc-500 truncate">ClevenStudios · 11 online · 1h ago</p>
              </div>
              <span className="text-[10px] font-semibold bg-zinc-800 text-white px-2 py-0.5 rounded-md">In progress</span>
            </article>
          </li>
          <li>
            <article className="flex items-center gap-3 bg-zinc-900/40 hover:bg-zinc-900 border border-zinc-800/50 hover:border-zinc-700 rounded-xl p-3 cursor-pointer transition-all">
              <div className="w-9 h-9 rounded-lg bg-zinc-800 text-white flex items-center justify-center text-base flex-shrink-0">
                <i className="ti ti-server"></i>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-[13px] font-semibold text-white truncate">Backend Systems</h3>
                <p className="text-[11px] text-zinc-500 truncate">SkyForge · 2 online · 3h ago</p>
              </div>
              <span className="text-[10px] font-semibold bg-zinc-900 text-zinc-500 px-2 py-0.5 rounded-md border border-zinc-800">Idle</span>
            </article>
          </li>
        </ul>
      </section>

    </div>
  );
}
