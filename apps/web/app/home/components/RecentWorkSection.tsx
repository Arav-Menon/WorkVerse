"use client";

import React from "react";

interface RecentWorkSectionProps {
  onViewAllClick: () => void;
}

export default function RecentWorkSection({ onViewAllClick }: RecentWorkSectionProps) {
  const recentItems = [
    {
      title: "Backend deployment pipeline",
      meta: "ClevenStudios · Dev workspace · edited 12m ago",
      icon: "ti-code",
      badgeText: "Active",
      badgeStyle: "bg-emerald-950/50 border border-emerald-900/50 text-emerald-400",
    },
    {
      title: "AI agent — lead outreach",
      meta: "NexaLabs · Sales workspace · running now",
      icon: "ti-robot",
      badgeText: "AI running",
      badgeStyle: "bg-zinc-900/50 border border-zinc-800 text-zinc-300",
    },
    {
      title: "Q3 sprint planning board",
      meta: "ClevenStudios · Product workspace · 1h ago",
      icon: "ti-layout-kanban",
      badgeText: "Idle",
      badgeStyle: "bg-zinc-950/50 border border-zinc-900/50 text-zinc-500",
    },
    {
      title: "Investor call — follow-up automation",
      meta: "SkyForge · Founder ops · 3h ago",
      icon: "ti-brand-zoom",
      badgeText: "Scheduled",
      badgeStyle: "bg-amber-950/50 border border-amber-900/50 text-amber-400",
    },
  ];

  return (
    <section className="mb-8" aria-labelledby="recent-heading">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest select-none" id="recent-heading">Recently opened</h2>
        <button 
          className="flex items-center gap-1 text-[11px] text-zinc-400 hover:text-white transition-colors cursor-pointer" 
          onClick={onViewAllClick}
        >
          View all
          <i className="ti ti-arrow-right text-[11px]" aria-hidden="true"></i>
        </button>
      </div>
      
      <ul className="flex flex-col gap-2" role="list">
        {recentItems.map((item) => (
          <li key={item.title}>
            <article className="flex items-start sm:items-center gap-3 bg-zinc-950/40 border border-zinc-900 rounded-xl p-3 px-4 hover:border-zinc-800 hover:bg-zinc-900/30 transition-all cursor-pointer text-left w-full" role="button" tabIndex={0}>
              <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-sm text-zinc-400 flex-shrink-0 mt-0.5 sm:mt-0" aria-hidden="true">
                <i className={`ti ${item.icon}`}></i>
              </div>
              <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="min-w-0">
                  <h3 className="text-[13px] font-semibold text-white mb-0.5 truncate">{item.title}</h3>
                  <p className="text-[11px] text-zinc-500 truncate">{item.meta}</p>
                </div>
                <span className={`text-[10px] font-semibold px-2.5 py-0.5 rounded border select-none whitespace-nowrap self-start sm:self-center ${item.badgeStyle}`} role="status">
                  {item.badgeText}
                </span>
              </div>
            </article>
          </li>
        ))}
      </ul>
    </section>
  );
}
