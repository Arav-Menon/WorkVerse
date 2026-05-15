"use client";

import React from "react";
const GridIcon = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
);
const ArrowsIcon = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 3 21 3 21 8"></polyline><line x1="4" y1="14" x2="21" y2="3"></line><polyline points="8 21 3 21 3 16"></polyline><line x1="20" y1="10" x2="3" y2="21"></line></svg>
);
const RepeatIcon = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="17 1 21 5 17 9"></polyline><path d="M3 11V9a4 4 0 014-4h14"></path><polyline points="7 23 3 19 7 15"></polyline><path d="M21 13v2a4 4 0 01-4 4H3"></path></svg>
);
const PauseIcon = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>
);

export default function ProblemSection() {
  return (
    <section id="features" className="py-20 px-6 max-w-5xl mx-auto">
      <div className="text-[11px] font-medium tracking-[1.5px] uppercase text-zinc-50 mb-3">
        The problem
      </div>
      <h2 className="text-3xl md:text-4xl font-medium tracking-tight text-zinc-50 mb-3 leading-tight">
        Founders are drowning in tools
      </h2>
      <p className="text-base text-zinc-400 leading-relaxed max-w-2xl mb-12">
        Every tool added to the stack adds cognitive load. You end up managing software instead of building your product.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="bg-white/[0.03] backdrop-blur-md rounded-2xl p-8 border border-white/10 hover:border-white/20 transition-all group relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
          <div className="text-zinc-50 mb-4 group-hover:scale-110 transition-transform origin-left">
            <GridIcon size={24} />
          </div>
          <h4 className="text-sm font-medium text-zinc-50 mb-2">Tool fragmentation</h4>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Slack, Notion, Zapier, Linear, Zoom — 10+ tabs, zero flow
          </p>
        </div>

        {/* Card 2 */}
        <div className="bg-white/[0.03] backdrop-blur-md rounded-2xl p-8 border border-white/10 hover:border-white/20 transition-all group relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
          <div className="text-zinc-50 mb-4 group-hover:scale-110 transition-transform origin-left">
            <ArrowsIcon size={24} />
          </div>
          <h4 className="text-sm font-medium text-zinc-50 mb-2">Context switching</h4>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Every switch costs 23 minutes of focus. You lose momentum constantly
          </p>
        </div>

        {/* Card 3 */}
        <div className="bg-white/[0.03] backdrop-blur-md rounded-2xl p-8 border border-white/10 hover:border-white/20 transition-all group relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
          <div className="text-zinc-50 mb-4 group-hover:scale-110 transition-transform origin-left">
            <RepeatIcon size={24} />
          </div>
          <h4 className="text-sm font-medium text-zinc-50 mb-2">Repetitive ops</h4>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Emails, follow-ups, deployments — manual busywork every single day
          </p>
        </div>

        {/* Card 4 */}
        <div className="bg-white/[0.03] backdrop-blur-md rounded-2xl p-8 border border-white/10 hover:border-white/20 transition-all group relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
          <div className="text-zinc-50 mb-4 group-hover:scale-110 transition-transform origin-left">
            <PauseIcon size={24} />
          </div>
          <h4 className="text-sm font-medium text-zinc-50 mb-2">Slow execution</h4>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Great ideas sit waiting while you debug automations and chase people
          </p>
        </div>
      </div>
    </section>
  );
}
