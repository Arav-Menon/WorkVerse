'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';

interface VideoCallOverlayProps {
  callPartnerName: string;
  callPartnerColor?: string;
  callType: 'audio' | 'video';
  callDuration: number;
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  isMicOn: boolean;
  isCameraOn: boolean;
  onToggleMic: () => void;
  onToggleCamera: () => void;
  onEndCall: () => void;
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
      console.log(`[VideoCallOverlay] Stream attached: ${videoTracks.length} video tracks, ${audioTracks.length} audio tracks`);
    }
  } else {
    if (element.srcObject) {
      element.srcObject = null;
      console.log('[VideoCallOverlay] Stream detached');
    }
  }
}

export function VideoCallOverlay({
  callPartnerName,
  callPartnerColor,
  callType,
  callDuration,
  localStream,
  remoteStream,
  isMicOn,
  isCameraOn,
  onToggleMic,
  onToggleCamera,
  onEndCall,
}: VideoCallOverlayProps) {
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const [position, setPosition] = useState({
    x: typeof window !== 'undefined' ? window.innerWidth - 420 : 800,
    y: typeof window !== 'undefined' ? window.innerHeight - 360 : 400,
  });
  const [isDragging, setIsDragging] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });

  const remoteVideoCallbackRef = useCallback(
    (node: HTMLVideoElement | null) => {
      remoteVideoRef.current = node;
      attachStream(node, remoteStream);
    },
    [remoteStream]
  );

  const localVideoCallbackRef = useCallback(
    (node: HTMLVideoElement | null) => {
      localVideoRef.current = node;
      if (node && localStream && isCameraOn) {
        attachStream(node, localStream);
        console.log('[VideoCallOverlay] Local stream attached via callback ref');
      }
    },
    [localStream, isCameraOn]
  );

  useEffect(() => {
    attachStream(remoteVideoRef.current, remoteStream);
  }, [remoteStream]);

  useEffect(() => {
    if (localVideoRef.current && localStream && isCameraOn) {
      attachStream(localVideoRef.current, localStream);
      console.log('[VideoCallOverlay] Local stream re-attached');
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
        x: Math.max(0, Math.min(window.innerWidth - 400, e.clientX - dragOffset.current.x)),
        y: Math.max(0, Math.min(window.innerHeight - 300, e.clientY - dragOffset.current.y)),
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

  const isVideo = callType === 'video';
  const panelWidth = isVideo ? 400 : 280;

  return (
    <div
      className="fixed flex flex-col overflow-hidden shadow-2xl"
      style={{
        left: position.x,
        top: position.y,
        width: panelWidth,
        zIndex: 50,
        background: 'rgba(9, 9, 11, 0.95)',
        backdropFilter: 'blur(24px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '16px',
      }}
    >
      <div
        className="flex items-center justify-between px-4 py-2.5 cursor-move select-none"
        style={{ background: 'rgba(24, 24, 27, 0.5)', borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}
        onMouseDown={handleMouseDown}
      >
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-white text-[13px] font-medium">{callPartnerName}</span>
        </div>
        <span className="text-gray-400 text-[11px] font-mono">{formatDuration(callDuration)}</span>
      </div>

      <div className="relative" style={{ minHeight: isVideo ? '240px' : '160px' }}>
        {isVideo ? (
          <>
            <video
              ref={remoteVideoCallbackRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
              style={{ minHeight: '240px', background: '#18181b' }}
            />
            {!remoteStream && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold text-white"
                  style={{ background: callPartnerColor || '#6366f1' }}
                >
                  {callPartnerName.charAt(0).toUpperCase()}
                </div>
              </div>
            )}
            <div
              className="absolute bottom-3 right-3 rounded-xl overflow-hidden border border-white/10"
              style={{ width: '120px', height: '90px' }}
            >
              {isCameraOn && localStream ? (
                <video
                  ref={localVideoCallbackRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-zinc-800">
                  <svg className="w-6 h-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
                  </svg>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 gap-3">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold text-white"
              style={{ background: callPartnerColor || '#6366f1' }}
            >
              {callPartnerName.charAt(0).toUpperCase()}
            </div>
            <span className="text-gray-300 text-sm font-medium">{callPartnerName}</span>
            <span className="text-gray-500 text-[11px]">Voice Call</span>
          </div>
        )}
      </div>

      <div
        className="flex items-center justify-center gap-3 px-4 py-3"
        style={{ background: 'rgba(24, 24, 27, 0.5)', borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}
      >
        <button
          onClick={onToggleMic}
          className="w-10 h-10 rounded-full flex items-center justify-center transition-colors"
          style={{
            background: isMicOn ? 'rgba(255, 255, 255, 0.06)' : 'rgba(239, 68, 68, 0.8)',
          }}
          title={isMicOn ? 'Mute' : 'Unmute'}
        >
          {isMicOn ? (
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          ) : (
            <>
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
              <div className="absolute w-6 h-0.5 bg-white rotate-45 rounded" />
            </>
          )}
        </button>

        {isVideo && (
          <button
            onClick={onToggleCamera}
            className="w-10 h-10 rounded-full flex items-center justify-center transition-colors"
            style={{
              background: isCameraOn ? 'rgba(255, 255, 255, 0.06)' : 'rgba(239, 68, 68, 0.8)',
            }}
            title={isCameraOn ? 'Stop Camera' : 'Start Camera'}
          >
            {isCameraOn ? (
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            ) : (
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
              </svg>
            )}
          </button>
        )}

        <button
          onClick={onEndCall}
          className="w-10 h-10 rounded-full flex items-center justify-center bg-red-500 hover:bg-red-400 transition-colors"
          title="End Call"
        >
          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 8l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M5 3a2 2 0 00-2 2v1c0 8.284 6.716 15 15 15h1a2 2 0 002-2v-3.28a1 1 0 00-.684-.948l-4.493-1.498a1 1 0 00-1.21.502l-1.13 2.257a11.042 11.042 0 01-5.516-5.516l2.257-1.13a1 1 0 00.502-1.21L9.228 3.683A1 1 0 008.279 3H5z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
