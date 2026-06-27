'use client';

import React, { useState, useRef, useEffect } from 'react';
import type { DmMessage, DmUser } from '../../lib/api/dm.api';

interface DirectMessagePanelProps {
  isOpen: boolean;
  onClose: () => void;
  otherUser: DmUser;
  messages: DmMessage[];
  typingUsers: Set<string>;
  currentUserId: string;
  onSendMessage: (content: string) => void;
  onLoadMore: () => void;
  hasMore: boolean;
  onStartTyping?: () => void;
  isOnline?: boolean;
  userColor?: string;
}

function MessageBubble({ message, isOwn }: { message: DmMessage; isOwn: boolean }) {
  const timestamp = new Date(message.createdAt).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className={`flex gap-2.5 ${isOwn ? 'flex-row-reverse' : ''}`}>
      <div
        className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] font-bold text-white"
        style={{ background: '#6366f1' }}
      >
        {message.sender?.name?.[0]?.toUpperCase() || '?'}
      </div>
      <div className={`flex flex-col ${isOwn ? 'items-end' : ''} max-w-[280px]`}>
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-[11px] font-medium text-gray-400">{message.sender?.name || 'Unknown'}</span>
          <span className="text-[10px] text-gray-600">{timestamp}</span>
        </div>
        <div
          className="px-3 py-2 rounded-2xl text-[13px] leading-relaxed"
          style={{
            background: isOwn ? 'rgba(99, 102, 241, 0.2)' : 'rgba(39, 39, 42, 0.8)',
            color: '#e4e4e7',
            borderTopRightRadius: isOwn ? '4px' : undefined,
            borderTopLeftRadius: !isOwn ? '4px' : undefined,
          }}
        >
          {message.content}
        </div>
      </div>
    </div>
  );
}

export function DirectMessagePanel({
  isOpen,
  onClose,
  otherUser,
  messages,
  typingUsers,
  currentUserId,
  onSendMessage,
  onLoadMore,
  hasMore,
  onStartTyping,
  isOnline = false,
  userColor = '#6366f1',
}: DirectMessagePanelProps) {
  console.log(`[DM_PANEL] DirectMessagePanel rendering, isOpen=${isOpen}, otherUser=${otherUser.name}, messages=${messages.length}`);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 100;
    if (isNearBottom) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSend = () => {
    if (!inputValue.trim()) return;
    onSendMessage(inputValue.trim());
    setInputValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleScroll = () => {
    const container = containerRef.current;
    if (!container || !hasMore) return;

    if (container.scrollTop === 0) {
      onLoadMore();
    }
  };

  const typingArray = Array.from(typingUsers);
  const typingText = typingArray.length === 1
    ? 'is typing...'
    : typingArray.length > 1
    ? 'are typing...'
    : '';

  return (
    <div
      className="absolute top-0 right-0 h-full z-30 pointer-events-auto flex flex-col transition-transform duration-300 ease-in-out"
      style={{
        width: '400px',
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
        <div className="flex items-center gap-3">
          <div className="relative">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white"
              style={{ background: userColor }}
            >
              {otherUser.name?.[0]?.toUpperCase() || '?'}
            </div>
            <div
              className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2"
              style={{
                background: isOnline ? '#22c55e' : '#71717a',
                borderColor: 'rgba(9, 9, 11, 0.95)',
              }}
            />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-white">{otherUser.name || 'Unknown'}</h2>
            <p className="text-[11px] text-gray-500">{isOnline ? 'Online' : 'Offline'}</p>
          </div>
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

      {/* Messages */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto px-4 py-4 space-y-4"
        style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.1) transparent' }}
      >
        {hasMore && (
          <button
            onClick={onLoadMore}
            className="w-full py-2 text-[11px] text-gray-500 hover:text-gray-300 transition-colors"
          >
            Load older messages
          </button>
        )}
        {messages.map((msg) => (
          <MessageBubble
            key={msg.id}
            message={msg}
            isOwn={msg.senderId === currentUserId}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Typing indicator */}
      {typingText && (
        <div className="px-4 py-1 text-[11px] text-gray-500">
          {otherUser.name} {typingText}
        </div>
      )}

      {/* Composer */}
      <div className="flex-shrink-0 px-4 py-3" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.07)' }}>
        <div
          className="flex items-end gap-2 rounded-xl px-3 py-2"
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <textarea
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              onStartTyping?.();
            }}
            onKeyDown={handleKeyDown}
            placeholder={`Message ${otherUser.name}...`}
            rows={1}
            className="flex-1 bg-transparent text-[13px] text-gray-200 placeholder-gray-600 resize-none outline-none py-1 max-h-24"
            style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.1) transparent' }}
          />
          <button
            onClick={handleSend}
            disabled={!inputValue.trim()}
            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors disabled:opacity-30"
            style={{
              background: inputValue.trim() ? 'rgba(99, 102, 241, 0.3)' : 'transparent',
              color: inputValue.trim() ? '#818cf8' : '#52525b',
            }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
