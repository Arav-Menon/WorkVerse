"use client";

import React from "react";

const prompts = [
  { title: "Sales Email Generator", creator: "Alice", model: "GPT-4", status: "Completed", updated: "2h ago" },
  { title: "DevOps Incident Resolver", creator: "Bob", model: "Claude", status: "Running", updated: "15m ago" },
  { title: "Startup Pitch Creator", creator: "Carol", model: "Gemini", status: "Completed", updated: "1d ago" },
  { title: "Meeting Summarizer", creator: "Dave", model: "GPT-4", status: "Completed", updated: "30m ago" },
];

export default function PromptPlaygroundSection() {
  return (
    <section className="my-12">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-zinc-500">Workbench</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white">Prompt Playground</h2>
        </div>
        <button className="hidden rounded-full border border-zinc-800 bg-zinc-950/70 px-4 py-2 text-xs font-medium text-zinc-300 transition-colors hover:border-zinc-700 hover:text-white sm:block">
          New prompt draft
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {prompts.map((p) => (
          <article
            key={p.title}
            className="flex flex-col rounded-[22px] border border-zinc-900 bg-[linear-gradient(180deg,rgba(24,24,27,0.76),rgba(9,9,11,0.92))] p-5 transition-all hover:border-zinc-700 hover:shadow-[0_20px_60px_rgba(0,0,0,0.35)]"
          >
            <header className="mb-4 flex items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-medium text-white">{p.title}</h3>
                <p className="mt-2 text-xs uppercase tracking-[0.2em] text-zinc-500">Created by {p.creator}</p>
              </div>
              <span className="rounded-full border border-zinc-800 bg-zinc-950/80 px-2.5 py-1 text-[10px] uppercase tracking-[0.2em] text-zinc-400">
                {p.updated}
              </span>
            </header>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-2xl border border-zinc-900/80 bg-black/25 p-3">
                <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">Model</p>
                <p className="mt-2 font-medium text-zinc-100">{p.model}</p>
              </div>
              <div className="rounded-2xl border border-zinc-900/80 bg-black/25 p-3">
                <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">Status</p>
                <p className="mt-2 font-medium text-zinc-100">{p.status}</p>
              </div>
            </div>
            <footer className="mt-5 flex items-center justify-between border-t border-zinc-900 pt-4 text-sm text-zinc-500">
              <span className="text-zinc-500">Last tuned in sandbox</span>
              <button className="rounded-full border border-zinc-800 px-3 py-1.5 text-xs font-medium text-zinc-300 transition-colors hover:border-zinc-700 hover:text-white">
                Continue
              </button>
            </footer>
          </article>
        ))}
      </div>
    </section>
  );
}
