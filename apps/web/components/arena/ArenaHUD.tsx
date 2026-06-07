'use client';

import React from 'react';

interface ArenaHUDProps {
  spaceId: string;
}

const ONLINE_USERS = [
  { name: 'Ansh',  color: '#52525b' }, // zinc-600
  { name: 'Raj',   color: '#3f3f46' }, // zinc-700
  { name: 'Sarah', color: '#27272a' }, // zinc-800
  { name: 'Alex',  color: '#52525b' },
  { name: 'Priya', color: '#3f3f46' },
];

export function ArenaHUD({ spaceId }: ArenaHUDProps) {
  return (
    <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 10 }}>
      {/* ── Top-Left: Space Info ── */}
      <div className="absolute top-4 left-4 pointer-events-auto">
        <div className="flex items-center gap-3 bg-gray-950/80 backdrop-blur-md border border-white/10 rounded-xl px-4 py-2.5 shadow-2xl">
          {/* Logo mark */}
          <div className="w-7 h-7 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-xs font-bold text-white shadow-lg shadow-black/40">
            W
          </div>
          <div>
            <p className="text-[10px] font-medium text-gray-500 uppercase tracking-widest leading-none">WorkVerse</p>
            <p className="text-sm font-semibold text-white leading-tight mt-0.5">{spaceId}</p>
          </div>
          {/* Live dot */}
          <div className="flex items-center gap-1.5 ml-2 border-l border-white/10 pl-3">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-sm shadow-emerald-400/60" />
            <span className="text-[11px] text-emerald-400 font-medium">Live</span>
          </div>
        </div>
      </div>

      {/* ── Top-Right: Online users ── */}
      <div className="absolute top-4 right-4 pointer-events-auto">
        <div className="flex items-center gap-2 bg-gray-950/80 backdrop-blur-md border border-white/10 rounded-xl px-4 py-2.5 shadow-2xl">
          <span className="text-[11px] text-gray-500 font-medium mr-1">{ONLINE_USERS.length + 1} online</span>
          <div className="flex -space-x-2">
            {/* Local user first */}
            <div
              className="w-7 h-7 rounded-full border border-black flex items-center justify-center text-[10px] font-bold text-white shadow bg-zinc-800"
              style={{ zIndex: 10 }}
              title="Arav (You)"
            >
              A
            </div>
            {ONLINE_USERS.map((u, i) => (
              <div
                key={u.name}
                className="w-7 h-7 rounded-full border border-black flex items-center justify-center text-[10px] font-bold text-white shadow"
                style={{ background: u.color, zIndex: 9 - i }}
                title={u.name}
              >
                {u.name[0]}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Bottom-Left: WASD hint ── */}
      <div className="absolute bottom-24 left-4">
        <div className="flex flex-col items-center gap-1 opacity-40 select-none">
          <kbd className="bg-gray-800 border border-gray-600 rounded px-2 py-0.5 text-[10px] text-gray-300 w-6 text-center">W</kbd>
          <div className="flex gap-1">
            <kbd className="bg-gray-800 border border-gray-600 rounded px-2 py-0.5 text-[10px] text-gray-300 w-6 text-center">A</kbd>
            <kbd className="bg-gray-800 border border-gray-600 rounded px-2 py-0.5 text-[10px] text-gray-300 w-6 text-center">S</kbd>
            <kbd className="bg-gray-800 border border-gray-600 rounded px-2 py-0.5 text-[10px] text-gray-300 w-6 text-center">D</kbd>
          </div>
          <span className="text-[9px] text-gray-500 mt-0.5">Move</span>
        </div>
      </div>
    </div>
  );
}
