"use client";

import React from "react";
import type { Notification } from "./AppNavbar";

const typeStyles: Record<string, string> = {
  sync: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  agent: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  workflow: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  error: "bg-red-500/10 text-red-400 border-red-500/20",
  system: "bg-zinc-900 text-zinc-400 border-zinc-800",
};

interface NotificationPanelProps {
  notifications: Notification[];
  onMarkAllRead: () => void;
}

export default function NotificationPanel({
  notifications,
  onMarkAllRead,
}: NotificationPanelProps) {
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div
      className="absolute right-0 top-[calc(100%+10px)] z-[300] flex max-h-[min(78vh,560px)] w-[min(calc(100vw-1rem),420px)] flex-col overflow-hidden rounded-2xl border border-zinc-900 bg-[#0a0a0a] shadow-[0_28px_80px_rgba(0,0,0,0.92)] backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-200 max-sm:right-[-6px] max-sm:max-h-[min(72vh,520px)] max-sm:rounded-[20px]"
      role="dialog"
      aria-label="Notifications"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-900 px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full border border-zinc-800 bg-zinc-900 text-zinc-100">
            <i className="ti ti-bell-filled text-sm"></i>
          </div>
          <div>
            <h3 className="text-[13px] font-semibold text-white">
              Notifications
            </h3>
            <p className="text-[10px] text-zinc-500 uppercase tracking-[0.18em] mt-0.5">
              {unreadCount > 0
                ? `${unreadCount} unread`
                : "All caught up"}
            </p>
          </div>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={onMarkAllRead}
            className="rounded-full border border-zinc-800 bg-zinc-950/70 px-3 py-1.5 text-[11px] font-medium text-zinc-400 transition-colors cursor-pointer hover:border-zinc-700 hover:text-white"
          >
            Mark all read
          </button>
        )}
      </div>

      {/* Notification List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar pb-2">
        {notifications.map((notif) => (
          <div
            key={notif.id}
            className={`flex items-start gap-3 px-5 py-3.5 hover:bg-zinc-900/40 transition-colors cursor-pointer border-b border-zinc-900/50 ${
              !notif.read ? "bg-zinc-900/20" : ""
            }`}
          >
            {/* Icon */}
            <div
              className={`shrink-0 w-8 h-8 rounded-lg border flex items-center justify-center mt-0.5 ${typeStyles[notif.type]}`}
            >
              <i className={`ti ${notif.icon} text-sm`}></i>
            </div>

            {/* Content */}
            <div className="flex-grow min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <p
                  className={`text-[12px] font-semibold truncate ${
                    !notif.read ? "text-zinc-100" : "text-zinc-300"
                  }`}
                >
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
      <div className="border-t border-zinc-900 px-5 py-3 text-center">
        <button className="text-[12px] font-medium text-zinc-500 hover:text-zinc-300 transition-colors">
          View all notifications
        </button>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #27272a;
          border-radius: 4px;
        }
      `,
        }}
      />
    </div>
  );
}
