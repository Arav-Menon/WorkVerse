import React from "react";

interface AiLabHeaderProps {
  orgName: string;
}

export default function AiLabHeader({ orgName }: AiLabHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-zinc-800 to-zinc-950 border border-zinc-800 flex items-center justify-center shadow-lg">
          <i className="ti ti-robot text-zinc-300 text-lg"></i>
        </div>
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight leading-tight">AI Command Center</h1>
          <p className="text-[13px] text-zinc-500 font-medium">Controlling <span className="text-zinc-300">{orgName}</span> workspace</p>
        </div>
      </div>
    </div>
  );
}
