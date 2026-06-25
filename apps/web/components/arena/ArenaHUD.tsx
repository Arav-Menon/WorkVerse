'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

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
  onLeave?: () => void;
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
  onLeave,
}: ArenaHUDProps) {
  const router = useRouter();

  const handleLeave = () => {
    // Send SPACE_LEAVE event to server first
    onLeave?.();

    // Navigate after a brief delay to ensure the leave event is sent
    setTimeout(() => {
      if (orgId) {
        router.push(`/organization/${orgId}/workspaces`);
      } else {
        router.push('/home');
      }
    }, 200);
  };

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

      {/* Top-Right: Online users + Leave */}
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

          <div className="w-px h-6 bg-white/10 mx-1" />

          {/* Settings */}
          <button
            className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
            title="Settings"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>

          {/* Leave Space */}
          <button
            onClick={handleLeave}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 hover:text-red-300 text-[11px] font-medium transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Leave
          </button>
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
