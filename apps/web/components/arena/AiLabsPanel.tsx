'use client';

import React from 'react';
import {
  AiLabsHeader,
  AiLabsChat,
  AiLabsInput,
} from './ai-labs';
import { useAiLabs } from '../../hooks/use-ai-labs';

interface AiLabsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  workspaceId: string;
  spaceId: string;
  organizationId: string;
  teamName?: string;
  contextCount?: number;
  toolsCount?: number;
}

export function AiLabsPanel({
  isOpen,
  onClose,
  workspaceId,
  spaceId,
  organizationId,
  teamName = 'Workspace',
  contextCount = 0,
  toolsCount = 0,
}: AiLabsPanelProps) {
  const {
    messages,
    isConnected,
    isTyping,
    activeWorkflow,
    error,
    sendMessage,
    clearHistory,
    clearError,
  } = useAiLabs({
    workspaceId,
    spaceId,
    organizationId,
    enabled: isOpen,
  });

  return (
    <>
      {/* Slide-in Panel */}
      <div
        className="absolute top-0 right-0 h-full z-30 pointer-events-auto flex flex-col transition-transform duration-300 ease-in-out"
        style={{
          width: '560px',
          transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
          background: 'rgba(9, 9, 11, 0.95)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderLeft: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '-8px 0 60px rgba(0,0,0,0.8)',
        }}
      >
        <AiLabsHeader
          teamName={teamName}
          contextCount={contextCount}
          toolsCount={toolsCount}
          onClearHistory={clearHistory}
          onClose={onClose}
        />

        {/* Connection status */}
        {isOpen && !isConnected && (
          <div className="px-4 py-2 text-[11px] text-center" style={{ background: 'rgba(234, 179, 8, 0.1)', color: '#eab308' }}>
            Reconnecting to AI Labs...
          </div>
        )}

        {/* Workflow progress banner */}
        {activeWorkflow && activeWorkflow.status !== 'completed' && activeWorkflow.status !== 'failed' && (
          <div
            className="px-4 py-2.5 flex items-center gap-2 text-[11px]"
            style={{
              background: 'rgba(59, 130, 246, 0.1)',
              borderBottom: '1px solid rgba(59, 130, 246, 0.2)',
            }}
          >
            <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
            <span className="text-blue-400">
              {activeWorkflow.status === 'mapping' && 'Mapping workflow...'}
              {activeWorkflow.status === 'generating' && 'Generating workflow...'}
            </span>
          </div>
        )}

        {/* Error banner */}
        {error && (
          <div
            className="px-4 py-2.5 flex items-center justify-between text-[11px]"
            style={{ background: 'rgba(239, 68, 68, 0.1)', borderBottom: '1px solid rgba(239, 68, 68, 0.2)' }}
          >
            <span className="text-red-400">{error}</span>
            <button
              onClick={clearError}
              className="text-red-400 hover:text-red-300 ml-2"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10">
          {messages.length > 0 && (
            <>
              <div className="h-px bg-white/5" />
              <AiLabsChat messages={messages} isTyping={isTyping} />
            </>
          )}

          {messages.length === 0 && (
            <section className="flex flex-col items-center justify-center py-8 text-center">
              <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-white/10 flex items-center justify-center mb-3">
                <i className="ti ti-sparkles text-xl text-zinc-500" />
              </div>
              <p className="text-[13px] text-zinc-400 font-medium mb-1">AI Labs</p>
              <p className="text-[11px] text-zinc-600">Ask anything about your workspace</p>
            </section>
          )}
        </div>

        <AiLabsInput onSend={sendMessage} disabled={isTyping || !isConnected} />
      </div>
    </>
  );
}
