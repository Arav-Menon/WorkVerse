"use client";

import React from "react";

const agents = [
  { name: "Meeting Summarizer", status: "Running now", color: "bg-emerald-400", detail: "22 transcripts in queue" },
  { name: "Infra Monitor", status: "Watching pipeline", color: "bg-sky-400", detail: "4 deployment lanes guarded" },
  { name: "Outreach Agent", status: "Generating leads", color: "bg-amber-300", detail: "81 leads enriched this cycle" },
];

export default function LiveAgentsPanel() {
  return (
    <section className="my-12" aria-labelledby="live-agents-title">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-zinc-500">Realtime</p>
          <h2 id="live-agents-title" className="mt-2 text-2xl font-semibold tracking-tight text-white">Live Agents</h2>
        </div>
        <span className="rounded-full border border-zinc-800 bg-zinc-950/80 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-zinc-400">
          3 live sessions
        </span>
      </div>
      <ul className="grid gap-4 lg:grid-cols-3">
        {agents.map((agent) => (
          <li
            key={agent.name}
            className="rounded-[22px] border border-zinc-900 bg-[linear-gradient(180deg,rgba(24,24,27,0.76),rgba(9,9,11,0.92))] p-5 transition-colors hover:border-zinc-700"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className={`h-2.5 w-2.5 rounded-full ${agent.color} shadow-[0_0_12px_rgba(255,255,255,0.25)]`} aria-hidden="true" />
                <p className="text-sm font-medium text-white">{agent.name}</p>
              </div>
              <span className="rounded-full border border-zinc-800 bg-zinc-950/80 px-2.5 py-1 text-[10px] uppercase tracking-[0.2em] text-zinc-400">
                {agent.status}
              </span>
            </div>
            <p className="mt-4 text-sm leading-6 text-zinc-400">{agent.detail}</p>
            <div className="mt-5 flex items-center justify-between border-t border-zinc-900 pt-4">
              <span className="text-xs text-zinc-500">Live telemetry synced</span>
              <button className="rounded-full border border-zinc-800 px-3 py-1.5 text-xs font-medium text-zinc-300 transition-colors hover:border-zinc-700 hover:text-white">
                View
              </button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
