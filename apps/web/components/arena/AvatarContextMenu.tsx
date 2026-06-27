'use client';

import React, { useEffect, useRef } from 'react';

interface AvatarContextMenuProps {
  userId: string;
  username: string;
  userColor?: string;
  x: number;
  y: number;
  onClose: () => void;
  onStartCall: (userId: string, username: string, type: 'video' | 'audio') => void;
  onViewProfile?: (userId: string) => void;
}

export function AvatarContextMenu({
  userId,
  username,
  userColor,
  x,
  y,
  onClose,
  onStartCall,
  onViewProfile,
}: AvatarContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    const escHandler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('mousedown', handler);
    document.addEventListener('keydown', escHandler);
    return () => {
      document.removeEventListener('mousedown', handler);
      document.removeEventListener('keydown', escHandler);
    };
  }, [onClose]);

  const menuLeft = Math.min(x, window.innerWidth - 200);
  const menuTop = Math.min(y, window.innerHeight - 220);

  return (
    <div
      ref={menuRef}
      className="rounded-xl min-w-[180px] py-1.5 border border-white/10 shadow-2xl"
      style={{
        position: 'fixed',
        left: menuLeft,
        top: menuTop,
        zIndex: 50,
        background: 'rgba(24, 24, 27, 0.95)',
        backdropFilter: 'blur(16px)',
      }}
    >
      <div className="px-3 py-2 border-b border-white/5 flex items-center gap-2">
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white"
          style={{ background: userColor || '#6366f1' }}
        >
          {username.charAt(0).toUpperCase()}
        </div>
        <span className="text-[13px] font-medium text-gray-200 truncate">{username}</span>
      </div>

      <div className="py-1">
        <button
          onClick={() => {
            onStartCall(userId, username, 'video');
            onClose();
          }}
          className="w-full px-3 py-2 text-left text-[13px] text-gray-300 hover:text-white hover:bg-white/5 flex items-center gap-2.5 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          Start Video Call
        </button>
        <button
          onClick={() => {
            onStartCall(userId, username, 'audio');
            onClose();
          }}
          className="w-full px-3 py-2 text-left text-[13px] text-gray-300 hover:text-white hover:bg-white/5 flex items-center gap-2.5 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
          Start Voice Call
        </button>
        {onViewProfile && (
          <button
            onClick={() => {
              onViewProfile(userId);
              onClose();
            }}
            className="w-full px-3 py-2 text-left text-[13px] text-gray-300 hover:text-white hover:bg-white/5 flex items-center gap-2.5 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            View Profile
          </button>
        )}
      </div>
    </div>
  );
}
