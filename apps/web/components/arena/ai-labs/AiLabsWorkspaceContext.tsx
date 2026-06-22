'use client';

import React from 'react';

interface WorkspaceContextProps {
  currentRoom: string;
  membersOnline: number;
}

export function AiLabsWorkspaceContext({ currentRoom, membersOnline }: WorkspaceContextProps) {
  return (
    <section>
      <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 mb-3">Current Context</h3>
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-zinc-950/50 border border-zinc-900/60 rounded-xl p-3">
          <p className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider mb-1">Room</p>
          <p className="text-[13px] font-bold text-zinc-300">{currentRoom}</p>
        </div>
        <div className="bg-zinc-950/50 border border-zinc-900/60 rounded-xl p-3">
          <p className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider mb-1">Online</p>
          <p className="text-[13px] font-bold text-zinc-300">{membersOnline}</p>
        </div>
      </div>
    </section>
  );
}
