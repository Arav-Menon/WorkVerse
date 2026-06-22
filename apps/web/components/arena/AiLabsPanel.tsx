'use client';

import React, { useState } from 'react';
import {
  AiLabsHeader,
  AiLabsWorkspaceContext,
  AiLabsSuggestions,
  AiLabsActivityFeed,
  AiLabsExecutions,
  AiLabsMemory,
  AiLabsChat,
  AiLabsInput,
} from './ai-labs';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
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

const ACTIVITY_FEED = [
  { id: 'a1', icon: 'ti-infinity', title: 'Workflow created', time: '2 min ago', type: 'workflow' as const },
  { id: 'a2', icon: 'ti-brand-github', title: 'GitHub connected', time: '5 min ago', type: 'integration' as const },
  { id: 'a3', icon: 'ti-file-description', title: 'Meeting summary generated', time: '8 min ago', type: 'document' as const },
  { id: 'a4', icon: 'ti-notes', title: 'Document created', time: '12 min ago', type: 'document' as const },
];

const EXECUTIONS = [
  { id: 'e1', title: 'Creating workflow...', status: 'running' as const, time: 'now' },
  { id: 'e2', title: 'Generating report...', status: 'completed' as const, time: '1m ago' },
  { id: 'e3', title: 'Connecting GitHub...', status: 'failed' as const, time: '3m ago' },
];

const WORKSPACE_MEMORY = {
  recentProjects: ['Auth refactor', 'Payment integration', 'AI Labs UI'],
  recentWorkflows: ['PR Auto-Review', 'Issue Triage', 'Deploy Notifier'],
  frequentIntegrations: ['GitHub', 'Slack', 'Linear'],
};

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
  const [isTyping, setIsTyping] = useState(false);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      role: 'user',
      content: text.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
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
            <span className="text-grey-300">Close</span>
          </>
        ) : (
          <>AI Labs</>
        )}
      </button>

      {/* Slide-in Panel — wider at 560px */}
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
          teamName={WORKSPACE_CONTEXT.teamName}
          activeMembers={WORKSPACE_CONTEXT.activeMembers}
          runningAutomations={WORKSPACE_CONTEXT.runningAutomations}
          onClose={() => setIsOpen(false)}
        />

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10">
          <AiLabsWorkspaceContext
            currentRoom={WORKSPACE_CONTEXT.currentRoom}
            membersOnline={WORKSPACE_CONTEXT.membersOnline}
          />

          <div className="h-px bg-white/5" />

          <AiLabsSuggestions
            suggestions={SMART_SUGGESTIONS}
            onSelect={sendMessage}
          />

          <div className="h-px bg-white/5" />

          <AiLabsActivityFeed items={ACTIVITY_FEED} />

          <div className="h-px bg-white/5" />

          <AiLabsExecutions items={EXECUTIONS} />

          <div className="h-px bg-white/5" />

          <AiLabsMemory memory={WORKSPACE_MEMORY} />

          {messages.length > 0 && (
            <>
              <div className="h-px bg-white/5" />
              <AiLabsChat messages={messages} isTyping={isTyping} />
            </>
          )}

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

        <AiLabsInput onSend={sendMessage} disabled={isTyping} />
      </div>
    </>
  );
}
