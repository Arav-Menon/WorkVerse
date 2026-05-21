"use client";

import React from "react";

const items = [
  { title: "Standard Code Review Prompt", type: "Prompt", members: 12 },
  { title: "Engineering Onboarding RAG", type: "Knowledge Base", members: 45 },
  { title: "Q3 Marketing Strategy Docs", type: "Dataset", members: 8 },
  { title: "Automated PR Summarizer", type: "Workflow Template", members: 21 },
];

export default function SharedIntelligenceSection() {
  return (
    <section className="my-12">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-zinc-500">Library</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white">Shared Intelligence</h2>
        </div>
        <p className="hidden max-w-md text-right text-sm text-zinc-500 lg:block">
          Reusable prompts, datasets, and workflow assets that carry the team’s best judgment forward.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {items.map((item) => (
          <article
            key={item.title}
            className="flex cursor-pointer flex-col rounded-[22px] border border-zinc-900 bg-[linear-gradient(180deg,rgba(24,24,27,0.76),rgba(9,9,11,0.92))] p-4 transition-all hover:border-zinc-700 hover:shadow-[0_18px_50px_rgba(0,0,0,0.3)]"
          >
            <div className="mb-4 flex items-center justify-between gap-3">
              <span className="rounded-full border border-zinc-800 bg-zinc-950/80 px-2.5 py-1 text-[10px] uppercase tracking-[0.2em] text-zinc-400">
                {item.type}
              </span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-600">Shared asset</span>
            </div>
            <h3 className="mb-1 text-sm font-medium leading-snug text-white">{item.title}</h3>
            <p className="mb-5 text-xs leading-6 text-zinc-500">Curated for repeatable execution across labs and teams.</p>
            <div className="mt-auto flex items-center justify-between text-xs text-zinc-400">
              <span className="flex items-center gap-1.5">
                <i className="ti ti-users"></i> {item.members}
              </span>
              <button className="rounded-full border border-zinc-800 px-3 py-1.5 text-[11px] font-medium text-zinc-300 transition-colors hover:border-zinc-700 hover:text-white">
                Use
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
