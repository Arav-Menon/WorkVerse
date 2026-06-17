import React from "react";

export default function ConnectionsQuickActions() {
  return (
    <div className="flex items-center gap-2 mb-6">
      <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-zinc-800 bg-zinc-950/50 text-[12px] font-medium text-zinc-400 hover:bg-zinc-900 hover:text-white transition-colors">
        <i className="ti ti-refresh text-[13px]"></i>
        Sync All
      </button>
      <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-zinc-800 bg-zinc-950/50 text-[12px] font-medium text-zinc-400 hover:bg-zinc-900 hover:text-white transition-colors">
        <i className="ti ti-download text-[13px]"></i>
        Export
      </button>
      <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-zinc-800 bg-zinc-950/50 text-[12px] font-medium text-zinc-400 hover:bg-zinc-900 hover:text-white transition-colors">
        <i className="ti ti-heartbeat text-[13px]"></i>
        Health Check
      </button>
    </div>
  );
}
