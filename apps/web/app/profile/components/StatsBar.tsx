"use client";

import React from "react";

export default function StatsBar() {
  const stats = [
    { icon: "ti-building", value: "8", label: "Organizations", delta: "+2 this month", deltaDir: "up" },
    { icon: "ti-layout-grid", value: "24", label: "Workspaces", delta: "+6 this month", deltaDir: "up" },
    { icon: "ti-clock", value: "218", label: "Hours collab'd", delta: "+34h this week", deltaDir: "up" },
    { icon: "ti-video", value: "47", label: "Meetings joined", delta: "same as last", deltaDir: "flat" },
    { icon: "ti-arrows-split", value: "91", label: "Automations", delta: "+19 this week", deltaDir: "up" },
    { icon: "ti-robot", value: "312", label: "AI tasks done", delta: "+54 this week", deltaDir: "up" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 bg-zinc-950/40 border border-zinc-900 rounded-2xl overflow-hidden mb-6">
      {stats.map((stat, i) => (
        <div 
          key={i} 
          className={`flex flex-col items-center p-5 border-zinc-900 hover:bg-zinc-900/50 transition-colors ${
            i < stats.length - 1 ? "border-b md:border-b-0 md:border-r" : ""
          } ${i === 1 || i === 3 ? "md:border-r-0 lg:border-r" : ""} ${i === 2 || i === 4 ? "border-b-0" : ""}`}
        >
          <div className="w-7 h-7 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-white text-sm mb-3">
            <i className={`ti ${stat.icon}`}></i>
          </div>
          <div className="text-2xl font-semibold text-white leading-none mb-1">{stat.value}</div>
          <div className="text-[10px] uppercase tracking-wider text-zinc-500 mb-2">{stat.label}</div>
          <div className={`flex items-center gap-1 font-mono text-[10px] ${stat.deltaDir === 'flat' ? 'text-zinc-600' : 'text-white'}`}>
            <i className={`ti ${stat.deltaDir === 'flat' ? 'ti-minus' : 'ti-arrow-up-right'}`}></i>
            {stat.delta}
          </div>
        </div>
      ))}
    </div>
  );
}
