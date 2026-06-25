'use client';

import React from 'react';

interface AiLabsContextBarProps {
  workspaceName: string;
  timeRange: string;
  memberCount: number;
}

export function AiLabsContextBar({ workspaceName, timeRange, memberCount }: AiLabsContextBarProps) {
  return (
    <div
      className="flex items-center gap-2 px-4 py-2 flex-shrink-0"
      style={{
        background: '#0A0A0A',
        borderBottom: '0.5px solid rgba(255,255,255,0.04)',
      }}
    >
      <button
        className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] cursor-pointer transition-all duration-150"
        style={{
          background: '#141414',
          border: '0.5px solid rgba(255,255,255,0.06)',
          color: '#5F5E5A',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)';
          e.currentTarget.style.color = '#888780';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
          e.currentTarget.style.color = '#5F5E5A';
        }}
      >
        <i className="ti ti-layout-grid text-[12px]" style={{ color: '#888888' }} />
        {workspaceName}
      </button>

      <div className="w-px h-3" style={{ background: 'rgba(255,255,255,0.06)' }} />

      <button
        className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] cursor-pointer transition-all duration-150"
        style={{
          background: '#141414',
          border: '0.5px solid rgba(255,255,255,0.06)',
          color: '#5F5E5A',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)';
          e.currentTarget.style.color = '#888780';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
          e.currentTarget.style.color = '#5F5E5A';
        }}
      >
        <i className="ti ti-clock text-[12px]" style={{ color: '#888888' }} />
        {timeRange}
      </button>

      <div className="w-px h-3" style={{ background: 'rgba(255,255,255,0.06)' }} />

      <button
        className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] cursor-pointer transition-all duration-150"
        style={{
          background: '#141414',
          border: '0.5px solid rgba(255,255,255,0.06)',
          color: '#5F5E5A',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)';
          e.currentTarget.style.color = '#888780';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
          e.currentTarget.style.color = '#5F5E5A';
        }}
      >
        <i className="ti ti-users text-[12px]" style={{ color: '#888888' }} />
        {memberCount} members
      </button>
    </div>
  );
}
