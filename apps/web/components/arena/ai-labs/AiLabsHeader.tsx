'use client';

import React from 'react';

interface AiLabsHeaderProps {
  teamName: string;
  activeMembers: number;
  runningAutomations: number;
  onClose: () => void;
}

export function AiLabsHeader({ teamName, activeMembers, runningAutomations, onClose }: AiLabsHeaderProps) {
  return (
    <div
      className="px-5 py-4 shrink-0"
      style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-base shadow-lg bg-zinc-900 border border-white/10"
            style={{ boxShadow: '0 0 20px rgba(0,0,0,0.4)' }}
          >
            <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <div>
            <h2 className="text-sm font-bold text-white tracking-tight">AI Labs</h2>
            <p className="text-[11px] text-zinc-400">Workspace Intelligence</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all duration-150"
          title="Close AI Labs"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="flex items-center gap-2 text-[11px]">
        <span className="text-zinc-300 font-medium">{teamName}</span>
        <span className="text-zinc-600">·</span>
        <span className="text-zinc-400">{activeMembers} active</span>
        <span className="text-zinc-600">·</span>
        <span className="text-emerald-400">{runningAutomations} automations</span>
      </div>
    </div>
  );
}
