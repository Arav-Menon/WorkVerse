"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";

interface Notification {
  id: string;
  icon: string;
  title: string;
  desc: string;
  time: string;
  type: "sync" | "agent" | "workflow" | "error" | "system";
  read: boolean;
}

const initialNotifications: Notification[] = [
  { id: "n1", icon: "ti-brand-github", title: "GitHub repos synced", desc: "3 repositories updated with latest changes", time: "2m ago", type: "sync", read: false },
  { id: "n2", icon: "ti-git-pull-request", title: "PR #142 reviewed", desc: "Code Reviewer completed analysis, 3 suggestions posted", time: "3m ago", type: "agent", read: false },
  { id: "n3", icon: "ti-arrows-split", title: "PR Auto-Review triggered", desc: "Workflow started on PR #142 in workVerse/backend", time: "3m ago", type: "workflow", read: false },
  { id: "n4", icon: "ti-alert-triangle", title: "Notion token expired", desc: "Reconnect to restore AI access and document sync", time: "1h ago", type: "error", read: false },
  { id: "n5", icon: "ti-brand-slack", title: "Slack channels updated", desc: "12 new messages across 3 channels", time: "1h ago", type: "sync", read: true },
  { id: "n6", icon: "ti-message-chatbot", title: "Standup summary posted", desc: "Posted daily update to #engineering with 8 entries", time: "6h ago", type: "agent", read: true },
  { id: "n7", icon: "ti-settings", title: "Platform update deployed", desc: "WorkVerse v2.4.1 deployed with performance improvements", time: "8h ago", type: "system", read: true },
  { id: "n8", icon: "ti-calendar-event", title: "Meeting scheduled", desc: "Sprint Retro created for Friday 3PM with 6 attendees", time: "1d ago", type: "workflow", read: true },
  { id: "n9", icon: "ti-robot", title: "Issue Triager labeled 23 issues", desc: "Auto-labeled across 3 repos with priority tags", time: "2d ago", type: "agent", read: true },
  { id: "n10", icon: "ti-alert-circle", title: "Rate limit hit on Jira API", desc: "Issue Triager paused. Retry in 30 minutes.", time: "3d ago", type: "error", read: true },
];

const typeStyles: Record<string, string> = {
  sync: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  agent: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  workflow: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  error: "bg-red-500/10 text-red-400 border-red-500/20",
  system: "bg-zinc-900 text-zinc-400 border-zinc-800",
};

interface OrgNavbarProps {
  orgName: string;
  onSearchClick: () => void;
  onMenuClick: () => void;
}

export default function OrgNavbar({
  orgName,
  onSearchClick,
  onMenuClick,
}: OrgNavbarProps) {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState(initialNotifications);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setNotificationsOpen(false);
      }
    };
    if (notificationsOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [notificationsOpen]);

  return (
    <header className="h-[56px] min-h-[56px] border-b border-zinc-900 bg-black/80 backdrop-blur-md sticky top-0 z-[200] flex items-center justify-between px-4 select-none">
      {/* Left side: Hamburger + dynamic breadcrumbs */}
      <div className="flex items-center gap-3">
        <button
          className="md:hidden flex items-center justify-center w-8 h-8 rounded-lg hover:bg-zinc-900 text-zinc-400 hover:text-white transition-colors cursor-pointer"
          onClick={onMenuClick}
          aria-label="Open mobile menu drawer"
        >
          <i className="ti ti-menu text-lg"></i>
        </button>

        {/* Brand Link */}
        <Link href="/home" className="flex items-center gap-2 group cursor-pointer mr-2">
          <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2 2H9V9H2V2Z" fill="white" />
              <path d="M15 15H22V22H15V15Z" fill="white" />
              <path d="M11 2H22V13L11 2Z" fill="white" />
              <path d="M2 11V22H13L2 11Z" fill="white" />
            </svg>
          </div>
          <div className="text-sm font-semibold tracking-tighter text-white">
            Work<span className="text-zinc-500">Verse</span>
          </div>
        </Link>

        {/* Breadcrumb splitter */}
        <span className="text-zinc-700 text-xs select-none">/</span>

        {/* Dynamic Workspace name */}
        <span className="text-xs font-semibold text-zinc-300 truncate max-w-[120px] sm:max-w-none">{orgName}</span>
      </div>

      {/* Center: Command search trigger */}
      <div className="flex-1 max-w-[340px] mx-4 hidden md:block">
        <button
          className="w-full flex items-center gap-2.5 bg-zinc-950/80 border border-zinc-900 hover:border-zinc-800 rounded-lg px-3 py-1.5 text-left text-zinc-600 hover:text-zinc-400 transition-all cursor-pointer group"
          onClick={onSearchClick}
        >
          <i className="ti ti-search text-xs"></i>
          <span className="text-xs flex-grow">Search workspaces...</span>
          <kbd className="font-mono text-[9px] bg-zinc-900 border border-zinc-800 px-1.5 py-0.5 rounded text-zinc-600 group-hover:text-zinc-400 transition-colors">⌘K</kbd>
        </button>
      </div>

      {/* Right side: Telemetry badge + profile controls */}
      <div className="flex items-center gap-3 relative">

        {/* Notification bell */}
        <button
          className="relative w-8 h-8 rounded-lg hover:bg-zinc-900 text-zinc-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          onClick={() => setNotificationsOpen(!notificationsOpen)}
          aria-label="Notifications"
        >
          <i className="ti ti-bell text-base"></i>
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 flex items-center justify-center rounded-full bg-red-500 border border-black text-[9px] font-bold text-white px-1">
              {unreadCount}
            </span>
          )}
        </button>

        {/* Notification dropdown */}
        {notificationsOpen && (
          <div
            ref={dropdownRef}
            className="absolute top-full right-0 mt-2 w-[380px] max-h-[480px] bg-zinc-950/95 backdrop-blur-md border border-zinc-900 rounded-2xl shadow-2xl overflow-hidden z-[300]"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-900">
              <h3 className="text-sm font-semibold text-white">Notifications</h3>
              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  className="text-[11px] font-medium text-zinc-500 hover:text-zinc-300 transition-colors"
                >
                  Mark all read
                </button>
              )}
            </div>

            {/* Notification list */}
            <div className="overflow-y-auto max-h-[360px]">
              {notifications.map((notif, i) => (
                <div
                  key={notif.id}
                  className={`flex items-start gap-3 px-5 py-3.5 hover:bg-zinc-900/40 transition-colors cursor-pointer border-b border-zinc-900/50 ${
                    !notif.read ? "bg-zinc-900/20" : ""
                  }`}
                >
                  {/* Icon */}
                  <div className={`shrink-0 w-8 h-8 rounded-lg border flex items-center justify-center mt-0.5 ${typeStyles[notif.type]}`}>
                    <i className={`ti ${notif.icon} text-sm`}></i>
                  </div>

                  {/* Content */}
                  <div className="flex-grow min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className={`text-[12px] font-semibold truncate ${!notif.read ? "text-zinc-100" : "text-zinc-300"}`}>
                        {notif.title}
                      </p>
                      {!notif.read && (
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                      )}
                    </div>
                    <p className="text-[11px] text-zinc-500 truncate">{notif.desc}</p>
                    <p className="text-[10px] text-zinc-600 mt-1">{notif.time}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="border-t border-zinc-900 px-5 py-3">
              <button className="w-full text-center text-[12px] font-medium text-zinc-500 hover:text-zinc-300 transition-colors">
                View all notifications
              </button>
            </div>
          </div>
        )}

        {/* Quick settings gear */}
        <button className="w-8 h-8 rounded-lg hover:bg-zinc-900 text-zinc-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer" aria-label="Workspace Settings">
          <i className="ti ti-settings text-base"></i>
        </button>

        {/* Profile indicator */}
        <div className="w-7 h-7 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-[10px] font-bold text-zinc-400 select-none cursor-pointer">
          AK
        </div>
      </div>
    </header>
  );
}
