"use client";

import React from "react";

export default function HowItWorks() {
  return (
    <section className="py-20 px-6 max-w-5xl mx-auto">
      <div className="text-[11px] font-medium tracking-[1.5px] uppercase text-zinc-50 mb-3">
        How it works
      </div>
      <h2 className="text-3xl md:text-4xl font-medium tracking-tight text-zinc-50 mb-3 leading-tight">
        From prompt to done — automatically
      </h2>
      <p className="text-base text-zinc-400 leading-relaxed max-w-2xl mb-12">
        WorkVerse chains intent understanding, tool selection, and workflow execution in a single pipeline.
      </p>

      {/* The arrow flow diagram */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center rounded-xl border border-zinc-800/80 overflow-hidden bg-zinc-900/30 backdrop-blur-sm">
        
        <div className="flex-1 p-6 relative text-center border-b md:border-b-0 md:border-r border-zinc-800/80 group hover:bg-zinc-900/80 transition-colors">
          <div className="text-[10px] font-medium text-zinc-50 tracking-[1px] uppercase mb-1">01</div>
          <div className="text-sm font-medium text-zinc-50">You prompt</div>
          <div className="text-xs text-zinc-400 mt-1">Plain English</div>
          
          {/* Arrow pointing right (hidden on mobile, visible on md+) */}
          <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-4 h-4 bg-zinc-950 border-t border-r border-zinc-800/80 rotate-45 z-10 group-hover:bg-zinc-900/80 transition-colors"></div>
        </div>

        <div className="flex-1 p-6 relative text-center border-b md:border-b-0 md:border-r border-zinc-800/80 group hover:bg-zinc-900/80 transition-colors">
          <div className="text-[10px] font-medium text-zinc-50 tracking-[1px] uppercase mb-1">02</div>
          <div className="text-sm font-medium text-zinc-50">LLM parses</div>
          <div className="text-xs text-zinc-400 mt-1">Intent + steps</div>
          
          <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-4 h-4 bg-zinc-950 border-t border-r border-zinc-800/80 rotate-45 z-10 group-hover:bg-zinc-900/80 transition-colors"></div>
        </div>

        <div className="flex-1 p-6 relative text-center border-b md:border-b-0 md:border-r border-zinc-800/80 group hover:bg-zinc-900/80 transition-colors">
          <div className="text-[10px] font-medium text-zinc-50 tracking-[1px] uppercase mb-1">03</div>
          <div className="text-sm font-medium text-zinc-50">MCP selects</div>
          <div className="text-xs text-zinc-400 mt-1">Right tools</div>
          
          <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-4 h-4 bg-zinc-950 border-t border-r border-zinc-800/80 rotate-45 z-10 group-hover:bg-zinc-900/80 transition-colors"></div>
        </div>

        <div className="flex-1 p-6 relative text-center border-b md:border-b-0 md:border-r border-zinc-800/80 group hover:bg-zinc-900/80 transition-colors">
          <div className="text-[10px] font-medium text-zinc-50 tracking-[1px] uppercase mb-1">04</div>
          <div className="text-sm font-medium text-zinc-50">n8n executes</div>
          <div className="text-xs text-zinc-400 mt-1">Workflows run</div>
          
          <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-4 h-4 bg-zinc-950 border-t border-r border-zinc-800/80 rotate-45 z-10 group-hover:bg-zinc-900/80 transition-colors"></div>
        </div>

        <div className="flex-1 p-6 relative text-center group hover:bg-zinc-900/80 transition-colors">
          <div className="text-[10px] font-medium text-zinc-50 tracking-[1px] uppercase mb-1">05</div>
          <div className="text-sm font-medium text-zinc-50">Done</div>
          <div className="text-xs text-zinc-400 mt-1">Result returned</div>
        </div>

      </div>
    </section>
  );
}
