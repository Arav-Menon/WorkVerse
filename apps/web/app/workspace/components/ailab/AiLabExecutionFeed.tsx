import React, { useState } from "react";
import type { ExecutionLog } from "./data";

interface AiLabExecutionFeedProps {
  logs: ExecutionLog[];
}

const typeFilters = ["All", "Agent", "Workflow", "System", "Error"];

export default function AiLabExecutionFeed({ logs }: AiLabExecutionFeedProps) {
  const [activeFilter, setActiveFilter] = useState("All");

  const filteredLogs = logs.filter(log => {
    if (activeFilter === "All") return true;
    return log.type === activeFilter.toLowerCase();
  });

  return (
    <section>
      <div className="flex items-center justify-between mb-5 border-b border-zinc-900 pb-3">
        <h3 className="text-[11px] font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-2">
          <i className="ti ti-activity-heartbeat text-lg text-zinc-400"></i>
          Execution Feed
        </h3>
        <button className="text-[11px] font-medium text-zinc-500 hover:text-zinc-300 transition-colors">
          View All Logs
        </button>
      </div>

      {/* Filter pills */}
      <div className="flex items-center gap-1.5 mb-5 flex-wrap">
        {typeFilters.map(filter => (
          <button
            key={filter}
            className={`px-3 py-1 rounded-full border text-[10px] font-medium transition-all cursor-pointer ${
              activeFilter === filter
                ? "bg-zinc-900 border-zinc-800 text-white"
                : "bg-zinc-950/40 border-zinc-900 text-zinc-500 hover:border-zinc-800 hover:text-zinc-300"
            }`}
            onClick={() => setActiveFilter(filter)}
          >
            {filter}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-2">
        {filteredLogs.map((log, i) => (
          <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-zinc-950/30 border border-zinc-900/50 hover:bg-zinc-900/50 hover:border-zinc-800 transition-all group">
            <div className="shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-zinc-950 border border-zinc-800 shadow-sm relative">
              <span className={`absolute top-0 right-0 block w-2 h-2 rounded-full border border-black ${
                log.type === "workflow" ? "bg-emerald-500" :
                log.type === "agent" ? "bg-blue-500" :
                log.type === "error" ? "bg-red-500" : "bg-zinc-500"
              }`} />
              <i className={`ti ${log.icon} text-zinc-500 text-[13px]`}></i>
            </div>

            <div className="flex-grow min-w-0 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <p className="text-[13px] font-semibold text-zinc-200 group-hover:text-white transition-colors truncate">{log.title}</p>
                <p className="text-[12px] text-zinc-500 truncate">{log.desc}</p>
              </div>

              <div className="shrink-0 flex items-center gap-3 text-[11px] font-medium text-zinc-600">
                <span className={`px-2 py-0.5 rounded-md border ${
                  log.type === "workflow" ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" :
                  log.type === "agent" ? "bg-blue-500/10 border-blue-500/20 text-blue-400" :
                  log.type === "error" ? "bg-red-500/10 border-red-500/20 text-red-400" :
                  "bg-zinc-900 border-zinc-800 text-zinc-400"
                }`}>
                  {log.type === "workflow" ? "Workflow" : log.type === "agent" ? "Agent" : log.type === "error" ? "Error" : "System"}
                </span>
                <span>{log.time}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
