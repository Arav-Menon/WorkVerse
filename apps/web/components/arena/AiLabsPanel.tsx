'use client';

import React, { useState, useRef, useEffect } from 'react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ActivityItem {
  id: string;
  icon: string;
  title: string;
  time: string;
  type: 'workflow' | 'integration' | 'document' | 'meeting' | 'agent';
}

interface ExecutionItem {
  id: string;
  title: string;
  status: 'running' | 'completed' | 'failed';
  time: string;
}

const WORKSPACE_CONTEXT = {
  teamName: 'Engineering Team',
  activeMembers: 12,
  runningAutomations: 4,
  currentRoom: 'Engineering Floor',
  membersOnline: 6,
  activeWorkflows: 4,
  connectedApps: 7,
};

const SMART_SUGGESTIONS = [
  { icon: 'ti-chart-bar', text: 'Summarize current room activity' },
  { icon: 'ti-list-check', text: 'Show unresolved engineering tasks' },
  { icon: 'ti-file-description', text: 'Create sprint planning document' },
  { icon: 'ti-infinity', text: 'Review active workflows' },
  { icon: 'ti-user-off', text: 'Find blocked teammates' },
  { icon: 'ti-report-analytics', text: 'Generate weekly report' },
];

const ACTIVITY_FEED: ActivityItem[] = [
  { id: 'a1', icon: 'ti-infinity', title: 'Workflow created', time: '2 min ago', type: 'workflow' },
  { id: 'a2', icon: 'ti-brand-github', title: 'GitHub connected', time: '5 min ago', type: 'integration' },
  { id: 'a3', icon: 'ti-file-description', title: 'Meeting summary generated', time: '8 min ago', type: 'document' },
  { id: 'a4', icon: 'ti-notes', title: 'Document created', time: '12 min ago', type: 'document' },
];

const EXECUTIONS: ExecutionItem[] = [
  { id: 'e1', title: 'Creating workflow...', status: 'running', time: 'now' },
  { id: 'e2', title: 'Generating report...', status: 'completed', time: '1m ago' },
  { id: 'e3', title: 'Connecting GitHub...', status: 'failed', time: '3m ago' },
];

const WORKSPACE_MEMORY = {
  recentProjects: ['Auth refactor', 'Payment integration', 'AI Labs UI'],
  recentWorkflows: ['PR Auto-Review', 'Issue Triage', 'Deploy Notifier'],
  frequentIntegrations: ['GitHub', 'Slack', 'Linear'],
};

const COMMAND_PLACEHOLDERS = [
  'What should WorkVerse do next?',
  'Ask about this room...',
  'Create an automation...',
  'Generate a report...',
  'Review workspace activity...',
];

function getMockResponse(prompt: string): string {
  const p = prompt.toLowerCase();
  if (p.includes('summarize') || p.includes('activity')) {
    return "**Room Activity Summary**\n\n• 6 members currently online\n• 4 workflows running\n• 2 PRs awaiting review\n• 1 standup scheduled for 10 AM\n\nNo critical blockers detected.";
  }
  if (p.includes('task') || p.includes('unresolved')) {
    return "**Unresolved Engineering Tasks**\n\n1. API rate limiting issue (High)\n2. Payment webhook timeout (Medium)\n3. Auth token refresh bug (High)\n4. Dashboard loading optimization (Low)\n\nTotal: 4 unresolved tasks";
  }
  if (p.includes('sprint') || p.includes('planning')) {
    return "**Sprint Planning Document Created**\n\nGenerated sprint plan for Q3 with:\n• 12 story points allocated\n• 3 epics broken down\n• Dependencies mapped\n• Risks identified\n\nReady for review in Documents.";
  }
  if (p.includes('workflow')) {
    return "**Active Workflows**\n\n• PR Auto-Review: 142 runs (active)\n• Issue Triage: 89 runs (active)\n• Deploy Notifier: 234 runs (active)\n• Daily Standup: 312 runs (paused)\n\nAll workflows healthy.";
  }
  if (p.includes('blocked') || p.includes('teammate')) {
    return "**Blocked Teammates**\n\n• Ansh: Waiting on API review\n• Raj: Needs QA sign-off\n• Sarah: Blocked on design assets\n\nSuggestion: Schedule sync meetings.";
  }
  if (p.includes('report') || p.includes('weekly')) {
    return "**Weekly Report Generated**\n\n• 23 PRs merged\n• 89% code review coverage\n• 4 workflows executed 473 times\n• 0 critical incidents\n\nReport saved to Documents.";
  }
  return "I can help with workspace analysis, task management, workflow optimization, and team insights. What would you like to explore?";
}

export function AiLabsPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex(prev => (prev + 1) % COMMAND_PLACEHOLDERS.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'text-amber-400';
      case 'completed': return 'text-emerald-400';
      case 'failed': return 'text-red-400';
      default: return 'text-zinc-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running': return 'ti-loader';
      case 'completed': return 'ti-check';
      case 'failed': return 'ti-x';
      default: return 'ti-circle';
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'workflow': return 'border-emerald-500/50';
      case 'integration': return 'border-blue-500/50';
      case 'document': return 'border-purple-500/50';
      case 'meeting': return 'border-amber-500/50';
      case 'agent': return 'border-cyan-500/50';
      default: return 'border-zinc-500/50';
    }
  };

  return (
    <>
      {/* Floating trigger button */}
      <button
        onClick={() => setIsOpen(p => !p)}
        className="absolute bottom-5 right-5 z-40 flex items-center gap-2.5 px-4 py-2.5 rounded-2xl font-semibold text-sm text-white transition-all duration-200 hover:scale-105 active:scale-95 pointer-events-auto"
        style={{
          background: isOpen
            ? 'rgba(24, 24, 27, 0.95)'
            : 'rgba(9, 9, 11, 0.9)',
          border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: isOpen
            ? '0 4px 20px rgba(0,0,0,0.4)'
            : '0 4px 30px rgba(0,0,0,0.5)',
        }}
      >
        {isOpen ? (
          <>
            <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
            <span className="text-gray-300">Close</span>
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            AI Labs
          </>
        )}
      </button>

      {/* Slide-in Panel */}
      <div
        className="absolute top-0 right-0 h-full z-30 pointer-events-auto flex flex-col transition-transform duration-300 ease-in-out"
        style={{
          width: '420px',
          transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
          background: 'rgba(9, 9, 11, 0.95)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderLeft: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '-8px 0 60px rgba(0,0,0,0.8)',
        }}
      >
        {/* Header with Rich Workspace Context */}
        <div
          className="px-5 py-4 shrink-0"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center text-base shadow-lg bg-zinc-900 border border-white/10"
                style={{ boxShadow: '0 0 20px rgba(0,0,0,0.4)' }}
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
          
          {/* Team Context */}
          <div className="flex items-center gap-2 text-[11px]">
            <span className="text-zinc-300 font-medium">{WORKSPACE_CONTEXT.teamName}</span>
            <span className="text-zinc-600">·</span>
            <span className="text-zinc-400">{WORKSPACE_CONTEXT.activeMembers} active</span>
            <span className="text-zinc-600">·</span>
            <span className="text-emerald-400">{WORKSPACE_CONTEXT.runningAutomations} automations</span>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10">
          
          {/* Workspace Awareness Section */}
          <section>
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 mb-3">Current Context</h3>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-zinc-950/50 border border-zinc-900/60 rounded-xl p-3">
                <p className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider mb-1">Room</p>
                <p className="text-[13px] font-bold text-zinc-300">{WORKSPACE_CONTEXT.currentRoom}</p>
              </div>
              <div className="bg-zinc-950/50 border border-zinc-900/60 rounded-xl p-3">
                <p className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider mb-1">Online</p>
                <p className="text-[13px] font-bold text-zinc-300">{WORKSPACE_CONTEXT.membersOnline}</p>
              </div>
              <div className="bg-zinc-950/50 border border-zinc-900/60 rounded-xl p-3">
                <p className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider mb-1">Workflows</p>
                <p className="text-[13px] font-bold text-emerald-400">{WORKSPACE_CONTEXT.activeWorkflows} active</p>
              </div>
              <div className="bg-zinc-950/50 border border-zinc-900/60 rounded-xl p-3">
                <p className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider mb-1">Apps</p>
                <p className="text-[13px] font-bold text-zinc-300">{WORKSPACE_CONTEXT.connectedApps}</p>
              </div>
            </div>
          </section>

          {/* Divider */}
          <div className="h-px bg-white/5" />

          {/* Smart Suggestions */}
          <section>
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 mb-3">Suggestions</h3>
            <div className="space-y-1.5">
              {SMART_SUGGESTIONS.map((suggestion, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(suggestion.text)}
                  className="w-full text-left flex items-center gap-2.5 text-[11px] font-medium text-zinc-400 hover:text-white bg-zinc-900/50 hover:bg-zinc-800 border border-white/5 hover:border-white/20 rounded-lg px-3 py-2 transition-all duration-150"
                >
                  <i className={`ti ${suggestion.icon} text-zinc-500`} />
                  <span>{suggestion.text}</span>
                </button>
              ))}
            </div>
          </section>

          {/* Divider */}
          <div className="h-px bg-white/5" />

          {/* AI Activity Feed */}
          <section>
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 mb-3">Activity</h3>
            <div className="space-y-0">
              {ACTIVITY_FEED.map((item) => (
                <div
                  key={item.id}
                  className={`flex items-center gap-3 py-2 border-l-2 ${getActivityColor(item.type)} pl-3`}
                >
                  <i className={`ti ${item.icon} text-zinc-500 text-sm`} />
                  <span className="text-[11px] text-zinc-300 flex-1">{item.title}</span>
                  <span className="text-[10px] text-zinc-500">{item.time}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Divider */}
          <div className="h-px bg-white/5" />

          {/* Execution Status */}
          <section>
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 mb-3">Executions</h3>
            <div className="space-y-1.5">
              {EXECUTIONS.map((exec) => (
                <div
                  key={exec.id}
                  className="flex items-center justify-between py-2 px-3 rounded-lg bg-zinc-950/30 border border-zinc-900/40"
                >
                  <div className="flex items-center gap-2.5">
                    <i className={`ti ${getStatusIcon(exec.status)} ${getStatusColor(exec.status)} text-sm`} />
                    <span className="text-[11px] text-zinc-300">{exec.title}</span>
                  </div>
                  <span className={`text-[10px] font-medium ${getStatusColor(exec.status)}`}>
                    {exec.status === 'running' ? '⏳' : exec.status === 'completed' ? '✓' : '✗'}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Divider */}
          <div className="h-px bg-white/5" />

          {/* Workspace Memory */}
          <section>
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 mb-3">Memory</h3>
            <div className="space-y-3">
              <div>
                <p className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider mb-1.5">Recent Projects</p>
                <div className="flex flex-wrap gap-1.5">
                  {WORKSPACE_MEMORY.recentProjects.map((project, i) => (
                    <span key={i} className="text-[10px] text-zinc-400 bg-zinc-900/50 border border-white/5 rounded-md px-2 py-1">
                      {project}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider mb-1.5">Recent Workflows</p>
                <div className="flex flex-wrap gap-1.5">
                  {WORKSPACE_MEMORY.recentWorkflows.map((workflow, i) => (
                    <span key={i} className="text-[10px] text-zinc-400 bg-zinc-900/50 border border-white/5 rounded-md px-2 py-1">
                      {workflow}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider mb-1.5">Frequently Used</p>
                <div className="flex flex-wrap gap-1.5">
                  {WORKSPACE_MEMORY.frequentIntegrations.map((integration, i) => (
                    <span key={i} className="text-[10px] text-zinc-400 bg-zinc-900/50 border border-white/5 rounded-md px-2 py-1">
                      {integration}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Messages (when present) */}
          {messages.length > 0 && (
            <>
              <div className="h-px bg-white/5" />
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
            </>
          )}

          {/* Empty State (when no messages) */}
          {messages.length === 0 && (
            <section className="flex flex-col items-center justify-center py-8 text-center">
              <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-white/10 flex items-center justify-center text-2xl mb-3">
                🧠
              </div>
              <p className="text-[13px] text-zinc-400 font-medium mb-1">No active tasks</p>
              <p className="text-[11px] text-zinc-600">Try asking about your workspace</p>
            </section>
          )}
        </div>

        {/* AI Input Area (Command Center) */}
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
              placeholder={COMMAND_PLACEHOLDERS[placeholderIndex]}
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
