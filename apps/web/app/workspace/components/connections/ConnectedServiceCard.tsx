import React from "react";
import type { ConnectedService } from "./data";

interface ConnectedServiceCardProps {
  service: ConnectedService;
  isExpanded: boolean;
  onToggleExpand: () => void;
}

export default function ConnectedServiceCard({ service, isExpanded, onToggleExpand }: ConnectedServiceCardProps) {
  return (
    <div className="bg-zinc-950/40 border border-zinc-900 rounded-2xl overflow-hidden hover:border-zinc-800 transition-colors">
      {/* Card Header */}
      <div className="p-5 flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex items-center gap-3 flex-grow min-w-0">
          <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0">
            <i className={`ti ${service.icon} text-zinc-200 text-xl`}></i>
          </div>

          <div className="flex-grow min-w-0">
            <div className="flex items-center gap-2.5 mb-1">
              <p className="text-[14px] font-bold text-zinc-100">{service.name}</p>
              <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border ${
                service.health === "healthy"
                  ? "bg-emerald-500/10 border-emerald-500/25 text-emerald-400"
                  : "bg-amber-500/10 border-amber-500/25 text-amber-400"
              }`}>
                {service.health === "healthy" ? "Active" : "Attention"}
              </span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-[12px] text-zinc-500">
              <span className="truncate">{service.account}</span>
              <span className="shrink-0">· Synced {service.synced}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button className="p-2 rounded-lg border border-zinc-800 hover:bg-zinc-900 hover:text-white text-zinc-500 transition-colors">
            <i className="ti ti-refresh text-[14px]"></i>
          </button>
          <button
            onClick={onToggleExpand}
            className="px-3 py-1.5 rounded-lg border border-zinc-800 hover:bg-zinc-900 hover:text-white text-zinc-400 text-[12px] font-medium transition-colors flex items-center gap-1.5"
          >
            Details
            <i className={`ti ${isExpanded ? "ti-chevron-up" : "ti-chevron-down"} text-[11px]`}></i>
          </button>
          <button className="px-3 py-1.5 rounded-lg border border-red-900/40 hover:bg-red-950/30 hover:border-red-800 hover:text-red-400 text-zinc-500 text-[12px] font-medium transition-colors">
            Disconnect
          </button>
        </div>
      </div>

      {/* Usage Stats */}
      <div className="px-5 pb-4 flex flex-wrap items-center gap-2 sm:gap-3">
        <span className="flex items-center gap-1.5 text-[10px] text-zinc-500 bg-zinc-900/60 border border-zinc-800 rounded-full px-2.5 py-1">
          <i className="ti ti-api text-zinc-500 text-[10px]"></i>
          {service.usage.apiCalls} calls
        </span>
        <span className="flex items-center gap-1.5 text-[10px] text-zinc-500 bg-zinc-900/60 border border-zinc-800 rounded-full px-2.5 py-1">
          <i className="ti ti-robot text-blue-400/60 text-[10px]"></i>
          {service.usage.lastAction}
        </span>
        <span className="flex items-center gap-1.5 text-[10px] text-zinc-500 bg-zinc-900/60 border border-zinc-800 rounded-full px-2.5 py-1">
          <i className="ti ti-database text-zinc-500 text-[10px]"></i>
          {service.usage.dataSynced}
        </span>
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="border-t border-zinc-900 px-5 pb-5 pt-4 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 mb-3">Permissions Granted</h4>
            <ul className="space-y-2">
              {service.permissions.map(p => (
                <li key={p} className="flex items-center gap-2 text-[12px] text-zinc-400">
                  <i className="ti ti-check text-emerald-500 text-[12px] shrink-0"></i>
                  {p}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 mb-3">AI Can Access</h4>
            <ul className="space-y-2">
              {service.aiAccess.map(a => (
                <li key={a} className="flex items-center gap-2 text-[12px] text-zinc-400">
                  <i className="ti ti-robot text-blue-400 text-[12px] shrink-0"></i>
                  {a}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
