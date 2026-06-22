'use client';

import React from 'react';

interface ActivityItem {
  id: string;
  icon: string;
  title: string;
  time: string;
  type: 'workflow' | 'integration' | 'document' | 'meeting' | 'agent';
}

interface AiLabsActivityFeedProps {
  items: ActivityItem[];
}

const ACTIVITY_COLORS: Record<string, string> = {
  workflow: 'border-emerald-500/50',
  integration: 'border-blue-500/50',
  document: 'border-purple-500/50',
  meeting: 'border-amber-500/50',
  agent: 'border-cyan-500/50',
};

export function AiLabsActivityFeed({ items }: AiLabsActivityFeedProps) {
  return (
    <section>
      <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 mb-3">Activity</h3>
      <div className="space-y-0">
        {items.map((item) => (
          <div
            key={item.id}
            className={`flex items-center gap-3 py-2 border-l-2 ${ACTIVITY_COLORS[item.type] ?? 'border-zinc-500/50'} pl-3`}
          >
            <i className={`ti ${item.icon} text-zinc-500 text-sm`} />
            <span className="text-[11px] text-zinc-300 flex-1">{item.title}</span>
            <span className="text-[10px] text-zinc-500">{item.time}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
