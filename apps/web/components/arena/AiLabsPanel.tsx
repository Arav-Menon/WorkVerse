'use client';

import React, { useState, useRef, useEffect } from 'react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const QUICK_PROMPTS = [
  '✍️  Summarize our standup notes',
  '🗓  Draft a meeting agenda',
  '🐛  Review this bug report',
  '💡  Brainstorm product ideas',
];

const MOCK_RESPONSES: Record<string, string> = {
  default: "I'm your AI workspace assistant. I can help with code reviews, drafting documents, brainstorming ideas, summarizing notes, and much more. What would you like to work on?",
};

function getMockResponse(prompt: string): string {
  const p = prompt.toLowerCase();
  if (p.includes('standup') || p.includes('notes')) {
    return "Here's a summary of your standup notes:\n\n• **Ansh** — Completed auth module refactor. Blocked on API review.\n• **Raj** — Shipped the payment integration. Needs QA sign-off.\n• **Sarah** — Working on AI Labs UI. ETA end of sprint.\n\nNo critical blockers. Next sync tomorrow 10 AM.";
  }
  if (p.includes('agenda') || p.includes('meeting')) {
    return "**Draft Meeting Agenda**\n\n1. Sprint retrospective (10 min)\n2. Q3 roadmap review (20 min)\n3. AI Labs feature prioritization (15 min)\n4. Engineering capacity planning (10 min)\n5. Open Q&A (5 min)\n\nTotal: ~60 minutes";
  }
  if (p.includes('bug') || p.includes('review')) {
    return "To review a bug report, please paste the issue details or error logs and I'll analyze the root cause, suggest fixes, and prioritize severity for you.";
  }
  if (p.includes('brainstorm') || p.includes('idea')) {
    return "**Product Ideas for WorkVerse:**\n\n1. 🎯 **Focus Rooms** — Distraction-free zones with Pomodoro timers\n2. 🎙  **Async Video Messages** — Loom-style clips inside the arena\n3. 📊  **Live Presence Heatmaps** — See where teammates are most active\n4. 🤖  **AI Meeting Notes** — Auto-transcribe and summarize every call\n5. 🧩  **Plugin API** — Let teams build custom zones and tools";
  }
  return "That's an interesting question! As your AI workspace assistant, I can help you think through this. Could you give me a bit more context so I can give you the most useful answer?";
}

export function AiLabsPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: MOCK_RESPONSES.default!,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      role: 'user',
      content: text.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response delay
    setTimeout(() => {
      const aiMsg: Message = {
        id: `a-${Date.now()}`,
        role: 'assistant',
        content: getMockResponse(text),
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 900 + Math.random() * 600);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  return (
    <>
      {/* ── Floating trigger button ── */}
      {/* z-40: must always sit above the panel (z-30) so clicks register */}
      <button
        onClick={() => setIsOpen(p => !p)}
        className="absolute bottom-5 right-5 z-40 flex items-center gap-2.5 px-4 py-2.5 rounded-2xl font-semibold text-sm text-white transition-all duration-200 hover:scale-105 active:scale-95 pointer-events-auto"
        style={{
          background: isOpen
            ? 'rgba(24, 24, 27, 0.95)' // zinc-900
            : 'rgba(9, 9, 11, 0.9)', // zinc-950
          border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: isOpen
            ? '0 4px 20px rgba(0,0,0,0.4)'
            : '0 4px 30px rgba(0,0,0,0.5)',
        }}
      >
        {isOpen ? (
          // When panel is open: show a clear close state
          <>
            <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
            <span className="text-gray-300">Close</span>
          </>
        ) : (
          // When panel is closed: show the AI Labs branding
          <>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            AI Labs
          </>
        )}
      </button>

      {/* ── Slide-in Panel ── */}
      <div
        className="absolute top-0 right-0 h-full z-30 pointer-events-auto flex flex-col transition-transform duration-300 ease-in-out"
        style={{
          width: '420px',
          transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
          background: 'rgba(9, 9, 11, 0.95)', // zinc-950
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderLeft: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '-8px 0 60px rgba(0,0,0,0.8)',
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-4 shrink-0"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-base shadow-lg bg-zinc-900 border border-white/10"
              style={{
                boxShadow: '0 0 20px rgba(0,0,0,0.4)',
              }}
            >
              🧠
            </div>
            <div>
              <h2 className="text-sm font-bold text-white tracking-tight">AI Labs</h2>
              <p className="text-[11px] text-zinc-400">Workspace Intelligence</p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all duration-150"
            title="Close AI Labs"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Quick prompts */}
        <div className="px-4 pt-3 pb-2 shrink-0">
          <p className="text-[10px] text-gray-600 uppercase tracking-widest mb-2 font-medium">Quick prompts</p>
          <div className="grid grid-cols-2 gap-1.5">
            {QUICK_PROMPTS.map(p => (
              <button
                key={p}
                onClick={() => sendMessage(p.replace(/^.{2}\s/, ''))}
                className="text-left text-[11px] font-medium text-zinc-400 hover:text-white bg-zinc-900/50 hover:bg-zinc-800 border border-white/5 hover:border-white/20 rounded-lg px-3 py-2 transition-all duration-150 truncate"
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="mx-4 h-px bg-white/5 shrink-0" />

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10">
          {messages.map(msg => (
            <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              {/* Avatar */}
              <div
                className="w-7 h-7 rounded-full shrink-0 flex items-center justify-center text-xs font-bold mt-0.5"
                style={{
                  background: msg.role === 'assistant'
                    ? '#27272a' // zinc-800
                    : '#18181b', // zinc-900
                  border: '1px solid rgba(255,255,255,0.1)'
                }}
              >
                {msg.role === 'assistant' ? '🤖' : 'A'}
              </div>

              {/* Bubble */}
              <div
                className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed ${
                  msg.role === 'user'
                    ? 'text-white rounded-tr-sm'
                    : 'text-gray-200 rounded-tl-sm'
                }`}
                style={{
                  background: msg.role === 'user'
                    ? 'rgba(39, 39, 42, 0.8)' // zinc-800
                    : 'rgba(24, 24, 27, 0.5)', // zinc-900
                  border: '1px solid rgba(255,255,255,0.1)',
                  whiteSpace: 'pre-wrap',
                }}
              >
                {msg.content}
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {isTyping && (
            <div className="flex gap-3">
              <div
                className="w-7 h-7 rounded-full shrink-0 flex items-center justify-center text-xs bg-zinc-800 border border-white/10"
              >
                🤖
              </div>
              <div
                className="flex items-center gap-1.5 px-4 py-3 rounded-2xl rounded-tl-sm"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.07)' }}
              >
                {[0, 1, 2].map(i => (
                  <span
                    key={i}
                    className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <div
          className="px-4 py-3 shrink-0"
          style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
        >
          <div
            className="flex items-end gap-2 rounded-xl p-2"
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
              placeholder="Ask anything about your workspace…"
              rows={1}
              className="flex-1 bg-transparent resize-none text-[13px] text-gray-200 placeholder-gray-600 outline-none leading-relaxed py-1 px-1 max-h-32 overflow-y-auto"
              style={{ scrollbarWidth: 'none' }}
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || isTyping}
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
      </div>
    </>
  );
}
