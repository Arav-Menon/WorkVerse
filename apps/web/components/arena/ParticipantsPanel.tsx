'use client';

import React, { useState, useRef, useEffect } from 'react';

interface ParticipantUser {
  userId: string;
  username: string;
  color: string;
  isSpeaking?: boolean;
}

interface ParticipantsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  users: ParticipantUser[];
  onlineCount: number;
}

function ContextMenu({ x, y, onClose }: { x: number; y: number; onClose: () => void }) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const items = [
    { label: 'Message', icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z' },
    { label: 'Follow', icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6' },
    { label: 'View Profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
  ];

  return (
    <div
      ref={menuRef}
      className="fixed z-50 py-1.5 rounded-xl min-w-[160px]"
      style={{
        left: x,
        top: y,
        background: 'rgba(24, 24, 27, 0.95)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
      }}
    >
      {items.map(item => (
        <button
          key={item.label}
          onClick={onClose}
          className="w-full flex items-center gap-2.5 px-3.5 py-2 text-[13px] text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
        >
          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} />
          </svg>
          {item.label}
        </button>
      ))}
    </div>
  );
}

function ParticipantRow({
  user,
  isYou,
  onMenuClick,
}: {
  user: ParticipantUser;
  isYou: boolean;
  onMenuClick: (e: React.MouseEvent) => void;
}) {
  return (
    <div className="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-white/5 transition-colors group">
      <div className="relative">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold text-white"
          style={{ background: user.color }}
        >
          {user.username[0]}
        </div>
        <div
          className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2"
          style={{
            background: '#22c55e',
            borderColor: 'rgba(9, 9, 11, 0.95)',
          }}
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[13px] text-gray-200 font-medium truncate">
          {user.username}
          {isYou && <span className="text-gray-600 font-normal ml-1.5">(you)</span>}
        </p>
      </div>
      {user.isSpeaking && (
        <div className="flex items-center gap-1">
          <div className="w-1 h-3 bg-emerald-400 rounded-full animate-pulse" />
          <div className="w-1 h-4 bg-emerald-400 rounded-full animate-pulse" style={{ animationDelay: '0.15s' }} />
          <div className="w-1 h-2 bg-emerald-400 rounded-full animate-pulse" style={{ animationDelay: '0.3s' }} />
        </div>
      )}
      <button
        onClick={onMenuClick}
        className="w-6 h-6 rounded-md flex items-center justify-center text-gray-600 hover:text-gray-300 hover:bg-white/10 opacity-0 group-hover:opacity-100 transition-all"
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
        </svg>
      </button>
    </div>
  );
}

export function ParticipantsPanel({ isOpen, onClose, users, onlineCount }: ParticipantsPanelProps) {
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);

  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setContextMenu({ x: e.clientX, y: e.clientY });
  };

  return (
    <>
      <div
        className="absolute top-0 right-0 h-full z-30 pointer-events-auto flex flex-col transition-transform duration-300 ease-in-out"
        style={{
          width: '380px',
          transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
          background: 'rgba(9, 9, 11, 0.95)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderLeft: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '-8px 0 60px rgba(0,0,0,0.8)',
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-4 flex-shrink-0"
          style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.07)' }}
        >
          <div className="flex items-center gap-2.5">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <h2 className="text-sm font-semibold text-white">Participants</h2>
            <span className="text-[11px] text-gray-500 bg-white/5 px-2 py-0.5 rounded-full">{onlineCount}</span>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Participant List */}
        <div className="flex-1 overflow-y-auto py-2" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.1) transparent' }}>
          {/* You */}
          <ParticipantRow
            user={{ userId: 'you', username: 'You', color: '#8b5cf6', isSpeaking: false }}
            isYou={true}
            onMenuClick={handleMenuClick}
          />

          {/* Other users */}
          {users.map(u => (
            <ParticipantRow
              key={u.userId}
              user={u}
              isYou={false}
              onMenuClick={handleMenuClick}
            />
          ))}

          {users.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-[13px] text-zinc-500">No other participants yet</p>
              <p className="text-[11px] text-zinc-700 mt-1">Others will appear here when they join</p>
            </div>
          )}
        </div>
      </div>

      {/* Context Menu */}
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onClose={() => setContextMenu(null)}
        />
      )}
    </>
  );
}
