"use client";

import Link from "next/link";
import React from "react";
import { useRouter } from "next/navigation";

export default function Navbar() {

  const router = useRouter();

  return (
    <div className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4 md:px-6">
      <nav className="flex items-center gap-4 md:gap-8 px-4 md:px-6 py-2 md:py-2.5 rounded-full border border-white/10 bg-black/40 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative group w-full max-w-fit justify-between">
        {/* Soft border glow */}
        <div className="absolute inset-0 rounded-full border border-white/5 pointer-events-none group-hover:border-white/20 transition-colors duration-500"></div>

        <div className="flex items-center gap-2.5 group/logo cursor-pointer">
          <div className="w-8 h-8 flex items-center justify-center group-hover/logo:scale-110 transition-transform">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2 2H9V9H2V2Z" fill="white" />
              <path d="M15 15H22V22H15V15Z" fill="white" />
              <path d="M11 2H22V13L11 2Z" fill="white" />
              <path d="M2 11V22H13L2 11Z" fill="white" />
            </svg>
          </div>
           <div className="text-xl font-bold tracking-tighter text-white">
          Work<span className="text-zinc-500">Verse</span>
        </div>
        </div>

        {/* CENTER: Links */}
        <div className="hidden lg:flex items-center gap-1">
          {["Platform", "Workspace", "Agents", "Automation", "Labs", "Devs", "Pricing"].map((link) => (
            <a
              key={link}
              href={`/${link.toLowerCase()}`}
              className="text-[11px] uppercase tracking-widest px-4 py-1.5 rounded-full text-zinc-400 hover:text-white hover:bg-white/5 transition-all cursor-pointer font-medium"
            >
              {link}
            </a>
          ))}
        </div>

        {/* RIGHT: Actions */}
        <div className="flex items-center gap-2 md:gap-4 shrink-0">
          <div className="hidden sm:flex items-center gap-4 border-l border-white/10 pl-4 ml-2">
             <span onClick={() => router.push('/auth')} className="text-[11px] uppercase tracking-widest text-zinc-300 hover:text-white transition-colors cursor-pointer font-bold">Sign In</span>
          </div>
          
          <button onClick={() => router.push("/auth")} className="relative group/cta px-4 md:px-5 py-2 rounded-full bg-white text-black text-[9px] md:text-[11px] uppercase tracking-widest font-bold hover:bg-zinc-200 transition-all cursor-pointer overflow-hidden shadow-[0_0_20px_rgba(255,255,255,0.1)] whitespace-nowrap">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent translate-x-[-100%] group-hover/cta:translate-x-[100%] transition-transform duration-700"></div>
            Launch Workspace
          </button>
        </div>
      </nav>
    </div>
  );
}
  