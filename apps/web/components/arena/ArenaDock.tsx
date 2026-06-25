'use client';

import React from 'react';

interface ArenaDockProps {
  isMuted: boolean;
  isVideoOff: boolean;
  isSharing: boolean;
  isHandRaised: boolean;
  onToggleMic: () => void;
  onToggleVideo: () => void;
  onToggleShare: () => void;
  onToggleHand: () => void;
  onOpenChat: () => void;
  onOpenParticipants: () => void;
  onOpenAiLabs: () => void;
  onLeave: () => void;
}

interface DockButtonProps {
  active?: boolean;
  danger?: boolean;
  activeColor?: string;
  onClick: () => void;
  label: string;
  children: React.ReactNode;
}

function DockButton({ active, danger, activeColor, onClick, label, children }: DockButtonProps) {
  let colorClass = 'bg-white/[0.06] hover:bg-white/[0.12] text-gray-400 hover:text-white';
  if (danger) {
    colorClass = 'bg-red-500/80 hover:bg-red-500 text-white shadow-lg shadow-red-500/20';
  } else if (active) {
    colorClass = `${activeColor ?? 'bg-red-500/80 hover:bg-red-500'} text-white shadow-lg`;
  }

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    onClick();
    (e.currentTarget as HTMLButtonElement).blur();
  };

  return (
    <button
      className={`group relative flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-150 cursor-pointer hover:scale-110 active:scale-95 ${colorClass}`}
      onClick={handleClick}
    >
      {children}
      <span className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap bg-gray-900 border border-white/10 text-gray-200 text-[10px] font-medium px-2 py-0.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg">
        {label}
      </span>
    </button>
  );
}

function DockDivider() {
  return <div className="w-px h-4 bg-white/[0.08] mx-0.5" />;
}

export function ArenaDock({
  isMuted,
  isVideoOff,
  isSharing,
  isHandRaised,
  onToggleMic,
  onToggleVideo,
  onToggleShare,
  onToggleHand,
  onOpenChat,
  onOpenParticipants,
  onOpenAiLabs,
  onLeave,
}: ArenaDockProps) {
  return (
    <div
      className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 px-2 py-2 rounded-xl shadow-2xl border border-white/[0.5] pointer-events-auto"
      style={{
        zIndex: 20,
        background: 'rgba(9, 9, 11, 0.88)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        boxShadow: '0 4px 24px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.04)',
      }}
    >
      {/* Mic */}
      <DockButton
        active={isMuted}
        activeColor="bg-red-500/80 hover:bg-red-500"
        onClick={onToggleMic}
        label={isMuted ? 'Unmute' : 'Mute'}
      >
        {isMuted ? (
          <svg className="w-[15px] h-[15px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <line x1="1" y1="1" x2="23" y2="23" strokeWidth={2} strokeLinecap="round" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 9v3a3 3 0 005.12 2.12M15 9.34V4a3 3 0 00-5.94-.6M17 16.48A7 7 0 0112 19a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4" />
          </svg>
        ) : (
          <svg className="w-[15px] h-[15px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
          </svg>
        )}
      </DockButton>

      {/* Camera */}
      <DockButton
        active={isVideoOff}
        activeColor="bg-red-500/80 hover:bg-red-500"
        onClick={onToggleVideo}
        label={isVideoOff ? 'Start Video' : 'Stop Video'}
      >
        {isVideoOff ? (
          <svg className="w-[15px] h-[15px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <line x1="1" y1="1" x2="23" y2="23" strokeWidth={2} strokeLinecap="round" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        ) : (
          <svg className="w-[15px] h-[15px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        )}
      </DockButton>

      {/* Screen Share */}
      <DockButton
        active={isSharing}
        activeColor="bg-emerald-500/80 hover:bg-emerald-500 shadow-emerald-500/20"
        onClick={onToggleShare}
        label={isSharing ? 'Stop Sharing' : 'Share Screen'}
      >
        <svg className="w-[15px] h-[15px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      </DockButton>

      <DockDivider />

      {/* Chat */}
      <DockButton onClick={onOpenChat} label="Chat">
        <svg className="w-[15px] h-[15px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      </DockButton>

      {/* Participants */}
      <DockButton onClick={onOpenParticipants} label="Participants">
        <svg className="w-[15px] h-[15px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </DockButton>

      {/* AI Labs */}
      <DockButton onClick={onOpenAiLabs} label="AI Labs">
        <svg className="w-[15px] h-[15px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      </DockButton>

      <DockDivider />

      {/* Leave */}
      <DockButton danger onClick={onLeave} label="Leave Space">
        <svg className="w-[15px] h-[15px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
      </DockButton>
    </div>
  );
}
