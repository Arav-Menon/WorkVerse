"use client";

import React from "react";

export default function ModelTestingSection() {
  const models = [
    { name: "GPT-4", status: "Ready", score: "9.4", focus: "Long-form reasoning" },
    { name: "Claude 3", status: "Ready", score: "9.1", focus: "Structured writing" },
    { name: "Gemini Pro", status: "Ready", score: "8.8", focus: "Multimodal recall" },
    { name: "OpenAI Mini", status: "Ready", score: "8.5", focus: "Fast iteration loops" },
  ];

  return (
    <section className="my-12">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-zinc-500">Evaluation</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white">Model Experiments</h2>
        </div>
        <p className="hidden text-sm text-zinc-500 md:block">Benchmark quality, speed, and route fit before shipping.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {models.map((model) => (
          <article
            key={model.name}
            className="rounded-[22px] border border-zinc-900 bg-[linear-gradient(180deg,rgba(24,24,27,0.76),rgba(9,9,11,0.92))] p-5 transition-all hover:border-zinc-700 hover:shadow-[0_20px_60px_rgba(0,0,0,0.35)]"
          >
            <header className="mb-4 flex items-start justify-between gap-3">
              <h3 className="text-lg font-medium text-white">{model.name}</h3>
              <span className="rounded-full border border-emerald-900/70 bg-emerald-950/50 px-2.5 py-1 text-[10px] uppercase tracking-[0.2em] text-emerald-300">
                {model.status}
              </span>
            </header>
            <p className="mb-5 text-sm leading-6 text-zinc-400">{model.focus}</p>
            <div className="mb-5 flex items-center justify-between rounded-2xl border border-zinc-900/80 bg-black/25 p-4">
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">Composite score</p>
                <p className="mt-2 text-2xl font-semibold text-white">{model.score}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">Mode</p>
                <p className="mt-2 text-sm font-medium text-zinc-300">Realtime ready</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="rounded-full bg-white px-4 py-2 text-xs font-semibold text-black transition-colors hover:bg-zinc-200">
                Test prompt
              </button>
              <button className="rounded-full border border-zinc-800 px-4 py-2 text-xs font-medium text-zinc-300 transition-colors hover:border-zinc-700 hover:text-white">
                Compare
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
