"use client";

import React from "react";

export default function Hero() {
  const SparklesIcon = ({ size, className }: { size: number; className?: string }) => (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l1.912 5.813a2 2 0 001.272 1.272L21 12l-5.816 1.916a2 2 0 00-1.268 1.268L12 21l-1.916-5.816a2 2 0 00-1.268-1.268L3 12l5.816-1.916a2 2 0 001.268-1.268L12 3z"></path></svg>
  );

  return (
    <div className="relative pt-32 pb-20 px-6 min-h-screen flex flex-col items-center">
      
      {/* Background Cinematic Visuals (Simulated Layers) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-7xl h-full pointer-events-none z-0">
        <div className="absolute top-1/4 left-0 w-64 h-64 bg-indigo-500/5 blur-[120px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-blue-500/5 blur-[140px] rounded-full animate-pulse delay-1000"></div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl w-full text-center relative z-10 space-y-8">
        <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-md text-zinc-400 text-[10px] uppercase tracking-[3px] px-4 py-2 rounded-full font-bold border border-white/10 shadow-[inset_0_0_12px_rgba(255,255,255,0.05)] mb-4">
          <SparklesIcon size={14} className="text-white/60" /> AI execution system — not a chatbot
        </div>

        <h1 className="text-4xl md:text-6xl font-bold leading-[1.1] tracking-tighter text-white bg-gradient-to-b from-white via-white to-white/20 bg-clip-text text-transparent">
          Your office that <br />
          <em className="not-italic text-white">actually</em> does the work
        </h1>

        <p className="text-base md:text-lg text-zinc-400 leading-relaxed max-w-2xl mx-auto font-medium">
          WorkVerse is an AI-powered virtual office where you give a prompt — and everything gets executed end-to-end. No tools to manage. No workflows to build.
        </p>

        <div className="flex flex-wrap gap-4 justify-center pt-4">
          <button className="relative group bg-white text-black px-6 py-2.5 rounded-lg text-xs uppercase tracking-widest font-bold hover:bg-zinc-200 transition-all cursor-pointer shadow-[0_10px_20px_rgba(255,255,255,0.05)] overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
            Start for free ↗
          </button>
          <button className="bg-white/5 backdrop-blur-xl border border-white/10 text-white px-6 py-2.5 rounded-lg text-xs uppercase tracking-widest font-bold hover:bg-white/10 transition-all cursor-pointer">
            Watch demo
          </button>
        </div>
      </div>

      {/* Cinematic Workspace Visual (Mockup Interface) */}
      <div className="mt-24 w-full max-w-6xl relative z-10 group">
        <div className="absolute -inset-1 bg-gradient-to-b from-white/10 to-transparent blur-2xl rounded-[32px] opacity-20 group-hover:opacity-40 transition-opacity"></div>
        <div className="relative bg-zinc-950/40 backdrop-blur-2xl border border-white/10 rounded-[32px] overflow-hidden aspect-[16/9] shadow-2xl flex flex-col">
          
          {/* Top Bar Mockup */}
          <div className="h-12 border-b border-white/5 flex items-center justify-between px-6 bg-black/40">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-white/10"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-white/10"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-white/10"></div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex -space-x-2">
                <div className="w-6 h-6 rounded-full bg-zinc-800 border-2 border-black"></div>
                <div className="w-6 h-6 rounded-full bg-zinc-700 border-2 border-black"></div>
                <div className="w-6 h-6 rounded-full bg-zinc-600 border-2 border-black flex items-center justify-center text-[8px] font-bold">ME</div>
              </div>
              <div className="h-4 w-px bg-white/10"></div>
              <div className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Workspace Active</div>
            </div>
          </div>

          {/* Interface Content Mockup */}
          <div className="flex-1 grid grid-cols-12 gap-px bg-white/5">
            <div className="col-span-3 bg-black/40 p-6 space-y-6">
              <div className="space-y-2">
                <div className="h-2 w-1/2 bg-white/20 rounded-full"></div>
                <div className="h-2 w-3/4 bg-white/10 rounded-full"></div>
              </div>
              <div className="space-y-4 pt-4">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white/5"></div>
                    <div className="flex-1 space-y-1.5">
                      <div className="h-1.5 w-full bg-white/10 rounded-full"></div>
                      <div className="h-1 w-1/2 bg-white/5 rounded-full"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="col-span-6 bg-black/20 flex items-center justify-center relative group/inner">
              {/* Central Command UI Mockup */}
              <div className="p-8 rounded-2xl bg-black/60 border border-white/10 backdrop-blur-3xl max-w-sm w-full space-y-4 shadow-2xl relative animate-shimmer-fast">
                <div className="flex items-center justify-between">
                  <div className="text-[10px] uppercase tracking-widest text-white font-bold flex items-center gap-2">
                    <div className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse"></div>
                    AI Orchestration
                  </div>
                  <div className="text-[10px] text-zinc-500 font-mono">0.03ms</div>
                </div>
                <div className="space-y-2">
                  <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-white/40 w-2/3"></div>
                  </div>
                  <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-white/20 w-1/3"></div>
                  </div>
                </div>
                <div className="text-[11px] text-zinc-300 font-mono leading-relaxed">
                  <span className="text-zinc-500">{">"}</span> Deploying agents to distributed infrastructure...
                </div>
              </div>

              {/* Cursor indicators */}
              <div className="absolute top-1/4 right-1/4 flex flex-col gap-1 items-start">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="white" className="drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]"><path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z"></path></svg>
                <div className="px-2 py-0.5 bg-white text-black text-[8px] font-bold rounded-sm">Alex K.</div>
              </div>
            </div>
            <div className="col-span-3 bg-black/40 p-6">
              <div className="space-y-6">
                <div className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Execution Feed</div>
                <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="flex gap-3">
                      <div className="w-1 h-8 bg-emerald-500/20 rounded-full"></div>
                      <div className="space-y-1">
                        <div className="h-1.5 w-24 bg-white/20 rounded-full"></div>
                        <div className="h-1 w-16 bg-white/5 rounded-full"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Highlighting Section below Hero */}
      <div className="max-w-7xl mx-auto w-full mt-32 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 px-6">
        {[
          { title: "Virtual Workspace", desc: "Multiplayer rooms." },
          { title: "AI Agents", desc: "Autonomous execution." },
          { title: "A/V Collaboration", desc: "Immersive teamwork." },
          { title: "Automation", desc: "Intelligent orchestration." },
          { title: "AI Labs", desc: "Prompt experimentation." },
          { title: "Dev Platform", desc: "MCP & Infrastructure." }
        ].map((f, i) => (
          <div key={i} className="space-y-2 group">
            <div className="text-[11px] font-bold text-white uppercase tracking-widest group-hover:text-white transition-colors">{f.title}</div>
            <div className="text-[10px] text-zinc-500 leading-tight group-hover:text-zinc-400 transition-colors">{f.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
