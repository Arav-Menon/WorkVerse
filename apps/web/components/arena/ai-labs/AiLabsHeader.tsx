'use client';

import React from 'react';

interface AiLabsHeaderProps {
  teamName: string;
  contextCount: number;
  toolsCount: number;
  onClearHistory: () => void;
  onClose: () => void;
}

export function AiLabsHeader({ teamName, contextCount, toolsCount, onClearHistory, onClose }: AiLabsHeaderProps) {
  return (
    <div
      className="px-4 py-3.5 flex items-center justify-between flex-shrink-0"
      style={{
        background: '#0A0A0A',
        borderBottom: '0.5px solid rgba(255,255,255,0.07)',
      }}
    >
      <div className="flex items-center gap-2.5">
        <div
          className="w-9 h-9 rounded-[10px] flex items-center justify-center flex-shrink-0"
          style={{
            background: '#1A1A1A',
            border: '0.5px solid rgba(255,255,255,0.15)',
          }}
        >
          <i className="ti ti-sparkles text-[17px]" style={{ color: '#E0E0E0' }} />
        </div>
        <div>
          <div className="text-[14px] font-medium leading-tight" style={{ color: '#EEEDFE' }}>
            AI Labs
          </div>
          <div className="text-[11px] flex items-center gap-1.5 mt-0.5" style={{ color: '#444441' }}>
            <span
              className="w-[5px] h-[5px] rounded-full flex-shrink-0"
              style={{ background: '#1D9E75' }}
            />
            {teamName} · Active
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1.5">
        <button
          className="flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] cursor-pointer transition-all duration-150"
          style={{
            background: '#1A1A1A',
            border: '0.5px solid rgba(255,255,255,0.12)',
            color: '#E0E0E0',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#1E1E1E';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#1A1A1A';
          }}
        >
          <i className="ti ti-database text-[12px]" />
          {contextCount} context
        </button>

        <button
          className="flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] cursor-pointer transition-all duration-150"
          style={{
            background: '#1A1A1A',
            border: '0.5px solid rgba(255,255,255,0.12)',
            color: '#E0E0E0',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#1E1E1E';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#1A1A1A';
          }}
        >
          <i className="ti ti-plug text-[12px]" />
          {toolsCount} tools
        </button>

        <button
          onClick={onClearHistory}
          className="w-7 h-7 rounded-lg flex items-center justify-center cursor-pointer transition-all duration-150"
          style={{
            background: '#1A1A1A',
            border: '0.5px solid rgba(255,255,255,0.07)',
            color: '#5F5E5A',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#2A1515';
            e.currentTarget.style.color = '#ef4444';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#1A1A1A';
            e.currentTarget.style.color = '#5F5E5A';
          }}
          title="Clear chat history"
        >
          <i className="ti ti-trash text-[14px]" />
        </button>

        <button
          onClick={onClose}
          className="w-7 h-7 rounded-lg flex items-center justify-center cursor-pointer transition-all duration-150"
          style={{
            background: '#1A1A1A',
            border: '0.5px solid rgba(255,255,255,0.07)',
            color: '#5F5E5A',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#222222';
            e.currentTarget.style.color = '#a1a1aa';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#1A1A1A';
            e.currentTarget.style.color = '#5F5E5A';
          }}
        >
          <i className="ti ti-x text-[14px]" />
        </button>
      </div>
    </div>
  );
}
