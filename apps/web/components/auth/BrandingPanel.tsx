import React from "react";
import { Icons } from "./AuthIcons";
import Link from "next/link";

export const BrandingPanel = () => {
  return (
    <div className="relative z-10 hidden md:flex w-full md:w-[42%] lg:w-[38%] flex-col justify-between p-8 md:p-12 lg:p-16 bg-zinc-950/20 backdrop-blur-sm border-b md:border-b-0 md:border-r border-zinc-800/50">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-16 md:gap-8 pb-20">
        {/* Brand Section */}
        <Link href="/" className="md:col-span-4 space-y-8">
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
          </div>
        </Link>
      </div>

        <div className="space-y-10 py-12 md:py-0">
        <div className="space-y-5">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-medium text-white leading-[1.15] tracking-tight">
            Your office that<br />
            <span className="text-zinc-500 italic font-serif">actually does</span><br />
            the work
          </h1>
          <p className="text-sm text-zinc-500 leading-relaxed max-w-sm">
            One prompt. End-to-end execution. No complex tools to manage. Focus on what matters.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-6">
          {[
            { icon: Icons.Cpu, title: "AI ops engine", desc: "Understands intent, builds workflows" },
            { icon: Icons.Building2, title: "Virtual office", desc: "Real-time presence with teammates" },
            { icon: Icons.Brain, title: "Memory layer", desc: "Remembers past work and workflows" },
            { icon: Icons.PlugZap, title: "Tool execution", desc: "Connects to email, GitHub, Slack" },
          ].map((feat, i) => (
            <div key={i} className="flex items-start gap-4 group">
              <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0 text-zinc-600 group-hover:text-zinc-200 group-hover:border-zinc-700 transition-all">
                <div className="w-4 h-4">
                  <feat.icon />
                </div>
              </div>
              <div className="pt-0.5">
                <p className="text-[13px] font-semibold text-zinc-300">{feat.title}</p>
                <p className="text-[11px] text-zinc-500 leading-relaxed mt-0.5 group-hover:text-zinc-400 transition-colors">{feat.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 pt-10 md:pt-0">
        <div className="flex -space-x-2.5">
          {[
            { bg: "bg-zinc-200", text: "text-black", label: "AK" },
            { bg: "bg-zinc-400", text: "text-black", label: "SR" },
            { bg: "bg-zinc-600", text: "text-white", label: "MP" },
            { bg: "bg-zinc-700", text: "text-white", label: "JL" },
            { bg: "bg-zinc-800", text: "text-white", label: "NR" },
          ].map((av, i) => (
            <div key={i} className={`w-8 h-8 rounded-full border-2 border-black ${av.bg} ${av.text} flex items-center justify-center text-[9px] font-bold shadow-lg`}>
              {av.label}
            </div>
          ))}
        </div>
        <p className="text-[10px] text-zinc-500 leading-normal">
          <span className="text-zinc-300 font-semibold tracking-wider">2,400+ FOUNDERS</span> ARE ALREADY INSIDE<br />
          THEIR WORKVERSE OFFICE TODAY.
        </p>
      </div>
    </div>
  );
};
