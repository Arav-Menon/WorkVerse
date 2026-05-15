"use client";

import React from "react";
const CheckIcon = ({ size, className }: { size: number; className?: string }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
);
const XIcon = ({ size, className }: { size: number; className?: string }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
);
const SparklesIcon = ({ size, className }: { size: number; className?: string }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l1.912 5.813a2 2 0 001.272 1.272L21 12l-5.816 1.916a2 2 0 00-1.268 1.268L12 21l-1.916-5.816a2 2 0 00-1.268-1.268L3 12l5.816-1.916a2 2 0 001.268-1.268L12 3z"></path></svg>
);

export default function Comparison() {
  return (
    <section className="py-20 px-6 max-w-5xl mx-auto">
      <div className="text-[11px] font-medium tracking-[1.5px] uppercase text-zinc-50 mb-3">
        Comparison
      </div>
      <h2 className="text-3xl md:text-4xl font-medium tracking-tight text-zinc-50 mb-3 leading-tight">
        Not just another AI tool
      </h2>
      <p className="text-base text-zinc-400 leading-relaxed max-w-2xl mb-12">
        Every other tool stops at planning or answering. WorkVerse closes the loop.
      </p>

      <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
        
        {/* Header */}
        <div className="grid grid-cols-3 bg-zinc-900/80 border-b border-zinc-800/80 text-[11px] font-medium uppercase tracking-[1px] text-zinc-500 p-4">
          <div>Tool</div>
          <div>What it does</div>
          <div>What it misses</div>
        </div>

        {/* Row 1 */}
        <div className="grid grid-cols-3 p-4 border-b border-zinc-800/80 items-center text-sm">
          <div className="font-medium text-zinc-50">ChatGPT</div>
          <div className="flex items-center gap-2 text-zinc-400">
            <CheckIcon size={16} className="text-emerald-500" /> Answers questions
          </div>
          <div className="flex items-center gap-2 text-zinc-500">
            <XIcon size={16} className="text-red-500/70" /> No execution
          </div>
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-3 p-4 border-b border-zinc-800/80 items-center text-sm">
          <div className="font-medium text-zinc-50">Zapier</div>
          <div className="flex items-center gap-2 text-zinc-400">
            <CheckIcon size={16} className="text-emerald-500" /> Runs predefined flows
          </div>
          <div className="flex items-center gap-2 text-zinc-500">
            <XIcon size={16} className="text-red-500/70" /> Manual setup required
          </div>
        </div>

        {/* Row 3 */}
        <div className="grid grid-cols-3 p-4 border-b border-zinc-800/80 items-center text-sm">
          <div className="font-medium text-zinc-50">Notion</div>
          <div className="flex items-center gap-2 text-zinc-400">
            <CheckIcon size={16} className="text-emerald-500" /> Organizes info
          </div>
          <div className="flex items-center gap-2 text-zinc-500">
            <XIcon size={16} className="text-red-500/70" /> Can't execute anything
          </div>
        </div>

        {/* Row 4 */}
        <div className="grid grid-cols-3 p-4 border-b border-zinc-800/80 items-center text-sm">
          <div className="font-medium text-zinc-50">Devin</div>
          <div className="flex items-center gap-2 text-zinc-400">
            <CheckIcon size={16} className="text-emerald-500" /> Writes & deploys code
          </div>
          <div className="flex items-center gap-2 text-zinc-500">
            <XIcon size={16} className="text-red-500/70" /> Code only, no ops/biz logic
          </div>
        </div>

        {/* Row 5 - WorkVerse */}
        <div className="grid grid-cols-3 p-4 bg-zinc-900/20 items-center text-sm relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          
          <div className="font-medium text-zinc-200 flex items-center gap-2 relative z-10">
            WorkVerse <SparklesIcon size={14} className="animate-pulse" />
          </div>
          <div className="flex items-center gap-2 text-zinc-300 relative z-10">
            <CheckIcon size={16} className="text-emerald-400" /> Understands intent
          </div>
          <div className="font-medium text-zinc-200 relative z-10">
            Creates + executes + remembers
          </div>
        </div>

      </div>
    </section>
  );
}
