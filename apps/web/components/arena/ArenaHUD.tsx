'use client';

import React from 'react';

interface OnlineUser {
  userId: string;
  username: string;
  color: string;
}

interface ArenaHUDProps {
  spaceId: string;
  orgName?: string;
  workspaceName?: string;
  spaceName?: string;
  orgId?: string;
  workspaceId?: string;
  onlineCount?: number;
  onlineUsers?: OnlineUser[];
}

export function ArenaHUD({
  spaceId,
  orgName,
  workspaceName,
  spaceName,
  orgId,
  workspaceId,
  onlineCount = 0,
  onlineUsers = [],
}: ArenaHUDProps) {
  return (
    <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 10 }}>
      {/* Top-Left: Space Info */}
      <div className="absolute top-4 left-4 pointer-events-auto">
        <div className="flex items-center gap-3 bg-gray-950/80 backdrop-blur-md border border-white/10 rounded-xl px-4 py-2.5 shadow-2xl">
          <div>
            <p className="text-[10px] font-medium text-gray-500 uppercase tracking-widest leading-none">WorkVerse</p>
            <p className="text-sm font-semibold text-white leading-tight mt-0.5">
              {orgName && <span>{orgName}</span>}
              {workspaceName && <span className="text-gray-400"> / {workspaceName}</span>}
            </p>
          </div>
        </div>
      </div>

      {/* Top-Right: Online users */}
      <div className="absolute top-4 right-4 pointer-events-auto">
        <div className="flex items-center gap-2 bg-gray-950/80 backdrop-blur-md border border-white/10 rounded-xl px-4 py-2.5 shadow-2xl">
          <span className="text-[11px] text-gray-500 font-medium mr-1">{onlineCount} online</span>
          <div className="flex -space-x-2">
            <div
              className="w-7 h-7 rounded-full border border-black flex items-center justify-center text-[10px] font-bold text-white shadow bg-zinc-800"
              style={{ zIndex: 10 }}
              title="You"
            >
              Y
            </div>
            {onlineUsers.slice(0, 6).map((u, i) => (
              <div
                key={u.userId}
                className="w-7 h-7 rounded-full border border-black flex items-center justify-center text-[10px] font-bold text-white shadow"
                style={{ background: u.color, zIndex: 9 - i }}
                title={u.username}
              >
                {u.username[0]}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom-Left: WASD hint */}
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
