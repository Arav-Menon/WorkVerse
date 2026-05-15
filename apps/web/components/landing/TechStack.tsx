"use client";

import React from "react";

// Modern infrastructure-inspired icons
const PresenceIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><polyline points="17 11 19 13 23 9"></polyline></svg>
);
const AutomationIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v4"></path><path d="M12 18v4"></path><path d="M4.93 4.93l2.83 2.83"></path><path d="M16.24 16.24l2.83 2.83"></path><path d="M2 12h4"></path><path d="M18 12h4"></path><path d="M4.93 19.07l2.83-2.83"></path><path d="M16.24 7.76l2.83-2.83"></path></svg>
);
const InfraIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect><rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect><line x1="6" y1="6" x2="6.01" y2="6"></line><line x1="6" y1="18" x2="6.01" y2="18"></line></svg>
);
const AVIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 7l-7 5 7 5V7z"></path><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>
);
const MemoryIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
);
const ExecutionIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
);
const DevIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>
);
const LabIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 22h20"></path><path d="M7 22V7a2 2 0 012-2h6a2 2 0 012 2v15"></path></svg>
);

export default function TechStack() {
  const capabilities = [
    {
      icon: <PresenceIcon />,
      title: "Realtime Presence",
      description: "See teammates move, collaborate, and communicate live across shared virtual workspaces."
    },
    {
      icon: <AutomationIcon />,
      title: "AI Workflow Automation",
      description: "Autonomous agents execute workflows, automate operations, and coordinate repetitive tasks."
    },
    {
      icon: <InfraIcon />,
      title: "Multiplayer Infrastructure",
      description: "Distributed realtime architecture designed for synchronized collaboration at low latency."
    },
    {
      icon: <AVIcon />,
      title: "Audio & Video Collaboration",
      description: "Persistent rooms and realtime communication designed for immersive teamwork."
    },
    {
      icon: <MemoryIcon />,
      title: "Intelligent Memory",
      description: "Shared organizational context, AI memory, and persistent workflow history across teams."
    },
    {
      icon: <ExecutionIcon />,
      title: "Event-Driven Execution",
      description: "Automation pipelines react instantly to user actions, workspace activity, and system events."
    },
    {
      icon: <DevIcon />,
      title: "Developer Platform",
      description: "Extensible APIs, MCP integrations, SDKs, and infrastructure tooling for advanced workflows."
    },
    {
      icon: <LabIcon />,
      title: "AI Labs",
      description: "Experiment with prompts, agents, models, and automation inside collaborative AI environments."
    }
  ];

  return (
    <section id="infrastructure" className="py-24 px-6 max-w-7xl mx-auto relative">
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-[2px] text-zinc-400 mb-6">
          <div className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse"></div>
          System Capabilities
        </div>
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-6 max-w-3xl mx-auto leading-[1.1]">
          Infrastructure for intelligent collaboration
        </h2>
        <p className="text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed">
          Workverse combines realtime collaboration, AI orchestration, multiplayer infrastructure, and distributed execution into one intelligent operating system for modern teams.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {capabilities.map((cap, idx) => (
          <div
            key={idx}
            className="group relative bg-white/[0.03] backdrop-blur-md border border-white/5 p-8 rounded-3xl hover:bg-white/[0.06] transition-all hover:border-white/10 overflow-hidden"
          >
            {/* Top border glow */}
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            
            <div className="text-white mb-6 group-hover:scale-110 transition-transform origin-left opacity-80 group-hover:opacity-100">
              {cap.icon}
            </div>
            <h3 className="text-sm font-bold text-white mb-3 tracking-tight">
              {cap.title}
            </h3>
            <p className="text-xs leading-relaxed text-zinc-400 group-hover:text-zinc-300 transition-colors">
              {cap.description}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-16 pt-8 border-t border-white/5 text-center">
        <p className="text-[11px] uppercase tracking-[2px] font-medium text-zinc-600">
          Powered by distributed systems, realtime communication architecture, and AI orchestration infrastructure.
        </p>
      </div>
    </section>
  );
}
