import React from "react";
import type { Capability } from "./data";

interface AiLabCapabilitiesProps {
  capabilities: Capability[];
}

export default function AiLabCapabilities({ capabilities }: AiLabCapabilitiesProps) {
  return (
    <section>
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-[11px] font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-2">
          <i className="ti ti-puzzle text-purple-400"></i>
          Capabilities
        </h3>
        <span className="text-[11px] text-zinc-600">{capabilities.filter(c => c.connected).length} connected</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {capabilities.map((cap, i) => (
          <div key={i} className={`bg-zinc-950/30 border rounded-2xl p-4 flex items-center gap-3 transition-all cursor-pointer group ${
            cap.connected
              ? "border-zinc-900 hover:border-zinc-800"
              : "border-zinc-900/50 opacity-60 hover:opacity-80"
          }`}>
            <div className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 ${
              cap.connected
                ? "bg-zinc-900 border-zinc-800"
                : "bg-transparent border-zinc-800/50"
            }`}>
              <i className={`ti ${cap.icon} text-base ${cap.connected ? "text-zinc-300" : "text-zinc-600"}`}></i>
            </div>

            <div className="flex-grow min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <p className={`text-[12px] font-bold truncate ${cap.connected ? "text-zinc-200" : "text-zinc-500"}`}>{cap.name}</p>
                {cap.connected && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />}
              </div>
              <p className="text-[10px] text-zinc-600 truncate">{cap.permission}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
