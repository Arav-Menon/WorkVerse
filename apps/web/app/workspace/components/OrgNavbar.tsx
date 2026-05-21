"use client";

import React from "react";
import Link from "next/link";

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
      <div className="flex items-center gap-3">

        {/* Notification bell */}
        <button className="relative w-8 h-8 rounded-lg hover:bg-zinc-900 text-zinc-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer" aria-label="Notifications">
          <i className="ti ti-bell text-base"></i>
          <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-zinc-400 rounded-full border border-black"></span>
        </button>

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
