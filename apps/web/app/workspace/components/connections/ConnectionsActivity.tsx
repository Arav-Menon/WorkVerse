import React from "react";
import type { Activity } from "./data";

interface ConnectionsActivityProps {
  activities: Activity[];
}

export default function ConnectionsActivity({ activities }: ConnectionsActivityProps) {
  return (
    <section className="mb-10">
      <div className="flex items-center justify-between mb-5 border-b border-zinc-900 pb-3">
        <h2 className="text-[11px] font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-2">
          <i className="ti ti-activity-heartbeat text-zinc-400"></i>
          Recent Activity
        </h2>
        <button className="text-[11px] font-medium text-zinc-500 hover:text-zinc-300 transition-colors">
          View All
        </button>
      </div>

      <div className="space-y-2">
        {activities.map((activity, i) => (
          <div key={i} className="flex items-start sm:items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl bg-zinc-950/30 border border-zinc-900/50 hover:bg-zinc-900/50 hover:border-zinc-800 transition-all group">
            <div className="shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-zinc-950 border border-zinc-800 shadow-sm relative">
              <span className={`absolute top-0 right-0 block w-2 h-2 rounded-full border border-black ${
                activity.type === "sync" ? "bg-emerald-500" :
                activity.type === "error" ? "bg-red-500" : "bg-blue-500"
              }`} />
              <i className={`ti ${activity.icon} text-zinc-500 text-[13px]`}></i>
            </div>

            <div className="flex-grow min-w-0 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="min-w-0">
                <p className="text-[13px] font-semibold text-zinc-200 group-hover:text-white transition-colors truncate">{activity.title}</p>
                <p className="text-[11px] sm:text-[12px] text-zinc-500 truncate">{activity.desc}</p>
              </div>

              <div className="shrink-0 flex items-center gap-2 sm:gap-3 text-[10px] sm:text-[11px] font-medium text-zinc-600">
                <span className={`px-1.5 sm:px-2 py-0.5 rounded-md border ${
                  activity.type === "sync" ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" :
                  activity.type === "error" ? "bg-red-500/10 border-red-500/20 text-red-400" :
                  "bg-blue-500/10 border-blue-500/20 text-blue-400"
                }`}>
                  {activity.type === "sync" ? "Synced" : activity.type === "error" ? "Error" : "AI Action"}
                </span>
                <span>{activity.time}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
