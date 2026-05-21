"use client";

import React from "react";

const activities = [
  { user: "John", action: "edited Sales GPT", time: "just now" },
  { user: "Agent", action: "finished Q3 analytics report", time: "5m ago" },
  { user: "System", action: "prompt benchmark completed", time: "1h ago" },
  { user: "Arav", action: "updated RAG experiment sources", time: "2h ago" },
  { user: "System", action: "connected new Gemini 1.5 Pro model", time: "1d ago" },
];

export default function LabActivityTimeline() {
  return (
    <section className="my-12">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-zinc-500">Timeline</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white">Lab Activity</h2>
        </div>
        <span className="hidden rounded-full border border-zinc-800 bg-zinc-950/80 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-zinc-400 sm:block">
          Auto-synced
        </span>
      </div>
      <div className="relative ml-3 space-y-6 rounded-[24px] border border-zinc-900 bg-[linear-gradient(180deg,rgba(24,24,27,0.72),rgba(9,9,11,0.92))] p-6 pl-8">
        <div className="absolute bottom-6 left-6 top-6 w-px bg-gradient-to-b from-zinc-700 via-zinc-800 to-transparent" />
        {activities.map((act, idx) => (
          <div key={idx} className="relative">
            <span className="absolute -left-[18px] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-black bg-white shadow-[0_0_14px_rgba(255,255,255,0.28)]" />
            <p className="text-sm leading-6 text-zinc-300">
              <span className="font-medium text-white">{act.user}</span> {act.action}
            </p>
            <p className="mt-1 text-xs uppercase tracking-[0.18em] text-zinc-500">{act.time}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
