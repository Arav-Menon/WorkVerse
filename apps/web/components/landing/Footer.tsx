"use client";

import Link from "next/link";
import React from "react";

export default function Footer() {
  const GitHubIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22"></path></svg>
  );

  const DiscordIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="12" r="1"></circle><circle cx="15" cy="12" r="1"></circle><path d="M21 11.5a8.38 8.38 0 00-.9-3.2 8.38 8.38 0 00-3-3 8.38 8.38 0 00-4.5-1.3 8.38 8.38 0 00-4.5 1.3 8.38 8.38 0 00-3 3 8.38 8.38 0 00-.9 3.2 8.38 8.38 0 001.3 4.5 8.38 8.38 0 003 3 8.38 8.38 0 004.5 1.3 8.38 8.38 0 004.5-1.3 8.38 8.38 0 003-3 8.38 8.38 0 001.3-4.5z"></path></svg>
  );

  const StatusIndicator = () => (
    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/5 border border-emerald-500/10 w-fit">
      <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
      <span className="text-[10px] font-medium text-emerald-500 uppercase tracking-widest">All systems operational</span>
    </div>
  );

  return (
    <footer className="relative pt-20 pb-12 px-10 bg-black overflow-hidden">
      {/* Infrastructure Grid Backdrop */}
      <div className="absolute inset-0 opacity-[0.03] bg-[size:40px_40px] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)]"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 md:gap-8 pb-20">
          
          {/* Brand Section */}
          <div className="md:col-span-4 space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2.5 group cursor-pointer">
                <div className="w-8 h-8 flex items-center justify-center">
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
              <div className="space-y-2">
                <p className="text-zinc-100 text-sm font-medium leading-relaxed">
                  AI-native virtual headquarters for modern teams.
                </p>
                <p className="text-zinc-500 text-sm leading-relaxed max-w-sm">
                  Build, collaborate, automate, and communicate inside one intelligent multiplayer workspace.
                </p>
              </div>
            </div>

            <StatusIndicator />

            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="space-y-1">
                <div className="text-[9px] uppercase tracking-[2px] text-zinc-600 font-bold">Realtime Presence</div>
                <div className="w-12 h-1 bg-white/5 rounded-full overflow-hidden">
                  <div className="w-3/4 h-full bg-white/20"></div>
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-[9px] uppercase tracking-[2px] text-zinc-600 font-bold">AI Agents</div>
                <div className="w-12 h-1 bg-white/5 rounded-full overflow-hidden">
                  <div className="w-1/2 h-full bg-white/20"></div>
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-[9px] uppercase tracking-[2px] text-zinc-600 font-bold">Workflow Automation</div>
                <div className="w-12 h-1 bg-white/5 rounded-full overflow-hidden">
                  <div className="w-full h-full bg-white/20"></div>
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-[9px] uppercase tracking-[2px] text-zinc-600 font-bold">Distributed Infra</div>
                <div className="w-12 h-1 bg-white/5 rounded-full overflow-hidden">
                  <div className="w-2/3 h-full bg-white/20"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Links Columns */}
          <div className="md:col-span-8 grid grid-cols-2 md:grid-cols-3 gap-12">
            <div className="space-y-6">
              <h4 className="text-[11px] uppercase tracking-[3px] text-zinc-500 font-bold">Product</h4>
              <ul className="space-y-3 text-[13px] text-zinc-400">
                <li className="hover:text-white transition-colors cursor-pointer">Virtual Workspace</li>
                <li className="hover:text-white transition-colors cursor-pointer">AI Agents</li>
                <li className="hover:text-white transition-colors cursor-pointer">Automation</li>
                <li className="hover:text-white transition-colors cursor-pointer">Audio & Video</li>
                <li className="hover:text-white transition-colors cursor-pointer">AI Labs</li>
                <li className="hover:text-white transition-colors cursor-pointer">Developer Platform</li>
                <li className="hover:text-white transition-colors cursor-pointer">Workflow Engine</li>
                <li className="hover:text-white transition-colors cursor-pointer">Realtime Collaboration</li>
              </ul>
            </div>

            <div className="space-y-6">
              <h4 className="text-[11px] uppercase tracking-[3px] text-zinc-500 font-bold">Developer</h4>
              <ul className="space-y-3 text-[13px] text-zinc-400">
                <li className="hover:text-white transition-colors cursor-pointer">Documentation</li>
                <li className="hover:text-white transition-colors cursor-pointer">API Reference</li>
                <li className="hover:text-white transition-colors cursor-pointer">MCP Integrations</li>
                <li className="hover:text-white transition-colors cursor-pointer">Open Source</li>
                <li className="hover:text-white transition-colors cursor-pointer">Infrastructure</li>
                <li className="hover:text-white transition-colors cursor-pointer">Webhooks</li>
                <li className="hover:text-white transition-colors cursor-pointer">Status</li>
                <li className="hover:text-white transition-colors cursor-pointer">Changelog</li>
              </ul>
            </div>

            <div className="space-y-6">
              <h4 className="text-[11px] uppercase tracking-[3px] text-zinc-500 font-bold">Company</h4>
              <ul className="space-y-3 text-[13px] text-zinc-400">
                <li className="hover:text-white transition-colors cursor-pointer">About</li>
                <li className="hover:text-white transition-colors cursor-pointer">Blog</li>
                <li className="hover:text-white transition-colors cursor-pointer">Careers</li>
                <li className="hover:text-white transition-colors cursor-pointer">Security</li>
                <li className="hover:text-white transition-colors cursor-pointer">Privacy</li>
                <li className="hover:text-white transition-colors cursor-pointer">Terms</li>
                <li className="hover:text-white transition-colors cursor-pointer">Contact</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Social Section */}
        <div className="flex flex-col md:flex-row justify-between items-center py-12 border-t border-white/5 gap-8">
          <div className="text-sm font-medium text-zinc-300 tracking-tight">
            Follow the future of collaborative work
          </div>
          <div className="flex gap-6 text-zinc-500">
            <Link href={"https://github.com/Arav-menon/workverse"} ><span className="hover:text-white transition-colors cursor-pointer"><GitHubIcon /></span></Link>
            <span className="hover:text-white transition-colors cursor-pointer"><DiscordIcon /></span>
            <span className="hover:text-white transition-colors cursor-pointer">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></svg>
            </span>
            <span className="hover:text-white transition-colors cursor-pointer">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"></path></svg>
            </span>
          </div>
        </div>

        {/* Bottom Line */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/5 gap-4">
          <div className="text-zinc-500 text-[11px] uppercase tracking-[2px] font-medium">
            Built for teams that move faster than software.
          </div>
          <div className="text-zinc-600 text-[10px] tracking-tight">
            The operating system for collaborative intelligence. © 2026 Workverse Inc.
          </div>
        </div>
      </div>
    </footer>
  );
}
