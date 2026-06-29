'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';

interface LocalVideoPreviewProps {
  localStream: MediaStream | null;
  isMicOn: boolean;
  isCameraOn: boolean;
  onToggleMic: () => void;
  onToggleCamera: () => void;
  onEndCall?: () => void;
  username?: string;
}

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

function attachStream(
  element: HTMLVideoElement | null,
  stream: MediaStream | null
) {
  if (!element) return;
  if (stream) {
    if (element.srcObject !== stream) {
      element.srcObject = stream;
      const videoTracks = stream.getVideoTracks();
      const audioTracks = stream.getAudioTracks();
      console.log(`[VIDEO_UI] Stream attached: ${videoTracks.length} video, ${audioTracks.length} audio`);
    }
  } else {
    if (element.srcObject) {
      element.srcObject = null;
      console.log('[VIDEO_UI] Stream detached');
    }
  }
}

export function LocalVideoPreview({
  localStream,
  isMicOn,
  isCameraOn,
  onToggleMic,
  onToggleCamera,
  onEndCall,
  username,
}: LocalVideoPreviewProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [position, setPosition] = useState({
    x: typeof window !== 'undefined' ? window.innerWidth - 340 : 600,
    y: typeof window !== 'undefined' ? window.innerHeight - 320 : 300,
  });
  const [isDragging, setIsDragging] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const dragOffset = useRef({ x: 0, y: 0 });
  const startTimeRef = useRef(Date.now());

  useEffect(() => {
    startTimeRef.current = Date.now();
    const timer = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTimeRef.current) / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const videoCallbackRef = useCallback(
    (node: HTMLVideoElement | null) => {
      videoRef.current = node;
      if (node && localStream && isCameraOn) {
        attachStream(node, localStream);
        console.log('[VIDEO_UI] Local stream attached via callback ref');
      }
    },
    [localStream, isCameraOn]
  );

  useEffect(() => {
    if (videoRef.current && localStream && isCameraOn) {
      attachStream(videoRef.current, localStream);
    }
  }, [localStream, isCameraOn]);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      setIsDragging(true);
      dragOffset.current = { x: e.clientX - position.x, y: e.clientY - position.y };
    },
    [position]
  );

  useEffect(() => {
    if (!isDragging) return;
    const handleMove = (e: MouseEvent) => {
      setPosition({
        x: Math.max(0, Math.min(window.innerWidth - 320, e.clientX - dragOffset.current.x)),
        y: Math.max(0, Math.min(window.innerHeight - 280, e.clientY - dragOffset.current.y)),
      });
    };
    const handleUp = () => setIsDragging(false);
    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseup', handleUp);
    return () => {
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseup', handleUp);
    };
  }, [isDragging]);

  return (
    <div
      className="fixed flex flex-col overflow-hidden shadow-2xl"
      style={{
        left: position.x,
        top: position.y,
        width: 300,
        zIndex: 50,
        background: 'rgba(9, 9, 11, 0.95)',
        backdropFilter: 'blur(24px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '16px',
      }}
    >
      <div
        className="flex items-center justify-between px-4 py-2 cursor-move select-none"
        style={{ background: 'rgba(24, 24, 27, 0.5)', borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}
        onMouseDown={handleMouseDown}
      >
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-white text-[13px] font-medium">You</span>
        </div>
        <span className="text-gray-400 text-[11px] font-mono">{formatDuration(elapsed)}</span>
      </div>

      <div className="relative" style={{ minHeight: '200px' }}>
        {isCameraOn && localStream ? (
          <video
            ref={videoCallbackRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
            style={{ minHeight: '200px', background: '#18181b' }}
          />
        ) : (
          <div className="flex items-center justify-center" style={{ minHeight: '200px', background: '#18181b' }}>
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold text-white"
              style={{ background: '#6366f1' }}
            >
              {(username || 'U').charAt(0).toUpperCase()}
            </div>
          </div>
        )}
      </div>

      <div
        className="flex items-center justify-between px-3 py-2"
        style={{ background: 'rgba(24, 24, 27, 0.5)', borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}
      >
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: isMicOn ? '#22c55e' : '#ef4444' }}
            />
            <span className="text-[10px] text-gray-400">{isMicOn ? 'Mic On' : 'Mic Off'}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: isCameraOn ? '#22c55e' : '#ef4444' }}
            />
            <span className="text-[10px] text-gray-400">{isCameraOn ? 'Cam On' : 'Cam Off'}</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            <span className="text-[10px] text-gray-400">Publishing</span>
          </div>
        </div>
      </div>

      <div
        className="flex items-center justify-center gap-2 px-3 py-2"
        style={{ borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}
      >
        <button
          onClick={onToggleMic}
          className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
          style={{
            background: isMicOn ? 'rgba(255, 255, 255, 0.06)' : 'rgba(239, 68, 68, 0.8)',
          }}
          title={isMicOn ? 'Mute' : 'Unmute'}
        >
          {isMicOn ? (
            <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          ) : (
            <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              <line x1="1" y1="1" x2="23" y2="23" strokeWidth={2} strokeLinecap="round" />
            </svg>
          )}
        </button>

        <button
          onClick={onToggleCamera}
          className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
          style={{
            background: isCameraOn ? 'rgba(255, 255, 255, 0.06)' : 'rgba(239, 68, 68, 0.8)',
          }}
          title={isCameraOn ? 'Stop Camera' : 'Start Camera'}
        >
          {isCameraOn ? (
            <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          ) : (
            <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
            </svg>
          )}
        </button>

        {onEndCall && (
          <button
            onClick={onEndCall}
            className="w-8 h-8 rounded-full flex items-center justify-center bg-red-500 hover:bg-red-400 transition-colors"
            title="End Call"
          >
            <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 8l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M5 3a2 2 0 00-2 2v1c0 8.284 6.716 15 15 15h1a2 2 0 002-2v-3.28a1 1 0 00-.684-.948l-4.493-1.498a1 1 0 00-1.21.502l-1.13 2.257a11.042 11.042 0 01-5.516-5.516l2.257-1.13a1 1 0 00.502-1.21L9.228 3.683A1 1 0 008.279 3H5z" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
