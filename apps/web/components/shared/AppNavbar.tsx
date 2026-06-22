"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import NotificationPanel from "./NotificationPanel";

export interface Notification {
  id: string;
  icon: string;
  title: string;
  desc: string;
  time: string;
  type: "sync" | "agent" | "workflow" | "error" | "system";
  read: boolean;
}

interface AppNavbarProps {
  currentWorkspace: string;
  switcherOpen: boolean;
  setSwitcherOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onWorkspaceChange: (ws: string) => void;
  onSearchClick: () => void;
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  breadcrumb?: string;
}

const defaultNotifications: Notification[] = [
  { id: "n1", icon: "ti-brand-github", title: "GitHub repos synced", desc: "3 repositories updated with latest changes", time: "2m ago", type: "sync", read: false },
  { id: "n2", icon: "ti-git-pull-request", title: "PR #142 reviewed", desc: "Code Reviewer completed analysis, 3 suggestions posted", time: "3m ago", type: "agent", read: false },
  { id: "n3", icon: "ti-arrows-split", title: "PR Auto-Review triggered", desc: "Workflow started on PR #142 in workVerse/backend", time: "3m ago", type: "workflow", read: false },
  { id: "n4", icon: "ti-alert-triangle", title: "Notion token expired", desc: "Reconnect to restore AI access and document sync", time: "1h ago", type: "error", read: false },
  { id: "n5", icon: "ti-brand-slack", title: "Slack channels updated", desc: "12 new messages across 3 channels", time: "1h ago", type: "sync", read: true },
  { id: "n6", icon: "ti-message-chatbot", title: "Standup summary posted", desc: "Posted daily update to #engineering with 8 entries", time: "6h ago", type: "agent", read: true },
  { id: "n7", icon: "ti-settings", title: "Platform update deployed", desc: "WorkVerse v2.4.1 deployed with performance improvements", time: "8h ago", type: "system", read: true },
  { id: "n8", icon: "ti-calendar-event", title: "Meeting scheduled", desc: "Sprint Retro created for Friday 3PM with 6 attendees", time: "1d ago", type: "workflow", read: true },
];

const typeStyles: Record<string, string> = {
  sync: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  agent: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  workflow: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  error: "bg-red-500/10 text-red-400 border-red-500/20",
  system: "bg-zinc-900 text-zinc-400 border-zinc-800",
};

export default function AppNavbar({
  currentWorkspace,
  switcherOpen,
  setSwitcherOpen,
  onWorkspaceChange,
  onSearchClick,
  setSidebarOpen,
  breadcrumb,
}: AppNavbarProps) {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState(defaultNotifications);
  const notifRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent | TouchEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  return (
    <header
      className="w-full h-[56px] bg-black/80 backdrop-blur-md border-b border-zinc-900 sticky top-0 z-[100] flex items-center justify-between px-4 sm:px-6"
      role="banner"
    >
      {/* Brand & Menu */}
      <div className="flex items-center gap-3">
        <button
          className="flex md:hidden items-center justify-center w-8 h-8 rounded-lg text-zinc-400 hover:bg-zinc-900 hover:text-white transition-all text-lg cursor-pointer"
          onClick={() => setSidebarOpen((prev) => !prev)}
          aria-label="Toggle Navigation Sidebar"
        >
          <i className="ti ti-menu" aria-hidden="true"></i>
        </button>

        <Link href="/" className="flex items-center gap-2 group cursor-pointer">
          <div
            className="w-6 h-6 flex items-center justify-center group-hover:scale-105 transition-transform"
            aria-hidden="true"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M2 2H9V9H2V2Z" fill="white" />
              <path d="M15 15H22V22H15V15Z" fill="white" />
              <path d="M11 2H22V13L11 2Z" fill="white" />
              <path d="M2 11V22H13L2 11Z" fill="white" />
            </svg>
          </div>
          <div className="text-[15px] font-bold tracking-tight text-white select-none">
            Work<span className="text-zinc-500">Verse</span>
          </div>
        </Link>

        {/* Live indicator */}
        <div
          className="hidden min-[480px]:flex items-center gap-1.5 ml-1 select-none"
          aria-label="System live"
        >
          <div
            className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"
            role="presentation"
          ></div>
          <span className="font-mono text-[9px] text-emerald-500/80 tracking-widest uppercase">
            live
          </span>
        </div>

        {/* Breadcrumb (optional) */}
        {breadcrumb && (
          <>
            <span className="text-zinc-700 text-xs select-none">/</span>
            <span className="text-xs font-semibold text-zinc-300 truncate max-w-[120px] sm:max-w-none">
              {breadcrumb}
            </span>
          </>
        )}
      </div>

      {/* Search Input bar */}
      <div className="flex-1 max-w-[320px] hidden sm:block" role="search">
        <button
          className="flex items-center gap-2 bg-zinc-900/40 border border-zinc-900 hover:border-zinc-800 rounded-full p-1.5 px-3.5 w-full text-left transition-colors cursor-pointer"
          onClick={onSearchClick}
          aria-label="Open command palette (⌘K)"
        >
          <i
            className="ti ti-search text-xs text-zinc-500"
            aria-hidden="true"
          ></i>
          <span className="text-xs text-zinc-500 flex-1 select-none">
            Search workspaces...
          </span>
          <kbd className="font-mono text-[9px] text-zinc-600 bg-zinc-950 px-1.5 py-0.5 rounded border border-zinc-900 select-none">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Profile controls */}
      <nav className="flex items-center gap-1.5" aria-label="Account controls">
        {/* Notification bell */}
        <div className="relative flex items-center" ref={notifRef}>
          <button
            className={`relative flex h-9 w-9 items-center justify-center rounded-lg border transition-all cursor-pointer ${
              notificationsOpen
                ? "border-zinc-700 bg-zinc-900 text-white shadow-[0_0_0_1px_rgba(255,255,255,0.04),0_10px_24px_rgba(0,0,0,0.35)]"
                : "border-transparent text-zinc-400 hover:bg-zinc-900 hover:text-white"
            }`}
            aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ""}`}
            aria-expanded={notificationsOpen}
            aria-haspopup="dialog"
            onClick={() => setNotificationsOpen((prev) => !prev)}
          >
            <i
              className={`ti ${notificationsOpen ? "ti-bell-filled" : "ti-bell"} text-sm`}
              aria-hidden="true"
            ></i>
            {unreadCount > 0 && !notificationsOpen && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 flex items-center justify-center rounded-full bg-red-500 border border-black text-[9px] font-bold text-white px-1">
                {unreadCount}
              </span>
            )}
          </button>

          {notificationsOpen && (
            <NotificationPanel
              notifications={notifications}
              onMarkAllRead={markAllRead}
            />
          )}
        </div>

        {/* Settings */}
        <button
          className="w-8 h-8 flex items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-900 hover:text-white transition-all cursor-pointer"
          aria-label="Settings"
        >
          <i className="ti ti-settings text-sm" aria-hidden="true"></i>
        </button>

        {/* Profile */}
        <Link
          href="/profile"
          className="w-7 h-7 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-[10px] font-bold text-zinc-400 select-none cursor-pointer hover:bg-zinc-800 transition-colors"
          aria-label="Arav Kumar — profile menu"
        >
          AK
        </Link>

        {/* Workspace Switcher */}
        {!breadcrumb && (
          <div className="relative">
            <button
              className="flex items-center gap-1.5 p-1 px-2.5 rounded-full bg-zinc-900/60 border border-zinc-900 hover:border-zinc-800 text-zinc-300 text-xs transition-all ml-1 cursor-pointer"
              onClick={() => setSwitcherOpen((prev) => !prev)}
              aria-label={`Switch workspace — currently ${currentWorkspace}`}
            >
              <span className="select-none">{currentWorkspace}</span>
              <i
                className="ti ti-chevron-down text-[9px] text-zinc-500"
                aria-hidden="true"
              ></i>
            </button>

            {switcherOpen && (
              <div className="absolute top-[calc(100%+6px)] right-0 bg-[#0a0a0a] border border-zinc-800 rounded-xl p-1.5 min-w-[160px] shadow-[0_10px_30px_rgba(0,0,0,0.8)] z-[200] flex flex-col gap-0.5 animate-in fade-in duration-150">
                {["Personal", "ClevenStudios", "NexaLabs", "SkyForge"].map(
                  (ws) => (
                    <button
                      key={ws}
                      className={`flex items-center gap-2 p-1.5 px-2.5 rounded-lg text-xs text-zinc-400 w-full text-left hover:bg-zinc-900 hover:text-white transition-colors cursor-pointer ${
                        currentWorkspace === ws
                          ? "bg-white/5 text-white font-medium"
                          : ""
                      }`}
                      onClick={() => onWorkspaceChange(ws)}
                    >
                      {ws === "Personal" ? (
                        <i className="ti ti-user text-xs" aria-hidden="true"></i>
                      ) : (
                        <span
                          className="w-1.5 h-1.5 rounded-full bg-zinc-600"
                          aria-hidden="true"
                        ></span>
                      )}
                      {ws}
                    </button>
                  )
                )}
              </div>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}
