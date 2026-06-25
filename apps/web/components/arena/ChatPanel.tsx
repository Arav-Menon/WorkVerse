'use client';

import React, { useState, useRef, useEffect } from 'react';

export interface ChatMessage {
  id: string;
  userId: string;
  username: string;
  color: string;
  text: string;
  timestamp: string;
  isOwn: boolean;
}

interface ChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  currentUserId: string;
}

function MessageBubble({ message }: { message: ChatMessage }) {
  return (
    <div className={`flex gap-2.5 ${message.isOwn ? 'flex-row-reverse' : ''}`}>
      <div
        className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] font-bold text-white"
        style={{ background: message.color }}
      >
        {message.username[0]}
      </div>
      <div className={`flex flex-col ${message.isOwn ? 'items-end' : ''} max-w-[280px]`}>
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-[11px] font-medium text-gray-400">{message.username}</span>
          <span className="text-[10px] text-gray-600">{message.timestamp}</span>
        </div>
        <div
          className="px-3 py-2 rounded-2xl text-[13px] leading-relaxed"
          style={{
            background: message.isOwn ? 'rgba(99, 102, 241, 0.2)' : 'rgba(39, 39, 42, 0.8)',
            color: '#e4e4e7',
            borderTopRightRadius: message.isOwn ? '4px' : undefined,
            borderTopLeftRadius: !message.isOwn ? '4px' : undefined,
          }}
        >
          {message.text}
        </div>
      </div>
    </div>
  );
}

export function ChatPanel({ isOpen, onClose, messages, onSendMessage, currentUserId }: ChatPanelProps) {
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
        <div className="flex items-center gap-2.5">
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <h2 className="text-sm font-semibold text-white">Workspace Chat</h2>
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
      <div ref={containerRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-4" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.1) transparent' }}>
        {messages.map(msg => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
        <div ref={messagesEndRef} />
      </div>

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
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
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
        <p className="text-[10px] text-gray-600 mt-1.5 text-center">Messages are visible to everyone in this space</p>
      </div>
    </div>
  );
}
