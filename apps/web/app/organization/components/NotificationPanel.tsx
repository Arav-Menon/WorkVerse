"use client";

import React from "react";

export default function NotificationPanel() {
  return (
    <div
      className="absolute right-0 top-[calc(100%+10px)] z-[300] flex max-h-[min(78vh,560px)] w-[min(calc(100vw-1rem),420px)] flex-col overflow-hidden rounded-2xl border border-zinc-700/90 bg-black/82 shadow-[0_28px_80px_rgba(0,0,0,0.92),inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-[28px] supports-[backdrop-filter]:bg-black/68 animate-in fade-in slide-in-from-top-2 duration-200 max-sm:right-[-6px] max-sm:max-h-[min(72vh,520px)] max-sm:rounded-[20px]"
      role="dialog"
      aria-label="Notifications"
    >
      
      {/* Background ambient texture */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-95">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.06),transparent_28%),linear-gradient(180deg,rgba(10,10,12,0.82),rgba(0,0,0,0.58))]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff04_1px,transparent_1px)] bg-[size:32px_32px]"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 flex flex-col gap-3 border-b border-white/10 bg-black/42 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-full border border-zinc-800 bg-zinc-900 text-zinc-100">
            <i className="ti ti-bell-filled text-sm"></i>
          </div>
          <div className="min-w-0">
            <h3 className="text-[13px] font-semibold tracking-wide text-white">Notifications</h3>
            <p className="mt-0.5 text-[10px] uppercase tracking-[0.18em] text-zinc-500">Realtime workspace activity</p>
          </div>
          <div className="hidden items-center gap-1.5 rounded-full border border-zinc-800 bg-zinc-900 px-2 py-0.5 sm:flex">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse shadow-[0_0_8px_rgba(255,255,255,0.6)]"></span>
            <span className="text-[9px] font-mono text-zinc-300 uppercase tracking-wider">Live updates</span>
          </div>
        </div>
        <button className="self-start rounded-full border border-zinc-800 bg-zinc-950/70 px-3 py-1.5 text-[11px] font-medium text-zinc-400 transition-colors cursor-pointer hover:border-zinc-700 hover:text-white sm:self-auto">
          Mark all as read
        </button>
      </div>

      {/* AI Summary Card */}
      <div className="relative z-10 mx-3 mb-1 mt-3 rounded-xl border border-white/10 bg-black/46 p-3 transition-colors group cursor-default hover:bg-black/54">
        <div className="flex items-start gap-2.5">
          <div className="w-6 h-6 rounded-md bg-white text-black flex items-center justify-center flex-shrink-0 mt-0.5">
            <i className="ti ti-sparkles text-xs"></i>
          </div>
          <div>
            <h4 className="text-[11px] font-semibold text-white mb-0.5 group-hover:text-zinc-200 transition-colors">AI Summary</h4>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              3 new workspace updates. <br/>
              1 meeting started. 2 workflows completed.
            </p>
          </div>
        </div>
      </div>

      {/* Notification List Scroll Area */}
      <div className="relative z-10 flex-1 overflow-y-auto custom-scrollbar pb-2">
        
        {/* Today Group */}
        <div className="px-4 py-2 mt-2 sticky top-0 bg-black/58 backdrop-blur-[24px] z-20">
          <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest">Today</span>
        </div>

        <div className="flex flex-col gap-1 px-2">
          
          {/* Notification Item 1: Meeting */}
          <div className="flex gap-3 p-3 rounded-xl hover:bg-zinc-900/50 border border-transparent hover:border-zinc-800 transition-all cursor-pointer group relative">
            {/* Unread indicator */}
            <div className="absolute left-1.5 top-[22px] w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]"></div>
            
            <div className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-white flex-shrink-0 ml-2">
              <i className="ti ti-video text-sm"></i>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start mb-0.5">
                <h4 className="text-[12px] font-semibold text-white truncate pr-2">Meeting started</h4>
                <span className="text-[9px] text-zinc-500 font-mono flex-shrink-0 mt-0.5">2 min ago</span>
              </div>
              <p className="text-[11px] text-zinc-400 mb-2 truncate">Daily sync is now live.</p>
              <button className="text-[11px] font-medium text-black bg-white hover:bg-zinc-200 px-3 py-1 rounded-md transition-colors w-fit flex items-center gap-1.5">
                Join <i className="ti ti-arrow-right text-[10px]"></i>
              </button>
            </div>
          </div>

          {/* Notification Item 2: AI Workflow */}
          <div className="flex gap-3 p-3 rounded-xl hover:bg-zinc-900/50 border border-transparent hover:border-zinc-800 transition-all cursor-pointer group relative">
            <div className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-white flex-shrink-0 ml-2">
              <i className="ti ti-robot text-sm"></i>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start mb-0.5">
                <h4 className="text-[12px] font-semibold text-white truncate pr-2">AI Agent completed workflow</h4>
                <span className="text-[9px] text-zinc-500 font-mono flex-shrink-0 mt-0.5">5 min ago</span>
              </div>
              <p className="text-[11px] text-zinc-400 mb-2 truncate">Weekly report generated successfully.</p>
              <button className="text-[11px] font-medium text-zinc-300 hover:text-white bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 px-3 py-1 rounded-md transition-colors w-fit flex items-center gap-1.5">
                View <i className="ti ti-arrow-right text-[10px]"></i>
              </button>
            </div>
          </div>

          {/* Notification Item 3: Member joined */}
          <div className="flex gap-3 p-3 rounded-xl hover:bg-zinc-900/50 border border-transparent hover:border-zinc-800 transition-all cursor-pointer group relative">
            <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 ml-2">
              JD
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start mb-0.5">
                <h4 className="text-[12px] font-semibold text-zinc-300 group-hover:text-white truncate pr-2 transition-colors">John joined Engineering Workspace</h4>
                <span className="text-[9px] text-zinc-600 font-mono flex-shrink-0 mt-0.5">1 hr ago</span>
              </div>
              <p className="text-[11px] text-zinc-500 truncate">John entered Backend Arena.</p>
            </div>
          </div>

        </div>

        {/* Yesterday Group */}
        <div className="px-4 py-2 mt-2 sticky top-0 bg-black/58 backdrop-blur-[24px] z-20">
          <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest">Yesterday</span>
        </div>

        <div className="flex flex-col gap-1 px-2">
          
          {/* Notification Item 4: Invitation */}
          <div className="flex gap-3 p-3 rounded-xl hover:bg-zinc-900/50 border border-transparent hover:border-zinc-800 transition-all cursor-pointer group relative">
            <div className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-white flex-shrink-0 ml-2">
              <i className="ti ti-mail-opened text-sm"></i>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start mb-0.5">
                <h4 className="text-[12px] font-semibold text-zinc-300 group-hover:text-white truncate pr-2 transition-colors">Invitation received</h4>
                <span className="text-[9px] text-zinc-600 font-mono flex-shrink-0 mt-0.5">1d ago</span>
              </div>
              <p className="text-[11px] text-zinc-500 mb-2 truncate">You were invited to Product Workspace.</p>
              <div className="flex items-center gap-2">
                <button className="text-[10px] font-medium text-black bg-white hover:bg-zinc-200 px-3 py-1 rounded-md transition-colors flex-1">
                  Accept
                </button>
                <button className="text-[10px] font-medium text-zinc-400 hover:text-white bg-transparent hover:bg-zinc-900 border border-zinc-800 px-3 py-1 rounded-md transition-colors flex-1">
                  Decline
                </button>
              </div>
            </div>
          </div>

          {/* Notification Item 5: Automation */}
          <div className="flex gap-3 p-3 rounded-xl hover:bg-zinc-900/50 border border-transparent hover:border-zinc-800 transition-all cursor-pointer group relative">
            <div className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-white flex-shrink-0 ml-2">
              <i className="ti ti-bolt text-sm"></i>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start mb-0.5">
                <h4 className="text-[12px] font-semibold text-zinc-300 group-hover:text-white truncate pr-2 transition-colors">Automation completed</h4>
                <span className="text-[9px] text-zinc-600 font-mono flex-shrink-0 mt-0.5">1d ago</span>
              </div>
              <p className="text-[11px] text-zinc-500 mb-2 truncate">Slack notification workflow finished.</p>
              <button className="text-[11px] font-medium text-zinc-400 hover:text-white bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 px-3 py-1 rounded-md transition-colors w-fit flex items-center gap-1.5">
                Open <i className="ti ti-arrow-right text-[10px]"></i>
              </button>
            </div>
          </div>

        </div>
      </div>
      
      {/* Footer */}
      <div className="relative z-10 border-t border-white/10 bg-black/42 p-3 text-center">
        <p className="text-[10px] text-zinc-600">Realtime updates from your workspace.</p>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #27272a;
          border-radius: 4px;
        }
      `}} />
    </div>
  );
}
