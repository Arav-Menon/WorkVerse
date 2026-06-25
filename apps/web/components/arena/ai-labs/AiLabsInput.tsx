'use client';

import React, { useState, useEffect, useRef } from 'react';

interface AiLabsInputProps {
  onSend: (text: string) => void;
  disabled?: boolean;
}

const MAX_CHARS = 2000;

export function AiLabsInput({ onSend, disabled = false }: AiLabsInputProps) {
  const [text, setText] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 96)}px`;
  }, [text]);

  const handleSend = () => {
    if (!text.trim() || disabled) return;
    onSend(text);
    setText('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const hasText = text.trim().length > 0;

  return (
    <div
      className="flex-shrink-0 px-3.5 pt-3 pb-3.5"
      style={{ background: '#0A0A0A', borderTop: '0.5px solid rgba(255,255,255,0.06)' }}
    >
      <div
        className="rounded-xl overflow-hidden transition-all duration-150"
        style={{
          background: '#111111',
          border: isFocused
            ? '0.5px solid rgba(255,255,255,0.25)'
            : '0.5px solid rgba(255,255,255,0.09)',
        }}
      >
        {/* Top row: icon + textarea */}
        <div className="flex items-end gap-0 px-3 pt-2.5 pb-2">
          <div
            className="w-5 flex items-center flex-shrink-0 mr-2 pb-px"
            aria-hidden="true"
          >
            <i className="ti ti-sparkles text-[15px]" style={{ color: '#555555' }} />
          </div>
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            disabled={disabled}
            rows={1}
            placeholder="Ask anything about your workspace…"
            className="flex-1 bg-transparent resize-none outline-none text-[13px] leading-[1.5]"
            style={{
              color: '#EEEDFE',
              fontFamily: 'var(--font-sans)',
              minHeight: '20px',
              maxHeight: '96px',
            }}
          />
        </div>

        {/* Bottom row: tools + char count + send */}
        <div className="flex items-center justify-between px-3 pb-2.5">
          <div className="flex items-center gap-1" role="toolbar" aria-label="Attachment options">
            {[
              { icon: 'ti-paperclip', label: 'Attach file' },
              { icon: 'ti-database', label: 'Add context' },
              { icon: 'ti-arrows-split', label: 'Run workflow' },
              { icon: 'ti-at', label: 'Mention member' },
            ].map((tool) => (
              <button
                key={tool.icon}
                className="w-[26px] h-[26px] rounded-[7px] flex items-center justify-center cursor-pointer transition-all duration-150"
                style={{ background: 'transparent', color: '#555555', border: 'none' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#1A1A1A';
                  e.currentTarget.style.color = '#E0E0E0';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = '#555555';
                }}
                aria-label={tool.label}
              >
                <i className={`ti ${tool.icon} text-[14px]`} />
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5">
            <span
              className="text-[10px]"
              style={{ color: '#2C2C2A', fontFamily: 'var(--font-mono)' }}
              aria-label="Character count"
            >
              {text.length}/{MAX_CHARS}
            </span>
            <button
              onClick={handleSend}
              disabled={!hasText || disabled}
              className="w-[30px] h-[30px] rounded-[9px] flex items-center justify-center cursor-pointer transition-all duration-150"
              style={{
                background: hasText ? '#FFFFFF' : '#4d4b4bff',
                border: 'none',
                opacity: hasText ? 1 : 0.5,
              }}
              onMouseEnter={(e) => {
                if (hasText) e.currentTarget.style.background = '#CCCCCC';
              }}
              onMouseLeave={(e) => {
                if (hasText) e.currentTarget.style.background = '#FFFFFF';
              }}
              aria-label="Send message"
            >
              <i className="ti ti-arrow-up text-[14px]" style={{ color: '#0A0A0A' }} />
            </button>
          </div>
        </div>
      </div>

      <p className="text-[10px] text-center mt-2.5" style={{ color: '#2C2C2A' }}>
        AI Labs can analyze workspaces, manage tasks, and run workflows
      </p>
    </div>
  );
}
