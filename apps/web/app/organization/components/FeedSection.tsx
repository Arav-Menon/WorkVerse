"use client";

import React from "react";

interface Activity {
  id: string;
  dotColor: "purple" | "green" | "amber" | "blue" | "coral";
  text: string;
  time: string;
  user?: string;
}

interface AiTask {
  id: string;
  text: string;
  tag: string;
  status: "completed" | "running";
}

interface FeedSectionProps {
  activities: Activity[];
  aiTasks: AiTask[];
  onAiViewAllClick: () => void;
}

export default function FeedSection({
  activities,
  aiTasks,
  onAiViewAllClick,
}: FeedSectionProps) {
  const dotColorMap = {
    purple: "bg-zinc-600",
    green: "bg-emerald-500",
    amber: "bg-amber-500",
    blue: "bg-blue-500",
    coral: "bg-orange-500",
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8 select-none">
      {/* Real-time Activity Feed */}
      <section className="bg-zinc-950/40 border border-zinc-900 rounded-xl p-5 flex flex-col backdrop-blur-sm" aria-labelledby="activity-heading">
        <header className="flex items-center justify-between mb-4">
          <h2 className="flex items-center gap-1.5 text-[10px] font-semibold text-zinc-500 uppercase tracking-widest" id="activity-heading">
            Recent activity
          </h2>
          <button 
            className="text-[11px] text-zinc-400 hover:text-white transition-colors cursor-pointer" 
            onClick={() => alert("Activity feed is live synced.")}
          >
            All
          </button>
        </header>
        <ol className="flex flex-col divide-y divide-zinc-900" aria-live="polite" aria-label="Real-time activity feed">
          {activities.map((act) => (
            <li className="flex items-start gap-2.5 py-3 first:pt-0 last:pb-0" key={act.id}>
              <div 
                className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${dotColorMap[act.dotColor] || "bg-zinc-600"}`} 
                aria-hidden="true"
              ></div>
              <div className="flex-1 min-w-0">
                <p className="text-[12px] text-zinc-400 leading-relaxed">
                  {act.user ? <strong className="text-white font-medium">{act.user}</strong> : null} {act.text}
                </p>
                <time className="text-[10px] text-zinc-500 mt-0.5 block">{act.time}</time>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* AI Agent Activity Feed */}
      <section className="bg-zinc-950/40 border border-zinc-900 rounded-xl p-5 flex flex-col backdrop-blur-sm" aria-labelledby="ai-heading">
        <header className="flex items-center justify-between mb-4">
          <h2 className="flex items-center gap-1.5 text-[10px] font-semibold text-zinc-500 uppercase tracking-widest" id="ai-heading">
            <i className="ti ti-cpu text-[11px] text-zinc-400" aria-hidden="true"></i>
            AI activity
          </h2>
          <button 
            className="text-[11px] text-zinc-400 hover:text-white transition-colors cursor-pointer" 
            onClick={onAiViewAllClick}
          >
            View all
          </button>
        </header>
        
        <ul className="flex flex-col divide-y divide-zinc-900" aria-live="polite" aria-label="AI agent activity log">
          {aiTasks.map((task) => (
            <li className="flex items-center gap-2.5 py-3 first:pt-0 last:pb-0" key={task.id}>
              <div 
                className={`w-[18px] h-[18px] rounded flex items-center justify-center flex-shrink-0 text-[10px] ${
                  task.status === "running" 
                    ? "bg-zinc-900 border border-zinc-800 text-zinc-300" 
                    : "bg-emerald-950 border border-emerald-900/60 text-emerald-400"
                }`} 
                aria-label={task.status} 
                role="img"
              >
                <i className={`ti ${task.status === "running" ? "ti-loader animate-spin" : "ti-check"}`} aria-hidden="true"></i>
              </div>
              <p className={`text-[12px] text-zinc-400 flex-1 min-w-0 truncate ${task.status === "running" ? "text-zinc-300 font-medium" : ""}`}>
                {task.text}
              </p>
              <span className="font-mono text-[9px] text-zinc-400 bg-zinc-900 border border-zinc-800 rounded px-1.5 py-0.5 select-none whitespace-nowrap">
                {task.tag}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
