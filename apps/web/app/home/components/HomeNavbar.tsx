"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import NotificationPanel from "../../../components/shared/NotificationPanel";
import { Avatar, AvatarFallback } from "../../../components/ui/avatar";
import { Input } from "../../../components/ui/input";
import { cn } from "../../../lib/utils";

interface HomeNavbarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onMenuClick: () => void;
  currentUser: {
    name: string;
    initials: string;
    role: string;
  };
  profileMenu: { label: string; href: string; icon: string }[];
}

export default function HomeNavbar({
  searchQuery,
  onSearchChange,
  onMenuClick,
  currentUser,
  profileMenu,
}: HomeNavbarProps) {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent | TouchEvent) {
      const target = event.target as Node;

      if (notificationsRef.current && !notificationsRef.current.contains(target)) {
        setNotificationsOpen(false);
      }

      if (profileRef.current && !profileRef.current.contains(target)) {
        setProfileOpen(false);
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
    <header className="sticky top-0 z-[110] flex h-[64px] items-center justify-between border-b border-zinc-900 bg-black/75 px-4 backdrop-blur-xl sm:px-6">
      <div className="flex items-center gap-3">
        <button
          className="flex h-9 w-9 items-center justify-center rounded-full border border-zinc-900 text-zinc-400 transition-colors hover:border-zinc-800 hover:bg-zinc-900 hover:text-white md:hidden"
          onClick={onMenuClick}
          aria-label="Open sidebar"
        >
          <i className="ti ti-menu-2 text-base" aria-hidden="true" />
        </button>

        <Link href="/home" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-950 text-white">
            <i className="ti ti-brand-firebase text-sm" aria-hidden="true" />
          </div>
          <div>
            <p className="text-sm font-semibold tracking-tight text-white">
              Work<span className="text-zinc-500">Verse</span>
            </p>
            <p className="text-[10px] uppercase tracking-[0.22em] text-zinc-600">Home</p>
          </div>
        </Link>
      </div>

      <div className="mx-6 hidden max-w-[420px] flex-1 md:block">
        <div className="relative">
          <i className="ti ti-search pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-xs text-zinc-500" aria-hidden="true" />
          <Input
            value={searchQuery}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search organizations..."
            className="pl-10 pr-16"
            aria-label="Search organizations"
          />
          <kbd className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rounded-md border border-zinc-900 bg-zinc-950 px-1.5 py-0.5 font-mono text-[10px] text-zinc-600">
            /
          </kbd>
        </div>
      </div>

      <nav className="flex items-center gap-2" aria-label="Account controls">
        <div className="relative" ref={notificationsRef}>
          <button
            className={cn(
              "relative flex h-9 w-9 items-center justify-center rounded-full border transition-all",
              notificationsOpen
                ? "border-zinc-700 bg-zinc-900 text-white"
                : "border-transparent text-zinc-400 hover:bg-zinc-900 hover:text-white",
            )}
            onClick={() => setNotificationsOpen((prev) => !prev)}
            aria-label="Open notifications"
            aria-expanded={notificationsOpen}
            aria-haspopup="dialog"
          >
            <i className={`ti ${notificationsOpen ? "ti-bell-filled" : "ti-bell"} text-sm`} aria-hidden="true" />
            {!notificationsOpen && (
              <span className="absolute right-[9px] top-[9px] h-1.5 w-1.5 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.85)]" />
            )}
          </button>

          {notificationsOpen && <NotificationPanel />}
        </div>

        <div className="relative" ref={profileRef}>
          <button
            className="flex items-center gap-2 rounded-full border border-zinc-900 bg-zinc-950/80 p-1 pr-3 text-left transition-colors hover:border-zinc-800 hover:bg-zinc-900"
            onClick={() => setProfileOpen((prev) => !prev)}
            aria-label="Open profile menu"
            aria-expanded={profileOpen}
            aria-haspopup="menu"
          >
            <Avatar className="h-8 w-8 rounded-full border-zinc-800 bg-zinc-900">
              <AvatarFallback className="text-[10px]">{currentUser.initials}</AvatarFallback>
            </Avatar>
            <div className="hidden sm:block">
              <p className="text-xs font-medium text-white">{currentUser.name}</p>
              <p className="text-[10px] text-zinc-500">{currentUser.role}</p>
            </div>
            <i className="ti ti-chevron-down text-[10px] text-zinc-500" aria-hidden="true" />
          </button>

          {profileOpen && (
            <div className="absolute right-0 top-[calc(100%+8px)] z-[220] min-w-[220px] rounded-2xl border border-zinc-800 bg-[#0a0a0b]/95 p-2 shadow-[0_18px_40px_rgba(0,0,0,0.55)] backdrop-blur-xl">
              <div className="mb-2 rounded-xl border border-zinc-900 bg-zinc-950/70 p-3">
                <p className="text-sm font-semibold text-white">{currentUser.name}</p>
                <p className="mt-1 text-xs text-zinc-500">{currentUser.role}</p>
              </div>

              <div className="space-y-1" role="menu">
                {profileMenu.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-zinc-300 transition-colors hover:bg-zinc-900 hover:text-white"
                    role="menuitem"
                    onClick={() => setProfileOpen(false)}
                  >
                    <i className={`ti ${item.icon} text-sm`} aria-hidden="true" />
                    <span>{item.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
