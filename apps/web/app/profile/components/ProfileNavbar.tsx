"use client";

import React from "react";
import Link from "next/link";

export default function ProfileNavbar() {
  return (
    <header className="h-[56px] min-h-[56px] border-b border-zinc-900 bg-black/80 backdrop-blur-md sticky top-0 z-[200] flex items-center justify-between px-4 sm:px-8 select-none">
      <div className="flex items-center gap-3">
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
        <span className="text-zinc-700 text-xs select-none">/</span>
        <Link href="/home" className="text-xs font-medium text-zinc-500 hover:text-white transition-colors">
          Home
        </Link>
        <span className="text-zinc-700 text-xs select-none">/</span>
        <span className="text-xs font-semibold text-white">Profile</span>
      </div>
      <nav className="flex items-center gap-2">
        <button className="relative w-8 h-8 flex items-center justify-center rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors cursor-pointer" aria-label="Notifications">
          <i className="ti ti-bell text-base"></i>
          <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-zinc-300 rounded-full border border-black"></span>
        </button>
        <button className="w-8 h-8 flex items-center justify-center rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors cursor-pointer" aria-label="Command palette">
          <i className="ti ti-terminal text-base"></i>
        </button>
        <button className="w-8 h-8 flex items-center justify-center rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors cursor-pointer" aria-label="Settings">
          <i className="ti ti-settings text-base"></i>
        </button>
      </nav>
    </header>
  );
}
