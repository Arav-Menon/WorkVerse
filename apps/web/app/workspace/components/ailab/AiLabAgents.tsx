import React from "react";
import type { AIAgent } from "./data";

interface AiLabAgentsProps {
  agents: AIAgent[];
}

const typeIcons: Record<string, string> = {
  chat: "ti-message-chatbot",
  workflow: "ti-arrows-split",
  reviewer: "ti-git-pull-request",
  researcher: "ti-search",
};

const typeColors: Record<string, string> = {
  chat: "text-blue-400 bg-blue-500/10 border-blue-500/20",
  workflow: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  reviewer: "text-purple-400 bg-purple-500/10 border-purple-500/20",
  researcher: "text-amber-400 bg-amber-500/10 border-amber-500/20",
};

export default function AiLabAgents({ agents }: AiLabAgentsProps) {
  return (
    <section>
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-[11px] font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-2">
          <i className="ti ti-robot text-blue-400"></i>
          AI Agents
        </h3>
        <span className="text-[11px] text-zinc-600">{agents.length} agents</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
        {agents.map(agent => (
          <div key={agent.id} className="bg-zinc-950/40 border border-zinc-900 rounded-2xl p-4 flex flex-col gap-3 hover:border-zinc-800 transition-colors group cursor-pointer">
            <div className="flex items-start justify-between">
              <div className={`w-8 h-8 rounded-lg border flex items-center justify-center ${typeColors[agent.type]}`}>
                <i className={`ti ${typeIcons[agent.type]} text-sm`}></i>
              </div>
              <span className={`w-2 h-2 rounded-full shrink-0 mt-1 ${
                agent.status === "running" ? "bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" :
                agent.status === "error" ? "bg-red-500" : "bg-zinc-600"
              }`} />
            </div>

            <div className="flex-grow">
              <p className="text-[13px] font-bold text-zinc-200 group-hover:text-white transition-colors mb-0.5">{agent.name}</p>
              <p className="text-[11px] text-zinc-500 leading-relaxed line-clamp-2">{agent.desc}</p>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-zinc-900/60">
              <span className="text-[10px] text-zinc-600 font-mono">{agent.runCount} runs</span>
              <span className="text-[10px] text-zinc-500">{agent.lastRun}</span>
            </div>
          </div>
        ))}

        {/* Create Agent Card */}
        <div className="bg-transparent border border-dashed border-zinc-800 hover:border-zinc-700 rounded-2xl p-4 flex flex-col items-center justify-center gap-3 min-h-[180px] transition-all cursor-pointer group">
          <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 group-hover:text-zinc-300 transition-colors">
            <i className="ti ti-plus text-sm"></i>
          </div>
          <p className="text-[12px] font-semibold text-zinc-400 group-hover:text-zinc-200 transition-colors">Create Agent</p>
        </div>
      </div>
    </section>
  );
}
