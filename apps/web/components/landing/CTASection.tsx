"use client";

import React from "react";

export default function CTASection() {
  return (
    <section className="py-24 px-6 relative overflow-hidden">
      {/* Infrastructure-inspired background accents */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-px h-full bg-gradient-to-b from-transparent via-white/10 to-transparent"></div>
      </div>

      <div className="max-w-4xl mx-auto bg-black/40 backdrop-blur-2xl border border-white/10 rounded-3xl p-12 md:p-20 relative z-10 overflow-hidden shadow-2xl group">
        {/* AI Execution Glow */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/5 blur-[80px] rounded-full animate-pulse"></div>
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-white/5 blur-[80px] rounded-full animate-pulse delay-1000"></div>

        {/* Realtime presence indicator mockup */}
        <div className="hidden sm:flex absolute top-4 right-4 md:top-8 md:right-8 items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
          <div className="flex -space-x-2">
            <div className="w-5 h-5 rounded-full bg-zinc-700 border border-black flex items-center justify-center text-[8px]">JD</div>
            <div className="w-5 h-5 rounded-full bg-zinc-600 border border-black flex items-center justify-center text-[8px]">AK</div>
            <div className="w-5 h-5 rounded-full bg-zinc-800 border border-black flex items-center justify-center text-[8px] relative">
              <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-emerald-500 rounded-full border border-black"></div>
              ME
            </div>
          </div>
          <div className="text-[10px] text-zinc-400 font-medium tracking-tight">3 Active</div>
        </div>

        <div className="text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-6 bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">
            Build inside the future of work.
          </h2>
          <p className="text-lg text-zinc-400 leading-relaxed max-w-2xl mx-auto mb-10">
            Collaborate, automate, and execute workflows inside one intelligent multiplayer workspace.
          </p>
          
          <div className="flex flex-wrap gap-4 justify-center">
            <button className="relative group/btn bg-white text-black px-8 py-3.5 rounded-xl text-sm font-semibold hover:bg-zinc-200 transition-all cursor-pointer overflow-hidden shadow-[0_0_40px_rgba(255,255,255,0.1)]">
              Launch Workspace
            </button>
            <button className="bg-white/5 backdrop-blur-md text-white border border-white/10 px-8 py-3.5 rounded-xl text-sm font-semibold hover:bg-white/10 transition-all cursor-pointer">
              Explore Platform
            </button>
          </div>

          {/* Active workspace visual accent */}
          <div className="mt-12 flex items-center justify-center gap-8 opacity-40">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-[10px] uppercase tracking-[2px] font-medium">Realtime Hub</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-zinc-500"></div>
              <span className="text-[10px] uppercase tracking-[2px] font-medium">Distributed Nodes</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
