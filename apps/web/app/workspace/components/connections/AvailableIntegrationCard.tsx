import React from "react";
import type { AvailableIntegration } from "./data";

interface AvailableIntegrationCardProps {
  integration: AvailableIntegration;
}

export default function AvailableIntegrationCard({ integration }: AvailableIntegrationCardProps) {
  return (
    <div className="bg-zinc-950/30 border border-zinc-900/80 rounded-2xl p-5 flex flex-col gap-4 hover:border-zinc-800 hover:bg-zinc-950/60 transition-all group">
      <div className="flex items-start justify-between">
        <div className="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center group-hover:border-zinc-700 transition-colors">
          <i className={`ti ${integration.icon} text-zinc-400 text-lg group-hover:text-zinc-200 transition-colors`}></i>
        </div>
      </div>
      <div>
        <p className="text-[13px] font-bold text-zinc-200 mb-1">{integration.name}</p>
        <p className="text-[12px] text-zinc-500 leading-relaxed">{integration.desc}</p>
      </div>
      <button className="w-full py-2 rounded-lg border border-zinc-800 text-[12px] font-semibold text-zinc-300 hover:bg-white hover:text-black hover:border-white transition-all">
        Connect
      </button>
    </div>
  );
}
