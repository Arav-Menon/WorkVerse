'use client';

import React, { useRef, useEffect } from 'react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface AiLabsChatProps {
  messages: Message[];
  isTyping: boolean;
}

export function AiLabsChat({ messages, isTyping }: AiLabsChatProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  if (messages.length === 0 && !isTyping) return null;

  return (
    <section>
      <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 mb-3">Conversation</h3>
      <div className="space-y-3">
        {messages.map(msg => (
          <div key={msg.id} className={`flex gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div
              className="w-6 h-6 rounded-full shrink-0 flex items-center justify-center text-[10px] font-bold mt-0.5"
              style={{
                background: msg.role === 'assistant' ? '#27272a' : '#18181b',
                border: '1px solid rgba(255,255,255,0.1)'
              }}
            >
              {msg.role === 'assistant' ? '🧠' : 'A'}
            </div>
            <div
              className={`max-w-[85%] rounded-xl px-3 py-2 text-[12px] leading-relaxed ${
                msg.role === 'user'
                  ? 'text-white rounded-tr-sm'
                  : 'text-gray-200 rounded-tl-sm'
              }`}
              style={{
                background: msg.role === 'user'
                  ? 'rgba(39, 39, 42, 0.8)'
                  : 'rgba(24, 24, 27, 0.5)',
                border: '1px solid rgba(255,255,255,0.08)',
                whiteSpace: 'pre-wrap',
              }}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex gap-2.5">
            <div className="w-6 h-6 rounded-full shrink-0 flex items-center justify-center text-[10px] bg-zinc-800 border border-white/10">
              🧠
            </div>
            <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl rounded-tl-sm" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.07)' }}>
              {[0, 1, 2].map(i => (
                <span key={i} className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
              ))}
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
    </section>
  );
}
