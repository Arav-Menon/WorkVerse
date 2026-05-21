"use client";

import React from "react";

export default function RowThreeCards() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6">
      
      {/* About Card */}
      <section className="bg-zinc-950/20 border border-zinc-900 rounded-2xl p-6 transition-colors hover:border-zinc-800" aria-labelledby="about-h">
        <div className="flex items-center justify-between mb-5">
          <h2 className="flex items-center gap-2 text-[11px] font-semibold text-zinc-500 uppercase tracking-widest" id="about-h">
            <i className="ti ti-user text-white text-[13px]"></i> About
          </h2>
          <button className="text-xs text-zinc-400 hover:text-white transition-colors cursor-pointer">Edit</button>
        </div>
        
        <blockquote className="text-[13px] text-zinc-400 leading-relaxed mb-5 p-3 bg-zinc-900/40 rounded-lg border-l-2 border-white">
          &quot;Building AI-native collaborative systems and multiplayer infrastructure. Passionate about realtime computing and autonomous agents.&quot;
        </blockquote>
        
        <dl className="flex flex-col gap-[2px]">
          <div className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-zinc-900/50 transition-colors">
            <i className="ti ti-briefcase text-white w-4 flex-shrink-0 text-sm text-center"></i>
            <dt className="text-[11px] text-zinc-500 w-[80px] flex-shrink-0">Role</dt>
            <dd className="text-xs text-white truncate">Founder &amp; Lead Engineer</dd>
          </div>
          <div className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-zinc-900/50 transition-colors">
            <i className="ti ti-map-pin text-white w-4 flex-shrink-0 text-sm text-center"></i>
            <dt className="text-[11px] text-zinc-500 w-[80px] flex-shrink-0">Location</dt>
            <dd className="text-xs text-white truncate">Mumbai, India</dd>
          </div>
          <div className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-zinc-900/50 transition-colors">
            <i className="ti ti-clock text-white w-4 flex-shrink-0 text-sm text-center"></i>
            <dt className="text-[11px] text-zinc-500 w-[80px] flex-shrink-0">Timezone</dt>
            <dd className="text-xs text-white truncate">IST · UTC+5:30</dd>
          </div>
          <div className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-zinc-900/50 transition-colors">
            <i className="ti ti-calendar text-white w-4 flex-shrink-0 text-sm text-center"></i>
            <dt className="text-[11px] text-zinc-500 w-[80px] flex-shrink-0">Joined</dt>
            <dd className="text-xs text-white truncate">January 14, 2024</dd>
          </div>
          <div className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-zinc-900/50 transition-colors">
            <i className="ti ti-layout-grid text-white w-4 flex-shrink-0 text-sm text-center"></i>
            <dt className="text-[11px] text-zinc-500 w-[80px] flex-shrink-0">Home ws</dt>
            <dd className="text-xs text-white truncate">Engineering Hub</dd>
          </div>
          <div className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-zinc-900/50 transition-colors">
            <i className="ti ti-circle-check text-white w-4 flex-shrink-0 text-sm text-center"></i>
            <dt className="text-[11px] text-zinc-500 w-[80px] flex-shrink-0">Status</dt>
            <dd className="text-xs">
              <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold bg-zinc-900 text-white border border-zinc-800 rounded-full px-2 py-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.6)]"></span> Open to collaborate
              </span>
            </dd>
          </div>
        </dl>
      </section>

      {/* Timeline Card */}
      <section className="bg-zinc-950/20 border border-zinc-900 rounded-2xl p-6 transition-colors hover:border-zinc-800" aria-labelledby="tl-h">
        <div className="flex items-center justify-between mb-5">
          <h2 className="flex items-center gap-2 text-[11px] font-semibold text-zinc-500 uppercase tracking-widest" id="tl-h">
            <i className="ti ti-activity text-white text-[13px]"></i> Recent activity
          </h2>
          <button className="text-xs text-zinc-400 hover:text-white transition-colors cursor-pointer">All</button>
        </div>
        
        <div className="relative flex flex-col gap-3">
          {/* Timeline track */}
          <div className="absolute left-[8px] top-[10px] bottom-[10px] w-px bg-gradient-to-b from-zinc-700 to-transparent"></div>
          
          <div className="flex items-start gap-3 py-1 relative z-10">
            <div className="w-[17px] h-[17px] rounded-full bg-zinc-900 border-2 border-zinc-500 flex items-center justify-center flex-shrink-0 shadow-[0_0_0_2px_rgba(255,255,255,0.05)] mt-0.5">
              <i className="ti ti-circle-filled text-[8px] text-white"></i>
            </div>
            <div>
              <p className="text-xs text-zinc-400 leading-snug">Joined <strong className="text-white font-medium">Engineering Hub</strong></p>
              <div className="flex items-center gap-1.5 mt-1">
                <time className="text-[10px] text-zinc-600">just now</time>
                <span className="text-[9px] font-mono bg-zinc-900 text-zinc-400 px-1.5 py-0.5 rounded">workspace</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-start gap-3 py-1 relative z-10">
            <div className="w-[17px] h-[17px] rounded-full bg-zinc-950 border border-zinc-800 flex items-center justify-center flex-shrink-0 mt-0.5">
              <i className="ti ti-robot text-[9px] text-white"></i>
            </div>
            <div>
              <p className="text-xs text-zinc-400 leading-snug">AI agent completed <strong className="text-white font-medium">lead outreach</strong></p>
              <div className="flex items-center gap-1.5 mt-1">
                <time className="text-[10px] text-zinc-600">4m ago</time>
                <span className="text-[9px] font-mono bg-zinc-900 text-zinc-400 px-1.5 py-0.5 rounded">ai</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-start gap-3 py-1 relative z-10">
            <div className="w-[17px] h-[17px] rounded-full bg-zinc-950 border border-zinc-800 flex items-center justify-center flex-shrink-0 mt-0.5">
              <i className="ti ti-video text-[9px] text-white"></i>
            </div>
            <div>
              <p className="text-xs text-zinc-400 leading-snug">Started <strong className="text-white font-medium">Design Sprint Review</strong></p>
              <div className="flex items-center gap-1.5 mt-1">
                <time className="text-[10px] text-zinc-600">18m ago</time>
                <span className="text-[9px] font-mono bg-zinc-900 text-zinc-400 px-1.5 py-0.5 rounded">meeting</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-start gap-3 py-1 relative z-10">
            <div className="w-[17px] h-[17px] rounded-full bg-zinc-950 border border-zinc-800 flex items-center justify-center flex-shrink-0 mt-0.5">
              <i className="ti ti-plus text-[9px] text-white"></i>
            </div>
            <div>
              <p className="text-xs text-zinc-400 leading-snug">Created <strong className="text-white font-medium">AI Research Lab</strong></p>
              <div className="flex items-center gap-1.5 mt-1">
                <time className="text-[10px] text-zinc-600">1h ago</time>
                <span className="text-[9px] font-mono bg-zinc-900 text-zinc-400 px-1.5 py-0.5 rounded">create</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-start gap-3 py-1 relative z-10">
            <div className="w-[17px] h-[17px] rounded-full bg-zinc-950 border border-zinc-800 flex items-center justify-center flex-shrink-0 mt-0.5">
              <i className="ti ti-file-text text-[9px] text-white"></i>
            </div>
            <div>
              <p className="text-xs text-zinc-400 leading-snug">AI summarized <strong className="text-white font-medium">Investor Sync</strong> — 14 action items</p>
              <div className="flex items-center gap-1.5 mt-1">
                <time className="text-[10px] text-zinc-600">3h ago</time>
                <span className="text-[9px] font-mono bg-zinc-900 text-zinc-400 px-1.5 py-0.5 rounded">ai</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Card */}
      <section className="bg-zinc-950 border border-zinc-900/50 rounded-2xl p-6 shadow-[inset_0_1px_4px_rgba(255,255,255,0.02)]" aria-labelledby="ai-h">
        <div className="flex items-center justify-between mb-5">
          <h2 className="flex items-center gap-2 text-[11px] font-semibold text-zinc-500 uppercase tracking-widest" id="ai-h">
            <i className="ti ti-cpu text-white text-[13px]"></i> AI activity
          </h2>
          <button className="text-xs text-zinc-400 hover:text-white transition-colors cursor-pointer">Lab →</button>
        </div>
        
        <div className="flex items-center justify-between bg-zinc-900 border border-zinc-800 rounded-xl p-3 px-4 mb-5">
          <span className="text-[11px] text-zinc-400 uppercase tracking-wider font-semibold">AI score · this week</span>
          <span className="text-xl font-semibold text-white">94 <span className="text-[11px] text-zinc-500 font-normal">pts</span></span>
        </div>
        
        <ul className="flex flex-col">
          <li className="flex items-center gap-3 py-2 border-b border-zinc-900/50">
            <div className="w-5 h-5 rounded bg-zinc-900 border border-zinc-800 flex items-center justify-center flex-shrink-0">
              <i className="ti ti-check text-[10px] text-white"></i>
            </div>
            <p className="text-xs text-zinc-400 flex-1">Workflows automated</p>
            <span className="font-mono text-[11px] font-medium text-zinc-300">12</span>
          </li>
          <li className="flex items-center gap-3 py-2 border-b border-zinc-900/50">
            <div className="w-5 h-5 rounded bg-zinc-900 border border-zinc-800 flex items-center justify-center flex-shrink-0">
              <i className="ti ti-check text-[10px] text-white"></i>
            </div>
            <p className="text-xs text-zinc-400 flex-1">Meetings summarized</p>
            <span className="font-mono text-[11px] font-medium text-zinc-300">8</span>
          </li>
          <li className="flex items-center gap-3 py-2 border-b border-zinc-900/50">
            <div className="w-5 h-5 rounded bg-zinc-900 border border-zinc-800 flex items-center justify-center flex-shrink-0">
              <i className="ti ti-check text-[10px] text-white"></i>
            </div>
            <p className="text-xs text-zinc-400 flex-1">Reports generated</p>
            <span className="font-mono text-[11px] font-medium text-zinc-300">4</span>
          </li>
          <li className="flex items-center gap-3 py-2 border-b border-zinc-900/50">
            <div className="w-5 h-5 rounded bg-zinc-900 border border-zinc-800 flex items-center justify-center flex-shrink-0">
              <i className="ti ti-check text-[10px] text-white"></i>
            </div>
            <p className="text-xs text-zinc-400 flex-1">Emails sent via agent</p>
            <span className="font-mono text-[11px] font-medium text-zinc-300">38</span>
          </li>
          <li className="flex items-center gap-3 py-2 border-b border-zinc-900/50">
            <div className="w-5 h-5 rounded bg-zinc-900 border border-zinc-800 flex items-center justify-center flex-shrink-0">
              <i className="ti ti-check text-[10px] text-white"></i>
            </div>
            <p className="text-xs text-zinc-400 flex-1">AI interactions total</p>
            <span className="font-mono text-[11px] font-medium text-zinc-300">312</span>
          </li>
          <li className="flex items-center gap-3 py-2">
            <div className="w-5 h-5 rounded bg-white text-black flex items-center justify-center flex-shrink-0">
              <i className="ti ti-loader text-[10px] animate-spin"></i>
            </div>
            <p className="text-xs text-white flex-1 font-medium">Sales pipeline updating…</p>
          </li>
        </ul>
      </section>

    </div>
  );
}
