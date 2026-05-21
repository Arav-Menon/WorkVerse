"use client";

import React from "react";

const workspaces = [
  {
    title: "Marketing GPT Lab",
    desc: "Campaign generation, copywriting, and audience testing.",
    members: 12,
    active: "4 Active",
    tag: "Growth",
  },
  {
    title: "DevOps AI Lab",
    desc: "Infra automation, debugging, and deployment experimentation.",
    members: 7,
    active: "Running agents",
    tag: "Ops",
  },
  {
    title: "Sales Outreach Lab",
    desc: "Cold emails, lead qualification, and automation.",
    members: 9,
    active: "2 Active",
    tag: "Revenue",
  },
  {
    title: "RAG Research Lab",
    desc: "Knowledge retrieval and memory experiments.",
    members: 3,
    active: "Experiment active",
    tag: "Research",
  },
];

export default function LabWorkspacesGrid() {
  return (
    <section className="my-12">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-zinc-500">Workspaces</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white">AI Workspaces</h2>
        </div>
        <p className="hidden max-w-md text-right text-sm text-zinc-500 md:block">
          Teams ship faster when experiments, owners, and live agent state sit in one surface.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {workspaces.map((ws) => (
          <article
            key={ws.title}
            className="group relative overflow-hidden rounded-[22px] border border-zinc-900 bg-[linear-gradient(180deg,rgba(24,24,27,0.78),rgba(9,9,11,0.9))] p-5 transition-all hover:-translate-y-1 hover:border-zinc-700 hover:shadow-[0_22px_80px_rgba(0,0,0,0.45)] flex flex-col h-full cursor-pointer"
          >
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            <header className="mb-4">
              <div className="mb-4 flex items-center justify-between gap-3">
                <span className="rounded-full border border-zinc-800 bg-zinc-950/80 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-zinc-400">
                  {ws.tag}
                </span>
                <span className="text-[11px] uppercase tracking-[0.22em] text-zinc-600">Updated now</span>
              </div>
              <h3 className="text-lg font-medium text-white">{ws.title}</h3>
              <p className="mt-2 text-sm leading-6 text-zinc-400">{ws.desc}</p>
            </header>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-2xl border border-zinc-900/80 bg-black/25 p-3">
                <div className="text-lg font-semibold text-white">{ws.members}</div>
                <div className="mt-1 text-[10px] uppercase tracking-[0.2em] text-zinc-500">Members</div>
              </div>
              <div className="rounded-2xl border border-zinc-900/80 bg-black/25 p-3">
                <div className="text-lg font-semibold text-white">7.8</div>
                <div className="mt-1 text-[10px] uppercase tracking-[0.2em] text-zinc-500">Quality score</div>
              </div>
            </div>
            <div className="flex-1" />
            <footer className="mt-5 flex items-center justify-between border-t border-zinc-900 pt-4 text-sm text-zinc-500">
              <span className="flex items-center gap-2 text-zinc-400">
                <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.75)]" />
                {ws.active}
              </span>
              <button className="rounded-full border border-zinc-800 px-3 py-1.5 text-xs font-medium text-zinc-300 transition-colors hover:border-zinc-700 hover:text-white">
                Open lab
              </button>
            </footer>
          </article>
        ))}
        <article
          className="flex min-h-[220px] cursor-pointer flex-col justify-between rounded-[22px] border border-dashed border-zinc-800 bg-zinc-950/20 p-5 transition-all hover:border-zinc-700 hover:bg-zinc-900/30"
        >
          <div>
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-950 text-lg text-zinc-300">
              +
            </div>
            <h3 className="mt-5 text-lg font-semibold text-white">Create AI Workspace</h3>
            <p className="mt-2 max-w-xs text-sm leading-6 text-zinc-500">
              Start a new premium experimentation lane for prompts, evals, data, and live agents.
            </p>
          </div>
          <button className="mt-6 w-fit rounded-full bg-white px-4 py-2 text-xs font-semibold text-black transition-colors hover:bg-zinc-200">
            Create lab
          </button>
        </article>
      </div>
    </section>
  );
}
