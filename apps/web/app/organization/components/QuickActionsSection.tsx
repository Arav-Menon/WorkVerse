"use client";

import React from "react";

interface QuickActionsSectionProps {
  onCreateOrgClick: () => void;
  onOpenCommandPaletteClick: () => void;
}

export default function QuickActionsSection({
  onCreateOrgClick,
  onOpenCommandPaletteClick,
}: QuickActionsSectionProps) {
  const actions = [
    {
      label: "Create organization",
      sub: "New team workspace",
      icon: "ti-building",
      action: onCreateOrgClick,
    },
    {
      label: "Open command palette",
      sub: "Keyboard ⌘K",
      icon: "ti-terminal",
      action: onOpenCommandPaletteClick,
    },
  ];

  return (
    <section className="select-none" aria-labelledby="actions-heading">
      <div className="flex items-center gap-2.5 mb-4" role="separator">
        <span className="text-[10px] font-bold tracking-wider text-zinc-500 uppercase whitespace-nowrap select-none" id="actions-heading">Quick actions</span>
        <div className="flex-grow h-px bg-zinc-900" aria-hidden="true"></div>
      </div>
      <ul className="flex gap-2" role="list">
        {actions.map((act) => (
          <li key={act.label}>
            <button
              className="bg-zinc-950/40 border border-zinc-900 rounded-xl p-4 flex items-center gap-3 hover:border-zinc-800 hover:bg-zinc-900/30 transition-all cursor-pointer text-left group"
              onClick={act.action}
              aria-label={act.label}
            >
              <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-sm text-zinc-400 group-hover:text-white transition-colors flex-shrink-0" aria-hidden="true">
                <i className={`ti ${act.icon}`}></i>
              </div>
              <div className="min-w-0">
                <span className="text-[12px] font-semibold text-white leading-tight block truncate">{act.label}</span>
                <span className="text-[10px] text-zinc-500 leading-tight block mt-0.5 truncate">{act.sub}</span>
              </div>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
