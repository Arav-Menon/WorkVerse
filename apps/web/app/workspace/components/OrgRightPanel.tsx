"use client";

import React from "react";

export default function OrgRightPanel() {
  const activities = [
    { dot: "bg-emerald-500", text: "<strong>Priya</strong> entered Engineering Hub", time: "just now" },
    { dot: "bg-purple-500", text: "AI agent completed <strong>email automation</strong>", time: "2m ago" },
    { dot: "bg-amber-500", text: "Meeting started in <strong>Product Strategy</strong>", time: "7m ago" },
    { dot: "bg-pink-500", text: "Design room updated — <strong>3 assets</strong>", time: "14m ago" },
    { dot: "bg-blue-500", text: "<strong>James</strong> pushed to main branch", time: "22m ago" },
  ];

  const aiTasks = [
    { text: "Weekly report generated", tag: "report", running: false },
    { text: "Investor call summarized", tag: "summary", running: false },
    { text: "24 leads outreach sent", tag: "outreach", running: false },
    { text: "CI/CD n8n workflow ran", tag: "devops", running: false },
    { text: "Sales pipeline updating...", tag: "live", running: true },
  ];

  const activeOnline = [
    { name: "Arav Kumar", role: "AK", workspace: "Home", color: "bg-purple-950/60 border-purple-800 text-purple-400" },
    { name: "Priya Roy", role: "PR", workspace: "Eng Hub", color: "bg-emerald-950/60 border-emerald-800 text-emerald-400" },
    { name: "James Lee", role: "JL", workspace: "Design", color: "bg-blue-950/60 border-blue-800 text-blue-400" },
  ];

  const shortcuts = [
    { name: "Command palette", key: "⌘K" },
    { name: "Create workspace", key: "⌘N" },
    { name: "AI prompt", key: "⌘J" },
  ];

  return (
    <aside 
      className="bg-black border-l border-zinc-900 w-[260px] h-full overflow-y-auto p-5 shrink-0 hidden xl:flex flex-col gap-6 select-none"
      aria-label="Live activity and telemetry feeds"
    >
      {/* Activity Feed widget */}
      <section className="space-y-3.5">
        <header className="flex items-center justify-between">
          <h3 className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 flex items-center gap-1.5">
            <i className="ti ti-activity text-zinc-400"></i>
            Live Activity
          </h3>
          <span className="text-[10px] text-zinc-500 font-mono">Live</span>
        </header>

        <ol className="space-y-3" role="list">
          {activities.map((act, index) => (
            <li key={index} className="flex gap-2">
              <span className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${act.dot}`} />
              <div className="flex-grow min-w-0">
                <p 
                  className="text-[11px] text-zinc-400 leading-normal"
                  dangerouslySetInnerHTML={{ __html: act.text }}
                />
                <span className="text-[9px] text-zinc-500 mt-0.5 block">{act.time}</span>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* AI Agents widget */}
      <section className="space-y-3.5 pt-4 border-t border-zinc-900">
        <header className="flex items-center justify-between">
          <h3 className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 flex items-center gap-1.5">
            <i className="ti ti-cpu text-zinc-400"></i>
            AI Agents
          </h3>
          <span className="text-[10px] text-zinc-500">5 Active</span>
        </header>

        <ul className="space-y-2">
          {aiTasks.map((task, index) => (
            <li key={index} className="flex items-center gap-2 bg-zinc-950/40 border border-zinc-900 rounded-lg p-2">
              <div className={`w-4 h-4 rounded flex items-center justify-center shrink-0 text-[10px] ${
                task.running 
                  ? "bg-zinc-900 border border-zinc-800 text-zinc-300"
                  : "bg-emerald-950 border border-emerald-900/60 text-emerald-400"
              }`}>
                <i className={`ti ${task.running ? "ti-loader animate-spin" : "ti-check"}`}></i>
              </div>
              <p className="text-[11px] text-zinc-400 truncate flex-grow">{task.text}</p>
              <span className="font-mono text-[8px] bg-zinc-900 border border-zinc-800 px-1 rounded text-zinc-500">
                {task.tag}
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* active dashboard widget */}
      <section className="space-y-3.5 pt-4 border-t border-zinc-900">
        <header className="flex items-center justify-between">
          <h3 className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 flex items-center gap-1.5">
            <i className="ti ti-users text-zinc-400"></i>
            Active Rooms
          </h3>
          <span className="text-[10px] text-zinc-500 font-mono">3 In office</span>
        </header>

        <div className="space-y-1.5">
          {activeOnline.map((pers, index) => (
            <div key={index} className="flex items-center gap-2 bg-zinc-950/20 hover:bg-zinc-950/60 border border-zinc-900 rounded-lg p-2 transition-colors">
              <div className={`w-5 h-5 rounded-full border flex items-center justify-center text-[8px] font-black shrink-0 relative ${pers.color}`}>
                {pers.role}
                <span className="absolute bottom-[-1px] right-[-1px] w-1.5 h-1.5 rounded-full bg-emerald-500 border border-black" />
              </div>
              <div className="min-w-0 flex-grow">
                <p className="text-[11px] font-semibold text-white leading-tight truncate">{pers.name}</p>
                <p className="text-[9px] text-zinc-500 truncate mt-0.5">{pers.workspace}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* shortcuts list */}
      <section className="space-y-3.5 pt-4 border-t border-zinc-900 mt-auto">
        <header className="flex items-center justify-between">
          <h3 className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">Shortcuts</h3>
        </header>

        <div className="space-y-2">
          {shortcuts.map((sh, index) => (
            <div key={index} className="flex items-center justify-between text-[11px] text-zinc-500">
              <span>{sh.name}</span>
              <kbd className="font-mono bg-zinc-950 border border-zinc-900 px-1.5 rounded text-[9px]">{sh.key}</kbd>
            </div>
          ))}
        </div>
      </section>
    </aside>
  );
}
