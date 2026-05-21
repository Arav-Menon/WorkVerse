"use client";

import React from "react";

interface QuickActionsSectionProps {
  onCreateOrgClick: () => void;
  onJoinWorkspaceClick: () => void;
  onLaunchAiLabClick: () => void;
  onScheduleMeetingClick: () => void;
  onCreateAutomationClick: () => void;
  onOpenRecentRoomClick: () => void;
  onSendInviteClick: () => void;
  onOpenCommandPaletteClick: () => void;
}

export default function QuickActionsSection({
  onCreateOrgClick,
  onJoinWorkspaceClick,
  onLaunchAiLabClick,
  onScheduleMeetingClick,
  onCreateAutomationClick,
  onOpenRecentRoomClick,
  onSendInviteClick,
  onOpenCommandPaletteClick,
}: QuickActionsSectionProps) {
  const actions = [
    {
      label: "Create org",
      sub: "New team workspace",
      icon: "ti-building",
      action: onCreateOrgClick,
    },
    {
      label: "Join workspace",
      sub: "Via invite link",
      icon: "ti-door-enter",
      action: onJoinWorkspaceClick,
    },
    {
      label: "Launch AI lab",
      sub: "Run AI agents",
      icon: "ti-robot",
      action: onLaunchAiLabClick,
    },
    {
      label: "Schedule meeting",
      sub: "Sync with team",
      icon: "ti-calendar-plus",
      action: onScheduleMeetingClick,
    },
    {
      label: "Create automation",
      sub: "Prompt to n8n flow",
      icon: "ti-arrows-split",
      action: onCreateAutomationClick,
    },
    {
      label: "Open recent room",
      sub: "Jump back in",
      icon: "ti-layout-2",
      action: onOpenRecentRoomClick,
    },
    {
      label: "Send invite",
      sub: "Add team members",
      icon: "ti-mail-forward",
      action: onSendInviteClick,
    },
    {
      label: "Open command",
      sub: "Keyboard ⌘K",
      icon: "ti-terminal",
      action: onOpenCommandPaletteClick,
    },
  ];

  return (
    <section className="mb-8 select-none" aria-labelledby="actions-heading">
      <h2 className="sr-only" id="actions-heading">Quick actions</h2>
      <ul className="grid grid-cols-[repeat(auto-fill,minmax(135px,1fr))] gap-2" role="list">
        {actions.map((act) => (
          <li key={act.label}>
            <button 
              className="bg-zinc-950/40 border border-zinc-900 rounded-xl p-4 flex flex-col items-start gap-2.5 hover:border-zinc-800 hover:bg-zinc-900/30 transition-all cursor-pointer text-left w-full group"
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
