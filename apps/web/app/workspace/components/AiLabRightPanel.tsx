"use client";

import React from "react";

const integrations = [
  { name: "GitHub", desc: "2 repos synced", icon: "ti-brand-github", dot: "bg-emerald-500", active: true },
  { name: "Notion", desc: "Token expired", icon: "ti-brand-notion", dot: "bg-red-500", active: true },
  { name: "Google Calendar", desc: "3 calendars", icon: "ti-calendar-event", dot: "bg-emerald-500", active: true },
  { name: "Slack", desc: "#dev-alerts", icon: "ti-brand-slack", dot: "bg-emerald-500", active: true },
  { name: "Linear", desc: "Not connected", icon: "ti-hexagon", dot: "bg-zinc-800", active: false },
  { name: "Figma", desc: "Not connected", icon: "ti-brand-figma", dot: "bg-zinc-800", active: false },
];

const stats = [
  { label: "Members", value: "12" },
  { label: "Rooms", value: "6" },
  { label: "Tasks", value: "31" },
  { label: "Docs", value: "47" },
];

const recentAgents = [
  { name: "Code Reviewer", status: "running", lastRun: "3m ago" },
  { name: "Doc Writer", status: "running", lastRun: "12m ago" },
  { name: "Standup Bot", status: "idle", lastRun: "6h ago" },
];

export default function AiLabRightPanel() {
  return (
    <aside
      className="bg-black border-l border-zinc-900/70 w-[240px] xl:w-[280px] h-full overflow-y-auto p-6 shrink-0 hidden lg:flex flex-col gap-8 select-none"
      aria-label="AI Lab Context"
    >
      {/* Context Stats */}
      <section>
        <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 mb-4">Context Stats</h3>
        <div className="grid grid-cols-2 gap-2">
          {stats.map((stat, i) => (
            <div key={i} className="bg-zinc-950/50 border border-zinc-900/60 rounded-xl p-3 flex flex-col justify-center">
              <p className="text-[18px] font-bold text-zinc-300 leading-none mb-1">{stat.value}</p>
              <p className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Automations Status */}
      <section className="bg-emerald-950/10 border border-emerald-900/20 rounded-xl p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 shrink-0">
            <i className="ti ti-infinity text-lg"></i>
          </div>
          <div>
            <p className="text-[12px] font-bold text-emerald-500">Automations</p>
            <p className="text-[10px] text-zinc-500 font-medium">3 currently active</p>
          </div>
        </div>
      </section>

      {/* Active Agents Quick-List */}
      <section className="space-y-3">
        <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-600">Active Agents</h3>
        <ul className="space-y-1">
          {recentAgents.map((agent, i) => (
            <li key={i} className="flex items-center gap-3 group cursor-pointer p-2 -mx-2 rounded-lg hover:bg-zinc-950/50 transition-colors">
              <div className="relative shrink-0">
                <div className="w-7 h-7 rounded-md bg-zinc-950 border border-zinc-800 flex items-center justify-center text-zinc-300">
                  <i className="ti ti-robot text-[13px]"></i>
                </div>
                <span className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border border-black ${
                  agent.status === "running" ? "bg-emerald-500" : "bg-zinc-600"
                }`} />
              </div>
              <div className="flex-grow min-w-0">
                <p className="text-[12px] font-semibold text-zinc-300 truncate">{agent.name}</p>
                <p className="text-[10px] text-zinc-500 truncate">{agent.lastRun}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Integrations */}
      <section className="space-y-4 flex-grow">
        <div className="flex items-center justify-between">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-600">Integrations</h3>
          <button className="text-zinc-500 hover:text-zinc-300 transition-colors">
            <i className="ti ti-plus text-sm"></i>
          </button>
        </div>

        <ul className="space-y-1">
          {integrations.map((int, index) => (
            <li key={index} className="flex items-center gap-3 group cursor-pointer p-2 -mx-2 rounded-lg hover:bg-zinc-950/50 transition-colors">
              <div className={`w-7 h-7 rounded-md flex items-center justify-center shrink-0 border ${int.active ? 'bg-zinc-950 border-zinc-800 text-zinc-300' : 'bg-transparent border-transparent text-zinc-700'}`}>
                <i className={`ti ${int.icon} text-[15px]`}></i>
              </div>
              <div className="flex-grow min-w-0">
                <p className={`text-[12px] font-semibold leading-none mb-1 truncate ${int.active ? 'text-zinc-300' : 'text-zinc-600'}`}>
                  {int.name}
                </p>
                <p className={`text-[10px] truncate leading-none ${int.active ? 'text-zinc-500' : 'text-zinc-700'}`}>
                  {int.desc}
                </p>
              </div>
              <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${int.dot}`} />
            </li>
          ))}
        </ul>
      </section>

    </aside>
  );
}
