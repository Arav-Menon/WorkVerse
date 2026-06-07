'use client';

import React, { useState } from 'react';

interface NavButtonProps {
  active?: boolean;
  danger?: boolean;
  activeColor?: string;
  onClick: () => void;
  label: string;
  children: React.ReactNode;
}

function NavButton({ active, danger, activeColor, onClick, label, children }: NavButtonProps) {
  const base = 'group relative flex flex-col items-center justify-center w-12 h-12 rounded-full transition-all duration-200 cursor-pointer';
  let colorClass = 'bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white';
  if (danger) colorClass = 'bg-red-500/90 hover:bg-red-500 text-white shadow-lg shadow-red-500/30';
  else if (active) colorClass = `${activeColor ?? 'bg-red-500/90 hover:bg-red-500'} text-white shadow-lg`;

  return (
    <button className={`${base} ${colorClass}`} onClick={onClick}>
      {children}
      {/* Tooltip */}
      <span className="absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap bg-gray-900 border border-white/10 text-gray-200 text-[11px] font-medium px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        {label}
      </span>
    </button>
  );
}

export function BottomNavBar() {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [isHandRaised, setIsHandRaised] = useState(false);

  return (
    <div
      className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-2 px-5 py-3 rounded-2xl shadow-2xl border border-white/10 pointer-events-auto"
      style={{
        zIndex: 20,
        background: 'rgba(9, 9, 11, 0.95)', // zinc-950
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        boxShadow: '0 8px 40px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.06)',
      }}
    >
      {/* Mic */}
      <NavButton
        active={isMuted}
        activeColor="bg-red-500/90 hover:bg-red-500"
        onClick={() => setIsMuted(p => !p)}
        label={isMuted ? 'Unmute' : 'Mute'}
      >
        {isMuted ? (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <line x1="1" y1="1" x2="23" y2="23" strokeWidth={2} strokeLinecap="round" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 9v3a3 3 0 005.12 2.12M15 9.34V4a3 3 0 00-5.94-.6M17 16.48A7 7 0 0112 19a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4" />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
          </svg>
        )}
      </NavButton>

      {/* Video */}
      <NavButton
        active={isVideoOff}
        activeColor="bg-red-500/90 hover:bg-red-500"
        onClick={() => setIsVideoOff(p => !p)}
        label={isVideoOff ? 'Start Video' : 'Stop Video'}
      >
        {isVideoOff ? (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <line x1="1" y1="1" x2="23" y2="23" strokeWidth={2} strokeLinecap="round" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        )}
      </NavButton>

      {/* Screen Share */}
      <NavButton
        active={isSharing}
        activeColor="bg-emerald-500/90 hover:bg-emerald-500 shadow-emerald-500/30"
        onClick={() => setIsSharing(p => !p)}
        label={isSharing ? 'Stop Sharing' : 'Share Screen'}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      </NavButton>

      {/* Raise hand */}
      <NavButton
        active={isHandRaised}
        activeColor="bg-white hover:bg-zinc-200 shadow-white/30 !text-black"
        onClick={() => setIsHandRaised(p => !p)}
        label={isHandRaised ? 'Lower Hand' : 'Raise Hand'}
      >
        <span className="text-lg leading-none">{isHandRaised ? '✋' : '🤚'}</span>
      </NavButton>

      {/* Divider */}
      <div className="w-px h-8 bg-white/10 mx-1" />

      {/* Leave */}
      <NavButton danger onClick={() => {}} label="Leave Space">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
      </NavButton>
    </div>
  );
}
