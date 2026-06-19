'use client';

import React from 'react';

interface WorkspaceMemory {
  recentProjects: string[];
  recentWorkflows: string[];
  frequentIntegrations: string[];
}

interface AiLabsMemoryProps {
  memory: WorkspaceMemory;
}

export function AiLabsMemory({ memory }: AiLabsMemoryProps) {
  const sections = [
    { label: 'Recent Projects', items: memory.recentProjects },
    { label: 'Recent Workflows', items: memory.recentWorkflows },
    { label: 'Frequently Used', items: memory.frequentIntegrations },
  ];

  return (
    <section>
      <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 mb-3">Memory</h3>
      <div className="space-y-3">
        {sections.map(({ label, items }) => (
          <div key={label}>
            <p className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider mb-1.5">{label}</p>
            <div className="flex flex-wrap gap-1.5">
              {items.map((item, i) => (
                <span key={i} className="text-[10px] text-zinc-400 bg-zinc-900/50 border border-white/5 rounded-md px-2 py-1">
                  {item}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
