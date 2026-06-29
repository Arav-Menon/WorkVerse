"use client";

import React from "react";

interface OrgHeroSectionProps {
  orgName: string;
  onLaunchClick: () => void;
  onInviteMember?: () => void;
  workspaceCount?: number;
}

export default function OrgHeroSection({
  orgName,
  onLaunchClick,
  onInviteMember,
  workspaceCount,
}: OrgHeroSectionProps) {
  const stats = [
    { value: String(workspaceCount || 0), label: "Workspaces", style: "text-zinc-200" },
    { value: "43", label: "Active Members", style: "text-emerald-400" },
    { value: "5", label: "AI Agents", style: "text-purple-400" },
    { value: "28%", label: "CPU Telemetry", style: "text-amber-400" },
  ];

  return (
    <section 
      className="relative p-6 md:p-8 border-b border-zinc-900 overflow-hidden select-none bg-zinc-950/20 rounded-2xl mb-8"
      aria-labelledby="hero-title"
    >
      {/* Background ambient radial aura matching landing style */}
      <div 
        className="absolute -top-16 -left-16 w-80 h-80 bg-radial-gradient from-white/[0.02] to-transparent pointer-events-none" 
        style={{
          background: "radial-gradient(circle, rgba(255,255,255,0.03) 0%, transparent 70%)"
        }}
      />

      <div className="relative z-10 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        {/* Profile identity info */}
        <div className="space-y-3.5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center font-bold text-zinc-300">
              {orgName.substring(0, 2).toUpperCase()}
            </div>
            <span className="text-[11px] text-zinc-500 font-mono tracking-widest uppercase">Office Cockpit</span>
            <span className="text-[9px] bg-amber-950 border border-amber-900/60 rounded px-1.5 py-0.5 text-amber-400 select-none">
              PRO
            </span>
          </div>

          <div className="space-y-1.5">
            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-white" id="hero-title">
              {orgName} Workspace
            </h1>
            <p className="text-xs text-zinc-500 max-w-[480px] leading-relaxed">
              Collaborative center for {orgName}. Run pipelines, manage teammate rooms, trigger automated pipelines, and manage your AI resources in one space.
            </p>
          </div>

          {/* Action trigger cockpit buttons */}
          <div className="flex items-center gap-2 pt-2">
            <button 
              className="flex items-center gap-2 p-2 px-4 rounded-xl bg-white hover:bg-zinc-200 text-black text-xs font-semibold cursor-pointer shadow-[0_10px_25px_rgba(255,255,255,0.1)] active:scale-[0.98] transition-all"
              onClick={onLaunchClick}
            >
              <i className="ti ti-phone-call"></i>
              Launch Virtual Office
            </button>
            <button className="flex items-center gap-2 p-2 px-3 rounded-xl bg-zinc-950 hover:bg-zinc-900 border border-zinc-900 hover:border-zinc-800 text-zinc-400 hover:text-white text-xs font-semibold transition-all cursor-pointer">
              <i className="ti ti-settings"></i>
              Configure Integration
            </button>
            {onInviteMember && (
              <button
                className="flex items-center gap-2 p-2 px-3 rounded-xl bg-zinc-950 hover:bg-zinc-900 border border-zinc-900 hover:border-zinc-800 text-zinc-400 hover:text-white text-xs font-semibold transition-all cursor-pointer"
                onClick={onInviteMember}
              >
                <i className="ti ti-user-plus"></i>
                Invite Member
              </button>
            )}
          </div>
        </div>

        {/* Stats Metrics strip */}
        <div className="grid grid-cols-2 min-[420px]:grid-cols-4 md:flex items-stretch gap-px bg-zinc-900 border border-zinc-900 rounded-xl overflow-hidden shadow-2xl shrink-0 self-start md:self-center">
          {stats.map((st, i) => (
            <div key={i} className="flex flex-col items-center justify-center p-3 px-4 min-w-[90px] md:min-w-[100px] bg-zinc-950/90 text-center">
              <span className={`text-base md:text-lg font-semibold tracking-tight ${st.style}`}>{st.value}</span>
              <span className="text-[9px] uppercase tracking-wider text-zinc-500 mt-1 select-none whitespace-nowrap">{st.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
