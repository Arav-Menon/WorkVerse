'use client';

import React, { useEffect, useRef, useState } from 'react';

interface IncomingCallModalProps {
  callerName: string;
  callerColor?: string;
  callType: 'audio' | 'video';
  onAccept: () => void;
  onReject: () => void;
}

export function IncomingCallModal({
  callerName,
  callerColor,
  callType,
  onAccept,
  onReject,
}: IncomingCallModalProps) {
  const [pulse, setPulse] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const interval = setInterval(() => setPulse((p) => !p), 1200);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    timeoutRef.current = setTimeout(() => {
      onReject();
    }, 30000);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [onReject]);

  return (
    <div
      className="fixed inset-0 flex items-center justify-center"
      style={{ zIndex: 100, background: 'rgba(0, 0, 0, 0.6)', backdropFilter: 'blur(4px)' }}
    >
      <div
        className="rounded-2xl p-8 flex flex-col items-center gap-5 border border-white/10 shadow-2xl"
        style={{
          background: 'rgba(24, 24, 27, 0.98)',
          minWidth: '300px',
        }}
      >
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold text-white relative"
          style={{
            background: callerColor || '#6366f1',
            boxShadow: pulse ? `0 0 0 8px ${callerColor || '#6366f1'}33` : 'none',
            transition: 'box-shadow 0.6s ease',
          }}
        >
          {callerName.charAt(0).toUpperCase()}
        </div>

        <div className="text-center">
          <h2 className="text-white text-lg font-semibold">{callerName}</h2>
          <p className="text-gray-400 text-sm mt-1">
            Incoming {callType === 'video' ? 'Video' : 'Voice'} Call
          </p>
        </div>

        <div className="flex items-center gap-4 mt-2">
          <button
            onClick={onReject}
            className="w-14 h-14 rounded-full flex items-center justify-center transition-colors"
            style={{ background: 'rgba(239, 68, 68, 0.9)' }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(239, 68, 68, 1)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(239, 68, 68, 0.9)')}
          >
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 8l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M5 3a2 2 0 00-2 2v1c0 8.284 6.716 15 15 15h1a2 2 0 002-2v-3.28a1 1 0 00-.684-.948l-4.493-1.498a1 1 0 00-1.21.502l-1.13 2.257a11.042 11.042 0 01-5.516-5.516l2.257-1.13a1 1 0 00.502-1.21L9.228 3.683A1 1 0 008.279 3H5z" />
            </svg>
          </button>

          <button
            onClick={onAccept}
            className="w-14 h-14 rounded-full flex items-center justify-center transition-colors"
            style={{ background: 'rgba(34, 197, 94, 0.9)' }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(34, 197, 94, 1)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(34, 197, 94, 0.9)')}
          >
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </button>
        </div>

        <div className="flex items-center gap-4 text-[11px] text-gray-500">
          <span className="text-red-400">Decline</span>
          <span className="text-emerald-400">Accept</span>
        </div>
      </div>
    </div>
  );
}
