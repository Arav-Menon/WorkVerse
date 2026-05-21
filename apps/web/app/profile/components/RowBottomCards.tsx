"use client";

import React from "react";

export default function RowBottomCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
      
      {/* Connected Accounts */}
      <section className="bg-zinc-950/20 border border-zinc-900 rounded-2xl p-6 transition-colors hover:border-zinc-800" aria-labelledby="conn-h">
        <div className="flex items-center justify-between mb-5">
          <h2 className="flex items-center gap-2 text-[11px] font-semibold text-zinc-500 uppercase tracking-widest" id="conn-h">
            <i className="ti ti-plug text-white text-[13px]"></i> Connected accounts
          </h2>
          <button className="text-xs text-zinc-400 hover:text-white transition-colors cursor-pointer">Manage</button>
        </div>
        
        <ul className="flex flex-col gap-2">
          <li className="flex items-center gap-3 bg-zinc-900/40 border border-zinc-800/50 rounded-xl p-2.5 px-3">
            <div className="w-7 h-7 rounded bg-zinc-900 flex items-center justify-center text-white flex-shrink-0">
              <i className="ti ti-brand-github text-sm"></i>
            </div>
            <span className="text-xs text-white flex-1 font-medium">GitHub</span>
            <span className="text-[10px] font-semibold bg-white text-black px-2 py-0.5 rounded-full">Connected</span>
          </li>
          <li className="flex items-center gap-3 bg-zinc-900/40 border border-zinc-800/50 rounded-xl p-2.5 px-3">
            <div className="w-7 h-7 rounded bg-zinc-900 flex items-center justify-center text-white flex-shrink-0">
              <i className="ti ti-brand-google text-sm"></i>
            </div>
            <span className="text-xs text-white flex-1 font-medium">Google</span>
            <span className="text-[10px] font-semibold bg-white text-black px-2 py-0.5 rounded-full">Connected</span>
          </li>
          <li className="flex items-center gap-3 bg-zinc-900/40 border border-zinc-800/50 rounded-xl p-2.5 px-3">
            <div className="w-7 h-7 rounded bg-zinc-900 flex items-center justify-center text-white flex-shrink-0">
              <i className="ti ti-brand-slack text-sm"></i>
            </div>
            <span className="text-xs text-white flex-1 font-medium">Slack</span>
            <span className="text-[10px] font-semibold bg-white text-black px-2 py-0.5 rounded-full">Connected</span>
          </li>
          <li className="flex items-center gap-3 bg-zinc-900/40 border border-zinc-800/50 rounded-xl p-2.5 px-3">
            <div className="w-7 h-7 rounded bg-zinc-900 flex items-center justify-center text-white flex-shrink-0">
              <i className="ti ti-brand-zoom text-sm"></i>
            </div>
            <span className="text-xs text-white flex-1 font-medium">Zoom</span>
            <span className="text-[10px] font-semibold bg-zinc-950 border border-zinc-800 text-zinc-400 px-2 py-0.5 rounded-full">Disconnected</span>
          </li>
          <li className="flex items-center gap-3 bg-zinc-900/40 border border-zinc-800/50 rounded-xl p-2.5 px-3">
            <div className="w-7 h-7 rounded bg-zinc-900 flex items-center justify-center text-white flex-shrink-0">
              <i className="ti ti-brand-notion text-sm"></i>
            </div>
            <span className="text-xs text-white flex-1 font-medium">Notion</span>
            <span className="text-[10px] font-semibold bg-zinc-950 border border-zinc-800 text-zinc-400 px-2 py-0.5 rounded-full cursor-pointer hover:text-white transition-colors">Connect</span>
          </li>
        </ul>
      </section>

      {/* Settings */}
      <section className="bg-zinc-950/20 border border-zinc-900 rounded-2xl p-6 transition-colors hover:border-zinc-800" aria-labelledby="settings-h">
        <div className="flex items-center justify-between mb-5">
          <h2 className="flex items-center gap-2 text-[11px] font-semibold text-zinc-500 uppercase tracking-widest" id="settings-h">
            <i className="ti ti-settings text-white text-[13px]"></i> Settings
          </h2>
        </div>
        
        <nav className="flex flex-col">
          <a href="#" className="flex items-center gap-3 p-2 rounded-xl hover:bg-zinc-900/80 transition-colors group">
            <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-white flex-shrink-0">
              <i className="ti ti-user text-sm"></i>
            </div>
            <span className="text-[13px] text-zinc-400 group-hover:text-white flex-1 transition-colors">Account</span>
            <i className="ti ti-chevron-right text-zinc-600 group-hover:text-white text-xs transition-colors"></i>
          </a>
          <a href="#" className="flex items-center gap-3 p-2 rounded-xl hover:bg-zinc-900/80 transition-colors group">
            <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-white flex-shrink-0">
              <i className="ti ti-shield-check text-sm"></i>
            </div>
            <span className="text-[13px] text-zinc-400 group-hover:text-white flex-1 transition-colors">Security</span>
            <i className="ti ti-chevron-right text-zinc-600 group-hover:text-white text-xs transition-colors"></i>
          </a>
          <a href="#" className="flex items-center gap-3 p-2 rounded-xl hover:bg-zinc-900/80 transition-colors group">
            <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-white flex-shrink-0">
              <i className="ti ti-bell text-sm"></i>
            </div>
            <span className="text-[13px] text-zinc-400 group-hover:text-white flex-1 transition-colors">Notifications</span>
            <span className="bg-white text-black text-[10px] font-bold px-1.5 py-0.5 rounded-full">3</span>
            <i className="ti ti-chevron-right text-zinc-600 group-hover:text-white text-xs transition-colors"></i>
          </a>
          <a href="#" className="flex items-center gap-3 p-2 rounded-xl hover:bg-zinc-900/80 transition-colors group">
            <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-white flex-shrink-0">
              <i className="ti ti-layout-grid text-sm"></i>
            </div>
            <span className="text-[13px] text-zinc-400 group-hover:text-white flex-1 transition-colors">Workspace prefs</span>
            <i className="ti ti-chevron-right text-zinc-600 group-hover:text-white text-xs transition-colors"></i>
          </a>
          <a href="#" className="flex items-center gap-3 p-2 rounded-xl hover:bg-zinc-900/80 transition-colors group">
            <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-white flex-shrink-0">
              <i className="ti ti-palette text-sm"></i>
            </div>
            <span className="text-[13px] text-zinc-400 group-hover:text-white flex-1 transition-colors">Appearance</span>
            <i className="ti ti-chevron-right text-zinc-600 group-hover:text-white text-xs transition-colors"></i>
          </a>
          <a href="#" className="flex items-center gap-3 p-2 rounded-xl hover:bg-zinc-900/80 transition-colors group">
            <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-white flex-shrink-0">
              <i className="ti ti-alert-triangle text-sm"></i>
            </div>
            <span className="text-[13px] text-zinc-400 group-hover:text-white flex-1 transition-colors">Danger zone</span>
            <i className="ti ti-chevron-right text-zinc-600 group-hover:text-white text-xs transition-colors"></i>
          </a>
        </nav>
      </section>

      {/* API Access */}
      <section className="bg-zinc-950/20 border border-zinc-900 rounded-2xl p-6 transition-colors hover:border-zinc-800" aria-labelledby="api-h">
        <div className="flex items-center justify-between mb-5">
          <h2 className="flex items-center gap-2 text-[11px] font-semibold text-zinc-500 uppercase tracking-widest" id="api-h">
            <i className="ti ti-key text-white text-[13px]"></i> API access
          </h2>
          <button className="text-xs text-zinc-400 hover:text-white transition-colors cursor-pointer">New key</button>
        </div>
        
        <div className="bg-zinc-900/40 border border-zinc-800/50 rounded-xl p-3 px-4 mb-3">
          <div className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1.5">Active key</div>
          <div className="font-mono text-xs text-white tracking-wide">wv_live_••••••••••••3f9a</div>
        </div>
        
        <div className="flex gap-2 mb-5">
          <button className="flex-1 flex items-center justify-center gap-1.5 bg-transparent hover:bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white text-xs py-1.5 rounded-lg transition-colors">
            <i className="ti ti-copy"></i> Copy
          </button>
          <button className="flex-1 flex items-center justify-center gap-1.5 bg-transparent hover:bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white text-xs py-1.5 rounded-lg transition-colors">
            <i className="ti ti-refresh"></i> Rotate
          </button>
        </div>
        
        <div className="bg-zinc-900/40 border border-zinc-800/50 rounded-xl p-3 px-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] text-zinc-400">Monthly usage</span>
            <span className="font-mono text-[11px] text-zinc-300">3,412 / 10,000 req</span>
          </div>
          <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
            <div className="h-full w-[34%] bg-white rounded-full"></div>
          </div>
          <p className="text-[10px] text-zinc-500 mt-2">34% used · resets Jun 1</p>
        </div>
        
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2.5 p-2 px-3 bg-zinc-900/40 border border-zinc-800/50 rounded-lg">
            <div className="w-1.5 h-1.5 rounded-full bg-white flex-shrink-0"></div>
            <span className="text-[11px] text-zinc-300 flex-1">Production key</span>
            <span className="text-[10px] text-zinc-500">Created Jan 14</span>
          </div>
          <div className="flex items-center gap-2.5 p-2 px-3 bg-zinc-900/40 border border-zinc-800/50 rounded-lg">
            <div className="w-1.5 h-1.5 rounded-full bg-zinc-600 flex-shrink-0"></div>
            <span className="text-[11px] text-zinc-300 flex-1">Dev / staging key</span>
            <span className="text-[10px] text-zinc-500">Created Mar 3</span>
          </div>
        </div>
      </section>

    </div>
  );
}
