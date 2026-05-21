"use client";

import React from "react";

export default function ProfileHero() {
  return (
    <section className="relative bg-zinc-950/20 border border-zinc-900 rounded-2xl overflow-hidden mb-6" aria-labelledby="hero-name">
      {/* Top Stripe */}
      <div className="h-1 w-full bg-gradient-to-r from-zinc-600 via-zinc-800 to-transparent" role="presentation" />
      
      <div className="relative flex flex-col md:flex-row md:items-center gap-8 p-6 md:p-10 z-10">
        
        {/* Glow behind avatar */}
        <div className="absolute left-0 top-0 w-64 h-64 bg-white/[0.02] rounded-full blur-[60px] pointer-events-none -translate-x-1/4 -translate-y-1/4" />

        {/* Avatar */}
        <div className="relative flex-shrink-0 self-start md:self-center">
          <div className="relative w-[86px] h-[86px] rounded-full bg-gradient-to-br from-zinc-800 to-zinc-950 border-2 border-zinc-700 flex items-center justify-center text-3xl font-semibold text-white z-10">
            AM
          </div>
          {/* Animated Rings */}
          <div className="absolute inset-[-6px] rounded-full border border-zinc-500/30 animate-[ring_3s_ease-in-out_infinite]" />
          <div className="absolute inset-[-12px] rounded-full border border-zinc-600/10 animate-[ring_3s_ease-in-out_infinite_0.8s]" />
          {/* Online Dot */}
          <div className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-white border-2 border-zinc-950 shadow-[0_0_8px_rgba(255,255,255,0.4)] z-20" aria-label="Online now" />
        </div>

        {/* Identity */}
        <div className="flex-1 min-w-0 z-10">
          <h1 className="text-3xl font-semibold text-white tracking-tight leading-tight mb-1" id="hero-name">Arav Menon</h1>
          <p className="font-mono text-sm text-zinc-400 mb-3">@arav</p>
          <p className="text-sm text-zinc-500 mb-4">Founder · Builder · AI Systems</p>
          
          <div className="inline-flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-full px-3 py-1.5 text-xs text-zinc-300 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            Active in Engineering Arena · ClevenStudios
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1.5 bg-zinc-950 border border-zinc-900 rounded-full px-3 py-1 text-xs text-zinc-400">
              <i className="ti ti-building text-white"></i> 8 organizations
            </span>
            <span className="inline-flex items-center gap-1.5 bg-zinc-950 border border-zinc-900 rounded-full px-3 py-1 text-xs text-zinc-400">
              <i className="ti ti-layout-grid text-white"></i> 24 workspaces
            </span>
            <span className="inline-flex items-center gap-1.5 bg-zinc-950 border border-zinc-900 rounded-full px-3 py-1 text-xs text-zinc-400">
              <i className="ti ti-users text-white"></i> 94 collaborators
            </span>
            <span className="inline-flex items-center gap-1.5 bg-zinc-950 border border-zinc-900 rounded-full px-3 py-1 text-xs text-zinc-400">
              <i className="ti ti-map-pin text-white"></i> Mumbai, India
            </span>
            <span className="inline-flex items-center gap-1.5 bg-zinc-950 border border-zinc-900 rounded-full px-3 py-1 text-xs text-zinc-400">
              <i className="ti ti-clock text-white"></i> IST · 2:41 PM
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-row md:flex-col gap-2 shrink-0 z-10 self-start md:self-stretch justify-end pt-4 md:pt-0">
          <button className="flex items-center gap-2 bg-white text-black hover:bg-zinc-200 px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
            <i className="ti ti-pencil"></i> Edit profile
          </button>
          <button className="flex items-center gap-2 bg-transparent text-zinc-400 hover:text-white border border-zinc-800 hover:border-zinc-700 px-4 py-2 rounded-lg text-sm transition-colors">
            <i className="ti ti-share"></i> Share
          </button>
          <button className="flex items-center gap-2 bg-transparent text-zinc-400 hover:text-white border border-zinc-800 hover:border-zinc-700 px-4 py-2 rounded-lg text-sm transition-colors">
            <i className="ti ti-activity"></i> Activity →
          </button>
        </div>
      </div>

      {/* Ambient Inner Texture */}
      <div className="absolute inset-0 pointer-events-none opacity-20" style={{
        backgroundImage: "radial-gradient(circle, rgba(255,255,255,1) 1px, transparent 1px)",
        backgroundSize: "22px 22px",
        maskImage: "radial-gradient(ellipse 60% 100% at 90% 50%, black 0%, transparent 100%)"
      }} />
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes ring {
          0%, 100% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.14); opacity: 0.3; }
        }
      `}} />
    </section>
  );
}
