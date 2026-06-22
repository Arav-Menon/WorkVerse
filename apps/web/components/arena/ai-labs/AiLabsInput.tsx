'use client';

import React, { useRef, useState, useEffect } from 'react';

interface AiLabsInputProps {
  onSend: (text: string) => void;
  disabled?: boolean;
}

const PLACEHOLDERS = [
  'What should WorkVerse do next?',
  'Ask about this room...',
  'Create an automation...',
  'Generate a report...',
  'Review workspace activity...',
];

export function AiLabsInput({ onSend, disabled }: AiLabsInputProps) {
  const [input, setInput] = useState('');
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex(prev => (prev + 1) % PLACEHOLDERS.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (input.trim() && !disabled) {
        onSend(input.trim());
        setInput('');
      }
    }
  };

  const handleSend = () => {
    if (input.trim() && !disabled) {
      onSend(input.trim());
      setInput('');
    }
  };

  return (
    <div
      className="px-4 py-3 shrink-0"
      style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
    >
      <div
        className="flex items-end gap-2 rounded-xl p-2 transition-all duration-200"
        style={{
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        <textarea
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={PLACEHOLDERS[placeholderIndex]}
          rows={1}
          className="flex-1 bg-transparent resize-none text-[13px] text-gray-200 placeholder-gray-600 outline-none leading-relaxed py-1 px-1 max-h-32 overflow-y-auto"
          style={{ scrollbarWidth: 'none' }}
        />
        <button
          onClick={handleSend}
          disabled={!input.trim() || disabled}
          className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-all duration-200 disabled:opacity-30 hover:scale-105 active:scale-95 bg-white text-black"
          style={{
            boxShadow: input.trim() ? '0 0 14px rgba(255,255,255,0.2)' : 'none',
          }}
        >
          <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </div>
      <p className="text-[10px] text-gray-700 mt-1.5 text-center">Enter to send · Shift+Enter for new line</p>
    </div>
  );
}
