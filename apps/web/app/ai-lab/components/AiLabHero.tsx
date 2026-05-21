"use client";

import React from "react";

export default function AiLabHero() {
  const metrics = [
    { value: "12", label: "Active experiments" },
    { value: "5", label: "Agents running" },
    { value: "84", label: "Shared prompts" },
    { value: "18", label: "Researchers online" },
  ];

  const rail = [
    { label: "Latency floor", value: "148ms", tone: "text-emerald-300" },
    { label: "Eval confidence", value: "96.4%", tone: "text-white" },
    { label: "Spend efficiency", value: "-18%", tone: "text-amber-300" },
  ];

  return (
    <section className="relative mb-12 overflow-hidden rounded-[28px] border border-zinc-900/90 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.06),transparent_32%),linear-gradient(180deg,rgba(24,24,27,0.88),rgba(9,9,11,0.96))] p-6 sm:p-8 md:p-10 shadow-[0_30px_120px_rgba(0,0,0,0.55)]">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:72px_72px] opacity-30" />
      <div className="absolute -top-20 right-[-10%] h-64 w-64 rounded-full bg-white/[0.05] blur-3xl" />
      <div className="absolute bottom-[-30%] left-[10%] h-56 w-56 rounded-full bg-emerald-500/[0.08] blur-3xl" />

      <div className="relative z-10 grid gap-8 xl:grid-cols-[minmax(0,1.35fr)_360px] xl:items-end">
        <div>
          <div className="mb-5 flex flex-wrap items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-zinc-500">
            <span className="rounded-full border border-zinc-800 bg-zinc-950/70 px-3 py-1 text-zinc-300">
              AI Lab
            </span>
            <span className="flex items-center gap-2 rounded-full border border-emerald-900/70 bg-emerald-950/60 px-3 py-1 text-emerald-300">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Research fabric live
            </span>
          </div>

          <h1 className="max-w-3xl text-4xl font-semibold tracking-[-0.04em] text-white sm:text-5xl md:text-6xl">
            Premium space for prompt systems, agent runs, and model evaluation.
          </h1>

          <p className="mt-5 max-w-2xl text-sm leading-7 text-zinc-400 sm:text-base">
            Collaboratively shape production-grade AI workflows with sharper visibility across prompts,
            benchmarks, orchestration, and team knowledge.
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <button className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black transition-all hover:bg-zinc-200">
              Launch new experiment
            </button>
            <button className="rounded-full border border-zinc-800 bg-zinc-950/70 px-5 py-2.5 text-sm font-medium text-zinc-200 transition-all hover:border-zinc-700 hover:bg-zinc-900">
              Review benchmark queue
            </button>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {metrics.map((metric) => (
              <div
                key={metric.label}
                className="rounded-2xl border border-zinc-900/80 bg-black/30 px-4 py-4 backdrop-blur-sm"
              >
                <div className="text-2xl font-semibold tracking-tight text-white">{metric.value}</div>
                <div className="mt-1 text-[11px] uppercase tracking-[0.22em] text-zinc-500">
                  {metric.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        <aside className="rounded-[24px] border border-zinc-800/90 bg-black/45 p-5 backdrop-blur-xl">
          <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-zinc-500">
                Control lane
              </p>
              <h2 className="mt-2 text-lg font-semibold text-white">Signal overview</h2>
            </div>
            <span className="rounded-full border border-zinc-800 bg-zinc-950/80 px-2.5 py-1 text-[10px] uppercase tracking-[0.2em] text-zinc-400">
              Today
            </span>
          </div>

          <div className="space-y-4 py-5">
            {rail.map((item) => (
              <div key={item.label} className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-sm text-zinc-300">{item.label}</p>
                  <p className="mt-1 text-xs text-zinc-500">Calibrated against the latest lab runs</p>
                </div>
                <span className={`text-lg font-semibold tracking-tight ${item.tone}`}>{item.value}</span>
              </div>
            ))}
          </div>

          <div className="rounded-2xl border border-zinc-800/80 bg-white/[0.03] p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white">Frontier Prompt Suite</p>
                <p className="mt-1 text-xs text-zinc-500">12 concurrent evals across GPT-4, Claude, and Gemini</p>
              </div>
              <span className="rounded-full bg-white px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-black">
                Featured
              </span>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
